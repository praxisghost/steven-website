/* ─────────────────────────────────────────────────────────────────────────────
 *  animals.js — Polliwog slideshow for animals.html
 *
 *  Mirrors the frog slideshow (misc.js) in behaviour and structure:
 *  shuffled deck, auto-advance every 8s, prev/next buttons, fade-in once
 *  each image actually loads, pauses when the tab is hidden.
 *
 *  Per the page brief, no captions or species labels are shown — only the
 *  image, a position counter, and the controls.
 *
 *  Image hosting:
 *    Photos are served from /img/polliwogs/<file>.jpg on this same domain.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  // Bail quietly if the slideshow markup isn't on this page.
  const imgEl     = document.getElementById('polliwog-img');
  const counterEl = document.getElementById('polliwog-counter');
  const prevBtn   = document.getElementById('polliwog-prev');
  const nextBtn   = document.getElementById('polliwog-next');
  if (!imgEl || !counterEl || !prevBtn || !nextBtn) return;

  const placeholder = document.querySelector('.polliwog-placeholder');

  /* Exactly three polliwog images, served from /img/polliwogs/. */
  const POLLIWOGS = [
    { img: '/img/polliwogs/polliwog_1.jpg' },
    { img: '/img/polliwogs/polliwog_2.jpg' },
    { img: '/img/polliwogs/polliwog_3.jpg' },
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

  const deck = shuffle(POLLIWOGS);
  let current = 0;
  const AUTO_MS = 8000;
  let timer = null;
  let inflight = null;   // track the in-flight preloader so we can cancel.

  function show(index) {
    const item = deck[index];
    counterEl.textContent = `${index + 1} / ${deck.length}`;

    // Fade out current image; show placeholder while loading.
    imgEl.classList.remove('polliwog-loaded');
    imgEl.classList.add('polliwog-loading');
    if (placeholder) placeholder.style.opacity = '1';

    // Cancel a previous in-flight load so we never paint a stale image.
    if (inflight) {
      inflight.onload  = null;
      inflight.onerror = null;
    }
    const tmp = new Image();
    inflight = tmp;
    tmp.onload = () => {
      if (inflight !== tmp) return; // superseded
      imgEl.src = item.img;
      imgEl.alt = '';               // decorative — gallery has no labels
      imgEl.classList.remove('polliwog-loading');
      imgEl.classList.add('polliwog-loaded');
      if (placeholder) placeholder.style.opacity = '0';
    };
    tmp.onerror = () => {
      if (inflight !== tmp) return; // superseded
      imgEl.classList.remove('polliwog-loaded');
      imgEl.classList.add('polliwog-loading');
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
