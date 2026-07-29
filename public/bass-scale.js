(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     E MAJOR SCALE (one octave, bass register)
     Notes:     E   F♯   G♯   A   B   C♯   D♯   E
     Intervals: I   II   III  IV  V   VI   VII  VIII
     Scale index 0–7 maps to these eight tones in ascending order.

     This mirrors guitar-scale.js but for bass: the studied scale is the
     full E Major natural scale, notation is rendered in the bass clef, and
     pitches sit in the bass register (E2–E3).
  ══════════════════════════════════════════════════════════════════════ */

  var SCALE = [
    { name: 'E',  interval: 'I',    freq: 82.41  },  // E2   — scale idx 0
    { name: 'F♯', interval: 'II',   freq: 92.50  },  // F♯2  — scale idx 1
    { name: 'G♯', interval: 'III',  freq: 103.83 },  // G♯2  — scale idx 2
    { name: 'A',  interval: 'IV',   freq: 110.00 },  // A2   — scale idx 3
    { name: 'B',  interval: 'V',    freq: 123.47 },  // B2   — scale idx 4
    { name: 'C♯', interval: 'VI',   freq: 138.59 },  // C♯3  — scale idx 5
    { name: 'D♯', interval: 'VII',  freq: 155.56 },  // D♯3  — scale idx 6
    { name: 'E',  interval: 'VIII', freq: 164.81 }   // E3   — scale idx 7
  ];

  /* Frequency table — every E Major pitch the melodies use */
  var HZ = {
    E2:  82.41,  Fs2: 92.50,  Gs2: 103.83, A2: 110.00, B2: 123.47,
    Cs3: 138.59, Ds3: 155.56, E3:  164.81
  };

  /* Note key → scale display index (0–7) */
  var IDX = {
    E2: 0, Fs2: 1, Gs2: 2, A2: 3, B2: 4, Cs3: 5, Ds3: 6, E3: 7
  };

  /* ── SVG staff position data for each scale index (bass clef) ──
     12 px line spacing, 6 px half-steps:
       Line 5 (A3) y=20   Space 4 (G3) y=26
       Line 4 (F3) y=32   Space 3 (E3) y=38
       Line 3 (D3) y=44   Space 2 (C3) y=50   ← middle line
       Line 2 (B2) y=56   Space 1 (A2) y=62
       Line 1 (G2) y=68   Below      (F2) y=74
                          Ledger     (E2) y=80
     hasAcc → sharp drawn before the note head.
     ledger → one ledger line drawn through the note head (E2 only).        */
  var NOTE_POS = [
    { cy: 80, hasAcc: false, ledger: true  },  // 0 → E2   (ledger below)
    { cy: 74, hasAcc: true,  ledger: false },  // 1 → F♯2  (space below)
    { cy: 68, hasAcc: true,  ledger: false },  // 2 → G♯2  (line 1)
    { cy: 62, hasAcc: false, ledger: false },  // 3 → A2   (space 1)
    { cy: 56, hasAcc: false, ledger: false },  // 4 → B2   (line 2)
    { cy: 50, hasAcc: true,  ledger: false },  // 5 → C♯3  (space 2)
    { cy: 44, hasAcc: true,  ledger: false },  // 6 → D♯3  (line 3)
    { cy: 38, hasAcc: false, ledger: false }   // 7 → E3   (space 3)
  ];

  /* ── Melody mode layout ──────────────────────────────────────────── */
  var SVG_NS         = 'http://www.w3.org/2000/svg';
  var BASS_CLEF      = String.fromCodePoint(0x1D122); // 𝄢 F-clef
  var CLEF_X         = '10';
  var CLEF_Y         = '60';
  var CLEF_SIZE      = '44';
  var MELODY_START_X = 76;   // cx of note 0 (after barline + clef + time sig)
  var BEAT_PX        = 48;   // pixels per beat in proportional melody layout
  var BEAT_MIN_ADV   = 36;   // minimum px advance even for short notes

  /* ══════════════════════════════════════════════════════════════════════
     MELODY DEFINITIONS — E Major, bass-style lines
     Format: [noteKey, durationBeats].  BPM = 92 → one beat = 0.652 s
  ══════════════════════════════════════════════════════════════════════ */
  var BPM  = 92;
  var BEAT = 60 / BPM;

  var MELODIES = [
    /* 0 — "Foundation": steady walking quarters, root-anchored */
    [
      ['E2', 1], ['Gs2', 1], ['B2', 1], ['E3', 1],
      ['Ds3', 1], ['B2', 1], ['Gs2', 1], ['E2', 1],
      ['Fs2', 1], ['A2', 1], ['Cs3', 1], ['A2', 1],
      ['B2', 1], ['Gs2', 1], ['Fs2', 1], ['E2', 1]
    ],
    /* 1 — "Groove": eighth-note drive, syncopated answer */
    [
      ['E2', 0.5], ['E2', 0.5], ['Gs2', 1], ['B2', 0.5], ['A2', 0.5], ['Gs2', 1],
      ['Fs2', 2], ['E2', 1], ['Fs2', 1],
      ['Gs2', 1], ['B2', 0.5], ['Cs3', 0.5], ['Ds3', 1], ['B2', 1],
      ['E3', 2], ['B2', 1], ['E2', 1]
    ],
    /* 2 — "Ascent": longer values, widening range → resolution */
    [
      ['E2', 2], ['Gs2', 1], ['B2', 1],
      ['Cs3', 1.5], ['B2', 0.5], ['A2', 1], ['Gs2', 1],
      ['Fs2', 1], ['A2', 1], ['Cs3', 1], ['E3', 1],
      ['Ds3', 1.5], ['Cs3', 0.5], ['B2', 1], ['E2', 1]
    ]
  ];

  /* ══════════════════════════════════════════════════════════════════════
     STATE
  ══════════════════════════════════════════════════════════════════════ */
  var ac          = null;      // AudioContext (lazy init)
  var masterGain  = null;      // Master GainNode
  var mode        = 'stopped'; // 'stopped' | 'scale' | 'melody'
  var gen         = 0;         // Generation — invalidates stale callbacks
  var melodyVar   = 0;         // Which MELODIES[] index is active
  var melodyPos   = 0;         // Current position within melody
  var melodyLen   = 0;         // Number of notes in currently rendered melody
  var nextTime    = 0;         // Next scheduled note time (AC seconds)
  var schedId     = null;      // setInterval id for scheduler
  var timers      = [];        // All pending setTimeout ids
  var countInDone = false;     // True once count-in has fired; reset on stop

  var SCHED_AHEAD  = 0.40;     // Look-ahead window (seconds)
  var SCHED_MS     = 80;       // Scheduler tick interval (ms)

  /* ── Scale player parameters ──
     Pattern: ascending one octave (E F♯ G♯ A B C♯ D♯ E).
     SCALE_PAT maps pattern step → scale index (0–7).
     SCALE_SLOT_COUNT = number of fixed SVG note slots in sn-scale-group. */
  var SCALE_DUR        = 0.60;
  var SCALE_GAP        = 0.18;
  var SCALE_STEP       = SCALE_DUR + SCALE_GAP;
  var SCALE_PAT        = [0, 1, 2, 3, 4, 5, 6, 7];  // ascending octave
  var SCALE_SLOT_COUNT = 8;
  var scalePATPos      = 0;

  /* ══════════════════════════════════════════════════════════════════════
     AUDIO CONTEXT & MASTER GAIN
  ══════════════════════════════════════════════════════════════════════ */
  function getAC() {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ac.state === 'suspended') { ac.resume(); }
    return ac;
  }

  function getMG(ctx) {
    if (!masterGain || masterGain.context.state === 'closed') {
      masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
    }
    return masterGain;
  }

  /* ══════════════════════════════════════════════════════════════════════
     TONE SYNTHESIS — plucked bass-string envelope
     Lower-passed and slightly longer than the guitar to suit the register.
  ══════════════════════════════════════════════════════════════════════ */
  function playNote(freq, when, dur) {
    var ctx  = getAC();
    var mg   = getMG(ctx);
    var osc  = ctx.createOscillator();
    var filt = ctx.createBiquadFilter();
    var gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    filt.type = 'lowpass';
    filt.frequency.value = 900;
    filt.Q.value = 0.4;

    var t0       = when;
    var tPeak    = t0 + 0.014;
    var tDecay   = t0 + Math.min(0.14, dur * 0.25);
    var tRelease = t0 + dur * 0.9;

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.42, tPeak);
    gain.gain.exponentialRampToValueAtTime(0.24, tDecay);
    gain.gain.exponentialRampToValueAtTime(0.001, tRelease);

    osc.connect(filt);
    filt.connect(gain);
    gain.connect(mg);

    osc.start(t0);
    osc.stop(t0 + dur + 0.08);
  }

  /* ══════════════════════════════════════════════════════════════════════
     COUNT-IN CLICK — sine click at BPM tempo (beat 1 higher)
  ══════════════════════════════════════════════════════════════════════ */
  function playClick(when, isDownbeat) {
    var ctx  = getAC();
    var mg   = getMG(ctx);
    var osc  = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = isDownbeat ? 1200 : 900;

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.35, when + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.07);

    osc.connect(gain);
    gain.connect(mg);
    osc.start(when);
    osc.stop(when + 0.09);
  }

  /* ══════════════════════════════════════════════════════════════════════
     MELODY MODE — fixed-position notation
     All notes rendered once at fixed SVG coordinates when playback begins;
     only CSS classes change during playback.
  ══════════════════════════════════════════════════════════════════════ */

  function beatShape(beats) {
    return {
      isOpen:  beats >= 2 - 0.01,
      hasFlag: Math.abs(beats - 0.5) < 0.01,
      hasDot:  Math.abs(beats - 1.5) < 0.01 || Math.abs(beats - 3.0) < 0.01
    };
  }

  function mkEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
    return el;
  }

  /* Populate sn-melody-group with all melody notes at fixed positions,
     set the SVG viewBox to fit, and swap visibility of the two groups. */
  function enterMelodyMode(melody) {
    var svg   = document.getElementById('notation-svg');
    var scGrp = document.getElementById('sn-scale-group');
    var mlGrp = document.getElementById('sn-melody-group');
    if (!svg || !scGrp || !mlGrp) { return; }

    melodyLen = melody.length;

    while (mlGrp.firstChild) { mlGrp.removeChild(mlGrp.firstChild); }

    /* ── Opening barline ── */
    mlGrp.appendChild(mkEl('line', {
      'class': 'sn-barline',
      x1: '8', y1: '20', x2: '8', y2: '68'
    }));

    /* ── Bass clef (U+1D122) ── */
    var clef = mkEl('text', {
      'class': 'sn-clef',
      x: CLEF_X, y: CLEF_Y,
      'font-size': CLEF_SIZE,
      'dominant-baseline': 'auto'
    });
    clef.textContent = BASS_CLEF;
    mlGrp.appendChild(clef);

    /* ── 4/4 time signature ── */
    var ts1 = mkEl('text', {
      'class': 'sn-timesig',
      x: '54', y: '50',
      'font-size': '19', 'text-anchor': 'middle'
    });
    ts1.textContent = '4';
    mlGrp.appendChild(ts1);

    var ts2 = mkEl('text', {
      'class': 'sn-timesig',
      x: '54', y: '69',
      'font-size': '19', 'text-anchor': 'middle'
    });
    ts2.textContent = '4';
    mlGrp.appendChild(ts2);

    /* ── Pre-compute beat-proportional cx positions ── */
    var cxArr   = [];
    var xCursor = MELODY_START_X;
    for (var j = 0; j < melodyLen; j++) {
      cxArr.push(xCursor);
      xCursor += Math.max(BEAT_MIN_ADV, melody[j][1] * BEAT_PX);
    }

    /* ── Notes ── */
    for (var i = 0; i < melodyLen; i++) {
      var key   = melody[i][0];
      var beats = melody[i][1];
      var np    = NOTE_POS[IDX[key]];
      var cx    = cxArr[i];
      var cy    = np.cy;
      var sx    = cx + 8;    /* stem/flag x */
      var sy    = cy - 32;   /* stem top y */
      var sh    = beatShape(beats);

      /* Ledger line (E2 only) — drawn through the note head */
      if (np.ledger) {
        mlGrp.appendChild(mkEl('line', {
          id:      'sn-m-ledger-' + i,
          'class': 'sn-ledger',
          x1: String(cx - 12), y1: String(cy),
          x2: String(cx + 12), y2: String(cy)
        }));
      }

      /* Accidental (sharp).  Hidden for notes without one. */
      var acc = mkEl('text', {
        id:           'sn-m-acc-' + i,
        'class':      'sn-acc',
        x:            String(cx - 12),
        y:            String(cy + 4),
        'font-size':  '13',
        'text-anchor': 'end'
      });
      acc.textContent = '♯';
      if (!np.hasAcc) { acc.setAttribute('display', 'none'); }
      mlGrp.appendChild(acc);

      /* Stem */
      mlGrp.appendChild(mkEl('line', {
        id:      'sn-m-stem-' + i,
        'class': 'sn-stem',
        x1: String(sx), y1: String(cy),
        x2: String(sx), y2: String(sy)
      }));

      /* Note head — filled (quarter/eighth) or hollow (half/dotted-half) */
      mlGrp.appendChild(mkEl('ellipse', {
        id:      'sn-m-head-' + i,
        'class': sh.isOpen ? 'sn-head open' : 'sn-head',
        cx: String(cx), cy: String(cy),
        rx: '8', ry: '5.5'
      }));

      /* Eighth-note flag */
      if (sh.hasFlag) {
        mlGrp.appendChild(mkEl('path', {
          id:      'sn-m-flag-' + i,
          'class': 'sn-flag',
          d: 'M ' + sx + ',' + sy +
             ' C ' + (sx + 14) + ',' + (sy + 8) +
             ' '  + (sx + 12) + ',' + (sy + 20) +
             ' '  + sx        + ',' + (sy + 22)
        }));
      }

      /* Augmentation dot */
      if (sh.hasDot) {
        mlGrp.appendChild(mkEl('circle', {
          id:      'sn-m-dot-' + i,
          'class': 'sn-dot',
          cx: String(cx + 13), cy: String(cy - 3), r: '2'
        }));
      }
    }

    /* ── End barline (thin + thick) ── */
    var lastCx  = cxArr[melodyLen - 1];
    var barX    = lastCx + 20;
    mlGrp.appendChild(mkEl('line', {
      'class': 'sn-barline',
      x1: String(barX), y1: '20', x2: String(barX), y2: '68'
    }));
    mlGrp.appendChild(mkEl('line', {
      'class': 'sn-barline-thick',
      x1: String(barX + 7), y1: '20', x2: String(barX + 7), y2: '68'
    }));

    /* ── Swap group visibility ── */
    scGrp.setAttribute('display', 'none');
    mlGrp.removeAttribute('display');

    /* ── Expand viewBox to fit all notes ── */
    var vbWidth = barX + 14;
    svg.setAttribute('viewBox', '0 0 ' + vbWidth + ' 95');
    svg.classList.add('melody-mode');
  }

  /* Clear sn-melody-group and restore the static scale layout. */
  function exitMelodyMode() {
    var svg   = document.getElementById('notation-svg');
    var scGrp = document.getElementById('sn-scale-group');
    var mlGrp = document.getElementById('sn-melody-group');

    if (mlGrp) {
      mlGrp.setAttribute('display', 'none');
      while (mlGrp.firstChild) { mlGrp.removeChild(mlGrp.firstChild); }
    }
    melodyLen = 0;

    if (scGrp) { scGrp.removeAttribute('display'); }
    if (svg) {
      /* viewBox matches the 8-note scale staff (68 px spacing, width 590) */
      svg.setAttribute('viewBox', '0 0 590 95');
      svg.classList.remove('melody-mode');
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     NOTATION RENDERING — scale mode
     Uses the static sn-*-{0..7} elements inside sn-scale-group.
     Only CSS classes are toggled; coordinates never change.
  ══════════════════════════════════════════════════════════════════════ */

  function renderScaleLayout() {
    exitMelodyMode();
    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var head = document.getElementById('sn-head-'   + i);
      var stem = document.getElementById('sn-stem-'   + i);
      var acc  = document.getElementById('sn-acc-'    + i);
      var led  = document.getElementById('sn-ledger-' + i);
      if (head) { head.classList.remove('active', 'next-active'); }
      if (stem) { stem.classList.remove('active', 'next-active'); }
      if (acc)  { acc.classList.remove('active', 'next-active');  }
      if (led)  { led.classList.remove('active', 'next-active');  }
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     VISUAL HELPERS — scale-note pills + notation sync
  ══════════════════════════════════════════════════════════════════════ */

  function setScaleActive(scaleIdx, slotIdx) {
    var els = document.querySelectorAll('#bass-scale-player .scale-note');
    els.forEach(function (el, i) { el.classList.toggle('active', i === scaleIdx); });

    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var np   = NOTE_POS[SCALE_PAT[i]];
      var head = document.getElementById('sn-head-'   + i);
      var stem = document.getElementById('sn-stem-'   + i);
      var acc  = document.getElementById('sn-acc-'    + i);
      var led  = document.getElementById('sn-ledger-' + i);
      if (!head) { continue; }
      var isActive = (i === slotIdx);
      head.classList.remove('active', 'next-active');
      stem.classList.remove('active', 'next-active');
      if (acc) { acc.classList.remove('active', 'next-active'); }
      if (led) { led.classList.remove('active', 'next-active'); }
      if (isActive) {
        head.classList.add('active');
        stem.classList.add('active');
        if (acc && np.hasAcc) { acc.classList.add('active'); }
        if (led) { led.classList.add('active'); }
      }
    }
  }

  function clearActive() {
    document.querySelectorAll('#bass-scale-player .scale-note')
      .forEach(function (el) { el.classList.remove('active'); });

    /* Scale-group notes (8 slots) */
    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var head = document.getElementById('sn-head-'   + i);
      var stem = document.getElementById('sn-stem-'   + i);
      var acc  = document.getElementById('sn-acc-'    + i);
      var led  = document.getElementById('sn-ledger-' + i);
      if (head) { head.classList.remove('active', 'next-active'); }
      if (stem) { stem.classList.remove('active', 'next-active'); }
      if (acc)  { acc.classList.remove('active', 'next-active');  }
      if (led)  { led.classList.remove('active', 'next-active');  }
    }

    /* Melody-group notes */
    for (var j = 0; j < melodyLen; j++) {
      var mHead = document.getElementById('sn-m-head-'   + j);
      var mStem = document.getElementById('sn-m-stem-'   + j);
      var mAcc  = document.getElementById('sn-m-acc-'    + j);
      var mFlag = document.getElementById('sn-m-flag-'   + j);
      var mDot  = document.getElementById('sn-m-dot-'    + j);
      var mLed  = document.getElementById('sn-m-ledger-' + j);
      if (mHead) { mHead.classList.remove('active', 'next-active'); }
      if (mStem) { mStem.classList.remove('active', 'next-active'); }
      if (mAcc)  { mAcc.classList.remove('active', 'next-active');  }
      if (mFlag) { mFlag.classList.remove('active', 'next-active'); }
      if (mDot)  { mDot.classList.remove('active', 'next-active');  }
      if (mLed)  { mLed.classList.remove('active', 'next-active');  }
    }
  }

  function schedHighlight(scaleIdx, slotIdx, when) {
    var capturedGen      = gen;
    var capturedScaleIdx = scaleIdx;
    var capturedSlotIdx  = slotIdx;
    var ctx = getAC();
    var delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    var t = setTimeout(function () {
      if (gen === capturedGen) { setScaleActive(capturedScaleIdx, capturedSlotIdx); }
    }, delayMs);
    timers.push(t);
  }

  function schedDynHighlight(pos, when) {
    var capturedGen = gen;
    var capturedPos = pos;
    var capturedLen = melodyLen;
    var ctx = getAC();
    var delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    var t = setTimeout(function () {
      if (gen !== capturedGen) { return; }

      for (var i = 0; i < capturedLen; i++) {
        var head = document.getElementById('sn-m-head-'   + i);
        var stem = document.getElementById('sn-m-stem-'   + i);
        var acc  = document.getElementById('sn-m-acc-'    + i);
        var flag = document.getElementById('sn-m-flag-'   + i);
        var dot  = document.getElementById('sn-m-dot-'    + i);
        var led  = document.getElementById('sn-m-ledger-' + i);
        if (!head) { continue; }
        head.classList.remove('active', 'next-active');
        if (stem) { stem.classList.remove('active', 'next-active'); }
        if (acc)  { acc.classList.remove('active', 'next-active');  }
        if (flag) { flag.classList.remove('active', 'next-active'); }
        if (dot)  { dot.classList.remove('active', 'next-active');  }
        if (led)  { led.classList.remove('active', 'next-active');  }

        if (i === capturedPos) {
          head.classList.add('active');
          if (stem) { stem.classList.add('active'); }
          if (acc  && acc.getAttribute('display') !== 'none') { acc.classList.add('active'); }
          if (flag) { flag.classList.add('active'); }
          if (dot)  { dot.classList.add('active');  }
          if (led)  { led.classList.add('active');  }
        }
      }

      var melody   = MELODIES[melodyVar];
      var scaleIdx = IDX[melody[capturedPos][0]];
      document.querySelectorAll('#bass-scale-player .scale-note')
        .forEach(function (el, i) { el.classList.toggle('active', i === scaleIdx); });
    }, delayMs);
    timers.push(t);
  }

  function cancelTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* ══════════════════════════════════════════════════════════════════════
     BUTTON STATE
  ══════════════════════════════════════════════════════════════════════ */
  function updateButtons() {
    var bScale  = document.getElementById('scale-play-btn');
    var bMelody = document.getElementById('scale-melody-btn');
    var bStop   = document.getElementById('scale-stop-btn');
    if (!bScale) { return; }

    if (mode === 'stopped') {
      bScale.disabled      = false;
      bScale.textContent   = '▶ Play Scale';
      bMelody.disabled     = false;
      bMelody.textContent  = '♪ Play Melody';
      bMelody.classList.remove('melody-active');
      bStop.disabled       = true;
    } else if (mode === 'scale') {
      bScale.disabled      = true;
      bScale.textContent   = '▶ Playing…';
      bMelody.disabled     = true;
      bMelody.classList.remove('melody-active');
      bStop.disabled       = false;
    } else { /* melody */
      bScale.disabled      = true;
      bMelody.disabled     = false;
      bMelody.textContent  = '♪ Next Melody';
      bMelody.classList.add('melody-active');
      bStop.disabled       = false;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     STOP — silences audio immediately, resets all state
  ══════════════════════════════════════════════════════════════════════ */
  function stopAll() {
    gen++;
    mode        = 'stopped';
    countInDone = false;

    if (schedId !== null) { clearInterval(schedId); schedId = null; }
    cancelTimers();
    clearActive();
    renderScaleLayout();

    if (ac && masterGain) {
      var mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.025);
      masterGain = null;
      setTimeout(function () { try { mg.disconnect(); } catch (e) {} }, 80);
    }

    updateButtons();
  }

  /* ══════════════════════════════════════════════════════════════════════
     PLAY SCALE — ascending octave loop: 0 1 2 3 4 5 6 7 | repeat
  ══════════════════════════════════════════════════════════════════════ */
  function scaleTick() {
    if (mode !== 'scale') { return; }
    var ctx = getAC();
    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      var slotIdx  = scalePATPos;
      var scaleIdx = SCALE_PAT[scalePATPos];
      playNote(SCALE[scaleIdx].freq, nextTime, SCALE_DUR);
      schedHighlight(scaleIdx, slotIdx, nextTime);
      nextTime    += SCALE_STEP;
      scalePATPos  = (scalePATPos + 1) % SCALE_PAT.length;
    }
  }

  function playScale() {
    stopAll();
    gen++;
    mode        = 'scale';
    scalePATPos = 0;
    updateButtons();
    var ctx = getAC();
    nextTime = ctx.currentTime + 0.08;
    scaleTick();
    schedId = setInterval(scaleTick, SCHED_MS);
  }

  /* ══════════════════════════════════════════════════════════════════════
     MELODY SCHEDULER — lookahead pattern for seamless looping
  ══════════════════════════════════════════════════════════════════════ */
  function schedulerTick() {
    if (mode !== 'melody') { return; }
    var ctx    = getAC();
    var melody = MELODIES[melodyVar];

    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      var pos   = melodyPos;
      var entry = melody[pos];
      var key   = entry[0];
      var beats = entry[1];
      var dur   = beats * BEAT;

      playNote(HZ[key], nextTime, dur * 0.86);
      schedDynHighlight(pos, nextTime);

      nextTime  += dur;
      melodyPos  = (pos + 1) % melody.length;
    }
  }

  function startScheduler(withCountIn) {
    var ctx    = getAC();
    melodyPos  = 0;

    enterMelodyMode(MELODIES[melodyVar]);

    if (withCountIn && !countInDone) {
      countInDone = true;
      var t0 = ctx.currentTime + 0.1;
      for (var i = 0; i < 4; i++) {
        playClick(t0 + i * BEAT, i === 0);
      }
      nextTime = t0 + 4 * BEAT;
    } else {
      nextTime = ctx.currentTime + 0.08;
    }

    schedulerTick();
    schedId = setInterval(schedulerTick, SCHED_MS);
  }

  /* ══════════════════════════════════════════════════════════════════════
     PLAY MELODY / SWITCH VARIATION
  ══════════════════════════════════════════════════════════════════════ */
  function playMelody() {
    if (mode === 'melody') {
      switchVariation((melodyVar + 1) % MELODIES.length);
      return;
    }
    stopAll();
    gen++;
    mode      = 'melody';
    melodyVar = 0;
    updateButtons();
    startScheduler(true);
  }

  function switchVariation(newVar) {
    gen++;
    cancelTimers();
    clearActive();

    if (schedId !== null) { clearInterval(schedId); schedId = null; }

    if (ac && masterGain) {
      var mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.04);
      masterGain = null;
      setTimeout(function () { try { mg.disconnect(); } catch (e) {} }, 80);
    }

    melodyVar = newVar;

    var capturedGen = gen;
    setTimeout(function () {
      if (gen !== capturedGen || mode !== 'melody') { return; }
      startScheduler(false);
    }, 55);
  }

  /* ══════════════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════════════ */
  function setup() {
    var bScale  = document.getElementById('scale-play-btn');
    var bMelody = document.getElementById('scale-melody-btn');
    var bStop   = document.getElementById('scale-stop-btn');
    if (!bScale) { return; }

    renderScaleLayout();

    bScale.addEventListener('click',  playScale);
    bMelody.addEventListener('click', playMelody);
    bStop.addEventListener('click',   stopAll);

    updateButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

}());
