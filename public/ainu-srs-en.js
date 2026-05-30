/* ainu-srs-en.js — Ainu for English speakers
   SM-2 spaced-repetition. Progress stored in localStorage.
   Front: Ainu (Latin orthography) | Back: English meaning
*/
(function () {
  'use strict';
  const PAIR = 'ain-en';
  const WORDS = [
    ['irankarapte',   'hello (lit. let me gently touch your heart)'],
    ['iyairaikere',   'thank you (also: iyayiraykere)'],
    ['pirka',         'beautiful / good / fine'],
    ['pon',           'small / little'],
    ['poro',          'big / large / many'],
    ['ainu',          'person / human being'],
    ['menoko',        'woman / female'],
    ['okkayo',        'man / male'],
    ['pon ainu',      'child (lit. small person)'],
    ['ekasi',         'grandfather / elder / respected old man'],
    ['wakka',         'water'],
    ['abe',           'fire'],
    ['kim',           'mountain / highland / forest'],
    ['pet',           'river (many Hokkaido place names contain -pet)'],
    ['mosir',         'land / country / world (Ainu mosir = land of the Ainu)'],
    ['nupuri',        'mountain (solitary peak; cf. Noboribetsu)'],
    ['kamuy',         'god / spirit / divine being'],
    ['kotan',         'village / settlement / home place'],
    ['chise',         'house / home'],
    ['cikap',         'bird'],
    ['kimun kamuy',   'bear (lit. mountain god)'],
    ['repun kamuy',   'killer whale (lit. offshore god)'],
    ['ku',            'I / me'],
    ['eani',          'you (singular)'],
    ['a=',            'I (subject prefix in verbs)'],
    ['e=',            'you (subject prefix)'],
    ['ene … an',      'like this / in this way'],
    ['iyoiraykere',   'I\'m sorry / excuse me'],
    ['hunna',         'who?'],
    ['nep',           'what?'],
    ['hemanta',       'how? / what kind of?'],
    ['hempak',        'how many?'],
    ['ipe',           'to eat / food'],
    ['ekari',         'to walk / to travel'],
    ['ye',            'to say / to speak'],
    ['arki',          'to come'],
    ['paye',          'to go'],
    ['kor',           'to have / to hold / to possess'],
    ['eyay',          'self / oneself'],
    ['nea',           'that / those (over there)'],
  ];

  /* ── frequency table ── */
  (function () {
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    WORDS.forEach(function (w, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + w[0].replace(/</g,'&lt;') + '</td><td>' + w[1].replace(/</g,'&lt;') + '</td>';
      tbody.appendChild(tr);
    });
  })();

  /* ── SRS engine ── */
  function loadState() { try { return JSON.parse(localStorage.getItem('srs_' + PAIR)) || {}; } catch (e) { return {}; } }
  function saveState(s) { try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {} }
  function today() { return Math.floor(Date.now() / 86400000); }
  function getDue(state) { const t = today(); return WORDS.filter((_, i) => { const c = state[i]; return !c || c.nextDay <= t; }); }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
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

  const elInfo = document.getElementById('srs-info'), elCard = document.getElementById('srs-card'),
        elFront = document.getElementById('srs-front'), elBack = document.getElementById('srs-back'),
        elControls = document.getElementById('srs-controls'), elFlip = document.getElementById('srs-flip'),
        elAgain = document.getElementById('srs-again'), elGood = document.getElementById('srs-good'),
        elDone = document.getElementById('srs-done'), elRestart = document.getElementById('srs-restart'),
        elBar = document.getElementById('srs-bar');
  if (!elInfo) return;

  let state = loadState(), queue = [], current = null;
  function buildQueue() { queue = getDue(state).map((w) => WORDS.indexOf(w)).sort(() => Math.random() - 0.5); }
  function updateBar() { if (elBar) elBar.style.width = (WORDS.length ? ((WORDS.length - getDue(state).length) / WORDS.length) * 100 : 100) + '%'; }
  function showCard() {
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = 'Done for today!'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length;
    updateBar();
  }
  function flip() { elBack.style.display = elFront.style.display = 'block'; elFlip.style.display = 'none'; elControls.style.display = 'flex'; }
  elFlip.addEventListener('click', flip);
  elAgain.addEventListener('click', () => { state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard(); });
  elGood.addEventListener('click', () => { state = updateCard(state, current, 5); saveState(state); current = null; showCard(); });
  if (elRestart) elRestart.addEventListener('click', () => { buildQueue(); elDone.style.display = 'none'; showCard(); });
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && elFlip.style.display !== 'none') { e.preventDefault(); flip(); }
    if (e.key === '1' && elControls.style.display !== 'none') { state = updateCard(state, current, 1); saveState(state); queue.push(current); current = null; showCard(); }
    if (e.key === '3' && elControls.style.display !== 'none') { state = updateCard(state, current, 5); saveState(state); current = null; showCard(); }
  });
  buildQueue(); showCard();
})();
