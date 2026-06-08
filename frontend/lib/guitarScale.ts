/**
 * E Major Pentatonic interactive scale player + synchronized staff notation.
 * Faithful TypeScript port of /website/public/guitar-scale.js (Web Audio engine).
 * Drives the SVG/markup rendered by components/GuitarGuide.tsx via element ids.
 * setupGuitarScale() wires the buttons and returns a teardown function.
 */

type Note = { name: string; interval: string; freq: number };

const SCALE: Note[] = [
  { name: "E", interval: "I", freq: 329.63 },
  { name: "F♯", interval: "II", freq: 369.99 },
  { name: "G♯", interval: "III", freq: 415.3 },
  { name: "B", interval: "V", freq: 493.88 },
  { name: "C♯", interval: "VI", freq: 554.37 },
];

const HZ: Record<string, number> = {
  E3: 164.81, Fs3: 185.0, Gs3: 207.65, B3: 246.94, Cs4: 277.18,
  E4: 329.63, Fs4: 369.99, Gs4: 415.3, B4: 493.88, Cs5: 554.37,
  E5: 659.25, Fs5: 739.99, Gs5: 830.61, B5: 987.77,
};

const IDX: Record<string, number> = {
  E3: 0, E4: 0, E5: 0, Fs3: 1, Fs4: 1, Fs5: 1, Gs3: 2, Gs4: 2, Gs5: 2,
  B3: 3, B4: 3, B5: 3, Cs4: 4, Cs5: 4,
};

const NOTE_POS = [
  { cy: 68, hasAcc: false }, { cy: 62, hasAcc: true }, { cy: 56, hasAcc: true },
  { cy: 44, hasAcc: false }, { cy: 38, hasAcc: true },
];

const SVG_NS = "http://www.w3.org/2000/svg";
const MELODY_START_X = 76;
const BEAT_PX = 48;
const BEAT_MIN_ADV = 36;

const BPM = 96;
const BEAT = 60 / BPM;

type MelNote = [string, number];
const MELODIES: MelNote[][] = [
  [["E4", 1], ["Gs4", 1], ["B4", 1], ["Cs5", 2], ["B4", 1], ["Gs4", 1],
   ["Fs4", 1], ["E4", 2], ["Gs4", 1], ["B4", 1], ["Cs5", 1], ["B4", 0.5],
   ["Gs4", 0.5], ["Fs4", 1], ["E4", 3]],
  [["E4", 0.5], ["Fs4", 0.5], ["Gs4", 1], ["B4", 0.5], ["Gs4", 0.5],
   ["Fs4", 1], ["E4", 2], ["Cs5", 1], ["B4", 0.5], ["Gs4", 0.5], ["Fs4", 1],
   ["E4", 1.5], ["Fs4", 0.5], ["Gs4", 1], ["B4", 1], ["E4", 2]],
  [["Cs5", 2], ["B4", 1], ["Gs4", 1], ["Fs4", 2], ["E4", 1], ["Gs4", 1],
   ["B4", 2], ["Cs5", 1.5], ["B4", 0.5], ["Gs4", 1], ["Fs4", 1], ["E4", 3]],
];

const SCALE_DUR = 0.6;
const SCALE_GAP = 0.18;
const SCALE_STEP = SCALE_DUR + SCALE_GAP;
const SCALE_PAT = [0, 1, 2, 3, 4, 3, 2, 1];
const SCALE_SLOT_COUNT = 8;
const SCHED_AHEAD = 0.4;
const SCHED_MS = 80;

