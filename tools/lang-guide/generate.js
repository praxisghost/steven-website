#!/usr/bin/env node
/* ───────────────────────────────────────────────────────────────────────────
   LANGUAGE-GUIDE GENERATOR  —  steven-legg.com
   ───────────────────────────────────────────────────────────────────────────
   Produces a complete language guide that matches the deployed site standard
   (see public/swahili-from-english.html as the reference implementation):

     1. public/[l2]-from-[l1code].html   — the guide page (SRS widget + sections)
     2. public/[l2]-srs-[l1code].js       — the SM-2 flashcard deck (single source
                                            of truth: deck == on-page frequency table)
     3. patches public/language-guides.html — inserts the hub <li> into the right
                                            L1 group (creates the group if missing)

   USAGE
     node tools/lang-guide/generate.js tools/lang-guide/specs/hawaiian-en.json
     node tools/lang-guide/generate.js specs/*.json          (multiple specs)

   The hub patch is idempotent — running twice will not duplicate the link.

   See README.md in this folder for the full spec schema.
   ─────────────────────────────────────────────────────────────────────────── */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const HUB = path.join(PUBLIC, 'language-guides.html');

/* ── helpers ─────────────────────────────────────────────────────────────── */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fail(msg) { console.error('✗ ' + msg); process.exit(1); }
function need(spec, key) { if (spec[key] === undefined) fail(`spec missing required field: "${key}"`); return spec[key]; }

/* ── the SM-2 SRS engine (emitted verbatim into every deck file) ─────────────
   Identical to swahili-srs-en.js etc. Only PAIR + WORDS differ per language. */
function srsFile(spec) {
  const pair = `${spec.l2code}-${spec.l1code}`;
  const words = spec.words.map(w => `    [${JSON.stringify(w[0])}, ${JSON.stringify(w[1])}]`).join(',\n');
  const header = spec.srsHeader ||
    `${spec.l2Display} for ${spec.l1Name} speakers`;
  return `/* ${spec.l2slug}-srs-${spec.l1code}.js — ${header}.
   Single source of truth: this WORDS array is BOTH the SRS deck AND the
   data rendered into the page's frequency table (.vocab-freq-table).
   SM-2 spaced repetition; progress in localStorage. ${spec.words.length} high-frequency words.
*/
(function () {
  'use strict';
  const PAIR = '${pair}';
  const WORDS = [
${words}
  ];

  /* ---- escape + render the frequency table from WORDS (single source) ---- */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  (function renderFreqTable(){
    const tbody = document.querySelector('.vocab-freq-table tbody');
    if (!tbody) return;
    tbody.innerHTML = WORDS.map(function(w,i){
      return '<tr><td>'+(i+1)+'</td><td>'+esc(w[0])+'</td><td>'+esc(w[1])+'</td></tr>';
    }).join('');
  })();

  /* ---- SM-2 spaced repetition engine ---- */
  function loadState(){try{return JSON.parse(localStorage.getItem('srs_'+PAIR)||'{}');}catch(e){return {};}}
  function saveState(s){try{localStorage.setItem('srs_'+PAIR,JSON.stringify(s));}catch(e){}}
  function today(){return Math.floor(Date.now()/86400000);}
  function getDue(state){const t=today();return WORDS.filter(function(_,i){const c=state[i];return !c||c.nextDay<=t;});}
  function updateCard(state,idx,quality){
    const c=state[idx]||{ef:2.5,interval:1,reps:0};
    if(quality<3){c.reps=0;c.interval=1;}
    else{
      if(c.reps===0)c.interval=1;
      else if(c.reps===1)c.interval=6;
      else c.interval=Math.round(c.interval*c.ef);
      c.reps+=1;
      c.ef=Math.max(1.3,c.ef+0.1-(5-quality)*(0.08+(5-quality)*0.02));
    }
    c.nextDay=today()+c.interval;state[idx]=c;return state;
  }
  const elInfo=document.getElementById('srs-info'),elCard=document.getElementById('srs-card'),
        elFront=document.getElementById('srs-front'),elBack=document.getElementById('srs-back'),
        elControls=document.getElementById('srs-controls'),elFlip=document.getElementById('srs-flip'),
        elAgain=document.getElementById('srs-again'),elGood=document.getElementById('srs-good'),
        elDone=document.getElementById('srs-done'),elRestart=document.getElementById('srs-restart'),
        elBar=document.getElementById('srs-bar');
  if(!elInfo)return;
  let state=loadState(),queue=[],current=null;
  function buildQueue(){queue=getDue(state).map(function(w){return WORDS.indexOf(w);}).sort(function(){return Math.random()-0.5;});}
  function updateBar(){if(elBar)elBar.style.width=(WORDS.length?((WORDS.length-getDue(state).length)/WORDS.length)*100:100)+'%';}
  function showCard(){
    if(!queue.length){elCard.style.display=elFlip.style.display=elControls.style.display='none';elDone.style.display='block';elInfo.textContent='Session complete!';updateBar();return;}
    current=queue.shift();
    const pair=WORDS[current];
    elFront.textContent=pair[0];elBack.textContent=pair[1];
    elBack.style.display='none';elFront.style.display='block';
    elControls.style.display='none';elFlip.style.display='inline-block';
    elCard.style.display='block';elDone.style.display='none';
    elInfo.textContent=(queue.length+1)+' / '+getDue(loadState()).length+' cards due';
    updateBar();
  }
  function flip(){elBack.style.display=elFront.style.display='block';elFlip.style.display='none';elControls.style.display='flex';}
  elFlip.addEventListener('click',flip);
  elAgain.addEventListener('click',function(){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();});
  elGood.addEventListener('click',function(){state=updateCard(state,current,5);saveState(state);current=null;showCard();});
  if(elRestart)elRestart.addEventListener('click',function(){buildQueue();elDone.style.display='none';showCard();});
  document.addEventListener('keydown',function(e){
    if((e.key===' '||e.key==='Enter')&&elFlip.style.display!=='none'){e.preventDefault();flip();}
    if(e.key==='1'&&elControls.style.display!=='none'){state=updateCard(state,current,1);saveState(state);queue.push(current);current=null;showCard();}
    if(e.key==='3'&&elControls.style.display!=='none'){state=updateCard(state,current,5);saveState(state);current=null;showCard();}
  });
  buildQueue();showCard();
})();
`;
}

