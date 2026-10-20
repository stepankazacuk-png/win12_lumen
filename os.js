/* ============================================================================
   Люмен — вымышленная веб-ОС
   Ядро: виртуальная ФС, оконный менеджер, планировщик, приложения
   ========================================================================== */
'use strict';

/* ------------------------------ ICONS ------------------------------------- */
const G = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const ICO = {
  pc: `<svg viewBox="0 0 24 24"><path d="M12 1.5c.9 6.1 3.5 8.7 9.6 9.6-6.1.9-8.7 3.5-9.6 9.6-.9-6.1-3.5-8.7-9.6-9.6 6.1-.9 8.7-3.5 9.6-9.6z" fill="url(#lgWin)"/></svg>`,
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
  link: G('<path d="M10.5 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>'),
  game: G('<path d="M7 8h10a5 5 0 0 1 4.7 6.7l-.6 1.8a2.2 2.2 0 0 1-3.9.7L15.6 15H8.4l-1.6 2.2a2.2 2.2 0 0 1-3.9-.7l-.6-1.8A5 5 0 0 1 7 8z"/><path d="M8 10.5v2M7 11.5h2"/><circle cx="16" cy="11" r=".9" fill="currentColor" stroke="none"/><circle cx="17.6" cy="13" r=".9" fill="currentColor" stroke="none"/>'),
  star: G('<path d="M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z"/>'),
  lock: G('<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>'),
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

/* ============================================================================
   ДОСТУП: КОД ВЛАДЕЛЬЦА, ПАРОЛЬ И КОД ВОССТАНОВЛЕНИЯ
   ========================================================================== */
/* Ни одного кода и пароля в исходниках нет: владелец задаёт их сам при первом
   запуске. Система хранит только отпечатки — SHA-256 с солью и повторами.
   Отпечаток нельзя превратить обратно в код, поэтому подсмотреть код нельзя
   ни в файлах проекта, ни в хранилище браузера. */
const Auth = (() => {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H0 = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

  function sha256(bytes) {
    const H = H0.slice();
    const len = bytes.length, bitLen = len * 8;
    const withOne = len + 1;
    const total = withOne + ((56 - withOne % 64) + 64) % 64 + 8;
    const msg = new Uint8Array(total);
    msg.set(bytes);
    msg[len] = 0x80;
    const hi = Math.floor(bitLen / 0x100000000), lo = bitLen >>> 0;
    msg[total - 8] = (hi >>> 24) & 255; msg[total - 7] = (hi >>> 16) & 255;
    msg[total - 6] = (hi >>> 8) & 255;  msg[total - 5] = hi & 255;
    msg[total - 4] = (lo >>> 24) & 255; msg[total - 3] = (lo >>> 16) & 255;
    msg[total - 2] = (lo >>> 8) & 255;  msg[total - 1] = lo & 255;
    const w = new Uint32Array(64);
    for (let off = 0; off < total; off += 64) {
      for (let i = 0; i < 16; i++) {
        w[i] = ((msg[off + i * 4] << 24) | (msg[off + i * 4 + 1] << 16) |
                (msg[off + i * 4 + 2] << 8) | msg[off + i * 4 + 3]) >>> 0;
      }
      for (let i = 16; i < 64; i++) {
        const x = w[i - 15], y = w[i - 2];
        const s0 = (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) >>> 0;
        const s1 = (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10)) >>> 0;
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (let i = 0; i < 64; i++) {
        const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
        const ch = ((e & f) ^ (~e & g)) >>> 0;
        const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
        const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    return H;
  }
  const hex = b => [...b].map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
  const digest = s => hex(sha256(new TextEncoder().encode(s)));

  /* Повторов много: перебор одного кода занимает заметное время. */
  const ITER = 12000;

  function rnd(n) {
    const a = new Uint8Array(n);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256);
    return a;
  }
  const toHex = a => [...a].map(x => x.toString(16).padStart(2, '0')).join('');

  function stretch(text, salt, iter) {
    let d = salt + ':' + text;
    for (let i = 0; i < (iter || ITER); i++) d = digest(d);
    return d;
  }
  /* Отпечаток: соль + число повторов + результат. Открытого текста нет. */
  function make(text) {
    const salt = toHex(rnd(16));
    return { salt: salt, iter: ITER, hash: stretch(text, salt, ITER) };
  }
  /* Сравнение без раннего выхода: по времени нельзя понять, где ошибка. */
  function check(text, rec) {
    if (!rec || !rec.hash || !rec.salt) return false;
    const h = stretch(String(text == null ? '' : text), rec.salt, rec.iter || ITER);
    if (h.length !== rec.hash.length) return false;
    let diff = 0;
    for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ rec.hash.charCodeAt(i);
    return diff === 0;
  }
  /* Код восстановления: только однозначные знаки — без 0/O и 1/I. */
  const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function recovery() {
    const a = rnd(12);
    const g = i => [0, 1, 2, 3].map(j => ALPHA[a[i * 4 + j] % 32]).join('');
    return 'LMN-' + g(0) + '-' + g(1) + '-' + g(2);
  }
  return { make: make, check: check, recovery: recovery, ITER: ITER };
})();

/* ------------------------------ STATE ------------------------------------- */
const State = {
  accent: '#5cc8ff', accent2: '#7b6cff', theme: 'dark', wallpaper: 'aurora',
  align: 'center', transparency: true, volume: 62, brightness: 100,
  night: false, focus: false, tiling: false, zTop: 100, open: {}, seq: 0,
  admin: false, adminAttempts: 0, adminLog: [],
  /* Доступ: только отпечатки. ready=false — владелец ещё не задал свой код. */
  auth: { ver: 1, ready: false, code: null, pass: null, rec: null },
  locked: true,       // система заблокирована до ввода кода
  passTries: 0,       // счётчик неверных попыток пароля
  lite: false,        // облегчённый режим оформления (включается сам при просадке кадров)
  tuned: false,       // решение о режиме уже принято
};

/* Что система спрашивает при входе. Кодов в коде нет — только отпечатки. */
const hasCode = () => !!(State.auth && State.auth.code);
const hasPass = () => !!(State.auth && State.auth.pass);
const needCode = () => hasCode();


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

/* Имя владельца компьютера и его домашняя папка. Меняются здесь — и больше
   нигде, иначе имя разъедется по путям, терминалу и сведениям о системе. */
const USER = 'Степан';
const HOME = 'C:\\Users\\' + USER;

/* ============================================================================
   ВИРТУАЛЬНАЯ ФАЙЛОВАЯ СИСТЕМА
   ========================================================================== */
const VFS = (() => {
  const tree = {
    'C:': { type: 'dir', children: {
      'Users': { type: 'dir', children: {
        [USER]: { type: 'dir', children: {
          'Документы': { type: 'dir', children: {
            'readme.txt': { type: 'file', ext: 'txt', content: 'Добро пожаловать в Люмен!\n\nЭто концептуальная веб-операционная система, работающая целиком в браузере.\nЗдесь есть оконный менеджер, виртуальная файловая система и рабочий терминал.\n\nПопробуйте: help, neofetch, ls, cat readme.txt\n' },
            'notes.md': { type: 'file', ext: 'txt', content: '# Заметки\n\n- Позвонить в орбитальный офис\n- Обновить ядро до люмен-1.4\n- Проверить снап окон (Win + стрелки)\n' },
            'todo.txt': { type: 'file', ext: 'txt', content: '[ ] Прочитать документацию\n[x] Загрузить Люмен\n[ ] Написать свой планировщик\n' },
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
          'Рабочий стол': { type: 'dir', children: {} },
          'Игры': { type: 'dir', children: {
            'Змейка.exe': { type: 'file', ext: 'game', content: 'Змейка' },
            'Тетрис.exe': { type: 'file', ext: 'game', content: 'Тетрис' },
            'Понг.exe': { type: 'file', ext: 'game', content: 'Понг' },
            'Арканоид.exe': { type: 'file', ext: 'game', content: 'Арканоид' },
            '2048.exe': { type: 'file', ext: 'game', content: '2048' },
          } },
        } },
      } },
      'Система': { type: 'dir', children: {
        'ядро': { type: 'dir', children: {
          'lumen-core.sys': { type: 'file', ext: 'sys', content: '[binary]\n' },
          'lsh.exe': { type: 'file', ext: 'exe', content: '[binary]\n' },
          'plexus.dll': { type: 'file', ext: 'sys', content: '[binary]\n' },
        } },
        'Fonts': { type: 'dir', children: { 'Manrope.ttf': { type: 'file', ext: 'ttf' } } },
      } },
      'Program Files': { type: 'dir', children: {
        'Люмен': { type: 'dir', children: {
          'os.js': { type: 'file', ext: 'code', content: '// ядро системы\n' },
          'styles.css': { type: 'file', ext: 'code', content: '/* оформление */\n' },
        } },
      } },
    } },
  };
  // Снимок исходного состояния: панель администратора возвращает систему к нему.
  const pristine = JSON.parse(JSON.stringify(tree));
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
  // Возврат файловой системы к исходному состоянию.
  function restore() {
    const snap = JSON.parse(JSON.stringify(pristine));
    Object.keys(tree).forEach(k => delete tree[k]);
    Object.keys(snap).forEach(k => { tree[k] = snap[k]; });
    return { ok: true };
  }
  return { tree, root, node, norm, split, mkdir, write, read, rm, mv, cp, list, sizeOf, allFiles, nameOf, parentOf, restore };
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
   МЕНЕДЖЕР ОКОН (ПЛЕКСУС)
   ========================================================================== */
const Apps = {};
const WM = (() => {
  const host = $('#wins');
  const ghost = $('#snapGhost');

  /* Высота панели задач задаётся в CSS и на телефоне другая, поэтому читаем её
     из переменной, а не держим числом. */
  let TB_H = 52;
  const readTbH = () => {
    const v = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'), 10);
    if (v > 0) TB_H = v;
  };
  readTbH();

  /* Телефон: окна открываются во весь экран — таскать их пальцем неудобно. */
  const isPhone = () => window.matchMedia('(max-width:560px)').matches;
  const isTouch = () => window.matchMedia('(hover:none)').matches;

  /* Размеры берём у экрана монитора, а не у окна браузера: система живёт
     внутри монитора, и окна должны считаться от его краёв. */
  const deskBox = () => {
    const d = $('#desk');
    const r = d ? d.getBoundingClientRect() : null;
    return (r && r.width > 40) ? r : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  };
  const DW = () => Math.round(deskBox().width);
  const DH = () => Math.round(deskBox().height);
  const PX = e => Math.round(e.clientX - deskBox().left);
  const PY = e => Math.round(e.clientY - deskBox().top);

  const register = def => { Apps[def.id] = def; };

  function open(id, arg) {
    const def = Apps[id];
    if (!def) { Notify('Ошибка', 'Приложение «' + id + '» не найдено', ICO.settings); Sound.error(); return null; }
    if (State.open[id] && !def.multi) {
      const rec = State.open[id];
      rec.minimized = false; rec.node.classList.remove('min'); focus(id);
      // Повторный запуск с аргументом переиспользует открытое окно.
      if (arg !== undefined && rec.api.start) rec.api.start(arg);
      return rec;
    }
    State.seq++;
    const key = def.multi ? id + '#' + State.seq : id;
    const vw = DW(), vh = DH();
    // На телефоне окно занимает весь стол: тянуть и разворачивать его негде.
    const phone = isPhone();
    const w = phone ? vw : Math.min(def.w || 720, vw - 60);
    const h = phone ? vh - TB_H : Math.min(def.h || 480, vh - TB_H - 60);
    const off = phone ? 0 : (Object.keys(State.open).length % 7) * 26;
    const rec = {
      id: key, app: id, def, node: null, body: null, minimized: false, maximized: phone,
      prev: null, api: {}, dirty: false,
      x: phone ? 0 : clamp((vw - w) / 2 + off - 60, 12, Math.max(12, vw - w - 12)),
      y: phone ? 0 : clamp((vh - TB_H - h) / 2 + off - 50, 12, Math.max(12, vh - TB_H - h - 12)),
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
    const win = el('div', 'win' + (rec.maximized ? ' max' : ''));
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
    // pointerdown покрывает и мышь, и палец — на планшете окно можно тянуть.
    tbar.addEventListener('pointerdown', e => {
      if (e.target.closest('.win-ctl')) return;
      if (e.pointerType === 'touch' && isPhone()) return; // на телефоне окно во весь экран
      startDrag(rec, e);
    });
    $$('.rz', win).forEach(rz => rz.addEventListener('pointerdown', e => startResize(rec, e, rz.classList[1].replace('rz-', ''))));
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
    applyVisibility();
  }
  function minimize(id) {
    const r = State.open[id]; if (!r) return;
    r.minimized = true; r.node.classList.add('min');
    if (State.active === id) State.active = null;
    Sound.close(); renderTaskbar();
    applyVisibility();
  }
  function unminimize(id) { const r = State.open[id]; if (r) { r.minimized = false; r.node.classList.remove('min'); applyVisibility(); } }

  /* Окно сообщает приложению, видно ли его. Это важно для живого браузера:
     пока окно свёрнуто или не в фокусе, сервер не снимает кадры, и система
     не тратит силы впустую. */
  function applyVisibility() {
    const hidden = document.hidden;
    Object.keys(State.open).forEach(k => {
      const r = State.open[k];
      if (!r.api || !r.api.visible) return;
      const vis = !hidden && !r.minimized && State.active === k;
      if (r._vis !== vis) { r._vis = vis; r.api.visible(vis); }
    });
  }
  document.addEventListener('visibilitychange', applyVisibility);

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
    const vw = DW(), vh = DH() - TB_H, M = 16;
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
      rec.x = clamp(ox + ev.clientX - sx, -rec.w + 90, DW() - 90);
      rec.y = clamp(oy + ev.clientY - sy, 0, DH() - 60);
      rec.node.style.left = rec.x + 'px'; rec.node.style.top = rec.y + 'px';
      snap = State.tiling ? null : detectSnap(PX(ev), PY(ev));
      if (snap) {
        ghost.style.display = 'block';
        Object.assign(ghost.style, { left: snap.x + 'px', top: snap.y + 'px', width: snap.w + 'px', height: snap.h + 'px' });
      } else ghost.style.display = 'none';
    };
    const up = () => {
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      rec.node.classList.remove('drag'); ghost.style.display = 'none';
      if (snap) applyRect(rec, snap);
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
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
    const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); rec.node.classList.remove('rz'); };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  }

  function tile(mode) {
    const list = Object.values(State.open).filter(r => !r.minimized);
    const vw = DW(), vh = DH() - TB_H;
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
  /* Поворот экрана и смена размера: окна на телефоне должны занять новый
     экран целиком, иначе они останутся прежней ширины и вылезут за край. */
  function relayout() {
    readTbH();
    const phone = isPhone();
    Object.values(State.open).forEach(rec => {
      if (phone) {
        Object.assign(rec.node.style, { left: '0px', top: '0px', width: DW() + 'px', height: (DH() - TB_H) + 'px' });
        Object.assign(rec, { x: 0, y: 0, w: DW(), h: DH() - TB_H, maximized: true });
        rec.node.classList.add('max');
      } else if (rec.maximized) {
        Object.assign(rec.node.style, { width: '100%', height: 'calc(100% - ' + TB_H + 'px)' });
      } else {
        // Окно не должно оказаться за краем после уменьшения экрана.
        const w = Math.min(rec.w, DW() - 24), h = Math.min(rec.h, DH() - TB_H - 24);
        const x = clamp(rec.x, 0, Math.max(0, DW() - w)), y = clamp(rec.y, 0, Math.max(0, DH() - TB_H - h));
        Object.assign(rec, { x, y, w, h });
        Object.assign(rec.node.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      }
    });
  }

  return { register, open, close, focus, minimize, toggleMin, unminimize, toggleMax, tile, minimizeAll, applyRect, relayout };
})();

/* ============================================================================
   КОНТЕКСТНОЕ МЕНЮ
   ========================================================================== */
const ctxHost = $('#ctx');
function openCtx(cx, cy, items) {
  ctxHost.innerHTML = '';
  items.forEach(it => {
    if (it.sep) { ctxHost.appendChild(el('div', 'ctx-sep')); return; }
    const b = el('button', 'ctx-i', (it.i || '') + '<span>' + esc(it.t) + '</span>' + (it.k ? '<span class="k">' + esc(it.k) + '</span>' : ''));
    b.onclick = () => { closeCtx(); it.f(); };
    ctxHost.appendChild(b);
  });
  ctxHost.classList.add('on');
  // Меню живёт внутри рабочего стола, поэтому переводим координаты экрана
  // в координаты стола: система нарисована внутри монитора.
  const box = $('#desk').getBoundingClientRect();
  const x = cx - box.left, y = cy - box.top;
  const r = ctxHost.getBoundingClientRect();
  ctxHost.style.left = Math.max(4, Math.min(x, box.width - r.width - 8)) + 'px';
  ctxHost.style.top = Math.max(4, Math.min(y, box.height - r.height - 8)) + 'px';
}
const closeCtx = () => ctxHost.classList.remove('on');
document.addEventListener('mousedown', e => { if (!e.target.closest('#ctx')) closeCtx(); });

/* ============================================================================
   ПРИЛОЖЕНИЕ: ПРОВОДНИК
   ========================================================================== */
WM.register({
  id: 'explorer', title: 'Проводник', icon: ICO.folder, w: 880, h: 540,
  init(rec, startPath) {
    const st = { path: startPath || HOME, sel: null };
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
      { t: 'Рабочий стол', p: HOME + '\\Рабочий стол' },
      { t: 'Документы', p: HOME + '\\Документы' },
      { t: 'Изображения', p: HOME + '\\Изображения' },
      { t: 'Музыка', p: HOME + '\\Музыка' },
      { t: 'Загрузки', p: HOME + '\\Загрузки' },
      { t: 'Локальный диск C:', p: 'C:\\' },
      { t: 'Система', p: 'C:\\Система' },
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
          const ico = isDir ? ICO.folder : ({ txt: ICO.txt, png: ICO.png, code: ICO.code, exe: ICO.exe, game: ICO.game }[item.node.ext] || ICO.file);
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
      else if (ext === 'game') { Sound.open(); WM.open('games', String(node.content || '').replace(/\.exe$/i, '')); }
      else if (ext === 'exe' || ext === 'sys') { Sound.error(); Notify('Система', '«' + name + '» — системный файл, запуск заблокирован.', ICO.shield); }
      else WM.open('notepad', { path: full });
    }
    $('.ex-top', rec.body).onclick = e => {
      const b = e.target.closest('[data-nav]'); if (!b) return;
      const n = b.dataset.nav;
      if (n === 'up') { const p = VFS.parentOf(st.path); go(p.length ? 'C:\\' + p.join('\\') : 'C:\\'); }
      if (n === 'back') { const p = hist.pop(); if (p) go(p, false); }
      if (n === 'home') go(HOME);
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
    const st = { path: (arg && arg.path) || HOME + '\\Документы\\без_имени.txt' };
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
      if (a === 'new') { st.path = HOME + '\\Документы\\без_имени.txt'; ta.value = ''; rec.dirty = false; upd(); }
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
  id: 'terminal', title: 'Терминал — lsh', icon: ICO.term, w: 780, h: 470,
  init(rec) {
    const st = { cwd: HOME, hist: [], hi: 0 };
    rec.body.innerHTML = `<div class="app">
      <div class="term"></div>
      <div class="term-in"><span class="ps1"></span><input spellcheck="false" autocomplete="off"></div>
    </div>`;
    const out = $('.term', rec.body), inp = $('.term-in input', rec.body), ps1 = $('.ps1', rec.body);
    const print = (html, cls) => { out.appendChild(el('div', 'l ' + (cls || ''), html)); out.scrollTop = out.scrollHeight; };
    const prompt_ = () => { ps1.textContent = 'PS ' + st.cwd + '>'; };

    print('<span class="p">lsh</span> <span class="d">(ядро люмен-1.4, сборка 3040)</span>');
    print('<span class="d">Введите «help» для списка команд.</span>');
    print('');
    prompt_();

    /* Терминал отвечает на вопросы обычными словами: пользователь пишет
       «модель компьютера» — система отвечает. Данные те же, что в «О системе»,
       чтобы ответы не расходились с интерфейсом. */
    const HW = {
      model: 'ORBITAL-12',
      cpu: 'Nt12 Core X, 16 ядер',
      ram: '32 ГБ LPDDR6',
      gpu: 'Плексус GPU',
      disk: '512 ГБ NVMe, занято 248 ГБ',
      net: 'Wi-Fi ORBITAL-5G, 1.2 Гбит/с, пинг 9 мс',
    };
    const spec = (t, v) => '<span class="y">' + t + ':</span> ' + v;

    const FACTS = [
      { k: ['привет', 'здравств', 'хай'], a: () => 'Здравствуйте! Спросите что угодно о компьютере: «модель компьютера», «какой процессор», «сколько ОЗУ».' },
      { k: ['спасибо', 'благодар'], a: () => 'Пожалуйста. Обращайтесь.' },
      { k: ['модель', 'марка', 'что за компьютер', 'какой компьютер', 'за компьютер', 'устройств', 'название компьютер'],
        a: () => spec('Модель компьютера', '<b>' + HW.model + '</b>') },
      { k: ['процессор', 'цп', 'cpu', 'ядер', 'ядра', 'частот'],
        a: () => spec('Процессор', '<b>' + HW.cpu + '</b>') },
      { k: ['видеокарт', 'видео', 'график', 'gpu', 'видюх'],
        a: () => spec('Графика', '<b>' + HW.gpu + '</b>') },
      { k: ['озу', 'оператив', 'памят', 'ram', 'сколько памяти'],
        a: () => spec('Оперативная память', '<b>' + HW.ram + '</b>') },
      { k: ['диск', 'накопит', 'ssd', 'nvme', 'жёстк', 'жестк', 'место', 'хранилищ'],
        a: () => spec('Накопитель', '<b>' + HW.disk + '</b>') },
      { k: ['сеть', 'вайфай', 'wi-fi', 'wifi', 'интернет', 'пинг', 'подключен'],
        a: () => spec('Сеть', '<b>' + HW.net + '</b>') },
      { k: ['батаре', 'батар', 'аккумулятор', 'заряд', 'питани'],
        a: () => spec('Питание', '<b>87%</b>, работает от сети') },
      { k: ['экран', 'монитор', 'разрешен', 'дисплей', 'герц', 'гц'],
        a: () => spec('Экран', '<b>' + window.innerWidth + '×' + window.innerHeight + '</b>, 144 Гц') },
      { k: ['ос', 'система', 'версия', 'какая виндовс', 'что за система'],
        a: () => { const g = SysInfo.get(); return spec('Система', '<b>' + g.name + ' ' + g.version + '</b>, сборка ' + g.build); } },
      { k: ['ядро', 'kernel'], a: () => spec('Ядро', '<b>' + SysInfo.get().kernel + '</b>') },
      { k: ['оболочк', 'терминал', 'lsh'], a: () => spec('Оболочка', '<b>lsh</b> (веб)') },
      { k: ['оконн', 'плексус'], a: () => spec('Оконный менеджер', '<b>Плексус</b>') },
      { k: ['как меня зовут', 'кто я', 'имя', 'пользовател', 'юзер', 'логин', 'аккаунт'],
        a: () => spec('Пользователь', '<b>' + USER + '</b>, локальная запись') },
      { k: ['время', 'час', 'дата', 'число', 'который час'],
        a: () => spec('Дата и время', '<b>' + new Date().toLocaleString('ru-RU') + '</b>') },
      { k: ['аптайм', 'сколько работает', 'время работы', 'включен'],
        a: () => spec('Аптайм', '<b>' + TaskMan.uptime() + '</b>') },
      { k: ['тема', 'оформлен'], a: () => spec('Тема', '<b>' + State.theme + '</b>, акцент ' + State.accent) },
      { k: ['обои', 'фон'], a: () => spec('Обои', '<b>' + (State.wall || 'aurora') + '</b>') },
      { k: ['процесс', 'что запущено', 'загрузк'], a: () => { CMDS.ps(); return ''; } },
      { k: ['характеристик', 'конфигурац', 'спецификац', 'о системе', 'всё', 'все', 'инфо', 'сведени', 'расскажи'],
        a: () => { const g = SysInfo.get(); return [
          spec('Компьютер', '<b>' + HW.model + '</b>'),
          spec('Система', '<b>' + g.name + ' ' + g.version + '</b>, сборка ' + g.build),
          spec('Ядро', '<b>' + g.kernel + '</b>'),
          spec('Процессор', '<b>' + HW.cpu + '</b>'),
          spec('Оперативная память', '<b>' + HW.ram + '</b>'),
          spec('Графика', '<b>' + HW.gpu + '</b>'),
          spec('Накопитель', '<b>' + HW.disk + '</b>'),
          spec('Сеть', '<b>' + HW.net + '</b>'),
          spec('Экран', '<b>' + window.innerWidth + '×' + window.innerHeight + '</b>, 144 Гц'),
          spec('Пользователь', '<b>' + USER + '</b>'),
          spec('Аптайм', '<b>' + TaskMan.uptime() + '</b>'),
        ].join('\n'); } },
    ];

    // Приводим вопрос к простому виду: без регистра, ё и знаков препинания.
    const norm = q => String(q || '').toLowerCase().replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9\s-]/gi, ' ').replace(/\s+/g, ' ').trim();

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
          '  <span class="g">date</span>, <span class="g">whoami</span>, <span class="g">ver</span>, <span class="g">clear</span>, <span class="g">exit</span>',
          '',
          '<span class="y">Спросить словами:</span> напишите вопрос прямо так, без команды —',
          '  <span class="g">модель компьютера</span>, <span class="g">какой процессор</span>, <span class="g">сколько ОЗУ</span>,',
          '  <span class="g">что за система</span>, <span class="g">характеристики</span> — и терминал ответит.',
          '  То же самое явно: <span class="g">ask</span> &lt;вопрос&gt;'].join('\n'));
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
        print(['<span class="p">        ▄▄▄▄▄▄▄▄        </span>  <span class="y">' + SysInfo.get().user + '@' + SysInfo.get().name.toUpperCase() + '</span>',
          '<span class="p">      ▄█████████▄      </span>  ─────────────────────────',
          '<span class="p">     ███████████████   </span>  ОС:        ' + SysInfo.get().name + ' ' + SysInfo.get().version + ' (сборка ' + SysInfo.get().build + ')',
          '<span class="p">     ███  ███  ██████  </span>  Ядро:      ' + SysInfo.get().kernel + ',',
          '<span class="p">     ███  ███  ██████  </span>  Оболочка:  lsh (веб)',
          '<span class="p">     ███████████████   </span>  Оконный:   Плексус, снап на 12 зон',
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
      whoami() { print(SysInfo.get().name.toLowerCase() + '\\' + USER); },
      ver() { const g = SysInfo.get(); print(g.name + ' ' + g.version + ', ядро ' + g.kernel + ', сборка ' + g.build); },
      clear() { out.innerHTML = ''; },
      exit() { WM.close(rec.id); },
      calc(a) {
        try { print('<span class="g">' + Function('"use strict";return (' + String(a).replace(/[^0-9+\-*/(). %]/g, '') + ')')() + '</span>'); }
        catch (e) { print('<span class="r">Ошибка выражения</span>'); }
      },
      sudo() { print('<span class="y">' + USER + ' не входит в список sudoers. Инцидент будет зарегистрирован.</span>'); },
      ask(a) {
        if (!a) return print('<span class="d">Спросите, например: «модель компьютера»</span>');
        if (answer(a) === null) print('<span class="r">Не знаю ответа. Попробуйте: «модель компьютера», «процессор», «ОЗУ», «система».</span>');
      },
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
      else {
        // Не команда — значит вопрос. Ищем ответ по ключевым словам.
        const ans = answer(trimmed);
        if (ans === null) print('<span class="r">«' + esc(sp[0]) + '» не распознано. Введите «help» или спросите словами: «модель компьютера».</span>');
      }
      out.scrollTop = out.scrollHeight;
    }

    /* Ищем самое точное совпадение: побеждает факт с самой длинной подошедшей
       фразой. Иначе «о системе» перебивало бы «система» в коротком вопросе. */
    function answer(q) {
      const n = norm(q);
      if (!n) return null;
      let best = null, bestLen = 0;
      FACTS.forEach(f => {
        f.k.forEach(key => {
          const k = norm(key);
          if (k && n.indexOf(k) >= 0 && k.length > bestLen) { best = f; bestLen = k.length; }
        });
      });
      if (!best) return null;
      const text = best.a();
      if (text) String(text).split('\n').forEach(l => print(l));
      return best;
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
   СВЕДЕНИЯ О СИСТЕМЕ (имя, версия, ядро, сборка, пользователь)
   Значения можно менять из панели администратора. Всё, что помечено в разметке
   атрибутом data-sys, обновляется вызовом SysInfo.apply().
   ========================================================================== */
const SysInfo = (() => {
  const DEFAULTS = {
    name: 'Люмен', version: '1.4', kernel: 'люмен-1.4-generic',
    build: '3040', user: USER,
  };
  const cur = { ...DEFAULTS };
  const KEY = 'w12.sysinfo';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw);
        Object.keys(DEFAULTS).forEach(k => { if (typeof o[k] === 'string' && o[k].trim()) cur[k] = o[k].trim(); });
      }
    } catch (e) { /* хранилище недоступно */ }
  }
  function saveAll() { save(KEY, JSON.stringify(cur)); }

  function apply() {
    const set = (k, v) => $$('[data-sys="' + k + '"]').forEach(n => { n.textContent = v; });
    set('name', cur.name);
    set('namever', cur.name + ' ' + cur.version);
    set('version', cur.version);
    set('kernel', cur.kernel);
    set('build', cur.build);
    set('user', cur.user);
    set('user-initial', (cur.user[0] || 'Г').toUpperCase());
    document.title = cur.name + ' — веб-ОС';
  }

  function update(patch) {
    let changed = [];
    Object.keys(DEFAULTS).forEach(k => {
      const v = patch[k];
      if (typeof v === 'string' && v.trim() && v.trim() !== cur[k]) { cur[k] = v.trim().slice(0, 40); changed.push(k); }
    });
    if (changed.length) { saveAll(); apply(); }
    return changed;
  }
  function reset() { Object.assign(cur, DEFAULTS); saveAll(); apply(); return DEFAULTS; }

  load();
  return { get: () => ({ ...cur }), defaults: () => ({ ...DEFAULTS }), update, reset, apply };
})();

/* ============================================================================
   ДИСПЕТЧЕР ЗАДАЧ (данные)
   ========================================================================== */
const TaskMan = (() => {
  const bootTime = Date.now();
  const SYS = [
    { pid: 4, name: 'System', base: 1.2, mem: 88 },
    { pid: 108, name: 'люмен-ядро', base: 2.4, mem: 214 },
    { pid: 512, name: 'Плексус (оконный менеджер)', base: 1.8, mem: 132 },
    { pid: 620, name: 'lsh', base: 3.1, mem: 168 },
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
        <div class="set-card" style="margin-bottom:12px"><h5>Процессор · люмен-1.4 · 16 ядер</h5>
          <div style="font-family:var(--font-display);font-size:38px;font-weight:300">${clamp(cpu, 1, 99).toFixed(0)}%</div>
          <canvas class="cpu-graph" width="760" height="130" style="width:100%;height:130px;border-radius:12px;background:rgba(0,0,0,.3)"></canvas></div>
        <div class="set-grid adm">
          <div class="set-card"><h5>Память</h5><div style="font-size:26px;font-family:var(--font-display);font-weight:300">9.4 / 32 ГБ</div></div>
          <div class="set-card"><h5>Графика · Плексус GPU</h5><div style="font-size:26px;font-family:var(--font-display);font-weight:300">${clamp(cpu * 1.3, 2, 99).toFixed(0)}%</div></div>
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
      const NAMES = ['lsh', 'Страж', 'AudioSrv', 'Плексус', 'CloudSync'];
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
      '<div class="app-bar"><b style="font-size:12.5px">Коллекция «Обои Люмен»</b><span style="flex:1"></span>' +
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
      if (a === 'save') Notify('Paint 12', 'Рисунок сохранён в ' + HOME + '\\Изображения\\figure.png', ICO.paint);
    };
    $('#pSize', rec.body).oninput = e => { size = +e.target.value; $('#pSizeTxt', rec.body).textContent = size + ' px'; };
    $('#pColor', rec.body).oninput = e => { color = e.target.value; eraser = false; $$('.pc', rec.body).forEach(x => x.classList.remove('on')); };
  }
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: МУЗЫКА (синтез через Web Audio API)
   ========================================================================== */
/* Плеер играет настоящие записи с YouTube. Список проверен запросом к самому
   YouTube, поэтому подписи совпадают с тем, что там лежит. Кнопки свои:
   встроенные не вписываются в оформление системы. */
let ytReady = null;
function loadYT() {
  if (ytReady) return ytReady;
  ytReady = new Promise((res, rej) => {
    if (window.YT && window.YT.Player) return res(window.YT);
    window.onYouTubeIframeAPIReady = () => res(window.YT);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => rej(new Error('нет связи с YouTube'));
    document.head.appendChild(s);
  });
  return ytReady;
}

const mmss = s => {
  s = Math.max(0, Math.floor(s || 0));
  return Math.floor(s / 60) + ':' + pad(s % 60);
};

WM.register({
  id: 'music', title: 'Музыка', icon: ICO.music, w: 760, h: 640,
  init(rec) {
    const TRACKS = [
      { id: 'dQw4w9WgXcQ', n: 'Never Gonna Give You Up', a: 'Rick Astley' },
      { id: '9bZkp7q19f0', n: 'GANGNAM STYLE', a: 'PSY' },
      { id: 'kJQP7kiw5Fk', n: 'Despacito', a: 'Luis Fonsi' },
      { id: 'JGwWNGJdvx8', n: 'Shape of You', a: 'Ed Sheeran' },
      { id: 'RgKAFK5djSk', n: 'See You Again', a: 'Wiz Khalifa' },
      { id: 'OPf0YbXqDm0', n: 'Uptown Funk', a: 'Mark Ronson' },
      { id: 'fJ9rUzIMcZQ', n: 'Bohemian Rhapsody', a: 'Queen' },
      { id: 'hT_nvWreIhg', n: 'Counting Stars', a: 'OneRepublic' },
      { id: 'YQHsXMglC9A', n: 'Hello', a: 'Adele' },
      { id: 'CevxZvSJLk8', n: 'Roar', a: 'Katy Perry' },
      { id: '60ItHLz5WEA', n: 'Faded', a: 'Alan Walker' },
      { id: '7wtfhZwyrcc', n: 'Believer', a: 'Imagine Dragons' },
      { id: 'lp-EO5I60KA', n: 'Thinking Out Loud', a: 'Ed Sheeran' },
      { id: 'SlPhMPnQ58k', n: 'Memories', a: 'Maroon 5' },
      { id: '2Vv-BfVoq4g', n: 'Perfect', a: 'Ed Sheeran' },
      { id: 'e-ORhEE9VVg', n: 'Blank Space', a: 'Taylor Swift' },
      { id: 'pRpeEdMmmQ0', n: 'Waka Waka', a: 'Shakira' },
      { id: 'ktvTqknDobU', n: 'Radioactive', a: 'Imagine Dragons' },
      { id: 'nfWlot6h_JM', n: 'Shake It Off', a: 'Taylor Swift' },
      { id: 'QcIy9NiNbmo', n: 'Bad Blood', a: 'Taylor Swift' },
    ];
    let idx = 0, player = null, ready = false, playing = false, dragging = false;

    rec.body.innerHTML = `<div class="app"><div class="mus2">
      <div class="mus2-stage"><div class="mus2-frame"><div id="yt-${rec.id}"></div></div></div>
      <div class="mus2-meta"><b class="m2-name"></b><span class="m2-art"></span></div>
      <div class="mus2-bar">
        <span class="m2-cur mono">0:00</span>
        <input type="range" class="m2-seek" min="0" max="1000" value="0" aria-label="Позиция">
        <span class="m2-dur mono">0:00</span>
      </div>
      <div class="mus2-ctrl">
        <button data-a="prev" title="Предыдущая">${ICO.prev}</button>
        <button data-a="play" class="play" title="Пуск">${ICO.play}</button>
        <button data-a="next" title="Следующая">${ICO.next}</button>
        <span class="mus2-vol"><span class="m2-vlabel">Звук</span>
          <input type="range" class="m2-vol" min="0" max="100" value="${State.volume}" aria-label="Громкость"></span>
      </div>
      <div class="mus2-list"></div>
    </div></div>`;

    const list = $('.mus2-list', rec.body);
    const seek = $('.m2-seek', rec.body);
    const curEl = $('.m2-cur', rec.body);
    const durEl = $('.m2-dur', rec.body);
    const playBtn = $('[data-a="play"]', rec.body);

    list.innerHTML = TRACKS.map((t, i) =>
      `<div class="m2-row" data-i="${i}">
        <img src="https://i.ytimg.com/vi/${t.id}/mqdefault.jpg" alt="" loading="lazy">
        <div class="m2-rt"><b>${esc(t.n)}</b><span>${esc(t.a)}</span></div>
        <span class="m2-num">${i + 1}</span>
      </div>`).join('');

    function setUI() {
      const t = TRACKS[idx];
      $('.m2-name', rec.body).textContent = t.n;
      $('.m2-art', rec.body).textContent = t.a;
      $('.tb-title', rec.node).textContent = 'Музыка — ' + t.n;
      $$('.m2-row', rec.body).forEach((r, i) => r.classList.toggle('on', i === idx));
      curEl.textContent = '0:00'; durEl.textContent = '0:00'; seek.value = 0;
    }

    function markPlaying(on) {
      playing = on;
      playBtn.innerHTML = on ? ICO.pause : ICO.play;
      playBtn.title = on ? 'Пауза' : 'Пуск';
      rec.node.classList.toggle('mus-playing', on);
    }

    function select(i, autoplay) {
      idx = (i + TRACKS.length) % TRACKS.length;
      clearBlocked();
      setUI();
      if (player && ready) {
        if (autoplay) player.loadVideoById(TRACKS[idx].id);
        else player.cueVideoById(TRACKS[idx].id);
      }
    }

    /* Полоса обновляется по таймеру: события плеера приходят редко, а позиция
       нужна каждую секунду. Тянет ползунок пользователь — тогда не мешаем. */
    function startTick() {
      clearInterval(rec.api.iv);
      rec.api.iv = setInterval(() => {
        if (!player || !ready || typeof player.getCurrentTime !== 'function') return;
        const d = player.getDuration() || 0, c = player.getCurrentTime() || 0;
        durEl.textContent = mmss(d);
        if (!dragging) {
          curEl.textContent = mmss(c);
          seek.value = d ? Math.round(c / d * 1000) : 0;
        }
      }, 500);
    }

    function fail(err) {
      $('.mus2-stage', rec.body).innerHTML =
        `<div class="mus2-off"><b>Плеер недоступен</b>
         <p>Не удалось связаться с YouTube. Проверьте подключение к сети.</p>
         <p class="mono">${esc(String(err && err.message || err))}</p></div>`;
    }

    /* Запись может запрещать показ в рамке (у YouTube это ошибка 150). Тогда
       молча листать список нельзя: пользователь должен понять, что произошло,
       и иметь выход — открыть песню в YouTube Music. Сообщение кладём накладкой
       поверх плеера: сам плеер не трогаем, иначе выбор другой песни перестанет
       работать. */
    function showBlocked(t) {
      const q = encodeURIComponent(t.n + ' ' + t.a);
      let off = $('.mus2-off', rec.body);
      if (!off) {
        off = el('div', 'mus2-off');
        $('.mus2-stage', rec.body).appendChild(off);
      }
      off.innerHTML =
        `<b>Запись запрещает показ здесь</b>
         <p>Владелец записи «${esc(t.n)}» не разрешает встраивание. Так делают многие
            официальные клипы — это ограничение YouTube, а не системы.</p>
         <p><a class="mus2-open" target="_blank" rel="noopener"
               href="https://music.youtube.com/search?q=${q}">Открыть в YouTube Music</a></p>`;
      markPlaying(false);
      clearInterval(rec.api.iv);
      $$('.m2-row', rec.body).forEach((r, i) => r.classList.toggle('bad', i === idx));
    }

    function clearBlocked() {
      const off = $('.mus2-off', rec.body);
      if (off) off.remove();
      $$('.m2-row.bad', rec.body).forEach(r => r.classList.remove('bad'));
    }

    loadYT().then(YT => {
      player = new YT.Player('yt-' + rec.id, {
        videoId: TRACKS[idx].id,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1, iv_load_policy: 3 },
        events: {
          onReady() {
            ready = true;
            player.setVolume(State.volume);
            // Пока плеер поднимался, могли выбрать другую запись — ставим её.
            if (idx !== 0) player.cueVideoById(TRACKS[idx].id);
            setUI();
          },
          onStateChange(e) {
            if (e.data === 1) { clearBlocked(); markPlaying(true); startTick(); }
            else if (e.data === 2) { markPlaying(false); clearInterval(rec.api.iv); }
            else if (e.data === 0) { select(idx + 1, true); }
          },
          onError(e) {
            // 101 и 150 — запрет встраивания, остальное лечится повтором.
            if (e.data === 101 || e.data === 150) showBlocked(TRACKS[idx]);
            else {
              Notify('Музыка', 'Запись недоступна, включаю следующую.', ICO.music, true);
              select(idx + 1, playing);
            }
          },
        },
      });
    }).catch(fail);
    rec.api.yt = () => player;

    $('.mus2-ctrl', rec.body).onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      Sound.click();
      const a = b.dataset.a;
      if (a === 'play') {
        if (!player || !ready) return;
        if (playing) player.pauseVideo(); else player.playVideo();
      }
      if (a === 'next') select(idx + 1, true);
      if (a === 'prev') select(idx - 1, true);
    };

    list.onclick = e => {
      const row = e.target.closest('.m2-row'); if (!row) return;
      Sound.click();
      select(+row.dataset.i, true);
    };

    seek.addEventListener('pointerdown', () => { dragging = true; });
    seek.addEventListener('pointerup', () => { dragging = false; });
    seek.addEventListener('change', () => {
      dragging = false;
      if (!player || !ready) return;
      const d = player.getDuration() || 0;
      player.seekTo(d * (+seek.value / 1000), true);
    });

    $('.m2-vol', rec.body).oninput = e => {
      State.volume = +e.target.value;
      if (player && ready && typeof player.setVolume === 'function') player.setVolume(State.volume);
      const v = $('#vol'); if (v) v.value = State.volume;
    };

    setUI();
    rec.api.stop = () => { clearInterval(rec.api.iv); if (player && ready && player.pauseVideo) player.pauseVideo(); };
  },
  onClose(rec) {
    clearInterval(rec.api.iv);
    const yt = rec.api.yt && rec.api.yt();
    // Звук должен умолкнуть вместе с окном, иначе играет «в никуда».
    try { if (yt && yt.stopVideo) yt.stopVideo(); } catch (e) { /* плеер уже снят */ }
  },
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: КАЛЕНДАРЬ
   ========================================================================== */
WM.register({
  id: 'calendar', title: 'Календарь', icon: ICO.cal, w: 780, h: 560,
  init(rec) {
    const cur = new Date(); cur.setDate(1);
    const EVENTS = { 3: 'Синк ядра', 11: 'Ревью Плексуса', 17: 'Релиз 1.4', 24: 'Демо команде' };
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
      { f: 'Ядро · Отдел релизов', s: 'Люмен 1.4 — окно обновления', t: '10:42', b: 'Планируем выкатку на четверг. Проверьте совместимость «Плексуса» со снапом на 12 зон и обновите базовые образы.' },
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
            '<div style="font-size:11px;color:var(--txt-dim)">кому: ' + USER.toLowerCase() + '@lumen · ' + esc(MAIL[sel].t) + '</div></div></div>' +
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
      { n: 'Браузер', d: 'Настоящие сайты из интернета', i: ICO.globe, app: 'browser' },
      { n: 'Игры', d: 'Змейка, Тетрис, Понг, Арканоид, 2048', i: ICO.game, app: 'games' },
      { n: 'Orbit Mail', d: 'Почтовый клиент', i: ICO.mail, app: 'mail' },
      { n: 'Defender 12', d: 'Защита в реальном времени', i: ICO.shield, app: 'security' },
      { n: 'Photos', d: 'Галерея и обои', i: ICO.photos, app: 'photos' },
      { n: 'Paint 12', d: 'Растровый редактор', i: ICO.paint, app: 'paint' },
      { n: 'Music', d: 'Синтезатор и плеер', i: ICO.music, app: 'music' },
      { n: 'Terminal', d: 'lsh 12', i: ICO.term, app: 'terminal' },
      { n: 'Календарь', d: 'Планирование', i: ICO.cal, app: 'calendar' },
      { n: 'Диспетчер задач', d: 'Процессы и производительность', i: ICO.task, app: 'taskmgr' },
    ];
    rec.body.innerHTML = '<div class="app">' +
      '<div class="app-bar"><b style="font-size:13px">Магазин Люмен</b><span style="flex:1"></span>' +
      '<span style="font-size:11.5px;color:var(--txt-dim)">Установлено: ' + ITEMS.length + '</span></div>' +
      '<div class="app-main" style="padding:16px">' +
        '<div style="border-radius:18px;padding:26px;margin-bottom:18px;background:linear-gradient(140deg,rgba(92,200,255,.22),rgba(123,108,255,.14));border:1px solid var(--stroke)">' +
          '<div style="font-family:var(--font-display);font-weight:400;font-size:24px">Избранное этой недели</div>' +
          '<p style="font-size:12.5px;color:var(--txt-dim);margin-top:8px">Приложения, оптимизированные для «Плексуса» и снапа на 12 зон.</p></div>' +
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
   ПРИЛОЖЕНИЕ: ИГРЫ
   Каждая игра: init(host) -> { frame(dt), key(k), restart(), help, pad }
   pad — список кнопок на экране: { k: клавиша, t: подпись, w: ширина }
   ========================================================================== */
const Games = (() => {
  const cv = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h; c.className = 'g-canvas';
    return c;
  };
  // roundRect есть не везде — рисуем сами.
  const rr = (x, y, w, h, r) => {
    if (x.roundRect) { x.beginPath(); x.roundRect(y[0], y[1], w, h, r); x.fill(); return; }
    x.beginPath();
    x.moveTo(y[0] + r, y[1]);
    x.arcTo(y[0] + w, y[1], y[0] + w, y[1] + h, r);
    x.arcTo(y[0] + w, y[1] + h, y[0], y[1] + h, r);
    x.arcTo(y[0], y[1] + h, y[0], y[1], r);
    x.arcTo(y[0], y[1], y[0] + w, y[1], r);
    x.closePath(); x.fill();
  };
  const PAD_DIRS = [
    { k: 'ArrowLeft', t: '←' }, { k: 'ArrowUp', t: '↑' },
    { k: 'ArrowDown', t: '↓' }, { k: 'ArrowRight', t: '→' },
  ];

  /* ------------------------------ ЗМЕЙКА ---------------------------------- */
  const Snake = {
    name: 'Змейка',
    hint: 'Собирайте еду и растите. Управление: кнопки на экране, стрелки или WASD.',
    pad: [{ k: 'ArrowLeft', t: '←' }, { k: 'ArrowUp', t: '↑' }, { k: 'ArrowDown', t: '↓' }, { k: 'ArrowRight', t: '→' },
          { k: 'p', t: 'Пауза', w: 'wide' }],
    init(host) {
      const S = 18, N = 18, size = S * N;
      const c = cv(size, size); host.appendChild(c);
      const x = c.getContext('2d');
      let snake, dir, nd, food, score, best = +(localStorage.getItem('lumen.snake.best') || 0), dead, acc, paused, hi = 0;
      const score_ = () => host.dispatchEvent(new CustomEvent('gscore', {
        detail: { score: score, best: best, label: 'Счёт', bestLabel: 'Рекорд' } }));
      function place() {
        let p;
        do { p = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 }; }
        while (snake.some(s => s.x === p.x && s.y === p.y));
        return p;
      }
      function reset() {
        snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
        dir = { x: 1, y: 0 }; nd = dir; food = place();
        score = 0; dead = false; acc = 0; paused = false; score_();
      }
      function step() {
        dir = nd;
        const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some(s => s.x === h.x && s.y === h.y)) {
          dead = true;
          if (score > best) { best = score; localStorage.setItem('lumen.snake.best', String(best)); }
          Sound.error(); score_(); return;
        }
        snake.unshift(h);
        if (h.x === food.x && h.y === food.y) {
          score += 10; food = place(); Sound.notif(); score_();
        } else snake.pop();
      }
      function draw() {
        x.fillStyle = '#0b1220'; x.fillRect(0, 0, size, size);
        x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 1;
        for (let i = 1; i < N; i++) {
          x.beginPath(); x.moveTo(i * S, 0); x.lineTo(i * S, size); x.stroke();
          x.beginPath(); x.moveTo(0, i * S); x.lineTo(size, i * S); x.stroke();
        }
        x.fillStyle = '#ff5c9e';
        x.beginPath(); x.arc(food.x * S + S / 2, food.y * S + S / 2, S / 2 - 3, 0, 7); x.fill();
        snake.forEach((s, i) => {
          x.fillStyle = i === 0 ? '#5cc8ff' : 'rgba(92,200,255,' + Math.max(.35, .9 - i / (snake.length + 6)) + ')';
          rr(x, [s.x * S + 2, s.y * S + 2], S - 4, S - 4, 5);
        });
        if (dead) {
          x.fillStyle = 'rgba(4,8,18,.8)'; x.fillRect(0, 0, size, size);
          x.fillStyle = '#fff'; x.textAlign = 'center';
          x.font = '600 21px system-ui'; x.fillText('Игра окончена', size / 2, size / 2 - 4);
          x.font = '400 13px system-ui'; x.fillStyle = 'rgba(255,255,255,.72)';
          x.fillText('Счёт ' + score + ' · нажмите «Заново»', size / 2, size / 2 + 22);
        }
      }
      function frame(dt) {
        acc += dt;
        // Скорость растёт мягко: от 190 мс до 95 мс.
        const speed = Math.max(95, 190 - score * 1.6);
        if (acc >= speed) { acc = 0; step(); }
        draw();
      }
      reset();
      return {
        frame, restart: reset,
        key(k) {
          if (dead) return [' ', 'Enter'].includes(k);
          if (k === 'p' || k === 'P' || k === 'з') { paused = !paused; return true; }
          const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
                      w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
                      ц: [0, -1], ы: [0, 1], ф: [-1, 0], в: [1, 0] }[k];
          if (m && !(m[0] === -dir.x && m[1] === -dir.y)) { nd = { x: m[0], y: m[1] }; return true; }
          return false;
        },
        help: 'Собирайте еду и растите. Кнопки на экране, стрелки или WASD.',
      };
    },
  };

  /* ------------------------------ ТЕТРИС ---------------------------------- */
  const Tetris = {
    name: 'Тетрис',
    hint: 'Складывайте фигуры в линии. Они исчезают, когда линия заполнена.',
    pad: [{ k: 'ArrowLeft', t: '←' }, { k: 'ArrowUp', t: 'Поворот' }, { k: 'ArrowRight', t: '→' },
          { k: 'ArrowDown', t: '↓' }, { k: ' ', t: 'Сброс', w: 'wide' }],
    init(host) {
      const C = 26, COLS = 10, ROWS = 18;
      const c = cv(C * COLS, C * ROWS); host.appendChild(c);
      const x = c.getContext('2d');
      const SHAPES = [
        [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
        [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]],
      ];
      const COLORS = ['#5cc8ff', '#ffd166', '#c792ea', '#4f8cff', '#ff9f68', '#4ee1a0', '#ff5c9e'];
      let grid, piece, px, py, pi, score, lines, dead, acc, best = +(localStorage.getItem('lumen.tetris.best') || 0);
      const board = () => host.dispatchEvent(new CustomEvent('gscore', {
        detail: { score: score, best: best, label: 'Очки', bestLabel: 'Рекорд', extra: 'Линий: ' + lines } }));
      function newPiece() {
        pi = (Math.random() * SHAPES.length) | 0;
        piece = SHAPES[pi].map(r => r.slice());
        px = ((COLS - piece[0].length) / 2) | 0; py = 0;
        if (hit(px, py, piece)) {
          dead = true;
          if (score > best) { best = score; localStorage.setItem('lumen.tetris.best', String(best)); }
          Sound.error(); board();
        }
      }
      function hit(nx, ny, sh) {
        for (let y = 0; y < sh.length; y++) for (let xx = 0; xx < sh[y].length; xx++) {
          if (!sh[y][xx]) continue;
          const gx = nx + xx, gy = ny + y;
          if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
          if (gy >= 0 && grid[gy][gx]) return true;
        }
        return false;
      }
      function clear() {
        let n = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
          if (grid[y].every(v => v)) { grid.splice(y, 1); grid.unshift(new Array(COLS).fill(0)); n++; y++; }
        }
        if (n) { lines += n; score += [0, 40, 100, 300, 1200][n] || 1200; Sound.notif(); }
      }
      function drop1() {
        if (!hit(px, py + 1, piece)) { py++; return false; }
        piece.forEach((row, y) => row.forEach((v, xx) => { if (v) grid[py + y][px + xx] = pi + 1; }));
        clear(); newPiece(); board(); return true;
      }
      function reset() {
        grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
        score = 0; lines = 0; dead = false; acc = 0; newPiece(); board();
      }
      function draw() {
        x.fillStyle = '#0b1220'; x.fillRect(0, 0, c.width, c.height);
        x.strokeStyle = 'rgba(255,255,255,.05)';
        for (let i = 1; i < COLS; i++) { x.beginPath(); x.moveTo(i * C, 0); x.lineTo(i * C, c.height); x.stroke(); }
        for (let i = 1; i < ROWS; i++) { x.beginPath(); x.moveTo(0, i * C); x.lineTo(c.width, i * C); x.stroke(); }
        const cell = (gx, gy, col) => { x.fillStyle = col; rr(x, [gx * C + 2, gy * C + 2], C - 4, C - 4, 5); };
        grid.forEach((row, y) => row.forEach((v, gx) => { if (v) cell(gx, y, COLORS[v - 1]); }));
        piece.forEach((row, y) => row.forEach((v, xx) => { if (v && py + y >= 0) cell(px + xx, py + y, COLORS[pi]); }));
        if (dead) {
          x.fillStyle = 'rgba(4,8,18,.82)'; x.fillRect(0, 0, c.width, c.height);
          x.fillStyle = '#fff'; x.textAlign = 'center';
          x.font = '600 21px system-ui'; x.fillText('Игра окончена', c.width / 2, c.height / 2 - 4);
          x.font = '400 13px system-ui'; x.fillStyle = 'rgba(255,255,255,.72)';
          x.fillText('Очки ' + score + ' · нажмите «Заново»', c.width / 2, c.height / 2 + 22);
        }
      }
      function frame(dt) {
        if (!dead) { acc += dt; if (acc >= 750) { acc = 0; drop1(); } }
        draw();
      }
      reset();
      return {
        frame, restart: reset,
        key(k) {
          if (dead) return [' ', 'Enter'].includes(k);
          if (k === 'ArrowLeft') { if (!hit(px - 1, py, piece)) px--; return true; }
          if (k === 'ArrowRight') { if (!hit(px + 1, py, piece)) px++; return true; }
          if (k === 'ArrowDown') { if (!drop1()) { score++; board(); } return true; }
          if (k === 'ArrowUp' || k === 'w') {
            const r = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
            for (const s of [0, -1, 1, -2, 2]) if (!hit(px + s, py, r)) { piece = r; px += s; break; }
            return true;
          }
          if (k === ' ') { while (!drop1()); acc = 0; return true; }
          return false;
        },
        help: 'Складывайте фигуры в линии. Стрелка вверх — поворот, пробел — сбросить вниз.',
      };
    },
  };

  /* ------------------------------- ПОНГ ----------------------------------- */
  const Pong = {
    name: 'Понг',
    hint: 'Отбивайте мяч ракеткой слева. Соперник играет справа. До 7 очков.',
    pad: [{ k: 'ArrowUp', t: '↑' }, { k: 'ArrowDown', t: '↓' }],
    init(host) {
      const W = 620, H = 400;
      const c = cv(W, H); host.appendChild(c);
      const x = c.getContext('2d');
      let py, ay, ball, score, ai, dead, won, vy = 0, best = +(localStorage.getItem('lumen.pong.best') || 0);
      const H1 = 74, PW = 11;
      const board = () => host.dispatchEvent(new CustomEvent('gscore', {
        detail: { score: score, best: best, label: 'Ваши очки', bestLabel: 'Лучшая серия', extra: 'Соперник: ' + ai } }));
      function reset() {
        py = H / 2 - H1 / 2; ay = H / 2 - H1 / 2;
        ball = { x: W / 2, y: H / 2, dx: 4.6, dy: 2.4, r: 8 };
        score = 0; ai = 0; dead = false; won = false; vy = 0; board();
      }
      function goal(who) {
        if (who === 'me') { score++; Sound.notif(); } else { ai++; Sound.error(); }
        board();
        if (score >= 7 || ai >= 7) {
          dead = true;
          if (score > best) { best = score; localStorage.setItem('lumen.pong.best', String(best)); }
          board();
        }
        ball.x = W / 2; ball.y = H / 2;
        ball.dx = (who === 'me' ? -1 : 1) * 4.6; ball.dy = (Math.random() * 4 - 2);
      }
      function frame(dt) {
        const k = Math.min(3, dt / 16.7);
        if (!dead) {
          py = Math.max(0, Math.min(H - H1, py + vy * 6 * k));
          // Соперник подстраивается, но с отставанием — его можно обыграть.
          const target = ball.y - H1 / 2;
          ay += Math.max(-4.4, Math.min(4.4, (target - ay) * 0.11)) * k;
          ay = Math.max(0, Math.min(H - H1, ay));
          ball.x += ball.dx * k; ball.y += ball.dy * k;
          if (ball.y < ball.r || ball.y > H - ball.r) { ball.dy *= -1; ball.y = Math.max(ball.r, Math.min(H - ball.r, ball.y)); }
          if (ball.x - ball.r < 26 + PW && ball.y > py && ball.y < py + H1 && ball.dx < 0) {
            ball.dx = Math.abs(ball.dx) * 1.03;
            ball.dy += ((ball.y - (py + H1 / 2)) / (H1 / 2)) * 2.2;
            Sound.click();
          }
          if (ball.x + ball.r > W - 26 - PW && ball.y > ay && ball.y < ay + H1 && ball.dx > 0) {
            ball.dx = -Math.abs(ball.dx);
            ball.dy += ((ball.y - (ay + H1 / 2)) / (H1 / 2)) * 1.4;
          }
          if (ball.x < -20) goal('ai');
          if (ball.x > W + 20) goal('me');
        }
        x.fillStyle = '#0b1220'; x.fillRect(0, 0, W, H);
        x.strokeStyle = 'rgba(255,255,255,.12)'; x.setLineDash([7, 9]);
        x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.stroke(); x.setLineDash([]);
        x.fillStyle = 'rgba(255,255,255,.5)'; x.font = '600 34px system-ui'; x.textAlign = 'center';
        x.fillText(String(score), W / 2 - 40, 44);
        x.fillText(String(ai), W / 2 + 40, 44);
        x.fillStyle = '#5cc8ff'; rr(x, [26, py], PW, H1, 6);
        x.fillStyle = '#ff5c9e'; rr(x, [W - 26 - PW, ay], PW, H1, 6);
        x.fillStyle = '#fff'; x.beginPath(); x.arc(ball.x, ball.y, ball.r, 0, 7); x.fill();
        if (dead) {
          x.fillStyle = 'rgba(4,8,18,.82)'; x.fillRect(0, 0, W, H);
          x.fillStyle = '#fff'; x.font = '600 22px system-ui';
          x.fillText(score > ai ? 'Вы победили!' : 'Соперник победил', W / 2, H / 2 - 4);
          x.font = '400 13px system-ui'; x.fillStyle = 'rgba(255,255,255,.72)';
          x.fillText('Счёт ' + score + ':' + ai + ' · нажмите «Заново»', W / 2, H / 2 + 22);
        }
      }
      // Ракетка слушается мыши над полем.
      c.onmousemove = e => {
        const r = c.getBoundingClientRect();
        py = Math.max(0, Math.min(H - H1, (e.clientY - r.top) * (H / r.height) - H1 / 2));
      };
      reset();
      return {
        frame, restart: reset,
        key(k) {
          if (dead) return [' ', 'Enter'].includes(k);
          if (k === 'ArrowUp' || k === 'w' || k === 'ц') { vy = -1; return true; }
          if (k === 'ArrowDown' || k === 's' || k === 'ы') { vy = 1; return true; }
          return false;
        },
        keyup(k) {
          if (['ArrowUp', 'ArrowDown', 'w', 's', 'ц', 'ы'].includes(k)) { vy = 0; return true; }
          return false;
        },
        help: 'Отбивайте мяч ракеткой слева. Можно водить мышью или кнопками ↑ ↓. До 7 очков.',
      };
    },
  };

  /* ----------------------------- АРКАНОИД --------------------------------- */
  const Arkanoid = {
    name: 'Арканоид',
    hint: 'Разбейте мячом все кирпичи. Три попытки.',
    pad: [{ k: 'ArrowLeft', t: '←' }, { k: 'ArrowRight', t: '→' }, { k: ' ', t: 'Запуск', w: 'wide' }],
    init(host) {
      const W = 600, H = 420, PAD_W = 96, PAD_H = 12;
      const c = cv(W, H); host.appendChild(c);
      const x = c.getContext('2d');
      const ROWS = 5, COLS = 9, BW = 56, BH = 18, TOP = 54, LEFT = 24;
      const ROW_COLORS = ['#ff5c9e', '#c792ea', '#4f8cff', '#4ee1a0', '#ffd166'];
      let bricks, ball, px, lives, score, dead, launched, vx = 0, best = +(localStorage.getItem('lumen.ark.best') || 0);
      const board = () => host.dispatchEvent(new CustomEvent('gscore', {
        detail: { score: score, best: best, label: 'Очки', bestLabel: 'Рекорд', extra: 'Жизни: ' + lives } }));
      function reset() {
        bricks = [];
        for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) bricks.push({ x: LEFT + q * (BW + 4), y: TOP + r * (BH + 6), on: true, col: ROW_COLORS[r] });
        px = W / 2 - PAD_W / 2; lives = 3; score = 0; dead = false; launched = false; vx = 0;
        ball = { x: W / 2, y: H - 46, dx: 3.6, dy: -4.2, r: 7 };
        board();
      }
      function lose() {
        lives--; launched = false; Sound.error();
        ball = { x: px + PAD_W / 2, y: H - 46, dx: 3.6, dy: -4.2, r: 7 };
        if (lives <= 0) {
          dead = true;
          if (score > best) { best = score; localStorage.setItem('lumen.ark.best', String(best)); }
        }
        board();
      }
      function frame(dt) {
        const k = Math.min(3, dt / 16.7);
        if (!dead) {
          px = Math.max(0, Math.min(W - PAD_W, px + vx * 7.4 * k));
          if (!launched) { ball.x = px + PAD_W / 2; ball.y = H - 46; }
          else {
            ball.x += ball.dx * k; ball.y += ball.dy * k;
            if (ball.x < ball.r) { ball.dx = Math.abs(ball.dx); ball.x = ball.r; }
            if (ball.x > W - ball.r) { ball.dx = -Math.abs(ball.dx); ball.x = W - ball.r; }
            if (ball.y < ball.r) { ball.dy = Math.abs(ball.dy); ball.y = ball.r; }
            if (ball.y > H - 40 - ball.r && ball.y < H - 28 && ball.x > px && ball.x < px + PAD_W && ball.dy > 0) {
              ball.dy = -Math.abs(ball.dy);
              ball.dx += ((ball.x - (px + PAD_W / 2)) / (PAD_W / 2)) * 2;
              Sound.click();
            }
            if (ball.y > H + 20) lose();
            for (const b of bricks) {
              if (!b.on) continue;
              if (ball.x > b.x - ball.r && ball.x < b.x + BW + ball.r &&
                  ball.y > b.y - ball.r && ball.y < b.y + BH + ball.r) {
                b.on = false; score += 10; Sound.notif();
                if (Math.abs(ball.x - (b.x + BW / 2)) / (BW / 2) > Math.abs(ball.y - (b.y + BH / 2)) / (BH / 2)) ball.dx *= -1;
                else ball.dy *= -1;
                board();
                break;
              }
            }
            if (bricks.every(b => !b.on)) {
              dead = true;
              if (score > best) { best = score; localStorage.setItem('lumen.ark.best', String(best)); }
              Sound.open(); board();
            }
          }
        }
        x.fillStyle = '#0b1220'; x.fillRect(0, 0, W, H);
        bricks.forEach(b => { if (b.on) { x.fillStyle = b.col; rr(x, [b.x, b.y], BW, BH, 5); } });
        x.fillStyle = '#5cc8ff'; rr(x, [px, H - 34], PAD_W, PAD_H, 6);
        x.fillStyle = '#fff'; x.beginPath(); x.arc(ball.x, ball.y, ball.r, 0, 7); x.fill();
        x.fillStyle = 'rgba(255,255,255,.55)'; x.font = '600 13px system-ui'; x.textAlign = 'left';
        x.fillText('Очки: ' + score, 24, 30);
        x.textAlign = 'right'; x.fillText('Жизни: ' + Math.max(0, lives), W - 24, 30);
        if (!launched && !dead) {
          x.textAlign = 'center'; x.fillStyle = 'rgba(255,255,255,.75)'; x.font = '400 13px system-ui';
          x.fillText('Пробел или кнопка «Запуск» — отправить мяч', W / 2, H - 62);
        }
        if (dead) {
          x.fillStyle = 'rgba(4,8,18,.82)'; x.fillRect(0, 0, W, H);
          x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '600 22px system-ui';
          x.fillText(lives > 0 ? 'Все кирпичи разбиты!' : 'Игра окончена', W / 2, H / 2 - 4);
          x.font = '400 13px system-ui'; x.fillStyle = 'rgba(255,255,255,.72)';
          x.fillText('Очки ' + score + ' · нажмите «Заново»', W / 2, H / 2 + 22);
        }
      }
      c.onmousemove = e => {
        const r = c.getBoundingClientRect();
        px = Math.max(0, Math.min(W - PAD_W, (e.clientX - r.left) * (W / r.width) - PAD_W / 2));
      };
      reset();
      return {
        frame, restart: reset,
        key(k) {
          if (dead) return [' ', 'Enter'].includes(k);
          if (k === ' ') { launched = true; return true; }
          if (k === 'ArrowLeft' || k === 'a' || k === 'ф') { vx = -1; return true; }
          if (k === 'ArrowRight' || k === 'd' || k === 'в') { vx = 1; return true; }
          return false;
        },
        keyup(k) {
          if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'ф', 'в'].includes(k)) { vx = 0; return true; }
          return false;
        },
        help: 'Разбейте все кирпичи. Ракетка слушается мыши и кнопок ← →. Пробел — запуск мяча.',
      };
    },
  };

  /* ------------------------------- 2048 ----------------------------------- */
  const G2048 = {
    name: '2048',
    hint: 'Сдвигайте плитки. Одинаковые числа складываются. Цель — плитка 2048.',
    pad: PAD_DIRS,
    init(host) {
      const wrap = el('div', 'g-2048'); host.appendChild(wrap);
      let g, score, best = +(localStorage.getItem('lumen.g2048.best') || 0), dead, won;
      const board = () => host.dispatchEvent(new CustomEvent('gscore', {
        detail: { score: score, best: best, label: 'Очки', bestLabel: 'Рекорд', extra: dead ? 'Ходов нет' : (won ? 'Цель достигнута' : 'Соберите 2048') } }));
      function reset() {
        g = Array.from({ length: 4 }, () => new Array(4).fill(0));
        score = 0; dead = false; won = false; add(); add(); draw();
      }
      function add() {
        const free = [];
        g.forEach((row, y) => row.forEach((v, q) => { if (!v) free.push([y, q]); }));
        if (!free.length) return;
        const [y, q] = free[(Math.random() * free.length) | 0];
        g[y][q] = Math.random() < 0.9 ? 2 : 4;
      }
      function slide(row) {
        const r = row.filter(v => v);
        for (let i = 0; i < r.length - 1; i++) {
          if (r[i] === r[i + 1]) {
            r[i] *= 2; score += r[i];
            if (r[i] === 2048 && !won) { won = true; Sound.open(); Notify('2048', 'Плитка 2048 собрана!', ICO.game, true); }
            r.splice(i + 1, 1);
          }
        }
        while (r.length < 4) r.push(0);
        return r;
      }
      function canMove() {
        for (let y = 0; y < 4; y++) for (let q = 0; q < 4; q++) {
          if (!g[y][q]) return true;
          if (q < 3 && g[y][q] === g[y][q + 1]) return true;
          if (y < 3 && g[y][q] === g[y + 1][q]) return true;
        }
        return false;
      }
      function move(d) {
        if (dead) return;
        const before = JSON.stringify(g);
        if (d === 'left') g = g.map(slide);
        if (d === 'right') g = g.map(r => slide(r.slice().reverse()).reverse());
        if (d === 'up' || d === 'down') {
          for (let q = 0; q < 4; q++) {
            let col = [0, 1, 2, 3].map(y => g[y][q]);
            col = d === 'down' ? slide(col.reverse()).reverse() : slide(col);
            for (let y = 0; y < 4; y++) g[y][q] = col[y];
          }
        }
        if (JSON.stringify(g) !== before) { add(); Sound.click(); }
        if (!canMove()) {
          dead = true;
          if (score > best) { best = score; localStorage.setItem('lumen.g2048.best', String(best)); }
          Sound.error();
        }
        draw();
      }
      function draw() {
        wrap.innerHTML = '<div class="g-grid2048">' + g.flat().map(v =>
          '<div class="g-t2048 v' + (v > 2048 ? 'big' : v) + '">' + (v || '') + '</div>').join('') + '</div>';
        board();
      }
      reset();
      return {
        restart: reset,
        key(k) {
          if (dead) return [' ', 'Enter'].includes(k);
          const m = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[k];
          if (m) { move(m); return true; }
          return false;
        },
        help: 'Сдвигайте плитки стрелками. Одинаковые числа складываются. Цель — 2048.',
      };
    },
  };

  const LIST = [Snake, Tetris, Pong, Arkanoid, G2048];
  return { LIST, byName: n => LIST.find(g => g.name === n) };
})();

