(function () {
  'use strict';

  /* ── DECK — 100 core Spanish words (Spanish ↔ Traditional Chinese) ───── */
  var DECK = [
    // 連接詞與小品詞 Conjunctions & particles (0–9)
    { id:  0, tr: 'un / una',        en: '一個（不定冠詞）',               pos: '冠詞' },
    { id:  1, tr: 'el / la',         en: '這個／那個（定冠詞）',            pos: '冠詞' },
    { id:  2, tr: 'y',               en: '和、與',                         pos: '連接詞' },
    { id:  3, tr: 'pero',            en: '但是',                           pos: '連接詞' },
    { id:  4, tr: 'porque',          en: '因為',                           pos: '連接詞' },
    { id:  5, tr: 'si',              en: '如果',                           pos: '連接詞' },
    { id:  6, tr: 'o',               en: '或者',                           pos: '連接詞' },
    { id:  7, tr: 'que',             en: '那、的（關係詞）',                pos: '連接詞' },
    { id:  8, tr: 'con',             en: '和、跟（介詞）',                  pos: '介詞' },
    { id:  9, tr: 'para',            en: '為了、給（介詞）',                pos: '介詞' },

    // 代詞與疑問詞 Pronouns & question words (10–24)
    { id: 10, tr: 'yo',              en: '我',                             pos: '代詞' },
    { id: 11, tr: 'tú',              en: '你',                             pos: '代詞' },
    { id: 12, tr: 'él / ella',       en: '他／她',                         pos: '代詞' },
    { id: 13, tr: 'nosotros',        en: '我們',                           pos: '代詞' },
    { id: 14, tr: 'vosotros',        en: '你們（西班牙用法）',              pos: '代詞' },
    { id: 15, tr: 'ellos / ellas',   en: '他們／她們',                     pos: '代詞' },
    { id: 16, tr: 'usted',           en: '您（正式）',                     pos: '代詞' },
    { id: 17, tr: 'este / esta',     en: '這個',                           pos: '代詞／形容詞' },
    { id: 18, tr: 'ese / esa',       en: '那個',                           pos: '代詞／形容詞' },
    { id: 19, tr: 'qué',             en: '什麼',                           pos: '疑問詞' },
    { id: 20, tr: 'quién',           en: '誰',                             pos: '疑問詞' },
    { id: 21, tr: 'dónde',           en: '在哪裡',                         pos: '疑問詞' },
    { id: 22, tr: 'cómo',            en: '怎麼、如何',                     pos: '疑問詞' },
    { id: 23, tr: 'cuándo',          en: '什麼時候',                       pos: '疑問詞' },
    { id: 24, tr: 'por qué',         en: '為什麼',                         pos: '疑問詞' },

    // 副詞 Adverbs (25–39)
    { id: 25, tr: 'muy',             en: '非常、很',                       pos: '副詞' },
    { id: 26, tr: 'más',             en: '更、更多',                       pos: '副詞' },
    { id: 27, tr: 'también',         en: '也、同樣',                       pos: '副詞' },
    { id: 28, tr: 'ya',              en: '已經、現在',                     pos: '副詞' },
    { id: 29, tr: 'siempre',         en: '總是、永遠',                     pos: '副詞' },
    { id: 30, tr: 'nunca',           en: '從不、絕不',                     pos: '副詞' },
    { id: 31, tr: 'ahora',           en: '現在',                           pos: '副詞' },
    { id: 32, tr: 'después',         en: '之後、然後',                     pos: '副詞' },
    { id: 33, tr: 'antes',           en: '之前、以前',                     pos: '副詞' },
    { id: 34, tr: 'aquí',            en: '這裡',                           pos: '副詞' },
    { id: 35, tr: 'allí',            en: '那裡',                           pos: '副詞' },
    { id: 36, tr: 'solo / sólo',     en: '只、僅僅',                       pos: '副詞' },
    { id: 37, tr: 'bien',            en: '好、很好',                       pos: '副詞' },
    { id: 38, tr: 'mal',             en: '不好、壞',                       pos: '副詞' },
    { id: 39, tr: 'quizás',          en: '也許、可能',                     pos: '副詞' },

    // 形容詞 Adjectives (40–54)
    { id: 40, tr: 'bueno / buena',   en: '好的',                           pos: '形容詞' },
    { id: 41, tr: 'malo / mala',     en: '壞的、不好的',                   pos: '形容詞' },
    { id: 42, tr: 'grande',          en: '大的',                           pos: '形容詞' },
    { id: 43, tr: 'pequeño / -a',    en: '小的',                           pos: '形容詞' },
    { id: 44, tr: 'nuevo / nueva',   en: '新的',                           pos: '形容詞' },
    { id: 45, tr: 'viejo / vieja',   en: '舊的、老的',                     pos: '形容詞' },
    { id: 46, tr: 'primer / primero',en: '第一',                           pos: '形容詞' },
    { id: 47, tr: 'último / última', en: '最後、最近的',                   pos: '形容詞' },
    { id: 48, tr: 'mucho / mucha',   en: '很多、許多',                     pos: '形容詞' },
    { id: 49, tr: 'poco / poca',     en: '一點、少量',                     pos: '形容詞' },
    { id: 50, tr: 'mismo / misma',   en: '相同的、自己',                   pos: '形容詞' },
    { id: 51, tr: 'otro / otra',     en: '另一個',                         pos: '形容詞' },
    { id: 52, tr: 'todo / toda',     en: '所有的、全部',                   pos: '形容詞' },
    { id: 53, tr: 'fácil',           en: '容易的',                         pos: '形容詞' },
    { id: 54, tr: 'difícil',         en: '困難的',                         pos: '形容詞' },

    // 動詞 Verbs (55–79)
    { id: 55, tr: 'ser',             en: '是（本質）',                     pos: '動詞' },
    { id: 56, tr: 'estar',           en: '是、在（狀態／位置）',           pos: '動詞' },
    { id: 57, tr: 'tener',           en: '有、擁有',                       pos: '動詞' },
    { id: 58, tr: 'hacer',           en: '做、製作',                       pos: '動詞' },
    { id: 59, tr: 'ir',              en: '去',                             pos: '動詞' },
    { id: 60, tr: 'venir',           en: '來',                             pos: '動詞' },
    { id: 61, tr: 'decir',           en: '說、告訴',                       pos: '動詞' },
    { id: 62, tr: 'saber',           en: '知道（事實）',                   pos: '動詞' },
    { id: 63, tr: 'conocer',         en: '認識（人／地）',                 pos: '動詞' },
    { id: 64, tr: 'ver',             en: '看見',                           pos: '動詞' },
    { id: 65, tr: 'querer',          en: '想要、愛',                       pos: '動詞' },
    { id: 66, tr: 'poder',           en: '能夠、可以',                     pos: '動詞' },
    { id: 67, tr: 'deber',           en: '應該、必須',                     pos: '動詞' },
    { id: 68, tr: 'dar',             en: '給',                             pos: '動詞' },
    { id: 69, tr: 'tomar',           en: '拿、取、喝',                     pos: '動詞' },
    { id: 70, tr: 'hablar',          en: '說話、講',                       pos: '動詞' },
    { id: 71, tr: 'escuchar',        en: '聽',                             pos: '動詞' },
    { id: 72, tr: 'leer',            en: '閱讀',                           pos: '動詞' },
    { id: 73, tr: 'escribir',        en: '寫',                             pos: '動詞' },
    { id: 74, tr: 'entender',        en: '理解、明白',                     pos: '動詞' },
    { id: 75, tr: 'pensar',          en: '想、思考',                       pos: '動詞' },
    { id: 76, tr: 'encontrar',       en: '找到、遇見',                     pos: '動詞' },
    { id: 77, tr: 'usar',            en: '使用',                           pos: '動詞' },
    { id: 78, tr: 'necesitar',       en: '需要',                           pos: '動詞' },
    { id: 79, tr: 'llamarse',        en: '叫做、名字是',                   pos: '動詞' },

    // 名詞 Nouns (80–94)
    { id: 80, tr: 'cosa',            en: '東西、事物',                     pos: '名詞' },
    { id: 81, tr: 'tiempo',          en: '時間、天氣',                     pos: '名詞' },
    { id: 82, tr: 'hombre',          en: '男人、男性',                     pos: '名詞' },
    { id: 83, tr: 'mujer',           en: '女人、女性',                     pos: '名詞' },
    { id: 84, tr: 'niño / niña',     en: '孩子',                           pos: '名詞' },
    { id: 85, tr: 'casa',            en: '房子、家',                       pos: '名詞' },
    { id: 86, tr: 'trabajo',         en: '工作',                           pos: '名詞' },
    { id: 87, tr: 'día',             en: '天、日',                         pos: '名詞' },
    { id: 88, tr: 'año',             en: '年',                             pos: '名詞' },
    { id: 89, tr: 'ciudad',          en: '城市',                           pos: '名詞' },
    { id: 90, tr: 'dinero',          en: '錢',                             pos: '名詞' },
    { id: 91, tr: 'agua',            en: '水',                             pos: '名詞' },
    { id: 92, tr: 'comida',          en: '食物、飯',                       pos: '名詞' },
    { id: 93, tr: 'palabra',         en: '詞、字',                         pos: '名詞' },
    { id: 94, tr: 'idioma',          en: '語言',                           pos: '名詞' },

    // 常用表達 Common expressions (95–99)
    { id: 95, tr: 'sí',              en: '是、對',                         pos: '表達' },
    { id: 96, tr: 'no',              en: '不、沒有',                       pos: '表達' },
    { id: 97, tr: 'vale / okay',     en: '好的、行',                       pos: '表達' },
    { id: 98, tr: 'hola',            en: '你好',                           pos: '表達' },
    { id: 99, tr: 'gracias',         en: '謝謝',                           pos: '表達' }
  ];

  var STORAGE_KEY         = 'srs-spanish-zht-v1';
  var MAX_NEW_PER_SESSION = 20;

  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  /* ── STORAGE ─────────────────────────────────────────────────────────── */

  function loadStates() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStates() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(states)); } catch (e) {}
  }

  function getState(id) {
    if (!states[id]) {
      states[id] = { interval: 0, ef: 2.5, reps: 0, due: 0 };
    }
    return states[id];
  }

  /* ── ALGORITHM — SM-2 lite ───────────────────────────────────────────── */

  function today() {
    return Math.floor(Date.now() / 86400000);
  }

  function schedule(state, good) {
    if (!good) {
      state.reps     = 0;
      state.interval = 1;
      state.ef       = Math.max(1.3, state.ef - 0.2);
    } else {
      if (state.reps === 0) {
        state.interval = 1;
      } else if (state.reps === 1) {
        state.interval = 6;
      } else {
        state.interval = Math.round(state.interval * state.ef);
      }
      state.ef   = Math.min(2.5, state.ef + 0.1);
      state.reps += 1;
    }
    state.due = today() + state.interval;
  }

  function previewIntervals(state) {
    var good;
    if (state.reps === 0) {
      good = 1;
    } else if (state.reps === 1) {
      good = 6;
    } else {
      good = Math.round(state.interval * state.ef);
    }
    return { again: 1, good: good };
  }

  function fmtDays(d) {
    if (d < 1)   return '<1d';
    if (d < 30)  return d + 'd';
    if (d < 365) return Math.round(d / 30) + 'mo';
    return Math.round(d / 365) + 'y';
  }

  /* ── QUEUE ───────────────────────────────────────────────────────────── */

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j   = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i]  = arr[j];
      arr[j]  = tmp;
    }
    return arr;
  }

  function buildQueue() {
    var t = today();
    var due = [], newCards = [];
    DECK.forEach(function (card) {
      var s = getState(card.id);
      if (s.reps > 0 && s.due <= t) {
        due.push(card);
      } else if (s.reps === 0) {
        newCards.push(card);
      }
    });
    shuffle(due);
    shuffle(newCards);
    return due.concat(newCards.slice(0, MAX_NEW_PER_SESSION));
  }

  /* ── HELPERS ─────────────────────────────────────────────────────────── */

  function esc(s) {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  function seenCount() {
    return DECK.filter(function (c) { return getState(c.id).reps > 0; }).length;
  }

  /* ── RENDER ──────────────────────────────────────────────────────────── */

  function renderMeta() {
    var metaEl = document.getElementById('srs-meta');
    if (!metaEl) return;
    var remaining = queue.length - queueIdx;
    var pct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0;
    metaEl.innerHTML =
      '<span class="srs-count">已完成&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;剩餘&nbsp;<b>' + remaining + '</b></span>' +
      '<div class="srs-bar-wrap"><div class="srs-bar" style="width:' + pct + '%"></div></div>';
  }

  function renderFront(card) {
    var cardEl = document.getElementById('srs-card');
    var actEl  = document.getElementById('srs-actions');
    if (!cardEl || !actEl) return;
    revealed = false;
    cardEl.className   = 'srs-card';
    cardEl.innerHTML   =
      '<span class="srs-turkish">' + esc(card.tr) + '</span>' +
      '<span class="srs-pos">'     + esc(card.pos) + '</span>' +
      '<span class="srs-hint">點擊顯示答案</span>';
    actEl.innerHTML = '';
    renderMeta();
  }

  function renderBack(card) {
    var cardEl = document.getElementById('srs-card');
    var actEl  = document.getElementById('srs-actions');
    if (!cardEl || !actEl) return;
    revealed = true;
    var state   = getState(card.id);
    var preview = previewIntervals(state);
    cardEl.className = 'srs-card revealed';
    cardEl.innerHTML =
      '<span class="srs-turkish">' + esc(card.tr)  + '</span>' +
      '<span class="srs-pos">'     + esc(card.pos) + '</span>' +
      '<div class="srs-divider"></div>' +
      '<span class="srs-english">' + esc(card.en)  + '</span>';
    actEl.innerHTML =
      '<button class="srs-btn srs-btn-again" id="btn-again">' +
        '<span class="srs-key">1</span>&nbsp;再試&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
      '</button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good">' +
        '<span class="srs-key">3</span>&nbsp;記住了&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span>' +
      '</button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }

  function renderDone() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">本次練習完成</div>' +
        '<div class="srs-done-sub">今天的所有單字已複習完畢。</div>' +
        '<div class="srs-done-stats">' +
          '本次複習了&nbsp;' + sessionDone + '&nbsp;張卡片<br>' +
          '已學習&nbsp;' + seenCount() + '&nbsp;／&nbsp;' + DECK.length + '&nbsp;個單字' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-restart">再練習一次</button>' +
      '</div>';
    document.getElementById('btn-restart').addEventListener('click', function () {
      var t = today();
      queue.forEach(function (card) {
        var s = getState(card.id);
        s.due = t;
      });
      init();
    });
  }

  function renderNothingDue() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">今天沒有到期的卡片</div>' +
        '<div class="srs-done-sub">所有卡片均已排程至未來複習。</div>' +
        '<div class="srs-done-stats">' +
          '已學習&nbsp;' + seenCount() + '&nbsp;／&nbsp;' + DECK.length + '&nbsp;個單字' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">繼續學習新單字</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">全部完成！</div>' +
            '<div class="srs-done-sub">你已學習全部&nbsp;' + DECK.length + '&nbsp;個單字，請明天回來複習。</div>' +
          '</div>';
        return;
      }
      queue        = shuffle(newCards);
      queueIdx     = 0;
      sessionDone  = 0;
      sessionTotal = queue.length;
      buildRootHTML();
      renderFront(queue[0]);
    });
  }

  /* ── DOM SCAFFOLDING ─────────────────────────────────────────────────── */

  function buildRootHTML() {
    root.innerHTML =
      '<div class="srs-meta"    id="srs-meta"></div>'    +
      '<div class="srs-card"    id="srs-card"></div>'    +
      '<div class="srs-actions" id="srs-actions"></div>';
    document.getElementById('srs-card').addEventListener('click', function () {
      if (!revealed && queue[queueIdx]) {
        renderBack(queue[queueIdx]);
      }
    });
  }

  /* ── GRADING ─────────────────────────────────────────────────────────── */

  function handleAgain() {
    if (!revealed) return;
    var card = queue[queueIdx];
    schedule(getState(card.id), false);
    saveStates();
    queue.push(card);
    sessionTotal++;
    advance();
  }

  function handleGood() {
    if (!revealed) return;
    var card = queue[queueIdx];
    schedule(getState(card.id), true);
    saveStates();
    sessionDone++;
    advance();
  }

  function advance() {
    queueIdx++;
    if (queueIdx >= queue.length) {
      renderDone();
    } else {
      renderFront(queue[queueIdx]);
    }
  }

  /* ── KEYBOARD ────────────────────────────────────────────────────────── */

  function onKey(e) {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!revealed && queue && queue[queueIdx]) {
        renderBack(queue[queueIdx]);
      }
    } else if (e.key === '1') {
      if (revealed) handleAgain();
    } else if (e.key === '3') {
      if (revealed) handleGood();
    }
  }

  /* ── INIT ────────────────────────────────────────────────────────────── */

  function init() {
    states       = loadStates();
    queue        = buildQueue();
    queueIdx     = 0;
    sessionDone  = 0;
    sessionTotal = queue.length;
    revealed     = false;

    if (queue.length === 0) {
      renderNothingDue();
      return;
    }

    buildRootHTML();
    renderFront(queue[0]);
  }

  function setup() {
    root = document.getElementById('srs-root');
    if (!root) return;
    document.addEventListener('keydown', onKey);
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

}());
