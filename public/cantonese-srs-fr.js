/* cantonese-srs-fr.js — SRS flashcard data: Cantonese / Cantonais for French speakers
   SM-2 spaced-repetition algorithm. Progress stored in localStorage.
   Card set: 40 words and phrases.
   Front: Cantonese | Back: French meaning + notes
*/
(function () {
  'use strict';

  const PAIR = 'yue-fr';
  const WORDS = [
    ['你好 (nei hou)', 'bonjour — salutation standard'],
    ['唔該 (m goi)', 'merci / s\'il vous plaît — pour un service'],
    ['多謝 (do je)', 'merci — pour un cadeau'],
    ['係 / 唔係 (hai / m hai)', 'oui / non (litt. «c\'est / c\'est pas»)'],
    ['對唔住 (deoi m jyu)', 'pardon / excusez-moi'],
    ['水 (seoi)', 'eau — ton 2 (montant)'],
    ['麵包 (min baau)', 'pain'],
    ['屋 (uk)', 'maison'],
    ['茶 (caa)', 'thé — ton 4 (bas)'],
    ['咖啡 (gaa fe)', 'café — emprunt phonétique'],
    ['我 (ngo)', 'je / moi'],
    ['你 (nei)', 'tu / vous'],
    ['佢 (keoi)', 'il / elle — neutre en genre'],
    ['我哋 (ngo dei)', 'nous'],
    ['去 (heoi)', 'aller'],
    ['嚟 (lai)', 'venir'],
    ['食 (sik)', 'manger'],
    ['識 (sik)', 'savoir — homonyme de «manger» !'],
    ['想 (soeng)', 'vouloir'],
    ['我睇書。(ngo tai syu)', 'Je lis un livre. — ordre SVO'],
    ['我唔去。(ngo m heoi)', 'Je n\'y vais pas. — négation 唔'],
    ['一 二 三 (jat ji saam)', '1, 2, 3'],
    ['今日 / 聽日 / 尋日', 'aujourd\'hui / demain / hier'],
    ['而家 (ji gaa)', 'maintenant'],
    ['大 / 細 (daai / sai)', 'grand / petit'],
    ['靚 (leng)', 'beau / joli — très utilisé'],
    ['九聲六調', '9 tons, 6 tons distincts — système tonal complexe'],
    ['聲調 第一聲 (sing1)', 'ton 1 : haut uniforme — 55'],
    ['聲調 第二聲 (sing2)', 'ton 2 : montant — 25'],
    ['聲調 第三聲 (sing3)', 'ton 3 : moyen-bas — 33'],
    ['聲調 第四聲 (sing4)', 'ton 4 : bas descendant — 21'],
    ['聲調 第五聲 (sing5)', 'ton 5 : bas montant — 23'],
    ['聲調 第六聲 (sing6)', 'ton 6 : bas uniforme — 22'],
    ['繁體字', 'caractères traditionnels — utilisés à HK et Macao'],
    ['廣東話 / 粵語', 'cantonais / langue yue'],
    ['我係廣東人。', 'Je suis Cantonais(e). — identité régionale forte'],
    ['飲茶 (jam caa)', 'yum cha — boire le thé, tradition du dim sum'],
    ['點心 (dim sam)', 'dim sum — litt. «toucher le cœur»'],
    ['法語 (faat jyu)', 'français'],
    ['粵語拼音 (Jyutping)', 'Jyutping — système de romanisation officiel'],
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