WM.register({
  id: 'games', title: 'Игры', icon: ICO.game, w: 940, h: 690,
  init(rec, arg) {
    let game = null, raf = 0, last = 0, running = false, paused = false, cur = null;
    rec.body.innerHTML = `<div class="app g-wrap">
      <div class="app-bar">
        <b style="font-size:13px">Игры</b>
        <span class="g-menu"></span>
        <span style="flex:1"></span>
        <span class="g-score" id="gScore"></span>
        <button class="btn" data-g="restart">${ICO.refresh}<span style="margin-left:6px">Заново</span></button>
        <button class="btn" data-g="pause" id="gPause">${ICO.pause}<span style="margin-left:6px">Пауза</span></button>
      </div>
      <div class="g-help" id="gHelp"></div>
      <div class="g-stage" id="gStage"></div>
      <div class="g-pad" id="gPad"></div>
    </div>`;
    const stage = $('#gStage', rec.body);
    const help = $('#gHelp', rec.body);
    const scoreEl = $('#gScore', rec.body);
    const menu = $('.g-menu', rec.body);
    const pad = $('#gPad', rec.body);
    const pauseBtn = $('#gPause', rec.body);

    menu.innerHTML = Games.LIST.map(g => '<button class="chip" data-gn="' + esc(g.name) + '">' + esc(g.name) + '</button>').join('');

    // Подписка одна на всё окно: игры шлют счёт событием gscore на .g-stage.
    stage.addEventListener('gscore', e => setScore(e.detail));

    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function loop(ts) {
      if (!running) return;
      const dt = Math.min(64, ts - last || 16); last = ts;
      // Игра идёт только когда окно активно — так система не тормозит.
      const active = State.active === rec.id;
      if (game && game.frame && !paused && active) game.frame(dt);
      raf = requestAnimationFrame(loop);
    }
    function setScore(d) {
      scoreEl.innerHTML = esc(d.label) + ': <b>' + d.score + '</b>' +
        (d.best != null ? ' · ' + esc(d.bestLabel) + ': <b>' + d.best + '</b>' : '') +
        (d.extra ? ' · ' + esc(d.extra) : '');
    }
    function setPaused(v) {
      paused = v;
      pauseBtn.classList.toggle('on', paused);
      $('span', pauseBtn).textContent = paused ? 'Продолжить' : 'Пауза';
      stage.classList.toggle('paused', paused);
    }
    function press(k) {
      if (!game || !game.key) return;
      if (game.key(k) && k === 'p') { /* пауза самой игры */ }
    }
    function start(name) {
      const def = Games.byName(name); if (!def) return;
      stop(); stage.innerHTML = ''; cur = name;
      $$('.chip', menu).forEach(c => c.classList.toggle('on', c.dataset.gn === name));
      setPaused(false);
      game = def.init(stage);
      help.textContent = game.help || def.hint || '';
      // Кнопки на экране под текущую игру.
      pad.innerHTML = (def.pad || []).map(b =>
        '<button class="g-pad-btn ' + (b.w === 'wide' ? 'wide' : '') + '" data-k="' + esc(b.k) + '">' + esc(b.t) + '</button>').join('');
      Sound.open();
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }

    // Удержание кнопки повторяет нажатие — так удобно и мышью, и пальцем.
    let holdT = 0;
    function holdStart(k) {
      press(k);
      const rep = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k);
      if (!rep) return;
      clearInterval(holdT);
      holdT = setInterval(() => press(k), 110);
    }
    function holdEnd(k) {
      clearInterval(holdT);
      if (game && game.keyup) game.keyup(k);
    }
    pad.addEventListener('pointerdown', e => {
      const b = e.target.closest('.g-pad-btn'); if (!b) return;
      e.preventDefault(); b.classList.add('on');
      holdStart(b.dataset.k);
    });
    pad.addEventListener('pointerup', e => {
      const b = e.target.closest('.g-pad-btn'); if (!b) return;
      b.classList.remove('on'); holdEnd(b.dataset.k);
    });
    pad.addEventListener('pointerleave', e => {
      const b = e.target.closest('.g-pad-btn'); if (!b) return;
      b.classList.remove('on'); holdEnd(b.dataset.k);
    });
    pad.addEventListener('pointercancel', e => {
      const b = e.target.closest('.g-pad-btn'); if (!b) return;
      b.classList.remove('on'); holdEnd(b.dataset.k);
    });

    // Клавиатура работает, когда окно игр активно.
    rec.api.keys = k => {
      if (!game) return false;
      if (k === 'Escape') { setPaused(!paused); return true; }
      return game.key ? game.key(k) : false;
    };
    rec.api.keyup = k => { if (game && game.keyup) return game.keyup(k); return false; };

    $('.app-bar', rec.body).onclick = e => {
      const b = e.target.closest('[data-g]'); if (!b) return;
      Sound.click();
      if (b.dataset.g === 'restart') { setPaused(false); if (game && game.restart) game.restart(); }
      if (b.dataset.g === 'pause') setPaused(!paused);
    };
    menu.onclick = e => { const b = e.target.closest('[data-gn]'); if (b) start(b.dataset.gn); };

    rec.api.start = start;
    rec.api.stop = stop;
    start(arg && Games.byName(arg) ? arg : 'Змейка');
  },
  onClose(rec) { rec.api.stop && rec.api.stop(); },
});

