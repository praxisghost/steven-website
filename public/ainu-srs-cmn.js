/* ainu-srs-cmn.js — 阿伊努语 for Mandarin speakers
   SM-2 spaced-repetition. Front: Ainu | Back: Mandarin meaning
*/
(function () {
  'use strict';
  const PAIR = 'ain-cmn';
  const WORDS = [
    ['irankarapte',   '你好（字面意思：让我轻轻触碰你的心）'],
    ['iyairaikere',   '谢谢（也写作 iyayiraykere）'],
    ['pirka',         '美丽的 / 好的 / 优秀的'],
    ['pon',           '小的 / 少的'],
    ['poro',          '大的 / 多的'],
    ['ainu',          '人 / 人类（阿伊努语中"人"的普通名词）'],
    ['menoko',        '女性 / 女人'],
    ['okkayo',        '男性 / 男人'],
    ['pon ainu',      '孩子（字面意思：小人）'],
    ['ekasi',         '祖父 / 老人 / 受尊敬的长者'],
    ['wakka',         '水'],
    ['abe',           '火'],
    ['kim',           '山 / 山林 / 高地'],
    ['pet',           '河川（北海道许多地名含有 -pet）'],
    ['mosir',         '大地 / 国家 / 世界（Ainu mosir = 阿伊努的土地）'],
    ['nupuri',        '山（独立的山峰）'],
    ['kamuy',         '神 / 灵 / 神圣存在'],
    ['kotan',         '村庄 / 定居地 / 家乡'],
    ['chise',         '房子 / 家'],
    ['cikap',         '鸟'],
    ['kimun kamuy',   '熊（字面意思：山之神）'],
    ['repun kamuy',   '虎鲸（字面意思：海洋之神）'],
    ['ku',            '我（第一人称代词）'],
    ['eani',          '你（单数）'],
    ['ipe',           '吃 / 食物'],
    ['ekari',         '走路 / 旅行'],
    ['ye',            '说 / 说话'],
    ['arki',          '来'],
    ['paye',          '去'],
    ['kor',           '有 / 持有 / 拥有'],
    ['hunna',         '谁？'],
    ['nep',           '什么？'],
    ['hemanta',       '怎么？/ 什么样的？'],
    ['hempak',        '多少？'],
    ['pirka no',      '好好地 / 认真地'],
    ['ene … an',      '像这样 / 以这种方式'],
    ['iyoiraykere',   '对不起 / 打扰了'],
    ['nea',           '那个 / 那些（在那里的）'],
    ['toy',           '土 / 泥土 / 大地'],
    ['maw',           '风'],
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
