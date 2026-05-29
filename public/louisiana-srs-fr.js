/* louisiana-srs-fr.js — SRS flashcard data: Louisiana French / Cajun for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Louisiana French | Back: French standard meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'la-fr';
  const WORDS = [
    ['Allons !', 'Allons-y ! / On y va !'],
    ['Viens icitte', 'Viens ici — archaïsme du XVIIe'],
    ['Asteur', 'à présent / maintenant'],
    ['La maison', 'la maison — prononciation archaïque préservée'],
    ['Zydeco', 'musique cajun-créole aux accents africains'],
    ['Laissez les bons temps rouler', 'que les bons temps roulent — devise cajun'],
    ['Fais do-do', 'fête cajun / bal du samedi soir'],
    ['Courir de Mardi Gras', 'course masquée dans les campagnes cajuns'],
    ['Boucherie', 'abattage communautaire du porc en hiver'],
    ['Filé', 'poudre de sassafras pour épaissir le gumbo'],
    ['Gumbo', 'ragoût louisianais — de «ki ngombo» (okra en bantu)'],
    ['Jambalaya', 'riz aux viandes épicées — comme la paella'],
    ['Boudin', 'saucisse de porc et riz épicé'],
    ['Praline', 'confiserie au caramel et noix de pécan'],
    ['Crawfish / Écrevisse', 'écrevisse — symbole de la cuisine cajun'],
    ['Pirogue', 'embarcation plate en bois creusé'],
    ['Bayou', 'bras de fleuve lent — du choctaw «bayuk»'],
    ['Lagniappe', 'petit cadeau supplémentaire — du quechua «yapa»'],
    ['Traiteur', 'guérisseur folk / rebouteux cajun'],
    ['Cadien / Cajun', 'Acadien — descendants des exilés d\'Acadie'],
    ['Grand Dérangement', 'déportation des Acadiens 1755–1763 par les Anglais'],
    ['CODOFIL', 'Conseil pour le Développement du Français en Louisiane'],
    ['Quasiment', 'presque — archaïsme normand conservé'],
    ['Après + inf.', 'être en train de — «il est après manger»'],
    ['Bête', 'idiot / stupide en louisianais (≠ France: animal)'],
    ['Canaille', 'coquin / espiègle (sens positif en Louisiane)'],
    ['La Nouvelle-Orléans', 'New Orleans — fondée par Bienville en 1718'],
    ['Mardi Gras', 'carnaval louisianais, plus vieux des États-Unis'],
    ['Paroisse', 'comté louisianais (≠ États-Unis: county)'],
    ['Parler avec les mains', 'expression gestuelle intense — culture méditerranéenne'],
    ['Cahin-caha', 'tant bien que mal — expression archaïque'],
    ['Cher (chère)', 'mon cher / ma chère — terme affectueux cajun'],
    ['Bébé', 'terme d\'affection universel en Louisiane'],
    ['Patin (patiner)', 'glisser / tomber — sens élargi en louisianais'],
    ['Couche-couche', 'beignet de maïs frit — petit-déjeuner cajun traditionnel'],
    ['Tasso', 'viande fumée épicée — spécialité cajun'],
    ['Chaoui', 'raton laveur — du choctaw'],
    ['Armadille', 'armadillo louisianais — de l\'espagnol «armadillo»'],
    ['Nèfle', 'fruit du néflier — archaïsme encore en usage'],
    ['Mauvais temps', 'mauvais comportement (≠ météo) en louisianais'],
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
