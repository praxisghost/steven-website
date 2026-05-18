(function () {
  'use strict';

  /* ── Scale definition ────────────────────────────────────────────────
     E Minor Pentatonic (open-position E shape on guitar):
     E  G  A  B  D   (ascending, single octave)
     Frequencies use equal temperament, A4 = 440 Hz.
  ──────────────────────────────────────────────────────────────────── */
  var NOTES = [
    { name: 'E',  interval: 'I',    freq: 329.63 },  // E4
    { name: 'G',  interval: '♭III', freq: 392.00 },  // G4
    { name: 'A',  interval: 'IV',   freq: 440.00 },  // A4
    { name: 'B',  interval: 'V',    freq: 493.88 },  // B4
    { name: 'D',  interval: '♭VII', freq: 587.33 }   // D5
  ];

  /* ── Timing ─────────────────────────────────────────────────────────
     NOTE_DUR : how long each synthesized note sounds (seconds)
     NOTE_GAP : silence between notes (seconds)
     STEP     : total time per slot  */
  var NOTE_DUR = 0.65;
  var NOTE_GAP = 0.18;
  var STEP     = NOTE_DUR + NOTE_GAP;

  /* ── State ──────────────────────────────────────────────────────────*/
  var audioCtx  = null;
  var isPlaying = false;
  var timers    = [];

  /* ── Audio context (lazy) ────────────────────────────────────────── */
  function ctx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  /* ── Synthesize one plucked-string tone ─────────────────────────────
     Signal chain: oscillator → lowpass filter → shaper → gain → out
     Envelope mimics a plucked string: fast attack, fast decay, long tail.
  ──────────────────────────────────────────────────────────────────── */
  function playTone(freq, when, ac) {
    var osc     = ac.createOscillator();
    var filter  = ac.createBiquadFilter();
    var shaper  = ac.createWaveShaper();
    var gain    = ac.createGain();

    /* Slight wave shaping gives harmonic warmth */
    var curve = new Float32Array(256);
    for (var i = 0; i < 256; i++) {
      var x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 80) * x) / (Math.PI + 80 * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.oversample = '4x';

    osc.type = 'triangle';
    osc.frequency.value = freq;

    /* Lowpass softens the harshness of triangle wave */
    filter.type = 'lowpass';
    filter.frequency.value = 1600;
    filter.Q.value = 0.4;

    /* Plucked-string amplitude envelope */
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.38, when + 0.012);   // fast attack
    gain.gain.exponentialRampToValueAtTime(0.18, when + 0.10); // initial decay
    gain.gain.exponentialRampToValueAtTime(0.001, when + NOTE_DUR); // release tail

    osc.connect(filter);
    filter.connect(shaper);
    shaper.connect(gain);
    gain.connect(ac.destination);

    osc.start(when);
    osc.stop(when + NOTE_DUR + 0.05);
  }

  /* ── DOM helpers ─────────────────────────────────────────────────── */
  function getNoteEls() {
    return document.querySelectorAll('#scale-player .scale-note');
  }

  function setActive(index) {
    getNoteEls().forEach(function (el, i) {
      el.classList.toggle('active', i === index);
    });
  }

  function clearActive() {
    getNoteEls().forEach(function (el) {
      el.classList.remove('active');
    });
  }

  function setBtn(playing) {
    var btn = document.getElementById('scale-play-btn');
    if (!btn) return;
    btn.disabled = playing;
    btn.textContent = playing ? '▶ Playing…' : '▶ Play Scale';
  }

  /* ── Cancel any running timers ───────────────────────────────────── */
  function cancelAll() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* ── Main play sequence ──────────────────────────────────────────── */
  function playScale() {
    if (isPlaying) return;
    isPlaying = true;
    cancelAll();
    setBtn(true);

    var ac   = ctx();
    var base = ac.currentTime + 0.08; // small buffer to avoid glitches

    /* Resume if suspended (autoplay policy in some browsers) */
    if (ac.state === 'suspended') {
      ac.resume();
    }

    NOTES.forEach(function (note, i) {
      var when  = base + i * STEP;
      var delayMs = Math.max(0, (when - ac.currentTime) * 1000);

      /* Schedule audio */
      playTone(note.freq, when, ac);

      /* Schedule highlight — driven by wall-clock so it stays visual */
      var t = setTimeout(function () { setActive(i); }, delayMs);
      timers.push(t);
    });

    /* Schedule reset after last note finishes */
    var totalMs = ((NOTES.length - 1) * STEP + NOTE_DUR) * 1000 + 250;
    var endT = setTimeout(function () {
      clearActive();
      isPlaying = false;
      setBtn(false);
    }, (base - ac.currentTime) * 1000 + totalMs);
    timers.push(endT);
  }

  /* ── Boot ────────────────────────────────────────────────────────── */
  function setup() {
    var btn = document.getElementById('scale-play-btn');
    if (!btn) return;
    btn.addEventListener('click', playScale);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

}());
