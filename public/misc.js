/* ─────────────────────────────────────────────────────────────────────────────
 *  misc.js — Frog slideshow for misc.html
 *
 *  Image hosting:
 *    Photos are served from /img/frogs/<slug>.jpg on this same domain.
 *    To add or change a frog, drop a photo into public/img/frogs/ with the
 *    matching slug, then edit the FROGS array below. See the README in
 *    that folder for sizing/format guidance.
 *
 *    The previous implementation hot-linked Wikimedia Commons URLs, which
 *    is fragile: Wikimedia rate-limits/blocks hotlinking from third-party
 *    sites, thumbnail URLs change when the CDN reorganises, and the
 *    extra origin forces a wider Content-Security-Policy.
 *
 *  Behaviour: shuffled deck, auto-advance every 8s, prev/next buttons,
 *  fade-in once each image actually loads, pause when the tab is hidden.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  // Bail quietly if the slideshow markup isn't on this page.
  const imgEl     = document.getElementById('frog-img');
  const nameEl    = document.getElementById('frog-name');
  const latinEl   = document.getElementById('frog-latin');
  const counterEl = document.getElementById('frog-counter');
  const prevBtn   = document.getElementById('frog-prev');
  const nextBtn   = document.getElementById('frog-next');
  if (!imgEl || !nameEl || !latinEl || !counterEl || !prevBtn || !nextBtn) return;

  const placeholder = document.querySelector('.frog-placeholder');

  /* Frog deck — North American species.
   *
   * To add a new frog:
   *   1. Save a photo as  public/img/frogs/<slug>.jpg
   *   2. Add an entry below with the same `slug`, plus name + latin.
   *
   * The URL is derived from `slug`, so there's only one place to keep in
   * sync. If an image fails to load, the slideshow keeps the placeholder
   * visible and the auto-advance simply moves on. */
  const FROGS = [
    { slug: 'american-bullfrog',        name: 'American Bullfrog',        latin: 'Lithobates catesbeianus' },
    { slug: 'pacific-tree-frog',        name: 'Pacific Tree Frog',        latin: 'Pseudacris regilla'      },
    { slug: 'wood-frog',                name: 'Wood Frog',                latin: 'Lithobates sylvaticus'   },
    { slug: 'green-tree-frog',          name: 'Green Tree Frog',          latin: 'Dryophytes cinereus'     },
    { slug: 'northern-leopard-frog',    name: 'Northern Leopard Frog',    latin: 'Lithobates pipiens'      },
    { slug: 'gray-tree-frog',           name: 'Gray Tree Frog',           latin: 'Dryophytes versicolor'   },
    { slug: 'spring-peeper',            name: 'Spring Peeper',            latin: 'Pseudacris crucifer'     },
    { slug: 'pickerel-frog',            name: 'Pickerel Frog',            latin: 'Lithobates palustris'    },
    { slug: 'red-legged-frog',          name: 'Red-legged Frog',          latin: 'Rana aurora'             },
    { slug: 'american-green-tree-frog', name: 'American Green Tree Frog', latin: 'Dryophytes cinereus'     },
  ];

  /* All photos live under /img/frogs/<slug>.jpg — same origin, CSP-friendly. */
  const frogs = FROGS.map(f => ({ ...f, img: `/img/frogs/${f.slug}.jpg` }));

  /* Shuffle once on page load for a randomised first order. */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const deck = shuffle(frogs);
  let current = 0;
  const AUTO_MS = 8000;
  let timer = null;
  let inflight = null;   // track the in-flight preloader so we can cancel.

  function show(index) {
    const frog = deck[index];
    counterEl.textContent = `${index + 1} / ${deck.length}`;

    // Update caption immediately for snappy UX.
    nameEl.textContent  = frog.name;
    latinEl.textContent = frog.latin;

    // Fade out current image; show placeholder while loading.
    imgEl.classList.remove('frog-loaded');
    imgEl.classList.add('frog-loading');
    if (placeholder) placeholder.style.opacity = '1';

    // Cancel a previous in-flight load so we never paint a stale image.
    if (inflight) {
      inflight.onload = null;
      inflight.onerror = null;
    }
    const tmp = new Image();
    inflight = tmp;
    tmp.onload = () => {
      if (inflight !== tmp) return; // superseded
      imgEl.src = frog.img;
      imgEl.alt = frog.name;
      imgEl.classList.remove('frog-loading');
      imgEl.classList.add('frog-loaded');
      if (placeholder) placeholder.style.opacity = '0';
    };
    tmp.onerror = () => {
      if (inflight !== tmp) return; // superseded
      imgEl.classList.remove('frog-loaded');
      imgEl.classList.add('frog-loading');
      if (placeholder) placeholder.style.opacity = '1';
    };
    tmp.src = frog.img;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      current = (current + 1) % deck.length;
      show(current);
    }, AUTO_MS);
  }
  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function step(delta) {
    current = (current + delta + deck.length) % deck.length;
    show(current);
    // Reset auto-advance so the user gets a fresh window after interacting.
    startTimer();
  }

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(+1));

  // Pause auto-advance when the tab isn't visible — saves work and avoids
  // queueing a backlog of timer ticks on background tabs.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else                 startTimer();
  });

  // Kick it off.
  show(current);
  startTimer();
})();
