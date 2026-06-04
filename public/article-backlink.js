/* Send an article's back-link to wherever the visitor actually came from
   (for articles reachable from multiple pages, e.g. Blog + Politics),
   falling back to its default href when there's no usable same-origin
   referrer. External file so it passes the site's Content-Security-Policy. */
(function () {
  var bl = document.getElementById('back-link');
  if (!bl) return;
  var labels = {
    'political-opinion.html': '← Politics',
    'blog.html': '← Blog',
    'writing.html': '← Writing'
  };
  try {
    if (!document.referrer) return;
    var ref = new URL(document.referrer);
    if (ref.origin !== location.origin) return;       // came from off-site
    if (ref.pathname === location.pathname) return;    // reload / self
    var file = ref.pathname.split('/').pop();
    if (!labels[file]) return;                         // only known source pages
    bl.setAttribute('href', document.referrer);
    bl.textContent = labels[file];
  } catch (e) { /* keep the default */ }
})();
