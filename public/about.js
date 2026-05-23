/* ─────────────────────────────────────────────────────────────────────────────
 *  about.js — Salamander slideshow for about.html
 *
 *  Mirrors the frog slideshow (misc.js) in behaviour and structure:
 *  shuffled deck, auto-advance every 8s, prev/next buttons, fade-in once
 *  each image actually loads, pauses when the tab is hidden.
 *
 *  Theme: "Native Salamander Species of North America"
 *  Images go in /img/salamanders/<filename>.jpeg.
 *
 *  To add an image:
 *    1. Save the photo as  public/img/salamanders/<filename>.jpeg
 *    2. Add a new entry to ALL_SALAMANDERS below (active: true).
 *
 *  Slides without an active image are skipped so the slideshow only
 *  cycles through slides that have real images.
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
   * 16 species — all photos live in /img/salamanders/<slug>.jpeg.
   * slug must match the filename exactly (including case).
   * ────────────────────────────────────────────────────────────────────── */
  const ALL_SALAMANDERS = [
    { slug: 'spotted-salamander',            name: 'Spotted Salamander',            latin: 'Ambystoma maculatum',          active: true  },
    { slug: 'marbled-salamander',            name: 'Marbled Salamander',            latin: 'Ambystoma opacum',             active: true  },
    { slug: 'tiger-salamander',              name: 'Tiger Salamander',              latin: 'Ambystoma tigrinum',           active: true  },
    { slug: 'blue-spotted-salamander',       name: 'Blue-spotted Salamander',       latin: 'Ambystoma laterale',           active: true  },
    { slug: 'mole-salamander',               name: 'Mole Salamander',               latin: 'Ambystoma talpoideum',         active: true  },
    { slug: 'eastern-red-back-salamander',   name: 'Eastern Red-backed Salamander', latin: 'Plethodon cinereus',           active: true  },
    { slug: 'northern-slimy-salamander',     name: 'Northern Slimy Salamander',     latin: 'Plethodon glutinosus',         active: true  },
    { slug: 'red-salamander',                name: 'Red Salamander',                latin: 'Pseudotriton ruber',           active: true  },
    { slug: 'four-toed-salamander',          name: 'Four-toed Salamander',          latin: 'Hemidactylium scutatum',       active: true  },
    { slug: 'Hellbender-Salamander',         name: 'Hellbender',                    latin: 'Cryptobranchus alleganiensis', active: true  },
    { slug: 'arboreal-salamander',           name: 'Arboreal Salamander',           latin: 'Aneides lugubris',             active: true  },
    { slug: 'green-salamander',              name: 'Green Salamander',              latin: 'Aneides aeneus',               active: true  },
    { slug: 'california-slender-salamander', name: 'California Slender Salamander', latin: 'Batrachoseps attenuatus',      active: true  },
    { slug: 'pacific-giant-salamander',      name: 'Pacific Giant Salamander',      latin: 'Dicamptodon tenebrosus',       active: true  },
    { slug: 'patch-nosed-salamander',        name: 'Patch-nosed Salamander',        latin: 'Urspelerpes brucei',           active: true  },
    { slug: 'southern-torrent-salamander',   name: 'Southern Torrent Salamander',   latin: 'Rhyacotriton variegatus',      active: true  },
  ];

  /* Build the active deck — only slides that have photos */
  const activeDeck = ALL_SALAMANDERS
    .filter(s => s.active)
    .map(s => ({ ...s, img: `/img/salamanders/${s.slug}.jpeg` }));

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