/* ============================================================================
   ПРИЛОЖЕНИЕ: БЕЗОПАСНОСТЬ WINDOWS
   ========================================================================== */
WM.register({
  id: 'security', title: 'Безопасность Люмен', icon: ICO.shield, w: 740, h: 540,
  init(rec) {
    const CHECKS = [
      { t: 'Защита от вирусов и угроз', s: 'Активна · базы обновлены', ok: true },
      { t: 'Безопасность аккаунта', s: 'Локальная учётная запись «' + USER + '»', ok: true },
      { t: 'Брандмауэр и сеть', s: 'Профиль ORBITAL-5G защищён', ok: true },
      { t: 'Управление приложениями', s: 'Контроль SmartScreen включён', ok: true },
      { t: 'Изоляция ядра', s: 'Виртуализация памяти включена', ok: true },
      { t: 'Резервное копирование', s: 'Последняя копия: 2 дня назад', ok: false },
    ];
    rec.body.innerHTML = '<div class="app">' +
      '<div class="app-bar"><b style="font-size:13px">Безопасность Люмен</b><span style="flex:1"></span>' +
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
/* ------------------------------ БРАУЗЕР ----------------------------------- */
/* Настоящий браузер. На сервере запускается Chromium, он сам открывает сайты,
   а окно показывает его экран. Мышь и клавиатура уходят обратно в Chromium.
   Для сайта это обычный браузер, поэтому работают и поиск Google, и видео на
   YouTube — то, что через прокси не работало.

   Если сервер не запущен (файл открыт напрямую), окно переходит в простой
   режим: страницы показываются через серверный прокси /__proxy. */

const SERVER_INFO = { known: false, ok: false, port: 12000, chromium: false };
const API = {
  liveBase() {
    // Открыто с сервера — берём тот же адрес. Открыто как файл — идём на порт сервера.
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      return proto + '//' + location.host + '/__live';
    }
    return 'ws://' + (location.hostname || 'localhost') + ':' + SERVER_INFO.port + '/__live';
  },
  env() {
    return fetch('/__env', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { SERVER_INFO.known = true; SERVER_INFO.ok = !!d.ok; SERVER_INFO.port = d.port || 12000; SERVER_INFO.chromium = !!d.chromium; return d; })
      .catch(() => { SERVER_INFO.known = true; return null; });
  },
};

WM.register({
  id: 'browser', title: 'Браузер', icon: ICO.globe, w: 1120, h: 720,
  init(rec) {
    const QUICK = [
      { t: 'Google', u: 'https://www.google.com/' },
      { t: 'YouTube', u: 'https://www.youtube.com/' },
      { t: 'Википедия', u: 'https://ru.wikipedia.org/' },
      { t: 'Яндекс', u: 'https://yandex.ru/' },
      { t: 'ВКонтакте', u: 'https://vk.com/' },
      { t: 'Кинопоиск', u: 'https://www.kinopoisk.ru/' },
      { t: 'Гитхаб', u: 'https://github.com/' },
      { t: 'Погода', u: 'https://yandex.ru/pogoda/' },
      { t: 'Архив', u: 'https://web.archive.org/' },
    ];
    const MOD = { 1: 1, 2: 2, 4: 8 };   // Alt, Ctrl, Meta — как ждёт Chromium

    rec.body.innerHTML = `<div class="app br">
      <div class="app-bar br-bar">
        <button class="btn" data-br="back" title="Назад">${ICO.prev}</button>
        <button class="btn" data-br="fwd" title="Вперёд">${ICO.next}</button>
        <button class="btn" data-br="reload" title="Обновить">${ICO.refresh}</button>
        <button class="btn" data-br="home" title="Начальная страница">${ICO.globe}</button>
        <input class="fld br-url" id="brUrl" spellcheck="false" placeholder="Адрес сайта или запрос — поиск идёт через Google">
        <button class="btn primary" data-br="go">Перейти</button>
      </div>
      <div class="br-marks"></div>
      <div class="br-stage">
        <canvas class="br-canvas" id="brCanvas" tabindex="0"></canvas>
        <div class="br-state" id="brState"><span class="br-spin"></span><span id="brStateText">Подключение к серверу…</span></div>
      </div>
      <div class="br-foot">
        <span id="brStatus">Подключение…</span>
        <span class="spacer"></span>
        <span class="br-chip" id="brMode">живой режим</span>
        <span id="brHost"></span>
      </div>
    </div>`;

    const urlIn = $('#brUrl', rec.body);
    const canvas = $('#brCanvas', rec.body);
    const state = $('#brState', rec.body);
    const stateText = $('#brStateText', rec.body);
    const status = $('#brStatus', rec.body);
    const modeChip = $('#brMode', rec.body);
    const hostOut = $('#brHost', rec.body);
    const marks = $('.br-marks', rec.body);
    const ctx = canvas.getContext('2d');

    marks.innerHTML = QUICK.map(b =>
      '<button class="br-mark" data-u="' + esc(b.u) + '" title="' + esc(b.u) + '">' + esc(b.t) + '</button>').join('');

    const st = {
      mode: 'live',      // 'live' — настоящий Chromium, 'proxy' — простой режим
      url: '',           // текущий адрес
      input: '',         // что набрано в адресной строке
      title: '',
      loading: false,
      back: false, fwd: false,
      ready: false,
      sent: 0, shown: 0, lastAt: 0,
    };
    let ws = null, tries = 0, stopped = false, wake = null, wakeT = null;

    const hostOf = u => { try { return new URL(u).host.replace(/^www\./, ''); } catch (e) { return u || ''; } };
    const niceUrl = u => (u === 'about:blank' ? '' : u || '');

    /* ---------- картинка ---------- */
    function draw(blob) {
      if (!blob || !blob.size) return;
      createImageBitmap(blob).then(bm => {
        if (canvas.width !== bm.width || canvas.height !== bm.height) {
          canvas.width = bm.width; canvas.height = bm.height;
        }
        ctx.drawImage(bm, 0, 0);
        bm.close && bm.close();
        st.shown++;
        hideState();
      }).catch(() => {});
    }

    function showState(text, spin) {
      state.classList.add('on');
      stateText.textContent = text;
      state.querySelector('.br-spin').style.display = spin === false ? 'none' : '';
    }
    function hideState() { state.classList.remove('on'); }

    /* ---------- связь с сервером ---------- */
    function connect(url) {
      if (stopped) return;
      if (ws) { try { ws.close(); } catch (e) {} ws = null; }
      st.ready = false;
      tries++;
      showState(tries === 1 ? 'Подключение к серверу…' : 'Повторное подключение…');
      let sock;
      try { sock = new WebSocket(API.liveBase() + '?url=' + encodeURIComponent(url || 'about:blank')); }
      catch (e) { fallback('Не удалось открыть соединение с сервером.'); return; }
      sock.binaryType = 'arraybuffer';
      ws = sock;

      sock.onmessage = e => {
        if (typeof e.data !== 'string') { draw(new Blob([e.data], { type: 'image/jpeg' })); return; }
        let m; try { m = JSON.parse(e.data); } catch (err) { return; }
        if (m.t === 'ready') {
          st.ready = true; tries = 0;
          canvas.width = m.width; canvas.height = m.height;
          status.textContent = 'Готово';
          modeChip.textContent = 'живой режим';
          modeChip.classList.remove('warn');
          hideState();
          send({ t: 'nav', url: url || 'about:blank' });
        } else if (m.t === 'state') {
          st.url = m.url || st.url;
          st.title = m.title || '';
          st.loading = !!m.loading;
          st.back = !!m.back; st.fwd = !!m.fwd;
          if (document.activeElement !== urlIn) urlIn.value = niceUrl(st.url);
          hostOut.textContent = hostOf(st.url);
          markActive(st.url);
          status.textContent = st.loading ? 'Загрузка…' : 'Готово';
        } else if (m.t === 'dialog') {
          status.textContent = 'Страница спросила: ' + (m.text || '').slice(0, 60);
        } else if (m.t === 'error') {
          if (m.fallback) { fallback(m.text); return; }
          status.textContent = m.text || 'Ошибка';
        }
      };
      sock.onclose = () => {
        if (stopped || st.mode !== 'live') return;
        if (st.ready && tries <= 3) {
          status.textContent = 'Связь прервана, восстанавливаю…';
          setTimeout(() => connect(st.url || 'about:blank'), 600);
        } else if (tries > 3) {
          fallback('Сервер не отвечает. Нужен запущенный server.py.');
        }
      };
      sock.onerror = () => {};
    }

    function send(o) {
      if (!ws || ws.readyState !== 1) return;
      try { ws.send(JSON.stringify(o)); } catch (e) {}
    }

    /* ---------- простой режим (прокси) ---------- */
    function fallback(reason) {
      st.mode = 'proxy';
      stopped = true;
      if (ws) { try { ws.close(); } catch (e) {} ws = null; }
      canvas.style.display = 'none';
      modeChip.textContent = 'простой режим';
      modeChip.classList.add('warn');
      showState(reason || 'Сервер недоступен.', false);
      status.textContent = 'Простой режим';
      hostOut.textContent = '';
    }

    /* ---------- переходы ---------- */
    function normalize(v) {
      const s = String(v || '').trim();
      if (!s || s === 'about:blank') return 'https://www.google.com/';
      if (/^https?:\/\//i.test(s)) return s;
      if (/^[\w-]+(\.[\w-]+)+([/?#:]|$)/.test(s) && s.indexOf(' ') < 0) return 'https://' + s;
      return 'https://www.google.com/search?q=' + encodeURIComponent(s);
    }
    function go(v) { Sound.click(); const u = normalize(v); st.url = u; st.input = u; send({ t: 'nav', url: u }); }
    function markActive(u) {
      $$('.br-mark', marks).forEach(b => b.classList.toggle('on', hostOf(b.dataset.u) === hostOf(u)));
    }

    /* ---------- мышь и клавиатура ---------- */
    function point(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: Math.round((e.clientX - r.left) * canvas.width / Math.max(1, r.width)),
        y: Math.round((e.clientY - r.top) * canvas.height / Math.max(1, r.height)),
      };
    }
    function mods(e) { return (e.altKey ? MOD[1] : 0) + (e.ctrlKey ? MOD[2] : 0) + (e.metaKey ? MOD[4] : 0); }
    function btn(e) {
      if (e.button === 0) return { button: 'left', mask: 1 };
      if (e.button === 1) return { button: 'middle', mask: 4 };
      return { button: 'right', mask: 2 };
    }

    let dragging = false;
    canvas.addEventListener('mousemove', e => {
      const p = point(e);
      if (dragging) send({ t: 'mouse', type: 'mouseMoved', x: p.x, y: p.y, button: dragging, buttons: MOD.mask || 1, modifiers: mods(e) });
      else send({ t: 'mouse', type: 'mouseMoved', x: p.x, y: p.y, button: 'none', buttons: 0, modifiers: mods(e) });
    });
    canvas.addEventListener('mousedown', e => {
      e.preventDefault(); canvas.focus();
      const p = point(e), b = btn(e);
      dragging = b.button;
      send({ t: 'mouse', type: 'mousePressed', x: p.x, y: p.y, button: b.button, buttons: b.mask, clickCount: 1, modifiers: mods(e) });
    });
    canvas.addEventListener('mouseup', e => {
      const p = point(e), b = btn(e);
      dragging = false;
      send({ t: 'mouse', type: 'mouseReleased', x: p.x, y: p.y, button: b.button, buttons: 0, clickCount: 1, modifiers: mods(e) });
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const p = point(e);
      send({ t: 'mouse', type: 'mouseWheel', x: p.x, y: p.y, dx: e.deltaX, dy: e.deltaY, modifiers: mods(e) });
    }, { passive: false });
    canvas.addEventListener('dblclick', e => {
      const p = point(e), b = btn(e);
      send({ t: 'mouse', type: 'mousePressed', x: p.x, y: p.y, button: b.button, buttons: b.mask, clickCount: 2, modifiers: mods(e) });
      send({ t: 'mouse', type: 'mouseReleased', x: p.x, y: p.y, button: b.button, buttons: 0, clickCount: 2, modifiers: mods(e) });
    });

    // Клавиши уходят в Chromium, когда окно активно. Система зовёт эти функции
    // сама (os.js отдаёт клавиши активному окну), поэтому обработчиков на
    // canvas не вешаем — иначе клавиша приходила бы дважды.
    rec.api.keys = key => {
      if (st.mode !== 'live' || !st.ready) return false;
      if (key === 'Escape' || key === 'F5') return false;      // пусть система обработает
      if (key === 'Alt' || key === 'Control' || key === 'Shift' || key === 'Meta') return false;
      send({ t: 'key', type: 'keyDown', key });
      return true;
    };
    rec.api.keyup = key => {
      if (st.mode !== 'live' || !st.ready) return false;
      if (key === 'Alt' || key === 'Control' || key === 'Shift' || key === 'Meta') return false;
      send({ t: 'key', type: 'keyUp', key });
      return true;
    };

    /* Окно не в фокусе или свёрнуто — просим сервер не снимать кадры.
       Так система не тратит силы на то, чего не видно. */
    rec.api.visible = vis => {
      if (st.mode !== 'live' || !st.ready) return;
      send({ t: vis ? 'resume' : 'pause' });
      if (vis) fit();
    };

    /* ---------- адресная строка ---------- */
    urlIn.onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); go(urlIn.value); urlIn.blur(); }
    };
    urlIn.onfocus = () => { urlIn.select(); };

    /* ---------- панель ---------- */
    $('.br-bar', rec.body).onclick = e => {
      const b = e.target.closest('[data-br]'); if (!b) return;
      const a = b.dataset.br;
      if (a === 'go') go(urlIn.value);
      if (a === 'back') send({ t: 'back' });
      if (a === 'fwd') send({ t: 'forward' });
      if (a === 'reload') send({ t: 'reload' });
      if (a === 'home') { st.url = ''; send({ t: 'nav', url: 'https://www.google.com/' }); }
    };
    marks.onclick = e => {
      const b = e.target.closest('.br-mark'); if (!b) return;
      Sound.click();
      st.url = b.dataset.u;
      send({ t: 'nav', url: b.dataset.u });
    };

    /* ---------- размер экрана ---------- */
    function fit() {
      const r = canvas.getBoundingClientRect();
      if (st.mode !== 'live' || !st.ready || r.width < 50) return;
      // Предел, чтобы снимок на сервере не был огромным.
      const w = Math.min(1600, Math.round(r.width));
      const h = Math.min(1000, Math.round(r.height));
      send({ t: 'resize', w: w, h: h });
    }
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => { clearTimeout(wakeT); wakeT = setTimeout(fit, 320); });
      ro.observe(canvas);
      rec.api.disposers = rec.api.disposers || [];
      rec.api.disposers.push(() => ro.disconnect());
    }

    /* ---------- запуск ---------- */
    API.env().then(() => {
      if (SERVER_INFO.known && !SERVER_INFO.ok) {
        fallback('Сервер не запущен. Откройте систему через server.py.');
        return;
      }
      connect('https://www.google.com/');
      setTimeout(fit, 900);
    });

    rec.api.open = u => { st.mode = 'live'; stopped = false; tries = 0; canvas.style.display = ''; connect(normalize(u)); };
    rec.api.home = () => rec.api.open('https://www.google.com/');
    rec.api.dispose = () => { stopped = true; if (ws) { try { ws.close(); } catch (e) {} } };
  },
  onClose(rec) { if (rec.api.dispose) rec.api.dispose(); },
});

