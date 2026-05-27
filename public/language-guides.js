/* ── Language guides filter engine ────────────────────────────────────────
 *  data-l1  on <section>: the learner's native language key
 *  data-l2  on <li>: the target language key
 *  data-search on <li>: space-separated search tokens (multilingual)
 *  All three active filters compose with AND logic.
 * ─────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const sections    = Array.from(document.querySelectorAll('.l1-group'));
  const searchInput = document.getElementById('guide-search');
  const clearBtn    = document.getElementById('filter-clear');
  const countEl     = document.getElementById('filter-results-count');
  const l1Row       = document.getElementById('l1-filter-row');
  const l2Row       = document.getElementById('l2-filter-row');

  let activeL1 = null;
  let activeL2 = null;
  let searchQ  = '';

  const L1_LABELS = {
    english:    'English',    mandarin:   '普通话',
    cantonese:  '廣東話',     german:     'Deutsch',
    turkish:    'Türkçe',     spanish:    'Español',
    persian:    'فارسی',      punjabi:    'ਪੰਜਾਬੀ',
    ukrainian:  'Українська', vietnamese: 'Tiếng Việt',
    french:     'Français',   japanese:   '日本語',
    russian:    'Русский',
  };

  const L2_LABELS = {
    ainu:       'Ainu',       cantonese:  'Cantonese',
    cherokee:   'Cherokee',   german:     'German',
    mandarin:   'Mandarin',   navajo:     'Navajo',
    persian:    'Persian',    punjabi:    'Punjabi',
    spanish:    'Spanish',    turkish:    'Turkish',
    ukrainian:  'Ukrainian',  vietnamese: 'Vietnamese',
  };

  const allItems = sections.flatMap(s => Array.from(s.querySelectorAll('li')));
  const availL1  = [...new Set(sections.map(s => s.dataset.l1))].filter(Boolean);
  const availL2  = [...new Set(allItems.map(li => li.dataset.l2))].filter(Boolean).sort();

  function makePill(value, label, row, onClick) {
    const btn = document.createElement('button');
    btn.className   = 'filter-pill';
    btn.textContent = label;
    btn.dataset.value = value;
    btn.type        = 'button';
    btn.addEventListener('click', () => onClick(value, btn));
    row.appendChild(btn);
    return btn;
  }

  const l1Pills = {};
  availL1.forEach(l1 => {
    l1Pills[l1] = makePill(l1, L1_LABELS[l1] || l1, l1Row, (val, btn) => {
      activeL1 = activeL1 === val ? null : val;
      Object.values(l1Pills).forEach(p => p.classList.remove('active'));
      if (activeL1) btn.classList.add('active');
      applyFilters();
    });
  });

  const l2Pills = {};
  availL2.forEach(l2 => {
    l2Pills[l2] = makePill(l2, L2_LABELS[l2] || l2, l2Row, (val, btn) => {
      activeL2 = activeL2 === val ? null : val;
      Object.values(l2Pills).forEach(p => p.classList.remove('active'));
      if (activeL2) btn.classList.add('active');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', () => {
    searchQ = searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  clearBtn.addEventListener('click', () => {
    activeL1 = null; activeL2 = null; searchQ = '';
    searchInput.value = '';
    [...Object.values(l1Pills), ...Object.values(l2Pills)]
      .forEach(p => p.classList.remove('active'));
    applyFilters();
  });

  function applyFilters() {
    const hasFilter = !!(activeL1 || activeL2 || searchQ);
    clearBtn.style.display = hasFilter ? 'inline' : 'none';

    let visibleGuides = 0;

    sections.forEach(section => {
      if (activeL1 && section.dataset.l1 !== activeL1) {
        section.hidden = true;
        return;
      }
      let visibleInSection = 0;
      section.querySelectorAll('li').forEach(li => {
        const matchL2     = !activeL2 || li.dataset.l2 === activeL2;
        const searchText  = ((li.dataset.search || '') + ' ' + (li.textContent || '')).toLowerCase();
        const matchSearch = !searchQ || searchText.includes(searchQ);
        li.hidden = !(matchL2 && matchSearch);
        if (!li.hidden) { visibleInSection++; visibleGuides++; }
      });
      section.hidden = visibleInSection === 0;
    });

    if (hasFilter) {
      countEl.textContent = visibleGuides === allItems.length
        ? 'Showing all ' + allItems.length + ' guides'
        : visibleGuides + ' of ' + allItems.length + ' guides';
    } else {
      countEl.textContent = '';
    }
  }

  applyFilters();
})();
