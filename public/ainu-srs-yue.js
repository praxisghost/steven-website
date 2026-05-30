/* ainu-srs-yue.js — 阿伊努語 for Cantonese speakers
   SM-2 spaced-repetition. Front: Ainu | Back: Cantonese (Traditional) meaning
*/
(function () {
  'use strict';
  const PAIR = 'ain-yue';
  const WORDS = [
    ['irankarapte',   '你好（字面意思：讓我輕輕觸碰你嘅心）'],
    ['iyairaikere',   '多謝（又作 iyayiraykere）'],
    ['pirka',         '靚 / 好 / 優秀'],
    ['pon',           '細 / 小 / 少'],
    ['poro',          '大 / 多'],
    ['ainu',          '人 / 人類（阿伊努語中「人」嘅普通名詞）'],
    ['menoko',        '女性 / 女人'],
    ['okkayo',        '男性 / 男人'],
    ['pon ainu',      '小朋友 / 細路（字面：細人）'],
    ['ekasi',         '祖父 / 老人 / 受人尊敬嘅長者'],
    ['wakka',         '水'],
    ['abe',           '火'],
    ['kim',           '山 / 山林 / 高地'],
    ['pet',           '河（北海道唔少地名都有 -pet）'],
    ['mosir',         '大地 / 國家 / 世界（Ainu mosir = 阿伊努人嘅土地）'],
    ['nupuri',        '山（獨立嘅山峰）'],
    ['kamuy',         '神 / 靈 / 神聖嘅存在'],
    ['kotan',         '村落 / 定居地 / 家鄉'],
    ['chise',         '屋 / 家'],
    ['cikap',         '雀鳥 / 鳥'],
    ['kimun kamuy',   '熊（字面：山之神）'],
    ['repun kamuy',   '虎鯨（字面：海洋之神）'],
    ['ku',            '我（第一人稱代詞）'],
    ['eani',          '你（單數）'],
    ['ipe',           '食 / 食物'],
    ['ekari',         '行路 / 旅行'],
    ['ye',            '講 / 說話'],
    ['arki',          '嚟 / 到來'],
    ['paye',          '去'],
    ['kor',           '有 / 持有 / 擁有'],
    ['hunna',         '邊個？/ 誰？'],
    ['nep',           '乜嘢？/ 什麼？'],
    ['hemanta',       '點樣？/ 乜嘢類型？'],
    ['hempak',        '幾多？/ 多少？'],
    ['pirka no',      '好好地 / 認真地'],
    ['ene … an',      '咁樣 / 以呢種方式'],
    ['iyoiraykere',   '唔好意思 / 對唔住'],
    ['nea',           '嗰個 / 嗰度嘅嘢'],
    ['toy',           '泥土 / 大地'],
    ['maw',           '風'],
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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = '今日已完成！'; return; }
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
