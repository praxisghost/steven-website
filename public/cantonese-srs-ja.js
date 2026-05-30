/* cantonese-srs-ja.js — 広東語 for Japanese speakers
   SM-2 spaced-repetition. Front: Cantonese (Jyutping + characters) | Back: Japanese meaning
   Pair: yue-ja
*/
(function () {
  'use strict';
  const PAIR = 'yue-ja';
  const WORDS = [
    /* あいさつ */
    ['你好 (nei5 hou2)',        'こんにちは'],
    ['早晨 (zou2 san4)',        'おはようございます'],
    ['晚安 (maan5 on1)',        'おやすみなさい'],
    ['唔該 (m4 goi1)',          'ありがとう（サービスへの感謝）/ すみません'],
    ['多謝 (do1 ze6)',          'ありがとう（贈り物・好意への感謝）'],
    ['對唔住 (deoi3 m4 zyu6)',  'ごめんなさい'],
    ['係 (hai6)',               'はい / そうです'],
    ['唔係 (m4 hai6)',          'いいえ / 違います'],
    ['好 (hou2)',               'よい / 良い / とても'],
    ['唔好 (m4 hou2)',          'よくない / ～しないで'],
    /* 基本表現 */
    ['我 (ngo5)',               '私 / 僕'],
    ['你 (nei5)',               'あなた'],
    ['佢 (keoi5)',              '彼 / 彼女'],
    ['我哋 (ngo5 dei6)',        '私たち'],
    ['你哋 (nei5 dei6)',        'あなたたち'],
    ['係咩？(hai6 me3)',        'そうですか？/ 本当ですか？'],
    ['幾多錢？(gei2 do1 cin2)', 'いくらですか？'],
    ['邊度？(bin1 dou6)',       'どこ？'],
    ['幾時？(gei2 si4)',        'いつ？'],
    ['點解？(dim2 gaai2)',      'なぜ？/ どうして？'],
    ['點樣？(dim2 joeng2)',     'どうですか？/ どんな感じ？'],
    ['唔明 (m4 ming4)',         'わかりません'],
    ['請講慢啲 (cing2 gong2 maan6 di1)', 'ゆっくり話してください'],
    /* 数字 */
    ['一 (jat1)',               '一（いち）'],
    ['二 (ji6)',                '二（に）'],
    ['三 (saam1)',              '三（さん）'],
    ['四 (sei3)',               '四（し）'],
    ['五 (ng5)',                '五（ご）'],
    ['六 (luk6)',               '六（ろく）'],
    ['七 (cat1)',               '七（しち）'],
    ['八 (baat3)',              '八（はち）'],
    ['九 (gau2)',               '九（く）'],
    ['十 (sap6)',               '十（じゅう）'],
    /* 食べ物・日常 */
    ['食 (sik6)',               '食べる'],
    ['飲 (jam2)',               '飲む'],
    ['水 (seoi2)',              '水'],
    ['飯 (faan6)',              'ご飯 / 食事'],
    ['茶 (caa4)',               'お茶'],
    ['靚 (leng3)',              '綺麗 / かっこいい / 素敵'],
    ['大 (daai6)',              '大きい'],
    ['細 (sai3)',               '小さい'],
  ];

  (function () {
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    WORDS.forEach(function (w, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + w[0].replace(/</g,'&lt;') + '</td><td>' + w[1].replace(/</g,'&lt;') + '</td>';
      tbody.appendChild(tr);
    });
  })();

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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = '今日の分は終了です！'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b;
    elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block';
    elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' 枚';
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
