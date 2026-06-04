/* Background audio for the Politics page — autoplay where allowed, otherwise
   start on first interaction; pause when the tab is hidden or navigated away.
   External file so it passes the site's Content-Security-Policy. */
(function () {
  var audio = document.getElementById('page-audio');
  if (!audio) return;

  // Try to play immediately (may be blocked until user interacts)
  audio.play().catch(function () {
    document.addEventListener('click', function startOnClick() {
      audio.play();
      document.removeEventListener('click', startOnClick);
    }, { once: true });
  });

  // Stop when tab is hidden or user navigates away
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      audio.pause();
    } else {
      audio.play().catch(function () {});
    }
  });

  window.addEventListener('pagehide', function () { audio.pause(); });
  window.addEventListener('beforeunload', function () { audio.pause(); });
})();
