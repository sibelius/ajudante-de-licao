/* Ajudante de Lição — corrida das contas + soletrando */

// ================= DADOS =================
const RIVALS = [
  { id: 'turtle', e: '🐢', name: 'Tartaruga', sub: 'bem devagar', sec: 9 },
  { id: 'rabbit', e: '🐇', name: 'Coelho', sub: 'rapidinho', sec: 6 },
  { id: 'cheetah', e: '🐆', name: 'Guepardo', sub: 'muito rápido', sec: 4 },
  { id: 'rocket', e: '🚀', name: 'Foguete', sub: 'supersônico!', sec: 2.5 },
];
const OPS = ['×', '÷', '+', '−'];
const RANGES = [10, 20, 50, 100];
const LENGTHS = [10, 15, 20];

// sílabas separadas por "-" | emoji
const WORDS = {
  pt: {
    facil: 'ga-to|🐱 ca-sa|🏠 bo-la|⚽ sa-po|🐸 lu-a|🌙 pa-to|🦆 da-do|🎲 bo-lo|🎂 u-va|🍇 sol|☀️ flor|🌸 ra-to|🐭 va-ca|🐮 mel|🍯 o-vo|🥚 ca-ma|🛏️ pi-po-ca|🍿 ba-na-na|🍌 ma-la|🧳 ja-ne-la|🪟 ca-va-lo|🐴 de-do|☝️ rei|👑 nu-vem|☁️ fa-da|🧚 lo-bo|🐺',
    medio: 'ga-li-nha|🐔 ca-chor-ro|🐶 car-ro|🚗 a-be-lha|🐝 co-e-lho|🐰 chu-va|🌧️ pa-lha-ço|🤡 mor-ce-go|🦇 fo-lha|🍃 ro-sa|🌹 ca-mi-sa|👕 trem|🚂 bru-xa|🧙 pei-xe|🐟 cho-co-la-te|🍫 tar-ta-ru-ga|🐢 es-tre-la|⭐ co-ra-ção|❤️ ba-lão|🎈 pão|🍞 mão|✋ gi-ra-fa|🦒 ma-ca-co|🐒 tu-ba-rão|🦈 sor-ve-te|🍦 ce-nou-ra|🥕 pas-sa-ri-nho|🐦 so-nho|💭 dra-gão|🐉',
    dificil: 'a-ba-ca-xi|🍍 xí-ca-ra|☕ ja-ca-ré|🐊 he-li-cóp-te-ro|🚁 ma-çã|🍎 ó-cu-los|👓 bor-bo-le-ta|🦋 ca-ra-mu-jo|🐌 pin-guim|🐧 ca-ran-gue-jo|🦀 mo-ran-go|🍓 gui-tar-ra|🎸 a-vi-ão|✈️ ô-ni-bus|🚌 lâm-pa-da|💡 ár-vo-re|🌳 bi-ci-cle-ta|🚲 di-nos-sau-ro|🦕 fo-gue-te|🚀 a-bó-bo-ra|🎃 re-ló-gio|⏰ es-qui-lo|🐿️ pás-sa-ro|🐦 sa-xo-fo-ne|🎷 ca-ma-leão|🦎 guar-da=chu-va|☂️ mi-cro-fo-ne|🎤',
  },
  en: {
    facil: 'cat|🐱 dog|🐶 sun|☀️ hat|🎩 bus|🚌 cake|🎂 fish|🐟 frog|🐸 duck|🦆 bed|🛏️ egg|🥚 cow|🐮 pig|🐷 star|⭐ moon|🌙 tree|🌳 book|📖 ball|⚽ car|🚗 milk|🥛',
    medio: 'apple|🍎 house|🏠 horse|🐴 mouse|🐭 train|🚂 chair|🪑 pizza|🍕 rabbit|🐰 flower|🌸 monkey|🐒 cookie|🍪 banana|🍌 rocket|🚀 turtle|🐢 school|🏫 lemon|🍋 snake|🐍 cloud|☁️ queen|👸 pencil|✏️',
    dificil: 'elephant|🐘 butterfly|🦋 dinosaur|🦕 umbrella|☂️ penguin|🐧 strawberry|🍓 helicopter|🚁 pineapple|🍍 giraffe|🦒 octopus|🐙 bicycle|🚲 chocolate|🍫 kangaroo|🦘 crocodile|🐊 airplane|✈️ watermelon|🍉 rainbow|🌈 squirrel|🐿️',
  },
};
function parseWords(str) {
  return str.trim().split(/\s+/).filter(t => t.includes('|')).map(t => {
    const [syl, emoji] = t.split('|');
    // "=" marca hífen de verdade (guarda-chuva)
    const word = syl.replace(/-/g, '').replace(/=/g, '-');
    return { word, syl: syl.replace(/=/g, '-').split('-').join('·'), emoji };
  });
}

