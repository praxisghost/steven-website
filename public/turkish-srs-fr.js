/* turkish-srs-fr.js — SRS flashcard data: Turkish / Turc for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Turkish | Back: French meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'tr-fr';
  const WORDS = [
    ['merhaba', 'bonjour — la salutation la plus courante'],
    ['teşekkür ederim', 'merci — forme polie et complète'],
    ['lütfen', 's\'il vous plaît — marque la politesse'],
    ['evet / hayır', 'oui / non'],
    ['özür dilerim', 'pardon / excusez-moi'],
    ['su', 'eau — ressemble à l\'espagnol «su»'],
    ['ekmek', 'pain — nourriture de base en Turquie'],
    ['ev', 'maison / chez-soi'],
    ['çay', 'thé — pilier de la culture turque'],
    ['kahve', 'café — le mot «café» vient du turc/arabe'],
    ['ben', 'je / moi'],
    ['sen', 'tu (familier)'],
    ['siz', 'vous (formel ou pluriel)'],
    ['o', 'il / elle / ça — un seul mot pour les 3'],
    ['gitmek', 'aller — infinitif en -mek/-mak'],
    ['gelmek', 'venir'],
    ['yemek', 'manger / repas — double sens comme «repas»'],
    ['bilmek', 'savoir — «bilgi» = connaissance, comme «bilingual»'],
    ['istemek', 'vouloir / désirer'],
    ['Ben kitap okuyorum.', 'Je lis un livre. — ordre SOV comme le japonais'],
    ['Ben gitmiyorum.', 'Je ne vais pas. — négation -mi-/-mı-'],
    ['bir, iki, üç', '1, 2, 3'],
    ['bugün / yarın / dün', 'aujourd\'hui / demain / hier'],
    ['şimdi', 'maintenant'],
    ['büyük / küçük', 'grand / petit'],
    ['iyi / kötü', 'bon / mauvais'],
    ['yeni / eski', 'nouveau / ancien'],
    ['kırmızı / mavi', 'rouge / bleu'],
    ['Türkiye', 'Turquie — le nom officiel depuis 2022'],
    ['İstanbul', 'Istanbul — ancienne Constantinople, Byzance'],
    ['inşallah', 'si Dieu le veut — expression courante du quotidien'],
    ['ünlü uyumu', 'harmonie vocalique — règle fondamentale du turc'],
    ['eklemeli dil', 'langue agglutinante — comme le finnois, le japonais'],
    ['apartman', 'immeuble — mot d\'origine française'],
    ['kuaför', 'coiffeur — mot d\'origine française'],
    ['tuvalet', 'toilettes — du français «toilette»'],
    ['büfe', 'buffet — du français «buffet»'],
    ['Türkçe', 'turc (la langue)'],
    ['Fransızca', 'français (la langue)'],
    ['çok güzel', 'très beau / très bien — expression très utilisée'],
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
