/* leaf.js — Homepage leaf idle sway + periodic wind burst
 *
 * Idle behaviour (always running):
 *   The 🍃 sways gently in place like a leaf in a light breeze.
 *
 * Wind burst (every 8–14 s, automatic):
 *   Amplitude increases briefly, then 2–3 💨 emojis drift past.
 *
 * Performance: CSS keyframes only. No animation library.
 */
(function () {
  'use strict';

  const leaf = document.getElementById('site-leaf');
  if (!leaf) return;

  /* ── Start idle sway immediately ────────────────────────────────── */
  leaf.style.animation = 'leaf-idle-sway 3.8s ease-in-out infinite';

  /* ── Wind burst scheduler ───────────────────────────────────────── */
  function scheduleNextGust() {
    const delay = 8000 + Math.random() * 6000; // 8–14 s
    setTimeout(runGust, delay);
  }

  function runGust() {
    spawnWindEmojis();
    // Briefly switch to stronger-amplitude sway
    leaf.style.animation = 'leaf-wind-sway 1.4s ease-in-out';
    leaf.addEventListener('animationend', onWindEnd, { once: true });
  }

  function onWindEnd() {
    // Return to idle sway
    leaf.style.animation = 'leaf-idle-sway 3.8s ease-in-out infinite';
    scheduleNextGust();
  }

  /* ── 💨 emoji spawner ────────────────────────────────────────────── */
  function spawnWindEmojis() {
    const rect  = leaf.getBoundingClientRect();
    const baseY = rect.top + rect.height / 2;
    const count = 2 + Math.floor(Math.random() * 2); // 2–3

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className   = 'leaf-wind';
      el.textContent = '💨';
      el.style.left  = (rect.left - 18) + 'px';
      el.style.top   = (baseY + (Math.random() * 14 - 7)) + 'px';
      el.style.fontSize = (0.75 + Math.random() * 0.25) + 'rem';

      const dur   = 700 + Math.random() * 300;
      const delay = i * 130;
      el.style.animation = `wind-gust ${dur}ms ${delay}ms ease-out forwards`;

      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  }

  scheduleNextGust();
})();
