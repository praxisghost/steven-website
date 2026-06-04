/* french-srs-de.js — Français für Deutschsprachige.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 127 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'fr-de';
  const WORDS = [
    // Begrüßungen und Grundausdrücke
    ["bonjour", "guten Morgen / guten Tag / hallo"],
    ["bonsoir", "guten Abend"],
    ["bonne nuit", "gute Nacht"],
    ["salut", "hallo (informell)"],
    ["comment allez-vous ?", "wie geht es Ihnen?"],
    ["ça va ?", "wie geht's? / alles gut?"],
    ["ça va bien", "es geht mir gut"],
    ["merci", "danke"],
    ["merci beaucoup", "vielen Dank"],
    ["de rien", "bitte / gern geschehen"],
    ["s'il vous plaît", "bitte"],
    ["pardon / excusez-moi", "Entschuldigung"],
    ["oui", "ja"],
    ["non", "nein"],
    ["au revoir", "auf Wiedersehen"],
    ["à bientôt", "bis bald"],
    ["je m'appelle…", "ich heiße… / mein Name ist…"],
    ["comment vous appelez-vous ?", "wie heißen Sie?"],
    ["je ne comprends pas", "ich verstehe nicht"],
    ["pouvez-vous répéter ?", "können Sie das wiederholen?"],
    // Pronomen und grammatische Wörter
    ["je", "ich"],
    ["tu", "du (informell)"],
    ["il / elle", "er / sie"],
    ["nous", "wir"],
    ["vous", "Sie / ihr"],
    ["ils / elles", "sie (Plural)"],
    ["ce / c'est", "das / das ist"],
    ["qui", "wer / der/die/das (Relativpronomen)"],
    ["que / qu'est-ce que", "was / was ist"],
    ["ne… pas", "nicht (Verneinung)"],
    // Grundverben
    ["être", "sein"],
    ["avoir", "haben"],
    ["faire", "machen / tun"],
    ["aller", "gehen / fahren"],
    ["venir", "kommen"],
    ["pouvoir", "können"],
    ["vouloir", "wollen"],
    ["devoir", "müssen / sollen"],
    ["savoir", "wissen"],
    ["connaître", "kennen"],
    ["parler", "sprechen"],
    ["comprendre", "verstehen"],
    ["manger", "essen"],
    ["boire", "trinken"],
    ["voir", "sehen"],
    ["prendre", "nehmen"],
    ["donner", "geben"],
    ["penser", "denken / glauben"],
    ["trouver", "finden"],
    ["aimer", "lieben / mögen"],
    ["habiter", "wohnen"],
    ["travailler", "arbeiten"],
    ["partir", "abfahren / weggehen"],
    ["arriver", "ankommen"],
    ["mettre", "setzen / legen / stellen"],
    // Substantive — Alltag
    ["la maison", "das Haus"],
    ["la ville", "die Stadt"],
    ["le pays", "das Land"],
    ["l'eau (f)", "das Wasser"],
    ["le pain", "das Brot"],
    ["le café", "der Kaffee"],
    ["le restaurant", "das Restaurant"],
    ["l'hôtel (m)", "das Hotel"],
    ["la voiture", "das Auto"],
    ["le train", "der Zug"],
    ["l'avion (m)", "das Flugzeug"],
    ["le livre", "das Buch"],
    ["le temps", "das Wetter / die Zeit"],
    ["le jour", "der Tag"],
    ["la nuit", "die Nacht"],
    ["le matin", "der Morgen"],
    ["le soir", "der Abend"],
    ["la famille", "die Familie"],
    ["l'ami / l'amie", "der Freund / die Freundin"],
    ["l'homme (m)", "der Mann"],
    ["la femme", "die Frau"],
    ["l'enfant (m/f)", "das Kind"],
    ["le monde", "die Welt"],
    ["la vie", "das Leben"],
    ["la chose", "die Sache / das Ding"],
    ["la fois", "das Mal"],
    ["l'argent (m)", "das Geld"],
    ["le travail", "die Arbeit"],
    ["le problème", "das Problem"],
    ["la question", "die Frage"],
    // Adjektive und Adverbien
    ["bien", "gut / wohl"],
    ["mal", "schlecht"],
    ["très", "sehr"],
    ["beaucoup", "viel"],
    ["aussi", "auch"],
    ["maintenant", "jetzt"],
    ["aujourd'hui", "heute"],
    ["demain", "morgen"],
    ["hier", "gestern"],
    ["trop", "zu viel / zu sehr"],
    ["peu", "wenig"],
    ["encore", "noch / wieder"],
    ["déjà", "schon / bereits"],
    ["toujours", "immer / noch"],
    ["jamais", "nie / niemals"],
    ["peut-être", "vielleicht"],
    ["seulement", "nur"],
    // Zahlen und Zeitangaben
    ["un / une", "ein / eine"],
    ["deux", "zwei"],
    ["trois", "drei"],
    ["dix", "zehn"],
    ["cent", "hundert"],
    ["l'heure (f)", "die Stunde / die Uhrzeit"],
    ["la semaine", "die Woche"],
    ["le mois", "der Monat"],
    ["l'année (f)", "das Jahr"],
    ["lundi", "Montag"],
    // Weitere Grundvokabeln
    ["bonjour (réponse)", "ja / hallo (zurück)"],
    ["où est… ?", "wo ist… ?"],
    ["combien ?", "wie viel?"],
    ["comment ?", "wie?"],
    ["pourquoi ?", "warum?"],
    ["parce que", "weil / denn"],
    ["avec", "mit"],
    ["sans", "ohne"],
    ["pour", "für / um … zu"],
    ["mais", "aber"],
    ["et", "und"],
    ["ou", "oder"],
    ["si", "wenn / ob / so"],
    ["il y a", "es gibt"],
    ["je voudrais", "ich möchte"],
  ];

  /* ── SM-2 engine ───────────────────────────────────────────────────── */
  const STORAGE_KEY = 'srs_' + PAIR;
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }
  function sm2(card, q) {
    let { ef = 2.5, interval = 0, rep = 0, due = 0 } = card;
    if (q < 3) { rep = 0; interval = 1; }
    else {
      if (rep === 0) interval = 1;
      else if (rep === 1) interval = 6;
      else interval = Math.round(interval * ef);
      rep++;
    }
    ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    due = Date.now() + interval * 864e5;
    return { ef, interval, rep, due };
  }
  function getDue(state) {
    const now = Date.now();
    return WORDS.map((w, i) => ({ i, w, ...(state[i] || {}) }))
      .filter(c => (c.due || 0) <= now)
      .sort((a, b) => (a.due || 0) - (b.due || 0))
      .slice(0, 20);
  }

  /* ── DOM wiring ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    /* frequency table */
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (tbody) {
      WORDS.forEach(([fr, de], i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i + 1}</td><td>${fr}</td><td>${de}</td>`;
        tbody.appendChild(tr);
      });
    }

    /* vocab search */
    const search = document.querySelector('.vocab-search');
    if (search && tbody) {
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach(tr => {
          tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

    /* SRS */
    const root = document.getElementById('srs-root');
    if (!root) return;
    const info     = document.getElementById('srs-info');
    const bar      = document.getElementById('srs-bar');
    const front    = document.getElementById('srs-front');
    const back     = document.getElementById('srs-back');
    const controls = document.getElementById('srs-controls');
    const flipBtn  = document.getElementById('srs-flip');
    const againBtn = document.getElementById('srs-again');
    const goodBtn  = document.getElementById('srs-good');
    const doneDiv  = document.getElementById('srs-done');
    const restartBtn = document.getElementById('srs-restart');

    let state = loadState(), queue = [], cur = null, revealed = false;

    function startSession() {
      state = loadState();
      queue = getDue(state);
      doneDiv.style.display = 'none';
      flipBtn.style.display = '';
      controls.style.display = 'none';
      back.style.display = 'none';
      if (!queue.length) { showDone(); return; }
      showCard();
    }
    function showCard() {
      if (!queue.length) { showDone(); return; }
      cur = queue[0];
      revealed = false;
      front.textContent = cur.w[0];
      back.textContent  = cur.w[1];
      back.style.display  = 'none';
      controls.style.display = 'none';
      flipBtn.style.display  = '';
      const done = WORDS.length - getDue(loadState()).length;
      const pct  = Math.round(done / WORDS.length * 100);
      info.textContent = `Karte ${done + 1} / ${WORDS.length} — ${pct}% bekannt`;
      bar.style.width  = pct + '%';
    }
    function showDone() {
      flipBtn.style.display = 'none';
      controls.style.display = 'none';
      doneDiv.style.display = '';
    }
    flipBtn.addEventListener('click', () => {
      revealed = true;
      back.style.display = '';
      flipBtn.style.display = 'none';
      controls.style.display = '';
    });
    againBtn.addEventListener('click', () => {
      state[cur.i] = sm2({ ...(state[cur.i] || {}), interval: cur.interval }, 1);
      saveState(state);
      queue.shift(); queue.push(cur);
      showCard();
    });
    goodBtn.addEventListener('click', () => {
      state[cur.i] = sm2(state[cur.i] || {}, 4);
      saveState(state);
      queue.shift();
      showCard();
    });
    restartBtn.addEventListener('click', startSession);

    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!revealed) flipBtn.click(); }
      if (e.key === '1') againBtn.click();
      if (e.key === '3') goodBtn.click();
    });

    startSession();
  });
})();
