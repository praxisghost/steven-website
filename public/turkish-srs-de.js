(function () {
  'use strict';

  /* ── DECK — 100 türkische Kernwörter (Bedeutungen auf Deutsch) ─────────── */
  var DECK = [
    // Konjunktionen & Partikel (0–15)
    { id:  0, tr: 'bir',          en: 'ein / eine / eins',                pos: 'Artikel / Zahl' },
    { id:  1, tr: 've',           en: 'und',                              pos: 'Konjunktion' },
    { id:  2, tr: 'ama',          en: 'aber / jedoch',                    pos: 'Konjunktion' },
    { id:  3, tr: 'çünkü',        en: 'weil / denn',                      pos: 'Konjunktion' },
    { id:  4, tr: 'eğer',         en: 'wenn / falls',                     pos: 'Konjunktion' },
    { id:  5, tr: 'ya da',        en: 'oder',                             pos: 'Konjunktion' },
    { id:  6, tr: 'ki',           en: 'dass / damit / sodass',            pos: 'Konjunktion' },
    { id:  7, tr: 'için',         en: 'für / um … zu',                    pos: 'Postposition' },
    { id:  8, tr: 'ile',          en: 'mit / und',                        pos: 'Postposition' },
    { id:  9, tr: 'kadar',        en: 'bis / so viel wie',                pos: 'Postposition' },
    { id: 10, tr: 'gibi',         en: 'wie / ähnlich wie',                pos: 'Postposition' },
    { id: 11, tr: 'de / da',      en: 'auch / ebenfalls (Partikel)',      pos: 'Partikel' },
    { id: 12, tr: 'mi / mı',      en: 'Fragewort-Partikel',               pos: 'Partikel' },
    { id: 13, tr: 'değil',        en: 'nicht (Verneinungspartikel)',      pos: 'Partikel' },
    { id: 14, tr: 'var',          en: 'es gibt / vorhanden / haben',      pos: 'Partikel' },
    { id: 15, tr: 'yok',          en: 'es gibt nicht / fehlt / nicht haben', pos: 'Partikel' },

    // Pronomen & Fragewörter (16–29)
    { id: 16, tr: 'ben',          en: 'ich',                              pos: 'Pronomen' },
    { id: 17, tr: 'sen',          en: 'du',                               pos: 'Pronomen' },
    { id: 18, tr: 'o',            en: 'er / sie / es',                    pos: 'Pronomen' },
    { id: 19, tr: 'biz',          en: 'wir',                              pos: 'Pronomen' },
    { id: 20, tr: 'siz',          en: 'ihr / Sie (formell)',              pos: 'Pronomen' },
    { id: 21, tr: 'onlar',        en: 'sie (Plural)',                     pos: 'Pronomen' },
    { id: 22, tr: 'bu',           en: 'dieser / diese / dieses',          pos: 'Pronomen / Det.' },
    { id: 23, tr: 'şu',           en: 'jener / jene (in der Nähe)',       pos: 'Pronomen / Det.' },
    { id: 24, tr: 'ne',           en: 'was',                              pos: 'Fragewort' },
    { id: 25, tr: 'kim',          en: 'wer',                              pos: 'Fragewort' },
    { id: 26, tr: 'nerede',       en: 'wo',                               pos: 'Fragewort' },
    { id: 27, tr: 'nasıl',        en: 'wie',                              pos: 'Fragewort' },
    { id: 28, tr: 'neden',        en: 'warum / weshalb',                  pos: 'Fragewort' },
    { id: 29, tr: 'kendi',        en: 'selbst / eigen',                   pos: 'Pronomen' },

    // Adverbien (30–46)
    { id: 30, tr: 'çok',          en: 'sehr / viel / viele',              pos: 'Adverb' },
    { id: 31, tr: 'daha',         en: 'mehr / noch',                      pos: 'Adverb' },
    { id: 32, tr: 'artık',        en: 'jetzt / nicht mehr / schon',       pos: 'Adverb' },
    { id: 33, tr: 'hiç',          en: 'nie / überhaupt / irgendwie',      pos: 'Adverb' },
    { id: 34, tr: 'hep',          en: 'immer / ständig',                  pos: 'Adverb' },
    { id: 35, tr: 'şimdi',        en: 'jetzt / gerade',                   pos: 'Adverb' },
    { id: 36, tr: 'sonra',        en: 'später / danach',                  pos: 'Adverb' },
    { id: 37, tr: 'önce',         en: 'vorher / zuerst',                  pos: 'Adverb' },
    { id: 38, tr: 'belki',        en: 'vielleicht / möglicherweise',      pos: 'Adverb' },
    { id: 39, tr: 'hâlâ',         en: 'noch / immer noch',                pos: 'Adverb' },
    { id: 40, tr: 'yani',         en: 'das heißt / also',                 pos: 'Adverb' },
    { id: 41, tr: 'tabii',        en: 'natürlich / selbstverständlich',   pos: 'Adverb' },
    { id: 42, tr: 'birlikte',     en: 'zusammen / gemeinsam',             pos: 'Adverb' },
    { id: 43, tr: 'bence',        en: 'meiner Meinung nach',              pos: 'Adverb' },
    { id: 44, tr: 'zaten',        en: 'sowieso / ohnehin',                pos: 'Adverb' },
    { id: 45, tr: 'sadece',       en: 'nur / bloß',                       pos: 'Adverb' },
    { id: 46, tr: 'hemen',        en: 'sofort / gleich',                  pos: 'Adverb' },

    // Adjektive (47–62)
    { id: 47, tr: 'her',          en: 'jeder / jede / jedes',             pos: 'Adjektiv' },
    { id: 48, tr: 'bütün',        en: 'alle / ganz / gesamt',             pos: 'Adjektiv' },
    { id: 49, tr: 'iyi',          en: 'gut / wohl',                       pos: 'Adjektiv' },
    { id: 50, tr: 'büyük',        en: 'groß / bedeutend',                 pos: 'Adjektiv' },
    { id: 51, tr: 'küçük',        en: 'klein / gering',                   pos: 'Adjektiv' },
    { id: 52, tr: 'yeni',         en: 'neu / modern',                     pos: 'Adjektiv' },
    { id: 53, tr: 'eski',         en: 'alt / ehemalig / früher',          pos: 'Adjektiv' },
    { id: 54, tr: 'ilk',          en: 'erst- / anfänglich',               pos: 'Adjektiv' },
    { id: 55, tr: 'son',          en: 'letzt- / final',                   pos: 'Adjektiv' },
    { id: 56, tr: 'güzel',        en: 'schön / hübsch',                   pos: 'Adjektiv' },
    { id: 57, tr: 'doğru',        en: 'richtig / korrekt / Richtung',     pos: 'Adjektiv' },
    { id: 58, tr: 'başka',        en: 'ander- / verschieden',             pos: 'Adjektiv' },
    { id: 59, tr: 'aynı',         en: 'gleich / identisch',               pos: 'Adjektiv' },
    { id: 60, tr: 'önemli',       en: 'wichtig / bedeutend',              pos: 'Adjektiv' },
    { id: 61, tr: 'kolay',        en: 'leicht / einfach',                 pos: 'Adjektiv' },
    { id: 62, tr: 'zor',          en: 'schwer / schwierig',               pos: 'Adjektiv' },

    // Verben — Infinitivform (63–80)
    { id: 63, tr: 'olmak',        en: 'sein / werden',                    pos: 'Verb' },
    { id: 64, tr: 'yapmak',       en: 'machen / tun',                     pos: 'Verb' },
    { id: 65, tr: 'gelmek',       en: 'kommen',                           pos: 'Verb' },
    { id: 66, tr: 'gitmek',       en: 'gehen',                            pos: 'Verb' },
    { id: 67, tr: 'demek',        en: 'sagen / bedeuten',                 pos: 'Verb' },
    { id: 68, tr: 'bilmek',       en: 'wissen / können',                  pos: 'Verb' },
    { id: 69, tr: 'görmek',       en: 'sehen',                            pos: 'Verb' },
    { id: 70, tr: 'istemek',      en: 'wollen / möchten',                 pos: 'Verb' },
    { id: 71, tr: 'vermek',       en: 'geben',                            pos: 'Verb' },
    { id: 72, tr: 'almak',        en: 'nehmen / kaufen / bekommen',       pos: 'Verb' },
    { id: 73, tr: 'bakmak',       en: 'schauen / aufpassen auf',          pos: 'Verb' },
    { id: 74, tr: 'anlamak',      en: 'verstehen / begreifen',            pos: 'Verb' },
    { id: 75, tr: 'düşünmek',     en: 'denken / nachdenken',              pos: 'Verb' },
    { id: 76, tr: 'bulmak',       en: 'finden',                           pos: 'Verb' },
    { id: 77, tr: 'söylemek',     en: 'sagen / erzählen',                 pos: 'Verb' },
    { id: 78, tr: 'çıkmak',       en: 'hinausgehen / erscheinen',         pos: 'Verb' },
    { id: 79, tr: 'geçmek',       en: 'vergehen / passieren / durchqueren', pos: 'Verb' },
    { id: 80, tr: 'kullanmak',    en: 'benutzen / verwenden',             pos: 'Verb' },

    // Substantive (81–94)
    { id: 81, tr: 'şey',          en: 'Ding / Sache',                     pos: 'Substantiv' },
    { id: 82, tr: 'zaman',        en: 'Zeit / Zeitpunkt',                 pos: 'Substantiv' },
    { id: 83, tr: 'adam',         en: 'Mann / Person',                    pos: 'Substantiv' },
    { id: 84, tr: 'kadın',        en: 'Frau',                             pos: 'Substantiv' },
    { id: 85, tr: 'çocuk',        en: 'Kind',                             pos: 'Substantiv' },
    { id: 86, tr: 'ev',           en: 'Haus / Zuhause',                   pos: 'Substantiv' },
    { id: 87, tr: 'iş',           en: 'Arbeit / Job / Geschäft',          pos: 'Substantiv' },
    { id: 88, tr: 'gün',          en: 'Tag',                              pos: 'Substantiv' },
    { id: 89, tr: 'yıl',          en: 'Jahr',                             pos: 'Substantiv' },
    { id: 90, tr: 'yer',          en: 'Ort / Platz / Boden',              pos: 'Substantiv' },
    { id: 91, tr: 'şehir',        en: 'Stadt',                            pos: 'Substantiv' },
    { id: 92, tr: 'para',         en: 'Geld',                             pos: 'Substantiv' },
    { id: 93, tr: 'su',           en: 'Wasser',                           pos: 'Substantiv' },
    { id: 94, tr: 'yemek',        en: 'Essen / Mahlzeit',                 pos: 'Substantiv / Verb' },

    // Allgemeine Ausdrücke (95–99)
    { id: 95, tr: 'evet',         en: 'ja',                               pos: 'Ausdruck' },
    { id: 96, tr: 'hayır',        en: 'nein',                             pos: 'Ausdruck' },
    { id: 97, tr: 'tamam',        en: 'okay / in Ordnung',                pos: 'Ausdruck' },
    { id: 98, tr: 'merhaba',      en: 'hallo',                            pos: 'Ausdruck' },
    { id: 99, tr: 'teşekkürler',  en: 'danke',                            pos: 'Ausdruck' }
  ];

  var STORAGE_KEY        = 'srs-turkish-de-v1';
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

  /* ── ALGORITHMUS — SM-2 lite ─────────────────────────────────────────── */

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
    if (d < 1)   return '<1T';
    if (d < 30)  return d + 'T';
    if (d < 365) return Math.round(d / 30) + 'Mo';
    return Math.round(d / 365) + 'J';
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

  /* ── HILFSFUNKTIONEN ─────────────────────────────────────────────────── */

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
      '<span class="srs-count">Fertig&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;Übrig&nbsp;<b>' + remaining + '</b></span>' +
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
      '<span class="srs-hint">klicken zum Aufdecken</span>';
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
        '<span class="srs-key">1</span>&nbsp;Nochmal&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
      '</button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good">' +
        '<span class="srs-key">3</span>&nbsp;Gut&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span>' +
      '</button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }

  function renderDone() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">Sitzung abgeschlossen</div>' +
        '<div class="srs-done-sub">Alle Karten für heute wiederholt.</div>' +
        '<div class="srs-done-stats">' +
          sessionDone + '&nbsp;Karten in dieser Sitzung<br>' +
          seenCount() + '&nbsp;von&nbsp;' + DECK.length + '&nbsp;Wörtern bisher gesehen' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-restart">Nochmals üben</button>' +
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
        '<div class="srs-done-title">Nichts fällig</div>' +
        '<div class="srs-done-sub">Alle Karten sind für spätere Wiederholung geplant.</div>' +
        '<div class="srs-done-stats">' +
          seenCount() + '&nbsp;von&nbsp;' + DECK.length + '&nbsp;Wörtern bisher gesehen' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">Trotzdem neue Karten starten</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">Alles erledigt!</div>' +
            '<div class="srs-done-sub">Du hast alle ' + DECK.length + ' Wörter gesehen. Komm morgen für Wiederholungen zurück.</div>' +
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

  /* ── DOM-GERÜST ──────────────────────────────────────────────────────── */

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

  /* ── BEWERTUNG ───────────────────────────────────────────────────────── */

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

  /* ── TASTATUR ────────────────────────────────────────────────────────── */

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

    if (queue.length === 0) {
      renderNothingDue();
      return;
    }
    buildRootHTML();
    renderFront(queue[0]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('srs-root');
    if (!root) return;
    document.addEventListener('keydown', onKey);
    init();
  });

})();