/* ── section renderers (mirror swahili-from-english.html markup) ─────────── */
function introSection(spec, n) {
  const i = spec.intro || {};
  const paras = (i.paragraphs || []).map(p => `  <p>${p}</p>`).join('\n');
  const why = (i.why || []).map(w => `    <li><strong>${w[0]}</strong> — ${w[1]}</li>`).join('\n');
  return `<div class="lang-section" id="intro">
  <h2>${n}. ${i.heading || 'What is ' + spec.l2Display + '?'}</h2>
${paras}
${why ? `  <h3>${i.whyHeading || 'Why learn ' + spec.l2Display + '?'}</h3>\n  <ul>\n${why}\n  </ul>` : ''}
</div>`;
}
function vocabSection(spec, n) {
  return `<div class="lang-section" id="vocab">
  <h2>${n}. ${spec.vocabHeading || 'Core Vocabulary'} (1–${spec.words.length})</h2>
  <p>${spec.vocabIntro || 'High-frequency words and phrases. This is the exact deck used by the flashcard trainer above. Use the search box to filter.'}</p>
  <div class="vocab-search-wrap">
    <input class="vocab-search" type="search" placeholder="Search vocabulary…" aria-label="Search vocabulary…">
  </div>
  <div class="table-scroll">
    <table class="lang-table vocab-freq-table">
      <thead><tr><th>#</th><th>${spec.l2Display}</th><th>${spec.l1ColLabel || spec.l1Name}</th></tr></thead>
      <tbody>
        <!-- Rows rendered from ${spec.l2slug}-srs-${spec.l1code}.js (single source of truth) -->
      </tbody>
    </table>
  </div>
</div>`;
}
function rawSection(id, n, heading, html) {
  if (!html) return '';
  return `<div class="lang-section" id="${id}">
  <h2>${n}. ${heading}</h2>
${html}
</div>`;
}
function listSection(id, n, heading, items) {
  if (!items || !items.length) return '';
  const lis = items.map(x => `    <li>${x}</li>`).join('\n');
  return `<div class="lang-section" id="${id}">
  <h2>${n}. ${heading}</h2>
  <ul>
${lis}
  </ul>
</div>`;
}
function relatedSection(spec, n) {
  const items = (spec.related || []).map(r => `    <li><a href="${r[0]}">${r[1]}</a></li>`).join('\n');
  return `<div class="lang-section" id="related">
  <h2>${n}. ${spec.relatedHeading || 'Related Guides'}</h2>
  <ul>
${items}
    <li><a href="language-guides.html">${spec.allGuidesLabel || 'All language guides'}</a></li>
  </ul>
</div>`;
}