WM.register({
  id: 'settings', title: 'Параметры', icon: ICO.settings, w: 920, h: 620,
  init(rec) {
    const SEC = [
      { id: 'pers', t: 'Персонализация', i: ICO.paint },
      { id: 'task', t: 'Панель задач', i: ICO.task },
      { id: 'sys', t: 'Система', i: ICO.cpu },
      { id: 'apps', t: 'Приложения', i: ICO.store },
      { id: 'about', t: 'О системе', i: ICO.shield },
      { id: 'admin', t: 'Панель администратора', i: ICO.shield },
    ];
    let sec = 'pers';
    rec.body.innerHTML = '<div class="app" style="flex-direction:row">' +
      '<div class="app-side">' +
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 8px 16px">' +
          '<div class="avatar" style="width:34px;height:34px;font-size:13px">Г</div>' +
          '<div><b style="font-size:12.5px">' + USER + '</b><div style="font-size:10.5px;color:var(--txt-dim)">Локальная запись</div></div></div>' +
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
            '<p style="font-size:11.5px;color:var(--txt-dim);margin-top:12px">Совет: потяните окно к краю экрана — Люмен предложит зону прилипания. <kbd>Win</kbd>+<kbd>←</kbd>/<kbd>→</kbd> — половина экрана, <kbd>Win</kbd>+<kbd>↑</kbd> — развернуть.</p></div>' +
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
        return head('Приложения', 'Установленные компоненты Люмен.') +
          '<div style="padding:0 20px 20px">' + Object.keys(Apps).map(k => Apps[k]).map(a =>
            '<div class="set-row" style="border-bottom:1px solid var(--stroke)">' +
            '<span style="display:flex;align-items:center;gap:12px"><span style="width:20px;height:20px;display:inline-block">' + a.icon + '</span>' + esc(a.title) + '</span>' +
            '<button class="btn" data-open="' + a.id + '">Открыть</button></div>').join('') + '</div>';
      },
      admin() {
        if (!State.admin) return adminLogin_();
        return adminConsole_();
      },
      about() {
        return '<div style="padding:20px">' +
          '<div class="about-hero"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg>' +
          '<div><h2 data-sys="namever">' + SysInfo.get().name + ' ' + SysInfo.get().version + '</h2><p>Вымышленная веб-операционная система · ядро <span data-sys="kernel">' + SysInfo.get().kernel + '</span>, сборка <span data-sys="build">' + SysInfo.get().build + '</span></p></div></div>' +
          '<div class="set-grid adm">' +
          '<div class="set-card"><h5>Характеристики</h5>' +
            '<div class="spec"><span>Устройство</span><b>ORBITAL-12</b></div>' +
            '<div class="spec"><span>Процессор</span><b>Nt12 Core X · 16 ядер</b></div>' +
            '<div class="spec"><span>ОЗУ</span><b>32 ГБ LPDDR6</b></div>' +
            '<div class="spec"><span>Графика</span><b>Плексус GPU</b></div>' +
            '<div class="spec"><span>Накопитель</span><b>512 ГБ NVMe</b></div>' +
            '<div class="spec"><span>Аптайм</span><b>' + TaskMan.uptime() + '</b></div></div>' +
          '<div class="set-card"><h5>Сведения</h5>' +
            '<div class="spec"><span>Ядро</span><b data-sys="kernel">' + SysInfo.get().kernel + '</b></div>' +
            '<div class="spec"><span>Оконный менеджер</span><b>Плексус</b></div>' +
            '<div class="spec"><span>Платформа</span><b>' + esc((navigator.platform || 'web').slice(0, 22)) + '</b></div>' +
            '<div class="spec"><span>Обновления</span><b>Актуально</b></div>' +
            '<div class="spec"><span>Активация</span><b>Активировано</b></div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>О сборке</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);line-height:1.7">Это художественный концепт, а не продукт Microsoft. «Люмен» здесь — вымышленная система, собранная на HTML, CSS и JavaScript. Все приложения работают локально: файловая система виртуальная, звук синтезируется через Web Audio API.</p></div>' +
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
      if (sec === 'admin' && !State.admin) {
        const inp = $('#adminCode', main);
        if (inp) setTimeout(() => inp.focus(), 60);
      }
    }

    let admTab = 'overview';

    const log_ = m => (State.adminLog = State.adminLog || []).push('[' + new Date().toLocaleTimeString('ru-RU') + '] ' + m);

    function adminLogin_() {
      const attempts = State.adminAttempts || 0;
      if (!hasCode()) {
        return '<div style="padding:20px">' +
          '<div class="about-hero"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg>' +
          '<div><h2>Панель администратора</h2><p>Раздел доступен только владельцу системы.</p></div></div>' +
          '<div class="set-card" style="max-width:460px">' +
            '<h5>Код владельца не задан</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);margin:0">Сейчас вход в систему без кода, поэтому панель открыта всем. Чтобы закрыть её, задайте код владельца при следующем запуске компьютера или здесь, на вкладке «Питание» после входа.</p>' +
            '<button class="btn primary" id="adminGo" style="margin-top:14px;width:100%;justify-content:center;padding:10px">Открыть панель</button>' +
          '</div></div>';
      }
      return '<div style="padding:20px">' +
        '<div class="about-hero"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg>' +
        '<div><h2>Панель администратора</h2><p>Раздел доступен только владельцу системы.</p></div></div>' +
        '<div class="set-card" style="max-width:460px">' +
          '<h5>Подтверждение владельца</h5>' +
          '<p style="font-size:12px;color:var(--txt-dim);margin-bottom:14px">Введите код владельца, чтобы открыть панель.</p>' +
          '<input class="fld" id="adminCode" type="password" autocomplete="off" ' +
            'placeholder="Код владельца" style="width:100%;letter-spacing:.28em;text-align:center;font-size:15px">' +
          '<div id="adminErr" style="margin-top:12px;font-size:12.5px;font-weight:600;color:#ff8a9b;' +
            (attempts ? '' : 'display:none') + '">' +
            (attempts ? 'Вы не владелец. Вам недоступно. Введите правильный код.' : '') + '</div>' +
          '<button class="btn primary" id="adminGo" style="margin-top:14px;width:100%;justify-content:center;padding:10px">Войти</button>' +
          (attempts ? '<div style="margin-top:10px;font-size:11px;color:var(--txt-mute)">Неудачных попыток: ' + attempts + '</div>' : '') +
        '</div></div>';
    }

    const ADM_TABS = [
      { id: 'overview', t: 'Обзор' },
      { id: 'identity', t: 'Имя системы' },
      { id: 'windows', t: 'Окна' },
      { id: 'look', t: 'Оформление' },
      { id: 'files', t: 'Файлы' },
      { id: 'power', t: 'Питание' },
      { id: 'log', t: 'Журнал' },
    ];

    function adminConsole_() {
      const g = SysInfo.get();
      const tabs = '<div class="qs-chips" style="margin-bottom:18px">' +
        ADM_TABS.map(t => '<button class="chip ' + (t.id === admTab ? 'on' : '') + '" data-admtab="' + t.id + '">' + t.t + '</button>').join('') + '</div>';
      return '<div style="padding:20px">' +
        '<div class="about-hero"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg>' +
        '<div><h2>Панель администратора</h2><p>Полный доступ · владелец системы</p></div></div>' +
        tabs + ADM_PAGES[admTab](g) + '</div>';
    }

    const ADM_PAGES = {
      overview(g) {
        return '<div class="set-grid adm">' +
          '<div class="set-card"><h5>Состояние</h5>' +
            '<div class="spec"><span>Режим</span><b style="color:#5cffb0">Администратор</b></div>' +
            '<div class="spec"><span>Система</span><b>' + esc(g.name) + ' ' + esc(g.version) + '</b></div>' +
            '<div class="spec"><span>Ядро</span><b>' + esc(g.kernel) + '</b></div>' +
            '<div class="spec"><span>Пользователь</span><b>' + esc(g.user) + '</b></div>' +
            '<div class="spec"><span>Аптайм</span><b>' + TaskMan.uptime() + '</b></div></div>' +
          '<div class="set-card"><h5>Нагрузка</h5>' +
            '<div class="spec"><span>Окон открыто</span><b>' + Object.keys(State.open).length + '</b></div>' +
            '<div class="spec"><span>Процессов</span><b>' + TaskMan.procs().length + '</b></div>' +
            '<div class="spec"><span>Файлов в C:\\</span><b>' + VFS.allFiles('C:\\').length + '</b></div>' +
            '<div class="spec"><span>Значков на столе</span><b>' + deskItems.length + '</b></div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Быстрые действия</h5>' +
            '<div class="qs-chips" style="margin-top:6px">' +
              '<button class="chip" data-adm="explorer">' + ICO.folder + ' C:\\Система</button>' +
              '<button class="chip" data-adm="taskmgr">' + ICO.task + ' Процессы</button>' +
              '<button class="chip" data-adm="terminal">' + ICO.term + ' Терминал</button>' +
              '<button class="chip" data-adm="closeall">' + ICO.x + ' Закрыть все окна</button>' +
              '<button class="chip" data-adm="dump">' + ICO.note + ' Выгрузить отчёт</button>' +
              '<button class="chip" data-adm="lock">' + ICO.shield + ' Блокировать</button>' +
            '</div></div></div>';
      },
      identity(g) {
        const f = (k, label, hint) => '<label style="display:block;margin-bottom:12px">' +
          '<span style="display:block;font-size:11.5px;color:var(--txt-dim);margin-bottom:5px">' + label + '</span>' +
          '<input class="fld" id="adm_' + k + '" value="' + esc(g[k]) + '" style="width:100%">' +
          (hint ? '<span style="display:block;font-size:10.5px;color:var(--txt-mute);margin-top:4px">' + hint + '</span>' : '') + '</label>';
        return '<div class="set-grid adm">' +
          '<div class="set-card"><h5>Название системы</h5>' +
            f('name', 'Имя системы', 'Видно на загрузке, в «О системе», neofetch и в заголовке вкладки.') +
            f('version', 'Версия', 'Например: 1.4 или 2.0') +
            '<div style="display:flex;gap:8px;margin-top:8px">' +
              '<button class="btn primary" data-adm="saveidentity" style="flex:1;justify-content:center">Применить</button>' +
              '<button class="btn" data-adm="resetidentity">Вернуть исходное</button></div></div>' +
          '<div class="set-card"><h5>Ядро, сборка, пользователь</h5>' +
            f('kernel', 'Имя ядра', 'Например: люмен-1.4-generic') +
            f('build', 'Номер сборки') +
            f('user', 'Имя пользователя', 'Показывается на экране входа и в «Пуске».') +
          '</div></div>';
      },
      windows() {
        const keys = Object.keys(State.open);
        const rows = keys.length ? keys.map(k => {
          const r = State.open[k];
          return '<div class="set-row" style="border-bottom:1px solid var(--stroke)">' +
            '<span style="display:flex;align-items:center;gap:10px"><span style="width:18px;height:18px;display:inline-block">' + (r.def.icon || '') + '</span>' + esc(r.def.title) + '</span>' +
            '<span style="display:flex;gap:6px">' +
              '<button class="btn" data-adm="focuswin" data-id="' + esc(k) + '">Показать</button>' +
              '<button class="btn" data-adm="closewin" data-id="' + esc(k) + '">Закрыть</button>' +
            '</span></div>';
        }).join('') : '<p style="font-size:12px;color:var(--txt-dim)">Открытых окон нет.</p>';
        return '<div class="set-grid adm">' +
          '<div class="set-card" style="grid-column:span 2"><h5>Открытые окна · ' + keys.length + '</h5>' + rows + '</div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Массовые действия</h5><div class="qs-chips" style="margin-top:6px">' +
            '<button class="chip" data-adm="tile">' + ICO.max + ' Сетка</button>' +
            '<button class="chip" data-adm="cascade">' + ICO.copy + ' Каскад</button>' +
            '<button class="chip" data-adm="minall">' + ICO.min + ' Свернуть все</button>' +
            '<button class="chip" data-adm="closeall">' + ICO.x + ' Закрыть все</button>' +
          '</div></div></div>';
      },
      look() {
        return '<div class="set-grid adm">' +
          '<div class="set-card"><h5>Тема</h5><div class="qs-chips">' +
            '<button class="chip ' + (State.theme === 'dark' ? 'on' : '') + '" data-adm="theme" data-v="dark">' + ICO.moon + ' Тёмная</button>' +
            '<button class="chip ' + (State.theme === 'light' ? 'on' : '') + '" data-adm="theme" data-v="light">' + ICO.sun + ' Светлая</button></div>' +
            '<div class="set-row" style="margin-top:12px"><span>Прозрачность</span><div class="sw ' + (State.transparency ? 'on' : '') + '" data-admsw="transp"></div></div></div>' +
          '<div class="set-card"><h5>Акцентный цвет</h5><div class="swatches">' +
            ACCENTS.map(a => '<button class="swatch ' + (a.a === State.accent ? 'on' : '') + '" data-adm="accent" data-a="' + a.a + '" data-b="' + a.b + '" style="background:linear-gradient(140deg,' + a.a + ',' + a.b + ')" title="' + a.t + '"></button>').join('') +
            '</div></div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Фон рабочего стола</h5><div class="wp-list">' +
            WALLS.map(w => '<button class="wp ' + (State.wallpaper === w ? 'on' : '') + '" data-adm="wall" data-v="' + w + '" title="' + w + '"><i class="wall" data-wp="' + w + '"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></i></button>').join('') +
            '</div></div>' +
          '<div class="set-card"><h5>Яркость</h5><div class="qs-row"><input type="range" id="admBri" min="30" max="100" value="' + State.brightness + '"><b class="mono" style="font-size:11px">' + State.brightness + '</b></div></div>' +
          '<div class="set-card"><h5>Громкость</h5><div class="qs-row"><input type="range" id="admVol" min="0" max="100" value="' + State.volume + '"><b class="mono" style="font-size:11px">' + State.volume + '</b></div></div>' +
          '</div>';
      },
      files() {
        return '<div class="set-grid adm">' +
          '<div class="set-card"><h5>Файловая система</h5>' +
            '<div class="spec"><span>Каталог</span><b>C:\\</b></div>' +
            '<div class="spec"><span>Файлов</span><b>' + VFS.allFiles('C:\\').length + '</b></div>' +
            '<div class="spec"><span>Значков на столе</span><b>' + deskItems.length + '</b></div>' +
            '<button class="btn" data-adm="dump" style="margin-top:12px;width:100%;justify-content:center">' + ICO.note + ' Выгрузить отчёт</button></div>' +
          '<div class="set-card"><h5>Обслуживание</h5>' +
            '<button class="btn" data-adm="wipe" style="width:100%;justify-content:center;margin-bottom:8px">' + ICO.trash + ' Очистить рабочий стол</button>' +
            '<button class="btn" data-adm="resetfs" style="width:100%;justify-content:center">' + ICO.refresh + ' Восстановить файловую систему</button>' +
            '<p style="font-size:11px;color:var(--txt-mute);margin-top:10px">Восстановление вернёт ФС к исходному состоянию: созданные файлы и папки будут удалены.</p></div>' +
          '</div>';
      },
      power() {
        const hasC = hasCode(), hasP = hasPass(), hasR = !!(State.auth.rec);
        return '<div class="set-grid adm">' +
          '<div class="set-card" style="grid-column:span 2"><h5>Код владельца</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);margin:0 0 12px">Спрашивается при включении компьютера и при блокировке. Хранится только отпечаток — сам код система показать не может.</p>' +
            '<div class="spec"><span>Состояние</span><b style="color:' + (hasC ? '#5cffb0' : 'var(--txt-dim)') + '">' +
              (hasC ? 'код задан' : 'код не задан') + '</b></div>' +
            '<label style="display:block;margin:14px 0 8px">' +
              '<span style="display:block;font-size:11.5px;color:var(--txt-dim);margin-bottom:5px">Новый код (не короче 4 знаков)</span>' +
              '<input class="fld" id="admLockCode" type="password" autocomplete="off" maxlength="64" ' +
                'placeholder="новый код" style="width:100%"></label>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
              '<button class="btn primary" data-adm="setlockcode">Задать код</button>' +
              '<button class="btn" data-adm="clearlockcode"' + (hasC ? '' : ' disabled') + '>Снять код</button>' +
              '<button class="btn" data-adm="testlock">Заблокировать компьютер</button>' +
            '</div>' +
            '<div class="spec" style="margin-top:14px"><span>Как проверить</span><b>Заблокировать → код владельца</b></div>' +
          '</div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Пароль учётной записи</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);margin:0 0 12px">Спрашивается сразу после кнопки питания, до появления монитора. Пользователь: ' + esc(USER) + '.</p>' +
            '<div class="spec"><span>Состояние</span><b style="color:' + (hasP ? '#5cffb0' : 'var(--txt-dim)') + '">' +
              (hasP ? 'пароль задан' : 'вход без пароля') + '</b></div>' +
            '<label style="display:block;margin:14px 0 8px">' +
              '<span style="display:block;font-size:11.5px;color:var(--txt-dim);margin-bottom:5px">Новый пароль</span>' +
              '<input class="fld" id="admUserPass" type="password" autocomplete="off" maxlength="64" ' +
                'placeholder="новый пароль" style="width:100%"></label>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
              '<button class="btn primary" data-adm="setuserpass">Задать пароль</button>' +
              '<button class="btn" data-adm="clearuserpass"' + (hasP ? '' : ' disabled') + '>Снять пароль</button>' +
            '</div>' +
            '<div class="spec" style="margin-top:14px"><span>Как проверить</span><b>Перезагрузить → кнопка питания → пароль</b></div>' +
          '</div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Код восстановления</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);margin:0 0 12px">Помогает вернуть доступ, если код владельца забыт. Показать старый код система не может — можно задать новый: он заменит прежний.</p>' +
            '<div class="spec"><span>Состояние</span><b style="color:' + (hasR ? '#5cffb0' : '#ffc65c') + '">' +
              (hasR ? 'код восстановления задан' : 'кода восстановления нет') + '</b></div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">' +
              '<button class="btn primary" data-adm="newrecovery">' + ICO.refresh + ' Выдать новый код восстановления</button>' +
            '</div>' +
            '<div id="admRecBox" style="margin-top:14px"></div>' +
          '</div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Плавность работы</h5>' +
            '<p style="font-size:12px;color:var(--txt-dim);margin:0 0 12px">Облегчённый режим убирает размытие подложек и тяжёлые анимации. Система включает его сама, если кадры проседают.</p>' +
            '<div class="spec"><span>Режим</span><b>' + (State.lite ? 'облегчённый' : 'полный') + '</b></div>' +
            '<button class="btn" data-adm="togglemode" style="margin-top:12px">' +
              (State.lite ? 'Включить полное оформление' : 'Включить облегчённый режим') + '</button>' +
          '</div>' +
          '<div class="set-card" style="grid-column:span 2"><h5>Управление питанием</h5><div class="qs-chips" style="margin-top:6px">' +
            '<button class="chip" data-adm="lock">' + ICO.shield + ' Блокировать экран</button>' +
            '<button class="chip" data-adm="sleep">' + ICO.moon + ' Спящий режим</button>' +
            '<button class="chip" data-adm="restart">' + ICO.power + ' Перезапуск</button>' +
            '<button class="chip" data-adm="shutdown">' + ICO.power + ' Выключить</button>' +
            '<button class="chip" data-adm="signout">' + ICO.x + ' Выйти из панели</button>' +
          '</div><p style="font-size:11.5px;color:var(--txt-dim);margin-top:14px">Перезапуск и выключение перезагружают страницу: виртуальная ФС сбрасывается к исходной, настройки и код сохраняются.</p></div></div>';
      },
      log() {
        const rows = (State.adminLog || []).slice().reverse();
        return '<div class="set-grid adm"><div class="set-card" style="grid-column:span 2"><h5>Журнал доступа и действий</h5>' +
          '<div class="mono" id="admLog" style="font-size:11.5px;line-height:1.9;color:var(--txt-dim);max-height:300px;overflow:auto">' +
          (rows.length ? rows.map(x => esc(x)).join('<br>') : 'Пока пусто.') + '</div>' +
          '<button class="btn" data-adm="clearlog" style="margin-top:14px">Очистить журнал</button></div></div>';
      },
    };

    function adminLogin() {
      /* Кода владельца нет — панель открывается без проверки. */
      if (!hasCode()) {
        State.admin = true;
        log_('Вход выполнен · код владельца не задан');
        Sound.notif();
        Notify('Панель администратора', 'Панель открыта. Совет: задайте код владельца, чтобы закрыть её.', ICO.shield, true);
        render();
        return;
      }
      const inp = $('#adminCode', main);
      if (!inp) return;
      if (Auth.check(inp.value.trim(), State.auth.code)) {
        State.admin = true; State.adminAttempts = 0;
        log_('Вход выполнен · владелец подтверждён');
        Sound.notif();
        Notify('Панель администратора', 'Доступ разрешён. Добро пожаловать, владелец.', ICO.shield, true);
      } else {
        State.adminAttempts = (State.adminAttempts || 0) + 1;
        log_('Отказано · неверный код (попытка ' + State.adminAttempts + ')');
        Sound.error();
        Notify('Доступ запрещён', 'Вы не владелец. Вам недоступно.', ICO.shield, true);
      }
      render();
      const again = $('#adminCode', main);
      if (again) again.focus();
    }

    function saveIdentity() {
      const val = k => { const e = $('#adm_' + k, main); return e ? e.value : ''; };
      const changed = SysInfo.update({ name: val('name'), version: val('version'), kernel: val('kernel'), build: val('build'), user: val('user') });
      if (!changed.length) { Notify('Панель администратора', 'Изменений нет.', ICO.shield, true); return; }
      log_('Изменено: ' + changed.join(', '));
      Notify('Панель администратора', 'Сохранено: ' + SysInfo.get().name + ' ' + SysInfo.get().version, ICO.shield, true);
      render();
    }

    function wipeDesktop() {
      const n = deskItems.length;
      deskItems.forEach(it => VFS.rm(DESK_DIR + '\\' + it.name, true));
      deskItems = []; saveDeskItems(); renderIcons();
      log_('Рабочий стол очищен · удалено объектов: ' + n);
      Notify('Панель администратора', 'Рабочий стол очищен. Удалено объектов: ' + n, ICO.trash, true);
      render();
    }

    function adminAction(el) {
      const a = el.dataset.adm, v = el.dataset.v;
      switch (a) {
        case 'explorer': WM.open('explorer', 'C:\\Система'); return;
        case 'taskmgr': WM.open('taskmgr'); return;
        case 'terminal': WM.open('terminal'); return;
        case 'tile': WM.tile('grid'); log_('Окна упорядочены: сетка'); render(); return;
        case 'cascade': WM.tile('cascade'); log_('Окна упорядочены: каскад'); render(); return;
        case 'minall': WM.minimizeAll(); log_('Все окна свёрнуты'); render(); return;
        case 'closeall': Object.keys(State.open).forEach(k => WM.close(k)); log_('Закрыты все окна'); render(); return;
        case 'focuswin': WM.unminimize(el.dataset.id); WM.focus(el.dataset.id); return;
        case 'closewin': WM.close(el.dataset.id); log_('Окно закрыто: ' + el.dataset.id); render(); return;
        case 'theme': applyTheme(v); log_('Тема: ' + v); render(); return;
        case 'wall': applyWall(v); log_('Обои: ' + v); render(); return;
        case 'accent': applyAccent(el.dataset.a, el.dataset.b); log_('Акцент: ' + el.dataset.a); render(); return;
        case 'saveidentity': saveIdentity(); return;
        case 'resetidentity': SysInfo.reset(); log_('Имя системы сброшено к исходному'); Notify('Панель администратора', 'Имя системы сброшено к исходному.', ICO.refresh, true); render(); return;
        case 'dump': adminDump(); return;
        case 'wipe': wipeDesktop(); return;
        case 'resetfs':
          VFS.restore(); deskItems = []; saveDeskItems(); renderIcons();
          log_('Файловая система восстановлена');
          Notify('Панель администратора', 'Файловая система восстановлена.', ICO.refresh, true);
          render(); return;
        case 'clearlog': State.adminLog = []; render(); return;
        case 'setlockcode': {
          const inp = $('#admLockCode', main);
          const code = inp ? inp.value.trim() : '';
          if (code.length < 4) { Sound.error(); Notify('Панель администратора', 'Код слишком короткий — минимум 4 знака.', ICO.shield, true); return; }
          setCode(code);
          State.locked = true;
          log_('Задан код владельца (длина ' + code.length + ')');
          Sound.notif();
          Notify('Панель администратора', 'Код владельца задан. Теперь он нужен при запуске компьютера.', ICO.shield, true);
          render(); return;
        }
        case 'clearlockcode':
          State.auth.code = null;
          saveAuth();
          State.locked = false;
          log_('Код владельца снят');
          Notify('Панель администратора', 'Код владельца снят. Вход без кода.', ICO.refresh, true);
          render(); return;
        case 'setuserpass': {
          const i = $('#admUserPass', main);
          const v = i ? i.value : '';
          if (!v.trim()) { Notify('Панель администратора', 'Введите пароль.', ICO.shield); return; }
          setPass(v.trim());
          log_('Пароль учётной записи изменён');
          Notify('Панель администратора', 'Пароль учётной записи сохранён. Спросится при следующем включении.', ICO.shield, true);
          render(); return;
        }
        case 'clearuserpass':
          setPass('');
          log_('Пароль учётной записи снят');
          Notify('Панель администратора', 'Пароль снят. Вход без пароля.', ICO.refresh, true);
          render(); return;
        case 'newrecovery': {
          const rec = Auth.recovery();
          setRecovery(rec);
          log_('Выдан новый код восстановления');
          const box = $('#admRecBox', main);
          if (box) {
            box.innerHTML =
              '<div class="spec"><span>Новый код</span></div>' +
              '<div class="po-reccode" id="admRecShown" style="margin:8px 0">' + esc(rec) + '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                '<button class="btn" id="admRecCopy">Скопировать</button>' +
              '</div>' +
              '<p style="font-size:11px;color:var(--txt-mute);margin-top:10px">Запишите код и держите в надёжном месте. Показать его повторно система не сможет — можно только выдать новый.</p>';
            const cp = $('#admRecCopy', main);
            if (cp) cp.onclick = () => {
              try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(rec); } catch (e) { /* буфер недоступен */ }
              cp.textContent = 'Скопировано';
            };
          }
          Sound.notif();
          Notify('Панель администратора', 'Выдан новый код восстановления. Запишите его.', ICO.shield, true);
          return;
        }
        case 'testlock':
          log_('Блокировка компьютера из панели');
          State.locked = needCode();
          lockScreen();
          return;
        case 'togglemode':
          applyLite(!State.lite, true);
          log_('Режим оформления: ' + (State.lite ? 'облегчённый' : 'полный'));
          Notify('Панель администратора', State.lite ? 'Включён облегчённый режим.' : 'Включено полное оформление.', ICO.sparkle, true);
          render(); return;
        case 'lock': State.locked = needCode(); lockScreen(); return;
        case 'sleep': power('sleep'); return;
        case 'restart': power('restart'); return;
        case 'shutdown': power('shutdown'); return;
        case 'signout': State.admin = false; log_('Выход из панели'); Notify('Панель администратора', 'Сеанс администратора завершён.', ICO.shield, true); render(); return;
      }
    }

    function adminDump() {
      const g = SysInfo.get();
      const rep = ['Отчёт администратора ' + g.name,
        'Система: ' + g.name + ' ' + g.version + ', ядро ' + g.kernel + ', сборка ' + g.build,
        'Пользователь: ' + g.user,
        'Время: ' + new Date().toLocaleString('ru-RU'),
        'Аптайм: ' + TaskMan.uptime(),
        'Открытых окон: ' + Object.keys(State.open).length,
        'Процессов: ' + TaskMan.procs().length,
        'Файлов в C:\\: ' + VFS.allFiles('C:\\').length,
        'Объектов на рабочем столе: ' + deskItems.length,
        'Тема: ' + State.theme + ' · акцент: ' + State.accent + ' · обои: ' + State.wallpaper,
        '', 'Приложения: ' + Object.keys(Apps).join(', ')].join('\n');
      const path = HOME + '\\Документы\\отчёт_администратора.txt';
      const r = VFS.write(path, rep);
      if (r.ok) {
        log_('Отчёт выгружен в ' + path);
        Notify('Панель администратора', 'Отчёт сохранён: ' + path, ICO.note, true);
        WM.open('notepad', { path: path });
      } else { Sound.error(); Notify('Панель администратора', r.err, ICO.note); }
      render();
    }

    $('.app-side', rec.body).onclick = e => {
      const b = e.target.closest('[data-s]'); if (!b) return;
      sec = b.dataset.s;
      $$('.side-i', rec.body).forEach(x => x.classList.toggle('on', x === b));
      render();
    };
    main.onclick = e => {
      // --- панель администратора ---
      const at = e.target.closest('[data-admtab]');
      if (at) { Sound.click(); admTab = at.dataset.admtab; render(); return; }
      const asw = e.target.closest('[data-admsw]');
      if (asw) {
        asw.classList.toggle('on');
        const on = asw.classList.contains('on');
        if (asw.dataset.admsw === 'transp') { applyTransparency(on); log_('Прозрачность: ' + (on ? 'вкл' : 'выкл')); }
        Sound.click(); render(); return;
      }
      const adm = e.target.closest('[data-adm]');
      if (adm) { Sound.click(); adminAction(adm); return; }
      if (e.target.closest('#adminGo')) { Sound.click(); adminLogin(); return; }
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
    main.onkeydown = e => {
      if (e.key === 'Enter' && e.target.id === 'adminCode') { e.preventDefault(); adminLogin(); }
      if (e.key === 'Enter' && e.target.id === 'admLockCode') { e.preventDefault(); const b = main.querySelector('[data-adm="setlockcode"]'); if (b) adminAction(b); }
      if (e.key === 'Enter' && e.target.id === 'admUserPass') { e.preventDefault(); const b = main.querySelector('[data-adm="setuserpass"]'); if (b) adminAction(b); }
      if (e.key === 'Enter' && e.target.id && e.target.id.indexOf('adm_') === 0) { e.preventDefault(); saveIdentity(); }
    };
    main.oninput = e => {
      if (e.target.id === 'admBri') { applyBrightness(+e.target.value); const b = e.target.nextElementSibling; if (b) b.textContent = e.target.value; }
      if (e.target.id === 'admVol') { State.volume = +e.target.value; const b = e.target.nextElementSibling; if (b) b.textContent = e.target.value; $('#vol').value = State.volume; }
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
  { t: 'Компьютер', i: ICO.pc, f: () => WM.open('explorer', 'C:\\') },
  { t: 'Терминал', i: ICO.term, f: () => WM.open('terminal') },
  { t: 'Браузер', i: ICO.globe, f: () => WM.open('browser') },
  { t: 'Игры', i: ICO.game, f: () => WM.open('games') },
  { t: 'Параметры', i: ICO.settings, f: () => WM.open('settings') },
  { t: 'Документы', i: ICO.folder, f: () => WM.open('explorer', HOME + '\\Документы') },
  { t: 'Проводник', i: ICO.folder, f: () => WM.open('explorer') },
  { t: 'Блокнот', i: ICO.note, f: () => WM.open('notepad') },
  { t: 'Корзина', i: ICO.trash, f: () => Notify('Корзина', 'Корзина пуста', ICO.trash, true) },
];
const PINNED = ['browser', 'games', 'explorer', 'terminal', 'settings', 'notepad', 'photos', 'music', 'calc', 'store', 'taskmgr'];

/* --- Папки и файлы, созданные пользователем на рабочем столе ---
   Хранятся в виртуальной ФС (папка «Рабочий стол» в домашней папке), поэтому видны
   и в Проводнике, и в терминале. Список имён держим в localStorage,
   чтобы значки не пропадали после перезагрузки. */
const DESK_DIR = HOME + '\\Рабочий стол';
const DESK_KEY = 'lumen.deskItems';
let deskItems = [];

function loadDeskItems() {
  try {
    const raw = localStorage.getItem(DESK_KEY);
    deskItems = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(deskItems)) deskItems = [];
  } catch (e) { deskItems = []; }
  VFS.mkdir(DESK_DIR);
  deskItems.forEach(it => {
    if (it.type === 'dir') VFS.mkdir(DESK_DIR + '\\' + it.name);
    else if (!VFS.node(DESK_DIR + '\\' + it.name)) VFS.write(DESK_DIR + '\\' + it.name, '', it.ext);
  });
}
function saveDeskItems() {
  try { localStorage.setItem(DESK_KEY, JSON.stringify(deskItems)); } catch (e) { /* недоступно */ }
}

// Свободное имя: «Новая папка», «Новая папка (2)», …
function freeName(base, ext) {
  const taken = n => deskItems.some(it => it.name.toLowerCase() === n.toLowerCase());
  const build = i => (i === 1 ? base : base + ' (' + i + ')') + (ext ? '.' + ext : '');
  let n = build(1), i = 1;
  while (taken(n)) { i++; n = build(i); }
  return n;
}
function createDeskFolder() {
  const nm = freeName('Новая папка');
  const res = VFS.mkdir(DESK_DIR + '\\' + nm);
  if (!res.ok) { Sound.error(); Notify('Рабочий стол', res.err, ICO.folder); return null; }
  deskItems.push({ type: 'dir', name: nm });
  saveDeskItems(); renderIcons();
  Sound.notif();
  Notify('Рабочий стол', 'Создана папка «' + nm + '»', ICO.folder, true);
  return nm;
}
function createDeskFile() {
  const nm = freeName('Новый текстовый документ', 'txt');
  const res = VFS.write(DESK_DIR + '\\' + nm, '');
  if (!res.ok) { Sound.error(); Notify('Рабочий стол', res.err, ICO.note); return null; }
  deskItems.push({ type: 'file', name: nm, ext: 'txt' });
  saveDeskItems(); renderIcons();
  Sound.notif();
  Notify('Рабочий стол', 'Создан файл «' + nm + '»', ICO.note, true);
  return nm;
}
function removeDeskItem(name) {
  deskItems = deskItems.filter(it => it.name !== name);
  saveDeskItems(); renderIcons();
}
function renameDeskItem(oldName, newName) {
  const it = deskItems.find(x => x.name === oldName);
  if (!it) return false;
  const from = DESK_DIR + '\\' + oldName, to = DESK_DIR + '\\' + newName;
  if (VFS.node(to)) { Sound.error(); Notify('Рабочий стол', 'Имя уже занято', ICO.ren); return false; }
  const src = VFS.node(from);
  if (src && src.type === 'dir') {
    VFS.mkdir(to);
    deepCopy(src, VFS.node(to));
  } else {
    const r = VFS.read(from);
    VFS.write(to, r.ok ? r.content : '', it.ext);
  }
  VFS.rm(from, true);
  it.name = newName;
  saveDeskItems(); renderIcons();
  Sound.notif();
  return true;
}
// Копирует содержимое каталога в существующий целевой каталог.
function deepCopy(from, to) {
  Object.keys(from.children || {}).forEach(k => {
    const c = from.children[k];
    if (c.type === 'dir') { to.children[k] = { type: 'dir', children: {} }; deepCopy(c, to.children[k]); }
    else to.children[k] = { type: 'file', ext: c.ext, content: c.content };
  });
}

function renderIcons() {
  const host = $('#icons');
  host.innerHTML = '';

  // Созданные пользователем папки и файлы — идут первыми
  deskItems.forEach(it => {
    const isDir = it.type === 'dir';
    const ico = isDir ? ICO.folder : (it.ext === 'txt' ? ICO.txt : ICO.file);
    const n = el('div', 'dicon', '<span class="ico">' + ico + '</span><span>' + esc(it.name) + '</span>');
    const open = () => isDir
      ? WM.open('explorer', DESK_DIR + '\\' + it.name)
      : WM.open('notepad', { path: DESK_DIR + '\\' + it.name });
    n.ondblclick = () => { Sound.click(); open(); };
    n.onclick = () => { $$('.dicon', host).forEach(x => x.classList.remove('sel')); n.classList.add('sel'); };
    n.oncontextmenu = e => {
      e.preventDefault(); e.stopPropagation(); n.onclick();
      openCtx(e.clientX, e.clientY, [
        { t: 'Открыть', i: ICO.exe, f: open },
        { t: 'Переименовать', i: ICO.ren, f: () => {
            const nn = prompt('Новое имя:', it.name);
            if (nn && nn !== it.name) renameDeskItem(it.name, nn);
          } },
        { sep: true },
        { t: 'Удалить', i: ICO.trash, f: () => {
            VFS.rm(DESK_DIR + '\\' + it.name, true);
            removeDeskItem(it.name);
            Sound.notif();
            Notify('Рабочий стол', 'Удалено: ' + it.name, ICO.trash, true);
          } },
        { t: 'Свойства', i: ICO.settings, f: () => Notify('Свойства',
            it.name + (isDir ? ' — папка' : ' — файл (' + (it.ext || 'txt') + ')') + '\n' + DESK_DIR, ICO.settings, true) },
      ]);
    };
    host.appendChild(n);
  });

  DESK.forEach(d => {
    const n = el('div', 'dicon', '<span class="ico">' + d.i + '</span><span>' + esc(d.t) + '</span>');
    n.ondblclick = () => { Sound.click(); d.f(); };
    n.onclick = () => { $$('.dicon', host).forEach(x => x.classList.remove('sel')); n.classList.add('sel'); };
    n.oncontextmenu = e => {
      e.preventDefault(); e.stopPropagation(); n.onclick();
      openCtx(e.clientX, e.clientY, [
        { t: 'Открыть', i: ICO.exe, f: d.f },
        { sep: true },
        { t: 'Создать папку', i: ICO.plus, f: createDeskFolder },
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
  /* Полоски нагрузки обновляем только когда панель видна и вкладка активна:
     иначе система зря считала бы и перерисовывала невидимое. */
  function stats() {
    if (!isOpen() || document.hidden) return;
    const t = Date.now();
    const cpu = clamp(14 + Math.sin(t / 3400) * 9 + Math.random() * 6, 2, 98);
    const ram = clamp(52 + Math.sin(t / 5200) * 6 + Math.random() * 3, 10, 96);
    const gpu = clamp(24 + Math.cos(t / 2600) * 12 + Math.random() * 5, 2, 98);
    const net = clamp(8 + Math.abs(Math.sin(t / 1800)) * 46, 1, 99);
    const set = (id, v) => { const n = $(id); if (n) n.style.width = v.toFixed(0) + '%'; };
    set('#sCpu', cpu); set('#sRam', ram); set('#sGpu', gpu); set('#sNet', net);
    const txt = (id, v) => { const n = $(id); if (n) n.textContent = v.toFixed(0) + '%'; };
    txt('#vCpu', cpu); txt('#vRam', ram); txt('#vGpu', gpu); txt('#vNet', net);
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
function cycleWins(dir) {
  const list = Object.keys(State.open).map(k => State.open[k]);
  if (!list.length) return;
  if (list.length === 1) { WM.unminimize(list[0].id); WM.focus(list[0].id); return; }
  const idx = list.findIndex(r => r.id === State.active);
  const next = list[(idx + dir + list.length) % list.length];
  WM.unminimize(next.id); WM.focus(next.id);
}
function snapActive(dir) {
  const r = activeWin(); if (!r) return;
  const vw = DW(), vh = DH() - 52;
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
    if (meta && e.key === 'Tab') { e.preventDefault(); cycleWins(e.shiftKey ? -1 : 1); return; }
    if (meta) { e.preventDefault(); StartMenu.toggle(); meta = false; return; }

    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      const r = activeWin();
      if (r) WM.close(r.id); else power('shutdown');
      return;
    }
    // Клавиши отдаём активному окну, если оно их запрашивает. Так игра
    // получает стрелки раньше, чем система успеет переключить окно.
    const aw = activeWin();
    if (!typing && aw && aw.api.keys && aw.api.keys(e.key)) { e.preventDefault(); return; }

    if (e.ctrlKey && e.altKey && k === 't') { e.preventDefault(); WM.open('terminal'); return; }
    if (e.key === 'Escape') { closeCtx(); Quick.close(); Widgets.close(); Spot.close(); StartMenu.closeMenu(); return; }
    if (e.key === 'F5') { e.preventDefault(); renderIcons(); return; }
    if (typing) return;
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !StartMenu.isOpen()) { e.preventDefault(); cycleWins(e.key === 'ArrowDown' ? 1 : -1); }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'Meta') meta = false;
    const aw = activeWin();
    if (aw && aw.api.keyup) aw.api.keyup(e.key);
  });
  window.addEventListener('blur', () => { meta = false; });
}

/* ============================================================================
   ПИТАНИЕ И БЛОКИРОВКА
   ========================================================================== */
function lockScreen() {
  const l = $('#lock');
  l.style.display = 'flex';
  l.classList.remove('gone');
  paintLock();
  tickClock();
}

/* Если владелец задал код, экран блокировки просит его ввести. */
function paintLock() {
  const l = $('#lock');
  const need = needCode();
  l.classList.toggle('needcode', need);
  const hint = $('#lockHint');
  if (hint) hint.textContent = need ? 'Ваш компьютер заблокирован. Введите код для разблокировки.' : 'Нажмите Enter, чтобы войти';
  const btn = $('#lockBtn');
  if (btn) btn.style.display = need ? 'none' : '';
  const err = $('#lockErr');
  if (err) err.textContent = '';
  const f = $('#lockForgot');
  if (f) f.textContent = State.auth.rec ? 'Забыли код?' : 'Забыли код? Восстановление';
  if (need) setTimeout(() => { const i = $('#lockCode'); if (i) { i.value = ''; i.focus(); } }, 120);
}

function revealDesk() {
  $('#desk').classList.add('on');
  // Рабочий стол показан — только теперь честно меряем кадры.
  setTimeout(tuneByFps, 600);
}
function unlock() {
  const l = $('#lock');
  if (needCode() && State.locked) { tryLockCode(); return; }
  State.locked = false;
  l.classList.add('gone');
  revealDesk();
  Sound.open();
  setTimeout(() => { l.style.display = 'none'; }, 700);
}

/* Проверка кода владельца на экране запуска. Кода в коде нет — сверяем
   отпечаток: введённый текст прогоняем через ту же соль и повторы. */
function tryLockCode() {
  const inp = $('#lockCode'), err = $('#lockErr');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) { if (err) err.textContent = 'Введите код.'; return; }
  if (Auth.check(val, State.auth.code)) {
    State.locked = false;
    State.adminAttempts = 0;
    if (err) err.textContent = '';
    const l = $('#lock');
    l.classList.add('gone');
    revealDesk();
    Sound.open();
    setTimeout(() => { l.style.display = 'none'; }, 700);
    Notify(SysInfo.get().name, 'Код принят. Система запущена.', ICO.shield, true);
  } else {
    State.adminAttempts = (State.adminAttempts || 0) + 1;
    Sound.error();
    if (err) err.textContent = 'Неверный код. Попытка ' + State.adminAttempts + '.';
    inp.value = '';
    inp.focus();
    $('#lock').animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(0)' }],
      { duration: 260 });
  }
}

/* Сброс забытого кода с экрана блокировки. Два пути:
   1) есть код восстановления — вводим его и задаём новый код;
   2) кода восстановления нет — сбрасываем доступ целиком, но тогда пропадут
      файлы и настройки, поэтому честно предупреждаем и просим подтверждение. */
function openRecovery() {
  const l = $('#lock');
  if (!l) return;
  const box = $('#lockBody');
  if (!box) return;
  const hasRec = !!State.auth.rec;
  box.innerHTML =
    '<div class="lock-title" style="display:block">Восстановление доступа</div>' +
    (hasRec
      ? '<div class="lock-hint" style="color:rgba(255,255,255,.72)">Введите код восстановления, который система показала при первом запуске.</div>' +
        '<div class="lock-code" style="display:flex"><input id="recIn" type="text" autocomplete="off" placeholder="LMN-XXXX-XXXX-XXXX"><button class="lock-btn" id="recBtn">Проверить</button></div>' +
        '<div class="lock-err" id="recErr"></div>' +
        '<div class="lock-hint" style="margin-top:8px"><button class="lock-link" id="recBack" style="display:inline-block">← Назад ко входу</button></div>'
      : '<div class="lock-warn" style="color:#ffc65c;font-size:12px;max-width:330px;line-height:1.6;text-align:center">Код восстановления не задан, поэтому вернуть доступ можно только полным сбросом. Рабочий стол, созданные файлы и настройки будут удалены — система вернётся к состоянию первого запуска.</div>' +
        '<div class="lock-err" id="recErr"></div>' +
        '<div class="lock-code" style="display:flex;margin-top:12px"><button class="lock-btn" id="recWipe">Сбросить и начать заново</button></div>' +
        '<div class="lock-hint" style="margin-top:8px"><button class="lock-link" id="recBack" style="display:inline-block">← Назад ко входу</button></div>');
  const back = $('#recBack');
  if (back) back.onclick = () => { restoreLockBody(); paintLock(); };
  const btn = $('#recBtn');
  if (btn) btn.onclick = checkRecovery;
  const ri = $('#recIn');
  if (ri) {
    ri.focus();
    ri.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); checkRecovery(); } };
  }
  const wipe = $('#recWipe');
  if (wipe) wipe.onclick = hardReset;
}

