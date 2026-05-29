/* haitian-creole-srs-fr.js — SRS flashcard data: Haitian Creole / Créole haïtien for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Haitian Creole | Back: French meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'ht-fr';
  const WORDS = [
    ['Bonjou', 'bonjour — du matin'],
    ['Bonswa', 'bonsoir'],
    ['Mèsi', 'merci'],
    ['Souple / Tanpri', 's\'il vous plaît'],
    ['Eskize m', 'excusez-moi'],
    ['Wi / Non', 'oui / non'],
    ['Dlo', 'eau — du fr. «de l\'eau»'],
    ['Pen', 'pain'],
    ['Kay', 'maison — du fr. «quai» ou «case»'],
    ['Mwen', 'je / moi'],
    ['Ou / Ou menm', 'tu / toi'],
    ['Li', 'il / elle — neutre en genre'],
    ['Nou', 'nous'],
    ['Yo', 'ils / elles / article pluriel'],
    ['Liv la', 'le livre — article postposé «la»'],
    ['Timoun yo', 'les enfants — article pluriel «yo»'],
    ['Liv nan', 'le livre (contexte particulier) — «nan» ou «an»'],
    ['Te', 'marqueur du passé — «mwen te manje» = j\'ai mangé'],
    ['Ap', 'marqueur du futur/progressif — «mwen ap manje»'],
    ['Te ap', 'marqueur du passé progressif — était en train de'],
    ['Pa', 'négation — «mwen pa konnen» = je ne sais pas'],
    ['Konnen', 'savoir / connaître'],
    ['Ale', 'aller'],
    ['Vin', 'venir'],
    ['Manje', 'manger'],
    ['Pale', 'parler'],
    ['Bèl', 'beau / belle'],
    ['Gwo / Ti', 'grand / petit'],
    ['Bon / Move', 'bon / mauvais'],
    ['Ayiti', 'Haïti — nom taïno de l\'île'],
    ['Pòtoprens', 'Port-au-Prince — capitale'],
    ['Kreyòl ayisyen', 'créole haïtien — langue maternelle de 12 millions'],
    ['Diglossie', 'bilinguisme créole/français — inégalité sociale persistante'],
    ['Saint-Domingue', 'ancienne colonie française 1625–1804'],
    ['Révolution haïtienne', '1791–1804 — seule révolte d\'esclaves victorieuse'],
    ['Première République noire', '1804 — première nation noire indépendante'],
    ['Bondye', 'Dieu — du français «bon Dieu»'],
    ['Voodoo / Vodou', 'religion syncrétique haïtienne'],
    ['Kompa', 'musique populaire haïtienne'],
    ['Griot', 'porc frit épicé — plat national haïtien'],
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
