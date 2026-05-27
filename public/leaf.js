/* leaf.js — Homepage leaf interaction animation
 *
 * Sequence (triggered by mouseover / touchstart on #site-leaf):
 *   1. Wind gusts fly left → right behind the leaf  (~0.6s)
 *   2. Leaf tilts in the wind                        (~0.6s, overlapping)
 *   3. Leaf sways naturally                          (~1.2s)
 *   4. Leaf falls to bottom of viewport              (~2.0s)
 *   5. Rests at bottom                               (10s)
 *   6. Fades out                                     (~0.8s)
 *   7. Resets to original position for next hover
 *
 * Performance: CSS transitions/keyframes only. No animation library.
 * The falling arc uses a cubic-bezier on translate so it curves naturally.
 */
(function () {
  'use strict';

  const leaf = document.getElementById('site-leaf');
  if (!leaf) return;

  // States: 'idle' | 'animating' | 'resting'
  let state = 'idle';

  /* ── Timing constants (ms) ─────────────────────────────────────── */
  const T_WIND_DURATION = 550;   // each gust travels across
  const T_TILT_DURATION = 620;   // leaf tilt in wind
  const T_SWAY_DURATION = 1100;  // natural sway phase
  const T_FALL_DURATION = 1900;  // fall to bottom
  const T_REST_DURATION = 10000; // sitting at bottom
  const T_FADE_DURATION = 800;   // fade out

  /* ── Wind gust characters (subtle, not cartoonish) ─────────────── */
  const WIND_CHARS = ['·', '–', '〜', '‐', '·', '—'];

  function spawnWindGusts() {
    const rect  = leaf.getBoundingClientRect();
    const leafX = rect.left;
    const leafY = rect.top + rect.height / 2;

    // Spawn 5 staggered gusts that travel right starting from the leaf's x
    for (let i = 0; i < 5; i++) {
      const gust = document.createElement('span');
      gust.className   = 'leaf-wind';
      gust.textContent = WIND_CHARS[i % WIND_CHARS.length];
      gust.style.left  = leafX + 'px';
      gust.style.top   = (leafY + (Math.random() * 10 - 5)) + 'px';

      const delay    = i * 80;           // stagger each gust by 80ms
      const duration = T_WIND_DURATION + Math.random() * 120;

      gust.style.animation = `wind-gust ${duration}ms ${delay}ms ease-out forwards`;
      document.body.appendChild(gust);

      // Clean up the DOM element once animation ends
      gust.addEventListener('animationend', () => gust.remove());
    }
  }

  function runAnimation() {
    if (state !== 'idle') return;
    state = 'animating';

    const viewH = window.innerHeight;
    const rect  = leaf.getBoundingClientRect();
    // How far does the leaf need to fall?
    const fallY = viewH - rect.bottom - 8; // 8px margin from bottom

    /* ── Phase 1: spawn wind + tilt the leaf ──────────────────── */
    spawnWindGusts();

    leaf.style.transition = 'none';
    leaf.style.animation  = `leaf-wind-tilt ${T_TILT_DURATION}ms ease-in-out forwards`;

    /* ── Phase 2: after tilt ends → sway ─────────────────────── */
    setTimeout(() => {
      leaf.style.animation = `leaf-sway ${T_SWAY_DURATION}ms ease-in-out forwards`;
    }, T_TILT_DURATION);

    /* ── Phase 3: after sway → fall ─────────────────────────── */
    setTimeout(() => {
      leaf.style.animation  = 'none';
      // Use a CSS transition for the fall — cubic-bezier simulates gravity
      // with a slight lateral drift (leaf doesn't fall perfectly straight)
      const lateralDrift  = (Math.random() * 30 - 15) + 'px';
      const rotationFinal = (Math.random() * 60 - 20) + 'deg';

      leaf.style.transition =
        `transform ${T_FALL_DURATION}ms cubic-bezier(0.25, 0.1, 0.3, 1),
         opacity   ${T_FALL_DURATION * 0.1}ms linear`;

      // Force a reflow so the transition fires on the next frame
      void leaf.offsetHeight;

      leaf.style.transform =
        `translateY(${fallY}px) translateX(${lateralDrift}) rotate(${rotationFinal})`;
    }, T_TILT_DURATION + T_SWAY_DURATION);

    /* ── Phase 4: rest at bottom ─────────────────────────────── */
    const restStart = T_TILT_DURATION + T_SWAY_DURATION + T_FALL_DURATION;
    state = 'resting';

    /* ── Phase 5: fade out ───────────────────────────────────── */
    setTimeout(() => {
      leaf.style.transition =
        `opacity ${T_FADE_DURATION}ms ease-in,
         transform ${T_FADE_DURATION}ms ease-in`;
      leaf.style.opacity   = '0';
    }, restStart + T_REST_DURATION);

    /* ── Phase 6: reset ──────────────────────────────────────── */
    setTimeout(() => {
      // Snap back without transition so the reset is invisible
      leaf.style.transition = 'none';
      leaf.style.animation  = 'none';
      leaf.style.transform  = 'none';
      leaf.style.opacity    = '1';

      // One final reflow, then re-enable hover
      void leaf.offsetHeight;
      state = 'idle';
    }, restStart + T_REST_DURATION + T_FADE_DURATION + 50);
  }

  /* ── Attach event listeners ──────────────────────────────────────── */
  leaf.addEventListener('mouseover', runAnimation);
  leaf.addEventListener('touchstart', runAnimation, { passive: true });
})();