const LEVELS_SPELL = [
  { id: 'facil', label: '🌱 Fácil' },
  { id: 'medio', label: '🌿 Médio' },
  { id: 'dificil', label: '🌳 Difícil' },
  { id: 'escola', label: '✏️ Lista da escola' },
];

const STICKERS = ['🦄', '🐉', '🦖', '🐼', '🦊', '🐨', '🦁', '🐯', '🐸', '🐙', '🦋', '🐞', '🐬', '🦜', '🦩', '🐳', '🌈', '🍩', '🍦', '🎈', '🚀', '🛸', '👑', '💎', '🎸', '🏆', '🌟', '🪐', '🍕', '🧁'];
const PRAISE = ['Isso! 🎉', 'Boa! ⚡', 'Arrasou! 🌟', 'Muito bem! 💪', 'Show! 🚀', 'Mandou bem! 😎', 'Certinho! ✅'];

// ================= ESTADO =================
const DEFAULT = {
  name: '', sound: true, stars: 0, stickers: [], lastSticker: null,
  mistakes: { math: {}, spell: {} },
  raceCfg: { ops: ['×'], tables: [2, 3, 4, 5], range: 20, rival: 'rabbit', len: 10 },
  spellCfg: { lang: 'pt', level: 'facil' },
  customWords: '',
  stats: { races: 0, wins: 0, answers: 0, answersOk: 0, words: 0, wordsOk: 0 },
};
let save;
try { save = JSON.parse(localStorage.getItem('licao') || 'null'); } catch { save = null; }
save = Object.assign(structuredClone(DEFAULT), save || {});
save.mistakes = Object.assign({ math: {}, spell: {} }, save.mistakes);
save.stats = Object.assign(structuredClone(DEFAULT.stats), save.stats);
const persist = () => { try { localStorage.setItem('licao', JSON.stringify(save)); } catch {} };

// ================= UTIL =================
const $ = id => document.getElementById(id);
const rand = a => a[Math.floor(Math.random() * a.length)];
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.normalize('NFC').trim().toLowerCase();
const noAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

let actx;
function tone(freq, dur = 0.15, type = 'triangle', vol = 0.18, when = 0) {
  if (!save.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime + when;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch {}
}
const sOk = () => { tone(660, 0.12); tone(990, 0.18, 'triangle', 0.18, 0.08); };
const sBad = () => tone(170, 0.25, 'sawtooth', 0.08);
const sWin = () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.25, 'square', 0.07, i * 0.12));
const sLose = () => [392, 349, 311, 262].forEach((f, i) => tone(f, 0.3, 'triangle', 0.12, i * 0.18));
const sBeep = (hi) => tone(hi ? 880 : 440, 0.2, 'square', 0.08);
const sTap = () => tone(1200, 0.04, 'sine', 0.06);

let voices = [];
const loadVoices = () => { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; };
loadVoices();
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices;
function speak(text, lang = 'pt-BR', rate = 0.9) {
  if (!window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate;
    const prefix = lang.slice(0, 2);
    const v = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.startsWith(prefix));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch {}
}

function confetti(n = 100) {
  const c = $('confetti');
  const colors = ['#ff7a59', '#2ec4b6', '#ffd23f', '#7b61ff', '#3a86ff', '#ff5d8f'];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'confetto';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.background = rand(colors);
    d.style.animationDuration = 1.8 + Math.random() * 2 + 's';
    d.style.animationDelay = Math.random() * 0.4 + 's';
    c.appendChild(d);
    setTimeout(() => d.remove(), 4500);
  }
}

let current = 'home';
function show(id) {
  current = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}
function goHome() {
  stopRace();
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('result').classList.add('hidden');
  renderHome();
  show('home');
}
document.querySelectorAll('[data-back]').forEach(b => (b.onclick = goHome));

function awardSticker() {
  const missing = STICKERS.filter(s => !save.stickers.includes(s));
  if (!missing.length) return null;
  const s = rand(missing);
  save.stickers.push(s);
  save.lastSticker = s;
  return s;
}

function addMistake(kind, key, data) {
  const m = save.mistakes[kind];
  m[key] = Object.assign(m[key] || { n: 0 }, data);
  m[key].n++;
}
function clearMistake(kind, key) {
  const m = save.mistakes[kind];
  if (!m[key]) return;
  if (--m[key].n <= 0) delete m[key];
}

