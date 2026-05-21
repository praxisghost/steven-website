/* ─────────────────────────────────────────────────────────────────────────────
 *  about.js — Salamander slideshow for about.html
 *
 *  Mirrors the frog slideshow (misc.js) in behaviour and structure:
 *  shuffled deck, auto-advance every 8s, prev/next buttons, fade-in once
 *  each image actually loads, pauses when the tab is hidden.
 *
 *  Theme: "Native Salamander Species of North America"
 *  Template supports 10 slides; images go in /img/salamanders/<slug>.jpg.
 *
 *  To add an image:
 *    1. Save the photo as  public/img/salamanders/<slug>.jpg
 *    2. Change `active: false` to `active: true` for that entry below.
 *
 *  Until photos are uploaded, slides without an active image are skipped
 *  so the slideshow only cycles through slides that have real images.
 *  If no active slides exist, the section shows only the placeholder emoji.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const imgEl     = document.getElementById('sal-img');
  const nameEl    = document.getElementById('sal-name');
  const latinEl   = document.getElementById('sal-latin');
  const counterEl = document.getElementById('sal-counter');
  const prevBtn   = document.getElementById('sal-prev');
  const nextBtn   = document.getElementById('sal-next');
  if (!imgEl || !nameEl || !latinEl || !counterEl || !prevBtn || !nextBtn) return;

  const placeholder = document.querySelector('.salamander-placeholder');

  /* ── Salamander deck ──────────────────────────────────────────────────────
   * 10 species slots.  Set active: true once you have dropped the matching
   * photo into /img/salamanders/<slug>.jpg.
   * ────────────────────────────────────────────────────────────────────── */
  const ALL_SALAMANDERS = [
    {
      slug:   'spotted-salamander',
      name:   'Spotted Salamander',
      latin:  'Ambystoma maculatum',
      active: false,
    },
    {
      slug:   'red-backed-salamander',
      name:   'Red-backed Salamander',
      latin:  'Plethodon cinereus',
      active: false,
    },
    {
      slug:   'marbled-salamander',
      name:   'Marbled Salamander',
      latin:  'Ambystoma opacum',
      active: false,
    },
    {
      slug:   'tiger-salamander',
      name:   'Tiger Salamander',
      latin:  'Ambystoma tigrinum',
      active: false,
    },
    {
      slug:   'eastern-red-backed-salamander',
      name:   'Eastern Red-backed Salamander',
      latin:  'Plethodon cinereus',
      active: false,
    },
    {
      slug:   'mudpuppy',
      name:   'Mudpuppy',
      latin:  'Necturus maculosus',
      active: false,
    },
    {
      slug:   'hellbender',
      name:   'Hellbender',
      latin:  'Cryptobranchus alleganiensis',
      active: false,
    },
    {
      slug:   'long-toed-salamander',
      name:   'Long-toed Salamander',
      latin:  'Ambystoma macrodactylum',
      active: false,
    },
    {
      slug:   'jefferson-salamander',
      name:   "Jefferson Salamander",
      latin:  'Ambystoma jeffersonianum',
      active: false,
    },
    {
      slug:   'eastern-newt',
      name:   'Eastern Newt',
      latin:  'Notophthalmus viridescens',
      active: false,
    },
  ];

  /* Build the active deck — only slides that have photos */
  const activeDeck = ALL_SALAMANDERS
    .filter(s => s.active)
    .map(s => ({ ...s, img: `/img/salamanders/${s.slug}.jpg` }));

  /* If no photos are ready yet, show placeholder and disable controls */
  if (activeDeck.length === 0) {
    nameEl.textContent   = 'Photos coming soon';
    latinEl.textContent  = '';
    counterEl.textContent = '';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  /* Shuffle once on page load for a randomised first order */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const deck    = shuffle(activeDeck);
  let current   = 0;
  const AUTO_MS = 8000;
  let timer     = null;
  let inflight  = null;

  function show(index) {
    const item = deck[index];
    counterEl.textContent = `${index + 1} / ${deck.length}`;

    nameEl.textContent  = item.name;
    latinEl.textContent = item.latin;

    imgEl.classList.remove('sal-loaded');
    imgEl.classList.add('sal-loading');
    if (placeholder) placeholder.style.opacity = '1';

    if (inflight) {
      inflight.onload  = null;
      inflight.onerror = null;
    }
    const tmp = new Image();
    inflight = tmp;
    tmp.onload = () => {
      if (inflight !== tmp) return;
      imgEl.src = item.img;
      imgEl.alt = item.name;
      imgEl.classList.remove('sal-loading');
      imgEl.classList.add('sal-loaded');
      if (placeholder) placeholder.style.opacity = '0';
    };
    tmp.onerror = () => {
      if (inflight !== tmp) return;
      imgEl.classList.remove('sal-loaded');
      imgEl.classList.add('sal-loading');
      if (placeholder) placeholder.style.opacity = '1';
    };
    tmp.src = item.img;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      current = (current + 1) % deck.length;
      show(current);
    }, AUTO_MS);
  }
  function stopTimer() {
    if (timer !== null) { clearInterval(timer); timer = null; }
  }

  function step(delta) {
    current = (current + delta + deck.length) % deck.length;
    show(current);
    startTimer();
  }

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(+1));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else                 startTimer();
  });

  show(current);
  startTimer();
})();
