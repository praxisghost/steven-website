/* cherokee-srs-en.js — SRS flashcard data: Cherokee (ᏣᎳᎩ) for English speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: Cherokee syllabary characters (reading practice) + essential vocabulary.
   Front: Cherokee syllabary | Back: pronunciation guide + English meaning
*/
(function () {
  'use strict';

  const PAIR = 'chr-en';
  const WORDS = [
    /* ── Vowels (pure vowel syllables) ─────────────────────── */
    ['Ꭰ',              'a  — like "a" in father'],
    ['Ꭱ',              'e  — like "a" in day'],
    ['Ꭲ',              'i  — like "ee" in see'],
    ['Ꭳ',              'o  — like "o" in go'],
    ['Ꭴ',              'u  — like "oo" in moon'],
    ['Ꭵ',              'v  — nasalized "uh" — unique to Cherokee, no English equivalent'],
    /* ── G / Ka row ────────────────────────────────────────── */
    ['Ꭶ',              'ga'],
    ['Ꭷ',              'ka  (aspirated — like "c" in car)'],
    ['Ꭸ',              'ge'],
    ['Ꭹ',              'gi'],
    ['Ꭺ',              'go'],
    ['Ꭻ',              'gu'],
    ['Ꭼ',              'gv  (g + nasalized vowel)'],
    /* ── H row ─────────────────────────────────────────────── */
    ['Ꭽ',              'ha'],
    ['Ꭾ',              'he'],
    ['Ꭿ',              'hi'],
    ['Ꮀ',              'ho'],
    /* ── L row ─────────────────────────────────────────────── */
    ['Ꮃ',              'la'],
    ['Ꮄ',              'le'],
    ['Ꮅ',              'li'],
    ['Ꮆ',              'lo'],
    /* ── N row ─────────────────────────────────────────────── */
    ['Ꮎ',              'na'],
    ['Ꮑ',              'ne'],
    ['Ꮒ',              'ni'],
    ['Ꮓ',              'no'],
    /* ── Tsa row ───────────────────────────────────────────── */
    ['Ꮳ',              'tsa'],
    ['Ꮵ',              'tsi'],
    ['Ꮶ',              'tso'],
    /* ── W row ─────────────────────────────────────────────── */
    ['Ꮹ',              'wa'],
    ['Ꮻ',              'wi'],
    /* ── Y row ─────────────────────────────────────────────── */
    ['Ꮿ',              'ya'],
    ['Ᏹ',              'yi'],
    /* ── Essential vocabulary ──────────────────────────────── */
    ['ᎣᏏᏲ',           'osiyo — Hello (standard formal greeting)'],
    ['ᏩᏙ',            'wado — Thank you'],
    ['ᎣᏍᏓ',           'osda — Good / well'],
    ['ᏣᎳᎩ',           'Tsalagi — Cherokee (the language and the people)'],
    ['ᎠᎹ',            'ama — Water'],
    ['ᎠᎴ',            'ale — And / also'],
    ['ᏙᎯ',            'dohi — Peace / wellness'],
    ['ᎤᏍᏗ',           'usdi — Small / little / young'],
  ];

  /* ── SM-2 helpers ──────────────────────────────────────── */
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

  /* ── DOM refs ──────────────────────────────────────────── */
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

  let state   = loadState();
  let queue   = [];
  let current = null;

  function buildQueue() {
    const due = getDue(state);
    queue = due.map((w) => WORDS.indexOf(w)).sort(() => Math.random() - 0.5);
  }
  function updateBar() {
    const done = WORDS.length - getDue(state).length;
    const pct  = WORDS.length ? (done / WORDS.length) * 100 : 100;
    if (elBar) elBar.style.width = pct + '%';
  }
  function showCard() {
    if (queue.length === 0) {
      elCard.style.display     = 'none';
      elFlip.style.display     = 'none';
      elControls.style.display = 'none';
      elDone.style.display     = 'block';
      elInfo.textContent       = 'All done for today!';
      return;
    }
    current = queue.shift();
    const [front, back] = WORDS[current];
    elFront.textContent      = front;
    elBack.textContent       = back;
    elBack.style.display     = 'none';
    elFront.style.display    = 'block';
    elControls.style.display = 'none';
    elFlip.style.display     = 'inline-block';
    elCard.style.display     = 'block';
    elDone.style.display     = 'none';
    const due = getDue(loadState());
    elInfo.textContent = (queue.length + 1) + ' / ' + due.length + ' cards';
    updateBar();
  }
  function flip() {
    elBack.style.display     = 'block';
    elFront.style.display    = 'block';
    elFlip.style.display     = 'none';
    elControls.style.display = 'flex';
  }
  elFlip.addEventListener('click', flip);
  elAgain.addEventListener('click', () => {
    state = updateCard(state, current, 1);
    saveState(state);
    queue.push(current);
    current = null;
    showCard();
  });
  elGood.addEventListener('click', () => {
    state = updateCard(state, current, 5);
    saveState(state);
    current = null;
    showCard();
  });
  if (elRestart) elRestart.addEventListener('click', () => {
    buildQueue(); elDone.style.display = 'none'; showCard();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (elFlip.style.display !== 'none') { e.preventDefault(); flip(); }
    }
    if (e.key === '1' && elControls.style.display !== 'none') {
      state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard();
    }
    if (e.key === '3' && elControls.style.display !== 'none') {
      state = updateCard(state, current, 5); saveState(state); current = null; showCard();
    }
  });

  buildQueue();
  showCard();
})();
