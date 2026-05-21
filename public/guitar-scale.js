(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     E MAJOR PENTATONIC SCALE
     Notes:     E     F♯    G♯    B     C♯
     Intervals: I     II    III   V     VI
     Scale index 0–4 maps to these five tones in ascending order.
  ══════════════════════════════════════════════════════════════════════ */

  var SCALE = [
    { name: 'E',  interval: 'I',   freq: 329.63 },  // E4   — scale idx 0
    { name: 'F♯', interval: 'II',  freq: 369.99 },  // F♯4  — scale idx 1
    { name: 'G♯', interval: 'III', freq: 415.30 },  // G♯4  — scale idx 2
    { name: 'B',  interval: 'V',   freq: 493.88 },  // B4   — scale idx 3
    { name: 'C♯', interval: 'VI',  freq: 554.37 }   // C♯5  — scale idx 4
  ];

  /* Frequency table — all E Major Pentatonic pitches across octaves */
  var HZ = {
    E3:  164.81,  Fs3: 185.00,  Gs3: 207.65,  B3: 246.94,  Cs4: 277.18,
    E4:  329.63,  Fs4: 369.99,  Gs4: 415.30,  B4: 493.88,  Cs5: 554.37,
    E5:  659.25,  Fs5: 739.99,  Gs5: 830.61,  B5: 987.77
  };

  /* Note key → scale display index (0–4) */
  var IDX = {
    E3: 0,  E4: 0,  E5: 0,
    Fs3: 1, Fs4: 1, Fs5: 1,
    Gs3: 2, Gs4: 2, Gs5: 2,
    B3:  3, B4:  3, B5:  3,
    Cs4: 4, Cs5: 4
  };

  /* SVG staff position data for each scale index.
     cy values: line 1=68, space 1=62, line 2=56, line 3=44, space 3=38  */
  var NOTE_POS = [
    { cy: 68, hasAcc: false },  // 0 → E4   (line 1)
    { cy: 62, hasAcc: true  },  // 1 → F♯4  (space 1)
    { cy: 56, hasAcc: true  },  // 2 → G♯4  (line 2)
    { cy: 44, hasAcc: false },  // 3 → B4   (line 3)
    { cy: 38, hasAcc: true  }   // 4 → C♯5  (space 3)
  ];

  /* ── Melody mode layout ──────────────────────────────────────────── */
  var SVG_NS         = 'http://www.w3.org/2000/svg';
  var MELODY_START_X = 76;   // cx of note 0 (after barline + clef + time sig)
  var MELODY_SPACING = 34;   // kept for reference; melody now uses beat-proportional spacing
  var BEAT_PX        = 48;   // pixels per beat in proportional melody layout
  var BEAT_MIN_ADV   = 36;   // minimum px advance even for short notes (avoids overlap)

  /* ══════════════════════════════════════════════════════════════════════
     MELODY DEFINITIONS
     Format: [noteKey, durationBeats]
     BPM = 96  →  one beat = 0.625 s
  ══════════════════════════════════════════════════════════════════════ */
  var BPM  = 96;
  var BEAT = 60 / BPM;  // 0.625 s

  var MELODIES = [
    /* 0 — "Sunrise": flowing, mostly stepwise, resolves to E */
    [
      ['E4',  1],  ['Gs4', 1],  ['B4',  1],  ['Cs5', 2],
      ['B4',  1],  ['Gs4', 1],  ['Fs4', 1],  ['E4',  2],
      ['Gs4', 1],  ['B4',  1],  ['Cs5', 1],  ['B4',  0.5],
      ['Gs4', 0.5],['Fs4', 1],  ['E4',  3]
    ],
    /* 1 — "Dance": eighth-note drive, call-and-response */
    [
      ['E4',  0.5],['Fs4', 0.5],['Gs4', 1],  ['B4',  0.5],['Gs4', 0.5],
      ['Fs4', 1],  ['E4',  2],
      ['Cs5', 1],  ['B4',  0.5],['Gs4', 0.5],['Fs4', 1],
      ['E4',  1.5],['Fs4', 0.5],['Gs4', 1],  ['B4',  1],  ['E4',  2]
    ],
    /* 2 — "Wanderer": wider range, descending tension → resolution */
    [
      ['Cs5', 2],  ['B4',  1],  ['Gs4', 1],  ['Fs4', 2],
      ['E4',  1],  ['Gs4', 1],  ['B4',  2],
      ['Cs5', 1.5],['B4',  0.5],['Gs4', 1],  ['Fs4', 1],
      ['E4',  3]
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
     Pattern: ascending then descending (E F# G# B C# B G# F# then loop).
     SCALE_PAT maps pattern step → scale index (0–4).
     SCALE_SLOT_COUNT = number of fixed SVG note slots in sn-scale-group. */
  var SCALE_DUR        = 0.60;
  var SCALE_GAP        = 0.18;
  var SCALE_STEP       = SCALE_DUR + SCALE_GAP;
  var SCALE_PAT        = [0, 1, 2, 3, 4, 3, 2, 1];  // asc → desc loop
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
     TONE SYNTHESIS — plucked-string envelope
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
    filt.frequency.value = 1700;
    filt.Q.value = 0.3;

    var t0       = when;
    var tPeak    = t0 + 0.012;
    var tDecay   = t0 + Math.min(0.12, dur * 0.25);
    var tRelease = t0 + dur * 0.9;

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.36, tPeak);
    gain.gain.exponentialRampToValueAtTime(0.20, tDecay);
    gain.gain.exponentialRampToValueAtTime(0.001, tRelease);

    osc.connect(filt);
    filt.connect(gain);
    gain.connect(mg);

    osc.start(t0);
    osc.stop(t0 + dur + 0.08);
  }

  /* ══════════════════════════════════════════════════════════════════════
     COUNT-IN CLICK — sine click at BPM tempo
     Beat 1 is slightly higher pitch (downbeat cue).
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
     ─────────────────────────────────────────────────────────────────────
     All notes are rendered once at fixed SVG coordinates when melody
     playback begins.  Nothing is ever repositioned during playback;
     only CSS classes change to reflect the current note.
  ══════════════════════════════════════════════════════════════════════ */

  /* Classify a beat duration into note-head appearance flags.
     isOpen  → hollow head (half notes, dotted half)
     hasFlag → single flag on stem top (eighth notes)
     hasDot  → augmentation dot after note head (dotted values) */
  function beatShape(beats) {
    return {
      isOpen:  beats >= 2 - 0.01,
      hasFlag: Math.abs(beats - 0.5) < 0.01,
      hasDot:  Math.abs(beats - 1.5) < 0.01 || Math.abs(beats - 3.0) < 0.01
    };
  }

  /* Build a single SVG element inside melGroup */
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

    /* Clear any previously rendered melody notes */
    while (mlGrp.firstChild) { mlGrp.removeChild(mlGrp.firstChild); }

    /* ── Opening barline ── */
    mlGrp.appendChild(mkEl('line', {
      'class': 'sn-barline',
      x1: '8', y1: '20', x2: '8', y2: '68'
    }));

    /* ── Treble clef — U+1D11E is a supplementary character ── */
    var clef = mkEl('text', {
      'class': 'sn-clef',
      x: '11', y: '70',
      'font-size': '62',
      'dominant-baseline': 'auto'
    });
    clef.textContent = String.fromCodePoint(0x1D11E);
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

    /* ── Pre-compute beat-proportional cx positions ──
         Each note advances by max(BEAT_MIN_ADV, beats × BEAT_PX) so that
         short notes (eighth) have enough room and longer notes spread
         proportionally.  cx is the centre of the note head. */
    var cxArr   = [];
    var xCursor = MELODY_START_X;
    for (var j = 0; j < melodyLen; j++) {
      cxArr.push(xCursor);
      xCursor += Math.max(BEAT_MIN_ADV, melody[j][1] * BEAT_PX);
    }

    /* ── Notes: one per melody entry, at permanently fixed positions ── */
    for (var i = 0; i < melodyLen; i++) {
      var key   = melody[i][0];
      var beats = melody[i][1];
      var np    = NOTE_POS[IDX[key]];
      var cx    = cxArr[i];
      var cy    = np.cy;
      var sx    = cx + 8;    /* stem/flag x */
      var sy    = cy - 32;   /* stem top y */
      var sh    = beatShape(beats);

      /* Accidental (sharp symbol).  Hidden for notes without one. */
      var acc = mkEl('text', {
        id:           'sn-m-acc-' + i,
        'class':      'sn-acc',
        x:            String(cx - 12),   /* text-anchor=end → 4 px gap to note head */
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

      /* Eighth-note flag — one curved stroke hanging from the stem top */
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

      /* Augmentation dot — appears for dotted quarter and dotted half */
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
    var vbWidth = barX + 14;   /* thick barline end + small right margin */
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
     Uses the static sn-head/stem/acc-{0..7} elements inside sn-scale-group.
     Only CSS classes are toggled; coordinates never change.
  ══════════════════════════════════════════════════════════════════════ */

  /* Restore scale layout (all 8 note slots inactive).  Called on stop/setup. */
  function renderScaleLayout() {
    exitMelodyMode();
    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var head = document.getElementById('sn-head-' + i);
      var stem = document.getElementById('sn-stem-' + i);
      var acc  = document.getElementById('sn-acc-'  + i);
      if (head) { head.classList.remove('active', 'next-active'); }
      if (stem) { stem.classList.remove('active', 'next-active'); }
      if (acc)  { acc.classList.remove('active', 'next-active');  }
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     VISUAL HELPERS — scale-note pills + notation sync
  ══════════════════════════════════════════════════════════════════════ */

  /* Highlight scale-note pill by scaleIdx and SVG scale slot by slotIdx. */
  function setScaleActive(scaleIdx, slotIdx) {
    /* Update note-name pills */
    var els = document.querySelectorAll('#scale-player .scale-note');
    els.forEach(function (el, i) { el.classList.toggle('active', i === scaleIdx); });

    /* Update SVG scale slots */
    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var np   = NOTE_POS[SCALE_PAT[i]];
      var head = document.getElementById('sn-head-' + i);
      var stem = document.getElementById('sn-stem-' + i);
      var acc  = document.getElementById('sn-acc-'  + i);
      if (!head) { continue; }
      var isActive = (i === slotIdx);
      head.classList.remove('active', 'next-active');
      stem.classList.remove('active', 'next-active');
      if (acc) { acc.classList.remove('active', 'next-active'); }
      if (isActive) {
        head.classList.add('active');
        stem.classList.add('active');
        if (acc && np.hasAcc) { acc.classList.add('active'); }
      }
    }
  }

  /* Remove all highlight classes from pills and both SVG groups */
  function clearActive() {
    document.querySelectorAll('#scale-player .scale-note')
      .forEach(function (el) { el.classList.remove('active'); });

    /* Scale-group notes (8 slots) */
    for (var i = 0; i < SCALE_SLOT_COUNT; i++) {
      var head = document.getElementById('sn-head-' + i);
      var stem = document.getElementById('sn-stem-' + i);
      var acc  = document.getElementById('sn-acc-'  + i);
      if (head) { head.classList.remove('active', 'next-active'); }
      if (stem) { stem.classList.remove('active', 'next-active'); }
      if (acc)  { acc.classList.remove('active', 'next-active');  }
    }

    /* Melody-group notes (head, stem, acc, flag, dot) */
    for (var j = 0; j < melodyLen; j++) {
      var mHead = document.getElementById('sn-m-head-' + j);
      var mStem = document.getElementById('sn-m-stem-' + j);
      var mAcc  = document.getElementById('sn-m-acc-'  + j);
      var mFlag = document.getElementById('sn-m-flag-' + j);
      var mDot  = document.getElementById('sn-m-dot-'  + j);
      if (mHead) { mHead.classList.remove('active', 'next-active'); }
      if (mStem) { mStem.classList.remove('active', 'next-active'); }
      if (mAcc)  { mAcc.classList.remove('active', 'next-active');  }
      if (mFlag) { mFlag.classList.remove('active', 'next-active'); }
      if (mDot)  { mDot.classList.remove('active', 'next-active');  }
    }
  }

  /* Schedule a scale-mode visual update at a future AudioContext time.
     scaleIdx = scale note index (0–4) for pill highlight
     slotIdx  = pattern position (0–7) for SVG slot highlight */
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

  /* Schedule a melody highlight at a future AudioContext time.
     pos = index of the note that is about to sound (→ green).
     Only CSS classes are modified; SVG element positions never change. */
  function schedDynHighlight(pos, when) {
    var capturedGen = gen;
    var capturedPos = pos;
    var capturedLen = melodyLen;
    var ctx = getAC();
    var delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    var t = setTimeout(function () {
      if (gen !== capturedGen) { return; }

      /* Update every note in the melody group — class-only */
      for (var i = 0; i < capturedLen; i++) {
        var head = document.getElementById('sn-m-head-' + i);
        var stem = document.getElementById('sn-m-stem-' + i);
        var acc  = document.getElementById('sn-m-acc-'  + i);
        var flag = document.getElementById('sn-m-flag-' + i);
        var dot  = document.getElementById('sn-m-dot-'  + i);
        if (!head) { continue; }
        head.classList.remove('active', 'next-active');
        if (stem) { stem.classList.remove('active', 'next-active'); }
        if (acc)  { acc.classList.remove('active', 'next-active');  }
        if (flag) { flag.classList.remove('active', 'next-active'); }
        if (dot)  { dot.classList.remove('active', 'next-active');  }

        if (i === capturedPos) {
          head.classList.add('active');
          if (stem) { stem.classList.add('active'); }
          if (acc  && acc.getAttribute('display')  !== 'none') { acc.classList.add('active');  }
          if (flag) { flag.classList.add('active'); }
          if (dot)  { dot.classList.add('active');  }
        }
      }

      /* Sync scale-note pills to the currently sounding note */
      var melody   = MELODIES[melodyVar];
      var scaleIdx = IDX[melody[capturedPos][0]];
      document.querySelectorAll('#scale-player .scale-note')
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
    countInDone = false;  /* allow count-in again on next Play Melody */

    if (schedId !== null) { clearInterval(schedId); schedId = null; }
    cancelTimers();
    clearActive();
    renderScaleLayout(); /* restore static eight-note staff */

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
     PLAY SCALE — ascending then descending loop: 0 1 2 3 4 3 2 1 | repeat
     Notes remain at fixed SVG positions; only the active slot highlights.
  ══════════════════════════════════════════════════════════════════════ */
  function scaleTick() {
    if (mode !== 'scale') { return; }
    var ctx = getAC();
    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      var slotIdx  = scalePATPos;              // 0–7 → SVG slot position
      var scaleIdx = SCALE_PAT[scalePATPos];   // 0–4 → scale note & pill
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
     schedDynHighlight only toggles CSS classes — notes never move.
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

      playNote(HZ[key], nextTime, dur * 0.86); /* slight gap between notes */
      schedDynHighlight(pos, nextTime);

      nextTime  += dur;
      melodyPos  = (pos + 1) % melody.length;
    }
  }

  /* ── Start (or restart) the scheduler ──
     withCountIn: play 4 click beats before the melody begins.
     Calls enterMelodyMode to build all notes at fixed positions before
     the first sound; the scheduler will then only update CSS classes.  */
  function startScheduler(withCountIn) {
    var ctx    = getAC();
    var melody = MELODIES[melodyVar];
    melodyPos  = 0;

    /* Build melody staff with all notes at fixed, permanent positions */
    enterMelodyMode(melody);

    if (withCountIn && !countInDone) {
      countInDone = true;
      var t0 = ctx.currentTime + 0.1;
      /* Four clicks: beat 1 higher (downbeat cue), beats 2–4 lower */
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
      /* Already playing — advance to next variation (no count-in) */
      switchVariation((melodyVar + 1) % MELODIES.length);
      return;
    }
    stopAll();
    gen++;
    mode      = 'melody';
    melodyVar = 0;
    updateButtons();
    startScheduler(true); /* with 1-2-3-4 count-in */
  }

  function switchVariation(newVar) {
    gen++;
    cancelTimers();
    clearActive();

    if (schedId !== null) { clearInterval(schedId); schedId = null; }

    /* Quick fade on master gain before switching */
    if (ac && masterGain) {
      var mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.04);
      masterGain = null;
      setTimeout(function () { try { mg.disconnect(); } catch (e) {} }, 80);
    }

    melodyVar = newVar;

    /* Brief pause lets the crossfade complete */
    var capturedGen = gen;
    setTimeout(function () {
      if (gen !== capturedGen || mode !== 'melody') { return; }
      startScheduler(false); /* no count-in on variation switch */
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

    /* Ensure SVG starts in the canonical static scale layout */
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
