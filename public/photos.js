/* ─────────────────────────────────────────────────────────────────────────────
 *  photos.js — Dog breeds slideshow for photos.html
 *
 *  Mirrors the frog slideshow (misc.js) in behaviour and structure:
 *  shuffled deck, auto-advance every 8s, prev/next buttons, fade-in once
 *  each image actually loads, pauses when the tab is hidden.
 *
 *  Image hosting:
 *    Photos are served from /img/dogs/<slug>.jpg on this same domain.
 *
 *  To add a breed photo:
 *    1. Save the photo as  public/img/dogs/<slug>.jpg
 *    2. Change `active: false` to `active: true` for that entry below.
 *
 *  Slides without an active photo are skipped so the slideshow only
 *  cycles through slides that have real images.
 *  ────────────────────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const imgEl     = document.getElementById('dog-img');
  const nameEl    = document.getElementById('dog-name');
  const counterEl = document.getElementById('dogs-counter');
  const prevBtn   = document.getElementById('dogs-prev');
  const nextBtn   = document.getElementById('dogs-next');
  if (!imgEl || !nameEl || !counterEl || !prevBtn || !nextBtn) return;

  const placeholder = document.querySelector('.dogs-placeholder');

  /* ── Breed deck ───────────────────────────────────────────────────────────
   * 11 entries.  Set active: true once you've dropped the matching photo
   * into /img/dogs/<slug>.jpg.
   * ────────────────────────────────────────────────────────────────────── */
  const ALL_DOGS = [
    { slug: 'beagle',                     name: 'Beagle',                              active: false },
    { slug: 'german-shepherd',            name: 'German Shepherd',                     active: false },
    { slug: 'german-pinscher',            name: 'German Pinscher (large)',              active: false },
    { slug: 'pointer',                    name: 'Pointer',                             active: false },
    { slug: 'black-labrador',             name: 'Black Labrador Retriever',            active: false },
    { slug: 'american-foxhound',          name: 'American Foxhound',                   active: false },
    { slug: 'border-collie-gsd-mix',      name: 'Border Collie / German Shepherd Mix', active: false },
    { slug: 'foxhound-border-collie-mix', name: 'Foxhound / Border Collie Mix',        active: false },
    { slug: 'rottweiler',                 name: 'Rottweiler',                          active: false },
    { slug: 'rottweiler-gsd-mix',         name: 'Rottweiler / German Shepherd Mix',    active: false },
    { slug: 'dalmatian',                  name: 'Dalmatian',                           active: false },
  ];

  /* Build the active deck — only slides that have photos */
  const activeDeck = ALL_DOGS
    .filter(d => d.active)
    .map(d => ({ ...d, img: `/img/dogs/${d.slug}.jpg` }));

  /* If no photos are ready yet, show placeholder and disable controls */
  if (activeDeck.length === 0) {
    nameEl.textContent    = 'Photos coming soon';
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
    nameEl.textContent    = item.name;

    imgEl.classList.remove('dog-loaded');
    imgEl.classList.add('dog-loading');
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
      imgEl.classList.remove('dog-loading');
      imgEl.classList.add('dog-loaded');
      if (placeholder) placeholder.style.opacity = '0';
    };
    tmp.onerror = () => {
      if (inflight !== tmp) return;
      imgEl.classList.remove('dog-loaded');
      imgEl.classList.add('dog-loading');
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
