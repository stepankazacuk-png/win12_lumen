"""Живой браузер «Люмена»: настоящий Chromium на сервере.

Зачем это нужно. Прокси умеет показать простую страницу, но сайты на
JavaScript, поиск и видео через него не работают. Поэтому здесь другое
решение: на сервере запускается настоящий Chromium, он открывает сайт, а в
окно «Люмена» передаётся картинка. Мышь и клавиатура идут обратно в Chromium.
Для сайта это обычный браузер, поэтому работают и поиск, и видео.

Как устроено:

  окно «Люмена»  ──WebSocket──▶  сервер  ──CDP──▶  Chromium
       canvas      кадры JPEG      сеанс    вызовы    настоящий движок

Один сеанс = одна вкладка в окне браузера. Кадры передаются двоичными
сообщениями, управление — текстовыми в формате JSON.

Проверено вживую: YouTube отдаёт ролик 854x480 и играет, поиск Google даёт
30 результатов, видео попадает в кадры (около 20 кадров в секунду).
"""

import base64
import hashlib
import json
import os
import select
import shutil
import socket
import struct
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request

GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

# Подпись обычного Chrome. Без неё Google и YouTube узнают headless-браузер
# и показывают проверку «не робот» или отказывают вовсе.
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36')

# Убирает следы headless и мелочи, которые мешают обычному просмотру:
# всплывающие окна открываются в той же вкладке, ссылки с target=_blank тоже.
FINGERPRINT = """
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en-US', 'en'] });
Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
window.chrome = window.chrome || { runtime: {} };
window.open = function (u) { if (u) location.href = u; return null; };
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[target="_blank"]');
  if (a) a.target = '_self';
}, true);
"""

QUALITY = 58            # качество JPEG
MAX_FPS = 20            # предел частоты кадров
IDLE_KILL = 900         # погасить Chromium, если сеансов нет столько секунд
LAUNCH_TIMEOUT = 30


class WSError(Exception):
    pass


class WSConn:
    """WebSocket со стороны сервера: рукопожатие, чтение, запись.

    Читаем из rfile и пишем в wfile обработчика — так не теряются байты,
    которые буфер обработчика уже прочитал из сокета.
    """

    def __init__(self, handler):
        self.sock = handler.connection
        self.rfile = handler.rfile
        self.wfile = handler.wfile
        self.buf = b''
        self.lock = threading.Lock()
        self.closed = False
        # Забираем то, что буфер обработчика уже успел прочитать: иначе первые
        # сообщения клиента потерялись бы.
        self.sock.setblocking(False)
        try:
            while True:
                chunk = self.rfile.read1(65536)
                if not chunk:
                    break
                self.buf += chunk
        except (BlockingIOError, InterruptedError, OSError):
            pass
        self.sock.setblocking(True)

    @staticmethod
    def accept(handler):
        key = handler.headers.get('Sec-WebSocket-Key')
        if not key:
            return None
        digest = hashlib.sha1((key + GUID).encode()).digest()
        handler.send_response_only(101, 'Switching Protocols')
        handler.send_header('Upgrade', 'websocket')
        handler.send_header('Connection', 'Upgrade')
        handler.send_header('Sec-WebSocket-Accept', base64.b64encode(digest).decode())
        handler.end_headers()
        handler.close_connection = True
        return WSConn(handler)

    def has_data(self, timeout):
        """Есть ли данные от клиента. Ждём не больше timeout секунд.

        Так сеанс успевает снять кадр между сообщениями и при этом не читает
        сокет вслепую: сообщение разбирается целиком, без потери байтов.
        """
        if self.buf:
            return True
        try:
            r, _, _ = select.select([self.sock], [], [], timeout)
        except (OSError, ValueError):
            return False
        return bool(r)

    def _read_exact(self, n):
        out = b''
        while len(out) < n:
            if self.buf:
                take = min(n - len(out), len(self.buf))
                out += self.buf[:take]
                self.buf = self.buf[take:]
                continue
            part = self.sock.recv(65536)
            if not part:
                raise WSError('соединение закрыто')
            self.buf += part
        return out

    def read_message(self):
        """Возвращает (opcode, данные). Управляющие кадры обрабатывает сам."""
        while True:
            b1, b2 = self._read_exact(2)
            op = b1 & 0x0F
            ln = b2 & 0x7F
            if ln == 126:
                ln = struct.unpack('!H', self._read_exact(2))[0]
            elif ln == 127:
                ln = struct.unpack('!Q', self._read_exact(8))[0]
            mask = self._read_exact(4) if (b2 & 0x80) else None
            data = self._read_exact(ln) if ln else b''
            if mask:
                data = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
            if op == 0x8:
                raise WSError('клиент закрыл соединение')
            if op == 0x9:
                self._write(0xA, data)
                continue
            if op == 0xA:
                continue
            if op == 0x0:
                continue
            return op, data

    def _write(self, op, payload):
        if self.closed:
            return
        n = len(payload)
        head = bytes([0x80 | op])
        if n < 126:
            head += struct.pack('!B', n)
        elif n < 65536:
            head += struct.pack('!BH', 126, n)
        else:
            head += struct.pack('!BQ', 127, n)
        with self.lock:
            try:
                self.wfile.write(head + payload)
                self.wfile.flush()
            except Exception:
                self.closed = True
                raise WSError('запись не удалась')

    def send_text(self, text):
        self._write(0x1, text.encode('utf-8'))

    def send_json(self, obj):
        self.send_text(json.dumps(obj, ensure_ascii=False))

    def send_binary(self, data):
        self._write(0x2, data)

    def close(self):
        if self.closed:
            return
        try:
            self._write(0x8, b'')
        except Exception:
            pass
        self.closed = True


