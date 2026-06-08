"use client";

import { useEffect } from "react";
import { setupGuitarScale } from "@/lib/guitarScale";

// Source: /website/public/guitar.html + /website/public/guitar-scale.js
// Roadmap + interactive E Major Pentatonic player (Web Audio) with synced staff
// notation. Restyled from the original dark page to the light "Editorial Minimal"
// design system (visual divergence per migration plan; all content preserved).

type Key = { name: string; scales: string[]; current?: boolean };

// Each key: scales worked through in order. Key of E is in progress.
const KEYS: Key[] = [
  { name: "Key of E", current: true, scales: ["E Major Pentatonic", "E Major Natural", "E Minor Pentatonic", "E Minor Natural"] },
  { name: "Key of G", scales: ["G Major Pentatonic", "G Major Natural", "G Minor Pentatonic", "G Minor Natural"] },
  { name: "Key of A", scales: ["A Major Pentatonic", "A Major Natural", "A Minor Pentatonic", "A Minor Natural"] },
  { name: "Key of C", scales: ["C Major Pentatonic", "C Major Natural", "C Minor Pentatonic", "C Minor Natural"] },
  { name: "Key of D", scales: ["D Major Pentatonic", "D Major Natural", "D Minor Pentatonic", "D Minor Natural"] },
  { name: "Key of B♭", scales: ["B♭ Major Pentatonic", "B♭ Major Natural", "B♭ Minor Pentatonic", "B♭ Minor Natural"] },
  { name: "Key of E♭", scales: ["E♭ Major Pentatonic", "E♭ Major Natural", "E♭ Minor Pentatonic", "E♭ Minor Natural"] },
  { name: "Key of F", scales: ["F Major Pentatonic", "F Major Natural", "F Minor Pentatonic", "F Minor Natural"] },
];

const SCALE_NOTES = [
  { name: "E", interval: "I" },
  { name: "F♯", interval: "II" },
  { name: "G♯", interval: "III" },
  { name: "B", interval: "V" },
  { name: "C♯", interval: "VI" },
];

// Static scale-group note slots (cx/cy/acc) — mirrors the source SVG exactly.
const SLOTS = [
  { cx: 76, cy: 68, acc: false, accX: 64, accY: 72, stemY2: 36 },
  { cx: 144, cy: 62, acc: true, accX: 132, accY: 66, stemY2: 30 },
  { cx: 212, cy: 56, acc: true, accX: 200, accY: 60, stemY2: 24 },
  { cx: 280, cy: 44, acc: false, accX: 268, accY: 48, stemY2: 12 },
  { cx: 348, cy: 38, acc: true, accX: 336, accY: 42, stemY2: 6 },
  { cx: 416, cy: 44, acc: false, accX: 404, accY: 48, stemY2: 12 },
  { cx: 484, cy: 56, acc: true, accX: 472, accY: 60, stemY2: 24 },
  { cx: 552, cy: 62, acc: true, accX: 540, accY: 66, stemY2: 30 },
];

