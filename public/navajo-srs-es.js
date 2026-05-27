/* navajo-srs-es.js — SRS flashcard data: Navajo (Diné bizaad) para hispanohablantes
   Algoritmo SM-2 de repetición espaciada. Progreso guardado en localStorage.
   Tarjetas: vocabulario esencial, conceptos culturales y convenciones ortográficas clave.
   Frente: Navajo | Reverso: significado en español + guía de pronunciación
*/
(function () {
  'use strict';

  const PAIR = 'nv-es';
  const WORDS = [
    /* ── Saludos y frases esenciales ───────────────────────── */
    ["yáʼátʼééh",          "Hola / Todo está bien — saludo universal (yah-AH-tay)"],
    ["ahéheeʼ",            "Gracias"],
    ["hágoóneeʼ",          "Adiós (informal)"],
    ["yáʼátʼééh abíní",    "Buenos días"],
    ["yáʼátʼééh ałníʼníʼą́", "Buenas tardes"],
    /* ── Conceptos esenciales ───────────────────────────────── */
    ["hózhó",              "Belleza / armonía / equilibrio — concepto central de la filosofía navajo"],
    ["Diné",               "El Pueblo — cómo se llaman a sí mismos los navajo"],
    ["bizaad",             "Lengua / idioma (Diné bizaad = la lengua navajo)"],
    ["hózhóogo",           "De manera armoniosa / bella (forma adverbial de hózhó)"],
    ["nizhóní",            "Bello / hermoso / está bien"],
    /* ── Personas y pronombres ──────────────────────────────── */
    ["shí",                "Yo / me (primera persona singular)"],
    ["nihí",               "Nosotros / nos (primera persona plural)"],
    ["bilagáana",          "Anglohablante / persona blanca — del español 'americano'"],
    ["hastiin",            "Señor / hombre (forma de respeto)"],
    ["asdzáá",             "Mujer"],
    /* ── Naturaleza y paisaje ───────────────────────────────── */
    ["tó",                 "Agua — el tono alto en la ó es esencial"],
    ["tsékooh",            "Cañón"],
    ["nahasdzáán",         "La tierra / el suelo / la tierra firme"],
    ["yádiłhił",           "El cielo azul"],
    ["dziłíjiin",          "Montaña negra (tipo de topónimo)"],
    /* ── Números ────────────────────────────────────────────── */
    ["tʼááłáʼí",           "Uno"],
    ["naaki",              "Dos"],
    ["tááʼ",               "Tres"],
    ["dį́į́ʼ",              "Cuatro"],
    ["ashdlaʼ",            "Cinco"],
    /* ── Palabras comunes ───────────────────────────────────── */
    ["ayóó",               "Muy / mucho / extremadamente"],
    ["tʼáá",               "Simplemente / justo (partícula enfática)"],
    ["doo … da",           "No … (negación discontinua — envuelve el predicado)"],
    ["háadi",              "¿Dónde?"],
    ["haʼátʼíí",           "¿Qué?"],
    /* ── Verbos (formas conjugadas) ─────────────────────────── */
    ["yishááł",            "Estoy caminando (alejándome del hablante)"],
    ["yiníshta",           "Estoy leyendo / estoy estudiando"],
    ["naashnish",          "Estoy trabajando"],
    ["hólǫ́",              "Hay / existe (existencial)"],
    ["doo hólǫ́ da",        "No hay / no existe"],
    /* ── Convenciones ortográficas ──────────────────────────── */
    ["ł",                  "ł = fricativa lateral sorda — como la 'll' galesa; sin equivalente en español"],
    ["ʼ",                  "El apóstrofo marca una oclusiva glotal — una consonante real en navajo"],
    ["á vs a",             "La tilde marca tono alto — tó (agua) es una palabra distinta de to"],
    ["ą",                  "El gancho (ogonek) marca vocal nasalizada — cambia el significado"],
    ["tłʼ",                "Africado lateral eyectivo — uno de los sonidos más difíciles del navajo"],
  ];

  function loadState() {
    try { return JSON.parse(localStorage.getItem('srs_' + PAIR) || '{}'); }
    catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem('srs_' + PAIR, JSON.stringify(s)); } catch (e) {}
  }
  function today() { return Math.floor(Date.now() / 86400000); }
  function getDue(state) {
    const t = today();
    return WORDS.filter((_, i) => { const c = state[i]; return !c || c.nextDay <= t; });
  }
  function updateCard(state, idx, quality) {
    const c = state[idx] || { ef: 2.5, interval: 1, reps: 0 };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
      if (c.reps === 0)      c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else                   c.interval = Math.round(c.interval * c.ef);
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
    if (!queue.length) { elCard.style.display = elFlip.style.display = elControls.style.display = 'none'; elDone.style.display = 'block'; elInfo.textContent = '¡Todo listo por hoy!'; return; }
    current = queue.shift();
    const [f, b] = WORDS[current];
    elFront.textContent = f; elBack.textContent = b; elBack.style.display = 'none'; elFront.style.display = 'block';
    elControls.style.display = 'none'; elFlip.style.display = 'inline-block'; elCard.style.display = 'block'; elDone.style.display = 'none';
    elInfo.textContent = (queue.length + 1) + ' / ' + getDue(loadState()).length + ' tarjetas';
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
