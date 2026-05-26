(function () {
  'use strict';

  /* ── DECK — 100 core Turkish words (Turkish ↔ Traditional Chinese) ──── */
  var DECK = [
    // 連接詞與後置詞 Conjunctions & postpositions (0–15)
    { id:  0, tr: 'bir',          en: '一個（不定冠詞）',               pos: '數詞／冠詞' },
    { id:  1, tr: 've',           en: '和、與',                         pos: '連接詞' },
    { id:  2, tr: 'ama',          en: '但是、然而',                     pos: '連接詞' },
    { id:  3, tr: 'çünkü',        en: '因為',                           pos: '連接詞' },
    { id:  4, tr: 'eğer',         en: '如果',                           pos: '連接詞' },
    { id:  5, tr: 'ya da',        en: '或者',                           pos: '連接詞' },
    { id:  6, tr: 'ki',           en: '那、使得（從句連接詞）',          pos: '連接詞' },
    { id:  7, tr: 'için',         en: '為了、因為',                     pos: '後置詞' },
    { id:  8, tr: 'ile',          en: '和、用（後置詞）',               pos: '後置詞' },
    { id:  9, tr: 'kadar',        en: '直到、多達',                     pos: '後置詞' },
    { id: 10, tr: 'gibi',         en: '像、如同',                       pos: '後置詞' },
    { id: 11, tr: 'de / da',      en: '也、還（語氣詞，接於詞後）',     pos: '語氣詞' },
    { id: 12, tr: 'mi / mı',      en: '嗎（疑問助詞）',                 pos: '語氣詞' },
    { id: 13, tr: 'değil',        en: '不是（否定詞）',                 pos: '語氣詞' },
    { id: 14, tr: 'var',          en: '有、存在',                       pos: '存在詞' },
    { id: 15, tr: 'yok',          en: '沒有、不存在',                   pos: '存在詞' },

    // 代詞與疑問詞 Pronouns & question words (16–29)
    { id: 16, tr: 'ben',          en: '我',                             pos: '代詞' },
    { id: 17, tr: 'sen',          en: '你（非正式單數）',               pos: '代詞' },
    { id: 18, tr: 'o',            en: '他、她、它',                     pos: '代詞' },
    { id: 19, tr: 'biz',          en: '我們',                           pos: '代詞' },
    { id: 20, tr: 'siz',          en: '你們、您（正式）',               pos: '代詞' },
    { id: 21, tr: 'onlar',        en: '他們',                           pos: '代詞' },
    { id: 22, tr: 'bu',           en: '這個',                           pos: '代詞／指示詞' },
    { id: 23, tr: 'şu',           en: '那個（近指）',                   pos: '代詞／指示詞' },
    { id: 24, tr: 'ne',           en: '什麼',                           pos: '疑問詞' },
    { id: 25, tr: 'kim',          en: '誰',                             pos: '疑問詞' },
    { id: 26, tr: 'nerede',       en: '在哪裡',                         pos: '疑問詞' },
    { id: 27, tr: 'nasıl',        en: '怎樣、如何',                     pos: '疑問詞' },
    { id: 28, tr: 'neden',        en: '為什麼',                         pos: '疑問詞' },
    { id: 29, tr: 'kendi',        en: '自己、本身',                     pos: '代詞' },

    // 副詞 Adverbs (30–46)
    { id: 30, tr: 'çok',          en: '非常、很多',                     pos: '副詞' },
    { id: 31, tr: 'daha',         en: '更、還',                         pos: '副詞' },
    { id: 32, tr: 'artık',        en: '現在、不再（語境依情況）',       pos: '副詞' },
    { id: 33, tr: 'hiç',          en: '從不、根本',                     pos: '副詞' },
    { id: 34, tr: 'hep',          en: '總是、一直',                     pos: '副詞' },
    { id: 35, tr: 'şimdi',        en: '現在',                           pos: '副詞' },
    { id: 36, tr: 'sonra',        en: '之後、稍後',                     pos: '副詞' },
    { id: 37, tr: 'önce',         en: '之前、首先',                     pos: '副詞' },
    { id: 38, tr: 'belki',        en: '也許、可能',                     pos: '副詞' },
    { id: 39, tr: 'hâlâ',         en: '仍然、還',                       pos: '副詞' },
    { id: 40, tr: 'yani',         en: '也就是說、意思是',               pos: '副詞' },
    { id: 41, tr: 'tabii',        en: '當然、自然',                     pos: '副詞' },
    { id: 42, tr: 'birlikte',     en: '一起',                           pos: '副詞' },
    { id: 43, tr: 'bence',        en: '依我看、我認為',                 pos: '副詞' },
    { id: 44, tr: 'zaten',        en: '反正、已經',                     pos: '副詞' },
    { id: 45, tr: 'sadece',       en: '只、僅僅',                       pos: '副詞' },
    { id: 46, tr: 'hemen',        en: '馬上、立刻',                     pos: '副詞' },

    // 形容詞 Adjectives (47–62)
    { id: 47, tr: 'her',          en: '每個、各個',                     pos: '形容詞' },
    { id: 48, tr: 'bütün',        en: '全部、整個',                     pos: '形容詞' },
    { id: 49, tr: 'iyi',          en: '好的',                           pos: '形容詞' },
    { id: 50, tr: 'büyük',        en: '大的、偉大的',                   pos: '形容詞' },
    { id: 51, tr: 'küçük',        en: '小的',                           pos: '形容詞' },
    { id: 52, tr: 'yeni',         en: '新的',                           pos: '形容詞' },
    { id: 53, tr: 'eski',         en: '舊的、舊式的',                   pos: '形容詞' },
    { id: 54, tr: 'ilk',          en: '第一、最初的',                   pos: '形容詞' },
    { id: 55, tr: 'son',          en: '最後的、最近的',                 pos: '形容詞' },
    { id: 56, tr: 'güzel',        en: '美麗的、好看的',                 pos: '形容詞' },
    { id: 57, tr: 'doğru',        en: '正確的、真實的',                 pos: '形容詞' },
    { id: 58, tr: 'başka',        en: '其他的、另一個',                 pos: '形容詞' },
    { id: 59, tr: 'aynı',         en: '相同的',                         pos: '形容詞' },
    { id: 60, tr: 'önemli',       en: '重要的',                         pos: '形容詞' },
    { id: 61, tr: 'kolay',        en: '容易的',                         pos: '形容詞' },
    { id: 62, tr: 'zor',          en: '困難的、艱難的',                 pos: '形容詞' },

    // 動詞（不定式）Verbs — infinitive form (63–80)
    { id: 63, tr: 'olmak',        en: '是、成為、發生',                 pos: '動詞' },
    { id: 64, tr: 'yapmak',       en: '做、製作',                       pos: '動詞' },
    { id: 65, tr: 'gelmek',       en: '來',                             pos: '動詞' },
    { id: 66, tr: 'gitmek',       en: '去',                             pos: '動詞' },
    { id: 67, tr: 'demek',        en: '說、意思是',                     pos: '動詞' },
    { id: 68, tr: 'bilmek',       en: '知道、懂得',                     pos: '動詞' },
    { id: 69, tr: 'görmek',       en: '看見',                           pos: '動詞' },
    { id: 70, tr: 'istemek',      en: '想要、希望',                     pos: '動詞' },
    { id: 71, tr: 'vermek',       en: '給',                             pos: '動詞' },
    { id: 72, tr: 'almak',        en: '拿、買、得到',                   pos: '動詞' },
    { id: 73, tr: 'bakmak',       en: '看、照顧',                       pos: '動詞' },
    { id: 74, tr: 'anlamak',      en: '理解、明白',                     pos: '動詞' },
    { id: 75, tr: 'düşünmek',     en: '想、思考',                       pos: '動詞' },
    { id: 76, tr: 'bulmak',       en: '找到、發現',                     pos: '動詞' },
    { id: 77, tr: 'söylemek',     en: '說、告訴',                       pos: '動詞' },
    { id: 78, tr: 'çıkmak',       en: '出去、出現',                     pos: '動詞' },
    { id: 79, tr: 'geçmek',       en: '通過、經過',                     pos: '動詞' },
    { id: 80, tr: 'kullanmak',    en: '使用',                           pos: '動詞' },

    // 名詞 Nouns (81–94)
    { id: 81, tr: 'şey',          en: '東西、事情',                     pos: '名詞' },
    { id: 82, tr: 'zaman',        en: '時間、時候',                     pos: '名詞' },
    { id: 83, tr: 'adam',         en: '男人、人',                       pos: '名詞' },
    { id: 84, tr: 'kadın',        en: '女人',                           pos: '名詞' },
    { id: 85, tr: 'çocuk',        en: '孩子',                           pos: '名詞' },
    { id: 86, tr: 'ev',           en: '房子、家',                       pos: '名詞' },
    { id: 87, tr: 'iş',           en: '工作、事業',                     pos: '名詞' },
    { id: 88, tr: 'gün',          en: '天、日',                         pos: '名詞' },
    { id: 89, tr: 'yıl',          en: '年',                             pos: '名詞' },
    { id: 90, tr: 'yer',          en: '地方、地點',                     pos: '名詞' },
    { id: 91, tr: 'şehir',        en: '城市',                           pos: '名詞' },
    { id: 92, tr: 'para',         en: '錢',                             pos: '名詞' },
    { id: 93, tr: 'su',           en: '水',                             pos: '名詞' },
    { id: 94, tr: 'yemek',        en: '食物、飯',                       pos: '名詞／動詞' },

    // 常用表達 Common expressions (95–99)
    { id: 95, tr: 'evet',         en: '是、對',                         pos: '表達' },
    { id: 96, tr: 'hayır',        en: '不、不是',                       pos: '表達' },
    { id: 97, tr: 'tamam',        en: '好的、行',                       pos: '表達' },
    { id: 98, tr: 'merhaba',      en: '你好',                           pos: '表達' },
    { id: 99, tr: 'teşekkürler',  en: '謝謝',                           pos: '表達' }
  ];

  var STORAGE_KEY         = 'srs-turkish-zht-v1';
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
