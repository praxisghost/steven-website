/* spanish-srs-ru.js — SRS flashcard data: Spanish for Russian speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Word list: 60 high-frequency Spanish words with Russian translations.
*/
(function () {
  'use strict';

  const PAIR = 'es-ru';
  const WORDS = [
    ['hola',          'привет'],
    ['gracias',       'спасибо'],
    ['por favor',     'пожалуйста'],
    ['sí',            'да'],
    ['no',            'нет'],
    ['el agua',       'вода'],
    ['la casa',       'дом'],
    ['el libro',      'книга'],
    ['la mesa',       'стол'],
    ['el tiempo',     'время / погода'],
    ['hablar',        'говорить'],
    ['comer',         'есть (принимать пищу)'],
    ['vivir',         'жить'],
    ['querer',        'хотеть / любить'],
    ['poder',         'мочь, быть в состоянии'],
    ['saber',         'знать (факт)'],
    ['conocer',       'знать (лично), быть знакомым'],
    ['tener',         'иметь'],
    ['hacer',         'делать'],
    ['ir',            'идти / ехать'],
    ['venir',         'приходить, приезжать'],
    ['dar',           'давать'],
    ['ver',           'видеть'],
    ['decir',         'говорить, сказать'],
    ['ser',           'быть (постоянно)'],
    ['estar',         'быть (временно/состояние)'],
    ['el hombre',     'мужчина / человек'],
    ['la mujer',      'женщина'],
    ['el niño',       'ребёнок (мальчик)'],
    ['la ciudad',     'город'],
    ['el país',       'страна'],
    ['el trabajo',    'работа'],
    ['la vida',       'жизнь'],
    ['el día',        'день'],
    ['la noche',      'ночь'],
    ['el año',        'год'],
    ['grande',        'большой'],
    ['pequeño',       'маленький'],
    ['bueno',         'хороший'],
    ['malo',          'плохой'],
    ['nuevo',         'новый'],
    ['viejo',         'старый'],
    ['mucho',         'много'],
    ['poco',          'мало, немного'],
    ['bien',          'хорошо'],
    ['mal',           'плохо'],
    ['aquí',          'здесь'],
    ['allí',          'там'],
    ['ahora',         'сейчас'],
    ['hoy',           'сегодня'],
    ['mañana',        'завтра / утро'],
    ['ayer',          'вчера'],
    ['siempre',       'всегда'],
    ['nunca',         'никогда'],
    ['también',       'тоже'],
    ['pero',          'но'],
    ['porque',        'потому что'],
    ['cuando',        'когда'],
    ['como',          'как'],
    ['muy',           'очень'],
    ['ya',            'уже / сейчас (разг.)'],
  ];

  /* ── SM-2 helpers ─────────────────────────────────────── */
  function loadState() {
    try { return JSON.parse(localStorage.getItem('srs_' + PAIR) || '{}'); }
    catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {}
  }
  function today() {
    return Math.floor(Date.now() / 86400000);
  }
  function getDue(state) {
    const t = today();
    return WORDS.filter((_, i) => {
      const c = state[i];
      return !c || c.nextDay <= t;
    });
  }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) {
      c.reps = 0; c.interval = 1;
    } else {
      if (c.reps === 0) c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.ef);
      c.reps += 1;
      c.ef = Math.max(1.3, c.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    }
    c.nextDay = today() + c.interval;
    state[idx] = c;
    return state;
  }

  /* ── DOM refs ─────────────────────────────────────────── */
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

  if (!elInfo) return; /* SRS container not on this page */

  /* ── Session state ────────────────────────────────────── */
  let state   = loadState();
  let queue   = [];
  let current = null;

  function buildQueue() {
    const due = getDue(state);
    queue = due.map((w) => WORDS.indexOf(w)).sort(() => Math.random() - 0.5);
  }

  function updateBar() {
    const total  = queue.length + (current !== null ? 1 : 0);
    const done   = WORDS.length - getDue(state).length;
    const pct    = WORDS.length ? (done / WORDS.length) * 100 : 100;
    if (elBar) elBar.style.width = pct + '%';
  }

  function showCard() {
    if (queue.length === 0) {
      elCard.style.display    = 'none';
      elFlip.style.display    = 'none';
      elControls.style.display= 'none';
      elDone.style.display    = 'block';
      elInfo.textContent      = 'Готово на сегодня!';
      return;
    }
    current = queue.shift();
    const [front, back] = WORDS[current];
    elFront.textContent     = front;
    elBack.textContent      = back;
    elBack.style.display    = 'none';
    elFront.style.display   = 'block';
    elControls.style.display= 'none';
    elFlip.style.display    = 'inline-block';
    elCard.style.display    = 'block';
    elDone.style.display    = 'none';
    elInfo.textContent      = queue.length + 1 + ' / ' + (getDue(state).length + queue.length + 1 - queue.length) + ' карточек';
    updateBar();
  }

  function flip() {
    elBack.style.display    = 'block';
    elFront.style.display   = 'block';
    elFlip.style.display    = 'none';
    elControls.style.display= 'flex';
  }

  function answer(quality) {
    state = updateCard(state, current, quality);
    saveState(state);
    current = null;
    if (quality < 3) queue.push(WORDS.indexOf(WORDS[current < 0 ? 0 : current])); /* re-add for again */
    showCard();
  }

  elFlip.addEventListener('click', flip);
  elAgain.addEventListener('click', () => {
    /* re-queue current */
    state = updateCard(state, current, 1);
    saveState(state);
    queue.push(current);
    current = null;
    showCard();
  });
  elGood.addEventListener('click', () => answer(5));
  if (elRestart) elRestart.addEventListener('click', () => {
    buildQueue(); elDone.style.display = 'none'; showCard();
  });

  buildQueue();
  showCard();
})();
