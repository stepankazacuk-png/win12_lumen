/* ============================================================================
   Windows 12 — концептуальная веб-ОС
   Ядро: виртуальная ФС, оконный менеджер, планировщик, приложения
   ========================================================================== */
'use strict';

/* ------------------------------ ICONS ------------------------------------- */
const G = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const ICO = {
  folder: `<svg viewBox="0 0 24 24"><path d="M2 7a2 2 0 0 1 2-2h4.6a2 2 0 0 1 1.5.7L11.4 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" fill="#ffc65c"/><path d="M2 9h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" fill="#ffd983"/></svg>`,
  file: `<svg viewBox="0 0 24 24"><path d="M6 2h7l6 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="#8fa3c8"/><path d="M13 2l6 6h-5a1 1 0 0 1-1-1V2z" fill="#c3d2ea"/></svg>`,
  txt: `<svg viewBox="0 0 24 24"><path d="M6 2h7l6 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="#7dd3fc"/><path d="M13 2l6 6h-5a1 1 0 0 1-1-1V2z" fill="#bae6fd"/><path d="M8 12h8M8 15h8M8 18h5" stroke="#0b3b52" stroke-width="1.3"/></svg>`,
  code: `<svg viewBox="0 0 24 24"><path d="M6 2h7l6 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="#a78bfa"/><path d="M13 2l6 6h-5a1 1 0 0 1-1-1V2z" fill="#ddd6fe"/><path d="M10 12l-2 3 2 3M14 12l2 3-2 3" stroke="#2e1065" stroke-width="1.3"/></svg>`,
  png: `<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="#34d399"/><circle cx="8" cy="10" r="2" fill="#065f46"/><path d="M3 18l5-5 4 4 3-3 6 6H3z" fill="#a7f3d0"/></svg>`,
  exe: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="url(#lgWin)"/><path d="M9 8l7 4-7 4V8z" fill="#08131f"/></svg>`,
  disk: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" fill="#94a3b8"/><rect x="6" y="7" width="12" height="6" rx="1.5" fill="#e2e8f0"/><circle cx="17" cy="17" r="1.4" fill="#22c55e"/></svg>`,
  settings: G('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-2.7 1.1 2 2 0 1 1-4 0 1.6 1.6 0 0 0-2.7-1.1 2 2 0 1 1-2.8-2.8A1.6 1.6 0 0 0 3.6 14a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.1-2.7 2 2 0 1 1 2.8-2.8A1.6 1.6 0 0 0 10 3.6a2 2 0 1 1 4 0 1.6 1.6 0 0 0 2.7 1.1 2 2 0 1 1 2.8 2.8A1.6 1.6 0 0 0 20.4 10a2 2 0 1 1 0 4 1.6 1.6 0 0 0-1 1z"/>'),
  search: G('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  term: G('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>'),
  calc: G('<rect x="4" y="2" width="16" height="20" rx="2.5"/><path d="M8 6h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 19h6"/>'),
  note: G('<path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8 13h8M8 17h5"/>'),
  paint: G('<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.5-1.9-.3-1 .4-1.9 1.4-1.9H18a3 3 0 0 0 3-3c0-5.5-4-11.2-9-11.2z"/><circle cx="8" cy="10" r="1.2" fill="currentColor"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/><circle cx="16" cy="10" r="1.2" fill="currentColor"/>'),
  music: G('<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>'),
  photos: G('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M4 18l5-5 3.5 3.5L16 13l4 4"/>'),
  cal: G('<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  task: G('<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2.5"/>'),
  mail: G('<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M3 7l9 6 9-6"/>'),
  clock: G('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  cpu: G('<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/>'),
  power: G('<path d="M12 3v9"/><path d="M6.5 6.5a8 8 0 1 0 11 0"/>'),
  store: G('<path d="M4 8h16l-1.2 12a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 8z"/><path d="M8.5 8V6a3.5 3.5 0 1 1 7 0v2"/>'),
  shield: G('<path d="M12 2l8 3.5v6c0 5-3.4 9-8 10.5C7.4 20.5 4 16.5 4 11.5v-6L12 2z"/><path d="M9 12l2 2 4-4"/>'),
  globe: G('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
  sparkle: G('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>'),
  play: G('<path d="M8 5l11 7-11 7V5z" fill="currentColor"/>'),
  pause: G('<rect x="7" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="4" height="14" rx="1" fill="currentColor"/>'),
  next: G('<path d="M6 5l9 7-9 7V5z" fill="currentColor"/><rect x="16" y="5" width="2.5" height="14" rx="1" fill="currentColor"/>'),
  prev: G('<path d="M18 5l-9 7 9 7V5z" fill="currentColor"/><rect x="5.5" y="5" width="2.5" height="14" rx="1" fill="currentColor"/>'),
  up: G('<path d="M12 19V6M6 12l6-6 6 6"/>'),
  down: G('<path d="M12 5v13M6 12l6 6 6-6"/>'),
  trash: G('<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>'),
  plus: G('<path d="M12 5v14M5 12h14"/>'),
  x: G('<path d="M6 6l12 12M18 6L6 18"/>'),
  min: G('<path d="M5 12h14"/>'),
  max: G('<rect x="5" y="5" width="14" height="14" rx="2"/>'),
  copy: G('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
  ren: G('<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/>'),
  refresh: G('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'),
  sun: G('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>'),
  moon: G('<path d="M21 13a8.5 8.5 0 1 1-9.5-9 7 7 0 0 0 9.5 9z"/>'),
  bell: G('<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>'),
  wifi: G('<path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5 12.5a11 11 0 0 1 14 0"/><path d="M8.5 16.5a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>'),
  chip: G('<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>'),
};

/* ------------------------------ STATE ------------------------------------- */
const State = {
  accent: '#5cc8ff', accent2: '#7b6cff', theme: 'dark', wallpaper: 'aurora',
  align: 'center', transparency: true, volume: 62, brightness: 100,
  night: false, focus: false, tiling: false, zTop: 100, open: {}, seq: 0,
};

/* ------------------------------ UTILS ------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const DAYS = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
const MON = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const dateStr = d => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${DAYS[d.getDay()]}`;

/* ------------------------------ AUDIO ------------------------------------- */
const Sound = (() => {
  let ctx = null;
  const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());
  function beep(freq, dur, type, gain) {
    if (State.volume === 0) return;
    try {
      const c = ac(), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime((gain || .04) * (State.volume / 100), c.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + (dur || .07));
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + (dur || .07) + .02);
    } catch (e) { /* аудио недоступно */ }
  }
  return {
    click: () => beep(880, .045, 'triangle', .03),
    open: () => { beep(520, .08, 'sine', .035); setTimeout(() => beep(780, .1, 'sine', .03), 60); },
    close: () => beep(360, .09, 'sine', .03),
    error: () => beep(180, .16, 'sawtooth', .035),
    notif: () => { beep(880, .09, 'sine', .04); setTimeout(() => beep(1180, .12, 'sine', .035), 90); },
    boot: () => [440, 660, 880, 1320].forEach((f, i) => setTimeout(() => beep(f, .22, 'sine', .04), i * 150)),
  };
})();

/* ============================================================================
   ВИРТУАЛЬНАЯ ФАЙЛОВАЯ СИСТЕМА
   ========================================================================== */
const VFS = (() => {
  const tree = {
    'C:': { type: 'dir', children: {
      'Users': { type: 'dir', children: {
        'Гость': { type: 'dir', children: {
          'Документы': { type: 'dir', children: {
            'readme.txt': { type: 'file', ext: 'txt', content: 'Добро пожаловать в Windows 12!\n\nЭто концептуальная веб-операционная система, работающая целиком в браузере.\nЗдесь есть оконный менеджер, виртуальная файловая система и рабочий терминал.\n\nПопробуйте: help, neofetch, ls, cat readme.txt\n' },
            'notes.md': { type: 'file', ext: 'txt', content: '# Заметки\n\n- Позвонить в орбитальный офис\n- Обновить ядро до 12.0.1\n- Проверить снап окон (Win + стрелки)\n' },
            'todo.txt': { type: 'file', ext: 'txt', content: '[ ] Прочитать документацию\n[x] Загрузить Windows 12\n[ ] Написать свой планировщик\n' },
          } },
          'Изображения': { type: 'dir', children: {
            'aurora.png': { type: 'file', ext: 'png' },
            'nebula.png': { type: 'file', ext: 'png' },
            'ember.png': { type: 'file', ext: 'png' },
          } },
          'Музыка': { type: 'dir', children: {
            'signal.wav': { type: 'file', ext: 'wav' },
            'orbit.wav': { type: 'file', ext: 'wav' },
          } },
          'Загрузки': { type: 'dir', children: {} },
        } },
      } },
      'Windows': { type: 'dir', children: {
        'System32': { type: 'dir', children: {
          'kernel12.sys': { type: 'file', ext: 'sys', content: '[binary]\n' },
          'shell.exe': { type: 'file', ext: 'exe', content: '[binary]\n' },
          'wm.dll': { type: 'file', ext: 'sys', content: '[binary]\n' },
        } },
        'Fonts': { type: 'dir', children: { 'Manrope.ttf': { type: 'file', ext: 'ttf' } } },
      } },
      'Program Files': { type: 'dir', children: {
        'Windows 12': { type: 'dir', children: {
          'os.js': { type: 'file', ext: 'code', content: '// ядро системы\n' },
          'styles.css': { type: 'file', ext: 'code', content: '/* оформление */\n' },
        } },
      } },
    } },
  };
  const root = () => tree['C:'];
  const split = p => String(p).replace(/\\/g, '/').replace(/^[A-Za-z]:/, '').split('/').filter(Boolean);
  function node(p) {
    let cur = root();
    for (const part of split(p)) {
      if (!cur || cur.type !== 'dir' || !cur.children[part]) return null;
      cur = cur.children[part];
    }
    return cur;
  }
  const norm = p => 'C:' + (split(p).length ? '\\' + split(p).join('\\') : '\\');
  const parentOf = p => split(p).slice(0, -1);
  const nameOf = p => split(p).slice(-1)[0] || '';
  function mkdir(p) {
    const parts = split(p); if (!parts.length) return { ok: false, err: 'Указан неверный путь' };
    let cur = root();
    for (const part of parts) {
      if (cur.children[part]) { if (cur.children[part].type !== 'dir') return { ok: false, err: 'Файл уже существует' }; }
      else cur.children[part] = { type: 'dir', children: {} };
      cur = cur.children[part];
    }
    return { ok: true };
  }
  function write(p, content, ext) {
    const parent = node(parentOf(p).join('\\') || '\\');
    const nm = nameOf(p);
    if (!parent || parent.type !== 'dir') return { ok: false, err: 'Путь не найден' };
    if (parent.children[nm] && parent.children[nm].type === 'dir') return { ok: false, err: 'Это каталог' };
    const e = ext || (nm.includes('.') ? nm.split('.').pop() : 'txt');
    parent.children[nm] = { type: 'file', ext: e, content: String(content) };
    return { ok: true };
  }
  function read(p) {
    const n = node(p);
    if (!n) return { ok: false, err: 'Файл не найден' };
    if (n.type === 'dir') return { ok: false, err: 'Это каталог' };
    return { ok: true, content: n.content || '' };
  }
  function rm(p, rec) {
    const parts = split(p); if (!parts.length) return { ok: false, err: 'Отказано в доступе' };
    const parent = node(parts.slice(0, -1).join('\\') || '\\');
    const nm = parts.slice(-1)[0];
    if (!parent || !parent.children[nm]) return { ok: false, err: 'Не найдено' };
    if (parent.children[nm].type === 'dir' && !rec) return { ok: false, err: 'Требуется ключ /r' };
    delete parent.children[nm];
    return { ok: true };
  }
  function cp(from, to) {
    const n = node(from); if (!n) return { ok: false, err: 'Источник не найден' };
    return write(to, n.content, n.ext);
  }
  function mv(from, to) {
    const n = node(from); if (!n) return { ok: false, err: 'Источник не найден' };
    if (n.type === 'dir') return { ok: false, err: 'Перемещение каталогов не поддерживается' };
    const w = cp(from, to); if (!w.ok) return w;
    rm(from); return { ok: true };
  }
  function list(p) {
    const n = node(p);
    if (!n) return { ok: false, err: 'Путь не найден', items: [] };
    if (n.type === 'file') return { ok: true, items: [{ name: nameOf(p), node: n }] };
    return { ok: true, items: Object.keys(n.children).map(k => ({ name: k, node: n.children[k] })) };
  }
  const sizeOf = n => n.type === 'dir' ? 0 : (n.content ? n.content.length : 1024 + (n.ext || '').length * 37);
  function allFiles(p, out) {
    out = out || [];
    const n = node(p); if (!n) return out;
    if (n.type === 'file') { out.push({ path: norm(p), node: n }); return out; }
    Object.keys(n.children).forEach(k => allFiles(p + '\\' + k, out));
    return out;
  }
  return { tree, root, node, norm, split, mkdir, write, read, rm, mv, cp, list, sizeOf, allFiles, nameOf, parentOf };
})();

/* ============================================================================
   УВЕДОМЛЕНИЯ
   ========================================================================== */
const Notify = (() => {
  const host = $('#notif');
  return function notify(title, text, icon, silent) {
    if (State.focus) return;
    const t = el('div', 'toast');
    t.innerHTML = `${icon || ICO.bell}<div><b>${esc(title)}</b><p>${esc(text)}</p></div>`;
    host.prepend(t);
    if (!silent) Sound.notif();
    const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 250); };
    t.onclick = kill;
    setTimeout(kill, 5200);
    while (host.children.length > 5) host.lastChild.remove();
  };
})();

/* ============================================================================
   МЕНЕДЖЕР ОКОН (WM12)
   ========================================================================== */
const Apps = {};
const WM = (() => {
  const host = $('#wins');
  const ghost = $('#snapGhost');
  const TB_H = 52;

  const register = def => { Apps[def.id] = def; };

  function open(id, arg) {
    const def = Apps[id];
    if (!def) { Notify('Ошибка', 'Приложение «' + id + '» не найдено', ICO.settings); Sound.error(); return null; }
    if (State.open[id] && !def.multi) { State.open[id].minimized = false; State.open[id].node.classList.remove('min'); focus(id); return State.open[id]; }
    State.seq++;
    const key = def.multi ? id + '#' + State.seq : id;
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(def.w || 720, vw - 60), h = Math.min(def.h || 480, vh - TB_H - 60);
    const off = (Object.keys(State.open).length % 7) * 26;
    const rec = {
      id: key, app: id, def, node: null, body: null, minimized: false, maximized: false,
      prev: null, api: {}, dirty: false,
      x: clamp((vw - w) / 2 + off - 60, 12, Math.max(12, vw - w - 12)),
      y: clamp((vh - TB_H - h) / 2 + off - 50, 12, Math.max(12, vh - TB_H - h - 12)),
      w, h,
    };
    build(rec);
    State.open[key] = rec;
    if (def.init) def.init(rec, arg);
    focus(key);
    renderTaskbar();
    Sound.open();
    return rec;
  }

  function build(rec) {
    const d = rec.def;
    const win = el('div', 'win');
    win.style.cssText = 'left:' + rec.x + 'px;top:' + rec.y + 'px;width:' + rec.w + 'px;height:' + rec.h + 'px;z-index:' + (++State.zTop);
    win.innerHTML =
      '<div class="titlebar">' +
        '<span class="tb-ico">' + d.icon + '</span>' +
        '<span class="tb-title">' + esc(d.title) + '</span>' +
        '<span class="tb-spacer"></span>' +
        '<div class="win-ctl">' +
          '<button data-a="min" title="Свернуть">' + ICO.min + '</button>' +
          '<button data-a="max" title="Развернуть">' + ICO.max + '</button>' +
          '<button data-a="close" class="close" title="Закрыть">' + ICO.x + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="win-body"></div>' +
      '<div class="rz rz-n"></div><div class="rz rz-s"></div><div class="rz rz-w"></div><div class="rz rz-e"></div>' +
      '<div class="rz rz-nw"></div><div class="rz rz-ne"></div><div class="rz rz-sw"></div><div class="rz rz-se"></div>';
    rec.node = win;
    rec.body = $('.win-body', win);
    host.appendChild(win);

    $('.win-ctl', win).onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      e.stopPropagation(); Sound.click();
      if (b.dataset.a === 'min') minimize(rec.id);
      else if (b.dataset.a === 'max') toggleMax(rec.id);
      else close(rec.id);
    };
    const tbar = $('.titlebar', win);
    tbar.addEventListener('dblclick', e => { if (!e.target.closest('.win-ctl')) toggleMax(rec.id); });
    tbar.addEventListener('mousedown', e => { if (!e.target.closest('.win-ctl')) startDrag(rec, e); });
    $$('.rz', win).forEach(rz => rz.addEventListener('mousedown', e => startResize(rec, e, rz.classList[1].replace('rz-', ''))));
    win.addEventListener('mousedown', () => focus(rec.id), true);
    tbar.addEventListener('contextmenu', e => {
      e.preventDefault(); focus(rec.id);
      openCtx(e.clientX, e.clientY, [
        { t: 'Свернуть', i: ICO.min, f: () => minimize(rec.id) },
        { t: rec.maximized ? 'Восстановить' : 'Развернуть', i: ICO.max, f: () => toggleMax(rec.id) },
        { sep: true },
        { t: 'Закрыть', i: ICO.x, f: () => close(rec.id), k: 'Alt+F4' },
      ]);
    });
  }

  function focus(id) {
    const rec = State.open[id]; if (!rec) return;
    State.active = id;
    rec.node.style.zIndex = ++State.zTop;
    renderTaskbar();
  }
  function minimize(id) {
    const r = State.open[id]; if (!r) return;
    r.minimized = true; r.node.classList.add('min');
    if (State.active === id) State.active = null;
    Sound.close(); renderTaskbar();
  }
  function unminimize(id) { const r = State.open[id]; if (r) { r.minimized = false; r.node.classList.remove('min'); } }
  function toggleMin(id) {
    const r = State.open[id]; if (!r) return;
    if (r.minimized) { unminimize(id); focus(id); } else minimize(id);
  }
  function toggleMax(id) {
    const r = State.open[id]; if (!r) return;
    if (r.maximized) {
      Object.assign(r.node.style, { left: r.prev.x + 'px', top: r.prev.y + 'px', width: r.prev.w + 'px', height: r.prev.h + 'px' });
      Object.assign(r, { x: r.prev.x, y: r.prev.y, w: r.prev.w, h: r.prev.h });
      r.maximized = false; r.node.classList.remove('max');
    } else {
      r.prev = { x: r.x, y: r.y, w: r.w, h: r.h };
      Object.assign(r.node.style, { left: '0px', top: '0px', width: '100%', height: 'calc(100% - ' + TB_H + 'px)' });
      r.maximized = true; r.node.classList.add('max');
    }
  }
  function close(id) {
    const r = State.open[id]; if (!r) return;
    if (r.def.onClose) r.def.onClose(r);
    clearInterval(r.api.iv);
    r.node.classList.add('closing');
    setTimeout(() => r.node.remove(), 180);
    delete State.open[id];
    if (State.active === id) State.active = null;
    Sound.close(); renderTaskbar();
  }

  function detectSnap(cx, cy) {
    const vw = window.innerWidth, vh = window.innerHeight - TB_H, M = 16;
    if (cx < M) return cy < vh * .3 ? { x: 0, y: 0, w: vw / 2, h: vh / 2 } : cy > vh * .7 ? { x: 0, y: vh / 2, w: vw / 2, h: vh / 2 } : { x: 0, y: 0, w: vw / 2, h: vh };
    if (cx > vw - M) return cy < vh * .3 ? { x: vw / 2, y: 0, w: vw / 2, h: vh / 2 } : cy > vh * .7 ? { x: vw / 2, y: vh / 2, w: vw / 2, h: vh / 2 } : { x: vw / 2, y: 0, w: vw / 2, h: vh };
    if (cy < M) return { x: 0, y: 0, w: vw, h: vh };
    return null;
  }
  function startDrag(rec, e) {
    if (rec.maximized) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, ox = rec.x, oy = rec.y;
    rec.node.classList.add('drag');
    let snap = null;
    const move = ev => {
      rec.x = clamp(ox + ev.clientX - sx, -rec.w + 90, window.innerWidth - 90);
      rec.y = clamp(oy + ev.clientY - sy, 0, window.innerHeight - 60);
      rec.node.style.left = rec.x + 'px'; rec.node.style.top = rec.y + 'px';
      snap = State.tiling ? null : detectSnap(ev.clientX, ev.clientY);
      if (snap) {
        ghost.style.display = 'block';
        Object.assign(ghost.style, { left: snap.x + 'px', top: snap.y + 'px', width: snap.w + 'px', height: snap.h + 'px' });
      } else ghost.style.display = 'none';
    };
    const up = () => {
      document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
      rec.node.classList.remove('drag'); ghost.style.display = 'none';
      if (snap) applyRect(rec, snap);
    };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  }
  function applyRect(rec, r) {
    rec.node.classList.add('snapping');
    Object.assign(rec.node.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
    Object.assign(rec, { x: r.x, y: r.y, w: r.w, h: r.h, maximized: false });
    rec.node.classList.remove('max');
    setTimeout(() => rec.node.classList.remove('snapping'), 220);
  }
  function startResize(rec, e, dir) {
    if (rec.maximized) return;
    e.preventDefault(); e.stopPropagation();
    const sx = e.clientX, sy = e.clientY, o = { x: rec.x, y: rec.y, w: rec.w, h: rec.h };
    rec.node.classList.add('rz');
    const move = ev => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      let x = o.x, y = o.y, w = o.w, h = o.h;
      if (dir.indexOf('e') >= 0) w = Math.max(340, o.w + dx);
      if (dir.indexOf('s') >= 0) h = Math.max(220, o.h + dy);
      if (dir.indexOf('w') >= 0) { w = Math.max(340, o.w - dx); x = o.x + (o.w - w); }
      if (dir.indexOf('n') >= 0) { h = Math.max(220, o.h - dy); y = o.y + (o.h - h); }
      Object.assign(rec, { x, y, w, h });
      Object.assign(rec.node.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); rec.node.classList.remove('rz'); };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  }

  function tile(mode) {
    const list = Object.values(State.open).filter(r => !r.minimized);
    const vw = window.innerWidth, vh = window.innerHeight - TB_H;
    if (!list.length) return;
    if (mode === 'grid') {
      const cols = Math.ceil(Math.sqrt(list.length)), rows = Math.ceil(list.length / cols);
      list.forEach((r, i) => applyRect(r, { x: (i % cols) * vw / cols, y: Math.floor(i / cols) * vh / rows, w: vw / cols, h: vh / rows }));
    } else if (mode === 'cols') {
      list.forEach((r, i) => applyRect(r, { x: i * vw / list.length, y: 0, w: vw / list.length, h: vh }));
    } else if (mode === 'rows') {
      list.forEach((r, i) => applyRect(r, { x: 0, y: i * vh / list.length, w: vw, h: vh / list.length }));
    } else if (mode === 'cascade') {
      list.forEach((r, i) => applyRect(r, { x: 40 + i * 34, y: 30 + i * 30, w: Math.min(760, vw - 140), h: Math.min(520, vh - 100) }));
    }
  }
  function minimizeAll() {
    Object.values(State.open).forEach(r => { r.minimized = true; r.node.classList.add('min'); });
    State.active = null;
    renderTaskbar();
  }
  return { register, open, close, focus, minimize, toggleMin, unminimize, toggleMax, tile, minimizeAll, applyRect };
})();

