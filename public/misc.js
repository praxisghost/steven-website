/* ─────────────────────────────────────────────────────────────────────────────
 *  misc.js — Frog slideshow for misc.html
 *
 *  Extracted from an inline <script> block so the site can use a strict
 *  Content-Security-Policy of `script-src 'self'` (no `unsafe-inline`).
 *
 *  Behaviour matches the original: shuffled deck, auto-advance every 8s,
 *  prev/next buttons, fade-in once each remote image actually loads.
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

  /* Frog data — North American species.
     Images sourced from Wikimedia Commons (public domain / CC). */
  const frogs = [
    { name: 'American Bullfrog',       latin: 'Lithobates catesbeianus',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Rana_catesbeiana_USGS.jpg/640px-Rana_catesbeiana_USGS.jpg' },
    { name: 'Pacific Tree Frog',       latin: 'Pseudacris regilla',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Pacific_Treefrog_Hyla_regilla.jpg/640px-Pacific_Treefrog_Hyla_regilla.jpg' },
    { name: 'Wood Frog',               latin: 'Lithobates sylvaticus',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Wood_frog.jpg/640px-Wood_frog.jpg' },
    { name: 'Green Tree Frog',         latin: 'Dryophytes cinereus',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Hyla_cinerea.jpg/640px-Hyla_cinerea.jpg' },
    { name: 'Northern Leopard Frog',   latin: 'Lithobates pipiens',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Leopard_frog_122006.jpg/640px-Leopard_frog_122006.jpg' },
    { name: 'Gray Tree Frog',          latin: 'Dryophytes versicolor',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Hyla_versicolor02.jpg/640px-Hyla_versicolor02.jpg' },
    { name: 'Spring Peeper',           latin: 'Pseudacris crucifer',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pseudacris_crucifer_crop.jpg/640px-Pseudacris_crucifer_crop.jpg' },
    { name: 'Pickerel Frog',           latin: 'Lithobates palustris',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pickerel_Frog_%28Lithobates_palustris%29.jpg/640px-Pickerel_Frog_%28Lithobates_palustris%29.jpg' },
    { name: 'Red-legged Frog',         latin: 'Rana aurora',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Rana_aurora.jpg/640px-Rana_aurora.jpg' },
    { name: 'American Green Tree Frog',latin: 'Dryophytes cinereus',
      img:  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hyla_cinerea_on_glass.jpg/640px-Hyla_cinerea_on_glass.jpg' },
  ];

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
