/* leaf.js — Homepage leaf idle sway
 *
 * Idle behaviour (always running):
 *   The 🍃 sways gently in place like a leaf in a light breeze.
 *
 * Hover/tap behaviour:
 *   A slightly stronger sway plays on mouseenter or touchstart,
 *   then returns to idle.
 *
 * Performance: CSS keyframes only. No animation library.
 */
(function () {
  'use strict';

  const leaf = document.getElementById('site-leaf');
  if (!leaf) return;

  /* ── Start idle sway immediately ────────────────────────────────── */
  leaf.style.animation = 'leaf-idle-sway 3.8s ease-in-out infinite';

  /* ── Hover/tap: brief stronger sway ────────────────────────────── */
  let swaying = false;

  function runHoverSway() {
    if (swaying) return;
    swaying = true;
    leaf.style.animation = 'leaf-wind-sway 1.4s ease-in-out';
    leaf.addEventListener('animationend', function () {
      leaf.style.animation = 'leaf-idle-sway 3.8s ease-in-out infinite';
      swaying = false;
    }, { once: true });
  }

  leaf.addEventListener('mouseenter', runHoverSway);
  leaf.addEventListener('touchstart', runHoverSway, { passive: true });
})();