/* ============================================================================
   КОНТЕКСТНОЕ МЕНЮ
   ========================================================================== */
const ctxHost = $('#ctx');
function openCtx(x, y, items) {
  ctxHost.innerHTML = '';
  items.forEach(it => {
    if (it.sep) { ctxHost.appendChild(el('div', 'ctx-sep')); return; }
    const b = el('button', 'ctx-i', (it.i || '') + '<span>' + esc(it.t) + '</span>' + (it.k ? '<span class="k">' + esc(it.k) + '</span>' : ''));
    b.onclick = () => { closeCtx(); it.f(); };
    ctxHost.appendChild(b);
  });
  ctxHost.classList.add('on');
  const r = ctxHost.getBoundingClientRect();
  ctxHost.style.left = Math.min(x, window.innerWidth - r.width - 8) + 'px';
  ctxHost.style.top = Math.min(y, window.innerHeight - r.height - 8) + 'px';
}
const closeCtx = () => ctxHost.classList.remove('on');
document.addEventListener('mousedown', e => { if (!e.target.closest('#ctx')) closeCtx(); });

/* ============================================================================
   ПРИЛОЖЕНИЕ: ПРОВОДНИК
   ========================================================================== */
WM.register({
  id: 'explorer', title: 'Проводник', icon: ICO.folder, w: 880, h: 540,
  init(rec, startPath) {
    const st = { path: startPath || 'C:\\Users\\Гость', sel: null };
    const hist = [];
    rec.body.innerHTML = `<div class="app">
      <div class="ex-top">
        <button class="btn" data-nav="back">←</button>
        <button class="btn" data-nav="up">↑</button>
        <button class="btn" data-nav="home">Домой</button>
        <div class="crumbs"></div>
        <button class="btn" data-nav="new">${ICO.plus} Папка</button>
      </div>
      <div style="display:flex;flex:1;min-height:0">
        <div class="app-side"></div>
        <div class="app-main files"></div>
      </div>
      <div class="np-status"><span class="st-count"></span><span class="st-sel"></span></div>
    </div>`;
    const files = $('.files', rec.body), crumbs = $('.crumbs', rec.body), side = $('.app-side', rec.body);
    const QUICK = [
      { t: 'Рабочий стол', p: 'C:\\Users\\Гость' },
      { t: 'Документы', p: 'C:\\Users\\Гость\\Документы' },
      { t: 'Изображения', p: 'C:\\Users\\Гость\\Изображения' },
      { t: 'Музыка', p: 'C:\\Users\\Гость\\Музыка' },
      { t: 'Загрузки', p: 'C:\\Users\\Гость\\Загрузки' },
      { t: 'Локальный диск C:', p: 'C:\\' },
      { t: 'Windows', p: 'C:\\Windows' },
      { t: 'Program Files', p: 'C:\\Program Files' },
    ];
    side.innerHTML = QUICK.map(q => `<button class="side-i" data-p="${esc(q.p)}">${ICO.folder}<span>${esc(q.t)}</span></button>`).join('');
    side.onclick = e => { const b = e.target.closest('.side-i'); if (b) go(b.dataset.p); };

    function go(p, push) {
      if (!VFS.node(p)) { Notify('Проводник', 'Путь недоступен: ' + p, ICO.folder); Sound.error(); return; }
      if (push !== false) hist.push(st.path);
      st.path = p; st.sel = null; render();
    }
    function render() {
      const r = VFS.list(st.path);
      crumbs.innerHTML = '';
      const rootB = el('button', null, 'Этот компьютер'); rootB.onclick = () => go('C:\\'); crumbs.appendChild(rootB);
      let acc = '';
      VFS.split(st.path).forEach(pt => {
        crumbs.appendChild(el('i', null, '›'));
        acc += '\\' + pt;
        const target = 'C:' + acc;
        const b = el('button', null, esc(pt)); b.onclick = () => go(target); crumbs.appendChild(b);
      });
      files.innerHTML = '';
      if (!r.items.length) {
        files.innerHTML = '<div style="padding:40px;text-align:center;color:var(--txt-mute);font-size:12.5px;grid-column:1/-1">Папка пуста</div>';
      } else {
        const dirs = r.items.filter(i => i.node.type === 'dir').sort((a, b) => a.name.localeCompare(b.name));
        const fls = r.items.filter(i => i.node.type === 'file').sort((a, b) => a.name.localeCompare(b.name));
        dirs.concat(fls).forEach(item => {
          const isDir = item.node.type === 'dir';
          const ico = isDir ? ICO.folder : ({ txt: ICO.txt, png: ICO.png, code: ICO.code, exe: ICO.exe }[item.node.ext] || ICO.file);
          const f = el('div', 'fitem', ico + '<span>' + esc(item.name) + '</span><small>' + (isDir ? 'Папка' : (VFS.sizeOf(item.node) / 1024).toFixed(1) + ' КБ') + '</small>');
          f.onclick = () => {
            $$('.fitem', files).forEach(x => x.classList.remove('sel')); f.classList.add('sel');
            st.sel = item.name; $('.st-sel', rec.body).textContent = 'Выбрано: ' + item.name;
          };
          f.ondblclick = () => isDir ? go(st.path + '\\' + item.name) : openFile(item.name, item.node);
          f.oncontextmenu = e => {
            e.preventDefault(); e.stopPropagation(); f.onclick();
            const full = st.path + '\\' + item.name;
            openCtx(e.clientX, e.clientY, [
              { t: 'Открыть', i: ICO.exe, f: () => isDir ? go(full) : openFile(item.name, item.node) },
              { t: 'Переименовать', i: ICO.ren, f: () => { const nn = prompt('Новое имя:', item.name); if (nn && nn !== item.name) { VFS.mv(full, st.path + '\\' + nn); render(); } } },
              { t: 'Копировать', i: ICO.copy, f: () => { rec.api.clip = full; Notify('Проводник', 'Скопировано: ' + item.name, ICO.copy, true); } },
              { sep: true },
              { t: 'Удалить', i: ICO.trash, f: () => { const res = VFS.rm(full, true); if (!res.ok) { Sound.error(); Notify('Ошибка', res.err, ICO.trash); } render(); } },
            ]);
          };
          files.appendChild(f);
        });
        $('.st-count', rec.body).textContent = r.items.length + ' элементов';
      }
    }
    function openFile(name, node) {
      const full = st.path + '\\' + name;
      const ext = node.ext;
      if (ext === 'png') WM.open('photos');
      else if (ext === 'wav') WM.open('music');
      else if (ext === 'exe' || ext === 'sys') { Sound.error(); Notify('Система', '«' + name + '» — системный файл, запуск заблокирован.', ICO.shield); }
      else WM.open('notepad', { path: full });
    }
    $('.ex-top', rec.body).onclick = e => {
      const b = e.target.closest('[data-nav]'); if (!b) return;
      const n = b.dataset.nav;
      if (n === 'up') { const p = VFS.parentOf(st.path); go(p.length ? 'C:\\' + p.join('\\') : 'C:\\'); }
      if (n === 'back') { const p = hist.pop(); if (p) go(p, false); }
      if (n === 'home') go('C:\\Users\\Гость');
      if (n === 'new') { const nm = prompt('Имя новой папки:', 'Новая папка'); if (nm) { VFS.mkdir(st.path + '\\' + nm); render(); } }
    };
    files.oncontextmenu = e => {
      if (e.target.closest('.fitem')) return;
      e.preventDefault();
      openCtx(e.clientX, e.clientY, [
        { t: 'Создать папку', i: ICO.plus, f: () => { const nm = prompt('Имя папки:', 'Новая папка'); if (nm) { VFS.mkdir(st.path + '\\' + nm); render(); } } },
        { t: 'Создать текстовый файл', i: ICO.note, f: () => { const nm = prompt('Имя файла:', 'новый.txt'); if (nm) { VFS.write(st.path + '\\' + nm, ''); render(); } } },
        { t: 'Вставить', i: ICO.copy, f: () => { if (rec.api.clip) { VFS.cp(rec.api.clip, st.path + '\\' + VFS.nameOf(rec.api.clip)); render(); } } },
        { sep: true },
        { t: 'Обновить', i: ICO.refresh, f: render },
        { t: 'Свойства', i: ICO.settings, f: () => Notify('Свойства', st.path, ICO.folder, true) },
      ]);
    };
    render();
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: БЛОКНОТ
   ========================================================================== */
WM.register({
  id: 'notepad', title: 'Блокнот', icon: ICO.note, w: 720, h: 500,
  init(rec, arg) {
    const st = { path: (arg && arg.path) || 'C:\\Users\\Гость\\Документы\\без_имени.txt' };
    const r0 = VFS.read(st.path);
    rec.body.innerHTML = `<div class="app">
      <div class="app-bar">
        <button class="btn primary" data-a="save">${ICO.note} Сохранить</button>
        <button class="btn" data-a="new">${ICO.plus} Новый</button>
        <button class="btn" data-a="open">${ICO.folder} Открыть</button>
        <span style="flex:1"></span>
        <button class="btn" data-a="wrap">Перенос</button>
        <button class="btn" data-a="font">A±</button>
      </div>
      <textarea class="np-area" spellcheck="false"></textarea>
      <div class="np-status"><span class="st-pos">Стр 1, стлб 1</span><span class="st-cnt"></span><span class="st-path"></span></div>
    </div>`;
    const ta = $('.np-area', rec.body);
    ta.value = r0.ok ? r0.content : '';
    const upd = () => {
      const upto = ta.value.slice(0, ta.selectionStart).split('\n');
      $('.st-pos', rec.body).textContent = 'Стр ' + upto.length + ', стлб ' + (upto[upto.length - 1].length + 1);
      $('.st-cnt', rec.body).textContent = ta.value.length + ' симв. · ' + ta.value.split(/\s+/).filter(Boolean).length + ' слов';
      $('.st-path', rec.body).textContent = st.path;
      $('.tb-title', rec.node).textContent = (VFS.nameOf(st.path) || 'Без имени') + (rec.dirty ? ' *' : '');
    };
    ta.addEventListener('input', () => { rec.dirty = true; upd(); });
    ta.addEventListener('keyup', upd); ta.addEventListener('click', upd);
    upd();
    $('.app-bar', rec.body).onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'save') {
        VFS.write(st.path, ta.value); rec.dirty = false; upd(); Sound.click();
        Notify('Блокнот', 'Сохранено: ' + VFS.nameOf(st.path), ICO.note, true);
      }
      if (a === 'new') { st.path = 'C:\\Users\\Гость\\Документы\\без_имени.txt'; ta.value = ''; rec.dirty = false; upd(); }
      if (a === 'open') {
        const p = prompt('Путь к файлу:', st.path);
        if (p && VFS.node(p)) { const r = VFS.read(p); st.path = p; ta.value = r.content; rec.dirty = false; upd(); }
        else if (p) { Sound.error(); Notify('Блокнот', 'Файл не найден: ' + p, ICO.note); }
      }
      if (a === 'wrap') ta.style.whiteSpace = ta.style.whiteSpace === 'pre' ? 'pre-wrap' : 'pre';
      if (a === 'font') { const fs = parseInt(getComputedStyle(ta).fontSize); ta.style.fontSize = (fs >= 20 ? 12 : fs + 1) + 'px'; }
    };
    rec.api.setText = t => { ta.value = t; upd(); };
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: ТЕРМИНАЛ
   ========================================================================== */
WM.register({
  id: 'terminal', title: 'Терминал — PowerShell 12', icon: ICO.term, w: 780, h: 470,
  init(rec) {
    const st = { cwd: 'C:\\Users\\Гость', hist: [], hi: 0 };
    rec.body.innerHTML = `<div class="app">
      <div class="term"></div>
      <div class="term-in"><span class="ps1"></span><input spellcheck="false" autocomplete="off"></div>
    </div>`;
    const out = $('.term', rec.body), inp = $('.term-in input', rec.body), ps1 = $('.ps1', rec.body);
    const print = (html, cls) => { out.appendChild(el('div', 'l ' + (cls || ''), html)); out.scrollTop = out.scrollHeight; };
    const prompt_ = () => { ps1.textContent = 'PS ' + st.cwd + '>'; };

    print('<span class="p">PowerShell 12</span> <span class="d">(ядро 12.0.1, сборка 26100)</span>');
    print('<span class="d">Введите «help» для списка команд.</span>');
    print('');
    prompt_();

    const CMDS = {
      help() {
        print(['<span class="y">Доступные команды:</span>',
          '  <span class="g">ls</span>, <span class="g">dir</span>          — список файлов',
          '  <span class="g">cd</span> &lt;путь&gt;          — сменить каталог',
          '  <span class="g">cat</span>, <span class="g">type</span> &lt;файл&gt;   — показать содержимое',
          '  <span class="g">echo</span> &lt;текст&gt; &gt; &lt;файл&gt; — записать в файл',
          '  <span class="g">mkdir</span>, <span class="g">rm</span>, <span class="g">cp</span>, <span class="g">mv</span>  — операции с файлами',
          '  <span class="g">tree</span>              — дерево каталогов',
          '  <span class="g">ps</span>, <span class="g">kill</span> &lt;имя&gt;   — процессы',
          '  <span class="g">neofetch</span>          — сведения о системе',
          '  <span class="g">theme</span> dark|light  — тема оформления',
          '  <span class="g">accent</span> #RRGGBB   — акцентный цвет',
          '  <span class="g">wall</span> aurora|nebula|ember|mint|mono',
          '  <span class="g">open</span> &lt;app&gt;        — запустить приложение',
          '  <span class="g">calc</span> &lt;выраж.&gt;     — вычислить',
          '  <span class="g">date</span>, <span class="g">whoami</span>, <span class="g">ver</span>, <span class="g">clear</span>, <span class="g">exit</span>'].join('\n'));
      },
      ls() {
        const r = VFS.list(st.cwd);
        if (!r.ok) return print('<span class="r">Путь не найден</span>');
        if (!r.items.length) return print('<span class="d">(пусто)</span>');
        r.items.slice().sort((a, b) => a.node.type === b.node.type ? a.name.localeCompare(b.name) : (a.node.type === 'dir' ? -1 : 1))
          .forEach(i => print('  ' + (i.node.type === 'dir' ? '<span class="p">' + esc(i.name) + '\\</span>' : esc(i.name)) +
            ' <span class="d">' + (i.node.type === 'dir' ? '<DIR>' : VFS.sizeOf(i.node) + ' Б') + '</span>'));
      },
      cd(a) {
        if (!a || a === '\\' || a === 'C:\\') { st.cwd = 'C:\\'; prompt_(); return; }
        if (a === '..') { const p = VFS.parentOf(st.cwd); st.cwd = p.length ? 'C:\\' + p.join('\\') : 'C:\\'; prompt_(); return; }
        const target = /^[A-Za-z]:/.test(a) ? a : st.cwd + '\\' + a;
        const n = VFS.node(target);
        if (n && n.type === 'dir') { st.cwd = VFS.norm(target); prompt_(); }
        else { print('<span class="r">cd: путь не найден: ' + esc(a) + '</span>'); }
      },
      cat(a) {
        if (!a) return print('<span class="r">Укажите файл</span>');
        const r = VFS.read(st.cwd + '\\' + a);
        r.ok ? print(esc(r.content) || '<span class="d">(пусто)</span>') : print('<span class="r">' + esc(r.err) + '</span>');
      },
      echo(a) {
        const m = a && a.match(/^(.*?)\s*>\s*(\S+)$/);
        if (m) {
          const w = VFS.write(st.cwd + '\\' + m[2], m[1].replace(/^["']|["']$/g, ''));
          print(w.ok ? '<span class="g">Записано в ' + esc(m[2]) + '</span>' : '<span class="r">' + esc(w.err) + '</span>');
        } else print(esc(a || ''));
      },
      mkdir(a) { if (!a) return print('<span class="r">Укажите имя</span>'); const r = VFS.mkdir(st.cwd + '\\' + a); print(r.ok ? '<span class="g">Каталог создан: ' + esc(a) + '</span>' : '<span class="r">' + esc(r.err) + '</span>'); },
      rm(a) { const p = (a || '').replace(/^-(r|rf)\s*/, ''); if (!p) return print('<span class="r">Укажите имя</span>'); const r = VFS.rm(st.cwd + '\\' + p, true); print(r.ok ? '<span class="g">Удалено: ' + esc(p) + '</span>' : '<span class="r">' + esc(r.err) + '</span>'); },
      cp(a) { const p = (a || '').split(/\s+/); if (!p[1]) return print('<span class="r">cp &lt;источник&gt; &lt;назначение&gt;</span>'); const r = VFS.cp(st.cwd + '\\' + p[0], st.cwd + '\\' + p[1]); print(r.ok ? '<span class="g">Скопировано</span>' : '<span class="r">' + esc(r.err) + '</span>'); },
      mv(a) { const p = (a || '').split(/\s+/); if (!p[1]) return print('<span class="r">mv &lt;источник&gt; &lt;назначение&gt;</span>'); const r = VFS.mv(st.cwd + '\\' + p[0], st.cwd + '\\' + p[1]); print(r.ok ? '<span class="g">Перемещено</span>' : '<span class="r">' + esc(r.err) + '</span>'); },
      tree() {
        const walk = (p, pre) => {
          const items = VFS.list(p).items;
          items.forEach((i, idx) => {
            const last = idx === items.length - 1;
            print(pre + (last ? '└── ' : '├── ') + (i.node.type === 'dir' ? '<span class="p">' + esc(i.name) + '</span>' : esc(i.name)));
            if (i.node.type === 'dir') walk(p + '\\' + i.name, pre + (last ? '    ' : '│   '));
          });
        };
        print('<span class="p">' + esc(st.cwd) + '</span>'); walk(st.cwd, '');
      },


      ps() {
        print('<span class="y">  PID  Имя процесса                    ЦП     Память</span>');
        TaskMan.procs().forEach(p => print('  ' + String(p.pid).padStart(3) + '  ' + p.name.padEnd(28) + String(p.cpu.toFixed(1)).padStart(5) + '%  ' + p.mem + ' МБ'));
      },
      kill(a) {
        if (!a) return print('<span class="r">Укажите процесс</span>');
        const hit = TaskMan.procs().find(p => p.id && p.name.toLowerCase().indexOf(a.toLowerCase()) >= 0);
        if (hit) { WM.close(hit.id); print('<span class="g">Процесс завершён: ' + esc(hit.name) + '</span>'); }
        else print('<span class="r">Процесс не найден: ' + esc(a) + '</span>');
      },
      neofetch() {
        print(['<span class="p">        ▄▄▄▄▄▄▄▄        </span>  <span class="y">Гость@WINDOWS-12</span>',
          '<span class="p">      ▄█████████▄      </span>  ─────────────────────────',
          '<span class="p">     ███████████████   </span>  ОС:        Windows 12 Pro (26100)',
          '<span class="p">     ███  ███  ██████  </span>  Ядро:      nt12 12.0.1-generic',
          '<span class="p">     ███  ███  ██████  </span>  Оболочка:  Shell 12 (веб)',
          '<span class="p">     ███████████████   </span>  Оконный:   WM12, снап на 12 зон',
          '<span class="p">      ▀█████████▀      </span>  Шрифты:    Manrope / Unbounded',
          '<span class="p">        ▀▀▀▀▀▀▀▀        </span>  Тема:      ' + State.theme + ', акцент ' + State.accent,
          '                          Экран:     ' + window.innerWidth + 'x' + window.innerHeight,
          '                          Аптайм:    ' + TaskMan.uptime()].join('\n'));
      },
      theme(a) { if (a === 'dark' || a === 'light') { applyTheme(a); print('<span class="g">Тема: ' + a + '</span>'); } else print('<span class="r">theme dark|light</span>'); },
      accent(a) { if (/^#?[0-9a-fA-F]{6}$/.test(a || '')) { applyAccent(a[0] === '#' ? a : '#' + a); print('<span class="g">Акцент: ' + esc(a) + '</span>'); } else print('<span class="r">accent #RRGGBB</span>'); },
      wall(a) { if (WALLS.indexOf(a) >= 0) { applyWall(a); print('<span class="g">Обои: ' + a + '</span>'); } else print('<span class="r">wall ' + WALLS.join('|') + '</span>'); },
      open(a) {
        const app = Object.keys(Apps).map(k => Apps[k]).find(x => x.id === (a || '').toLowerCase());
        if (app) { WM.open(app.id); print('<span class="g">Запуск: ' + esc(app.title) + '</span>'); }
        else print('<span class="r">Не найдено. Доступно: ' + Object.keys(Apps).join(', ') + '</span>');
      },
      date() { print(esc(new Date().toLocaleString('ru-RU'))); },
      whoami() { print('windows-12\\гость'); },
      ver() { print('Windows 12 Pro, ядро 12.0.1, сборка 26100'); },
      clear() { out.innerHTML = ''; },
      exit() { WM.close(rec.id); },
      calc(a) {
        try { print('<span class="g">' + Function('"use strict";return (' + String(a).replace(/[^0-9+\-*/(). %]/g, '') + ')')() + '</span>'); }
        catch (e) { print('<span class="r">Ошибка выражения</span>'); }
      },
      sudo() { print('<span class="y">Гость не входит в список sudoers. Инцидент будет зарегистрирован.</span>'); },
    };
    CMDS.dir = CMDS.ls; CMDS.type = CMDS.cat; CMDS.cls = CMDS.clear; CMDS.man = CMDS.help;

    function run(line) {
      const trimmed = String(line).trim();
      print('<span class="p">PS ' + esc(st.cwd) + '></span> ' + esc(line));
      if (!trimmed) return;
      st.hist.push(trimmed); st.hi = st.hist.length;
      const sp = trimmed.split(/\s+/);
      const fn = CMDS[sp[0].toLowerCase()];
      if (fn) { try { fn(sp.slice(1).join(' ')); } catch (err) { print('<span class="r">Ошибка: ' + esc(err.message) + '</span>'); } }
      else print('<span class="r">«' + esc(sp[0]) + '» не распознано. Введите «help».</span>');
      out.scrollTop = out.scrollHeight;
    }
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { run(inp.value); inp.value = ''; }
      else if (e.key === 'ArrowUp') { if (st.hi > 0) { st.hi--; inp.value = st.hist[st.hi]; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (st.hi < st.hist.length - 1) { st.hi++; inp.value = st.hist[st.hi]; } else { st.hi = st.hist.length; inp.value = ''; } e.preventDefault(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const c = inp.value.split(/\s+/)[0];
        const m = Object.keys(CMDS).filter(k => k.indexOf(c) === 0);
        if (m.length === 1) inp.value = m[0] + ' ';
      }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; }
    });
    rec.node.addEventListener('mousedown', () => setTimeout(() => inp.focus(), 0));
    setTimeout(() => inp.focus(), 80);
    rec.api.run = run;
  }
});





/* ============================================================================
   ПРИЛОЖЕНИЕ: КАЛЬКУЛЯТОР
   ========================================================================== */
WM.register({
  id: 'calc', title: 'Калькулятор', icon: ICO.calc, w: 340, h: 480,
  init(rec) {
    const st = { cur: '0', prev: null, op: null, fresh: true };
    rec.body.innerHTML = `<div class="calc">
      <div class="calc-sub"></div>
      <div class="calc-out">0</div>
      <div class="calc-pad">
        <button data-k="C" class="op">C</button><button data-k="±" class="op">±</button><button data-k="%" class="op">%</button><button data-k="/" class="op">÷</button>
        <button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button data-k="*" class="op">×</button>
        <button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button data-k="-" class="op">−</button>
        <button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button data-k="+" class="op">+</button>
        <button data-k="0" class="wide">0</button><button data-k=".">.</button><button data-k="=" class="eq">=</button>
      </div></div>`;
    const out = $('.calc-out', rec.body), sub = $('.calc-sub', rec.body);
    const OPS = {
      '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b,
      '/': (a, b) => b === 0 ? NaN : a / b, '%': (a, b) => a % b,
    };
    const round = n => Number.isFinite(n) ? String(Math.round(n * 1e10) / 1e10) : 'Ошибка';
    const show = () => {
      out.textContent = st.cur.length > 13 ? Number(st.cur).toPrecision(9) : st.cur;
      sub.textContent = st.prev !== null && st.op ? st.prev + ' ' + st.op : '';
    };
    function press(k) {
      Sound.click();
      if (/[0-9]/.test(k)) { st.cur = st.fresh ? k : (st.cur === '0' ? k : st.cur + k); st.fresh = false; }
      else if (k === '.') { if (st.fresh) { st.cur = '0.'; st.fresh = false; } else if (st.cur.indexOf('.') < 0) st.cur += '.'; }
      else if (k === 'C') { st.cur = '0'; st.prev = null; st.op = null; st.fresh = true; }
      else if (k === '±') st.cur = st.cur.charAt(0) === '-' ? st.cur.slice(1) : '-' + st.cur;
      else if (k === '%') st.cur = round(parseFloat(st.cur) / 100);
      else if (k === '=') {
        if (st.op && st.prev !== null) {
          st.cur = round(OPS[st.op](parseFloat(st.prev), parseFloat(st.cur)));
          st.prev = null; st.op = null; st.fresh = true;
        }
      } else {
        if (st.op && st.prev !== null && !st.fresh) st.cur = round(OPS[st.op](parseFloat(st.prev), parseFloat(st.cur)));
        st.prev = st.cur; st.op = k; st.fresh = true;
      }
      show();
    }
    $('.calc-pad', rec.body).onclick = e => { const b = e.target.closest('button'); if (b) press(b.dataset.k); };
    rec.node.addEventListener('keydown', e => {
      const map = { Enter: '=', '=': '=', Escape: 'C', Backspace: 'C', x: '*' };
      const k = map[e.key] || e.key;
      if (/^[0-9+\-*/.%]$/.test(k)) { press(k); e.preventDefault(); }
    });
    rec.node.tabIndex = 0;
    setTimeout(() => rec.node.focus(), 60);
    show();
  }
});

/* ============================================================================
   ОФОРМЛЕНИЕ: ПАЛИТРА, ТЕМА, ОБОИ
   ========================================================================== */
const WALLS = ['aurora', 'nebula', 'ember', 'mint', 'mono'];
const ACCENTS = [
  { a: '#5cc8ff', b: '#7b6cff', t: 'Аврора' },
  { a: '#2ee6c5', b: '#38bdf8', t: 'Мята' },
  { a: '#ff5c9e', b: '#7b6cff', t: 'Магента' },
  { a: '#ffb454', b: '#ff5f6d', t: 'Янтарь' },
  { a: '#a78bfa', b: '#6366f1', t: 'Фиалка' },
  { a: '#38e0a8', b: '#0ea5e9', t: 'Изумруд' },
];
const hexToRgb = h => {
  const m = h.replace('#', '');
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const n = parseInt(full, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
};
const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* хранилище недоступно */ } };

function applyAccent(hex, second) {
  const rgb = hexToRgb(hex);
  const lum = (.299 * rgb[0] + .587 * rgb[1] + .114 * rgb[2]) / 255;
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-2', second || hex);
  document.documentElement.style.setProperty('--accent-ink', lum > .62 ? '#08131f' : '#ffffff');
  State.accent = hex; State.accent2 = second || hex;
  $$('#accChips .chip').forEach(c => c.classList.toggle('on', c.dataset.a === hex));
  save('w12.accent', hex + '|' + (second || hex));
}
function applyTheme(t) {
  State.theme = t;
  document.documentElement.dataset.theme = t;
  $$('.qs-t[data-t="night"]').forEach(b => b.classList.toggle('on', t === 'light'));
  save('w12.theme', t);
}
function applyWall(w) {
  State.wallpaper = w;
  $('#wall').dataset.wp = w;
  $('.lock-bg').dataset.wp = w;
  $$('#wpChips .chip').forEach(c => c.classList.toggle('on', c.dataset.w === w));
  save('w12.wall', w);
}
function applyTransparency(on) {
  State.transparency = on;
  document.body.classList.toggle('no-transparency', !on);
  save('w12.transp', on ? '1' : '0');
}
function applyAlign(a) {
  State.align = a;
  $('#taskbar').dataset.align = a;
  save('w12.align', a);
}

/* ============================================================================
   ДИСПЕТЧЕР ЗАДАЧ (данные)
   ========================================================================== */
const TaskMan = (() => {
  const bootTime = Date.now();
  const SYS = [
    { pid: 4, name: 'System', base: 1.2, mem: 88 },
    { pid: 108, name: 'nt12 Kernel', base: 2.4, mem: 214 },
    { pid: 512, name: 'WM12 (оконный менеджер)', base: 1.8, mem: 132 },
    { pid: 620, name: 'Shell 12', base: 3.1, mem: 168 },
    { pid: 704, name: 'AudioSrv', base: .6, mem: 54 },
    { pid: 812, name: 'Defender 12', base: 1.1, mem: 96 },
  ];
  function procs() {
    const list = SYS.map(s => Object.assign({}, s, { id: null, sys: true, cpu: Math.max(.1, s.base + Math.sin(Date.now() / 2600 + s.pid) * 1.6) }));
    Object.keys(State.open).forEach(k => {
      const r = State.open[k];
      list.push({
        pid: 1024 + (k.length * 37) % 9000, name: r.def.title, id: k, icon: r.def.icon, sys: false,
        cpu: Math.max(.2, 1.5 + Math.sin(Date.now() / 1700 + r.w) * 2.4),
        mem: Math.round(60 + r.w * r.h / 4200),
      });
    });
    return list.sort((a, b) => b.cpu - a.cpu);
  }
  const uptime = () => {
    const s = Math.floor((Date.now() - bootTime) / 1000);
    return Math.floor(s / 3600) + 'ч ' + pad(Math.floor(s % 3600 / 60)) + 'м ' + pad(s % 60) + 'с';
  };
  return { procs, uptime };
})();

WM.register({
  id: 'taskmgr', title: 'Диспетчер задач', icon: ICO.task, w: 820, h: 520,
  init(rec) {
    let tab = 'proc';
    rec.body.innerHTML = `<div class="app">
      <div class="tm-tabs">
        <button data-t="proc" class="on">Процессы</button>
        <button data-t="perf">Производительность</button>
        <button data-t="startup">Автозагрузка</button>
      </div>
      <div class="app-main"></div>
    </div>`;
    const main = $('.app-main', rec.body);

    function procTab() {
      main.innerHTML = '<div class="tm-row head"><span>Имя</span><span>ЦП</span><span>Память</span><span>Тип</span><span></span></div><div class="pr"></div>';
      const host = $('.pr', main);
      const draw = () => {
        host.innerHTML = '';
        TaskMan.procs().forEach(p => {
          const row = el('div', 'tm-row',
            '<span class="nm">' + (p.icon || ICO.cpu) + '<span>' + esc(p.name) +
              '<div class="mini"><i style="width:' + clamp(p.cpu * 8, 2, 100) + '%"></i></div></span></span>' +
            '<span>' + p.cpu.toFixed(1) + '%</span><span>' + p.mem + ' МБ</span>' +
            '<span>' + (p.sys ? 'Система' : 'Приложение') + '</span>' +
            '<span>' + (p.id ? '<button class="tm-kill">Снять</button>' : '') + '</span>');
          const kb = $('.tm-kill', row);
          if (kb) kb.onclick = () => { WM.close(p.id); Sound.click(); };
          host.appendChild(row);
        });
      };
      draw();
      rec.api.iv = setInterval(() => { if (State.open[rec.id]) draw(); }, 1800);
    }
    function perfTab() {
      const cpu = TaskMan.procs().reduce((s, p) => s + p.cpu, 0) / 6;
      main.innerHTML = `<div style="padding:20px">
        <div class="set-card" style="margin-bottom:12px"><h5>Процессор · nt12 12.0.1 · 16 ядер</h5>
          <div style="font-family:var(--font-display);font-size:38px;font-weight:300">${clamp(cpu, 1, 99).toFixed(0)}%</div>
          <canvas class="cpu-graph" width="760" height="130" style="width:100%;height:130px;border-radius:12px;background:rgba(0,0,0,.3)"></canvas></div>
        <div class="set-grid" style="padding:0">
          <div class="set-card"><h5>Память</h5><div style="font-size:26px;font-family:var(--font-display);font-weight:300">9.4 / 32 ГБ</div></div>
          <div class="set-card"><h5>Графика · WM12 GPU</h5><div style="font-size:26px;font-family:var(--font-display);font-weight:300">${clamp(cpu * 1.3, 2, 99).toFixed(0)}%</div></div>
          <div class="set-card"><h5>Аптайм</h5><div style="font-size:22px;font-family:var(--font-display);font-weight:300">${TaskMan.uptime()}</div></div>
          <div class="set-card"><h5>Сеть</h5><div style="font-size:22px;font-family:var(--font-display);font-weight:300">1.2 Гбит/с</div></div>
        </div></div>`;
      const cv = $('.cpu-graph', main), g = cv.getContext('2d');
      const pts = [];
      for (let i = 0; i < 60; i++) pts.push(20 + Math.random() * 30);
      const paint = () => {
        g.clearRect(0, 0, cv.width, cv.height);
        const X = i => i / (pts.length - 1) * cv.width, Y = p => cv.height - p / 100 * cv.height;
        g.beginPath(); g.moveTo(0, cv.height);
        pts.forEach((p, i) => g.lineTo(X(i), Y(p)));
        g.lineTo(cv.width, cv.height); g.closePath();
        const grd = g.createLinearGradient(0, 0, 0, cv.height);
        grd.addColorStop(0, State.accent + 'cc'); grd.addColorStop(1, State.accent + '00');
        g.fillStyle = grd; g.fill();
        g.beginPath();
        pts.forEach((p, i) => i ? g.lineTo(X(i), Y(p)) : g.moveTo(X(i), Y(p)));
        g.strokeStyle = State.accent; g.lineWidth = 2; g.stroke();
      };
      paint();
      rec.api.iv = setInterval(() => {
        if (!State.open[rec.id]) return;
        pts.push(clamp(10 + Math.random() * 70, 2, 98)); pts.shift(); paint();
      }, 700);
    }
    function startupTab() {
      const NAMES = ['Shell 12', 'Defender 12', 'AudioSrv', 'WM12', 'CloudSync'];
      main.innerHTML = '<div style="padding:16px">' + NAMES.map((n, i) =>
        '<div class="set-row" style="border-bottom:1px solid var(--stroke)"><span>' + n + '</span><div class="sw ' + (i < 3 ? 'on' : '') + '"></div></div>').join('') + '</div>';
      main.onclick = e => { const s = e.target.closest('.sw'); if (s) { s.classList.toggle('on'); Sound.click(); } };
    }
    function render() { if (tab === 'proc') procTab(); else if (tab === 'perf') perfTab(); else startupTab(); }
    $('.tm-tabs', rec.body).onclick = e => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      tab = b.dataset.t;
      $$('.tm-tabs button', rec.body).forEach(x => x.classList.toggle('on', x === b));
      clearInterval(rec.api.iv); main.onclick = null; render();
    };
    render();
  },
  onClose(rec) { clearInterval(rec.api.iv); },
});
/* ============================================================================
   ПРИЛОЖЕНИЕ: ФОТОГРАФИИ
   ========================================================================== */
const ART = i => {
  const P = [['#2ee6c5', '#7b6cff'], ['#ff5c9e', '#7b6cff'], ['#ffb454', '#ff5f6d'], ['#5cc8ff', '#2ee6c5'], ['#a78bfa', '#5cc8ff'], ['#38e0a8', '#0ea5e9']][i % 6];
  return 'background:radial-gradient(circle at 30% 20%,' + P[0] + ',transparent 60%),radial-gradient(circle at 75% 80%,' + P[1] + ',transparent 62%),linear-gradient(160deg,#0a0d18,#04050a)';
};
const PHOTOS = ['Аврора над хребтом', 'Туманность Орбита', 'Закат на Эмбер-9', 'Ледяной поток', 'Спектр ядра', 'Мятный горизонт', 'Северное сияние', 'Квантовый рассвет', 'Тихий сектор'];

WM.register({
  id: 'photos', title: 'Фотографии', icon: ICO.photos, w: 840, h: 560,
  init(rec) {
    rec.body.innerHTML = '<div class="app">' +
      '<div class="app-bar"><b style="font-size:12.5px">Коллекция «Обои Windows 12»</b><span style="flex:1"></span>' +
      '<span style="font-size:11.5px;color:var(--txt-dim)">' + PHOTOS.length + ' изображений</span></div>' +
      '<div class="app-main"><div class="gal">' + PHOTOS.map((n, i) =>
        '<figure data-i="' + i + '"><div class="art" style="' + ART(i) + '"></div><figcaption>' + esc(n) + '</figcaption></figure>').join('') +
      '</div></div></div>';
    $('.gal', rec.body).onclick = e => {
      const f = e.target.closest('figure'); if (!f) return;
      Sound.click();
      const i = +f.dataset.i;
      WM.open('viewer', { i, name: PHOTOS[i] });
    };
  }
});

WM.register({
  id: 'viewer', title: 'Просмотр', icon: ICO.photos, w: 800, h: 580, multi: true,
  init(rec, arg) {
    rec.body.innerHTML = '<div class="app" style="background:#05060c">' +
      '<div class="app-bar"><b style="font-size:12.5px">' + esc(arg.name) + '</b><span style="flex:1"></span>' +
      '<button class="btn" data-a="wall">Сделать обоями</button><button class="btn" data-a="close">Закрыть</button></div>' +
      '<div style="flex:1;display:grid;place-items:center;padding:24px">' +
      '<div style="width:min(660px,92%);aspect-ratio:16/10;border-radius:18px;box-shadow:var(--shadow-w);' + ART(arg.i) + '"></div></div></div>';
    $('.app-bar', rec.body).onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'wall') { applyWall(WALLS[arg.i % WALLS.length]); Notify('Обои', 'Фон рабочего стола обновлён', ICO.photos, true); }
      else WM.close(rec.id);
    };
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: PAINT 12
   ========================================================================== */
WM.register({
  id: 'paint', title: 'Paint 12', icon: ICO.paint, w: 900, h: 620,
  init(rec) {
    const COLORS = ['#5cc8ff', '#7b6cff', '#ff5c9e', '#ffb454', '#38e0a8', '#ffffff', '#ff5f6d', '#101528'];
    rec.body.innerHTML = `<div class="app">
      <div class="app-bar">
        <input type="color" id="pColor" value="#5cc8ff" style="width:36px;height:30px;border:none;background:none">
        <div class="palette">${COLORS.map((c, i) => '<button class="pc ' + (i === 0 ? 'on' : '') + '" data-c="' + c + '" style="background:' + c + '"></button>').join('')}</div>
        <input type="range" id="pSize" min="1" max="42" value="5" style="max-width:110px">
        <span id="pSizeTxt" class="mono" style="font-size:11px">5 px</span>
        <span style="flex:1"></span>
        <button class="btn" data-a="eraser">Ластик</button>
        <button class="btn" data-a="fill">Залить</button>
        <button class="btn" data-a="clear">${ICO.trash} Очистить</button>
        <button class="btn primary" data-a="save">Сохранить</button>
      </div>
      <div class="paint-wrap"><canvas id="pCv" width="1280" height="820" style="width:min(100%,1280px);height:auto"></canvas></div>
      <div class="np-status"><span id="pPos">0, 0</span><span>ЛКМ — рисовать · ПКМ — стирать</span></div>
    </div>`;
    const cv = $('#pCv', rec.body), g = cv.getContext('2d');
    g.fillStyle = '#0d1020'; g.fillRect(0, 0, cv.width, cv.height);
    let color = '#5cc8ff', size = 5, eraser = false, drawing = false, last = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    const stroke = (a, b, c, w) => {
      g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    };
    const ink = right => right ? '#0d1020' : (eraser ? '#0d1020' : color);
    const width = right => right ? size * 2.2 : size;
    cv.addEventListener('pointerdown', e => {
      drawing = true; cv.setPointerCapture(e.pointerId); last = pos(e);
      stroke(last, { x: last.x + .01, y: last.y }, ink(e.button === 2), width(e.button === 2));
    });
    cv.addEventListener('pointermove', e => {
      const p = pos(e);
      $('#pPos', rec.body).textContent = (p.x | 0) + ', ' + (p.y | 0);
      if (!drawing) return;
      stroke(last, p, ink(e.buttons === 2), width(e.buttons === 2));
      last = p;
    });
    cv.addEventListener('pointerup', () => { drawing = false; });
    cv.addEventListener('contextmenu', e => e.preventDefault());
    $('.app-bar', rec.body).onclick = e => {
      const c = e.target.closest('.pc');
      if (c) { color = c.dataset.c; eraser = false; $$('.pc', rec.body).forEach(x => x.classList.toggle('on', x === c)); return; }
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'eraser') { eraser = !eraser; b.classList.toggle('primary', eraser); }
      if (a === 'fill') { g.fillStyle = color; g.fillRect(0, 0, cv.width, cv.height); }
      if (a === 'clear') { g.fillStyle = '#0d1020'; g.fillRect(0, 0, cv.width, cv.height); }
      if (a === 'save') Notify('Paint 12', 'Рисунок сохранён в C:\\Users\\Гость\\Изображения\\figure.png', ICO.paint);
    };
    $('#pSize', rec.body).oninput = e => { size = +e.target.value; $('#pSizeTxt', rec.body).textContent = size + ' px'; };
    $('#pColor', rec.body).oninput = e => { color = e.target.value; eraser = false; $$('.pc', rec.body).forEach(x => x.classList.remove('on')); };
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: МУЗЫКА (синтез через Web Audio API)
   ========================================================================== */
WM.register({
  id: 'music', title: 'Музыка', icon: ICO.music, w: 660, h: 600,
  init(rec) {
    const TRACKS = [
      { n: 'Сигнал', a: 'Orbital', s: [220, 277, 330, 440], bpm: 96 },
      { n: 'Орбита', a: 'Aurora Set', s: [196, 247, 294, 392], bpm: 84 },
      { n: 'Ядро 12', a: 'Kernel Band', s: [262, 330, 392, 523], bpm: 112 },
    ];
    let ti = 0, playing = false, step = 0, actx = null, analyser = null, gainNode = null;
    rec.body.innerHTML = `<div class="app"><div class="mus">
      <div class="mus-art">${ICO.music}</div>
      <div style="text-align:center"><h3 class="t-name"></h3><p class="t-art"></p></div>
      <canvas class="viz"></canvas>
      <div class="mus-ctrl">
        <button data-a="prev">${ICO.prev}</button>
        <button data-a="play" class="play">${ICO.play}</button>
        <button data-a="next">${ICO.next}</button>
      </div>
      <input type="range" id="musVol" min="0" max="100" value="${State.volume}">
    </div></div>`;
    const art = $('.mus-art', rec.body), canvas = $('.viz', rec.body), g = canvas.getContext('2d');
    const nameEl = $('.t-name', rec.body), artEl = $('.t-art', rec.body);

    function ensure() {
      if (actx) return;
      actx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = actx.createGain(); gainNode.gain.value = State.volume / 100;
      analyser = actx.createAnalyser(); analyser.fftSize = 128;
      gainNode.connect(analyser); analyser.connect(actx.destination);
    }
    function note(freq, t, dur, type) {
      const o = actx.createOscillator(), gn = actx.createGain();
      o.type = type; o.frequency.value = freq;
      gn.gain.setValueAtTime(0, t);
      gn.gain.linearRampToValueAtTime(.16, t + .02);
      gn.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(gn); gn.connect(gainNode); o.start(t); o.stop(t + dur + .05);
    }
    function tick() {
      ensure();
      const tr = TRACKS[ti], beat = 60 / tr.bpm / 2, t = actx.currentTime + .05;
      note(tr.s[step % tr.s.length], t, beat * 1.7, step % 4 === 0 ? 'triangle' : 'sine');
      if (step % 4 === 0) note(tr.s[0] / 2, t, beat * 3.4, 'sine');
      step++;
    }
    function draw() {
      requestAnimationFrame(draw);
      const w = canvas.width = canvas.clientWidth, h = canvas.height = canvas.clientHeight;
      if (!w || !h) return;
      g.clearRect(0, 0, w, h);
      if (!analyser) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const bw = w / data.length;
      for (let i = 0; i < data.length; i++) {
        const bh = data[i] / 255 * h * .92;
        g.fillStyle = i % 2 ? State.accent : State.accent2;
        g.globalAlpha = .85;
        g.fillRect(i * bw + 1, h - bh, Math.max(1, bw - 2), bh);
      }
      g.globalAlpha = 1;
    }
    draw();
    function setTrack(i, autoplay) {
      ti = (i + TRACKS.length) % TRACKS.length; step = 0;
      nameEl.textContent = TRACKS[ti].n;
      artEl.textContent = TRACKS[ti].a + ' · Windows 12 Sessions';
      $('.tb-title', rec.node).textContent = 'Музыка — ' + TRACKS[ti].n;
      if (autoplay) start();
    }
    function start() {
      ensure();
      if (actx.state === 'suspended') actx.resume();
      playing = true; art.classList.add('playing');
      $('[data-a="play"]', rec.body).innerHTML = ICO.pause;
      clearInterval(rec.api.iv);
      rec.api.iv = setInterval(tick, 60 / TRACKS[ti].bpm / 2 * 1000);
    }
    function stop() {
      playing = false; art.classList.remove('playing');
      $('[data-a="play"]', rec.body).innerHTML = ICO.play;
      clearInterval(rec.api.iv);
    }
    $('.mus-ctrl', rec.body).onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      Sound.click();
      const a = b.dataset.a;
      if (a === 'play') { if (playing) stop(); else start(); }
      if (a === 'next') setTrack(ti + 1, playing);
      if (a === 'prev') setTrack(ti - 1, playing);
    };
    $('#musVol', rec.body).oninput = e => {
      State.volume = +e.target.value;
      if (gainNode) gainNode.gain.value = State.volume / 100;
      $('#vol').value = State.volume;
    };
    setTrack(0, false);
    rec.api.stop = stop;
  },
  onClose(rec) { if (rec.api.stop) rec.api.stop(); clearInterval(rec.api.iv); },
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: КАЛЕНДАРЬ
   ========================================================================== */
WM.register({
  id: 'calendar', title: 'Календарь', icon: ICO.cal, w: 780, h: 560,
  init(rec) {
    const cur = new Date(); cur.setDate(1);
    const EVENTS = { 3: 'Синк ядра', 11: 'Ревью WM12', 17: 'Релиз 12.0.1', 24: 'Демо команде' };
    function render() {
      const y = cur.getFullYear(), m = cur.getMonth();
      const start = (new Date(y, m, 1).getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const today = new Date();
      let cells = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => '<div class="h">' + d + '</div>').join('');
      for (let i = 0; i < start; i++) cells += '<div class="out">' + (new Date(y, m, -start + i + 1).getDate()) + '</div>';
      for (let d = 1; d <= days; d++) {
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        const ev = EVENTS[d];
        cells += '<div class="' + (isToday ? 'today' : '') + (ev ? ' ev' : '') + '">' + d +
          (ev ? '<div style="font-size:9.5px;opacity:.85;margin-top:4px;font-weight:500">' + esc(ev) + '</div>' : '') + '</div>';
      }
      const tail = (7 - ((start + days) % 7)) % 7;
      for (let i = 1; i <= tail; i++) cells += '<div class="out">' + i + '</div>';
      rec.body.innerHTML = '<div class="app"><div class="cal">' +
        '<div class="cal-head"><h2>' + MON[m] + ' ' + y + '</h2>' +
        '<div style="display:flex;gap:8px"><button class="btn" data-a="prev">←</button><button class="btn" data-a="today">Сегодня</button><button class="btn" data-a="next">→</button></div></div>' +
        '<div class="cal-grid">' + cells + '</div></div></div>';
      $('.cal-head', rec.body).onclick = e => {
        const b = e.target.closest('[data-a]'); if (!b) return;
        if (b.dataset.a === 'prev') cur.setMonth(cur.getMonth() - 1);
        if (b.dataset.a === 'next') cur.setMonth(cur.getMonth() + 1);
        if (b.dataset.a === 'today') { const n = new Date(); cur.setFullYear(n.getFullYear(), n.getMonth(), 1); }
        render();
      };
    }
    render();
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: ORBIT MAIL
   ========================================================================== */
WM.register({
  id: 'mail', title: 'Orbit Mail', icon: ICO.mail, w: 840, h: 560,
  init(rec) {
    const MAIL = [
      { f: 'Ядро · Отдел релизов', s: 'Windows 12.0.1 — окно обновления', t: '10:42', b: 'Планируем выкатку на четверг. Проверьте совместимость WM12 со снапом на 12 зон и обновите базовые образы.' },
      { f: 'Команда дизайна', s: 'Новая тема «Магента»', t: '09:15', b: 'Добавили акцент с градиентом и переработали панель задач. Макеты приложены к задаче.' },
      { f: 'Орбитальная станция', s: 'Пропускной режим на неделю', t: 'Вчера', b: 'Подтвердите график смен, пожалуйста. Свободные слоты: 03:00 и 11:00 по бортовому времени.' },
      { f: 'Defender 12', s: 'Еженедельный отчёт', t: 'Пн', b: 'За неделю обработано 1 284 события, угроз не выявлено. База сигнатур обновлена.' },
    ];
    let sel = 0;
    function render() {
      rec.body.innerHTML = '<div class="app" style="flex-direction:row">' +
        '<div class="app-side">' + MAIL.map((m, i) =>
          '<button class="side-i ' + (i === sel ? 'on' : '') + '" data-m="' + i + '" style="flex-direction:column;align-items:flex-start;gap:3px">' +
          '<b style="font-size:12px">' + esc(m.f) + '</b>' +
          '<span style="font-size:11px;color:var(--txt-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%">' + esc(m.s) + '</span></button>').join('') + '</div>' +
        '<div class="app-main" style="padding:24px">' +
          '<h2 style="font-family:var(--font-display);font-weight:400;font-size:19px">' + esc(MAIL[sel].s) + '</h2>' +
          '<div style="display:flex;gap:10px;align-items:center;margin:14px 0 20px">' +
            '<div class="avatar" style="width:36px;height:36px;font-size:13px">' + esc(MAIL[sel].f.charAt(0)) + '</div>' +
            '<div><b style="font-size:12.5px">' + esc(MAIL[sel].f) + '</b>' +
            '<div style="font-size:11px;color:var(--txt-dim)">кому: гость@windows-12 · ' + esc(MAIL[sel].t) + '</div></div></div>' +
          '<p style="font-size:13px;line-height:1.75;color:var(--txt-dim)">' + esc(MAIL[sel].b) + '</p>' +
          '<div style="margin-top:24px;display:flex;gap:10px">' +
            '<button class="btn primary" data-r="reply">Ответить</button>' +
            '<button class="btn" data-r="fwd">Переслать</button>' +
            '<button class="btn" data-r="del">Удалить</button></div>' +
        '</div></div>';
      $('.app-side', rec.body).onclick = e => { const b = e.target.closest('[data-m]'); if (b) { sel = +b.dataset.m; render(); } };
      $('.app-main', rec.body).onclick = e => {
        const b = e.target.closest('[data-r]'); if (!b) return;
        const msgs = { reply: 'Черновик ответа создан', fwd: 'Письмо переслано', del: 'Письмо перемещено в удалённые' };
        Notify('Orbit Mail', msgs[b.dataset.r], ICO.mail, true);
      };
    }
    render();
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: МАГАЗИН
   ========================================================================== */
WM.register({
  id: 'store', title: 'Магазин', icon: ICO.store, w: 880, h: 580,
  init(rec) {
    const ITEMS = [
      { n: 'Orbit Mail', d: 'Почтовый клиент', i: ICO.mail, app: 'mail' },
      { n: 'Defender 12', d: 'Защита в реальном времени', i: ICO.shield, app: 'security' },
      { n: 'Photos', d: 'Галерея и обои', i: ICO.photos, app: 'photos' },
      { n: 'Paint 12', d: 'Растровый редактор', i: ICO.paint, app: 'paint' },
      { n: 'Music', d: 'Синтезатор и плеер', i: ICO.music, app: 'music' },
      { n: 'Terminal', d: 'PowerShell 12', i: ICO.term, app: 'terminal' },
      { n: 'Календарь', d: 'Планирование', i: ICO.cal, app: 'calendar' },
      { n: 'Диспетчер задач', d: 'Процессы и производительность', i: ICO.task, app: 'taskmgr' },
    ];
    rec.body.innerHTML = '<div class="app">' +
      '<div class="app-bar"><b style="font-size:13px">Магазин Windows 12</b><span style="flex:1"></span>' +
      '<span style="font-size:11.5px;color:var(--txt-dim)">Установлено: ' + ITEMS.length + '</span></div>' +
      '<div class="app-main" style="padding:16px">' +
        '<div style="border-radius:18px;padding:26px;margin-bottom:18px;background:linear-gradient(140deg,rgba(92,200,255,.22),rgba(123,108,255,.14));border:1px solid var(--stroke)">' +
          '<div style="font-family:var(--font-display);font-weight:400;font-size:24px">Избранное этой недели</div>' +
          '<p style="font-size:12.5px;color:var(--txt-dim);margin-top:8px">Приложения, оптимизированные для WM12 и снапа на 12 зон.</p></div>' +
        '<div class="gal">' + ITEMS.map(a =>
          '<figure style="cursor:default"><div class="art" style="display:grid;place-items:center;background:linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border-bottom:1px solid var(--stroke)">' +
          '<span style="width:52px;height:52px;display:block;color:var(--accent)">' + a.i + '</span></div>' +
          '<figcaption style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
          '<span><b style="display:block;font-size:12.5px;color:var(--txt)">' + a.n + '</b>' +
          '<small style="color:var(--txt-mute)">' + a.d + '</small></span>' +
          '<button class="btn primary" data-open="' + a.app + '" style="padding:6px 12px">Открыть</button></figcaption></figure>').join('') +
        '</div></div></div>';
    $('.app-main', rec.body).onclick = e => { const b = e.target.closest('[data-open]'); if (b) WM.open(b.dataset.open); };
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: БЕЗОПАСНОСТЬ WINDOWS
   ========================================================================== */
WM.register({
  id: 'security', title: 'Безопасность Windows', icon: ICO.shield, w: 740, h: 540,
  init(rec) {
    const CHECKS = [
      { t: 'Защита от вирусов и угроз', s: 'Активна · базы обновлены', ok: true },
      { t: 'Безопасность аккаунта', s: 'Локальная учётная запись «Гость»', ok: true },
      { t: 'Брандмауэр и сеть', s: 'Профиль ORBITAL-5G защищён', ok: true },
      { t: 'Управление приложениями', s: 'Контроль SmartScreen включён', ok: true },
      { t: 'Изоляция ядра', s: 'Виртуализация памяти включена', ok: true },
      { t: 'Резервное копирование', s: 'Последняя копия: 2 дня назад', ok: false },
    ];
    rec.body.innerHTML = '<div class="app">' +
      '<div class="app-bar"><b style="font-size:13px">Безопасность Windows 12</b><span style="flex:1"></span>' +
      '<button class="btn" data-a="scan">' + ICO.shield + ' Быстрая проверка</button></div>' +
      '<div class="app-main" style="padding:16px">' +
        '<div style="display:flex;align-items:center;gap:18px;padding:22px;border-radius:18px;margin-bottom:16px;background:linear-gradient(140deg,rgba(56,224,168,.2),rgba(92,200,255,.12));border:1px solid var(--stroke)">' +
          '<span style="width:52px;height:52px;color:var(--ok);display:block">' + ICO.shield + '</span>' +
          '<div><div style="font-family:var(--font-display);font-weight:400;font-size:20px">Устройство защищено</div>' +
          '<p style="font-size:12.5px;color:var(--txt-dim);margin-top:6px">Последняя проверка: только что · 0 угроз</p></div></div>' +
        CHECKS.map(c => '<div class="set-row" style="border-bottom:1px solid var(--stroke)">' +
          '<span><b style="display:block;font-size:12.5px">' + c.t + '</b>' +
          '<small style="color:var(--txt-dim);font-weight:500">' + c.s + '</small></span>' +
          '<span style="color:' + (c.ok ? 'var(--ok)' : 'var(--warn)') + ';font-size:11.5px;font-weight:700">' + (c.ok ? 'Защищено' : 'Требует внимания') + '</span></div>').join('') +
      '</div></div>';
    $('[data-a="scan"]', rec.body).onclick = e => {
      const b = e.currentTarget; b.textContent = 'Проверка…'; b.disabled = true;
      let n = 0;
      const iv = setInterval(() => {
        n += Math.floor(Math.random() * 420);
        Notify('Defender 12', 'Проверено объектов: ' + n, ICO.shield, true);
        if (n > 2400) {
          clearInterval(iv);
          b.textContent = 'Быстрая проверка'; b.disabled = false;
          Notify('Defender 12', 'Угроз не обнаружено. 0 файлов на карантине.', ICO.shield);
        }
      }, 400);
      rec.api.iv = iv;
    };
  },
  onClose(rec) { clearInterval(rec.api.iv); },
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: ПАРАМЕТРЫ
   ========================================================================== */
WM.register({
  id: 'settings', title: 'Параметры', icon: ICO.settings, w: 920, h: 620,
  init(rec) {
    const SEC = [
      { id: 'pers', t: 'Персонализация', i: ICO.paint },
      { id: 'task', t: 'Панель задач', i: ICO.task },
      { id: 'sys', t: 'Система', i: ICO.cpu },
      { id: 'apps', t: 'Приложения', i: ICO.store },
      { id: 'about', t: 'О системе', i: ICO.shield },
    ];
    let sec = 'pers';
    rec.body.innerHTML = '<div class="app" style="flex-direction:row">' +
      '<div class="app-side">' +
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 8px 16px">' +
          '<div class="avatar" style="width:34px;height:34px;font-size:13px">Г</div>' +
          '<div><b style="font-size:12.5px">Гость</b><div style="font-size:10.5px;color:var(--txt-dim)">Локальная запись</div></div></div>' +
        SEC.map(s => '<button class="side-i ' + (s.id === sec ? 'on' : '') + '" data-s="' + s.id + '">' + s.i + '<span>' + s.t + '</span></button>').join('') +
      '</div><div class="app-main"></div></div>';
    const main = $('.app-main', rec.body);
    const head = (t, d) => '<div style="padding:20px 20px 4px"><h2 style="font-family:var(--font-display);font-weight:400;font-size:22px">' + t + '</h2>' +
      (d ? '<p style="color:var(--txt-dim);font-size:12.5px;margin-top:6px">' + d + '</p>' : '') + '</div>';

    const PAGES = {
      pers() {
        return head('Персонализация', 'Тема, акцентный цвет и фон рабочего стола.') + '<div class="set-grid">' +
          '<div class="set-card"><h5>Режим оформления</h5><div class="qs-chips">' +
            '<button class="chip ' + (State.theme === 'dark' ? 'on' : '') + '" data-th="dark">' + ICO.moon + ' Тёмная</button>' +
            '<button class="chip ' + (State.theme === 'light' ? 'on' : '') + '" data-th="light">' + ICO.sun + ' Светлая</button></div>' +
            '<div class="set-row" style="margin-top:12px"><span>Прозрачность</span><div class="sw ' + (State.transparency ? 'on' : '') + '" data-sw="transp"></div></div>' +
            '<div class="set-row"><span>Ночной свет</span><div class="sw ' + (State.night ? 'on' : '') + '" data-sw="night"></div></div></div>' +
          '<div class="set-card"><h5>Акцентный цвет</h5><div class="swatches" id="accSw"></div>' +
            '<div style="margin-top:14px;font-size:11.5px;color:var(--txt-dim)">Выбрано: <b class="mono" id="accVal">' + State.accent + '</b></div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Фон рабочего стола</h5><div class="wp-list" id="wpList"></div></div>' +
          '<div class="set-card"><h5>Дисплей</h5>' +
            '<div class="spec"><span>Разрешение</span><b>' + window.innerWidth + '×' + window.innerHeight + '</b></div>' +
            '<div class="spec"><span>Масштаб</span><b>100%</b></div>' +
            '<div class="spec"><span>Частота</span><b>144 Гц</b></div></div>' +
          '<div class="set-card"><h5>Звук и яркость</h5>' +
            '<div class="qs-row" style="margin-bottom:12px"><input type="range" id="setVol" min="0" max="100" value="' + State.volume + '"><b class="mono" id="setVolTxt" style="font-size:11px">' + State.volume + '</b></div>' +
            '<div class="qs-row"><input type="range" id="setBri" min="30" max="100" value="' + State.brightness + '"><b class="mono" id="setBriTxt" style="font-size:11px">' + State.brightness + '</b></div></div>' +
        '</div>';
      },
      task() {
        return head('Панель задач') + '<div class="set-grid">' +
          '<div class="set-card"><h5>Выравнивание</h5><div class="qs-chips">' +
            '<button class="chip ' + (State.align === 'center' ? 'on' : '') + '" data-al="center">По центру</button>' +
            '<button class="chip ' + (State.align === 'left' ? 'on' : '') + '" data-al="left">Слева</button></div></div>' +
          '<div class="set-card"><h5>Поведение</h5>' +
            '<div class="set-row"><span>Магнитный снап окон</span><div class="sw ' + (State.tiling ? '' : 'on') + '" data-sw="snap"></div></div>' +
            '<div class="set-row"><span>Показывать виджеты</span><div class="sw on" data-sw="wg"></div></div>' +
            '<div class="set-row"><span>Скрытые значки</span><div class="sw on" data-sw="tray"></div></div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Раскладка окон</h5><div class="qs-chips">' +
            '<button class="chip" data-tile="grid">' + ICO.max + ' Сетка</button>' +
            '<button class="chip" data-tile="cols">Колонны</button>' +
            '<button class="chip" data-tile="rows">Строки</button>' +
            '<button class="chip" data-tile="cascade">Каскад</button>' +
            '<button class="chip" data-tile="min">Свернуть все</button></div>' +
            '<p style="font-size:11.5px;color:var(--txt-dim);margin-top:12px">Совет: потяните окно к краю экрана — Windows 12 предложит зону прилипания. <kbd>Win</kbd>+<kbd>←</kbd>/<kbd>→</kbd> — половина экрана, <kbd>Win</kbd>+<kbd>↑</kbd> — развернуть.</p></div>' +
        '</div>';
      },
      sys() {
        return head('Система') + '<div class="set-grid">' +
          '<div class="set-card"><h5>Дисплей</h5>' +
            '<div class="spec"><span>Яркость</span><b>' + State.brightness + '%</b></div>' +
            '<div class="spec"><span>HDR</span><b>Включено</b></div>' +
            '<div class="spec"><span>Ночной свет</span><b>' + (State.night ? 'Вкл' : 'Выкл') + '</b></div></div>' +
          '<div class="set-card"><h5>Питание</h5>' +
            '<div class="spec"><span>Режим</span><b>Сбалансированный</b></div>' +
            '<div class="spec"><span>Батарея</span><b>87%</b></div>' +
            '<div class="spec"><span>Аптайм</span><b>' + TaskMan.uptime() + '</b></div></div>' +
          '<div class="set-card"><h5>Хранилище</h5>' +
            '<div class="spec"><span>Локальный диск C:</span><b>248 / 512 ГБ</b></div>' +
            '<div class="stat" style="margin-top:10px"><span></span><div class="bar"><i style="width:48%"></i></div><b>48%</b></div></div>' +
          '<div class="set-card"><h5>Сеть и Интернет</h5>' +
            '<div class="spec"><span>Wi-Fi</span><b>ORBITAL-5G</b></div>' +
            '<div class="spec"><span>Скорость</span><b>1.2 Гбит/с</b></div>' +
            '<div class="spec"><span>Пинг</span><b>9 мс</b></div></div>' +
        '</div>';
      },
      apps() {
        return head('Приложения', 'Установленные компоненты Windows 12.') +
          '<div style="padding:0 20px 20px">' + Object.keys(Apps).map(k => Apps[k]).map(a =>
            '<div class="set-row" style="border-bottom:1px solid var(--stroke)">' +
            '<span style="display:flex;align-items:center;gap:12px"><span style="width:20px;height:20px;display:inline-block">' + a.icon + '</span>' + esc(a.title) + '</span>' +
            '<button class="btn" data-open="' + a.id + '">Открыть</button></div>').join('') + '</div>';
      },
      about() {
        return '<div style="padding:20px">' +
          '<div class="about-hero"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg>' +
          '<div><h2>Windows 12 Pro</h2><p>Концептуальная веб-операционная система · ядро 12.0.1, сборка 26100</p></div></div>' +
          '<div class="set-grid" style="padding:0">' +
          '<div class="set-card"><h5>Характеристики</h5>' +
            '<div class="spec"><span>Устройство</span><b>ORBITAL-12</b></div>' +
            '<div class="spec"><span>Процессор</span><b>Nt12 Core X · 16 ядер</b></div>' +
            '<div class="spec"><span>ОЗУ</span><b>32 ГБ LPDDR6</b></div>' +
            '<div class="spec"><span>Графика</span><b>WM12 GPU</b></div>' +
            '<div class="spec"><span>Накопитель</span><b>512 ГБ NVMe</b></div>' +
            '<div class="spec"><span>Аптайм</span><b>' + TaskMan.uptime() + '</b></div></div>' +
          '<div class="set-card"><h5>Сведения</h5>' +
            '<div class="spec"><span>Ядро</span><b>nt12 12.0.1-generic</b></div>' +
            '<div class="spec"><span>Оконный менеджер</span><b>WM12</b></div>' +
            '<div class="spec"><span>Платформа</span><b>' + esc((navigator.platform || 'web').slice(0, 22)) + '</b></div>' +
            '<div class="spec"><span>Обновления</span><b>Актуально</b></div>' +
            '<div class="spec"><span>Активация</span><b>Активировано</b></div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>О сборке</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);line-height:1.7">Это художественный концепт, а не продукт Microsoft. «Windows 12» здесь — вымышленная система, собранная на HTML, CSS и JavaScript. Все приложения работают локально: файловая система виртуальная, звук синтезируется через Web Audio API.</p></div>' +
          '</div></div>';
      },
    };

    function render() {
      main.innerHTML = PAGES[sec]();
      main.scrollTop = 0;
      if (sec === 'pers') {
        $('#accSw', main).innerHTML = ACCENTS.map(a =>
          '<button class="swatch ' + (a.a === State.accent ? 'on' : '') + '" data-a="' + a.a + '" data-b="' + a.b + '" style="background:linear-gradient(140deg,' + a.a + ',' + a.b + ')" title="' + a.t + '"></button>').join('');
        $('#wpList', main).innerHTML = WALLS.map(w =>
          '<button class="wp ' + (State.wallpaper === w ? 'on' : '') + '" data-w="' + w + '" title="' + w + '"><i class="wall" data-wp="' + w + '"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></i></button>').join('');
        $('#accVal', main).textContent = State.accent;
      }
    }
    $('.app-side', rec.body).onclick = e => {
      const b = e.target.closest('[data-s]'); if (!b) return;
      sec = b.dataset.s;
      $$('.side-i', rec.body).forEach(x => x.classList.toggle('on', x === b));
      render();
    };
    main.onclick = e => {
      const sw = e.target.closest('.swatch');
      if (sw) { applyAccent(sw.dataset.a, sw.dataset.b); render(); return; }
      const wp = e.target.closest('.wp');
      if (wp) { applyWall(wp.dataset.w); render(); return; }
      const th = e.target.closest('[data-th]');
      if (th) { applyTheme(th.dataset.th); render(); return; }
      const al = e.target.closest('[data-al]');
      if (al) { applyAlign(al.dataset.al); render(); return; }
      const tl = e.target.closest('[data-tile]');
      if (tl) { if (tl.dataset.tile === 'min') WM.minimizeAll(); else WM.tile(tl.dataset.tile); return; }
      const op = e.target.closest('[data-open]');
      if (op) { WM.open(op.dataset.open); return; }
      const s = e.target.closest('.sw');
      if (s) {
        s.classList.toggle('on');
        const on = s.classList.contains('on');
        if (s.dataset.sw === 'transp') applyTransparency(on);
        if (s.dataset.sw === 'night') { State.night = on; applyTheme(on ? 'light' : 'dark'); }
        if (s.dataset.sw === 'snap') State.tiling = !on;
        Sound.click();
      }
    };
    main.oninput = e => {
      if (e.target.id === 'setVol') {
        State.volume = +e.target.value;
        $('#vol').value = State.volume;
        $('#setVolTxt', main).textContent = State.volume;
      }
      if (e.target.id === 'setBri') {
        applyBrightness(+e.target.value);
        $('#brightRange').value = State.brightness;
        $('#setBriTxt', main).textContent = State.brightness;
      }
    };
    render();
  }
});

/* ============================================================================
   РАБОЧИЙ СТОЛ: ЗНАЧКИ
   ========================================================================== */
const DESK = [
  { t: 'Этот компьютер', i: ICO.disk, f: () => WM.open('explorer', 'C:\\') },
  { t: 'Документы', i: ICO.folder, f: () => WM.open('explorer', 'C:\\Users\\Гость\\Документы') },
  { t: 'Проводник', i: ICO.folder, f: () => WM.open('explorer') },
  { t: 'Терминал', i: ICO.term, f: () => WM.open('terminal') },
  { t: 'Блокнот', i: ICO.note, f: () => WM.open('notepad') },
  { t: 'Магазин', i: ICO.store, f: () => WM.open('store') },
  { t: 'Безопасность', i: ICO.shield, f: () => WM.open('security') },
  { t: 'Корзина', i: ICO.trash, f: () => Notify('Корзина', 'Корзина пуста', ICO.trash, true) },
];
const PINNED = ['explorer', 'terminal', 'notepad', 'settings', 'photos', 'music', 'calc', 'store', 'taskmgr'];

function renderIcons() {
  const host = $('#icons');
  host.innerHTML = '';
  DESK.forEach(d => {
    const n = el('div', 'dicon', '<span class="ico">' + d.i + '</span><span>' + esc(d.t) + '</span>');
    n.ondblclick = () => { Sound.click(); d.f(); };
    n.onclick = () => { $$('.dicon', host).forEach(x => x.classList.remove('sel')); n.classList.add('sel'); };
    n.oncontextmenu = e => {
      e.preventDefault(); e.stopPropagation(); n.onclick();
      openCtx(e.clientX, e.clientY, [
        { t: 'Открыть', i: ICO.exe, f: d.f },
        { t: 'Переименовать', i: ICO.ren, f: () => Notify('Рабочий стол', 'Переименование недоступно в этой сборке', ICO.ren, true) },
        { sep: true },
        { t: 'Свойства', i: ICO.settings, f: () => WM.open('settings') },
      ]);
    };
    host.appendChild(n);
  });
}

/* ============================================================================
   ПАНЕЛЬ ЗАДАЧ
   ========================================================================== */
function renderTaskbar() {
  const dock = $('#tbDock');
  dock.innerHTML = '';
  PINNED.forEach(id => {
    const a = Apps[id]; if (!a) return;
    const insts = Object.keys(State.open).map(k => State.open[k]).filter(r => r.app === id);
    const act = insts.some(r => r.id === State.active);
    const b = el('button', 'tb-btn' + (insts.length ? ' run' : '') + (act ? ' act' : ''), a.icon);
    b.title = a.title;
    b.onclick = () => {
      Sound.click();
      if (!insts.length) WM.open(id);
      else if (insts.length === 1) WM.toggleMin(insts[0].id);
      else {
        const top = insts.slice().sort((x, y) => +y.node.style.zIndex - +x.node.style.zIndex)[0];
        WM.toggleMin(top.id);
      }
    };
    b.oncontextmenu = e => {
      e.preventDefault();
      const cur = Object.keys(State.open).map(k => State.open[k]).filter(r => r.app === id);
      openCtx(e.clientX, e.clientY, [
        { t: 'Открыть новое окно', i: ICO.plus, f: () => WM.open(id) },
      ].concat(cur.length ? [{ t: 'Закрыть все', i: ICO.x, f: () => cur.forEach(r => WM.close(r.id)) }] : []).concat([
        { sep: true },
        { t: 'Закрепить', i: ICO.copy, f: () => Notify('Панель задач', a.title + ' закреплено', ICO.copy, true) },
      ]));
    };
    dock.appendChild(b);
  });
}

/* ============================================================================
   МЕНЮ «ПУСК»
   ========================================================================== */
const StartMenu = (() => {
  const menu = $('#start'), body = $('#startBody'), input = $('#startSearch');
  function openMenu() { menu.classList.add('on'); input.value = ''; renderStart(''); setTimeout(() => input.focus(), 80); }
  function closeMenu() { menu.classList.remove('on'); }
  const isOpen = () => menu.classList.contains('on');
  const toggle = () => isOpen() ? closeMenu() : openMenu();

  function renderStart(q) {
    const all = Object.keys(Apps).map(k => Apps[k]);
    if (q) {
      const low = q.toLowerCase();
      const match = all.filter(a => a.title.toLowerCase().indexOf(low) >= 0);
      const files = VFS.allFiles('C:\\').filter(f => f.path.toLowerCase().indexOf(low) >= 0).slice(0, 6);
      body.innerHTML = '<div class="start-head"><h3>Результаты</h3></div><div class="search-res"></div>';
      const res = $('.search-res', body);
      if (!match.length && !files.length) res.innerHTML = '<div style="padding:20px;color:var(--txt-mute);font-size:12.5px">Ничего не найдено по запросу «' + esc(q) + '»</div>';
      match.forEach(a => {
        const r = el('button', 'search-row', a.icon + '<div><b>' + esc(a.title) + '</b><small>Приложение</small></div>');
        r.onclick = () => { WM.open(a.id); closeMenu(); };
        res.appendChild(r);
      });
      files.forEach(f => {
        const r = el('button', 'search-row', (f.node.ext === 'png' ? ICO.png : ICO.txt) + '<div><b>' + esc(VFS.nameOf(f.path)) + '</b><small>' + esc(f.path) + '</small></div>');
        r.onclick = () => { WM.open(f.node.ext === 'png' ? 'photos' : 'notepad', { path: f.path }); closeMenu(); };
        res.appendChild(r);
      });
    } else {
      const showAll = sessionStorage.getItem('w12.allApps') === 'true';
      const list = showAll ? all : PINNED.map(p => Apps[p]).filter(Boolean);
      body.innerHTML = '<div class="start-head"><h3>' + (showAll ? 'Все приложения' : 'Закреплено') + '</h3>' +
        '<button class="pill" id="allApps">' + (showAll ? '‹ Закреплённые' : 'Все приложения ›') + '</button></div><div class="start-grid"></div>';
      const g = $('.start-grid', body);
      list.forEach(a => {
        const t = el('button', 'app-tile', a.icon + '<span>' + esc(a.title) + '</span>');
        t.onclick = () => { WM.open(a.id); closeMenu(); };
        g.appendChild(t);
      });
      $('#allApps', body).onclick = () => { sessionStorage.setItem('w12.allApps', showAll ? 'false' : 'true'); renderStart(''); };
    }
  }
  input.oninput = () => renderStart(input.value.trim());
  input.onkeydown = e => {
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Enter') { const first = $('.search-row', body) || $('.app-tile', body); if (first) first.click(); }
  };
  return { openMenu, closeMenu, toggle, isOpen, renderStart };
})();

/* ============================================================================
   ВИДЖЕТЫ
   ========================================================================== */
const Widgets = (() => {
  const panel = $('#widgets');
  const toggle = () => panel.classList.toggle('on');
  const close = () => panel.classList.remove('on');
  const isOpen = () => panel.classList.contains('on');

  function calendar() {
    const d = new Date(), y = d.getFullYear(), m = d.getMonth();
    const start = (new Date(y, m, 1).getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    let h = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(x => '<span>' + x + '</span>').join('');
    for (let i = 0; i < start; i++) h += '<span></span>';
    for (let i = 1; i <= days; i++) h += '<b class="' + (i === d.getDate() ? 'today' : '') + '">' + i + '</b>';
    $('#wCal').innerHTML = h;
  }
  function stats() {
    const t = Date.now();
    const cpu = clamp(14 + Math.sin(t / 3400) * 9 + Math.random() * 6, 2, 98);
    const ram = clamp(52 + Math.sin(t / 5200) * 6 + Math.random() * 3, 10, 96);
    const gpu = clamp(24 + Math.cos(t / 2600) * 12 + Math.random() * 5, 2, 98);
    const net = clamp(8 + Math.abs(Math.sin(t / 1800)) * 46, 1, 99);
    const set = (id, v) => { $(id).style.width = v.toFixed(0) + '%'; };
    set('#sCpu', cpu); set('#sRam', ram); set('#sGpu', gpu); set('#sNet', net);
    $('#vCpu').textContent = cpu.toFixed(0) + '%';
    $('#vRam').textContent = ram.toFixed(0) + '%';
    $('#vGpu').textContent = gpu.toFixed(0) + '%';
    $('#vNet').textContent = net.toFixed(0) + '%';
  }
  return { toggle, close, isOpen, calendar, stats };
})();

/* ============================================================================
   БЫСТРЫЕ ПАРАМЕТРЫ
   ========================================================================== */
const Quick = (() => {
  const panel = $('#quick');
  const toggle = () => { panel.classList.toggle('on'); if (panel.classList.contains('on')) Widgets.close(); };
  const close = () => panel.classList.remove('on');
  const isOpen = () => panel.classList.contains('on');
  function build() {
    $('#accChips').innerHTML = ACCENTS.map(a =>
      '<button class="chip ' + (a.a === State.accent ? 'on' : '') + '" data-a="' + a.a + '" data-b="' + a.b + '"><i style="background:linear-gradient(140deg,' + a.a + ',' + a.b + ')"></i>' + a.t + '</button>').join('');
    $('#wpChips').innerHTML = WALLS.map(w =>
      '<button class="chip ' + (State.wallpaper === w ? 'on' : '') + '" data-w="' + w + '">' + w + '</button>').join('');
  }
  panel.onclick = e => {
    const t = e.target.closest('.qs-t');
    if (t) {
      t.classList.toggle('on'); Sound.click();
      if (t.dataset.t === 'night') applyTheme(t.classList.contains('on') ? 'light' : 'dark');
      return;
    }
    const c = e.target.closest('.chip');
    if (c) {
      if (c.dataset.a) applyAccent(c.dataset.a, c.dataset.b);
      if (c.dataset.w) applyWall(c.dataset.w);
      build();
    }
  };
  return { toggle, close, isOpen, build };
})();

/* ============================================================================
   ПОИСК (SPOTLIGHT)
   ========================================================================== */
const Spot = (() => {
  const host = $('#spot'), input = $('#spotInput'), res = $('#spotRes');
  let sel = 0;
  const close = () => host.classList.remove('on');
  const isOpen = () => host.classList.contains('on');
  function render(q) {
    const low = q.toLowerCase();
    const apps = Object.keys(Apps).map(k => Apps[k]).filter(a => !q || a.title.toLowerCase().indexOf(low) >= 0);
    const files = q ? VFS.allFiles('C:\\').filter(f => f.path.toLowerCase().indexOf(low) >= 0).slice(0, 5) : [];
    const cmds = q ? [
      { t: 'Выполнить в терминале: ' + q, i: ICO.term, f: () => { const r = WM.open('terminal'); setTimeout(() => r.api.run(q), 150); } },
      { t: 'Тема: ' + (State.theme === 'dark' ? 'светлая' : 'тёмная'), i: ICO.sun, f: () => applyTheme(State.theme === 'dark' ? 'light' : 'dark') },
    ] : [];
    const items = apps.map(a => ({ t: a.title, s: 'Приложение', i: a.icon, f: () => WM.open(a.id) }))
      .concat(files.map(f => ({ t: VFS.nameOf(f.path), s: f.path, i: ICO.txt, f: () => WM.open('notepad', { path: f.path }) })))
      .concat(cmds.map(c => ({ t: c.t, s: 'Команда', i: c.i, f: c.f })));
    res.innerHTML = '';
    if (!items.length) res.innerHTML = '<div style="padding:22px;color:var(--txt-mute);font-size:12.5px">Начните вводить запрос…</div>';
    items.slice(0, 12).forEach(it => {
      const r = el('button', 'search-row', it.i + '<div><b>' + esc(it.t) + '</b><small>' + esc(it.s) + '</small></div>');
      r.onclick = () => { it.f(); close(); };
      res.appendChild(r);
    });
    sel = 0;
  }
  function open_() { host.classList.add('on'); input.value = ''; render(''); setTimeout(() => input.focus(), 70); }
  input.oninput = () => render(input.value.trim());
  input.onkeydown = e => {
    const rows = $$('.search-row', res);
    const mark = () => rows.forEach((r, i) => { r.style.background = i === sel ? 'rgba(255,255,255,.1)' : ''; });
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' && rows[sel]) rows[sel].click();
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, rows.length - 1); mark(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); mark(); e.preventDefault(); }
  };
  return { open: open_, close, isOpen, render };
})();

/* ============================================================================
   ЯРКОСТЬ И ИНДИКАТОР
   ========================================================================== */
function applyBrightness(v) {
  State.brightness = v;
  $('#bright').style.opacity = String((100 - v) / 100 * .72);
}
const HUD = (() => {
  let timer = null;
  function show(kind, val) {
    const host = $('#volHud');
    host.classList.add('on');
    $('#hudBar').style.width = val + '%';
    $('#hudVal').textContent = val;
    $('#hudIcon').innerHTML = kind === 'vol'
      ? (val === 0
        ? '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6"/>'
        : '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9a4 4 0 0 1 0 6"/>')
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>';
    clearTimeout(timer);
    timer = setTimeout(() => host.classList.remove('on'), 1300);
  }
  return { show };
})();

/* ============================================================================
   ЧАСЫ
   ========================================================================== */
function tickClock() {
  const d = new Date();
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  $('#tbTime').textContent = hm;
  $('#tbDate').textContent = pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
  $('#lockClock').textContent = hm;
  $('#lockDate').textContent = dateStr(d);
  $('#wClock').textContent = hm;
}

/* ============================================================================
   ГОРЯЧИЕ КЛАВИШИ
   ========================================================================== */
function activeWin() {
  const list = Object.keys(State.open).map(k => State.open[k]).filter(r => !r.minimized);
  if (!list.length) return null;
  return list.slice().sort((a, b) => +b.node.style.zIndex - +a.node.style.zIndex)[0];
}
function cycleWindows(dir) {
  const list = Object.keys(State.open).map(k => State.open[k]);
  if (!list.length) return;
  if (list.length === 1) { WM.unminimize(list[0].id); WM.focus(list[0].id); return; }
  const idx = list.findIndex(r => r.id === State.active);
  const next = list[(idx + dir + list.length) % list.length];
  WM.unminimize(next.id); WM.focus(next.id);
}
function snapActive(dir) {
  const r = activeWin(); if (!r) return;
  const vw = window.innerWidth, vh = window.innerHeight - 52;
  const R = {
    left: { x: 0, y: 0, w: vw / 2, h: vh },
    right: { x: vw / 2, y: 0, w: vw / 2, h: vh },
    up: { x: 0, y: 0, w: vw, h: vh },
    down: { x: r.x, y: vh / 2, w: r.w, h: vh / 2 },
    tl: { x: 0, y: 0, w: vw / 2, h: vh / 2 }, tr: { x: vw / 2, y: 0, w: vw / 2, h: vh / 2 },
    bl: { x: 0, y: vh / 2, w: vw / 2, h: vh / 2 }, br: { x: vw / 2, y: vh / 2, w: vw / 2, h: vh / 2 },
  }[dir];
  if (R) WM.applyRect(r, R);
}
function initKeys() {
  let meta = false;
  window.addEventListener('keydown', e => {
    if (e.key === 'Meta') { meta = true; return; }
    const typing = /input|textarea/i.test(e.target.tagName);
    const k = e.key.toLowerCase();

    if (meta && k === 'd') {
      e.preventDefault();
      if (Object.keys(State.open).map(x => State.open[x]).some(r => !r.minimized)) WM.minimizeAll();
      else { Object.keys(State.open).forEach(x => { State.open[x].minimized = false; State.open[x].node.classList.remove('min'); }); renderTaskbar(); }
      return;
    }
    if (meta && k === 'e') { e.preventDefault(); WM.open('explorer'); return; }
    if (meta && k === 's') { e.preventDefault(); if (Spot.isOpen()) Spot.close(); else Spot.open(); return; }
    if (meta && k === 'l') { e.preventDefault(); lockScreen(); return; }
    if (meta && k === 'r') { e.preventDefault(); WM.open('terminal'); return; }
    if (meta && k === 'i') { e.preventDefault(); WM.open('settings'); return; }
    if (meta && e.key === 'ArrowLeft') { e.preventDefault(); snapActive(e.shiftKey ? 'tl' : 'left'); return; }
    if (meta && e.key === 'ArrowRight') { e.preventDefault(); snapActive(e.shiftKey ? 'tr' : 'right'); return; }
    if (meta && e.key === 'ArrowUp') { e.preventDefault(); snapActive('up'); return; }
    if (meta && e.key === 'ArrowDown') {
      e.preventDefault();
      const r = activeWin();
      if (r) { if (r.minimized) WM.toggleMin(r.id); else WM.minimize(r.id); }
      return;
    }
    if (meta && e.key === 'Tab') { e.preventDefault(); cycleWindows(e.shiftKey ? -1 : 1); return; }
    if (meta) { e.preventDefault(); StartMenu.toggle(); meta = false; return; }

    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      const r = activeWin();
      if (r) WM.close(r.id); else power('shutdown');
      return;
    }
    if (e.ctrlKey && e.altKey && k === 't') { e.preventDefault(); WM.open('terminal'); return; }
    if (e.key === 'Escape') { closeCtx(); Quick.close(); Widgets.close(); Spot.close(); StartMenu.closeMenu(); return; }
    if (e.key === 'F5') { e.preventDefault(); renderIcons(); return; }
    if (typing) return;
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !StartMenu.isOpen()) { e.preventDefault(); cycleWindows(e.key === 'ArrowDown' ? 1 : -1); }
  });
  window.addEventListener('keyup', e => { if (e.key === 'Meta') meta = false; });
  window.addEventListener('blur', () => { meta = false; });
}

/* ============================================================================
   ПИТАНИЕ И БЛОКИРОВКА
   ========================================================================== */
function lockScreen() {
  const l = $('#lock');
  l.style.display = 'flex';
  l.classList.remove('gone');
  tickClock();
}
function revealDesk() {
  $('#desk').classList.add('on');
}
function unlock() {
  const l = $('#lock');
  l.classList.add('gone');
  revealDesk();
  Sound.open();
  setTimeout(() => { l.style.display = 'none'; }, 700);
}
function power(mode) {
  StartMenu.closeMenu(); Quick.close();
  if (mode === 'lock') { lockScreen(); return; }
  const shut = $('#shut'), txt = $('#shutTxt');
  shut.classList.add('on');
  txt.textContent = mode === 'restart' ? 'Перезапуск…' : mode === 'sleep' ? 'Спящий режим…' : 'Завершение работы…';
  setTimeout(() => {
    if (mode === 'sleep') { shut.classList.remove('on'); lockScreen(); return; }
    if (mode === 'restart') { location.reload(); return; }
    shut.innerHTML = '<div style="text-align:center">' +
      '<div style="width:78px;height:78px;margin:0 auto 22px;opacity:.5"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg></div>' +
      '<div style="font-family:var(--font-display);font-weight:300;font-size:16px;color:var(--txt-dim)">Питание отключено. Нажмите кнопку, чтобы включить.</div>' +
      '<button class="btn primary" id="wakeBtn" style="margin-top:26px;padding:12px 26px">Включить</button></div>';
    $('#wakeBtn').onclick = () => location.reload();
  }, 2400);
}

/* ============================================================================
   КОНТЕКСТНОЕ МЕНЮ РАБОЧЕГО СТОЛА
   ========================================================================== */
function initDesktopCtx() {
  $('#desk').addEventListener('contextmenu', e => {
    if (e.target.closest('.win') || e.target.closest('#taskbar') || e.target.closest('#start') ||
        e.target.closest('#quick') || e.target.closest('#widgets') || e.target.closest('.dicon')) return;
    e.preventDefault();
    openCtx(e.clientX, e.clientY, [
      { t: 'Обновить', i: ICO.refresh, f: () => { renderIcons(); Widgets.stats(); } },
      { t: 'Открыть терминал', i: ICO.term, f: () => WM.open('terminal'), k: 'Ctrl+Alt+T' },
      { t: 'Открыть Проводник', i: ICO.folder, f: () => WM.open('explorer'), k: 'Win+E' },
      { sep: true },
      { t: 'Упорядочить: сетка', i: ICO.max, f: () => WM.tile('grid') },
      { t: 'Каскадом', i: ICO.copy, f: () => WM.tile('cascade') },
      { t: 'Свернуть все окна', i: ICO.min, f: () => WM.minimizeAll(), k: 'Win+D' },
      { sep: true },
      { t: 'Персонализация', i: ICO.paint, f: () => WM.open('settings') },
      { t: 'Параметры экрана', i: ICO.settings, f: () => WM.open('settings') },
    ]);
  });
}

/* ============================================================================
   ЗАГРУЗКА И ИНИЦИАЛИЗАЦИЯ
   ========================================================================== */
function loadPrefs() {
  try {
    const acc = localStorage.getItem('w12.accent');
    if (acc) { const p = acc.split('|'); applyAccent(p[0], p[1]); }
    const th = localStorage.getItem('w12.theme'); if (th) applyTheme(th);
    const w = localStorage.getItem('w12.wall'); if (w && WALLS.indexOf(w) >= 0) applyWall(w);
    const tr = localStorage.getItem('w12.transp'); if (tr !== null) applyTransparency(tr === '1');
    const al = localStorage.getItem('w12.align'); if (al) applyAlign(al);
  } catch (e) { /* хранилище недоступно */ }
}
function bootSequence() {
  const TIPS = ['Инициализация ядра nt12…', 'Монтирование виртуальной ФС…', 'Запуск оконного менеджера WM12…',
    'Калибровка снапа на 12 зон…', 'Синтез звуковой подсистемы…', 'Загрузка профиля «Гость»…', 'Почти готово…'];
  const bar = $('#bootBar'), tip = $('#bootTip');
  let shown = 0, pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(100, pct + 3 + Math.random() * 7);
    bar.style.width = pct + '%';
    const idx = Math.min(TIPS.length - 1, Math.floor(pct / 100 * TIPS.length));
    if (idx !== shown) { shown = idx; tip.textContent = TIPS[idx]; }
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        const b = $('#boot');
        b.classList.add('gone');
        setTimeout(() => b.remove(), 800);
        tickClock();
        Sound.boot();
      }, 420);
    }
  }, 190);
}

function init() {
  loadPrefs();
  renderIcons();
  renderTaskbar();
  Quick.build();
  StartMenu.renderStart('');
  Widgets.calendar();
  Widgets.stats();
  tickClock();
  applyBrightness(State.brightness);
  initKeys();
  initDesktopCtx();

  $('#startBtn').onclick = () => { Sound.click(); StartMenu.toggle(); };
  $('#searchBtn').onclick = () => { Sound.click(); if (Spot.isOpen()) Spot.close(); else Spot.open(); };
  $('#widgetsBtn').onclick = () => { Sound.click(); Quick.close(); Widgets.toggle(); Widgets.calendar(); Widgets.stats(); };
  $('#clockBtn').onclick = () => { Sound.click(); Quick.close(); Widgets.toggle(); Widgets.calendar(); };
  $('#notifBtn').onclick = () => { Sound.click(); Quick.toggle(); };
  $('#trayIcons').onclick = () => { Sound.click(); Quick.toggle(); };
  $('#showDesk').onclick = () => { Sound.click(); WM.minimizeAll(); };
  $('#langBtn').onclick = () => { Sound.click(); Notify('Язык ввода', 'Переключено: РУС ⇄ ENG', ICO.globe, true); };
  $('#setBtn').onclick = () => { StartMenu.closeMenu(); WM.open('settings'); };
  $('#qsSettings').onclick = () => { Quick.close(); WM.open('settings'); };
  $('#powerBtn').onclick = e => {
    e.stopPropagation(); Sound.click();
    const r = e.currentTarget.getBoundingClientRect();
    openCtx(r.left - 150, r.top - 200, [
      { t: 'Спящий режим', i: ICO.moon, f: () => power('sleep') },
      { t: 'Завершение работы', i: ICO.power, f: () => power('shutdown') },
      { t: 'Перезагрузка', i: ICO.refresh, f: () => power('restart') },
      { sep: true },
      { t: 'Блокировка', i: ICO.shield, f: lockScreen, k: 'Win+L' },
    ]);
  };

  $('#vol').oninput = e => { State.volume = +e.target.value; HUD.show('vol', State.volume); };
  $('#brightRange').oninput = e => { applyBrightness(+e.target.value); HUD.show('bri', State.brightness); };
  $('#vol').onchange = () => Sound.click();

  document.addEventListener('mousedown', e => {
    if (!e.target.closest('#start') && !e.target.closest('#startBtn')) StartMenu.closeMenu();
    if (!e.target.closest('#quick') && !e.target.closest('#notifBtn') && !e.target.closest('#trayIcons')) Quick.close();
    if (!e.target.closest('#widgets') && !e.target.closest('#widgetsBtn') && !e.target.closest('#clockBtn')) Widgets.close();
    if (!e.target.closest('#spot') && !e.target.closest('#searchBtn')) Spot.close();
  });
  $('#desk').addEventListener('mousedown', e => {
    if (e.target.id === 'desk' || e.target.classList.contains('wall') || e.target.id === 'icons') $$('.dicon').forEach(x => x.classList.remove('sel'));
  });

  $('#lockBtn').onclick = unlock;
  $('#lock').onclick = e => { if (!e.target.closest('.lock-btn')) unlock(); };
  document.addEventListener('keydown', e => {
    const l = $('#lock');
    if (l && l.style.display !== 'none' && !l.classList.contains('gone') && (e.key === 'Enter' || e.key === ' ')) unlock();
  });

  setInterval(tickClock, 1000);
  setInterval(() => { if (Widgets.isOpen()) Widgets.stats(); }, 2200);

  setTimeout(() => Notify('Windows 12', 'Система готова. Нажмите Win или откройте «Пуск», чтобы начать.', ICO.sparkle), 2600);
  setTimeout(() => Notify('Совет', 'Потяните окно к краю экрана — WM12 предложит зону прилипания. Win+←/→ — половина экрана.', ICO.max, true), 7200);

  bootSequence();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
