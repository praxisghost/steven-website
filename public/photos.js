/* ─────────────────────────────────────────────────────────────────────────────
 *  photos.js — Dog breeds slideshow for photos.html
 *
 *  Mirrors the frog slideshow (misc.js) in behaviour and structure:
 *  shuffled deck, auto-advance every 8s, prev/next buttons, fade-in once
 *  each image actually loads, pauses when the tab is hidden.
 *
 *  Image hosting:
 *    Photos are served from /img/dogs/<filename>.jpeg on this same domain.
 *
 *  To add a breed photo:
 *    1. Save the photo as  public/img/dogs/<filename>.jpeg
 *    2. Add a new entry to ALL_DOGS below (active: true).
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
   * 11 entries — all photos live in /img/dogs/<slug>.jpeg.
   * slug must match the filename exactly (including case).
   * ────────────────────────────────────────────────────────────────────── */
  const ALL_DOGS = [
    { slug: 'beagle',                       name: 'Beagle',                              active: true  },
    { slug: 'labrador-retriever',           name: 'Labrador Retriever',                  active: true  },
    { slug: 'German-Pinscher',              name: 'German Pinscher',                     active: true  },
    { slug: 'coonhound-pointer',            name: 'Coonhound / Pointer Mix',             active: true  },
    { slug: 'AmericanFoxhound-BorderCollie',name: 'American Foxhound / Border Collie Mix',active: true },
    { slug: 'GermanShepherd-BorderCollie',  name: 'German Shepherd / Border Collie Mix', active: true  },
    { slug: 'doberman-germanshepherd',      name: 'Doberman / German Shepherd Mix',      active: true  },
    { slug: 'Doberman-Dalmation',           name: 'Doberman / Dalmatian Mix',            active: true  },
    { slug: 'dalmation',                    name: 'Dalmatian',                           active: true  },
    { slug: 'greatdane-dalmation',          name: 'Great Dane / Dalmatian Mix',          active: true  },
    { slug: 'greatdane-germanshepherd',     name: 'Great Dane / German Shepherd Mix',    active: true  },
  ];

  /* Build the active deck — only slides that have photos */
  const activeDeck = ALL_DOGS
    .filter(d => d.active)
    .map(d => ({ ...d, img: `/img/dogs/${d.slug}.jpeg` }));

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
