/* navajo-srs-en.js — SRS flashcard data: Navajo (Diné bizaad) for English speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 high-frequency Navajo words and key cultural concepts.
   Navajo uses a Latin-based orthography with tone marks, nasalization, and special characters.
   Front: Navajo | Back: English meaning + pronunciation guide
*/
(function () {
  'use strict';

  const PAIR = 'nv-en';
  const WORDS = [
    /* ── Greetings & core phrases ───────────────────────────── */
    ["yáʼátʼééh",          "Hello / It is good — the all-purpose greeting (yah-AH-tay)"],
    ["ahéheeʼ",            "Thank you"],
    ["hágoóneeʼ",          "Goodbye (informal)"],
    ["yáʼátʼééh abíní",    "Good morning"],
    ["yáʼátʼééh ałníʼníʼą́", "Good afternoon"],
    /* ── Essential concepts ─────────────────────────────────── */
    ["hózhó",              "Beauty / harmony / balance — the central concept of Navajo philosophy"],
    ["Diné",               "The People — how Navajo people refer to themselves"],
    ["bizaad",             "Language / speech (Diné bizaad = the Navajo language)"],
    ["hózhóogo",           "In a beautiful / harmonious way (adverbial form of hózhó)"],
    ["nizhóní",            "Beautiful / it is good-looking"],
    /* ── People & pronouns ──────────────────────────────────── */
    ["shí",                "I / me (first person singular)"],
    ["nihí",               "We / us (first person plural)"],
    ["bilagáana",          "Anglo / white person — from Spanish 'Americano'"],
    ["hastiin",            "Man / Mr. (respected form of address)"],
    ["asdzáá",             "Woman"],
    /* ── Nature & landscape ─────────────────────────────────── */
    ["tó",                 "Water — high tone on the ó is essential"],
    ["tsékooh",            "Canyon"],
    ["dziłíjiin",          "Black Mountain (type of place name)"],
    ["nahasdzáán",         "Earth / ground / the land"],
    ["yádiłhił",           "Sky / the blue above"],
    /* ── Numbers ────────────────────────────────────────────── */
    ["tʼááłáʼí",           "One"],
    ["naaki",              "Two"],
    ["tááʼ",               "Three"],
    ["dį́į́ʼ",              "Four"],
    ["ashdlaʼ",            "Five"],
    /* ── Common words ───────────────────────────────────────── */
    ["ayóó",               "Very / a lot / extremely"],
    ["tʼáá",               "Just / simply / right (emphatic particle)"],
    ["doo … da",           "Not … (negation — the negative wraps the predicate)"],
    ["háadi",              "Where"],
    ["haʼátʼíí",           "What"],
    /* ── Verbs (in conjugated form) ─────────────────────────── */
    ["yishááł",            "I am walking (going on foot, away from speaker)"],
    ["yiníshta",           "I am reading / I am studying"],
    ["naashnish",          "I am working"],
    ["hólǫ́",              "There is / it exists (existential)"],
    ["doo hólǫ́ da",        "There is not / it does not exist"],
    /* ── Sounds to recognize ────────────────────────────────── */
    ["łi",                 "ł = voiceless lateral fricative, like Welsh 'll' — a key Navajo sound"],
    ["ʼ",                  "The apostrophe marks a glottal stop — a real consonant in Navajo"],
    ["á vs a",             "Accent mark = high tone — tó (water) vs to (a different word entirely)"],
    ["ą",                  "Ogonek = nasalized vowel — tą́ means something different from ta"],
    ["tłʼ",                "Ejective lateral affricate — one of Navajo's most challenging sounds"],
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
      elInfo.textContent = 'All done for today!';
      return;
    }
    current = queue.shift();
    const [front, back] = WORDS[current];
    elFront.textContent = front; elBack.textContent = back;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' cards';
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
