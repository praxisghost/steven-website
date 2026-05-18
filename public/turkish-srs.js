(function () {
  'use strict';

  /* ── DECK — 100 core Turkish words ──────────────────────────────────── */
  var DECK = [
    // Conjunctions & particles (0–15)
    { id:  0, tr: 'bir',          en: 'a / one',                        pos: 'article / num' },
    { id:  1, tr: 've',           en: 'and',                            pos: 'conjunction' },
    { id:  2, tr: 'ama',          en: 'but',                            pos: 'conjunction' },
    { id:  3, tr: 'çünkü',        en: 'because',                        pos: 'conjunction' },
    { id:  4, tr: 'eğer',         en: 'if',                             pos: 'conjunction' },
    { id:  5, tr: 'ya da',        en: 'or',                             pos: 'conjunction' },
    { id:  6, tr: 'ki',           en: 'that / so that',                 pos: 'conjunction' },
    { id:  7, tr: 'için',         en: 'for / in order to',              pos: 'postposition' },
    { id:  8, tr: 'ile',          en: 'with / and',                     pos: 'postposition' },
    { id:  9, tr: 'kadar',        en: 'until / as much as',             pos: 'postposition' },
    { id: 10, tr: 'gibi',         en: 'like / as',                      pos: 'postposition' },
    { id: 11, tr: 'de / da',      en: 'also / too (suffix)',            pos: 'particle' },
    { id: 12, tr: 'mi / mı',      en: 'question particle',              pos: 'particle' },
    { id: 13, tr: 'değil',        en: 'not (negation particle)',        pos: 'particle' },
    { id: 14, tr: 'var',          en: 'there is / exists',              pos: 'particle' },
    { id: 15, tr: 'yok',          en: "there isn't / doesn't exist",    pos: 'particle' },

    // Pronouns & question words (16–29)
    { id: 16, tr: 'ben',          en: 'I',                              pos: 'pronoun' },
    { id: 17, tr: 'sen',          en: 'you (singular)',                 pos: 'pronoun' },
    { id: 18, tr: 'o',            en: 'he / she / it',                  pos: 'pronoun' },
    { id: 19, tr: 'biz',          en: 'we',                             pos: 'pronoun' },
    { id: 20, tr: 'siz',          en: 'you (plural / formal)',          pos: 'pronoun' },
    { id: 21, tr: 'onlar',        en: 'they',                           pos: 'pronoun' },
    { id: 22, tr: 'bu',           en: 'this',                           pos: 'pronoun / det' },
    { id: 23, tr: 'şu',           en: 'that (near)',                    pos: 'pronoun / det' },
    { id: 24, tr: 'ne',           en: 'what',                           pos: 'question word' },
    { id: 25, tr: 'kim',          en: 'who',                            pos: 'question word' },
    { id: 26, tr: 'nerede',       en: 'where',                          pos: 'question word' },
    { id: 27, tr: 'nasıl',        en: 'how',                            pos: 'question word' },
    { id: 28, tr: 'neden',        en: 'why',                            pos: 'question word' },
    { id: 29, tr: 'kendi',        en: 'self / own',                     pos: 'pronoun' },

    // Adverbs (30–46)
    { id: 30, tr: 'çok',          en: 'very / much / many',             pos: 'adverb' },
    { id: 31, tr: 'daha',         en: 'more / still',                   pos: 'adverb' },
    { id: 32, tr: 'artık',        en: 'now / anymore / no longer',      pos: 'adverb' },
    { id: 33, tr: 'hiç',          en: 'never / at all / any',           pos: 'adverb' },
    { id: 34, tr: 'hep',          en: 'always / all the time',          pos: 'adverb' },
    { id: 35, tr: 'şimdi',        en: 'now',                            pos: 'adverb' },
    { id: 36, tr: 'sonra',        en: 'later / after',                  pos: 'adverb' },
    { id: 37, tr: 'önce',         en: 'before / first',                 pos: 'adverb' },
    { id: 38, tr: 'belki',        en: 'maybe / perhaps',                pos: 'adverb' },
    { id: 39, tr: 'hâlâ',         en: 'still / yet',                    pos: 'adverb' },
    { id: 40, tr: 'yani',         en: 'that is / so / meaning',         pos: 'adverb' },
    { id: 41, tr: 'tabii',        en: 'of course / naturally',          pos: 'adverb' },
    { id: 42, tr: 'birlikte',     en: 'together',                       pos: 'adverb' },
    { id: 43, tr: 'bence',        en: 'in my opinion',                  pos: 'adverb' },
    { id: 44, tr: 'zaten',        en: 'anyway / already',               pos: 'adverb' },
    { id: 45, tr: 'sadece',       en: 'only / just',                    pos: 'adverb' },
    { id: 46, tr: 'hemen',        en: 'immediately / right away',       pos: 'adverb' },

    // Adjectives (47–62)
    { id: 47, tr: 'her',          en: 'every / each',                   pos: 'adjective' },
    { id: 48, tr: 'bütün',        en: 'all / whole / entire',           pos: 'adjective' },
    { id: 49, tr: 'iyi',          en: 'good / well',                    pos: 'adjective' },
    { id: 50, tr: 'büyük',        en: 'big / large / great',            pos: 'adjective' },
    { id: 51, tr: 'küçük',        en: 'small / little',                 pos: 'adjective' },
    { id: 52, tr: 'yeni',         en: 'new',                            pos: 'adjective' },
    { id: 53, tr: 'eski',         en: 'old / former',                   pos: 'adjective' },
    { id: 54, tr: 'ilk',          en: 'first',                          pos: 'adjective' },
    { id: 55, tr: 'son',          en: 'last / final',                   pos: 'adjective' },
    { id: 56, tr: 'güzel',        en: 'beautiful / nice',               pos: 'adjective' },
    { id: 57, tr: 'doğru',        en: 'correct / right / toward',       pos: 'adjective' },
    { id: 58, tr: 'başka',        en: 'other / different / another',    pos: 'adjective' },
    { id: 59, tr: 'aynı',         en: 'same',                           pos: 'adjective' },
    { id: 60, tr: 'önemli',       en: 'important',                      pos: 'adjective' },
    { id: 61, tr: 'kolay',        en: 'easy',                           pos: 'adjective' },
    { id: 62, tr: 'zor',          en: 'difficult / hard',               pos: 'adjective' },

    // Verbs — infinitive form (63–80)
    { id: 63, tr: 'olmak',        en: 'to be / become',                 pos: 'verb' },
    { id: 64, tr: 'yapmak',       en: 'to do / make',                   pos: 'verb' },
    { id: 65, tr: 'gelmek',       en: 'to come',                        pos: 'verb' },
    { id: 66, tr: 'gitmek',       en: 'to go',                          pos: 'verb' },
    { id: 67, tr: 'demek',        en: 'to say / mean',                  pos: 'verb' },
    { id: 68, tr: 'bilmek',       en: 'to know',                        pos: 'verb' },
    { id: 69, tr: 'görmek',       en: 'to see',                         pos: 'verb' },
    { id: 70, tr: 'istemek',      en: 'to want',                        pos: 'verb' },
    { id: 71, tr: 'vermek',       en: 'to give',                        pos: 'verb' },
    { id: 72, tr: 'almak',        en: 'to take / get / buy',            pos: 'verb' },
    { id: 73, tr: 'bakmak',       en: 'to look / watch / take care of', pos: 'verb' },
    { id: 74, tr: 'anlamak',      en: 'to understand',                  pos: 'verb' },
    { id: 75, tr: 'düşünmek',     en: 'to think',                       pos: 'verb' },
    { id: 76, tr: 'bulmak',       en: 'to find',                        pos: 'verb' },
    { id: 77, tr: 'söylemek',     en: 'to tell / say',                  pos: 'verb' },
    { id: 78, tr: 'çıkmak',       en: 'to go out / exit / come up',     pos: 'verb' },
    { id: 79, tr: 'geçmek',       en: 'to pass / go through',           pos: 'verb' },
    { id: 80, tr: 'kullanmak',    en: 'to use',                         pos: 'verb' },

    // Nouns (81–94)
    { id: 81, tr: 'şey',          en: 'thing',                          pos: 'noun' },
    { id: 82, tr: 'zaman',        en: 'time',                           pos: 'noun' },
    { id: 83, tr: 'adam',         en: 'man / person',                   pos: 'noun' },
    { id: 84, tr: 'kadın',        en: 'woman',                          pos: 'noun' },
    { id: 85, tr: 'çocuk',        en: 'child',                          pos: 'noun' },
    { id: 86, tr: 'ev',           en: 'house / home',                   pos: 'noun' },
    { id: 87, tr: 'iş',           en: 'work / job / business',          pos: 'noun' },
    { id: 88, tr: 'gün',          en: 'day',                            pos: 'noun' },
    { id: 89, tr: 'yıl',          en: 'year',                           pos: 'noun' },
    { id: 90, tr: 'yer',          en: 'place / ground',                 pos: 'noun' },
    { id: 91, tr: 'şehir',        en: 'city',                           pos: 'noun' },
    { id: 92, tr: 'para',         en: 'money',                          pos: 'noun' },
    { id: 93, tr: 'su',           en: 'water',                          pos: 'noun' },
    { id: 94, tr: 'yemek',        en: 'food / meal',                    pos: 'noun / verb' },

    // Common expressions (95–99)
    { id: 95, tr: 'evet',         en: 'yes',                            pos: 'expression' },
    { id: 96, tr: 'hayır',        en: 'no',                             pos: 'expression' },
    { id: 97, tr: 'tamam',        en: 'okay / alright',                 pos: 'expression' },
    { id: 98, tr: 'merhaba',      en: 'hello',                          pos: 'expression' },
    { id: 99, tr: 'teşekkürler',  en: 'thank you',                      pos: 'expression' }
  ];

  var STORAGE_KEY        = 'srs-turkish-v1';
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
    return Math.floor(Date.now() / 86400000); // days since Unix epoch
  }

  function schedule(state, good) {
    if (!good) {
      // Again — reset reps, shrink EF slightly, due tomorrow
      state.reps     = 0;
      state.interval = 1;
      state.ef       = Math.max(1.3, state.ef - 0.2);
    } else {
      // Good — grow interval with EF, increase EF slightly
      if (state.reps === 0) {
        state.interval = 1;
      } else if (state.reps === 1) {
        state.interval = 6;
      } else {
        state.interval = Math.round(state.interval * state.ef);
      }
      state.ef  = Math.min(2.5, state.ef + 0.1);
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
      '<span class="srs-count">Done&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;Left&nbsp;<b>' + remaining + '</b></span>' +
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
      '<span class="srs-hint">click to reveal</span>';
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
        '<span class="srs-key">1</span>&nbsp;Again&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
      '</button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good">' +
        '<span class="srs-key">3</span>&nbsp;Good&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span>' +
      '</button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }

  function renderDone() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">Session complete</div>' +
        '<div class="srs-done-sub">All cards reviewed for today.</div>' +
        '<div class="srs-done-stats">' +
          sessionDone + '&nbsp;cards reviewed this session<br>' +
          seenCount() + '&nbsp;of&nbsp;' + DECK.length + '&nbsp;words seen so far' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-restart">Review again</button>' +
      '</div>';
    document.getElementById('btn-restart').addEventListener('click', function () {
      // Re-queue today's session cards for an immediate drill
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
        '<div class="srs-done-title">Nothing due</div>' +
        '<div class="srs-done-sub">All cards are scheduled for future review.</div>' +
        '<div class="srs-done-stats">' +
          seenCount() + '&nbsp;of&nbsp;' + DECK.length + '&nbsp;words seen so far' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">Start new cards anyway</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      // Force a session with up to MAX_NEW_PER_SESSION truly new cards
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">All done!</div>' +
            '<div class="srs-done-sub">You\'ve seen all ' + DECK.length + ' words. Come back tomorrow for reviews.</div>' +
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
    // Re-queue at the end of the current session so the card comes back
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
