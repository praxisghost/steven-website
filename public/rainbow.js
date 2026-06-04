/* Rainbow sweep on "Just following my rainbow" — 5 s cooldown.
   Works on desktop (mouseenter) and mobile (touchstart).
   External file (not inline) so it passes the site's Content-Security-Policy. */
(function () {
  const tagline = document.querySelector('.tagline-text');
  if (!tagline) return;
  let ready = true;

  function triggerRainbow() {
    if (!ready) return;
    ready = false;
    tagline.classList.add('rainbow-sweep');
    tagline.addEventListener('animationend', function () {
      tagline.classList.remove('rainbow-sweep');
      setTimeout(function () { ready = true; }, 5000);
    }, { once: true });
  }

  tagline.addEventListener('mouseenter', triggerRainbow);
  tagline.addEventListener('touchstart', triggerRainbow, { passive: true });
})();