// ================= INÍCIO =================
function renderHome() {
  $('nameInput').value = save.name;
  $('greeting').textContent = save.name ? `Oi, ${save.name}! Bora fazer a lição brincando? ✏️` : 'Vamos deixar a lição de casa divertida!';
  const s = save.stats;
  $('homePills').innerHTML = `
    <span class="pill">⭐ ${save.stars} estrelas</span>
    <span class="pill">🏁 ${s.wins} corridas vencidas</span>
    <span class="pill">🐝 ${s.wordsOk} palavras certas</span>
    <span class="pill">📔 ${save.stickers.length}/${STICKERS.length} figurinhas</span>`;
  const nm = Object.keys(save.mistakes.math).length, ns = Object.keys(save.mistakes.spell).length;
  $('reviewDesc').textContent = nm + ns ? `${nm} conta${nm === 1 ? '' : 's'} e ${ns} palavra${ns === 1 ? '' : 's'} para treinar.` : 'Nenhum erro para treinar. Uau! 🎉';
  $('albumDesc').textContent = `${save.stickers.length} de ${STICKERS.length} figurinhas. Ganhe mais indo bem!`;
  $('soundBtn').classList.toggle('off', !save.sound);
}
$('nameInput').oninput = e => { save.name = e.target.value.trim(); persist(); $('greeting').textContent = save.name ? `Oi, ${save.name}! Bora fazer a lição brincando? ✏️` : 'Vamos deixar a lição de casa divertida!'; };
$('soundBtn').onclick = () => { save.sound = !save.sound; persist(); renderHome(); };
$('goRace').onclick = () => { renderRaceSetup(); show('raceSetup'); };
$('goSpell').onclick = () => { renderSpellSetup(); show('spellSetup'); };
$('goAlbum').onclick = () => { renderAlbum(); show('album'); };
$('goParents').onclick = () => { renderParents(); show('parents'); };
$('goReview').onclick = () => {
  const nm = Object.keys(save.mistakes.math).length, ns = Object.keys(save.mistakes.spell).length;
  if (!nm && !ns) { sBad(); speak('Você não tem erros para treinar. Parabéns!'); return; }
  if (nm && !ns) return startRace(true);
  if (ns && !nm) return startSpell(true);
  choose('O que você quer treinar?', [['🏎️ Contas', () => startRace(true)], ['🐝 Palavras', () => startSpell(true)]]);
};