export default function GuitarGuide() {
  useEffect(() => setupGuitarScale(), []);

  return (
    <div className="guitar-widget">
      <section aria-label="Guitar learning roadmap">
        <h2 className="text-2xl">Learning Roadmap</h2>
        <p className="mt-3 max-w-content text-ink-soft">
          Scales worked through in order. Each one gets mastered before I move on to the next.
        </p>

        {KEYS.map((k) => (
          <div key={k.name} className="mt-8 rounded-lg border border-hairline p-5">
            <div className="text-sm font-semibold uppercase tracking-wide text-accent">{k.name}</div>
            <ol className="mt-3 space-y-1.5">
              {k.scales.map((s, i) => {
                const isCurrent = k.current && i === 0;
                return (
                  <li key={s} className="flex items-center gap-2 text-ink-soft">
                    <span className="text-muted tabular-nums">{i + 1}.</span>
                    <span className={isCurrent ? "text-ink" : ""}>{s}</span>
                    {isCurrent ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white" aria-label="currently studying">
                        Current
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>

            {k.current ? (
              <>
                <div className="video-embed mt-5">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/3ciVJgumAUE"
                    title="Guitar scales reference video"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="scale-player mt-5" id="scale-player" role="region" aria-label="E Major Pentatonic scale player">
                  <div className="scale-row" role="list" aria-label="Scale notes">
                    {SCALE_NOTES.map((n) => (
                      <div className="scale-note" role="listitem" key={n.interval}>
                        <span className="note-name">{n.name}</span>
                        <span className="note-interval">{n.interval}</span>
                      </div>
                    ))}
                  </div>
                  <div className="scale-controls">
                    <button className="scale-btn" id="scale-play-btn" type="button" aria-label="Play E Major Pentatonic scale ascending">
                      ▶ Play Scale
                    </button>
                    <button className="scale-btn" id="scale-melody-btn" type="button" aria-label="Play looping melody using E Major Pentatonic notes">
                      ♪ Play Melody
                    </button>
                    <button className="scale-btn scale-btn-stop" id="scale-stop-btn" type="button" aria-label="Stop all playback" disabled>
                      ■ Stop
                    </button>
                  </div>
                </div>

                <div className="notation-wrap" id="notation-wrap" role="region" aria-label="Staff notation — synchronized to playback">
                  <div className="notation-label" aria-hidden="true">Staff notation — E Major Pentatonic</div>
                  <svg className="notation-svg" id="notation-svg" viewBox="0 0 590 95" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    {[20, 32, 44, 56, 68].map((y) => (
                      <line className="sn-staff-line" key={y} x1="8" y1={y} x2="900" y2={y} />
                    ))}
                    <g id="sn-scale-group">
                      <line className="sn-barline" x1="8" y1="20" x2="8" y2="68" />
                      <text className="sn-clef" x="11" y="70" fontSize="62" dominantBaseline="auto">{"\u{1D11E}"}</text>
                      <text className="sn-timesig" x="54" y="50" fontSize="19" textAnchor="middle">4</text>
                      <text className="sn-timesig" x="54" y="69" fontSize="19" textAnchor="middle">4</text>
                      {SLOTS.map((s, i) => (
                        <g key={i}>
                          <text className="sn-acc" id={`sn-acc-${i}`} x={s.accX} y={s.accY} fontSize="13" textAnchor="end" display={s.acc ? undefined : "none"}>♯</text>
                          <line className="sn-stem" id={`sn-stem-${i}`} x1={s.cx + 8} y1={s.cy} x2={s.cx + 8} y2={s.stemY2} />
                          <ellipse className="sn-head" id={`sn-head-${i}`} cx={s.cx} cy={s.cy} rx="8" ry="5.5" />
                        </g>
                      ))}
                      <line className="sn-barline" x1="572" y1="20" x2="572" y2="68" />
                      <line className="sn-barline-thick" x1="579" y1="20" x2="579" y2="68" />
                    </g>
                    <g id="sn-melody-group" display="none" />
                  </svg>
                </div>
              </>
            ) : null}
          </div>
        ))}
      </section>

      <hr className="my-10 border-hairline" />

      <h2 className="text-2xl">Study Philosophy</h2>
      <p className="mt-3 max-w-content text-ink-soft">
        This page is where I document &amp; track my guitar-learning progress over time. The idea is to
        stop jumping between topics &amp; instead settle into slow, deliberate mastery — one scale at a
        time before moving on to the next. Progress notes will appear here periodically.
      </p>
      <p className="mt-3 text-sm text-muted">Starting point: May 17.</p>

      <style>{playerCss}</style>
    </div>
  );
}

// Scoped player + notation styles, restyled to the light design tokens
// (accent #0F766E for the active/playing state, replacing the source's dark green).
const playerCss = `
.guitar-widget .video-embed { position: relative; aspect-ratio: 16/9; border-radius: 6px; overflow: hidden; border: 1px solid #E6E6E1; }
.guitar-widget .video-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.guitar-widget .scale-player { padding: 1.1rem 1rem 1rem; border: 1px solid #E6E6E1; border-radius: 6px; }
.guitar-widget .scale-row { display: flex; justify-content: center; gap: 0.25rem; margin-bottom: 0.9rem; }
.guitar-widget .scale-note { display: flex; flex-direction: column; align-items: center; min-width: 2.6rem; padding: 0.4rem 0.5rem; border: 1px solid transparent; border-radius: 4px; transition: background .08s, border-color .08s; }
.guitar-widget .note-name { font-family: var(--font-display), Georgia, serif; font-size: 1.25rem; font-weight: 500; color: #6B6B72; line-height: 1.15; }
.guitar-widget .note-interval { font-size: .7rem; color: #A8A8A2; letter-spacing: .04em; margin-top: .25rem; }
.guitar-widget .scale-note.active { background: #E7F2F0; border-color: #99C7C1; }
.guitar-widget .scale-note.active .note-name { color: #0F766E; }
.guitar-widget .scale-note.active .note-interval { color: #0F766E; }
.guitar-widget .scale-controls { display: flex; gap: .5rem; justify-content: center; }
.guitar-widget .scale-btn { flex: 1; max-width: 7.5rem; padding: .45rem .6rem; background: none; border: 1px solid #D8D8D2; border-radius: 4px; color: #3A3A40; font-family: var(--font-body), system-ui, sans-serif; font-size: .82rem; cursor: pointer; transition: border-color .18s, color .18s; letter-spacing: .03em; white-space: nowrap; }
.guitar-widget .scale-btn:hover:not(:disabled) { border-color: #0F766E; color: #0F766E; }
.guitar-widget .scale-btn:disabled { opacity: .4; cursor: default; }
.guitar-widget .scale-btn-stop:hover:not(:disabled) { border-color: #B4453C; color: #B4453C; }
.guitar-widget .scale-btn.melody-active { border-color: #0F766E; color: #0F766E; }
.guitar-widget .notation-wrap { margin-top: .5rem; padding: .9rem 1rem .75rem; border: 1px solid #E6E6E1; border-top: none; border-radius: 0 0 6px 6px; }
.guitar-widget .notation-label { font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: #A8A8A2; margin-bottom: .65rem; user-select: none; }
.guitar-widget .notation-svg { display: block; width: 100%; }
.guitar-widget .sn-staff-line { stroke: #D8D8D2; stroke-width: 1; }
.guitar-widget .sn-barline { stroke: #C8C8C2; stroke-width: 1.5; }
.guitar-widget .sn-barline-thick { stroke: #C8C8C2; stroke-width: 4.5; }
.guitar-widget .sn-clef { fill: #6B6B72; font-family: 'Times New Roman', Times, serif; }
.guitar-widget .sn-timesig { fill: #6B6B72; font-family: 'Times New Roman', Times, serif; font-weight: 700; }
.guitar-widget .sn-head { fill: #9A9A93; transition: fill .07s; }
.guitar-widget .sn-stem { stroke: #9A9A93; stroke-width: 1.5; transition: stroke .07s; }
.guitar-widget .sn-acc { fill: #9A9A93; font-family: 'Times New Roman', Times, serif; transition: fill .07s; }
.guitar-widget .sn-ledger { stroke: #9A9A93; stroke-width: 1; }
.guitar-widget .sn-head.active { fill: #0F766E; }
.guitar-widget .sn-stem.active { stroke: #0F766E; }
.guitar-widget .sn-acc.active { fill: #0F766E; }
.guitar-widget .sn-head.open { fill: #FAFAF8; stroke: #9A9A93; stroke-width: 1.8; }
.guitar-widget .sn-head.open.active { fill: #FAFAF8; stroke: #0F766E; }
.guitar-widget .sn-dot { fill: #9A9A93; transition: fill .07s; }
.guitar-widget .sn-dot.active { fill: #0F766E; }
.guitar-widget .sn-flag { fill: none; stroke: #9A9A93; stroke-width: 1.5; stroke-linecap: round; transition: stroke .07s; }
.guitar-widget .sn-flag.active { stroke: #0F766E; }
`;
