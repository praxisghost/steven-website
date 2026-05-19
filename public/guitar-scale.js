(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     E MAJOR PENTATONIC SCALE
     Notes:     E     F♯    G♯    B     C♯
     Intervals: I     II    III   V     VI
     All audio and visuals use only these five notes (any octave).
  ══════════════════════════════════════════════════════════════════════ */

  /* Visual scale definition — drives the display indices 0–4 */
  var SCALE = [
    { name: 'E',  interval: 'I',   freq: 329.63 },  // E4
    { name: 'F♯', interval: 'II',  freq: 369.99 },  // F♯4
    { name: 'G♯', interval: 'III', freq: 415.30 },  // G♯4
    { name: 'B',  interval: 'V',   freq: 493.88 },  // B4
    { name: 'C♯', interval: 'VI',  freq: 554.37 }   // C♯5
  ];

  /* Frequency table — all octaves available to melodies.
     Key format: note name + octave number.
     Every key MUST belong to E Major Pentatonic.               */
  var HZ = {
    E3:  164.81,  Fs3: 185.00,  Gs3: 207.65,  B3: 246.94,  Cs4: 277.18,
    E4:  329.63,  Fs4: 369.99,  Gs4: 415.30,  B4: 493.88,  Cs5: 554.37,
    E5:  659.25,  Fs5: 739.99,  Gs5: 830.61,  B5: 987.77
  };

  /* Maps any note key → scale display index (0–4) for highlighting */
  var IDX = {
    E3: 0,  E4: 0,  E5: 0,
    Fs3: 1, Fs4: 1, Fs5: 1,
    Gs3: 2, Gs4: 2, Gs5: 2,
    B3: 3,  B4: 3,  B5: 3,
    Cs4: 4, Cs5: 4
  };

  /* ══════════════════════════════════════════════════════════════════════
     MELODY DEFINITIONS
     Format: each entry is [ noteKey, durationBeats ]
     BPM = 96  →  1 beat = 0.625 s
     All note keys are verified E Major Pentatonic members above.
  ══════════════════════════════════════════════════════════════════════ */
  var BPM  = 96;
  var BEAT = 60 / BPM;   // 0.625 s per beat

  var MELODIES = [
    /* 0 — "Sunrise" : flowing, mostly stepwise, resolves to E */
    [
      ['E4',  1],  ['Gs4', 1],  ['B4',  1],  ['Cs5', 2],
      ['B4',  1],  ['Gs4', 1],  ['Fs4', 1],  ['E4',  2],
      ['Gs4', 1],  ['B4',  1],  ['Cs5', 1],  ['B4',  0.5],
      ['Gs4', 0.5],['Fs4', 1],  ['E4',  3]
    ],
    /* 1 — "Dance" : eighth-note rhythmic drive, call-and-response */
    [
      ['E4',  0.5],['Fs4', 0.5],['Gs4', 1],  ['B4',  0.5],['Gs4', 0.5],
      ['Fs4', 1],  ['E4',  2],
      ['Cs5', 1],  ['B4',  0.5],['Gs4', 0.5],['Fs4', 1],
      ['E4',  1.5],['Fs4', 0.5],['Gs4', 1],  ['B4',  1],  ['E4',  2]
    ],
    /* 2 — "Wanderer" : wider range, descending tension → resolution */
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
  var ac         = null;    // AudioContext (lazy)
  var masterGain = null;    // Master GainNode routed to ac.destination
  var mode       = 'stopped'; // 'stopped' | 'scale' | 'melody'
  var gen        = 0;       // Generation counter — guards stale callbacks
  var melodyVar  = 0;       // Which MELODIES[] index is playing
  var melodyPos  = 0;       // Position within the current melody
  var nextTime   = 0;       // Next scheduled note time (AudioContext seconds)
  var schedId    = null;    // setInterval id for the melody scheduler
  var timers     = [];      // All pending setTimeout ids

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

  /* Always route through masterGain so we can fade-stop instantly */
  function getMG(ctx) {
    if (!masterGain || masterGain.context.state === 'closed') {
      masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
    }
    return masterGain;
  }

  /* Silently disconnect the old master gain and clear the reference
     so the next playback gets a fresh one with gain = 1            */
  function dropMG() {
    if (masterGain) {
      try { masterGain.disconnect(); } catch (e) {}
      masterGain = null;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     TONE SYNTHESIS  — plucked-string envelope
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

    /* Fast attack → decay to sustain → long release tail */
    var t0      = when;
    var tPeak   = t0 + 0.012;
    var tDecay  = t0 + Math.min(0.12, dur * 0.25);
    var tRelease= t0 + dur * 0.9;

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
     VISUAL HELPERS
  ══════════════════════════════════════════════════════════════════════ */
  function setActive(idx) {
    var els = document.querySelectorAll('#scale-player .scale-note');
    els.forEach(function (el, i) { el.classList.toggle('active', i === idx); });
  }

  function clearActive() {
    document.querySelectorAll('#scale-player .scale-note')
      .forEach(function (el) { el.classList.remove('active'); });
  }

  /* Schedule a visual highlight at an AudioContext future time */
  function schedHighlight(scaleIdx, when) {
    var capturedGen = gen;
    var capturedIdx = scaleIdx;
    var ctx = getAC();
    var delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    var t = setTimeout(function () {
      if (gen === capturedGen) { setActive(capturedIdx); }
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
    if (!bScale) return;

    if (mode === 'stopped') {
      bScale.disabled   = false;
      bScale.textContent = '▶ Play Scale';
      bMelody.disabled  = false;
      bMelody.textContent = '♪ Play Melody';
      bMelody.classList.remove('melody-active');
      bStop.disabled    = true;
    } else if (mode === 'scale') {
      bScale.disabled   = true;
      bScale.textContent = '▶ Playing…';
      bMelody.disabled  = true;
      bMelody.classList.remove('melody-active');
      bStop.disabled    = false;
    } else { /* melody */
      bScale.disabled   = true;
      bMelody.disabled  = false;
      bMelody.textContent = '♪ Next Melody';
      bMelody.classList.add('melody-active');
      bStop.disabled    = false;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     STOP — silences audio immediately, resets all state
  ══════════════════════════════════════════════════════════════════════ */
  function stopAll() {
    gen++;                    // invalidate all pending callbacks
    mode = 'stopped';

    if (schedId !== null) { clearInterval(schedId); schedId = null; }
    cancelTimers();
    clearActive();

    /* Fade master gain to zero (prevents click), then rebuild it fresh */
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
     PLAY SCALE — continuous ping-pong: 0 1 2 3 4 3 2 1 | repeat
     Runs indefinitely until Stop is pressed.
  ══════════════════════════════════════════════════════════════════════ */
  var SCALE_DUR   = 0.60;
  var SCALE_GAP   = 0.18;
  var SCALE_STEP  = SCALE_DUR + SCALE_GAP;
  var PING_PONG   = [0, 1, 2, 3, 4, 3, 2, 1]; // repeating index cycle
  var scalePPPos  = 0;                          // position within PING_PONG

  function scaleTick() {
    if (mode !== 'scale') return;
    var ctx = getAC();
    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      var idx  = PING_PONG[scalePPPos];
      playNote(SCALE[idx].freq, nextTime, SCALE_DUR);
      schedHighlight(idx, nextTime);
      nextTime   += SCALE_STEP;
      scalePPPos  = (scalePPPos + 1) % PING_PONG.length;
    }
  }

  function playScale() {
    stopAll();
    gen++;
    mode       = 'scale';
    scalePPPos = 0;
    updateButtons();
    var ctx = getAC();
    nextTime = ctx.currentTime + 0.08;
    scaleTick();                              // immediate first fill
    schedId = setInterval(scaleTick, SCHED_MS);
  }

  /* ══════════════════════════════════════════════════════════════════════
     MELODY SCHEDULER — lookahead pattern for seamless looping
  ══════════════════════════════════════════════════════════════════════ */
  var SCHED_AHEAD = 0.40;   // seconds to schedule ahead of playhead
  var SCHED_MS    = 80;     // scheduler tick interval (ms)

  function schedulerTick() {
    if (mode !== 'melody') return;
    var ctx    = getAC();
    var melody = MELODIES[melodyVar];

    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      var entry   = melody[melodyPos];
      var key     = entry[0];
      var beats   = entry[1];
      var dur     = beats * BEAT;
      var freq    = HZ[key];
      var idx     = IDX[key];

      playNote(freq, nextTime, dur * 0.86); // slight natural gap between notes
      schedHighlight(idx, nextTime);

      nextTime += dur;
      melodyPos = (melodyPos + 1) % melody.length;
    }
  }

  function startScheduler() {
    var ctx = getAC();
    nextTime  = ctx.currentTime + 0.08;
    melodyPos = 0;
    schedulerTick();                         // immediate first fill
    schedId = setInterval(schedulerTick, SCHED_MS);
  }

  /* ══════════════════════════════════════════════════════════════════════
     PLAY MELODY / SWITCH VARIATION
  ══════════════════════════════════════════════════════════════════════ */
  function playMelody() {
    if (mode === 'melody') {
      /* Already playing — switch to next variation */
      switchVariation((melodyVar + 1) % MELODIES.length);
      return;
    }
    stopAll();
    gen++;
    mode      = 'melody';
    melodyVar = 0;
    updateButtons();
    startScheduler();
  }

  function switchVariation(newVar) {
    /* Advance generation so all stale highlights become no-ops */
    gen++;
    cancelTimers();
    clearActive();

    /* Stop the current scheduler */
    if (schedId !== null) { clearInterval(schedId); schedId = null; }

    /* Quick fade on the master gain, then restart with new melody */
    if (ac && masterGain) {
      var mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.04);
      masterGain = null;
      setTimeout(function () { try { mg.disconnect(); } catch (e) {} }, 80);
    }

    melodyVar = newVar;

    /* Small delay to let the crossfade complete before new notes arrive */
    var capturedGen = gen;
    setTimeout(function () {
      if (gen !== capturedGen || mode !== 'melody') return;
      startScheduler();
    }, 55);
  }

  /* ══════════════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════════════ */
  function setup() {
    var bScale  = document.getElementById('scale-play-btn');
    var bMelody = document.getElementById('scale-melody-btn');
    var bStop   = document.getElementById('scale-stop-btn');
    if (!bScale) return;

    bScale.addEventListener('click',  playScale);
    bMelody.addEventListener('click', playMelody);
    bStop.addEventListener('click',   stopAll);

    updateButtons(); // set correct initial disabled state
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

}());