/* ── full page template ──────────────────────────────────────────────────── */
function guideHtml(spec) {
  const dirAttr = spec.dir ? ` dir="${spec.dir}"` : '';
  // ordered sections; numbering auto-increments and the TOC mirrors it
  const blocks = [];
  const toc = [];
  let n = 1;

  // 1. SRS (always)
  toc.push(['#srs', spec.srsTocLabel || 'Flashcards']);
  blocks.push(`<div class="lang-section" id="srs">
  <h2>1. ${spec.srsHeading || 'Flashcards'}</h2>
  <div class="srs-container" id="srs-root">
    <div class="srs-meta">
      <span class="srs-info" id="srs-info">Loading cards…</span>
      <span class="srs-progress-wrap">
        <span class="srs-bar-wrap"><span class="srs-bar" id="srs-bar"></span></span>
      </span>
    </div>
    <div class="srs-card" id="srs-card">
      <div class="srs-front" id="srs-front">—</div>
      <div class="srs-back" id="srs-back" style="display:none">—</div>
    </div>
    <div class="srs-controls" id="srs-controls" style="display:none">
      <button class="srs-btn srs-btn-again" id="srs-again">Again</button>
      <button class="srs-btn srs-btn-good"  id="srs-good">Got it</button>
    </div>
    <button class="srs-btn srs-btn-flip" id="srs-flip">Show answer</button>
    <div class="srs-done" id="srs-done" style="display:none">
      <p>Session complete! Come back tomorrow.</p>
      <button class="srs-btn" id="srs-restart">Restart</button>
    </div>
  </div>
  <div class="srs-shortcuts">
    <span><kbd>Space/Enter</kbd> flip</span>
    <span><kbd>1</kbd> again</span>
    <span><kbd>3</kbd> got it</span>
  </div>
</div>
<script src="${spec.l2slug}-srs-${spec.l1code}.js" defer></script>`);
  n = 2;

  const push = (block, id, label) => { if (block) { blocks.push(block); toc.push(['#' + id, label]); n++; } };

  // 2. intro
  push(introSection(spec, n), 'intro', (spec.intro && spec.intro.heading) || ('What is ' + spec.l2Display + '?'));
  // 3. vocab
  push(vocabSection(spec, n), 'vocab', spec.vocabHeading || 'Core Vocabulary');
  // 4. grammar (raw html)
  push(rawSection('grammar', n, spec.grammarHeading || 'Essential Grammar', spec.grammarHtml), 'grammar', spec.grammarHeading || 'Grammar');
  // 5. pronunciation (raw html)
  push(rawSection('pronunciation', n, spec.pronunciationHeading || 'Pronunciation', spec.pronunciationHtml), 'pronunciation', spec.pronunciationHeading || 'Pronunciation');
  // 6. writing system (optional raw)
  push(rawSection('writing', n, spec.writingHeading || 'Writing System', spec.writingHtml), 'writing', spec.writingHeading || 'Writing System');
  // 7. mistakes (list)
  push(listSection('mistakes', n, spec.mistakesHeading || 'Common Mistakes', spec.mistakes), 'mistakes', spec.mistakesHeading || 'Common Mistakes');
  // 8. resources (list)
  push(listSection('resources', n, spec.resourcesHeading || 'Learning Resources', spec.resources), 'resources', spec.resourcesHeading || 'Resources');
  // 9. culture (raw)
  push(rawSection('culture', n, spec.cultureHeading || 'Culture & Context', spec.cultureHtml), 'culture', spec.cultureHeading || 'Culture');
  // 10. related (always last)
  blocks.push(relatedSection(spec, n));
  toc.push(['#related', spec.relatedTocLabel || 'Related Guides']);

  const tocHtml = toc.map(t => `  <li><a href="${t[0]}">${t[1]}</a></li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${spec.htmlLang || spec.l1code}"${dirAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(spec.title)}</title>
  <meta name="description" content="${esc(spec.description)}">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<a class="back-link" href="language-guides.html">${spec.backLink || '← Language Guides'}</a>

<header>
  <h1>${spec.h1 || spec.l2Display} <span class="lang-from">${spec.l1Label}</span></h1>
</header>

<article>

<ol class="lang-toc">
${tocHtml}
</ol>

${blocks.join('\n\n')}

</article>

<footer>
  <a href="https://linktr.ee/stevenlegg" target="_blank" rel="noopener noreferrer">https://linktr.ee/stevenlegg</a>
</footer>

<script src="script.js"></script>
<script src="vocab-search.js" defer></script>
</body>
</html>
`;
}

/* ── hub patching ────────────────────────────────────────────────────────── */
function hubListItem(spec) {
  const flag = spec.hubIcon
    ? `<span class="l2-flag" aria-hidden="true"><img class="lang-icon" src="${spec.hubIcon}" alt=""></span>`
    : `<span class="l2-flag" aria-hidden="true">${spec.hubFlag || '🏳️'}</span>`;
  const file = `${spec.l2slug}-from-${spec.l1slug}.html`;
  return `        <li data-l2="${spec.hubL2 || spec.l2slug}" data-search="${spec.hubSearch || ''}"><a href="${file}">${flag}<span class="l2-name">${spec.hubLabel || spec.l2Display}</span></a></li>`;
}

function patchHub(spec) {
  let hub = fs.readFileSync(HUB, 'utf8');
  const file = `${spec.l2slug}-from-${spec.l1slug}.html`;
  if (hub.includes(`href="${file}"`)) {
    return 'already-linked';
  }
  const li = hubListItem(spec);
  const group = spec.hubGroup; // data-l1 value, e.g. "english"
  const groupRe = new RegExp(`(<section class="l1-group" data-l1="${group}"[\\s\\S]*?<ul>)([\\s\\S]*?)(\\n\\s*</ul>)`);
  const m = hub.match(groupRe);
  if (m) {
    // insert alphabetically by data-l2 within the existing <ul>
    const existing = m[2];
    const lines = existing.split('\n').filter(l => l.trim().startsWith('<li'));
    lines.push(li);
    lines.sort((a, b) => {
      const ka = (a.match(/data-l2="([^"]*)"/) || [, ''])[1];
      const kb = (b.match(/data-l2="([^"]*)"/) || [, ''])[1];
      return ka.localeCompare(kb);
    });
    const rebuilt = '\n' + lines.join('\n');
    hub = hub.replace(groupRe, `$1${rebuilt}$3`);
    fs.writeFileSync(HUB, hub);
    return 'inserted';
  }
  // group doesn't exist — create a new l1-group section before </article>
  if (!spec.hubGroupHtml) {
    fail(`hub group "${group}" not found and no "hubGroupHtml" provided to create it (file ${file})`);
  }
  const newSection = spec.hubGroupHtml.replace('<!--ITEMS-->', li);
  hub = hub.replace('\n</article>', `\n${newSection}\n</article>`);
  fs.writeFileSync(HUB, hub);
  return 'created-group';
}

/* ── main ────────────────────────────────────────────────────────────────── */
function generate(specPath) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  ['l2slug', 'l2code', 'l1slug', 'l1code', 'l2Display', 'l1Name', 'l1Label', 'title', 'description', 'hubGroup', 'words']
    .forEach(k => need(spec, k));

  const htmlFile = path.join(PUBLIC, `${spec.l2slug}-from-${spec.l1slug}.html`);
  const jsFile = path.join(PUBLIC, `${spec.l2slug}-srs-${spec.l1code}.js`);

  fs.writeFileSync(htmlFile, guideHtml(spec));
  fs.writeFileSync(jsFile, srsFile(spec));
  const hubResult = patchHub(spec);

  console.log(`✓ ${path.basename(htmlFile)}  (${spec.words.length} cards)`);
  console.log(`✓ ${path.basename(jsFile)}`);
  console.log(`✓ hub: ${hubResult}`);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log('Usage: node tools/lang-guide/generate.js <spec.json> [more specs...]');
  process.exit(0);
}
args.forEach(a => {
  try { generate(path.resolve(a)); }
  catch (e) { console.error(`✗ ${a}: ${e.message}`); process.exitCode = 1; }
});