class CDP:
    """Связь с Chromium по протоколу CDP.

    Чтение сокета ведёт отдельный поток: ответы отдаются тем, кто ждёт,
    события (кадры, переходы) — обработчикам. Иначе ожидание ответа и
    приём кадров мешали бы друг другу.
    """

    def __init__(self, url, timeout=30):
        u = urllib.parse.urlsplit(url)
        self.sock = socket.create_connection((u.hostname, u.port or 80), timeout=timeout)
        self.sock.settimeout(None)
        path = (u.path or '/') + (('?' + u.query) if u.query else '')
        key = base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall(
            ('GET %s HTTP/1.1\r\nHost: %s:%d\r\nUpgrade: websocket\r\n'
             'Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n'
             'Sec-WebSocket-Version: 13\r\n\r\n'
             % (path, u.hostname, u.port or 80, key)).encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            part = self.sock.recv(4096)
            if not part:
                raise WSError('Chromium не ответил на рукопожатие')
            buf += part
        head, _, self.buf = buf.partition(b'\r\n\r\n')
        if b'101' not in head.split(b'\r\n')[0]:
            raise WSError('Chromium отказал: ' + head.split(b'\r\n')[0].decode('latin1'))
        self._n = 0
        self._pending = {}
        self._lock = threading.Lock()
        self._send_lock = threading.Lock()
        self._handlers = []
        self._alive = True
        self._reader = threading.Thread(target=self._read_loop, daemon=True)
        self._reader.start()

    def _recv_exact(self, n):
        while len(self.buf) < n:
            part = self.sock.recv(65536)
            if not part:
                raise WSError('Chromium закрыл соединение')
            self.buf += part
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def _read_loop(self):
        try:
            while self._alive:
                b1, b2 = self._recv_exact(2)
                op = b1 & 0x0F
                ln = b2 & 0x7F
                if ln == 126:
                    ln = struct.unpack('!H', self._recv_exact(2))[0]
                elif ln == 127:
                    ln = struct.unpack('!Q', self._recv_exact(8))[0]
                mask = self._recv_exact(4) if (b2 & 0x80) else None
                data = self._recv_exact(ln) if ln else b''
                if mask:
                    data = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
                if op == 0x8:
                    break
                if op == 0x9:
                    continue
                if op == 0x1:
                    self._dispatch(json.loads(data.decode('utf-8')))
        except Exception:
            pass
        finally:
            self._alive = False
            for ev, slot in list(self._pending.values()):
                slot['_fail'] = 'связь с Chromium потеряна'
                ev.set()

    def _dispatch(self, msg):
        if 'id' in msg:
            p = self._pending.pop(msg['id'], None)
            if p:
                p[1].update(msg)
                p[0].set()
            return
        for h in list(self._handlers):
            try:
                h(msg)
            except Exception:
                pass

    def on_event(self, fn):
        self._handlers.append(fn)

    def _frame(self, payload):
        n = len(payload)
        head = bytes([0x81])
        if n < 126:
            head += struct.pack('!B', 0x80 | n)
        elif n < 65536:
            head += struct.pack('!BH', 0x80 | 126, n)
        else:
            head += struct.pack('!BQ', 0x80 | 127, n)
        mask = os.urandom(4)
        body = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        # Кадры снимает один поток, а подтверждения кадров и ответы на запросы
        # может писать другой. Без замка кадры склеиваются и связь рвётся.
        with self._send_lock:
            self.sock.sendall(head + mask + body)

    def send(self, method, params=None, session=None):
        """Отправить вызов и не ждать ответа (для подтверждений кадров)."""
        with self._lock:
            self._n += 1
            mid = self._n
        msg = {'id': mid, 'method': method, 'params': params or {}}
        if session:
            msg['sessionId'] = session
        self._frame(json.dumps(msg).encode())
        return mid

    def call(self, method, params=None, session=None, timeout=30):
        with self._lock:
            self._n += 1
            mid = self._n
        ev = threading.Event()
        slot = {}
        self._pending[mid] = (ev, slot)
        msg = {'id': mid, 'method': method, 'params': params or {}}
        if session:
            msg['sessionId'] = session
        try:
            self._frame(json.dumps(msg).encode())
        except Exception:
            self._pending.pop(mid, None)
            raise
        if not ev.wait(timeout):
            self._pending.pop(mid, None)
            raise WSError('Chromium не ответил на %s' % method)
        if '_fail' in slot:
            raise WSError(slot['_fail'])
        if 'error' in slot:
            raise WSError('%s: %s' % (method, slot['error'].get('message')))
        return slot.get('result', {})

    def close(self):
        self._alive = False
        try:
            self.sock.close()
        except Exception:
            pass


def find_chromium():
    for name in ('chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'):
        p = shutil.which(name)
        if p:
            return p
    return None


class Chromium:
    """Один Chromium на весь сервер. Вкладки — отдельные цели (targets)."""

    def __init__(self):
        self.proc = None
        self.cdp = None
        self.port = 9333
        self.lock = threading.Lock()
        self.sessions = 0
        self.last_use = time.time()
        self.path = find_chromium()
        self.error = None
        threading.Thread(target=self._watchdog, daemon=True).start()

    def _watchdog(self):
        while True:
            time.sleep(30)
            if self.proc and self.sessions == 0 and time.time() - self.last_use > IDLE_KILL:
                self.stop()

    def start(self):
        with self.lock:
            if self.cdp and self.proc and self.proc.poll() is None:
                return True
            if not self.path:
                self.error = ('На сервере не найден Chromium. Установите пакет chromium '
                              'или пользуйтесь простым режимом.')
                return False
            profile = '/tmp/lumen-chrome-%d' % self.port
            subprocess.run(['rm', '-rf', profile], check=False)
            args = [
                self.path, '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
                '--hide-scrollbars', '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding', '--disable-features=Translate',
                '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
                '--autoplay-policy=no-user-gesture-required',
                '--no-first-run', '--no-default-browser-check', '--disable-sync',
                '--remote-debugging-port=%d' % self.port,
                '--user-data-dir=' + profile,
                '--window-size=1280,800', '--lang=ru-RU', 'about:blank',
            ]
            try:
                self.proc = subprocess.Popen(args, stdout=subprocess.DEVNULL,
                                             stderr=subprocess.DEVNULL)
            except Exception as e:
                self.error = 'Chromium не запустился: %s' % e
                return False
            deadline = time.time() + LAUNCH_TIMEOUT
            while time.time() < deadline:
                try:
                    with urllib.request.urlopen(
                            'http://127.0.0.1:%d/json/version' % self.port, timeout=2) as r:
                        info = json.load(r)
                    self.cdp = CDP(info['webSocketDebuggerUrl'])
                    self.error = None
                    return True
                except Exception:
                    time.sleep(0.3)
            self.error = 'Chromium не открыл порт отладки за %d с' % LAUNCH_TIMEOUT
            self.stop()
            return False

    def stop(self):
        cdp, self.cdp = self.cdp, None
        if cdp:
            cdp.close()
        if self.proc:
            try:
                self.proc.kill()
                self.proc.wait(timeout=5)
            except Exception:
                pass
            self.proc = None

    def new_tab(self, url='about:blank'):
        r = self.cdp.call('Target.createTarget', {'url': url})
        return r['targetId']

    def close_tab(self, target_id):
        try:
            self.cdp.call('Target.closeTarget', {'targetId': target_id}, timeout=5)
        except Exception:
            pass


CHROME = Chromium()


class Session(threading.Thread):
    """Сеанс: одна вкладка окна браузера «Люмена»."""

    def __init__(self, ws, url):
        threading.Thread.__init__(self, daemon=True)
        self.ws = ws
        self.url = url
        self.cdp = None
        self.sid = None
        self.target = None
        self.alive = True
        self.paused = False
        self.w, self.h = 1100, 700
        self.loading = False
        self.need_sync = False
        self.dialogs = []
        self.last_sync = 0.0

    # ---------- запуск ----------
    def run(self):
        try:
            if not CHROME.start():
                self.ws.send_json({'t': 'error', 'text': CHROME.error or 'Chromium недоступен',
                                   'fallback': True})
                return
            CHROME.sessions += 1
            CHROME.last_use = time.time()
            self.cdp = CHROME.cdp
            self.target = CHROME.new_tab(self.url or 'about:blank')
            r = self.cdp.call('Target.attachToTarget', {'targetId': self.target, 'flatten': True})
            self.sid = r['sessionId']
            self.cdp.on_event(self._on_event)

            for method, params in [
                ('Page.enable', {}),
                ('Runtime.enable', {}),
                ('Network.enable', {}),
                ('Page.setDownloadBehavior', {'behavior': 'deny'}),
                ('Emulation.setDeviceMetricsOverride',
                 {'width': self.w, 'height': self.h, 'deviceScaleFactor': 1, 'mobile': False}),
                ('Network.setUserAgentOverride',
                 {'userAgent': UA, 'acceptLanguage': 'ru-RU,ru;q=0.9,en-US;q=0.8'}),
                ('Page.addScriptToEvaluateOnNewDocument', {'source': FINGERPRINT}),
            ]:
                try:
                    self.cdp.call(method, params, session=self.sid)
                except WSError:
                    pass

            self.ws.send_json({'t': 'ready', 'width': self.w, 'height': self.h})
            self._sync()
            self._main_loop()
        except WSError as e:
            sys.stderr.write('живой браузер: связь прервана (%s)\n' % e)
        except Exception as e:
            sys.stderr.write('живой браузер: сбой сеанса: %r\n' % (e,))
            import traceback
            traceback.print_exc()
            try:
                self.ws.send_json({'t': 'error', 'text': 'Сбой сеанса: %s' % e})
            except Exception:
                pass
        finally:
            self.alive = False
            if self.target:
                CHROME.close_tab(self.target)
            CHROME.sessions = max(0, CHROME.sessions - 1)
            CHROME.last_use = time.time()
            self.ws.close()

    # ---------- кадры ----------
    def _capture(self):
        """Снимает картинку снимком.

        Поток кадров (Page.startScreencast) в headless-сборке отдаёт меньше
        одного кадра в секунду и во время видео замолкает совсем. Снимок
        снимается за 40-60 мс и во время видео приходит с новым содержимым.
        """
        try:
            r = self.cdp.call('Page.captureScreenshot',
                              {'format': 'jpeg', 'quality': QUALITY},
                              session=self.sid, timeout=15)
            return base64.b64decode(r['data'])
        except Exception:
            return None

    def _main_loop(self):
        """Один цикл на всё: снять кадр, отправить, разобрать сообщения клиента.

        Всё в одном потоке намеренно. Когда снимок снимал отдельный поток, он и
        поток чтения сообщений одновременно писали в сокет Chromium: кадры
        склеивались, и связь рвалась. Здесь же вызовы идут по очереди.
        """
        import hashlib
        interval = 1.0 / MAX_FPS
        last = ''
        while self.alive:
            t0 = time.time()

            # 1. Картинка. Отправляем, только если она изменилась.
            if not self.paused:
                data = self._capture()
                if data:
                    digest = hashlib.md5(data).digest()
                    if digest != last:
                        last = digest
                        try:
                            self.ws.send_binary(data)
                        except WSError:
                            break

            # 2. Всплывающие окна страницы: закрываем, иначе она замирает.
            while self.dialogs:
                text = self.dialogs.pop(0)
                try:
                    self.cdp.call('Page.handleJavaScriptDialog',
                                  {'accept': True, 'promptText': ''},
                                  session=self.sid, timeout=5)
                except Exception:
                    pass
                try:
                    self.ws.send_json({'t': 'dialog', 'text': text})
                except WSError:
                    break

            # 3. Состояние: адрес, заголовок, история. Обновляем по событию,
            #    а если событий нет — раз в секунду (на паузе реже).
            now = time.time()
            every = 3.0 if self.paused else 1.0
            if self.need_sync or now - self.last_sync > every:
                self.need_sync = False
                self.last_sync = now
                self._sync()

            # Сколько осталось до следующего кадра — столько и ждём сообщений.
            # На паузе ждём дольше: окно не видно, снимать нечего.
            rest = interval - (time.time() - t0)
            if self.paused:
                rest = max(rest, 0.25)
            if rest < 0:
                rest = 0
            try:
                if not self.ws.has_data(rest):
                    continue
                op, payload = self.ws.read_message()
            except WSError:
                break
            if op != 0x1:
                continue
            try:
                self._message(json.loads(payload.decode('utf-8')))
            except Exception:
                pass

    def _on_event(self, msg):
        """Разбор событий Chromium.

        Важно: этот обработчик вызывается в потоке чтения. Делать здесь вызовы
        к Chromium нельзя — поток ждал бы ответа, который сам же должен
        прочитать, и связь встала бы намертво. Поэтому здесь только пометки,
        а сами вызовы делает главный цикл.
        """
        if msg.get('sessionId') != self.sid:
            return
        m = msg.get('method')
        p = msg.get('params', {})
        if m == 'Page.frameNavigated':
            f = p.get('frame', {})
            if not f.get('parentId'):
                self.need_sync = True
        elif m == 'Page.navigatedWithinDocument':
            self.need_sync = True
        elif m == 'Page.frameStartedLoading':
            self.loading = True
            self.need_sync = True
        elif m in ('Page.frameStoppedLoading', 'Page.loadEventFired'):
            self.loading = False
            self.need_sync = True
        elif m == 'Page.javascriptDialogOpening':
            self.dialogs.append((p.get('message') or '')[:200])
        elif m == 'Inspector.targetCrashed':
            self.need_sync = True

    # ---------- состояние ----------
    def _sync(self):
        try:
            r = self.cdp.call('Runtime.evaluate', {
                'expression': 'JSON.stringify({u: location.href, t: document.title})',
                'returnByValue': True,
            }, session=self.sid, timeout=8)
            info = json.loads(r['result']['value'])
        except Exception:
            info = {'u': self.url, 't': ''}
        try:
            h = self.cdp.call('Page.getNavigationHistory', {}, session=self.sid, timeout=8)
            idx, entries = h.get('currentIndex', 0), h.get('entries', [])
            back = idx > 0
            fwd = idx < len(entries) - 1
        except Exception:
            back = fwd = False
        self.url = info.get('u') or self.url
        try:
            self.ws.send_json({'t': 'state', 'url': self.url, 'title': info.get('t', ''),
                               'loading': self.loading, 'back': back, 'fwd': fwd})
        except WSError:
            self.alive = False

    # ---------- сообщения клиента ----------
    def _message(self, m):
        t = m.get('t')
        if t == 'nav':
            url = (m.get('url') or '').strip()
            if not url:
                return
            if not url.startswith(('http://', 'https://')):
                if '.' in url.split('/')[0] and ' ' not in url.split('/')[0]:
                    url = 'https://' + url
                else:
                    url = 'https://www.google.com/search?q=' + urllib.parse.quote(url)
            self.loading = True
            self._sync()
            try:
                self.cdp.call('Page.navigate', {'url': url}, session=self.sid, timeout=15)
            except WSError as e:
                self.ws.send_json({'t': 'error', 'text': 'Переход не удался: %s' % e})
        elif t == 'back':
            self._history(-1)
        elif t == 'forward':
            self._history(1)
        elif t == 'reload':
            try:
                self.cdp.call('Page.reload', {}, session=self.sid, timeout=10)
            except WSError:
                pass
        elif t == 'stop':
            try:
                self.cdp.call('Page.stopLoading', {}, session=self.sid, timeout=5)
            except WSError:
                pass
        elif t == 'resize':
            self.w = max(320, min(2560, int(m.get('w') or self.w)))
            self.h = max(240, min(1600, int(m.get('h') or self.h)))
            try:
                self.cdp.call('Emulation.setDeviceMetricsOverride',
                              {'width': self.w, 'height': self.h, 'deviceScaleFactor': 1,
                               'mobile': False}, session=self.sid, timeout=8)
            except WSError:
                pass
        elif t == 'pause':
            self.paused = True
        elif t == 'resume':
            self.paused = False
        elif t == 'mouse':
            self._mouse(m)
        elif t == 'key':
            self._key(m)
        elif t == 'insert':
            try:
                self.cdp.call('Input.insertText', {'text': m.get('text') or ''},
                              session=self.sid, timeout=8)
            except WSError:
                pass
        elif t == 'eval':
            try:
                r = self.cdp.call('Runtime.evaluate', {
                    'expression': m.get('code') or '1', 'returnByValue': True},
                    session=self.sid, timeout=8)
                self.ws.send_json({'t': 'eval', 'id': m.get('id'),
                                   'value': r.get('result', {}).get('value')})
            except WSError as e:
                self.ws.send_json({'t': 'eval', 'id': m.get('id'), 'error': str(e)})

    def _history(self, delta):
        try:
            h = self.cdp.call('Page.getNavigationHistory', {}, session=self.sid, timeout=8)
            idx = h.get('currentIndex', 0)
            entries = h.get('entries', [])
            n = idx + delta
            if 0 <= n < len(entries):
                self.cdp.call('Page.navigateToHistoryEntry',
                              {'entryId': entries[n]['id']}, session=self.sid, timeout=8)
        except WSError:
            pass

    def _mouse(self, m):
        kind = m.get('type')
        params = {'type': kind, 'x': m.get('x', 0), 'y': m.get('y', 0)}
        if kind == 'mouseWheel':
            params['deltaX'] = m.get('dx', 0)
            params['deltaY'] = m.get('dy', 0)
        else:
            params['button'] = m.get('button', 'none')
            params['buttons'] = m.get('buttons', 0)
            params['clickCount'] = m.get('clickCount', 1)
        try:
            self.cdp.call('Input.dispatchMouseEvent', params, session=self.sid, timeout=8)
        except WSError:
            pass

    KEYS = {
        'Enter': (13, 'Enter'), 'Backspace': (8, 'Backspace'), 'Tab': (9, 'Tab'),
        'Escape': (27, 'Escape'), 'Delete': (46, 'Delete'), 'Home': (36, 'Home'),
        'End': (35, 'End'), 'PageUp': (33, 'PageUp'), 'PageDown': (34, 'PageDown'),
        'ArrowLeft': (37, 'ArrowLeft'), 'ArrowUp': (38, 'ArrowUp'),
        'ArrowRight': (39, 'ArrowRight'), 'ArrowDown': (40, 'ArrowDown'),
        ' ': (32, 'Space'),
    }

    def _key(self, m):
        kind = m.get('type')
        key = m.get('key') or ''
        code = m.get('code') or key
        mods = int(m.get('modifiers') or 0)
        params = {'type': kind, 'key': key, 'code': code, 'modifiers': mods}
        if key in ('Alt', 'Control', 'Shift', 'Meta'):
            params['windowsVirtualKeyCode'] = {'Alt': 18, 'Control': 17,
                                               'Shift': 16, 'Meta': 91}[key]
            params['nativeVirtualKeyCode'] = params['windowsVirtualKeyCode']
        elif key in self.KEYS:
            vk, cd = self.KEYS[key]
            params['windowsVirtualKeyCode'] = vk
            params['nativeVirtualKeyCode'] = vk
            params['code'] = cd
            if kind == 'keyDown' and key in ('Enter', 'Tab', ' '):
                params['text'] = {'Enter': '\r', 'Tab': '\t', ' ': ' '}[key]
                params['unmodifiedText'] = params['text']
        elif len(key) == 1:
            params['windowsVirtualKeyCode'] = ord(key.upper()) if key.isascii() else 0
            params['nativeVirtualKeyCode'] = params['windowsVirtualKeyCode']
            if kind == 'keyDown':
                params['text'] = key
                params['unmodifiedText'] = key
        else:
            return
        try:
            self.cdp.call('Input.dispatchKeyEvent', params, session=self.sid, timeout=8)
        except WSError:
            pass


def handle(handler):
    """Точка входа из сервера. Возвращает True, если запрос обслужен.

    Сеанс выполняется прямо здесь, в потоке обработчика. Так сокет остаётся
    живым, пока идёт просмотр: сервер закрывает соединение лишь после возврата
    из обработчика.
    """
    if 'websocket' not in (handler.headers.get('Upgrade') or '').lower():
        return False
    handler.socket_handed_over = True
    if not CHROME.start():
        ws = WSConn.accept(handler)
        if ws:
            ws.send_json({'t': 'error', 'text': CHROME.error or 'Chromium недоступен',
                          'fallback': True})
            ws.close()
        return True
    ws = WSConn.accept(handler)
    if not ws:
        return False
    q = urllib.parse.urlsplit(handler.path).query
    url = (urllib.parse.parse_qs(q).get('url') or ['about:blank'])[0]
    Session(ws, url).run()
    return True
