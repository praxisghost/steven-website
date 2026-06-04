/* german-srs-pt.js — Deutsch for Portuguese speakers.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. 105 high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = 'de-pt';
  const WORDS = [
    ["Hallo", "Olá"],
    ["Guten Morgen", "Bom dia"],
    ["Guten Tag", "Boa tarde"],
    ["Guten Abend", "Boa noite"],
    ["Auf Wiedersehen", "Adeus / Até logo"],
    ["Tschüss", "Tchau / Até já"],
    ["Wie geht es Ihnen?", "Como está? (formal)"],
    ["Wie geht's?", "Como estás?"],
    ["Danke schön", "Muito obrigado/a"],
    ["Bitte", "Por favor / De nada"],
    ["Entschuldigung", "Desculpe / Com licença"],
    ["ja", "sim"],
    ["nein", "não"],
    ["Wie heißen Sie?", "Como se chama?"],
    ["Ich heiße …", "Chamo-me …"],
    ["ich", "eu"],
    ["du", "tu"],
    ["er / sie", "ele / ela"],
    ["wir", "nós"],
    ["ihr", "vocês"],
    ["Sie", "o senhor / a senhora (formal)"],
    ["sein — ich bin", "ser/estar — eu sou/estou"],
    ["haben — ich habe", "ter — eu tenho"],
    ["werden — ich werde", "tornar-se / ir — eu vou (futuro)"],
    ["können", "poder"],
    ["müssen", "ter de / dever"],
    ["wollen", "querer"],
    ["dürfen", "poder (permissão)"],
    ["der Mann", "o homem"],
    ["die Frau", "a mulher"],
    ["das Kind", "a criança"],
    ["der Vater", "o pai"],
    ["die Mutter", "a mãe"],
    ["der Bruder", "o irmão"],
    ["die Schwester", "a irmã"],
    ["die Familie", "a família"],
    ["der Freund", "o amigo / o namorado"],
    ["das Haus", "a casa"],
    ["die Wohnung", "o apartamento"],
    ["das Zimmer", "o quarto / a divisão"],
    ["die Stadt", "a cidade"],
    ["das Land", "o país / o campo"],
    ["die Straße", "a rua"],
    ["der Bahnhof", "a estação de comboios"],
    ["das Wasser", "a água"],
    ["das Brot", "o pão"],
    ["das Fleisch", "a carne"],
    ["das Gemüse", "os legumes"],
    ["das Obst", "a fruta"],
    ["der Kaffee", "o café"],
    ["die Milch", "o leite"],
    ["essen", "comer"],
    ["trinken", "beber"],
    ["gehen", "ir / andar"],
    ["kommen", "vir / chegar"],
    ["fahren", "ir (de veículo) / conduzir"],
    ["arbeiten", "trabalhar"],
    ["lernen", "aprender / estudar"],
    ["sprechen", "falar"],
    ["schreiben", "escrever"],
    ["lesen", "ler"],
    ["sehen", "ver"],
    ["hören", "ouvir / escutar"],
    ["schlafen", "dormir"],
    ["kaufen", "comprar"],
    ["der Arzt / die Ärztin", "o médico / a médica"],
    ["das Krankenhaus", "o hospital"],
    ["die Schule", "a escola"],
    ["die Universität", "a universidade"],
    ["der Zug", "o comboio"],
    ["das Auto", "o carro"],
    ["das Flugzeug", "o avião"],
    ["die Arbeit", "o trabalho"],
    ["das Geld", "o dinheiro"],
    ["die Zeit", "o tempo / a hora"],
    ["der Tag", "o dia"],
    ["die Nacht", "a noite"],
    ["die Woche", "a semana"],
    ["das Jahr", "o ano"],
    ["heute", "hoje"],
    ["gestern", "ontem"],
    ["morgen", "amanhã"],
    ["jetzt", "agora"],
    ["immer", "sempre"],
    ["nie", "nunca"],
    ["sehr", "muito"],
    ["auch", "também"],
    ["noch", "ainda"],
    ["schon", "já"],
    ["hier", "aqui"],
    ["dort", "ali / lá"],
    ["groß", "grande"],
    ["klein", "pequeno/a"],
    ["gut", "bom / bem"],
    ["schlecht", "mau / mal"],
    ["neu", "novo/a"],
    ["alt", "velho/a / antigo/a"],
    ["billig", "barato/a"],
    ["teuer", "caro/a"],
    ["Wie viel kostet das?", "Quanto custa isto?"],
    ["Wo ist …?", "Onde fica …?"],
    ["Ich verstehe nicht.", "Não compreendo."],
    ["Können Sie langsamer sprechen?", "Pode falar mais devagar?"],
    ["Ich hätte gerne …", "Queria … / Gostaria de …"],
    ["Gute Nacht", "Boa noite (despedida)"],
  ];

  // ── SM-2 helpers ──────────────────────────────────────────────────────────
  const STORE_KEY = 'srs_' + PAIR;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
  }

  function nextCard(state) {
    const now = Date.now();
    const due = WORDS.map((_, i) => i).filter(i => {
      const s = state[i];
      return !s || s.next <= now;
    });
    if (!due.length) return null;
    return due[Math.floor(Math.random() * due.length)];
  }

  function updateCard(state, idx, good) {
    let s = state[idx] || { interval: 0, ef: 2.5, reps: 0 };
    if (!good) {
      s.interval = 1; s.reps = 0;
    } else {
      if (s.reps === 0) s.interval = 1;
      else if (s.reps === 1) s.interval = 6;
      else s.interval = Math.round(s.interval * s.ef);
      s.ef = Math.max(1.3, s.ef + 0.1 - (1 - 1) * (0.08 + (1 - 1) * 0.02));
      s.reps++;
    }
    s.next = Date.now() + s.interval * 86400000;
    state[idx] = s;
    return state;
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Populate vocab table
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (tbody) {
      WORDS.forEach(function (pair, i) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + pair[0] + '</td><td>' + pair[1] + '</td>';
        tbody.appendChild(tr);
      });
    }

    // SRS widget
    const root = document.getElementById('srs-root');
    if (!root) return;
    const info    = document.getElementById('srs-info');
    const bar     = document.getElementById('srs-bar');
    const front   = document.getElementById('srs-front');
    const back    = document.getElementById('srs-back');
    const flip    = document.getElementById('srs-flip');
    const controls= document.getElementById('srs-controls');
    const again   = document.getElementById('srs-again');
    const good    = document.getElementById('srs-good');
    const done    = document.getElementById('srs-done');
    const restart = document.getElementById('srs-restart');

    let state = loadState();
    let current = null;
    let sessionDone = 0;
    let sessionTotal = WORDS.filter((_, i) => { const s = state[i]; return !s || s.next <= Date.now(); }).length;

    function show() {
      current = nextCard(state);
      if (current === null) {
        root.querySelector('.srs-card').style.display = 'none';
        flip.style.display = 'none';
        controls.style.display = 'none';
        done.style.display = '';
        info.textContent = 'Sessão completa!';
        bar.style.width = '100%';
        return;
      }
      front.textContent = WORDS[current][0];
      back.textContent  = WORDS[current][1];
      back.style.display = 'none';
      flip.style.display = '';
      controls.style.display = 'none';
      root.querySelector('.srs-card').style.display = '';
      done.style.display = 'none';
      const pct = sessionTotal > 0 ? Math.round(sessionDone / sessionTotal * 100) : 0;
      info.textContent = sessionDone + ' / ' + sessionTotal + ' cartões';
      bar.style.width = pct + '%';
    }

    flip.addEventListener('click', function () {
      back.style.display = '';
      flip.style.display = 'none';
      controls.style.display = '';
    });

    again.addEventListener('click', function () {
      state = updateCard(state, current, false);
      saveState(state);
      show();
    });

    good.addEventListener('click', function () {
      state = updateCard(state, current, true);
      saveState(state);
      sessionDone++;
      show();
    });

    restart.addEventListener('click', function () {
      sessionDone = 0;
      sessionTotal = WORDS.length;
      state = {};
      saveState(state);
      show();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        if (flip.style.display !== 'none') { flip.click(); e.preventDefault(); }
      } else if (e.key === '1') {
        if (controls.style.display !== 'none') again.click();
      } else if (e.key === '3') {
        if (controls.style.display !== 'none') good.click();
      }
    });

    show();
  });
})();
