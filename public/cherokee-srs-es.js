/* cherokee-srs-es.js — SRS flashcard data: Cherokee (ᏣᎳᎩ) para hispanohablantes
   Algoritmo SM-2 de repetición espaciada. Progreso guardado en localStorage.
   Tarjetas: caracteres del silabario cherokee + vocabulario esencial.
   Frente: símbolo del silabario | Reverso: pronunciación + significado en español
*/
(function () {
  'use strict';

  const PAIR = 'chr-es';
  const WORDS = [
    /* ── Vocales (sílabas vocálicas puras) ─────────────────── */
    ['Ꭰ',              'a  — como la "a" en "casa"'],
    ['Ꭱ',              'e  — como la "e" en "mesa"'],
    ['Ꭲ',              'i  — como la "i" en "vida"'],
    ['Ꭳ',              'o  — como la "o" en "noche"'],
    ['Ꭴ',              'u  — como la "u" en "luna"'],
    ['Ꭵ',              'v  — vocal "uh" nasalizada — sin equivalente en español'],
    /* ── Fila G / Ka ────────────────────────────────────────── */
    ['Ꭶ',              'ga'],
    ['Ꭷ',              'ka  (aspirada — como "c" en "casa")'],
    ['Ꭸ',              'ge'],
    ['Ꭹ',              'gi'],
    ['Ꭺ',              'go'],
    ['Ꭻ',              'gu'],
    ['Ꭼ',              'gv  (g + vocal nasalizada)'],
    /* ── Fila H ─────────────────────────────────────────────── */
    ['Ꭽ',              'ha'],
    ['Ꭾ',              'he'],
    ['Ꭿ',              'hi'],
    ['Ꮀ',              'ho'],
    /* ── Fila L ─────────────────────────────────────────────── */
    ['Ꮃ',              'la'],
    ['Ꮄ',              'le'],
    ['Ꮅ',              'li'],
    ['Ꮆ',              'lo'],
    /* ── Fila N ─────────────────────────────────────────────── */
    ['Ꮎ',              'na'],
    ['Ꮑ',              'ne'],
    ['Ꮒ',              'ni'],
    ['Ꮓ',              'no'],
    /* ── Fila Tsa ───────────────────────────────────────────── */
    ['Ꮳ',              'tsa'],
    ['Ꮵ',              'tsi'],
    ['Ꮶ',              'tso'],
    /* ── Fila W ─────────────────────────────────────────────── */
    ['Ꮹ',              'wa'],
    ['Ꮻ',              'wi'],
    /* ── Fila Y ─────────────────────────────────────────────── */
    ['Ꮿ',              'ya'],
    ['Ᏹ',              'yi'],
    /* ── Vocabulario esencial ──────────────────────────────── */
    ['ᎣᏏᏲ',           'osiyo — Hola (saludo formal estándar)'],
    ['ᏩᏙ',            'wado — Gracias'],
    ['ᎣᏍᏓ',           'osda — Bueno / bien'],
    ['ᏣᎳᎩ',           'Tsalagi — Cherokee (la lengua y el pueblo)'],
    ['ᎠᎹ',            'ama — Agua'],
    ['ᎠᎴ',            'ale — Y / también'],
    ['ᏙᎯ',            'dohi — Paz / bienestar'],
    ['ᎤᏍᏗ',           'usdi — Pequeño / joven'],
  ];

  function loadState() {
    try { return JSON.parse(localStorage.getItem('srs_' + PAIR) || '{}'); }
    catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {}
  }
  function today() { return Math.floor(Date.now() / 86400000); }
  function getDue(state) {
    const t = today();
    return WORDS.filter((_, i) => { const c = state[i]; return !c || c.nextDay <= t; });
  }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
      if (c.reps === 0)      c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else                   c.interval = Math.round(c.interval * c.ef);
      c.reps += 1;
      c.ef = Math.max(1.3, c.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    }
    c.nextDay = today() + c.interval;
    state[idx] = c;
    return state;
  }

  const elInfo     = document.getElementById('srs-info');
  const elCard     = document.getElementById('srs-card');
  const elFront    = document.getElementById('srs-front');
  const elBack     = document.getElementById('srs-back');
  const elControls = document.getElementById('srs-controls');
  const elFlip     = document.getElementById('srs-flip');
  const elAgain    = document.getElementById('srs-again');
  const elGood     = document.getElementById('srs-good');
  const elDone     = document.getElementById('srs-done');
  const elRestart  = document.getElementById('srs-restart');
  const elBar      = document.getElementById('srs-bar');

  if (!elInfo) return;

  let state = loadState(), queue = [], current = null;

  function buildQueue() {
    queue = getDue(state).map((w) => WORDS.indexOf(w)).sort(() => Math.random() - 0.5);
  }
  function updateBar() {
    const pct = WORDS.length ? ((WORDS.length - getDue(state).length) / WORDS.length) * 100 : 100;
    if (elBar) elBar.style.width = pct + '%';
  }
  function showCard() {
    if (queue.length === 0) {
      elCard.style.display = elFlip.style.display = elControls.style.display = 'none';
      elDone.style.display = 'block';
      elInfo.textContent = '¡Todo listo por hoy!';
      return;
    }
    current = queue.shift();
    const [front, back] = WORDS[current];
    elFront.textContent = front; elBack.textContent = back;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' tarjetas';
    updateBar();
  }
  function flip() {
    elBack.style.display = 'block'; elFront.style.display = 'block';
    elFlip.style.display = 'none'; elControls.style.display = 'flex';
  }
  elFlip.addEventListener('click', flip);
  elAgain.addEventListener('click', () => {
    state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard();
  });
  elGood.addEventListener('click', () => {
    state = updateCard(state, current, 5); saveState(state); current = null; showCard();
  });
  if (elRestart) elRestart.addEventListener('click', () => { buildQueue(); elDone.style.display = 'none'; showCard(); });
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && elFlip.style.display !== 'none') { e.preventDefault(); flip(); }
    if (e.key === '1' && elControls.style.display !== 'none') { state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard(); }
    if (e.key === '3' && elControls.style.display !== 'none') { state = updateCard(state, current, 5); saveState(state); current = null; showCard(); }
  });

  buildQueue(); showCard();
})();