function checkRecovery() {
  const inp = $('#recIn'), err = $('#recErr');
  if (!inp) return;
  const val = inp.value.trim().toUpperCase();
  if (!val) { if (err) err.textContent = 'Введите код восстановления.'; return; }
  if (!Auth.check(val, State.auth.rec)) {
    Sound.error();
    if (err) err.textContent = 'Код не подошёл. Проверьте знаки.';
    inp.value = '';
    inp.focus();
    return;
  }
  /* Код верный: просим задать новый код владельца. */
  const box = $('#lockBody');
  box.innerHTML =
    '<div class="lock-title" style="display:block">Новый код владельца</div>' +
    '<div class="lock-hint" style="color:rgba(255,255,255,.72)">Код восстановления принят. Задайте новый код — им будете входить в систему.</div>' +
    '<div class="lock-code" style="display:flex"><input id="newCodeIn" type="password" autocomplete="off" placeholder="новый код, не короче 4 знаков"><button class="lock-btn" id="newCodeBtn">Сохранить</button></div>' +
    '<div class="lock-err" id="newCodeErr"></div>';
  const ni = $('#newCodeIn');
  if (ni) {
    ni.focus();
    ni.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); saveNewCode(); } };
  }
  const nb = $('#newCodeBtn');
  if (nb) nb.onclick = saveNewCode;
}

