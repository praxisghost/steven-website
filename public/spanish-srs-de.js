(function () {
  'use strict';

  /* ── DECK — 100 spanische Kernwörter (Bedeutungen auf Deutsch) ────────── */
  var DECK = [
    // Konjunktionen, Partikel & Präpositionen (0–15)
    { id:  0, tr: 'y',               en: 'und',                                    pos: 'Konjunktion' },
    { id:  1, tr: 'pero',            en: 'aber / jedoch',                          pos: 'Konjunktion' },
    { id:  2, tr: 'porque',          en: 'weil / denn',                            pos: 'Konjunktion' },
    { id:  3, tr: 'si',              en: 'wenn / falls / ob',                      pos: 'Konjunktion' },
    { id:  4, tr: 'o',               en: 'oder',                                   pos: 'Konjunktion' },
    { id:  5, tr: 'que',             en: 'dass / was / welcher',                   pos: 'Konjunktion / Pronomen' },
    { id:  6, tr: 'de',              en: 'von / aus / über',                       pos: 'Präposition' },
    { id:  7, tr: 'en',              en: 'in / an / auf',                          pos: 'Präposition' },
    { id:  8, tr: 'a',               en: 'zu / nach / an',                         pos: 'Präposition' },
    { id:  9, tr: 'para',            en: 'für / um … zu',                          pos: 'Präposition' },
    { id: 10, tr: 'con',             en: 'mit',                                    pos: 'Präposition' },
    { id: 11, tr: 'por',             en: 'für / wegen / durch',                    pos: 'Präposition' },
    { id: 12, tr: 'sin',             en: 'ohne',                                   pos: 'Präposition' },
    { id: 13, tr: 'también',         en: 'auch / ebenfalls',                       pos: 'Partikel' },
    { id: 14, tr: 'no',              en: 'nicht / nein',                           pos: 'Partikel' },
    { id: 15, tr: 'ya',              en: 'schon / jetzt / nicht mehr',             pos: 'Partikel' },

    // Pronomen & Fragewörter (16–29)
    { id: 16, tr: 'yo',              en: 'ich',                                    pos: 'Pronomen' },
    { id: 17, tr: 'tú',              en: 'du',                                     pos: 'Pronomen' },
    { id: 18, tr: 'él / ella',       en: 'er / sie',                              pos: 'Pronomen' },
    { id: 19, tr: 'nosotros',        en: 'wir',                                    pos: 'Pronomen' },
    { id: 20, tr: 'ustedes',         en: 'ihr / Sie (formell)',                    pos: 'Pronomen' },
    { id: 21, tr: 'ellos / ellas',   en: 'sie (Plural)',                          pos: 'Pronomen' },
    { id: 22, tr: 'este / esta',     en: 'dieser / diese / dieses',               pos: 'Pronomen / Det.' },
    { id: 23, tr: 'ese / esa',       en: 'jener / jene / jenes',                  pos: 'Pronomen / Det.' },
    { id: 24, tr: 'qué',             en: 'was / welcher',                          pos: 'Fragewort' },
    { id: 25, tr: 'quién',           en: 'wer',                                    pos: 'Fragewort' },
    { id: 26, tr: 'dónde',           en: 'wo',                                     pos: 'Fragewort' },
    { id: 27, tr: 'cómo',            en: 'wie',                                    pos: 'Fragewort' },
    { id: 28, tr: 'por qué',         en: 'warum / weshalb',                        pos: 'Fragewort' },
    { id: 29, tr: 'cuándo',          en: 'wann',                                   pos: 'Fragewort' },

    // Adverbien (30–46)
    { id: 30, tr: 'muy',             en: 'sehr / viel',                            pos: 'Adverb' },
    { id: 31, tr: 'más',             en: 'mehr / noch',                            pos: 'Adverb' },
    { id: 32, tr: 'ahora',           en: 'jetzt / gerade',                         pos: 'Adverb' },
    { id: 33, tr: 'nunca',           en: 'nie / niemals',                          pos: 'Adverb' },
    { id: 34, tr: 'siempre',         en: 'immer / stets',                          pos: 'Adverb' },
    { id: 35, tr: 'después',         en: 'danach / später',                        pos: 'Adverb' },
    { id: 36, tr: 'antes',           en: 'vorher / früher',                        pos: 'Adverb' },
    { id: 37, tr: 'quizás',          en: 'vielleicht / möglicherweise',            pos: 'Adverb' },
    { id: 38, tr: 'todavía',         en: 'noch / immer noch',                      pos: 'Adverb' },
    { id: 39, tr: 'claro',           en: 'klar / natürlich',                       pos: 'Adverb' },
    { id: 40, tr: 'juntos',          en: 'zusammen / gemeinsam',                   pos: 'Adverb' },
    { id: 41, tr: 'de todas formas', en: 'sowieso / ohnehin',                      pos: 'Ausdruck' },
    { id: 42, tr: 'solo / solamente',en: 'nur / bloß / lediglich',                 pos: 'Adverb' },
    { id: 43, tr: 'enseguida',       en: 'sofort / gleich',                        pos: 'Adverb' },
    { id: 44, tr: 'bastante',        en: 'ziemlich / genug',                       pos: 'Adverb' },
    { id: 45, tr: 'poco',            en: 'wenig / kaum',                           pos: 'Adverb' },
    { id: 46, tr: 'mucho',           en: 'viel / sehr',                            pos: 'Adverb' },

    // Adjektive (47–62)
    { id: 47, tr: 'cada',            en: 'jeder / jede / jedes',                   pos: 'Adjektiv' },
    { id: 48, tr: 'todo',            en: 'alle / ganz / gesamt',                   pos: 'Adjektiv' },
    { id: 49, tr: 'bueno / buen',    en: 'gut',                                    pos: 'Adjektiv' },
    { id: 50, tr: 'grande / gran',   en: 'groß / bedeutend',                       pos: 'Adjektiv' },
    { id: 51, tr: 'pequeño',         en: 'klein / gering',                         pos: 'Adjektiv' },
    { id: 52, tr: 'nuevo',           en: 'neu / modern',                           pos: 'Adjektiv' },
    { id: 53, tr: 'viejo / antiguo', en: 'alt / ehemalig',                         pos: 'Adjektiv' },
    { id: 54, tr: 'primero / primer',en: 'erst- / anfänglich',                     pos: 'Adjektiv' },
    { id: 55, tr: 'último',          en: 'letzt- / final',                         pos: 'Adjektiv' },
    { id: 56, tr: 'bonito / hermoso',en: 'schön / hübsch',                         pos: 'Adjektiv' },
    { id: 57, tr: 'correcto / verdad',en: 'richtig / korrekt',                     pos: 'Adjektiv' },
    { id: 58, tr: 'otro',            en: 'ander- / ein weiterer',                  pos: 'Adjektiv' },
    { id: 59, tr: 'mismo',           en: 'gleich / identisch / selbst',            pos: 'Adjektiv' },
    { id: 60, tr: 'importante',      en: 'wichtig / bedeutend',                    pos: 'Adjektiv' },
    { id: 61, tr: 'fácil',           en: 'leicht / einfach',                       pos: 'Adjektiv' },
    { id: 62, tr: 'difícil',         en: 'schwer / schwierig',                     pos: 'Adjektiv' },

    // Verben — Infinitivform (63–80)
    { id: 63, tr: 'ser / estar',     en: 'sein / sich befinden',                   pos: 'Verb' },
    { id: 64, tr: 'hacer',           en: 'machen / tun',                           pos: 'Verb' },
    { id: 65, tr: 'venir',           en: 'kommen',                                 pos: 'Verb' },
    { id: 66, tr: 'ir',              en: 'gehen / fahren',                         pos: 'Verb' },
    { id: 67, tr: 'decir',           en: 'sagen / bedeuten',                       pos: 'Verb' },
    { id: 68, tr: 'saber',           en: 'wissen / können',                        pos: 'Verb' },
    { id: 69, tr: 'ver',             en: 'sehen',                                  pos: 'Verb' },
    { id: 70, tr: 'querer',          en: 'wollen / mögen / lieben',               pos: 'Verb' },
    { id: 71, tr: 'dar',             en: 'geben',                                  pos: 'Verb' },
    { id: 72, tr: 'tomar',           en: 'nehmen / trinken / greifen',             pos: 'Verb' },
    { id: 73, tr: 'mirar',           en: 'schauen / anschauen',                    pos: 'Verb' },
    { id: 74, tr: 'entender',        en: 'verstehen / begreifen',                  pos: 'Verb' },
    { id: 75, tr: 'pensar',          en: 'denken / nachdenken',                    pos: 'Verb' },
    { id: 76, tr: 'encontrar',       en: 'finden / treffen',                       pos: 'Verb' },
    { id: 77, tr: 'hablar',          en: 'sprechen / reden',                       pos: 'Verb' },
    { id: 78, tr: 'salir',           en: 'hinausgehen / ausgehen',                 pos: 'Verb' },
    { id: 79, tr: 'pasar',           en: 'vergehen / passieren / vorbeigehen',     pos: 'Verb' },
    { id: 80, tr: 'usar',            en: 'benutzen / verwenden',                   pos: 'Verb' },

    // Substantive (81–94)
    { id: 81, tr: 'cosa',            en: 'Ding / Sache',                           pos: 'Substantiv' },
    { id: 82, tr: 'tiempo',          en: 'Zeit / Wetter',                          pos: 'Substantiv' },
    { id: 83, tr: 'hombre',          en: 'Mann / Mensch',                          pos: 'Substantiv' },
    { id: 84, tr: 'mujer',           en: 'Frau',                                   pos: 'Substantiv' },
    { id: 85, tr: 'niño / niña',     en: 'Kind / Junge / Mädchen',                pos: 'Substantiv' },
    { id: 86, tr: 'casa',            en: 'Haus / Zuhause',                         pos: 'Substantiv' },
    { id: 87, tr: 'trabajo',         en: 'Arbeit / Job',                           pos: 'Substantiv' },
    { id: 88, tr: 'día',             en: 'Tag',                                    pos: 'Substantiv' },
    { id: 89, tr: 'año',             en: 'Jahr',                                   pos: 'Substantiv' },
    { id: 90, tr: 'lugar',           en: 'Ort / Platz',                            pos: 'Substantiv' },
    { id: 91, tr: 'ciudad',          en: 'Stadt',                                  pos: 'Substantiv' },
    { id: 92, tr: 'dinero',          en: 'Geld',                                   pos: 'Substantiv' },
    { id: 93, tr: 'agua',            en: 'Wasser',                                 pos: 'Substantiv' },
    { id: 94, tr: 'comida',          en: 'Essen / Mahlzeit',                       pos: 'Substantiv' },

    // Allgemeine Ausdrücke (95–99)
    { id: 95, tr: 'sí',              en: 'ja',                                     pos: 'Ausdruck' },
    { id: 96, tr: 'no',              en: 'nein',                                   pos: 'Ausdruck' },
    { id: 97, tr: 'vale / de acuerdo',en: 'okay / in Ordnung',                    pos: 'Ausdruck' },
    { id: 98, tr: 'hola',            en: 'hallo',                                  pos: 'Ausdruck' },
    { id: 99, tr: 'gracias',         en: 'danke',                                  pos: 'Ausdruck' }
  ];

  var STORAGE_KEY         = 'srs-spanish-de-v1';
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
