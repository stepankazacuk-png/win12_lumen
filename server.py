#!/usr/bin/env python3
"""
Сервер «Люмена».

Отдаёт файлы проекта и работает прокси для браузера внутри системы.

Зачем прокси. Google, YouTube и многие другие сайты запрещают показ в рамке
(X-Frame-Options, frame-ancestors) — это их защита, обойти её в браузере нельзя.
Прокси решает иначе: сервер сам скачивает страницу, убирает запрещающие
заголовки, подставляет <base> и отдаёт страницу как свою. Для рамки она
становится своей, поэтому показывается.

Запуск: python3 server.py [порт]
"""

import gzip
import html as html_mod
import http.cookiejar
import json
import os
import re
import socket
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
import zlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 12000

# Заголовки, которые мешают показу в рамке или ломают прокси.
STRIP_HEADERS = {
    'x-frame-options', 'content-security-policy', 'content-security-policy-report-only',
    'strict-transport-security', 'cross-origin-opener-policy', 'cross-origin-embedder-policy',
    'cross-origin-resource-policy', 'permissions-policy', 'report-to', 'nel',
    'content-disposition', 'content-length', 'transfer-encoding', 'connection',
    'content-encoding', 'alt-svc', 'public-key-pins', 'expect-ct',
}

# Адреса, куда прокси ходить не должен (защита от доступа к внутренней сети).
BLOCKED_HOSTS = re.compile(
    r'^(localhost|.*\.local|.*\.internal|.*\.localhost|'
    r'127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|'
    r'0\.|\[?::1\]?|metadata\.google\.internal)$', re.I)

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36')

# Вставляется в каждую проксированную страницу. Перехватывает переходы по
# ссылкам и отправку форм, чтобы они снова шли через прокси, а не напрямую.
BOOTSTRAP = """<script>
(function(){
  var P='/__proxy?u=';
  function abs(u){ try { return new URL(u, document.baseURI).href; } catch(e){ return null; } }
  function viaProxy(u){
    if(!u) return false;
    if(/^(mailto:|tel:|javascript:|data:|blob:|#)/i.test(u)) return false;
    var a=abs(u); if(!a) return false;
    if(!/^https?:/i.test(a)) return false;
    location.href = P + encodeURIComponent(a);
    return true;
  }
  document.addEventListener('click', function(e){
    var n=e.target;
    while(n && n.tagName!=='A') n=n.parentNode;
    if(!n || !n.getAttribute) return;
    var h=n.getAttribute('href');
    if(h===null) return;
    if(viaProxy(h)) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('submit', function(e){
    var f=e.target; if(!f || f.tagName!=='FORM') return;
    var action=f.getAttribute('action') || document.baseURI;
    var q=new URLSearchParams(new FormData(f)).toString();
    if(!q) return;
    var a=abs(action); if(!a) return;
    e.preventDefault();
    location.href = P + encodeURIComponent(a + (a.indexOf('?')<0?'?':'&') + q);
  }, true);
  window.addEventListener('error', function(){}, true);
})();
</script>"""


def youtube_embed(url):
    """Ссылка на ролик → адрес плеера. Плеер разрешает показ в рамке, а сам
    youtube.com — нет, поэтому ролик открываем через плеер."""
    if '/embed/' in url:
        return None
    m = (re.search(r'youtu\.be/([\w-]{6,})', url)
         or re.search(r'youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|v/)([\w-]{6,})', url))
    return 'https://www.youtube.com/embed/%s?rel=0' % m.group(1) if m else None


def safe_url(raw):
    """Проверяет адрес и возвращает его же либо None."""
    try:
        p = urllib.parse.urlsplit(raw)
    except Exception:
        return None
    if p.scheme not in ('http', 'https'):
        return None
    host = (p.hostname or '').lower()
    if not host or BLOCKED_HOSTS.match(host):
        return None
    return urllib.parse.urlunsplit(p)