function saveNewCode() {
  const inp = $('#newCodeIn'), err = $('#newCodeErr');
  if (!inp) return;
  const val = inp.value.trim();
  if (val.length < 4) { if (err) err.textContent = 'Код слишком короткий — минимум 4 знака.'; return; }
  setCode(val);
  Sound.notif();
  restoreLockBody();
  paintLock();
  Notify(SysInfo.get().name, 'Код изменён. Войдите с новым кодом.', ICO.shield, true);
  const i = $('#lockCode');
  if (i) { i.value = ''; i.focus(); }
}

/* Полный сброс: доступ и данные. Система вернётся к первому запуску. */
function hardReset() {
  try {
    ['w12.auth', 'w12.sysinfo', 'w12.allApps'].forEach(k => localStorage.removeItem(k));
    const keep = ['w12.accent', 'w12.accent2', 'w12.theme', 'w12.wall', 'w12.transp', 'w12.align', 'w12.lite'];
    Object.keys(localStorage).forEach(k => { if (k.indexOf('w12.') === 0 && keep.indexOf(k) < 0) localStorage.removeItem(k); });
  } catch (e) { /* хранилище недоступно */ }
  location.reload();
}

/* Возврат экрана блокировки к обычному виду после восстановления. */
function restoreLockBody() {
  const box = $('#lockBody');
  if (!box) return;
  box.innerHTML =
    '<div class="lock-title" id="lockTitle">Ваш компьютер заблокирован</div>' +
    '<div class="lock-user" data-sys="user">Степан</div>' +
    '<div class="lock-hint" id="lockHint">Нажмите Enter, чтобы войти</div>' +
    '<div class="lock-code">' +
      '<input id="lockCode" type="password" autocomplete="off" maxlength="64" placeholder="код владельца">' +
      '<button class="lock-btn" id="lockCodeBtn">Открыть</button>' +
    '</div>' +
    '<div class="lock-err" id="lockErr"></div>' +
    '<button class="lock-link" id="lockForgot">Забыли код?</button>';
  SysInfo.apply();
  const btn = $('#lockCodeBtn');
  if (btn) btn.onclick = tryLockCode;
  const i = $('#lockCode');
  if (i) i.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); tryLockCode(); } };
  const f = $('#lockForgot');
  if (f) f.onclick = openRecovery;
}
function power(mode) {
  StartMenu.closeMenu(); Quick.close();
  if (mode === 'lock') {
    State.locked = needCode();
    lockScreen();
    return;
  }
  const shut = $('#shut'), txt = $('#shutTxt');
  shut.classList.add('on');
  txt.textContent = mode === 'restart' ? 'Перезапуск…' : mode === 'sleep' ? 'Спящий режим…' : 'Завершение работы…';
  setTimeout(() => {
    if (mode === 'sleep') { shut.classList.remove('on'); State.locked = needCode(); lockScreen(); return; }
    if (mode === 'restart') { location.reload(); return; }
    shut.innerHTML = '<div style="text-align:center">' +
      '<div style="width:78px;height:78px;margin:0 auto 22px;opacity:.5"><svg viewBox="0 0 100 100"><use href="#winLogo"/></svg></div>' +
      '<div style="font-family:var(--font-display);font-weight:300;font-size:16px;color:var(--txt-dim)">Питание отключено. Нажмите кнопку, чтобы включить.</div>' +
      '<button class="btn primary" id="wakeBtn" style="margin-top:26px;padding:12px 26px">Включить</button></div>';
    $('#wakeBtn').onclick = () => location.reload();
  }, 2400);
}

