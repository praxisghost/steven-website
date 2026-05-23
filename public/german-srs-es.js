(function () {
  'use strict';

  /* ── MAZO — 100 palabras clave del alemán (significados en español) ─── */
  var DECK = [
    // Conjunciones, partículas y preposiciones (0–15)
    { id:  0, tr: 'und',             en: 'y',                                      pos: 'Conjunción' },
    { id:  1, tr: 'aber',            en: 'pero / sin embargo',                     pos: 'Conjunción' },
    { id:  2, tr: 'weil',            en: 'porque / ya que',                        pos: 'Conjunción' },
    { id:  3, tr: 'wenn',            en: 'si / cuando',                            pos: 'Conjunción' },
    { id:  4, tr: 'oder',            en: 'o',                                      pos: 'Conjunción' },
    { id:  5, tr: 'dass',            en: 'que (conjunción)',                       pos: 'Conjunción' },
    { id:  6, tr: 'von',             en: 'de / desde / por',                      pos: 'Preposición' },
    { id:  7, tr: 'in',              en: 'en / dentro de',                        pos: 'Preposición' },
    { id:  8, tr: 'zu',              en: 'a / hacia / para',                      pos: 'Preposición' },
    { id:  9, tr: 'für',             en: 'para / por (a favor de)',               pos: 'Preposición' },
    { id: 10, tr: 'mit',             en: 'con',                                    pos: 'Preposición' },
    { id: 11, tr: 'ohne',            en: 'sin',                                    pos: 'Preposición' },
    { id: 12, tr: 'auch',            en: 'también / además',                       pos: 'Partícula' },
    { id: 13, tr: 'nicht',           en: 'no / nada',                             pos: 'Partícula' },
    { id: 14, tr: 'schon',           en: 'ya / antes / de hecho',                 pos: 'Partícula' },
    { id: 15, tr: 'nur',             en: 'solo / solamente',                       pos: 'Partícula' },

    // Pronombres y palabras interrogativas (16–29)
    { id: 16, tr: 'ich',             en: 'yo',                                     pos: 'Pronombre' },
    { id: 17, tr: 'du',              en: 'tú',                                     pos: 'Pronombre' },
    { id: 18, tr: 'er / sie',        en: 'él / ella',                             pos: 'Pronombre' },
    { id: 19, tr: 'wir',             en: 'nosotros',                               pos: 'Pronombre' },
    { id: 20, tr: 'ihr / Sie',       en: 'vosotros / ustedes (formal)',            pos: 'Pronombre' },
    { id: 21, tr: 'sie (Pl.)',       en: 'ellos / ellas',                         pos: 'Pronombre' },
    { id: 22, tr: 'dieser / diese',  en: 'este / esta / esto',                    pos: 'Pronombre / Det.' },
    { id: 23, tr: 'jener / jene',    en: 'ese / esa / eso',                       pos: 'Pronombre / Det.' },
    { id: 24, tr: 'was',             en: 'qué / lo que',                          pos: 'Interrogativo' },
    { id: 25, tr: 'wer',             en: 'quién',                                  pos: 'Interrogativo' },
    { id: 26, tr: 'wo',              en: 'dónde',                                  pos: 'Interrogativo' },
    { id: 27, tr: 'wie',             en: 'cómo / qué tal',                        pos: 'Interrogativo' },
    { id: 28, tr: 'warum',           en: 'por qué',                               pos: 'Interrogativo' },
    { id: 29, tr: 'wann',            en: 'cuándo',                                 pos: 'Interrogativo' },

    // Adverbios (30–46)
    { id: 30, tr: 'sehr',            en: 'muy / mucho',                            pos: 'Adverbio' },
    { id: 31, tr: 'mehr',            en: 'más',                                    pos: 'Adverbio' },
    { id: 32, tr: 'jetzt',           en: 'ahora / en este momento',               pos: 'Adverbio' },
    { id: 33, tr: 'nie',             en: 'nunca / jamás',                          pos: 'Adverbio' },
    { id: 34, tr: 'immer',           en: 'siempre',                                pos: 'Adverbio' },
    { id: 35, tr: 'danach',          en: 'después / luego',                        pos: 'Adverbio' },
    { id: 36, tr: 'vorher',          en: 'antes / anteriormente',                  pos: 'Adverbio' },
    { id: 37, tr: 'vielleicht',      en: 'quizás / tal vez',                      pos: 'Adverbio' },
    { id: 38, tr: 'noch',            en: 'todavía / aún',                          pos: 'Adverbio' },
    { id: 39, tr: 'natürlich',       en: 'claro / por supuesto / naturalmente',    pos: 'Adverbio' },
    { id: 40, tr: 'zusammen',        en: 'juntos / conjuntamente',                 pos: 'Adverbio' },
    { id: 41, tr: 'sowieso',         en: 'de todas formas / de todos modos',       pos: 'Adverbio' },
    { id: 42, tr: 'gleich',          en: 'enseguida / ahora mismo / igual',        pos: 'Adverbio' },
    { id: 43, tr: 'ziemlich',        en: 'bastante / considerablemente',           pos: 'Adverbio' },
    { id: 44, tr: 'wenig',           en: 'poco / apenas',                          pos: 'Adverbio' },
    { id: 45, tr: 'viel',            en: 'mucho / bastante',                       pos: 'Adverbio' },
    { id: 46, tr: 'sofort',          en: 'enseguida / de inmediato',               pos: 'Adverbio' },

    // Adjetivos (47–62)
    { id: 47, tr: 'jeder / jede',    en: 'cada / todo',                            pos: 'Adjetivo' },
    { id: 48, tr: 'alle',            en: 'todos / todas',                          pos: 'Adjetivo' },
    { id: 49, tr: 'gut',             en: 'bueno / bien',                           pos: 'Adjetivo' },
    { id: 50, tr: 'groß',            en: 'grande / alto',                          pos: 'Adjetivo' },
    { id: 51, tr: 'klein',           en: 'pequeño / bajo',                         pos: 'Adjetivo' },
    { id: 52, tr: 'neu',             en: 'nuevo / moderno',                        pos: 'Adjetivo' },
    { id: 53, tr: 'alt',             en: 'viejo / antiguo',                        pos: 'Adjetivo' },
    { id: 54, tr: 'erste',           en: 'primero',                                pos: 'Adjetivo' },
    { id: 55, tr: 'letzte',          en: 'último / pasado',                        pos: 'Adjetivo' },
    { id: 56, tr: 'schön',           en: 'bonito / hermoso',                       pos: 'Adjetivo' },
    { id: 57, tr: 'richtig',         en: 'correcto / verdadero / realmente',       pos: 'Adjetivo' },
    { id: 58, tr: 'andere',          en: 'otro / diferente',                       pos: 'Adjetivo' },
    { id: 59, tr: 'gleiche',         en: 'mismo / igual / idéntico',               pos: 'Adjetivo' },
    { id: 60, tr: 'wichtig',         en: 'importante',                             pos: 'Adjetivo' },
    { id: 61, tr: 'einfach',         en: 'fácil / sencillo / simplemente',         pos: 'Adjetivo' },
    { id: 62, tr: 'schwierig',       en: 'difícil / complicado',                   pos: 'Adjetivo' },

    // Verbos — forma infinitiva (63–80)
    { id: 63, tr: 'sein',            en: 'ser / estar',                            pos: 'Verbo' },
    { id: 64, tr: 'machen',          en: 'hacer',                                  pos: 'Verbo' },
    { id: 65, tr: 'kommen',          en: 'venir / llegar',                         pos: 'Verbo' },
    { id: 66, tr: 'gehen',           en: 'ir / caminar',                           pos: 'Verbo' },
    { id: 67, tr: 'sagen',           en: 'decir / hablar',                         pos: 'Verbo' },
    { id: 68, tr: 'wissen',          en: 'saber / conocer',                        pos: 'Verbo' },
    { id: 69, tr: 'sehen',           en: 'ver',                                    pos: 'Verbo' },
    { id: 70, tr: 'wollen',          en: 'querer / desear',                        pos: 'Verbo' },
    { id: 71, tr: 'geben',           en: 'dar',                                    pos: 'Verbo' },
    { id: 72, tr: 'nehmen',          en: 'tomar / coger',                          pos: 'Verbo' },
    { id: 73, tr: 'schauen',         en: 'mirar / ver',                            pos: 'Verbo' },
    { id: 74, tr: 'verstehen',       en: 'entender / comprender',                  pos: 'Verbo' },
    { id: 75, tr: 'denken',          en: 'pensar / creer',                         pos: 'Verbo' },
    { id: 76, tr: 'finden',          en: 'encontrar / hallar',                     pos: 'Verbo' },
    { id: 77, tr: 'sprechen',        en: 'hablar / decir',                         pos: 'Verbo' },
    { id: 78, tr: 'lassen',          en: 'dejar / permitir / hacer que',           pos: 'Verbo' },
    { id: 79, tr: 'passieren',       en: 'pasar / suceder',                        pos: 'Verbo' },
    { id: 80, tr: 'benutzen',        en: 'usar / utilizar',                        pos: 'Verbo' },

    // Sustantivos (81–94)
    { id: 81, tr: 'Ding / Sache',    en: 'cosa',                                   pos: 'Sustantivo' },
    { id: 82, tr: 'Zeit',            en: 'tiempo / momento',                       pos: 'Sustantivo' },
    { id: 83, tr: 'Mann',            en: 'hombre',                                 pos: 'Sustantivo' },
    { id: 84, tr: 'Frau',            en: 'mujer',                                  pos: 'Sustantivo' },
    { id: 85, tr: 'Kind',            en: 'niño / niña / hijo',                    pos: 'Sustantivo' },
    { id: 86, tr: 'Haus',            en: 'casa / hogar',                           pos: 'Sustantivo' },
    { id: 87, tr: 'Arbeit',          en: 'trabajo',                                pos: 'Sustantivo' },
    { id: 88, tr: 'Tag',             en: 'día',                                    pos: 'Sustantivo' },
    { id: 89, tr: 'Jahr',            en: 'año',                                    pos: 'Sustantivo' },
    { id: 90, tr: 'Ort / Platz',     en: 'lugar / sitio',                         pos: 'Sustantivo' },
    { id: 91, tr: 'Stadt',           en: 'ciudad',                                 pos: 'Sustantivo' },
    { id: 92, tr: 'Geld',            en: 'dinero',                                 pos: 'Sustantivo' },
    { id: 93, tr: 'Wasser',          en: 'agua',                                   pos: 'Sustantivo' },
    { id: 94, tr: 'Essen',           en: 'comida / comida',                        pos: 'Sustantivo' },

    // Expresiones generales (95–99)
    { id: 95, tr: 'ja',              en: 'sí',                                     pos: 'Expresión' },
    { id: 96, tr: 'nein',            en: 'no',                                     pos: 'Expresión' },
    { id: 97, tr: 'okay / gut',      en: 'vale / de acuerdo',                      pos: 'Expresión' },
    { id: 98, tr: 'hallo',           en: 'hola',                                   pos: 'Expresión' },
    { id: 99, tr: 'danke',           en: 'gracias',                                pos: 'Expresión' }
  ];

  var STORAGE_KEY         = 'srs-german-es-v1';
  var MAX_NEW_PER_SESSION = 20;

  var root, states, queue, queueIdx, sessionDone, sessionTotal, revealed;

  /* ── ALMACENAMIENTO ──────────────────────────────────────────────────── */

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

  /* ── ALGORITMO — SM-2 simplificado ──────────────────────────────────── */

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
    if (d < 1)   return '<1d';
    if (d < 30)  return d + 'd';
    if (d < 365) return Math.round(d / 30) + 'm';
    return Math.round(d / 365) + 'a';
  }

  /* ── COLA ────────────────────────────────────────────────────────────── */

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

  /* ── UTILIDADES ──────────────────────────────────────────────────────── */

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

  /* ── RENDERIZADO ─────────────────────────────────────────────────────── */

  function renderMeta() {
    var metaEl = document.getElementById('srs-meta');
    if (!metaEl) return;
    var remaining = queue.length - queueIdx;
    var pct = sessionTotal > 0 ? Math.round((sessionDone / sessionTotal) * 100) : 0;
    metaEl.innerHTML =
      '<span class="srs-count">Completadas&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;Restantes&nbsp;<b>' + remaining + '</b></span>' +
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
      '<span class="srs-hint">haz clic para revelar</span>';
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
        '<span class="srs-key">1</span>&nbsp;Otra vez&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
      '</button>' +
      '<button class="srs-btn srs-btn-good" id="btn-good">' +
        '<span class="srs-key">3</span>&nbsp;Bien&nbsp;<span class="srs-interval">' + fmtDays(preview.good) + '</span>' +
      '</button>';
    document.getElementById('btn-again').addEventListener('click', handleAgain);
    document.getElementById('btn-good').addEventListener('click', handleGood);
  }

  function renderDone() {
    root.innerHTML =
      '<div class="srs-done">' +
        '<div class="srs-done-title">Sesión completada</div>' +
        '<div class="srs-done-sub">Todas las tarjetas de hoy han sido repasadas.</div>' +
        '<div class="srs-done-stats">' +
          sessionDone + '&nbsp;tarjetas en esta sesión<br>' +
          seenCount() + '&nbsp;de&nbsp;' + DECK.length + '&nbsp;palabras vistas hasta ahora' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-restart">Practicar de nuevo</button>' +
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
        '<div class="srs-done-title">Nada pendiente</div>' +
        '<div class="srs-done-sub">Todas las tarjetas están programadas para más tarde.</div>' +
        '<div class="srs-done-stats">' +
          seenCount() + '&nbsp;de&nbsp;' + DECK.length + '&nbsp;palabras vistas hasta ahora' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">Empezar tarjetas nuevas igualmente</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">¡Todo completado!</div>' +
            '<div class="srs-done-sub">Has visto las ' + DECK.length + ' palabras. Vuelve mañana para los repasos.</div>' +
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

  /* ── ESTRUCTURA DOM ──────────────────────────────────────────────────── */

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

  /* ── CALIFICACIÓN ────────────────────────────────────────────────────── */

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

  /* ── TECLADO ─────────────────────────────────────────────────────────── */

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

  /* ── INICIALIZACIÓN ──────────────────────────────────────────────────── */

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
