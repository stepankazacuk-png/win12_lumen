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

import concurrent.futures
import errno
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
  function unwrap(u){
    if(!u) return u;
    try {
      var o = new URL(u, document.baseURI);
      if(o.pathname === '/url' && o.searchParams.has('q')) {
        return o.searchParams.get('q');
      }
      if(o.pathname === '/url' && o.searchParams.has('url')) {
        return o.searchParams.get('url');
      }
      return o.href;
    } catch(e){
      return u;
    }
  }
  function viaProxy(u){
    if(!u) return false;
    if(/^(mailto:|tel:|javascript:|data:|blob:|#)/i.test(u)) return false;
    var target = unwrap(u);
    var a = abs(target); if(!a) return false;
    if(!/^https?:/i.test(a)) return false;
    location.href = P + encodeURIComponent(a);
    return true;
  }
  function fixTarget(n){
    if(!n || !n.getAttribute) return;
    if(n.getAttribute('target') && n.getAttribute('target') !== '_self') {
      n.setAttribute('target', '_self');
    }
  }
  document.addEventListener('pointerdown', function(e){
    var n=e.target;
    while(n && n.tagName!=='A') n=n.parentNode;
    fixTarget(n);
  }, true);
  document.addEventListener('mousedown', function(e){
    var n=e.target;
    while(n && n.tagName!=='A') n=n.parentNode;
    fixTarget(n);
  }, true);
  document.addEventListener('click', function(e){
    var n=e.target;
    while(n && n.tagName!=='A') n=n.parentNode;
    if(!n || !n.getAttribute) return;
    fixTarget(n);
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
  window.open = function(u){
    if(u) viaProxy(u);
    return window;
  };
  try {
    var origPush = history.pushState, origRepl = history.replaceState;
    history.pushState = function(s, t, u){ try { return origPush.call(history, s, t, u); } catch(e){} };
    history.replaceState = function(s, t, u){ try { return origRepl.call(history, s, t, u); } catch(e){} };
  } catch(e){}
  window.addEventListener('error', function(){}, true);
})();
</script>"""


YOUTUBE_HTML = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer-when-downgrade">
<title>YouTube — Люмен</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0f0f0f;color:#f1f1f1;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding-bottom:40px}
  header{position:sticky;top:0;z-index:100;background:rgba(15,15,15,0.96);backdrop-filter:blur(10px);border-bottom:1px solid #272727;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 20px}
  .logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:18px;color:#fff;text-decoration:none;letter-spacing:-0.5px}
  .logo-icon{width:28px;height:20px;background:#ff0000;border-radius:6px;display:flex;align-items:center;justify-content:center}
  .logo-icon svg{width:12px;height:12px;fill:#fff;margin-left:2px}
  .search-wrap{display:flex;align-items:center;flex:1;max-width:600px;margin:0 12px}
  .search-box{display:flex;width:100%;border:1px solid #303030;border-radius:40px;overflow:hidden;background:#121212}
  .search-box input{flex:1;background:transparent;border:none;padding:10px 16px;color:#fff;font-size:14px;outline:none}
  .search-box button{background:#222;border:none;border-left:1px solid #303030;color:#aaa;padding:0 18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .search-box button:hover{background:#333;color:#fff}
  .extra-links{display:flex;gap:8px}
  .rutube-btn{background:#1e293b;color:#38bdf8;border:1px solid #334155;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px;transition:all .2s}
  .rutube-btn:hover{background:#0284c7;color:#fff}
  
  .container{max-width:1280px;margin:0 auto;padding:20px}
  .player-section{background:#000;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.6);margin-bottom:24px;border:1px solid #272727}
  .player-box{position:relative;width:100%;padding-top:56.25%}
  .player-box iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none}
  .player-meta{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#181818}
  .current-title{font-size:16px;font-weight:600;color:#fff}
  .status-badge{font-size:12px;color:#22c55e;display:flex;align-items:center;gap:6px;background:rgba(34,197,94,0.12);padding:4px 10px;border-radius:12px}

  .chips{display:flex;gap:10px;overflow-x:auto;padding-bottom:12px;margin-bottom:20px}
  .chip{background:#272727;color:#f1f1f1;border:none;padding:8px 16px;border-radius:18px;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .2s}
  .chip:hover,.chip.active{background:#fff;color:#000}

  .section-title{font-size:18px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:20px}
  .card{background:#181818;border-radius:12px;overflow:hidden;cursor:pointer;border:1px solid #262626;transition:transform .18s,border-color .18s,box-shadow .18s;display:flex;flex-direction:column}
  .card:hover{transform:translateY(-4px);border-color:#555;box-shadow:0 10px 24px rgba(0,0,0,0.5)}
  .card-thumb{position:relative;width:100%;padding-top:56.25%;background:#000}
  .card-thumb img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
  .duration{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.8);color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px}
  .card-body{padding:12px;display:flex;flex-direction:column;gap:6px;flex:1}
  .card-title{font-size:14px;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .card-channel{font-size:12px;color:#aaa}
  .direct-btn{background:rgba(255,255,255,0.08);color:#fff;text-decoration:none;padding:5px 12px;border-radius:6px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:background .15s;border:1px solid rgba(255,255,255,0.14)}
  .direct-btn:hover{background:rgba(255,255,255,0.2);color:#fff}
  .loading-msg{grid-column:1/-1;text-align:center;padding:48px 20px;color:#aaa;font-size:15px;line-height:1.6}
  .spinner{width:36px;height:36px;border:3px solid #333;border-top-color:#ff0000;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px}
  @keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
  <header>
    <a href="/__youtube" class="logo">
      <div class="logo-icon"><svg viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19"></polygon></svg></div>
      <span>YouTube</span>
    </a>
    <div class="search-wrap">
      <form class="search-box" id="searchForm" onsubmit="event.preventDefault();doSearch();">
        <input type="text" id="searchInput" placeholder="Поиск на YouTube или ссылка на ролик..." value="{{QUERY}}">
        <button type="submit" title="Найти">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>
    </div>
    <div class="extra-links">
      <a href="https://rutube.ru/" class="rutube-btn">📺 RuTube</a>
    </div>
  </header>

  <div class="container">
    <div class="player-section">
      <div class="player-box">
        <iframe id="mainPlayer" src="https://www.youtube-nocookie.com/embed/{{VIDEO_ID}}?autoplay=1"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div class="player-meta">
        <span class="current-title" id="playerTitle">Сейчас играет</span>
        <div style="display:flex;align-items:center;gap:10px">
          <a id="directBtn" href="https://www.youtube-nocookie.com/embed/{{VIDEO_ID}}?autoplay=1" class="direct-btn">⛶ Смотреть напрямую</a>
          <span class="status-badge"><span style="width:6px;height:6px;border-radius:50%;background:#22c55e"></span>Стабильный плеер</span>
        </div>
      </div>
    </div>

    <div class="chips">
      <button class="chip active" data-cat="all" onclick="filterCat('all')">Все</button>
      <button class="chip" data-cat="music" onclick="filterCat('music')">Музыка</button>
      <button class="chip" data-cat="trends" onclick="filterCat('trends')">Тренды</button>
      <button class="chip" data-cat="relax" onclick="filterCat('relax')">Природа & Релакс</button>
      <button class="chip" data-cat="games" onclick="filterCat('games')">Игры & Фильмы</button>
    </div>

    <div class="section-title" id="sectionTitle">🔥 Популярные видео</div>
    <div class="grid" id="videoGrid"></div>
  </div>

<script>
const VIDEOS = [
  { id: 'dQw4w9WgXcQ', t: 'Rick Astley - Never Gonna Give You Up', ch: 'Rick Astley', d: '3:33', c: 'music' },
  { id: 'jfKfPfyJRdk', t: 'Lofi Hip Hop Radio - Beats to Relax/Study to', ch: 'Lofi Girl', d: 'LIVE', c: 'music' },
  { id: 'fJ9rUzIMcZQ', t: 'Queen - Bohemian Rhapsody (Official Video)', ch: 'Queen Official', d: '5:59', c: 'music' },
  { id: 'UDVtMYqUAyw', t: 'Interstellar Main Theme - Hans Zimmer', ch: 'Hans Zimmer', d: '4:56', c: 'music' },
  { id: 'LXb3EKWsInQ', t: 'Campfire by the River 4K - Relaxing Nature', ch: 'Calm Sound', d: '3:00:00', c: 'relax' },
  { id: 'aqz-KE-bpKQ', t: 'Big Buck Bunny 4K 60fps Ultra HD', ch: 'Blender Studio', d: '10:34', c: 'trends' },
  { id: 'N_x_jRZZtps', t: 'Minecraft - 15th Anniversary Official Animation', ch: 'Minecraft', d: '1:45', c: 'games' },
  { id: '8X2kIfS6fb8', t: 'Cyberpunk 2077 - Phantom Liberty Official Trailer', ch: 'Cyberpunk 2077', d: '2:31', c: 'games' },
  { id: 'L_LUpnjgPso', t: 'Earth from Space - 4K ISS Live Stream', ch: 'Space Videos', d: 'LIVE', c: 'relax' },
  { id: '2Vv-BfVoq4g', t: 'Ed Sheeran - Perfect (Official Music Video)', ch: 'Ed Sheeran', d: '4:39', c: 'music' },
  { id: 'kJQP7kiw5Fk', t: 'Luis Fonsi - Despacito ft. Daddy Yankee', ch: 'Luis Fonsi', d: '4:41', c: 'music' },
  { id: 'hTWKbfoikeg', t: 'Nirvana - Smells Like Teen Spirit', ch: 'Nirvana', d: '4:38', c: 'music' }
];

let curCat = 'all';

function play(id, title) {
  const p = document.getElementById('mainPlayer');
  p.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
  document.getElementById('playerTitle').textContent = title || 'Воспроизведение';
  const dBtn = document.getElementById('directBtn');
  if (dBtn) dBtn.href = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
  try {
    const url = new URL(location.href);
    url.searchParams.set('v', id);
    history.replaceState(null, '', url.pathname + url.search);
  } catch(e) {}
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderVideos(list) {
  const g = document.getElementById('videoGrid');
  g.innerHTML = '';
  if (!list || !list.length) {
    g.innerHTML = '<div class="loading-msg">Ничего не найдено. Попробуйте другой запрос.</div>';
    return;
  }
  list.forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => play(v.id, v.t);
    card.innerHTML = 
      '<div class="card-thumb">' +
        '<img src="https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg" alt="" loading="lazy">' +
        '<span class="duration">' + (v.d || 'HD') + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + v.t + '</div>' +
        '<div class="card-channel">' + v.ch + '</div>' +
      '</div>';
    g.appendChild(card);
  });
}

function filterCat(c) {
  curCat = c;
  document.querySelectorAll('.chip').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-cat') === c);
  });
  if (c === 'all') {
    document.getElementById('sectionTitle').textContent = '🔥 Популярные видео';
    renderVideos(VIDEOS);
  } else if (c === 'music') {
    doSearch('музыка клипы', true);
  } else if (c === 'trends') {
    doSearch('тренды ютуб', true);
  } else if (c === 'relax') {
    doSearch('relax nature 4k', true);
  } else if (c === 'games') {
    doSearch('новые трейлеры игр', true);
  }
}

async function doSearch(overrideQ, keepPlaying) {
  const input = document.getElementById('searchInput');
  const q = (overrideQ !== undefined ? overrideQ : input.value).trim();
  if (!q) return;
  input.value = q;

  const m = q.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|v\/|embed\/))([\w-]{6,})/);
  if (m) {
    play(m[1], 'Видео из ссылки');
    return;
  }

  const titleEl = document.getElementById('sectionTitle');
  titleEl.textContent = '🔍 Поиск: ' + q;

  const g = document.getElementById('videoGrid');
  g.innerHTML = '<div class="loading-msg"><div class="spinner"></div>Поиск видео на YouTube...</div>';

  try {
    const url = new URL(location.href);
    url.searchParams.set('q', q);
    history.replaceState(null, '', url.pathname + url.search);
  } catch(e) {}

  try {
    const resp = await fetch('/__youtube_search?q=' + encodeURIComponent(q));
    const items = await resp.json();
    if (items && items.length > 0) {
      renderVideos(items);
      if (!keepPlaying) {
        play(items[0].id, items[0].t);
      }
      return;
    }
  } catch(err) {
    console.error('Search fetch error:', err);
  }

  const filtered = VIDEOS.filter(v => v.t.toLowerCase().includes(q.toLowerCase()) || v.ch.toLowerCase().includes(q.toLowerCase()));
  if (filtered.length) {
    renderVideos(filtered);
    if (!keepPlaying) play(filtered[0].id, filtered[0].t);
  } else {
    g.innerHTML = '<div class="loading-msg">По запросу «' + q + '» ничего не найдено.<br><br>' +
      '<a href="https://rutube.ru/search/?query=' + encodeURIComponent(q) + '" class="rutube-btn" style="display:inline-flex">Искать на RuTube</a></div>';
  }
}

const initialVid = '{{VIDEO_ID}}';
const initialQuery = '{{QUERY}}';

if (initialVid) {
  const found = VIDEOS.find(v => v.id === initialVid);
  if (found) {
    document.getElementById('playerTitle').textContent = found.t;
  } else {
    fetch('/__youtube_search?q=' + encodeURIComponent(initialVid))
      .then(r => r.json())
      .then(items => {
        if (items && items.length && items[0].t) {
          document.getElementById('playerTitle').textContent = items[0].t;
        }
      }).catch(() => {});
  }
}

if (initialQuery) {
  doSearch(initialQuery, !!initialVid);
} else {
  renderVideos(VIDEOS);
}
</script>
</body>
</html>"""


def get_video_meta(vid):
    """Получает название и автора видеоролика через noembed oEmbed API."""
    try:
        url = 'https://noembed.com/embed?url=' + urllib.parse.quote('https://www.youtube.com/watch?v=' + vid)
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        ctx = ssl._create_unverified_context()
        r = urllib.request.urlopen(req, context=ctx, timeout=3.5)
        data = json.loads(r.read())
        title = data.get('title') or ('YouTube Video ' + vid)
        author = data.get('author_name') or 'YouTube'
        return {'id': vid, 't': title, 'ch': author, 'd': 'YouTube', 'c': 'video'}
    except Exception:
        return {'id': vid, 't': 'YouTube Video (' + vid + ')', 'ch': 'YouTube', 'd': 'HD', 'c': 'video'}


def search_youtube_videos(query):
    """Ищет видео на YouTube через мобильный поиск Яндекс.Видео (без блокировок)
    и обогащает карточки названиями роликов."""
    query = (query or '').strip()
    if not query:
        return []
    # Если введён ID или прямая ссылка
    m = (re.search(r'youtu\.be/([\w-]{6,})', query)
         or re.search(r'youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|v/)([\w-]{6,})', query))
    if m:
        return [get_video_meta(m.group(1))]
    if re.fullmatch(r'[\w-]{11}', query):
        return [get_video_meta(query)]

    url = 'https://yandex.ru/video/touch/search?text=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    ctx = ssl._create_unverified_context()
    results = []
    try:
        r = urllib.request.urlopen(req, context=ctx, timeout=4.5)
        content = r.read().decode('utf-8', errors='ignore')
        vids = list(dict.fromkeys(re.findall(r'youtube\.com/(?:watch\?v=|embed/)([\w-]{11})', content)))
        if vids:
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
                results = list(executor.map(get_video_meta, vids[:12]))
    except Exception as e:
        print('[server] YouTube search error:', e)
    return results


def youtube_embed(url):
    """Ссылка на ролик или страницу → адрес встроенного плеера / портала."""
    if '/embed/' in url:
        return None
    m = (re.search(r'youtu\.be/([\w-]{6,})', url)
         or re.search(r'youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|v/)([\w-]{6,})', url))
    if m:
        return '/__youtube?v=%s' % m.group(1)
    m_search = re.search(r'youtube\.com/results\?(?:.*&)?search_query=([^&#]+)', url)
    if m_search:
        return '/__youtube?q=%s' % m_search.group(1)
    if re.search(r'youtube\.com(?:\/.*)?$', url, re.I):
        return '/__youtube'
    return None


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
    try:
        ascii_host = host.encode('idna').decode('ascii')
    except Exception:
        ascii_host = host
    if p.port:
        ascii_host += ':' + str(p.port)
    path = urllib.parse.quote(urllib.parse.unquote(p.path or '/'), safe='/:%@!$&\'()*+,;=')
    query = urllib.parse.quote(urllib.parse.unquote(p.query or ''), safe='/:%@!$&\'()*+,;=?=')
    return urllib.parse.urlunsplit((p.scheme, ascii_host, path, query, p.fragment))


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
        if self.path.startswith('/__youtube_search'):
            self.youtube_search()
            return
        if self.path.startswith('/__youtube') or self.path.startswith('/youtube.html'):
            self.youtube()
            return
        super().do_GET()

    def do_HEAD(self):
        if self.path.startswith('/__proxy'):
            self.proxy(head=True)
            return
        super().do_HEAD()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.end_headers()

    def do_POST(self):
        if self.path.startswith('/__proxy'):
            self.proxy()
            return
        self.send_error(405)

    def live(self):
        """Живой браузер: настоящий Chromium на сервере."""
        self.close_connection = True
        try:
            import live
            live.SERVER_PORT = PORT
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
        try:
            import live
            live.SERVER_PORT = PORT
            has_chrome = bool(live.find_chromium())
        except Exception:
            has_chrome = False
        data = {
            'ok': True,
            'port': PORT,
            'chromium': has_chrome,
            'proxy': True,
        }
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def youtube_search(self):
        """Поиск видео на YouTube: возвращает JSON-список роликов."""
        q = urllib.parse.urlsplit(self.path).query
        params = urllib.parse.parse_qs(q)
        query = (params.get('q') or [''])[0]
        results = search_youtube_videos(query)
        body = json.dumps(results, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def youtube(self):
        """Встроенный портал YouTube: поиск, просмотр и популярные ролики без ошибки 153."""
        q = urllib.parse.urlsplit(self.path).query
        params = urllib.parse.parse_qs(q)
        v = (params.get('v') or [''])[0]
        query = (params.get('q') or [''])[0]

        if not v and query:
            m = (re.search(r'youtu\.be/([\w-]{6,})', query)
                 or re.search(r'youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|v/|embed/)([\w-]{6,})', query))
            if m:
                v = m.group(1)

        default_video = v or 'aqz-KE-bpKQ'
        body = YOUTUBE_HTML.replace('{{VIDEO_ID}}', html_mod.escape(default_video, quote=True)).replace('{{QUERY}}', html_mod.escape(query, quote=True)).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Referrer-Policy', 'no-referrer-when-downgrade')
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

        ctx = ssl._create_unverified_context()
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
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('X-Proxied-From', final)
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if not head:
            self.wfile.write(raw)

    def redirect_to(self, target):
        """Внутренний переход: браузер остаётся в прокси, адрес меняется."""
        dest = target if target.startswith('/') else self.proxy_path(target)
        body = ("""<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">"""
                """<meta http-equiv="refresh" content="0;url=%s">"""
                """<title>Переход</title></head><body>Переход…</body></html>"""
                % html_mod.escape(dest, quote=True)).encode('utf-8')
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
    try:
        srv = Server(('0.0.0.0', PORT), Handler)
    except OSError as e:
        # Понятный текст вместо трассировки: чаще всего порт занят тем, что
        # сервер уже запущен в другом окне.
        if getattr(e, 'errno', None) in (errno.EADDRINUSE, errno.EACCES):
            print('Порт %d уже занят.' % PORT, flush=True)
            print('Скорее всего, система уже запущена — откройте http://localhost:%d/' % PORT, flush=True)
            print('Если это не так, закройте лишнее окно или запустите на другом порту:'
                  ' python3 server.py 12001', flush=True)
        else:
            print('Не удалось запустить сервер на порту %d: %s' % (PORT, e), flush=True)
        sys.exit(1)
    print('Люмен запущен: http://localhost:%d/  (прокси: /__proxy)' % PORT, flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