/* ============================================================================
   ВКЛЮЧЕНИЕ КОМПЬЮТЕРА: СИСТЕМНЫЙ БЛОК И МОНИТОР
   ========================================================================== */
/* Сначала показываем системный блок с кнопкой питания. По нажатию загорается
   цветная подсветка, крутятся вентиляторы, а потом картинка переходит на
   монитор, где и появляется система. */
function initPowerOn() {
  const po = $('#poweron'), mon = $('#monitor');
  if (!po || !mon) return;
  po.classList.add('on');

  let started = false, unlocked = false;
  /* Черновики первого запуска: код владельца и код восстановления до
     сохранения. В хранилище попадут только отпечатки. */
  let pendingCode = '', pendingRecovery = '';
  function start() {
    if (started) return;
    started = true;
    Sound.click();
    po.classList.add('lit');
    setTimeout(() => Sound.boot && Sound.boot(), 260);
    // Перед включением монитора просим пароль учётной записи.
    setTimeout(askPassword, 1100);
  }
  function askPassword() {
    /* Первый запуск: владелец ещё не задал код — предлагаем придумать свой. */
    if (!State.auth.ready) { paintFirstRun(); return; }
    if (!hasPass() && !hasCode()) { showMonitor(); return; }
    paintLogin();
    po.classList.add('pass');
    setTimeout(() => { const i = $('#poPassInput') || $('#poCodeInput'); if (i) { i.value = ''; i.focus(); } }, 220);
  }
  /* Экран входа: что спрашивать — решает то, что задал владелец. */
  function paintLogin() {
    const card = $('#poPassCard');
    if (!card) return;
    const pass = hasPass(), code = hasCode();
    let h = '<div class="avatar" data-sys="user-initial">С</div>' +
      '<div class="po-passname" data-sys="user">Степан</div>';
    if (pass) {
      h += '<div class="po-passhint">Система защищена. Введите пароль учётной записи' +
        (code ? ' или код владельца.' : '.') + '</div>' +
        '<div class="po-passfield">' +
          '<input id="poPassInput" type="password" autocomplete="off" maxlength="64" placeholder="пароль">' +
          '<button class="lock-btn" id="poPassBtn">Войти</button>' +
        '</div>' +
        '<div class="po-paserr" id="poPassErr"></div>';
    }
    if (code) {
      if (pass) h += '<div class="po-codeword">';
      h += '<input id="poCodeInput" type="password" autocomplete="off" maxlength="64" placeholder="код владельца">' +
        '<button class="lock-btn" id="poCodeBtn">Открыть</button>';
      if (pass) h += '</div>';
      h += '<div class="po-coderr" id="poCodeErr"></div>';
    }
    h += '<div class="po-actions">' +
      '<button class="po-link" id="poForgot">Забыли код или пароль?</button>' +
      (State.auth.rec ? '' : '<button class="po-link" id="poReset">Сбросить доступ</button>') +
      '</div>';
    card.innerHTML = h;
    SysInfo.apply();
    const pb = $('#poPassBtn'); if (pb) pb.onclick = tryPass;
    const pin = $('#poPassInput');
    if (pin) pin.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); tryPass(); } });
    const cb = $('#poCodeBtn'); if (cb) cb.onclick = tryCode;
    const cin = $('#poCodeInput');
    if (cin) cin.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); tryCode(); } });
    const fb = $('#poForgot'); if (fb) fb.onclick = forgotOnBoot;
    const rb = $('#poReset'); if (rb) rb.onclick = bootReset;
  }

  /* Первый запуск: владелец придумывает код, пароль и получает код
     восстановления. Ничего этого в исходниках системы нет. */
  function paintFirstRun() {
    const card = $('#poPassCard');
    if (!card) return;
    card.innerHTML =
      '<div class="avatar"><svg viewBox="0 0 100 100" style="width:34px;height:34px"><use href="#winLogo"/></svg></div>' +
      '<div class="po-passname">Первый запуск</div>' +
      '<div class="po-passhint">Придумайте код владельца — им вы будете включать компьютер и входить в систему. Кода по умолчанию нет: система не хранит ни одного пароля в открытом виде.</div>' +
      '<div class="po-passfield"><input id="frCode" type="password" autocomplete="off" maxlength="64" placeholder="код владельца, не короче 4 знаков"><button class="lock-btn" id="frCodeBtn">Задать</button></div>' +
      '<div class="po-paserr" id="frErr"></div>' +
      '<div class="po-passhint po-passhint-alt">Дальше можно будет добавить пароль учётной записи — он спросится после кнопки питания.</div>';
    po.classList.add('pass');
    setTimeout(() => { const i = $('#frCode'); if (i) i.focus(); }, 220);
    const go = () => {
      const inp = $('#frCode'), err = $('#frErr');
      const v = inp ? inp.value.trim() : '';
      if (v.length < 4) { Sound.error(); if (err) err.textContent = 'Код слишком короткий — минимум 4 знака.'; return; }
      pendingCode = v;
      paintRecovery();
    };
    $('#frCodeBtn').onclick = go;
    const i = $('#frCode');
    if (i) i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  }

  /* Показываем код восстановления — единственный способ вернуть доступ,
     если код забудется. Показываем один раз, сохранить нужно самому. */
  function paintRecovery() {
    const card = $('#poPassCard');
    if (!card) return;
    const rec = Auth.recovery();
    pendingRecovery = rec;
    card.innerHTML =
      '<div class="po-passname">Код восстановления</div>' +
      '<div class="po-passhint">Запишите его и держите в надёжном месте. Он понадобится, если забудете код владельца. Система хранит только отпечаток — показать код повторно она не сможет.</div>' +
      '<div class="po-reccode" id="frRec">' + esc(rec) + '</div>' +
      '<div class="po-actions">' +
        '<button class="lock-btn" id="frCopy">Скопировать</button>' +
        '<button class="lock-btn" id="frSaved">Я записал — продолжить</button>' +
      '</div>' +
      '<div class="po-passhint po-passhint-alt">Без этого кода и без пароля вернуть доступ можно только полным сбросом: файлы и настройки будут удалены.</div>';
    const cp = $('#frCopy');
    if (cp) cp.onclick = () => {
      const t = $('#frRec') ? $('#frRec').textContent : '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t);
      } catch (e) { /* буфер недоступен */ }
      Sound.click();
      cp.textContent = 'Скопировано';
    };
    const ok = $('#frSaved');
    if (ok) ok.onclick = () => {
      setOwnerCode(pendingCode, '', pendingRecovery);
      pendingCode = ''; pendingRecovery = '';
      Sound.notif();
      Notify(SysInfo.get().name, 'Код владельца задан. Он понадобится при следующем включении.', ICO.shield, true);
      passOk();
    };
  }

  /* Забыли код или пароль прямо на экране включения. */
  function forgotOnBoot() {
    const card = $('#poPassCard');
    if (!card) return;
    card.innerHTML =
      '<div class="po-passname">Восстановление доступа</div>' +
      (State.auth.rec
        ? '<div class="po-passhint">Введите код восстановления, который система показала при первом запуске.</div>' +
          '<div class="po-passfield"><input id="poRecIn" type="text" autocomplete="off" placeholder="LMN-XXXX-XXXX-XXXX"><button class="lock-btn" id="poRecBtn">Проверить</button></div>' +
          '<div class="po-paserr" id="poRecErr"></div>'
        : '<div class="po-warn">Код восстановления не задан. Вернуть доступ можно только полным сбросом — файлы и настройки будут удалены.</div>' +
          '<div class="po-actions"><button class="lock-btn" id="poWipe">Сбросить и начать заново</button></div>') +
      '<div class="po-actions"><button class="po-link" id="poBack">← Назад ко входу</button></div>';
    const back = $('#poBack');
    if (back) back.onclick = () => { paintLogin(); };
    const wipe = $('#poWipe');
    if (wipe) wipe.onclick = bootReset;
    const btn = $('#poRecBtn');
    if (btn) btn.onclick = () => {
      const inp = $('#poRecIn'), err = $('#poRecErr');
      const v = inp ? inp.value.trim().toUpperCase() : '';
      if (!Auth.check(v, State.auth.rec)) {
        Sound.error();
        if (err) err.textContent = 'Код не подошёл. Проверьте знаки.';
        if (inp) { inp.value = ''; inp.focus(); }
        return;
      }
      paintNewCode();
    };
    const ri = $('#poRecIn');
    if (ri) { ri.focus(); ri.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (btn) btn.click(); } }); }
  }

  /* Новый код владельца после верного кода восстановления. */
  function paintNewCode() {
    const card = $('#poPassCard');
    if (!card) return;
    card.innerHTML =
      '<div class="po-passname">Новый код владельца</div>' +
      '<div class="po-passhint">Код восстановления принят. Задайте новый код — им будете входить в систему.</div>' +
      '<div class="po-passfield"><input id="poNewIn" type="password" autocomplete="off" maxlength="64" placeholder="новый код, не короче 4 знаков"><button class="lock-btn" id="poNewBtn">Сохранить</button></div>' +
      '<div class="po-paserr" id="poNewErr"></div>';
    const go = () => {
      const inp = $('#poNewIn'), err = $('#poNewErr');
      const v = inp ? inp.value.trim() : '';
      if (v.length < 4) { Sound.error(); if (err) err.textContent = 'Код слишком короткий — минимум 4 знака.'; return; }
      setCode(v);
      Sound.notif();
      paintLogin();
      Notify(SysInfo.get().name, 'Код изменён. Войдите с новым кодом.', ICO.shield, true);
    };
    $('#poNewBtn').onclick = go;
    const i = $('#poNewIn');
    if (i) { i.focus(); i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } }); }
  }

  function bootReset() {
    resetAccess();
    location.reload();
  }

  /* Пароль верный — карточка улетает в монитор, и включается экран. */
  function passOk() {
    if (unlocked) return;
    unlocked = true;
    const err = $('#poPassErr'); if (err) err.textContent = '';
    po.classList.remove('pass');
    po.classList.add('toscreen');
    Sound.open();
    setTimeout(showMonitor, 620);
  }
  /* Пароль учётной записи: сверяем отпечаток, а не текст. */
  function tryPass() {
    const inp = $('#poPassInput'), err = $('#poPassErr');
    if (!inp) return;
    const val = inp.value;
    if (!val) { if (err) err.textContent = 'Введите пароль.'; return; }
    if (Auth.check(val, State.auth.pass)) { passOk(); return; }
    Sound.error();
    State.passTries = (State.passTries || 0) + 1;
    if (err) err.textContent = 'Неверный пароль. Попытка ' + State.passTries + '.';
    inp.value = '';
    inp.focus();
    $('#poPass').animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(0)' }],
      { duration: 260 });
  }
  /* Код владельца: подходит вместо пароля. Сверяем отпечаток. */
  function tryCode() {
    const inp = $('#poCodeInput'), err = $('#poCodeErr');
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) { if (err) err.textContent = 'Введите код владельца.'; return; }
    if (Auth.check(val, State.auth.code)) {
      if (err) err.textContent = '';
      passOk();
      return;
    }
    Sound.error();
    State.codeTries = (State.codeTries || 0) + 1;
    if (err) err.textContent = 'Неверный код владельца. Попытка ' + State.codeTries + '.';
    inp.value = '';
    inp.focus();
    $('#poPass').animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(0)' }],
      { duration: 260 });
  }
  function showMonitor() {
    mon.classList.add('on');
    mon.classList.add('flash');
    requestAnimationFrame(() => mon.classList.add('zoom'));
    setTimeout(() => mon.classList.remove('flash'), 900);
    setTimeout(() => {
      po.style.display = 'none';
      po.classList.remove('on');
      window.dispatchEvent(new Event('resize'));
      // Теперь, когда экран монитора виден, запускаем загрузку системы.
      $('#boot').classList.add('on');
      bootSequence();
      setTimeout(() => Notify(SysInfo.get().name, 'Система готова. Нажмите Win или откройте «Пуск», чтобы начать.', ICO.sparkle), 2600);
      setTimeout(() => Notify('Совет', 'Потяните окно к краю экрана — Люмен предложит зону прилипания. Win+←/→ — половина экрана.', ICO.max, true), 7200);
    }, 900);
  }

  $('#poPower').onclick = start;
  $('#poPc').onclick = start;
  document.addEventListener('keydown', e => {
    if (po.classList.contains('on') && !started && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(); }
  });
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
      { t: 'Создать папку', i: ICO.plus, f: () => { createDeskFolder(); } },
      { t: 'Создать текстовый файл', i: ICO.note, f: () => { createDeskFile(); } },
      { sep: true },
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
   ОБЛЕГЧЁННЫЙ РЕЖИМ ПО ФАКТУ КАДРОВ
   ========================================================================== */