function choose(title, options) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="card"><h2>${title}</h2><div class="btns"></div></div>`;
  const btns = ov.querySelector('.btns');
  options.forEach(([label, fn]) => {
    const b = document.createElement('button');
    b.className = 'big-btn';
    b.textContent = label;
    b.onclick = () => { ov.remove(); fn(); };
    btns.appendChild(b);
  });
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  document.body.appendChild(ov);
}

// ================= CONFIG CORRIDA =================
function chip(label, on, onclick, cls = '') {
  const b = document.createElement('button');
  b.className = 'chip ' + cls + (on ? ' on' : '');
  b.innerHTML = label;
  b.onclick = () => { sTap(); onclick(); };
  return b;
}
function toggleIn(arr, v) {
  const i = arr.indexOf(v);
  if (i >= 0) { if (arr.length > 1) arr.splice(i, 1); } else arr.push(v);
}

function renderRaceSetup() {
  const c = save.raceCfg;
  const opNames = { '×': '× vezes', '÷': '÷ dividir', '+': '+ mais', '−': '− menos' };
  const opChips = $('opChips'); opChips.innerHTML = '';
  OPS.forEach(op => opChips.appendChild(chip(opNames[op], c.ops.includes(op), () => { toggleIn(c.ops, op); persist(); renderRaceSetup(); })));
  const tc = $('tableChips'); tc.innerHTML = '';
  for (let t = 1; t <= 10; t++) tc.appendChild(chip(t, c.tables.includes(t), () => { toggleIn(c.tables, t); persist(); renderRaceSetup(); }, 'num'));
  $('allTables').onclick = () => { c.tables = c.tables.length === 10 ? [2] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; persist(); renderRaceSetup(); };
  const rc = $('rangeChips'); rc.innerHTML = '';
  RANGES.forEach(r => rc.appendChild(chip(r, c.range === r, () => { c.range = r; persist(); renderRaceSetup(); }, 'num')));
  const lc = $('lenChips'); lc.innerHTML = '';
  LENGTHS.forEach(l => lc.appendChild(chip(`${l} contas`, c.len === l, () => { c.len = l; persist(); renderRaceSetup(); })));
  $('tablesBox').classList.toggle('hidden', !c.ops.some(o => o === '×' || o === '÷'));
  $('rangeBox').classList.toggle('hidden', !c.ops.some(o => o === '+' || o === '−'));
  const rv = $('rivalChips'); rv.innerHTML = '';
  RIVALS.forEach(r => {
    const b = document.createElement('button');
    b.className = 'rival' + (c.rival === r.id ? ' on' : '');
    b.innerHTML = `<span class="e">${r.e}</span><b>${r.name}</b><small>${r.sub} · ${r.sec}s por conta</small>`;
    b.onclick = () => { sTap(); c.rival = r.id; persist(); renderRaceSetup(); };
    rv.appendChild(b);
  });
}
$('startRace').onclick = () => startRace(false);

// ================= CORRIDA =================
const R = { state: 'off', raf: 0, timers: [] };

function makeQuestion(cfg) {
  const op = rand(cfg.ops);
  if (op === '×') {
    const t = rand(cfg.tables), b = randInt(1, 10);
    return Math.random() < 0.5 ? { q: `${t} × ${b}`, a: t * b, op } : { q: `${b} × ${t}`, a: t * b, op };
  }
  if (op === '÷') {
    const t = rand(cfg.tables), c = randInt(1, 10);
    return { q: `${t * c} ÷ ${t}`, a: c, op };
  }
  const N = cfg.range;
  if (op === '+') { const a = randInt(1, N - 1), b = randInt(1, N - a); return { q: `${a} + ${b}`, a: a + b, op }; }
  const a = randInt(2, N), b = randInt(1, a);
  return { q: `${a} − ${b}`, a: a - b, op };
}

function startRace(review) {
  stopRace();
  const cfg = save.raceCfg;
  const pool = review ? Object.values(save.mistakes.math) : null;
  const rival = review ? RIVALS[0] : RIVALS.find(r => r.id === cfg.rival);
  Object.assign(R, {
    review, pool, rival, len: review ? Math.min(10, Math.max(5, pool.length * 2)) : cfg.len,
    correct: 0, answered: 0, wrong: [], streak: 0, input: '', q: null, last: '', retry: [],
    times: [], qStart: 0, rivalStart: 0, state: 'countdown', earned: 0,
  });
  $('result').classList.add('hidden');
  show('race');
  $('playerLabel').textContent = save.name || 'Você';
  $('rivalLabel').textContent = rival.name;
  const re = $('rivalEmoji');
  re.textContent = rival.e;
  re.className = rival.id === 'rocket' ? '' : 'flip';
  re.style.transform = rival.id === 'rocket' ? 'rotate(45deg)' : '';
  $('raceStars').textContent = '0';
  $('turbo').classList.add('hidden');
  setRacer('playerRacer', 0);
  setRacer('rivalRacer', 0);
  $('question').innerHTML = 'Prepare-se... <span class="answer" id="answer">?</span>';
  $('raceFeedback').textContent = review ? '🔁 Treino dos erros — sem pressa!' : '';
  renderNumpad();
  const cd = $('countdown');
  cd.classList.remove('hidden');
  let n = 3;
  const step = () => {
    if (R.state !== 'countdown') return;
    cd.textContent = n > 0 ? n : 'JÁ!';
    cd.style.animation = 'none'; void cd.offsetWidth; cd.style.animation = '';
    sBeep(n === 0);
    if (n === 0) {
      R.timers.push(setTimeout(() => { cd.classList.add('hidden'); }, 500));
      R.state = 'play';
      R.rivalStart = performance.now();
      nextQuestion();
      R.raf = requestAnimationFrame(raceLoop);
      return;
    }
    n--;
    R.timers.push(setTimeout(step, 800));
  };
  step();
}

function stopRace() {
  R.state = 'off';
  cancelAnimationFrame(R.raf);
  (R.timers || []).forEach(clearTimeout);
  R.timers = [];
}

function setRacer(id, p) {
  $(id).style.left = `calc((100% - 120px) * ${Math.min(1, p)})`;
}

function nextQuestion() {
  let q;
  R.retry.forEach(r => r.due--);
  const due = R.retry.findIndex(r => r.due <= 0);
  if (due >= 0) q = R.retry.splice(due, 1)[0].q;
  else if (R.pool) {
    const opts = R.pool.filter(p => p.q !== R.last);
    q = rand(opts.length ? opts : R.pool);
  } else {
    // 25% das vezes, traz de volta uma conta que errou antes (se combinar com a config)
    const old = Object.values(save.mistakes.math).filter(m => save.raceCfg.ops.includes(m.op) && m.q !== R.last);
    if (old.length && Math.random() < 0.25) q = rand(old);
    else { do { q = makeQuestion(save.raceCfg); } while (q.q === R.last); }
  }
  R.q = { q: q.q, a: q.a, op: q.op };
  R.last = q.q;
  R.input = '';
  R.qStart = performance.now();
  $('question').innerHTML = `${q.q} = <span class="answer" id="answer">?</span>`;
}

function renderAnswer() {
  const a = $('answer');
  a.textContent = R.input || '?';
  a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop');
}

function renderNumpad() {
  const np = $('numpad');
  np.innerHTML = '';
  ['1', '2', '3', '4', '5', '⌫', '6', '7', '8', '9', '0', '✔'].forEach(k => {
    const b = document.createElement('button');
    b.textContent = k;
    if (k === '✔') b.className = 'ok-key';
    if (k === '⌫') b.className = 'del-key';
    b.dataset.k = k;
    b.onclick = () => pressKey(k === '⌫' ? 'Backspace' : k === '✔' ? 'Enter' : k);
    np.appendChild(b);
  });
}

function pressKey(k) {
  if (R.state !== 'play') return;
  const btn = document.querySelector(`#numpad [data-k="${k === 'Backspace' ? '⌫' : k === 'Enter' ? '✔' : k}"]`);
  if (btn) { btn.classList.add('pressed'); setTimeout(() => btn.classList.remove('pressed'), 120); }
  if (/^[0-9]$/.test(k)) { if (R.input.length < 4) { R.input += k; sTap(); renderAnswer(); } }
  else if (k === 'Backspace') { R.input = R.input.slice(0, -1); renderAnswer(); }
  else if (k === 'Enter' && R.input) submitAnswer();
}

