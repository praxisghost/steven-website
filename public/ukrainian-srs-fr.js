/* ukrainian-srs-fr.js — SRS flashcard data: Ukrainian / Ukrainien for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Ukrainian | Back: French meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'uk-fr';
  const WORDS = [
    ['привіт (pryvit)', 'salut — salutation informelle'],
    ['дякую (dyakuyu)', 'merci'],
    ['будь ласка (bud laska)', 's\'il vous plaît / de rien'],
    ['так / ні (tak / ni)', 'oui / non'],
    ['вибачте (vybachte)', 'pardon / excusez-moi'],
    ['вода (voda)', 'eau — slavon commun, cf. «vodka»'],
    ['хліб (khlib)', 'pain'],
    ['будинок (budynok)', 'immeuble / bâtiment'],
    ['я (ya)', 'je'],
    ['ти (ty)', 'tu'],
    ['він / вона (vin/vona)', 'il / elle'],
    ['ми (my)', 'nous'],
    ['іти (ity)', 'aller'],
    ['говорити (hovoryty)', 'parler'],
    ['Я читаю книгу.', 'Je lis un livre. — ordre SVO'],
    ['Я не йду.', 'Je ne pars pas. — négation «не»'],
    ['один, два, три', '1, 2, 3 (odyn, dva, try)'],
    ['сьогодні / завтра', 'aujourd\'hui / demain'],
    ['зараз (zaraz)', 'maintenant'],
    ['великий / малий', 'grand / petit'],
    ['добрий / поганий', 'bon / mauvais'],
    ['новий / старий', 'nouveau / ancien'],
    ['червоний / синій', 'rouge / bleu'],
    ['Україна (Ukrayina)', 'Ukraine'],
    ['Київ (Kyiv)', 'Kiev — capitale, fondée au IXe siècle'],
    ['вид (vyd)', 'aspect verbal — perfectif vs imperfectif'],
    ['відмінок (vidminok)', 'cas grammatical — il en existe 7'],
    ['Nominatif', 'називний — sujet de la phrase'],
    ['Accusatif', 'знахідний — complément d\'objet direct'],
    ['Génitif', 'родовий — possession, négation'],
    ['Datif', 'давальний — destinataire'],
    ['Instrumental', 'орудний — moyen, accompagnement'],
    ['Locatif', 'місцевий — lieu (toujours avec préposition)'],
    ['Vocatif', 'кличний — pour s\'adresser directement'],
    ['Cyrilliqu', 'абетка — alphabet cyrillique ukrainien, 33 lettres'],
    ['борщ (borshch)', 'bortsch — soupe de betterave, emblème national'],
    ['вареники', 'vareniky — raviolis ukrainiens'],
    ['Holodomor', 'Голодомор — famine de 1932–33, crime contre l\'humanité'],
    ['українська мова', 'la langue ukrainienne'],
    ['французька мова', 'la langue française'],
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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = 'Session terminée !'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' cartes';
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