def decode_body(data, enc):
    enc = (enc or '').lower()
    try:
        if 'gzip' in enc:
            return gzip.decompress(data)
        if 'deflate' in enc:
            try:
                return zlib.decompress(data)
            except zlib.error:
                return zlib.decompress(data, -zlib.MAX_WBITS)
    except Exception:
        return data
    return data


def rewrite_html(text, base_url):
    """Готовит чужую страницу к показу внутри системы."""
    # Мета-тег CSP тоже запрещает встраивание — убираем.
    text = re.sub(r'<meta[^>]+http-equiv\s*=\s*["\']?content-security-policy["\']?[^>]*>',
                  '', text, flags=re.I)
    # Подписи целостности ломаются, когда страница идёт через прокси.
    text = re.sub(r'\s+integrity\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)', '', text, flags=re.I)
    text = re.sub(r'\s+crossorigin(\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+))?', '', text, flags=re.I)

    # <base> заставляет относительные адреса указывать на настоящий сайт.
    # Свой <base> у сайта не трогаем — первый в документе главнее.
    inject = ''
    if not re.search(r'<base[\s>]', text, re.I):
        inject += '<base href="%s">' % html_mod.escape(base_url, quote=True)
    inject += ('<meta name="x-proxy-url" content="%s">' % html_mod.escape(base_url, quote=True))
    inject += BOOTSTRAP

    m = re.search(r'<head[^>]*>', text, re.I)
    if m:
        return text[:m.end()] + inject + text[m.end():]
    m = re.search(r'<html[^>]*>', text, re.I)
    if m:
        return text[:m.end()] + '<head>' + inject + '</head>' + text[m.end():]
    return inject + text


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    server_version = 'Lumen'

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if '/__proxy' in (self.path or ''):
            sys.stderr.write('прокси: %s\n' % (fmt % args))

    def finish(self):
        # Сокет живого браузера передан сеансу: закрывать его здесь нельзя,
        # иначе соединение оборвётся сразу после рукопожатия.
        if getattr(self, 'socket_handed_over', False):
            return
        super().finish()

    # ---------- прокси ----------
    def do_GET(self):
        if self.path.startswith('/__proxy'):
            self.proxy()
            return
        if self.path.startswith('/__live'):
            self.live()
            return
        if self.path.startswith('/__env'):
            self.env()
            return
        super().do_GET()

    def do_HEAD(self):
        if self.path.startswith('/__proxy'):
            self.proxy(head=True)
            return
        super().do_HEAD()

    def do_POST(self):
        if self.path.startswith('/__proxy'):
            self.proxy()
            return
        self.send_error(405)

    def live(self):
        """Живой браузер: настоящий Chromium на сервере."""
        try:
            import live
        except Exception as e:
            self.fail_page('Живой браузер недоступен',
                           'Модуль live.py не загрузился: %s' % e)
            return
        if not live.handle(self):
            self.fail_page('Нужен WebSocket',
                           'Адрес /__live принимает только соединения WebSocket. '
                           'Он используется окном браузера в системе.')

    def env(self):
        """Сведения о сервере для окна браузера: порт и наличие Chromium."""
        import shutil
        data = {
            'ok': True,
            'port': PORT,
            'chromium': bool(shutil.which('chromium') or shutil.which('chromium-browser')
                             or shutil.which('google-chrome')),
            'proxy': True,
        }
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def proxy(self, head=False):
        q = urllib.parse.urlsplit(self.path).query
        params = urllib.parse.parse_qs(q)
        target = (params.get('u') or [''])[0]
        url = safe_url(target)
        if not url:
            self.fail_page('Недопустимый адрес', 'Прокси принимает только адреса http и https.')
            return
        # Ссылку на ролик YouTube переводим на плеер: он пускает в рамку.
        emb = youtube_embed(url)
        if emb:
            self.redirect_to(emb)
            return

        body = b''
        if self.command == 'POST':
            try:
                n = int(self.headers.get('Content-Length') or 0)
                body = self.rfile.read(n) if n else b''
            except Exception:
                body = b''

        req = urllib.request.Request(url, data=body or None, method=self.command)
        req.add_header('User-Agent', UA)
        req.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
        req.add_header('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7')
        req.add_header('Accept-Encoding', 'gzip, deflate')
        req.add_header('Referer', urllib.parse.urlunsplit(
            (urllib.parse.urlsplit(url).scheme, urllib.parse.urlsplit(url).netloc, '/', '', '')))
        ck = self.headers.get('Cookie')
        if ck:
            req.add_header('Cookie', ck)
        ct = self.headers.get('Content-Type')
        if body and ct:
            req.add_header('Content-Type', ct)

        ctx = ssl.create_default_context()
        try:
            with urllib.request.urlopen(req, timeout=25, context=ctx) as r:
                raw = r.read(15 * 1024 * 1024)
                ctype = r.headers.get('Content-Type', 'application/octet-stream')
                final = r.geturl()
                raw = decode_body(raw, r.headers.get('Content-Encoding'))
                headers = [(k, v) for k, v in r.headers.items()
                           if k.lower() not in STRIP_HEADERS and k.lower() != 'set-cookie']
                cookies = r.headers.get_all('Set-Cookie') or []
        except urllib.error.HTTPError as e:
            raw = e.read(2 * 1024 * 1024)
            ctype = e.headers.get('Content-Type', 'text/html')
            final = url
            raw = decode_body(raw, e.headers.get('Content-Encoding'))
            headers = [('Content-Type', ctype)]
            cookies = []
        except Exception as e:
            self.fail_page('Сайт не открылся', '%s: %s' % (type(e).__name__, e))
            return

        charset = 'utf-8'
        m = re.search(r'charset=([\w-]+)', ctype, re.I)
        if m:
            charset = m.group(1)

        low = ctype.lower()
        if 'text/html' in low or 'xhtml' in low:
            try:
                text = raw.decode(charset, 'replace')
            except LookupError:
                text = raw.decode('utf-8', 'replace')
            text = rewrite_html(text, final)
            raw = text.encode('utf-8')
            ctype = 'text/html; charset=utf-8'
            headers = [(k, v) for k, v in headers if k.lower() != 'content-type']
            headers.append(('Content-Type', ctype))

        self.send_response(200)
        for k, v in headers:
            if k.lower() in ('content-encoding', 'content-length'):
                continue
            self.send_header(k, v)
        for c in cookies:
            self.send_header('Set-Cookie', re.sub(r';\s*Domain=[^;]*', '', c, flags=re.I))
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('X-Proxied-From', final)
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if not head:
            self.wfile.write(raw)

    def redirect_to(self, target):
        """Внутренний переход: браузер остаётся в прокси, адрес меняется."""
        body = ("""<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">"""
                """<meta http-equiv="refresh" content="0;url=%s">"""
                """<title>Переход</title></head><body>Переход…</body></html>"""
                % html_mod.escape(self.proxy_path(target), quote=True)).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def proxy_path(self, target):
        return '/__proxy?u=' + urllib.parse.quote(target, safe='')

    def fail_page(self, title, detail):
        body = ("""<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">"""
                """<title>%s</title><style>body{margin:0;height:100vh;display:grid;place-items:center;"""
                """font:15px/1.5 system-ui;background:#0b1220;color:#e8eefc;text-align:center;padding:24px}"""
                """h1{font-size:19px;margin:0 0 10px}p{color:#93a3c0;max-width:460px;margin:0}"""
                """code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:6px}</style></head>"""
                """<body><div><h1>%s</h1><p>%s</p></div></body></html>""" % (
                    html_mod.escape(title), html_mod.escape(title), html_mod.escape(detail)))
        data = body.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)


class Server(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    os.chdir(ROOT)
    srv = Server(('0.0.0.0', PORT), Handler)
    print('Люмен запущен: http://localhost:%d/  (прокси: /__proxy)' % PORT, flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