function submitAnswer() {
  const q = R.q;
  const ok = Number(R.input) === q.a;
  const key = q.q;
  R.answered++;
  save.stats.answers++;
  if (ok) {
    R.correct++;
    R.streak++;
    save.stats.answersOk++;
    R.times.push((performance.now() - R.qStart) / 1000);
    R.earned += R.streak >= 3 ? 2 : 1;
    $('raceStars').textContent = R.earned;
    clearMistake('math', key);
    sOk();
    $('raceFeedback').className = 'feedback ok';
    $('raceFeedback').textContent = R.streak >= 3 ? `🔥 Turbo! ${R.streak} seguidas!` : rand(PRAISE);
    $('turbo').classList.toggle('hidden', R.streak < 3);
    setRacer('playerRacer', R.correct / R.len);
    if (R.correct >= R.len) return finishRace(true);
    nextQuestion();
  } else {
    R.streak = 0;
    R.wrong.push(`${q.q} = ${q.a}`);
    addMistake('math', key, { q: q.q, a: q.a, op: q.op });
    R.retry.push({ q, due: 3 });
    sBad();
    $('turbo').classList.add('hidden');
    $('raceFeedback').className = 'feedback bad';
    $('raceFeedback').textContent = `Ops! ${q.q} = ${q.a}`;
    $('question').classList.add('shake');
    $('playerRacer').classList.add('spin');
    R.state = 'wait';
    R.timers.push(setTimeout(() => {
      $('question').classList.remove('shake');
      $('playerRacer').classList.remove('spin');
      if (R.state !== 'wait') return;
      R.state = 'play';
      nextQuestion();
    }, 1500));
  }
  persist();
}

function raceLoop(now) {
  if (R.state !== 'play' && R.state !== 'wait') return;
  const p = (now - R.rivalStart) / (R.rival.sec * R.len * 1000);
  setRacer('rivalRacer', p);
  if (p >= 1) return finishRace(false);
  R.raf = requestAnimationFrame(raceLoop);
}

function finishRace(won) {
  stopRace();
  R.state = 'done';
  save.stats.races++;
  if (won) save.stats.wins++;
  const acc = R.correct / Math.max(1, R.answered);
  const stars = !won ? 0 : acc >= 0.99 ? 3 : acc >= 0.8 ? 2 : 1;
  save.stars += R.earned + stars;
  const sticker = won ? awardSticker() : null;
  persist();
  const avg = R.times.length ? (R.times.reduce((a, b) => a + b, 0) / R.times.length).toFixed(1) : '-';
  const best = R.times.length ? Math.min(...R.times).toFixed(1) : '-';
  showResult({
    emoji: won ? '🏆' : R.rival.e,
    title: won ? `${save.name ? save.name + ', você' : 'Você'} venceu!` : `Quase! ${R.article(R.rival)} ganhou desta vez.`,
    stars: won ? stars : null,
    stats: [[`${R.correct}/${R.answered}`, 'acertos'], [`${Math.round(acc * 100)}%`, 'precisão'], [`${avg}s`, 'média por conta'], [`${best}s`, 'mais rápida']],
    sticker,
    missed: R.wrong.length ? `Para treinar: <b>${[...new Set(R.wrong)].join(' · ')}</b>` : (won ? 'Nenhum erro! Perfeito! 🌟' : 'Tente de novo — ou escolha um rival mais devagar! 🐢'),
    again: () => startRace(R.review),
  });
  if (won) { sWin(); confetti(150); speak(save.name ? `Parabéns, ${save.name}! Você venceu!` : 'Parabéns! Você venceu!'); }
  else { sLose(); speak('Quase! Vamos tentar de novo?'); }
}
R.article = r => (r.id === 'rabbit' || r.id === 'cheetah' || r.id === 'rocket' ? 'O ' : 'A ') + r.name;