/* Меряем кадры сразу после запуска. Если отрисовка идёт медленно (слабое
   железо, нет ускорения), включаем простой режим: он убирает размытие
   подложек и тяжёлые анимации. Владелец может переключить режим вручную. */
function measureFps() {
  return new Promise(resolve => {
    let n = 0;
    const t0 = performance.now();
    function tick() {
      n++;
      const dt = performance.now() - t0;
      if (dt < 1400) requestAnimationFrame(tick);
      else resolve(Math.round(n / (dt / 1000)));
    }
    requestAnimationFrame(tick);
  });
}

function applyLite(on, remember) {
  State.lite = !!on;
  document.documentElement.classList.toggle('lite', State.lite);
  if (remember) {
    try { localStorage.setItem('w12.lite', State.lite ? '1' : '0'); } catch (e) { /* хранилище недоступно */ }
  }
}

function autoTune() {
  let saved = null;
  try { saved = localStorage.getItem('w12.lite'); } catch (e) { /* хранилище недоступно */ }
  if (saved !== null) { applyLite(saved === '1', false); State.tuned = true; return; }

  // Слабый компьютер виден сразу по числу ядер и объёму памяти. Ждать замера
  // кадров не нужно: на таком железе плавности не будет ни при каком оформлении.
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  if (cores <= 4 || mem <= 4) { applyLite(true, true); State.tuned = true; return; }

  State.tuned = false;   // решится по кадрам, когда появится рабочий стол
}

/* Первый запуск: решаем по фактическим кадрам. Меряем только когда рабочий
   стол уже виден — до этого экран загрузки слишком дёшев и врёт. */
function tuneByFps() {
  if (State.tuned) return;
  State.tuned = true;
  // Первый замер сразу после появления стола бывает завышен: браузер ещё не
  // отрисовал тяжёлый кадр. Поэтому меряем дважды и берём худший результат.
  setTimeout(() => {
    measureFps().then(a => measureFps().then(b => {
      const fps = Math.min(a, b);
      State.fps = fps;
      // Порог 55, а не 50: между 50 и 60 рывки уже заметны глазом.
      if (fps && fps < 55) { enableLite(); return; }
      applyLite(false, true);
      watchFps();
    }));
  }, 1200);
}

function enableLite() {
  if (State.lite) return;
  applyLite(true, true);
  Notify(SysInfo.get().name, 'Включён облегчённый режим: система работает плавнее.', ICO.sparkle);
}

/* Пассивный надзор. Пустой рабочий стол на слабом железе ещё держит 60 кадров,
   а просадка начинается под нагрузкой — когда открыто окно или тянется ручка
   размера. Поэтому первую половину минуты следим за кадрами и включаем
   облегчённый режим, если стало тяжело. Окна для проверки не открываем:
   пользователь не должен видеть ничего, кроме того, что стало плавнее. */
function watchFps() {
  const until = performance.now() + 30000;
  (function again() {
    if (State.lite || performance.now() > until) return;
    // В скрытой вкладке кадры не рисуются — замер соврал бы про ноль.
    if (document.hidden) { setTimeout(again, 2000); return; }
    measureFps().then(f => {
      if (f && f < 48) { enableLite(); return; }
      again();
    });
  })();
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
    // Доступ: только отпечатки кода, пароля и кода восстановления.
    const au = localStorage.getItem('w12.auth');
    if (au) {
      const a = JSON.parse(au);
      if (a && a.ver === 1) State.auth = Object.assign({ ver: 1, ready: false, code: null, pass: null, rec: null }, a);
    }
  } catch (e) { /* хранилище недоступно */ }
}
/* Сохранение данных доступа. Открытых кодов здесь нет — только отпечатки. */
function saveAuth() {
  try { localStorage.setItem('w12.auth', JSON.stringify(State.auth)); }
  catch (e) { /* хранилище недоступно */ }
}
/* Владелец задаёт код при первом запуске. */
function setOwnerCode(code, pass, recovery) {
  State.auth.code = Auth.make(code);
  State.auth.pass = pass ? Auth.make(pass) : null;
  State.auth.rec = recovery ? Auth.make(recovery) : null;
  State.auth.ready = true;
  saveAuth();
}
/* Смена одного кода без затрагивания остальных. */
function setCode(text) { State.auth.code = Auth.make(text); State.auth.ready = true; saveAuth(); }
function setPass(text) { State.auth.pass = text ? Auth.make(text) : null; saveAuth(); }
function setRecovery(text) { State.auth.rec = text ? Auth.make(text) : null; saveAuth(); }
/* Полный сброс доступа: система снова попросит задать свой код. */
function resetAccess() {
  State.auth = { ver: 1, ready: false, code: null, pass: null, rec: null };
  try { localStorage.removeItem('w12.auth'); } catch (e) { /* хранилище недоступно */ }
}
function bootSequence() {
  const TIPS = ['Инициализация ядра люмен…', 'Монтирование виртуальной ФС…', 'Запуск оконного менеджера «Плексус»…',
    'Калибровка снапа на 12 зон…', 'Синтез звуковой подсистемы…', 'Загрузка профиля «' + USER + '»…', 'Почти готово…'];
  const bar = $('#bootBar'), tip = $('#bootTip');
  if (!bar) return;
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
        setTimeout(() => { b.style.display = 'none'; }, 800);
        tickClock();
        Sound.boot();
        // Экран включения уже проверил владельца (пароль или код), поэтому
        // второй раз ничего не спрашиваем — сразу рабочий стол.
        State.locked = false;
        const l = $('#lock');
        l.style.display = 'none';
        revealDesk();
      }, 420);
    }
  }, 190);
}

/* Поворот экрана, смена размера окна и вызов клавиатуры на телефоне меняют
   размеры стола. Пересчитываем окна и подгоняем панель задач. */
function initResponsive() {
  let lastW = window.innerWidth, lastH = window.innerHeight;
  const onResize = () => {
    if (window.innerWidth === lastW && window.innerHeight === lastH) return;
    lastW = window.innerWidth; lastH = window.innerHeight;
    WM.relayout();
    renderTaskbar();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => setTimeout(onResize, 260));

  // Кнопки в панели задач на телефоне должны листаться пальцем.
  const dock = $('.tb-dock');
  if (dock && window.matchMedia('(hover:none)').matches) dock.style.touchAction = 'pan-x';

  // Двойной тап по значку открывает приложение: dblclick на телефоне не срабатывает.
  if (window.matchMedia('(hover:none)').matches) {
    let lastTap = 0, lastNode = null;
    document.addEventListener('touchend', e => {
      const ic = e.target.closest && e.target.closest('.dicon');
      if (!ic) return;
      const now = Date.now();
      if (ic === lastNode && now - lastTap < 400) {
        lastTap = 0; lastNode = null;
        e.preventDefault();
        if (ic.ondblclick) ic.ondblclick();
      } else { lastTap = now; lastNode = ic; }
    }, { passive: false });

    // Правой кнопки на телефоне нет: долгое нажатие открывает то же меню.
    let timer = null, fired = false;
    document.addEventListener('touchstart', e => {
      const t = e.target.closest && e.target.closest('[data-ctx], .dicon, .file, .file-row');
      if (!t) return;
      fired = false;
      const x = e.touches[0].clientX, y = e.touches[0].clientY;
      timer = setTimeout(() => {
        fired = true;
        t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
      }, 520);
    }, { passive: true });
    const stop = () => { if (timer) { clearTimeout(timer); timer = null; } };
    document.addEventListener('touchend', stop);
    document.addEventListener('touchmove', stop);
    document.addEventListener('touchcancel', stop);
  }
}

function init() {
  loadPrefs();
  autoTune();
  loadDeskItems();
  SysInfo.apply();
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
  initResponsive();

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
  $('#lockCodeBtn').onclick = tryLockCode;
  $('#lockCode').onkeydown = e => {
    if (e.key === 'Enter') { e.preventDefault(); tryLockCode(); }
    e.stopPropagation();
  };
  const lf = $('#lockForgot');
  if (lf) lf.onclick = openRecovery;
  // При блокировке клик по фону ставит курсор в поле кода, а не пускает внутрь.
  $('#lock').onclick = e => {
    if (e.target.closest('.lock-btn') || e.target.closest('.lock-code') || e.target.closest('.lock-link')) return;
    if (needCode() && State.locked) { const i = $('#lockCode'); if (i) i.focus(); return; }
    unlock();
  };
  document.addEventListener('keydown', e => {
    const l = $('#lock');
    if (!l || l.style.display === 'none' || l.classList.contains('gone')) return;
    if (needCode() && State.locked) return;   // ждём код, Enter сам не пускает
    if (e.key === 'Enter' || e.key === ' ') unlock();
  });

  setInterval(tickClock, 1000);
  setInterval(() => { if (Widgets.isOpen()) Widgets.stats(); }, 2200);

  initPowerOn();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
