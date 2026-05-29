/* quebecois-srs-fr.js — SRS flashcard data: Québécois French for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Québécois | Back: French standard meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'qc-fr';
  const WORDS = [
    ['Allo !', 'Bonjour ! / Salut ! — salutation québécoise'],
    ['Bienvenue', 'de rien — réponse à «merci» (≠ «welcome»)'],
    ['Pantoute', 'pas du tout — «point à tout» archaïque'],
    ['Icite / icitte', 'ici — archaïsme du XVIIe siècle'],
    ['Asteur', 'à cette heure = maintenant'],
    ['Tantôt', 'tout à l\'heure / plus tard — selon le contexte'],
    ['Char', 'voiture — du vieux français «chariot»'],
    ['Maganer', 'abîmer / fatiguer — du normand «maganer»'],
    ['Pogner', 'attraper / saisir'],
    ['Jasper', 'bavarder longuement'],
    ['Placoter', 'bavarder, potiner'],
    ['Cossins', 'objets divers / bric-à-brac'],
    ['Bouette', 'boue / gadoue'],
    ['Frette', 'froid intense — du vieux français «froid»'],
    ['Marde', 'merde — sacre moins fort'],
    ['Câlice / Crisse', 'sacre fort — juron religieux'],
    ['Tabarnac', 'tabernacle — sacre très fort'],
    ['Ostie / Estie', 'hostie — sacre courant'],
    ['Dîner', 'repas du midi (≠ france: dîner = soir)'],
    ['Souper', 'repas du soir'],
    ['Déjeuner', 'repas du matin — en France c\'est «petit-déjeuner»'],
    ['Breuvage', 'boisson'],
    ['Manger une bonne shot', 'avoir une bonne occasion'],
    ['C\'est le boutte !', 'c\'est super ! c\'est génial !'],
    ['Être dans le champ', 'se tromper complètement'],
    ['Avoir les yeux dans graisse de bines', 'avoir l\'air fatigué/vaseux'],
    ['Loi 101', 'Charte de la langue française (1977)'],
    ['Révolution tranquille', '1960s — modernisation du Québec'],
    ['Joual', 'dialecte populaire montréalais'],
    ['Affrication du «t»', 't + i/e → ts (ti-gars, t\'es)'],
    ['Affrication du «d»', 'd + i/e → dz (di-manche, d\'abord)'],
    ['Diphtongaison', 'allongement vocalique (fête → fâête)'],
    ['Office québécois', 'OQLF — organisme de la langue française'],
    ['Bleuets', 'myrtilles — en France ce sont des «bleuets»'],
    ['Pognes-toi pas', 'ne t\'en fais pas'],
    ['Y', 'il/elle (pronom réduit) — «y vient» = «il vient»'],
    ['Toé / moé', 'toi / moi — en français populaire québécois'],
    ['Chu', 'je suis — contraction de «je suis»'],
    ['Fak', 'donc / alors — contraction de «ça fait que»'],
    ['Le fun', 'agréable — emprunt intégré à l\'anglais «fun»'],
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