export function setupGuitarScale(): () => void {
  let ac: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let mode: "stopped" | "scale" | "melody" = "stopped";
  let gen = 0;
  let melodyVar = 0;
  let melodyPos = 0;
  let melodyLen = 0;
  let nextTime = 0;
  let schedId: ReturnType<typeof setInterval> | null = null;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let countInDone = false;
  let scalePATPos = 0;

  const $ = (id: string) => document.getElementById(id);

  function getAC(): AudioContext {
    if (!ac) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ac = new AC();
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }

  function getMG(ctx: AudioContext): GainNode {
    if (!masterGain) {
      masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
    }
    return masterGain;
  }

  function playNote(freq: number, when: number, dur: number) {
    const ctx = getAC();
    const mg = getMG(ctx);
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    filt.type = "lowpass";
    filt.frequency.value = 1700;
    filt.Q.value = 0.3;
    const t0 = when;
    const tPeak = t0 + 0.012;
    const tDecay = t0 + Math.min(0.12, dur * 0.25);
    const tRelease = t0 + dur * 0.9;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.36, tPeak);
    gain.gain.exponentialRampToValueAtTime(0.2, tDecay);
    gain.gain.exponentialRampToValueAtTime(0.001, tRelease);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(mg);
    osc.start(t0);
    osc.stop(t0 + dur + 0.08);
  }

  function playClick(when: number, isDownbeat: boolean) {
    const ctx = getAC();
    const mg = getMG(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = isDownbeat ? 1200 : 900;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.35, when + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.07);
    osc.connect(gain);
    gain.connect(mg);
    osc.start(when);
    osc.stop(when + 0.09);
  }

  function beatShape(beats: number) {
    return {
      isOpen: beats >= 2 - 0.01,
      hasFlag: Math.abs(beats - 0.5) < 0.01,
      hasDot: Math.abs(beats - 1.5) < 0.01 || Math.abs(beats - 3.0) < 0.01,
    };
  }

  function mkEl(tag: string, attrs: Record<string, string>): SVGElement {
    const el = document.createElementNS(SVG_NS, tag) as SVGElement;
    for (const key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) el.setAttribute(key, attrs[key]);
    }
    return el;
  }

  function enterMelodyMode(melody: MelNote[]) {
    const svg = $("notation-svg");
    const scGrp = $("sn-scale-group");
    const mlGrp = $("sn-melody-group");
    if (!svg || !scGrp || !mlGrp) return;
    melodyLen = melody.length;
    while (mlGrp.firstChild) mlGrp.removeChild(mlGrp.firstChild);

    mlGrp.appendChild(mkEl("line", { class: "sn-barline", x1: "8", y1: "20", x2: "8", y2: "68" }));
    const clef = mkEl("text", { class: "sn-clef", x: "11", y: "70", "font-size": "62", "dominant-baseline": "auto" });
    clef.textContent = String.fromCodePoint(0x1d11e);
    mlGrp.appendChild(clef);
    const ts1 = mkEl("text", { class: "sn-timesig", x: "54", y: "50", "font-size": "19", "text-anchor": "middle" });
    ts1.textContent = "4";
    mlGrp.appendChild(ts1);
    const ts2 = mkEl("text", { class: "sn-timesig", x: "54", y: "69", "font-size": "19", "text-anchor": "middle" });
    ts2.textContent = "4";
    mlGrp.appendChild(ts2);

    const cxArr: number[] = [];
    let xCursor = MELODY_START_X;
    for (let j = 0; j < melodyLen; j++) {
      cxArr.push(xCursor);
      xCursor += Math.max(BEAT_MIN_ADV, melody[j][1] * BEAT_PX);
    }

    for (let i = 0; i < melodyLen; i++) {
      const key = melody[i][0];
      const beats = melody[i][1];
      const np = NOTE_POS[IDX[key]];
      const cx = cxArr[i];
      const cy = np.cy;
      const sx = cx + 8;
      const sy = cy - 32;
      const sh = beatShape(beats);

      const acc = mkEl("text", {
        id: "sn-m-acc-" + i, class: "sn-acc", x: String(cx - 12), y: String(cy + 4),
        "font-size": "13", "text-anchor": "end",
      });
      acc.textContent = "♯";
      if (!np.hasAcc) acc.setAttribute("display", "none");
      mlGrp.appendChild(acc);

      mlGrp.appendChild(mkEl("line", {
        id: "sn-m-stem-" + i, class: "sn-stem",
        x1: String(sx), y1: String(cy), x2: String(sx), y2: String(sy),
      }));
      mlGrp.appendChild(mkEl("ellipse", {
        id: "sn-m-head-" + i, class: sh.isOpen ? "sn-head open" : "sn-head",
        cx: String(cx), cy: String(cy), rx: "8", ry: "5.5",
      }));
      if (sh.hasFlag) {
        mlGrp.appendChild(mkEl("path", {
          id: "sn-m-flag-" + i, class: "sn-flag",
          d: "M " + sx + "," + sy + " C " + (sx + 14) + "," + (sy + 8) + " " + (sx + 12) + "," + (sy + 20) + " " + sx + "," + (sy + 22),
        }));
      }
      if (sh.hasDot) {
        mlGrp.appendChild(mkEl("circle", {
          id: "sn-m-dot-" + i, class: "sn-dot", cx: String(cx + 13), cy: String(cy - 3), r: "2",
        }));
      }
    }

    const lastCx = cxArr[melodyLen - 1];
    const barX = lastCx + 20;
    mlGrp.appendChild(mkEl("line", { class: "sn-barline", x1: String(barX), y1: "20", x2: String(barX), y2: "68" }));
    mlGrp.appendChild(mkEl("line", { class: "sn-barline-thick", x1: String(barX + 7), y1: "20", x2: String(barX + 7), y2: "68" }));

    scGrp.setAttribute("display", "none");
    mlGrp.removeAttribute("display");
    svg.setAttribute("viewBox", "0 0 " + (barX + 14) + " 95");
    svg.classList.add("melody-mode");
  }

  function exitMelodyMode() {
    const svg = $("notation-svg");
    const scGrp = $("sn-scale-group");
    const mlGrp = $("sn-melody-group");
    if (mlGrp) {
      mlGrp.setAttribute("display", "none");
      while (mlGrp.firstChild) mlGrp.removeChild(mlGrp.firstChild);
    }
    melodyLen = 0;
    if (scGrp) scGrp.removeAttribute("display");
    if (svg) {
      svg.setAttribute("viewBox", "0 0 590 95");
      svg.classList.remove("melody-mode");
    }
  }

  function renderScaleLayout() {
    exitMelodyMode();
    for (let i = 0; i < SCALE_SLOT_COUNT; i++) {
      $("sn-head-" + i)?.classList.remove("active", "next-active");
      $("sn-stem-" + i)?.classList.remove("active", "next-active");
      $("sn-acc-" + i)?.classList.remove("active", "next-active");
    }
  }

  function setScaleActive(scaleIdx: number, slotIdx: number) {
    document.querySelectorAll("#scale-player .scale-note").forEach((el, i) => el.classList.toggle("active", i === scaleIdx));
    for (let i = 0; i < SCALE_SLOT_COUNT; i++) {
      const np = NOTE_POS[SCALE_PAT[i]];
      const head = $("sn-head-" + i);
      const stem = $("sn-stem-" + i);
      const acc = $("sn-acc-" + i);
      if (!head || !stem) continue;
      const isActive = i === slotIdx;
      head.classList.remove("active", "next-active");
      stem.classList.remove("active", "next-active");
      if (acc) acc.classList.remove("active", "next-active");
      if (isActive) {
        head.classList.add("active");
        stem.classList.add("active");
        if (acc && np.hasAcc) acc.classList.add("active");
      }
    }
  }

  function clearActive() {
    document.querySelectorAll("#scale-player .scale-note").forEach((el) => el.classList.remove("active"));
    for (let i = 0; i < SCALE_SLOT_COUNT; i++) {
      $("sn-head-" + i)?.classList.remove("active", "next-active");
      $("sn-stem-" + i)?.classList.remove("active", "next-active");
      $("sn-acc-" + i)?.classList.remove("active", "next-active");
    }
    for (let j = 0; j < melodyLen; j++) {
      $("sn-m-head-" + j)?.classList.remove("active", "next-active");
      $("sn-m-stem-" + j)?.classList.remove("active", "next-active");
      $("sn-m-acc-" + j)?.classList.remove("active", "next-active");
      $("sn-m-flag-" + j)?.classList.remove("active", "next-active");
      $("sn-m-dot-" + j)?.classList.remove("active", "next-active");
    }
  }

  function schedHighlight(scaleIdx: number, slotIdx: number, when: number) {
    const capturedGen = gen;
    const ctx = getAC();
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    const t = setTimeout(() => {
      if (gen === capturedGen) setScaleActive(scaleIdx, slotIdx);
    }, delayMs);
    timers.push(t);
  }

  function schedDynHighlight(pos: number, when: number) {
    const capturedGen = gen;
    const capturedLen = melodyLen;
    const ctx = getAC();
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    const t = setTimeout(() => {
      if (gen !== capturedGen) return;
      for (let i = 0; i < capturedLen; i++) {
        const head = $("sn-m-head-" + i);
        const stem = $("sn-m-stem-" + i);
        const acc = $("sn-m-acc-" + i);
        const flag = $("sn-m-flag-" + i);
        const dot = $("sn-m-dot-" + i);
        if (!head) continue;
        head.classList.remove("active", "next-active");
        stem?.classList.remove("active", "next-active");
        acc?.classList.remove("active", "next-active");
        flag?.classList.remove("active", "next-active");
        dot?.classList.remove("active", "next-active");
        if (i === pos) {
          head.classList.add("active");
          stem?.classList.add("active");
          if (acc && acc.getAttribute("display") !== "none") acc.classList.add("active");
          flag?.classList.add("active");
          dot?.classList.add("active");
        }
      }
      const melody = MELODIES[melodyVar];
      const scaleIdx = IDX[melody[pos][0]];
      document.querySelectorAll("#scale-player .scale-note").forEach((el, i) => el.classList.toggle("active", i === scaleIdx));
    }, delayMs);
    timers.push(t);
  }

  function cancelTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function updateButtons() {
    const bScale = $("scale-play-btn") as HTMLButtonElement | null;
    const bMelody = $("scale-melody-btn") as HTMLButtonElement | null;
    const bStop = $("scale-stop-btn") as HTMLButtonElement | null;
    if (!bScale || !bMelody || !bStop) return;
    if (mode === "stopped") {
      bScale.disabled = false;
      bScale.textContent = "▶ Play Scale";
      bMelody.disabled = false;
      bMelody.textContent = "♪ Play Melody";
      bMelody.classList.remove("melody-active");
      bStop.disabled = true;
    } else if (mode === "scale") {
      bScale.disabled = true;
      bScale.textContent = "▶ Playing…";
      bMelody.disabled = true;
      bMelody.classList.remove("melody-active");
      bStop.disabled = false;
    } else {
      bScale.disabled = true;
      bMelody.disabled = false;
      bMelody.textContent = "♪ Next Melody";
      bMelody.classList.add("melody-active");
      bStop.disabled = false;
    }
  }

  function stopAll() {
    gen++;
    mode = "stopped";
    countInDone = false;
    if (schedId !== null) {
      clearInterval(schedId);
      schedId = null;
    }
    cancelTimers();
    clearActive();
    renderScaleLayout();
    if (ac && masterGain) {
      const mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.025);
      masterGain = null;
      setTimeout(() => {
        try { mg.disconnect(); } catch { /* noop */ }
      }, 80);
    }
    updateButtons();
  }

  function scaleTick() {
    if (mode !== "scale") return;
    const ctx = getAC();
    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      const slotIdx = scalePATPos;
      const scaleIdx = SCALE_PAT[scalePATPos];
      playNote(SCALE[scaleIdx].freq, nextTime, SCALE_DUR);
      schedHighlight(scaleIdx, slotIdx, nextTime);
      nextTime += SCALE_STEP;
      scalePATPos = (scalePATPos + 1) % SCALE_PAT.length;
    }
  }

  function playScale() {
    stopAll();
    gen++;
    mode = "scale";
    scalePATPos = 0;
    updateButtons();
    const ctx = getAC();
    nextTime = ctx.currentTime + 0.08;
    scaleTick();
    schedId = setInterval(scaleTick, SCHED_MS);
  }

  function schedulerTick() {
    if (mode !== "melody") return;
    const ctx = getAC();
    const melody = MELODIES[melodyVar];
    while (nextTime < ctx.currentTime + SCHED_AHEAD) {
      const pos = melodyPos;
      const entry = melody[pos];
      const dur = entry[1] * BEAT;
      playNote(HZ[entry[0]], nextTime, dur * 0.86);
      schedDynHighlight(pos, nextTime);
      nextTime += dur;
      melodyPos = (pos + 1) % melody.length;
    }
  }

  function startScheduler(withCountIn: boolean) {
    const ctx = getAC();
    melodyPos = 0;
    enterMelodyMode(MELODIES[melodyVar]);
    if (withCountIn && !countInDone) {
      countInDone = true;
      const t0 = ctx.currentTime + 0.1;
      for (let i = 0; i < 4; i++) playClick(t0 + i * BEAT, i === 0);
      nextTime = t0 + 4 * BEAT;
    } else {
      nextTime = ctx.currentTime + 0.08;
    }
    schedulerTick();
    schedId = setInterval(schedulerTick, SCHED_MS);
  }

  function switchVariation(newVar: number) {
    gen++;
    cancelTimers();
    clearActive();
    if (schedId !== null) {
      clearInterval(schedId);
      schedId = null;
    }
    if (ac && masterGain) {
      const mg = masterGain;
      mg.gain.cancelScheduledValues(ac.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ac.currentTime);
      mg.gain.linearRampToValueAtTime(0, ac.currentTime + 0.04);
      masterGain = null;
      setTimeout(() => {
        try { mg.disconnect(); } catch { /* noop */ }
      }, 80);
    }
    melodyVar = newVar;
    const capturedGen = gen;
    setTimeout(() => {
      if (gen !== capturedGen || mode !== "melody") return;
      startScheduler(false);
    }, 55);
  }

  function playMelody() {
    if (mode === "melody") {
      switchVariation((melodyVar + 1) % MELODIES.length);
      return;
    }
    stopAll();
    gen++;
    mode = "melody";
    melodyVar = 0;
    updateButtons();
    startScheduler(true);
  }

  const bScale = $("scale-play-btn");
  const bMelody = $("scale-melody-btn");
  const bStop = $("scale-stop-btn");
  if (!bScale || !bMelody || !bStop) return () => {};

  renderScaleLayout();
  bScale.addEventListener("click", playScale);
  bMelody.addEventListener("click", playMelody);
  bStop.addEventListener("click", stopAll);
  updateButtons();

  return () => {
    bScale.removeEventListener("click", playScale);
    bMelody.removeEventListener("click", playMelody);
    bStop.removeEventListener("click", stopAll);
    stopAll();
    if (ac) {
      ac.close().catch(() => {});
      ac = null;
    }
  };
}
