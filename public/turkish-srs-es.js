(function () {
  'use strict';

  /* ── DECK — 100 palabras turcas esenciales (significados en español) ─── */
  var DECK = [
    // Conjunciones y partículas (0–15)
    { id:  0, tr: 'bir',          en: 'un / una / uno',                         pos: 'Artículo / Número' },
    { id:  1, tr: 've',           en: 'y',                                       pos: 'Conjunción' },
    { id:  2, tr: 'ama',          en: 'pero / sin embargo',                      pos: 'Conjunción' },
    { id:  3, tr: 'çünkü',        en: 'porque / ya que',                         pos: 'Conjunción' },
    { id:  4, tr: 'eğer',         en: 'si / en caso de que',                     pos: 'Conjunción' },
    { id:  5, tr: 'ya da',        en: 'o / u',                                   pos: 'Conjunción' },
    { id:  6, tr: 'ki',           en: 'que / para que / de modo que',            pos: 'Conjunción' },
    { id:  7, tr: 'için',         en: 'para / por / a fin de',                   pos: 'Posposición' },
    { id:  8, tr: 'ile',          en: 'con / y',                                 pos: 'Posposición' },
    { id:  9, tr: 'kadar',        en: 'hasta / tanto como',                      pos: 'Posposición' },
    { id: 10, tr: 'gibi',         en: 'como / igual que',                        pos: 'Posposición' },
    { id: 11, tr: 'de / da',      en: 'también / incluso (partícula)',           pos: 'Partícula' },
    { id: 12, tr: 'mi / mı',      en: 'partícula interrogativa',                 pos: 'Partícula' },
    { id: 13, tr: 'değil',        en: 'no (partícula negativa)',                 pos: 'Partícula' },
    { id: 14, tr: 'var',          en: 'hay / existe / tener',                    pos: 'Partícula' },
    { id: 15, tr: 'yok',          en: 'no hay / no existe / no tener',           pos: 'Partícula' },

    // Pronombres y palabras interrogativas (16–29)
    { id: 16, tr: 'ben',          en: 'yo',                                      pos: 'Pronombre' },
    { id: 17, tr: 'sen',          en: 'tú',                                      pos: 'Pronombre' },
    { id: 18, tr: 'o',            en: 'él / ella / ello',                        pos: 'Pronombre' },
    { id: 19, tr: 'biz',          en: 'nosotros',                                pos: 'Pronombre' },
    { id: 20, tr: 'siz',          en: 'vosotros / ustedes / usted (formal)',     pos: 'Pronombre' },
    { id: 21, tr: 'onlar',        en: 'ellos / ellas',                           pos: 'Pronombre' },
    { id: 22, tr: 'bu',           en: 'este / esta / esto',                      pos: 'Pronombre / Det.' },
    { id: 23, tr: 'şu',           en: 'ese / esa / aquel (cercano)',             pos: 'Pronombre / Det.' },
    { id: 24, tr: 'ne',           en: 'qué',                                     pos: 'Interrogativo' },
    { id: 25, tr: 'kim',          en: 'quién',                                   pos: 'Interrogativo' },
    { id: 26, tr: 'nerede',       en: 'dónde',                                   pos: 'Interrogativo' },
    { id: 27, tr: 'nasıl',        en: 'cómo',                                    pos: 'Interrogativo' },
    { id: 28, tr: 'neden',        en: 'por qué / por qué razón',                pos: 'Interrogativo' },
    { id: 29, tr: 'kendi',        en: 'mismo / propio',                          pos: 'Pronombre' },

    // Adverbios (30–46)
    { id: 30, tr: 'çok',          en: 'muy / mucho / muchos',                    pos: 'Adverbio' },
    { id: 31, tr: 'daha',         en: 'más / aún / todavía',                     pos: 'Adverbio' },
    { id: 32, tr: 'artık',        en: 'ya / ahora / ya no',                      pos: 'Adverbio' },
    { id: 33, tr: 'hiç',          en: 'nunca / jamás / para nada',               pos: 'Adverbio' },
    { id: 34, tr: 'hep',          en: 'siempre / constantemente',                pos: 'Adverbio' },
    { id: 35, tr: 'şimdi',        en: 'ahora / en este momento',                 pos: 'Adverbio' },
    { id: 36, tr: 'sonra',        en: 'después / más tarde',                     pos: 'Adverbio' },
    { id: 37, tr: 'önce',         en: 'antes / primero',                         pos: 'Adverbio' },
    { id: 38, tr: 'belki',        en: 'quizás / tal vez',                        pos: 'Adverbio' },
    { id: 39, tr: 'hâlâ',         en: 'todavía / aún',                           pos: 'Adverbio' },
    { id: 40, tr: 'yani',         en: 'es decir / o sea',                        pos: 'Adverbio' },
    { id: 41, tr: 'tabii',        en: 'claro / por supuesto',                    pos: 'Adverbio' },
    { id: 42, tr: 'birlikte',     en: 'juntos / en conjunto',                    pos: 'Adverbio' },
    { id: 43, tr: 'bence',        en: 'en mi opinión / a mi parecer',            pos: 'Adverbio' },
    { id: 44, tr: 'zaten',        en: 'de todos modos / de todas formas',        pos: 'Adverbio' },
    { id: 45, tr: 'sadece',       en: 'solo / únicamente',                       pos: 'Adverbio' },
    { id: 46, tr: 'hemen',        en: 'inmediatamente / enseguida',              pos: 'Adverbio' },

    // Adjetivos (47–62)
    { id: 47, tr: 'her',          en: 'cada / todo',                             pos: 'Adjetivo' },
    { id: 48, tr: 'bütün',        en: 'todo / entero / completo',                pos: 'Adjetivo' },
    { id: 49, tr: 'iyi',          en: 'bueno / bien',                            pos: 'Adjetivo' },
    { id: 50, tr: 'büyük',        en: 'grande / importante',                     pos: 'Adjetivo' },
    { id: 51, tr: 'küçük',        en: 'pequeño / menor',                         pos: 'Adjetivo' },
    { id: 52, tr: 'yeni',         en: 'nuevo / moderno',                         pos: 'Adjetivo' },
    { id: 53, tr: 'eski',         en: 'viejo / antiguo / anterior',              pos: 'Adjetivo' },
    { id: 54, tr: 'ilk',          en: 'primero / inicial',                       pos: 'Adjetivo' },
    { id: 55, tr: 'son',          en: 'último / final',                          pos: 'Adjetivo' },
    { id: 56, tr: 'güzel',        en: 'bonito / hermoso',                        pos: 'Adjetivo' },
    { id: 57, tr: 'doğru',        en: 'correcto / verdadero / dirección',        pos: 'Adjetivo' },
    { id: 58, tr: 'başka',        en: 'otro / diferente',                        pos: 'Adjetivo' },
    { id: 59, tr: 'aynı',         en: 'mismo / idéntico',                        pos: 'Adjetivo' },
    { id: 60, tr: 'önemli',       en: 'importante / significativo',              pos: 'Adjetivo' },
    { id: 61, tr: 'kolay',        en: 'fácil / sencillo',                        pos: 'Adjetivo' },
    { id: 62, tr: 'zor',          en: 'difícil / duro',                          pos: 'Adjetivo' },

    // Verbos — forma infinitiva (63–80)
    { id: 63, tr: 'olmak',        en: 'ser / estar / convertirse en',            pos: 'Verbo' },
    { id: 64, tr: 'yapmak',       en: 'hacer / realizar',                        pos: 'Verbo' },
    { id: 65, tr: 'gelmek',       en: 'venir',                                   pos: 'Verbo' },
    { id: 66, tr: 'gitmek',       en: 'ir / irse',                               pos: 'Verbo' },
    { id: 67, tr: 'demek',        en: 'decir / significar',                      pos: 'Verbo' },
    { id: 68, tr: 'bilmek',       en: 'saber / conocer / poder',                 pos: 'Verbo' },
    { id: 69, tr: 'görmek',       en: 'ver',                                     pos: 'Verbo' },
    { id: 70, tr: 'istemek',      en: 'querer / desear',                         pos: 'Verbo' },
    { id: 71, tr: 'vermek',       en: 'dar',                                     pos: 'Verbo' },
    { id: 72, tr: 'almak',        en: 'tomar / comprar / recibir',               pos: 'Verbo' },
    { id: 73, tr: 'bakmak',       en: 'mirar / cuidar de',                       pos: 'Verbo' },
    { id: 74, tr: 'anlamak',      en: 'entender / comprender',                   pos: 'Verbo' },
    { id: 75, tr: 'düşünmek',     en: 'pensar / reflexionar',                    pos: 'Verbo' },
    { id: 76, tr: 'bulmak',       en: 'encontrar / hallar',                      pos: 'Verbo' },
    { id: 77, tr: 'söylemek',     en: 'decir / contar / hablar',                 pos: 'Verbo' },
    { id: 78, tr: 'çıkmak',       en: 'salir / aparecer',                        pos: 'Verbo' },
    { id: 79, tr: 'geçmek',       en: 'pasar / transcurrir / cruzar',            pos: 'Verbo' },
    { id: 80, tr: 'kullanmak',    en: 'usar / utilizar',                         pos: 'Verbo' },

    // Sustantivos (81–94)
    { id: 81, tr: 'şey',          en: 'cosa / asunto',                           pos: 'Sustantivo' },
    { id: 82, tr: 'zaman',        en: 'tiempo / momento',                        pos: 'Sustantivo' },
    { id: 83, tr: 'adam',         en: 'hombre / persona',                        pos: 'Sustantivo' },
    { id: 84, tr: 'kadın',        en: 'mujer',                                   pos: 'Sustantivo' },
    { id: 85, tr: 'çocuk',        en: 'niño / hijo',                             pos: 'Sustantivo' },
    { id: 86, tr: 'ev',           en: 'casa / hogar',                            pos: 'Sustantivo' },
    { id: 87, tr: 'iş',           en: 'trabajo / negocio',                       pos: 'Sustantivo' },
    { id: 88, tr: 'gün',          en: 'día',                                     pos: 'Sustantivo' },
    { id: 89, tr: 'yıl',          en: 'año',                                     pos: 'Sustantivo' },
    { id: 90, tr: 'yer',          en: 'lugar / sitio / suelo',                   pos: 'Sustantivo' },
    { id: 91, tr: 'şehir',        en: 'ciudad',                                  pos: 'Sustantivo' },
    { id: 92, tr: 'para',         en: 'dinero',                                  pos: 'Sustantivo' },
    { id: 93, tr: 'su',           en: 'agua',                                    pos: 'Sustantivo' },
    { id: 94, tr: 'yemek',        en: 'comida / plato / comer',                  pos: 'Sustantivo / Verbo' },

    // Expresiones generales (95–99)
    { id: 95, tr: 'evet',         en: 'sí',                                      pos: 'Expresión' },
    { id: 96, tr: 'hayır',        en: 'no',                                      pos: 'Expresión' },
    { id: 97, tr: 'tamam',        en: 'de acuerdo / está bien',                  pos: 'Expresión' },
    { id: 98, tr: 'merhaba',      en: 'hola',                                    pos: 'Expresión' },
    { id: 99, tr: 'teşekkürler',  en: 'gracias',                                 pos: 'Expresión' }
  ];

  var STORAGE_KEY         = 'srs-turkish-es-v1';
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

  /* ── ALGORITMO SM-2 lite ─────────────────────────────────────────────── */

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
    if (d < 365) return Math.round(d / 30) + 'mes';
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
      '<span class="srs-count">Listas&nbsp;<b>' + sessionDone + '</b>&ensp;&middot;&ensp;Restantes&nbsp;<b>' + remaining + '</b></span>' +
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
      '<span class="srs-hint">clic para revelar</span>';
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
        '<span class="srs-key">1</span>&nbsp;Repetir&nbsp;<span class="srs-interval">' + fmtDays(preview.again) + '</span>' +
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
        '<div class="srs-done-sub">Has repasado todas las tarjetas de hoy.</div>' +
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
        '<div class="srs-done-sub">Todas las tarjetas están programadas para más adelante.</div>' +
        '<div class="srs-done-stats">' +
          seenCount() + '&nbsp;de&nbsp;' + DECK.length + '&nbsp;palabras vistas hasta ahora' +
        '</div>' +
        '<button class="srs-action-btn" id="btn-new">Empezar igualmente con tarjetas nuevas</button>' +
      '</div>';
    document.getElementById('btn-new').addEventListener('click', function () {
      var newCards = DECK.filter(function (c) { return getState(c.id).reps === 0; })
                        .slice(0, MAX_NEW_PER_SESSION);
      if (newCards.length === 0) {
        root.innerHTML =
          '<div class="srs-done">' +
            '<div class="srs-done-title">¡Todo hecho!</div>' +
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

  /* ── EVALUACIÓN ──────────────────────────────────────────────────────── */

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