// ================= CONFIG SOLETRANDO =================
function customList() {
  return save.customWords.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const parts = l.split(/\s+/);
    let emoji = '';
    if (parts.length > 1 && !/\p{L}/u.test(parts[parts.length - 1])) emoji = parts.pop();
    const word = parts.join(' ');
    return { word, syl: word, emoji };
  });
}

function renderSpellSetup() {
  const c = save.spellCfg;
  const lc = $('langChips'); lc.innerHTML = '';
  [['pt', '🇧🇷 Português'], ['en', '🇺🇸 English']].forEach(([id, label]) =>
    lc.appendChild(chip(label, c.lang === id, () => { c.lang = id; persist(); renderSpellSetup(); })));
  const hasCustom = customList().length > 0;
  if (c.level === 'escola' && !hasCustom) c.level = 'facil';
  const sc = $('spellLevelChips'); sc.innerHTML = '';
  LEVELS_SPELL.forEach(l => {
    if (l.id === 'escola' && !hasCustom) return;
    sc.appendChild(chip(l.label, c.level === l.id, () => { c.level = l.id; persist(); renderSpellSetup(); }));
  });
  $('customNote').textContent = hasCustom ? `A lista da escola tem ${customList().length} palavras.` : 'Dica: na Área dos pais dá para cadastrar a lista de palavras da professora!';
}
$('startSpell').onclick = () => startSpell(false);

// ================= SOLETRANDO =================
const S = {};

function startSpell(review) {
  const c = save.spellCfg;
  let list, lang = c.lang;
  if (review) {
    list = Object.values(save.mistakes.spell).map(m => ({ word: m.word, syl: m.syl, emoji: m.emoji, lang: m.lang }));
  } else if (c.level === 'escola') {
    list = customList().map(w => ({ ...w, lang }));
  } else {
    list = parseWords(WORDS[lang][c.level]).map(w => ({ ...w, lang }));
  }
  list = shuffle(list).slice(0, 10);
  Object.assign(S, { review, list, i: 0, ok: 0, score: 0, hints: 0, phase: 'answer', missed: [], firstTry: true });
  $('result').classList.add('hidden');
  $('spellTitle').textContent = review ? '🔁 Treino das palavras' : `🐝 Soletrando · ${LEVELS_SPELL.find(l => l.id === c.level).label}`;
  $('spellScore').textContent = '0';
  show('spell');
  showWord();
}

const langCode = w => (w.lang === 'en' ? 'en-US' : 'pt-BR');
const sayCurrent = (slow) => {
  const w = S.list[S.i];
  if (slow) {
    if (w.lang === 'pt' && w.syl.includes('·')) speak(w.syl.split('·').join('... '), 'pt-BR', 0.55);
    else speak(w.word, langCode(w), 0.45);
  } else speak(w.word, langCode(w), 0.85);
};

function showWord() {
  const w = S.list[S.i];
  S.hints = 0; S.phase = 'answer'; S.firstTry = true; S.hinted = 0;
  const pic = $('wordPic');
  pic.textContent = w.emoji || '✏️';
  $('spellInput').value = '';
  $('spellInput').maxLength = w.word.length + 3;
  $('spellFeedback').textContent = '';
  $('spellFeedback').className = 'feedback';
  $('checkWord').textContent = '✔ Conferir';
  renderDots();
  renderSlots();
  setTimeout(() => $('spellInput').focus(), 50);
  setTimeout(() => sayCurrent(false), 350);
}

function renderDots() {
  const d = $('spellDots');
  d.innerHTML = S.list.map((_, i) => `<div class="dot ${i < S.i ? (S.results?.[i] ? 'ok' : 'bad') : i === S.i ? 'cur' : ''}"></div>`).join('');
}

