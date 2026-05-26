(function () {
  'use strict';

  /* ── DECK — 100 core German words (German ↔ Traditional Chinese) ──────── */
  var DECK = [
    // 連接詞與介詞 Conjunctions & prepositions (0–9)
    { id:  0, tr: 'ein / eine',       en: '一個（不定冠詞）',               pos: '冠詞' },
    { id:  1, tr: 'der / die / das',  en: '定冠詞（陽／陰／中性）',         pos: '冠詞' },
    { id:  2, tr: 'und',              en: '和、與',                         pos: '連接詞' },
    { id:  3, tr: 'aber',             en: '但是',                           pos: '連接詞' },
    { id:  4, tr: 'weil',             en: '因為',                           pos: '連接詞' },
    { id:  5, tr: 'wenn',             en: '如果、當',                       pos: '連接詞' },
    { id:  6, tr: 'oder',             en: '或者',                           pos: '連接詞' },
    { id:  7, tr: 'dass',             en: '那、說（從句連接詞）',            pos: '連接詞' },
    { id:  8, tr: 'mit',              en: '和、跟（介詞）',                  pos: '介詞' },
    { id:  9, tr: 'für',              en: '為了（介詞）',                   pos: '介詞' },

    // 代詞與疑問詞 Pronouns & question words (10–24)
    { id: 10, tr: 'ich',              en: '我',                             pos: '代詞' },
    { id: 11, tr: 'du',               en: '你（非正式）',                   pos: '代詞' },
    { id: 12, tr: 'er',               en: '他',                             pos: '代詞' },
    { id: 13, tr: 'sie (她)',          en: '她',                             pos: '代詞' },
    { id: 14, tr: 'es',               en: '它',                             pos: '代詞' },
    { id: 15, tr: 'wir',              en: '我們',                           pos: '代詞' },
    { id: 16, tr: 'ihr',              en: '你們（複數非正式）',              pos: '代詞' },
    { id: 17, tr: 'sie (她們/他們)',   en: '他們／她們',                     pos: '代詞' },
    { id: 18, tr: 'Sie',              en: '您（正式）',                     pos: '代詞' },
    { id: 19, tr: 'dieser / diese',   en: '這個',                           pos: '代詞／形容詞' },
    { id: 20, tr: 'was',              en: '什麼',                           pos: '疑問詞' },
    { id: 21, tr: 'wer',              en: '誰',                             pos: '疑問詞' },
    { id: 22, tr: 'wo',               en: '在哪裡',                         pos: '疑問詞' },
    { id: 23, tr: 'wie',              en: '怎麼、如何',                     pos: '疑問詞' },
    { id: 24, tr: 'warum',            en: '為什麼',                         pos: '疑問詞' },

    // 副詞 Adverbs (25–39)
    { id: 25, tr: 'sehr',             en: '非常、很',                       pos: '副詞' },
    { id: 26, tr: 'mehr',             en: '更多',                           pos: '副詞' },
    { id: 27, tr: 'auch',             en: '也',                             pos: '副詞' },
    { id: 28, tr: 'schon',            en: '已經',                           pos: '副詞' },
    { id: 29, tr: 'immer',            en: '總是、永遠',                     pos: '副詞' },
    { id: 30, tr: 'nie',              en: '從不',                           pos: '副詞' },
    { id: 31, tr: 'jetzt',            en: '現在',                           pos: '副詞' },
    { id: 32, tr: 'dann',             en: '然後、那時',                     pos: '副詞' },
    { id: 33, tr: 'noch',             en: '還、仍然',                       pos: '副詞' },
    { id: 34, tr: 'hier',             en: '這裡',                           pos: '副詞' },
    { id: 35, tr: 'dort',             en: '那裡',                           pos: '副詞' },
    { id: 36, tr: 'nur',              en: '只、僅僅',                       pos: '副詞' },
    { id: 37, tr: 'vielleicht',       en: '也許、可能',                     pos: '副詞' },
    { id: 38, tr: 'fast',             en: '幾乎',                           pos: '副詞' },
    { id: 39, tr: 'zusammen',         en: '一起',                           pos: '副詞' },

    // 形容詞 Adjectives (40–54)
    { id: 40, tr: 'gut',              en: '好的',                           pos: '形容詞' },
    { id: 41, tr: 'schlecht',         en: '壞的',                           pos: '形容詞' },
    { id: 42, tr: 'groß',             en: '大的',                           pos: '形容詞' },
    { id: 43, tr: 'klein',            en: '小的',                           pos: '形容詞' },
    { id: 44, tr: 'neu',              en: '新的',                           pos: '形容詞' },
    { id: 45, tr: 'alt',              en: '舊的、老的',                     pos: '形容詞' },
    { id: 46, tr: 'erste',            en: '第一',                           pos: '形容詞' },
    { id: 47, tr: 'letzte',           en: '最後的',                         pos: '形容詞' },
    { id: 48, tr: 'viel',             en: '很多',                           pos: '形容詞' },
    { id: 49, tr: 'wenig',            en: '一點、少',                       pos: '形容詞' },
    { id: 50, tr: 'gleiche',          en: '相同的',                         pos: '形容詞' },
    { id: 51, tr: 'andere',           en: '其他的、另一個',                 pos: '形容詞' },
    { id: 52, tr: 'alle',             en: '全部、所有',                     pos: '形容詞' },
    { id: 53, tr: 'einfach / leicht', en: '容易的',                         pos: '形容詞' },
    { id: 54, tr: 'schwer / schwierig', en: '困難的',                       pos: '形容詞' },

    // 動詞 Verbs (55–79)
    { id: 55, tr: 'sein',             en: '是、存在',                       pos: '動詞' },
    { id: 56, tr: 'haben',            en: '有、擁有',                       pos: '動詞' },
    { id: 57, tr: 'werden',           en: '將要、變成',                     pos: '動詞' },
    { id: 58, tr: 'machen',           en: '做、製作',                       pos: '動詞' },
    { id: 59, tr: 'gehen',            en: '去、走',                         pos: '動詞' },
    { id: 60, tr: 'kommen',           en: '來',                             pos: '動詞' },
    { id: 61, tr: 'sagen',            en: '說',                             pos: '動詞' },
    { id: 62, tr: 'wissen',           en: '知道（事實）',                   pos: '動詞' },
    { id: 63, tr: 'kennen',           en: '認識（人／地）',                 pos: '動詞' },
    { id: 64, tr: 'sehen',            en: '看見',                           pos: '動詞' },
    { id: 65, tr: 'wollen',           en: '想要',                           pos: '動詞' },
    { id: 66, tr: 'können',           en: '能夠、可以',                     pos: '動詞' },
    { id: 67, tr: 'müssen',           en: '必須',                           pos: '動詞' },
    { id: 68, tr: 'geben',            en: '給',                             pos: '動詞' },
    { id: 69, tr: 'nehmen',           en: '拿、取',                         pos: '動詞' },
    { id: 70, tr: 'sprechen',         en: '說話、講',                       pos: '動詞' },
    { id: 71, tr: 'hören',            en: '聽',                             pos: '動詞' },
    { id: 72, tr: 'lesen',            en: '閱讀',                           pos: '動詞' },
    { id: 73, tr: 'schreiben',        en: '寫',                             pos: '動詞' },
    { id: 74, tr: 'verstehen',        en: '理解、明白',                     pos: '動詞' },
    { id: 75, tr: 'denken',           en: '想、思考',                       pos: '動詞' },
    { id: 76, tr: 'finden',           en: '找到、覺得',                     pos: '動詞' },
    { id: 77, tr: 'benutzen',         en: '使用',                           pos: '動詞' },
    { id: 78, tr: 'brauchen',         en: '需要',                           pos: '動詞' },
    { id: 79, tr: 'heißen',           en: '叫做、名字是',                   pos: '動詞' },

    // 名詞 Nouns (80–94)
    { id: 80, tr: 'das Ding',         en: '東西、事物',                     pos: '名詞' },
    { id: 81, tr: 'die Zeit',         en: '時間',                           pos: '名詞' },
    { id: 82, tr: 'der Mann',         en: '男人',                           pos: '名詞' },
    { id: 83, tr: 'die Frau',         en: '女人、太太',                     pos: '名詞' },
    { id: 84, tr: 'das Kind',         en: '孩子',                           pos: '名詞' },
    { id: 85, tr: 'das Haus',         en: '房子、家',                       pos: '名詞' },
    { id: 86, tr: 'die Arbeit',       en: '工作',                           pos: '名詞' },
    { id: 87, tr: 'der Tag',          en: '天、日',                         pos: '名詞' },
    { id: 88, tr: 'das Jahr',         en: '年',                             pos: '名詞' },
    { id: 89, tr: 'die Stadt',        en: '城市',                           pos: '名詞' },
    { id: 90, tr: 'das Geld',         en: '錢',                             pos: '名詞' },
    { id: 91, tr: 'das Wasser',       en: '水',                             pos: '名詞' },
    { id: 92, tr: 'das Essen',        en: '食物、飯',                       pos: '名詞' },
    { id: 93, tr: 'das Wort',         en: '詞、字',                         pos: '名詞' },
    { id: 94, tr: 'die Sprache',      en: '語言',                           pos: '名詞' },

    // 常用表達 Common expressions (95–99)
    { id: 95, tr: 'ja',               en: '是、對',                         pos: '表達' },
    { id: 96, tr: 'nein',             en: '不、不是',                       pos: '表達' },
    { id: 97, tr: 'okay',             en: '好的、行',                       pos: '表達' },
    { id: 98, tr: 'Hallo',            en: '你好',                           pos: '表達' },
    { id: 99, tr: 'Danke',            en: '謝謝',                           pos: '表達' }
  ];

  var STORAGE_KEY         = 'srs-german-zht-v1';
  var MAX_NEW_PER_SESSION = 20;

  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  function loadStates() {
    try { var raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }
  function saveStates() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(states)); } catch (e) {}
  }
  function getState(id) {
    if (!states[id]) states[id] = { interval: 0, ef: 2.5, reps: 0, due: 0 };
    return states[id];
  }
  function today() { return Math.floor(Date.now() / 86400000); }
  function schedule(state, good) {
    if (!good) { state.reps = 0; state.interval = 1; state.ef = Math.max(1.3, state.ef - 0.2); }
    else {
      if (state.reps === 0) state.interval = 1;
      else if (state.reps === 1) state.interval = 6;
      else state.interval = Math.round(state.interval * state.ef);
      state.ef = Math.min(2.5, state.ef + 0.1); state.reps += 1;
    }
    state.due = today() + state.interval;
  }
  function previewIntervals(state) {
    var good = state.reps === 0 ? 1 : state.reps === 1 ? 6 : Math.round(state.interval * state.ef);
    return { again: 1, good: good };
  }
  function fmtDays(d) {
    if (d < 1) return '<1d'; if (d < 30) return d + 'd';
    if (d < 365) return Math.round(d / 30) + 'mo'; return Math.round(d / 365) + 'y';
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
  function buildQueue() {
    var t = today(), due = [], newCards = [];
    DECK.forEach(function (c) {
      var s = getState(c.id);
      if (s.reps > 0 && s.due <= t) due.push(c);
      else if (s.reps === 0) newCards.push(c);
    });
    shuffle(due); shuffle(newCards);
    return due.concat(newCards.slice(0, MAX_NEW_PER_SESSION));
  }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function seenCount() { return DECK.filter(function (c) { return getState(c.id).reps > 0; }).length; }

  function renderMeta() {
    var el = document.getElementById('srs-meta'); if (!el) return;
    var rem = queue.length - queueIdx, pct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0;
    el.innerHTML = '<span class="srs-count">已完成&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;剩餘&nbsp;<b>' + rem + '</b></span>' +
      '<div class="srs-bar-wrap"><div class="srs-bar" style="width:' + pct + '%"></div></div>';
  }
  function renderFront(card) {
    var ce = document.getElementById('srs-card'), ae = document.getElementById('srs-actions'); if (!ce || !ae) return;
    revealed = false; ce.className = 'srs-card';
    ce.innerHTML = '<span class="srs-turkish">' + esc(card.tr) + '</span><span class="srs-pos">' + esc(card.pos) + '</span><span class="srs-hint">點擊顯示答案</span>';
    ae.innerHTML = ''; renderMeta();
  }
  function renderBack(card) {
    var ce = document.getElementById('srs-card'), ae = document.getElementById('srs-actions'); if (!ce || !ae) return;
    revealed = true; var state = getState(card.id), preview = previewIntervals(state);
    ce.className = 'srs-card revealed';
    ce.innerHTML = '<span class="srs-turkish">' + esc(card.tr) + '</span><span class="srs-pos">' + esc(card.pos) + '</span><div class="srs-divider"></div><span class="srs-english">' + esc(card.en) + '</span>';
    ae.innerHTML = '<button class="srs-btn srs-btn-again" id="btn-again"><span class="srs-key">1</span>&nbsp;再試&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span></button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good"><span class="srs-key">3</span>&nbsp;記住了&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span></button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }
  function renderDone() {
    root.innerHTML = '<div class="srs-done"><div class="srs-done-title">本次練習完成</div><div class="srs-done-sub">今天的所有單字已複習完畢。</div>' +
      '<div class="srs-done-stats">本次複習了&nbsp;' + sessionDone + '&nbsp;張卡片<br>已學習&nbsp;' + seenCount() + '&nbsp;／&nbsp;' + DECK.length + '&nbsp;個單字</div>' +
      '<button class="srs-action-btn" id="btn-restart">再練習一次</button></div>';
    document.getElementById('btn-restart').addEventListener('click', function () { var t = today(); queue.forEach(function (c) { getState(c.id).due = t; }); init(); });
  }
  function renderNothingDue() {
    root.innerHTML = '<div class="srs-done"><div class="srs-done-title">今天沒有到期的卡片</div><div class="srs-done-sub">所有卡片均已排程至未來複習。</div>' +
      '<div class="srs-done-stats">已學習&nbsp;' + seenCount() + '&nbsp;／&nbsp;' + DECK.length + '&nbsp;個單字</div><button class="srs-action-btn" id="btn-new">繼續學習新單字</button></div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var nc = DECK.filter(function (c) { return getState(c.id).reps === 0; }).slice(0, MAX_NEW_PER_SESSION);
      if (!nc.length) { root.innerHTML = '<div class="srs-done"><div class="srs-done-title">全部完成！</div><div class="srs-done-sub">你已學習全部&nbsp;' + DECK.length + '&nbsp;個單字，請明天回來複習。</div></div>'; return; }
      queue = shuffle(nc); queueIdx = 0; sessionDone = 0; sessionTotal = queue.length; buildRootHTML(); renderFront(queue[0]);
    });
  }
  function buildRootHTML() {
    root.innerHTML = '<div class="srs-meta" id="srs-meta"></div><div class="srs-card" id="srs-card"></div><div class="srs-actions" id="srs-actions"></div>';
    document.getElementById('srs-card').addEventListener('click', function () { if (!revealed && queue[queueIdx]) renderBack(queue[queueIdx]); });
  }
  function handleAgain() { if (!revealed) return; var c = queue[queueIdx]; schedule(getState(c.id), false); saveStates(); queue.push(c); sessionTotal++; advance(); }
  function handleGood()  { if (!revealed) return; var c = queue[queueIdx]; schedule(getState(c.id), true);  saveStates(); sessionDone++; advance(); }
  function advance() { queueIdx++; if (queueIdx >= queue.length) renderDone(); else renderFront(queue[queueIdx]); }
  function onKey(e) {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!revealed && queue && queue[queueIdx]) renderBack(queue[queueIdx]); }
    else if (e.key === '1') { if (revealed) handleAgain(); }
    else if (e.key === '3') { if (revealed) handleGood(); }
  }
  function init() {
    states = loadStates(); queue = buildQueue(); queueIdx = 0; sessionDone = 0; sessionTotal = queue.length; revealed = false;
    if (!queue.length) { renderNothingDue(); return; }
    buildRootHTML(); renderFront(queue[0]);
  }
  function setup() { root = document.getElementById('srs-root'); if (!root) return; document.addEventListener('keydown', onKey); init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
}());