function renderSlots(mark) {
  const w = S.list[S.i].word;
  const val = $('spellInput').value;
  const n = Math.max(w.length, val.length);
  let html = '';
  for (let i = 0; i < n; i++) {
    const ch = val[i] || '';
    let cls = 'slot';
    if (ch) cls += ' filled';
    if (i === val.length && S.phase !== 'done') cls += ' cursor';
    if (i >= w.length) cls += ' extra';
    if (i < S.hinted) cls += ' hinted';
    if (mark) cls += ch && norm(ch) === norm(w[i] || '') ? ' right' : ' wrong';
    if (w[i] === ' ' && !ch) { html += `<div class="slot" style="border:0;box-shadow:none;width:20px"></div>`; continue; }
    html += `<div class="${cls}">${ch === ' ' ? '&nbsp;' : ch}</div>`;
  }
  $('slots').innerHTML = html;
}

$('spellInput').addEventListener('input', () => { if (S.phase !== 'done') { sTap(); renderSlots(); } });
$('spellInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); checkWord(); } });
$('slotsWrap').onclick = () => $('spellInput').focus();
$('checkWord').onclick = () => checkWord();
$('sayWord').onclick = () => { sayCurrent(false); $('spellInput').focus(); };
$('saySlow').onclick = () => { sayCurrent(true); $('spellInput').focus(); };
$('hintBtn').onclick = () => {
  if (S.phase !== 'answer') return;
  const w = S.list[S.i].word;
  const val = $('spellInput').value;
  let k = 0;
  while (k < val.length && k < w.length && norm(val[k]) === norm(w[k])) k++;
  if (k >= w.length - 1) { $('spellFeedback').textContent = 'Você já está quase lá! 😉'; return; }
  $('spellInput').value = w.slice(0, k + 1);
  S.hinted = k + 1;
  S.hints++;
  tone(900, 0.1, 'sine');
  renderSlots();
  $('spellInput').focus();
};

function checkWord() {
  const w = S.list[S.i];
  const val = $('spellInput').value;
  if (S.phase === 'done') return;
  if (!val.trim()) { $('spellFeedback').textContent = 'Escreva a palavra primeiro ✏️'; return; }
  const right = norm(val) === norm(w.word);
  const key = `${w.lang}|${w.word}`;
  const fb = $('spellFeedback');

  if (S.phase === 'retype') {
    if (right) { sOk(); fb.className = 'feedback ok'; fb.textContent = 'Agora sim! 👏'; S.phase = 'done'; renderSlots(true); setTimeout(nextWord, 1100); }
    else { sBad(); renderSlots(true); $('slots').classList.add('shake'); setTimeout(() => $('slots').classList.remove('shake'), 400); fb.className = 'feedback bad'; fb.innerHTML = `Quase... copie: <span class="correct-word">${w.word}</span>`; }
    return;
  }

  save.stats.words++;
  S.results = S.results || [];
  if (right) {
    S.phase = 'done';
    S.ok++;
    S.results[S.i] = true;
    save.stats.wordsOk++;
    const pts = Math.max(4, 10 - 3 * S.hints);
    S.score += pts;
    $('spellScore').textContent = S.score;
    clearMistake('spell', key);
    sOk();
    renderSlots(true);
    fb.className = 'feedback ok';
    fb.innerHTML = `${rand(PRAISE)} <span class="correct-word"><span class="syl">${w.syl}</span></span> +${pts}`;
    speak(w.word, langCode(w), 0.85);
    confetti(25);
    setTimeout(nextWord, 1600);
  } else {
    S.results[S.i] = false;
    S.missed.push(w.word);
    addMistake('spell', key, { word: w.word, syl: w.syl, emoji: w.emoji, lang: w.lang });
    sBad();
    renderSlots(true);
    const accentOnly = noAccent(norm(val)) === noAccent(norm(w.word));
    fb.className = 'feedback bad';
    fb.innerHTML = (accentOnly ? 'Quase! Cuidado com o acento. ' : 'Ops! O certo é: ') +
      `<span class="correct-word">${w.word}</span><br><small>Agora escreva certinho para continuar ✏️</small>`;
    speak(w.word, langCode(w), 0.7);
    S.phase = 'retype';
    S.hinted = 0;
    $('spellInput').readOnly = true;
    setTimeout(() => { $('spellInput').readOnly = false; $('spellInput').value = ''; renderSlots(); $('spellInput').focus(); }, 1800);
  }
  persist();
}

function nextWord() {
  S.i++;
  if (S.i >= S.list.length) return finishSpell();
  showWord();
}

function finishSpell() {
  const total = S.list.length;
  const pct = S.ok / total;
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
  save.stars += stars + Math.round(S.score / 10);
  const sticker = pct >= 0.7 ? awardSticker() : null;
  persist();
  renderDots();
  showResult({
    emoji: stars === 3 ? '🏆' : stars === 2 ? '🐝' : '💪',
    title: stars === 3 ? 'Show de soletração!' : stars === 2 ? 'Muito bem!' : 'Bom treino!',
    stars,
    stats: [[`${S.ok}/${total}`, 'palavras certas'], [S.score, 'pontos']],
    sticker,
    missed: S.missed.length ? `Para treinar: <b>${S.missed.join(' · ')}</b>` : 'Acertou todas! 🌟',
    again: () => startSpell(S.review),
  });
  sWin();
  confetti(stars * 50);
  speak(stars === 3 ? 'Parabéns! Você acertou quase tudo!' : 'Muito bem! Continue treinando!');
}

// ================= RESULTADO =================
function showResult({ emoji, title, stars, stats, sticker, missed, again }) {
  document.activeElement?.blur();
  $('resultEmoji').textContent = emoji;
  $('resultTitle').textContent = title;
  $('resultStars').innerHTML = stars == null ? '' : [0, 1, 2].map(i => `<span class="${i < stars ? '' : 'empty'}" style="animation-delay:${i * 0.2}s">⭐</span>`).join('');
  $('resultStats').innerHTML = stats.map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join('');
  const sw = $('stickerWon');
  if (sticker) { sw.classList.remove('hidden'); sw.innerHTML = `Nova figurinha para o álbum!<span class="big">${sticker}</span>`; }
  else sw.classList.add('hidden');
  $('resultMissed').innerHTML = missed;
  $('playAgain').onclick = () => { $('result').classList.add('hidden'); again(); };
  $('result').classList.remove('hidden');
}
$('resultHome').onclick = goHome;

// ================= ÁLBUM =================
function renderAlbum() {
  $('albumCount').textContent = save.stickers.length === STICKERS.length
    ? 'ÁLBUM COMPLETO! Você é incrível! 🏆'
    : `Você tem ${save.stickers.length} de ${STICKERS.length} figurinhas. Vença corridas e acerte palavras para ganhar mais!`;
  $('albumGrid').innerHTML = STICKERS.map((s, i) => {
    const got = save.stickers.includes(s);
    return `<div class="sticker ${got ? 'got' : ''} ${s === save.lastSticker ? 'new' : ''}" style="--r:${(i % 5 - 2) * 2}deg">
      ${got ? s : `<span class="locked">${s}</span>`}</div>`;
  }).join('');
  save.lastSticker = null;
  persist();
}

// ================= PAIS =================
function renderParents() {
  $('customWords').value = save.customWords;
  $('savedMsg').textContent = '';
  const math = Object.values(save.mistakes.math).sort((a, b) => b.n - a.n);
  const spell = Object.values(save.mistakes.spell).sort((a, b) => b.n - a.n);
  $('mistakesList').innerHTML =
    (math.length ? '<p class="hand">Contas:</p>' + math.map(m => `<span class="mistake">${m.q} = ${m.a} <small>×${m.n}</small></span>`).join('') : '') +
    (spell.length ? '<p class="hand">Palavras:</p>' + spell.map(m => `<span class="mistake">${m.emoji || ''} ${m.word} <small>×${m.n}</small></span>`).join('') : '') +
    (!math.length && !spell.length ? '<p class="hand">Nada por aqui ainda. 🎉</p>' : '');
  const s = save.stats;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) + '%' : '-');
  $('summary').innerHTML = `<div class="stats">
    <div><b>${s.races}</b>corridas</div><div><b>${s.wins}</b>vitórias</div>
    <div><b>${pct(s.answersOk, s.answers)}</b>contas certas</div>
    <div><b>${s.words}</b>palavras</div><div><b>${pct(s.wordsOk, s.words)}</b>palavras certas</div></div>`;
}
$('saveWords').onclick = () => {
  save.customWords = $('customWords').value;
  persist();
  $('savedMsg').textContent = `Salvo! ${customList().length} palavras ✔`;
};
$('resetAll').onclick = () => {
  if (!confirm('Apagar todo o progresso (estrelas, figurinhas e erros)?')) return;
  const keep = { name: save.name, customWords: save.customWords };
  save = Object.assign(structuredClone(DEFAULT), keep);
  persist();
  goHome();
};

// ================= TECLADO =================
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey) return;
  if (current === 'race') {
    if (e.key === 'Escape') return goHome();
    if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') { e.preventDefault(); pressKey(e.key); }
  }
  if (!$('result').classList.contains('hidden') && e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
    e.preventDefault(); $('playAgain').click();
  }
});

renderHome();
// atalhos para testar: #corrida, #soletrando, #album, #pais
({ '#corrida': () => startRace(false), '#soletrando': () => startSpell(false), '#album': () => { renderAlbum(); show('album'); }, '#pais': () => { renderParents(); show('parents'); }, '#config': () => { renderRaceSetup(); show('raceSetup'); } })[location.hash]?.();
