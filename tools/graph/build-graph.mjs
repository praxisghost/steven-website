#!/usr/bin/env node
/**
 * build-graph.mjs — Superorganism knowledge-graph data generator.
 *
 * Scans public/ for every real .html page, classifies each into a site
 * category, generates a CONSERVATIVE hub-and-spoke edge set (Obsidian-style:
 * meaningful, sparse, readable), and computes STABLE deterministic node
 * positions. Positions from a previous build are preserved so users keep
 * their spatial memory (GRAPH_DECISIONS Decision 004).
 *
 * Output: public/isms/superorganism-graph.json  (consumed by superorganism.html)
 *
 * Run:  node tools/graph/build-graph.mjs
 *
 * Design notes:
 *  - Edges are hub-and-spoke, never a full mesh, to avoid clutter (Decision 007/008).
 *  - A small curated set of semantic edges is layered on top (GRAPH_CONNECTIONS).
 *  - Layout: categories occupy angular sectors around a central node; spokes
 *    fan out from each category hub using a golden-angle spiral seeded by a
 *    stable hash of the node id -> identical output regardless of FS ordering.
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'isms', 'superorganism-graph.json');

// Pages that are infrastructure, not real content -> excluded from the graph.
const EXCLUDE = new Set([
  'isms/superorganism.html', // the graph viewer itself
  'GUIDE-TEMPLATE.html',     // a template, not a page
]);

/* ── Category definitions ─────────────────────────────────────────────────
 * id, label, color (hex), and the "hub" page each spoke connects to.
 * Colors follow GRAPH_METADATA.md / Decision 005. */
const CATEGORIES = {
  isms:        { label: 'Isms',             color: '#f5b301', hub: 'isms.html' },
  language:    { label: 'Language Learning', color: '#4f8cff', hub: 'language-guides.html' },
  retro:       { label: 'Retro Gaming',     color: '#ff4d4d', hub: 'retro-gaming.html' },
  projects:    { label: 'Projects',         color: '#19d3da', hub: 'projects.html' },
  technology:  { label: 'Technology',       color: '#2dd4a7', hub: 'technology.html' },
  blog:        { label: 'Personal Blog',    color: '#ffd54a', hub: 'blog.html' },
  writing:     { label: 'Writing',          color: '#b07bff', hub: 'writing.html' },
  music:       { label: 'Music',            color: '#9d6bff', hub: 'music.html' },
  selfimp:     { label: 'Self Improvement', color: '#ff7ac0', hub: 'self-improvement.html' },
  conlang:     { label: 'Conlang Editions', color: '#7a8cff', hub: 'index.html' },
  site:        { label: 'Site',             color: '#9aa0a6', hub: 'index.html' }, // default / grey
};

const CENTER_PAGE = 'index.html'; // visual + topological centre of the map

// Explicit category for specific root-level pages (dir-based rules handle the rest).
const ROOT_OVERRIDES = {
  // Language learning ecosystem
  'language-guides.html': 'language', 'language-learning.html': 'language',
  'language-methods.html': 'language', 'comprehensible-input.html': 'language',
  'extensive-reading.html': 'language', 'gold-list.html': 'language',
  'shadowing.html': 'language', 'tprs.html': 'language', 'task-based-output.html': 'language',
  'anki-guide.html': 'language', 'hypertts.html': 'language', 'con-lang.html': 'language',
  'intergermanic.html': 'language', 'interlingua.html': 'language', 'interslavic.html': 'language',
  'novial.html': 'language', 'esperanto.html': 'language', 'ido.html': 'language',
  'klingon.html': 'language', 'kesin.html': 'language', 'shavian-english.html': 'language',
  // Music
  'music.html': 'music', 'guitar.html': 'music', 'mandolin.html': 'music',
  'ocarina.html': 'music', 'playlists.html': 'music', 'rhythm-and-meter.html': 'music',
  // Writing / arts
  'writing.html': 'writing', 'art.html': 'writing', 'criticisms.html': 'writing',
  'tributes.html': 'writing', 'questions.html': 'writing', 'book-reviews.html': 'writing',
  // Self improvement / career
  'self-improvement.html': 'selfimp', 'career.html': 'selfimp', 'career-interests.html': 'selfimp',
  'career-learn.html': 'selfimp', 'sports.html': 'selfimp',
  // Section-index hubs adopt their cluster's colour rather than grey.
  'isms.html': 'isms', 'retro-gaming.html': 'retro', 'projects.html': 'projects',
  'technology.html': 'technology', 'blog.html': 'blog',
};

const CONLANG_DIRS = new Set(['ia', 'io', 'isv', 'nov']);

/* ── Walk public/ for html files ──────────────────────────────────────── */
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'vendor' || name.startsWith('.')) continue;
      walk(full, acc);
    } else if (name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

/* ── Title extraction: prefer <h1>, fall back to <title> ──────────────── */
function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
}
function extractTitle(html, fallback) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const t = decodeEntities(h1[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    if (t) return t;
  }
  const ti = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (ti) {
    const t = decodeEntities(ti[1]).replace(/\s*[—\-|]\s*Steven Legg.*$/i, '').trim();
    if (t) return t;
  }
  return fallback;
}

/* ── Classify a page (by relative path) into a category id ────────────── */
function classify(rel) {
  const parts = rel.split('/');
  const top = parts[0];
  const file = basename(rel);
  if (parts.length > 1) {
    if (top === 'isms') return 'isms';
    if (top === 'retro-gaming') return 'retro';
    if (top === 'projects') return 'projects';
    if (top === 'technology') return 'technology';
    if (top === 'blog') return 'blog';
    if (top === 'book-reviews') return 'writing';
    if (top === 'self-improvement') return 'selfimp';
    if (CONLANG_DIRS.has(top)) return 'conlang';
    return 'site';
  }
  // root-level pages
  if (/-from-.+\.html$/.test(file) || /-learning(-[a-z]{2})?\.html$/.test(file)) return 'language';
  if (ROOT_OVERRIDES[file]) return ROOT_OVERRIDES[file];
  return 'site';
}

/* ── Stable hash (FNV-1a) for deterministic per-node layout seeding ───── */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0);
}
function rand01(seed) { // deterministic [0,1)
  let x = (seed ^ 0x9e3779b9) >>> 0;
  x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0;
  return x / 4294967296;
}

/* ── Build nodes ───────────────────────────────────────────────────────── */
const files = walk(PUBLIC);
const nodes = [];
const byId = new Map();
for (const full of files) {
  const rel = relative(PUBLIC, full).split('\\').join('/');
  if (EXCLUDE.has(rel)) continue;
  const html = readFileSync(full, 'utf8');
  const cat = classify(rel);
  const fallback = basename(rel, '.html').replace(/-/g, ' ');
  const node = {
    id: rel,
    url: '/' + rel,
    title: extractTitle(html, fallback),
    category: cat,
    color: CATEGORIES[cat].color,
  };
  nodes.push(node);
  byId.set(rel, node);
}

/* ── Build edges (conservative hub-and-spoke + curated semantic) ──────── */
const edgeSet = new Set();
const edges = [];
function addEdge(a, b) {
  if (a === b || !byId.has(a) || !byId.has(b)) return;
  const key = a < b ? a + '|' + b : b + '|' + a;
  if (edgeSet.has(key)) return;
  edgeSet.add(key);
  edges.push({ source: a, target: b });
}

// 1) Each page -> its category hub.
for (const n of nodes) {
  const hub = CATEGORIES[n.category].hub;
  if (n.id !== hub) addEdge(n.id, hub);
}
// 2) Conlang mirror pages -> their own edition index, edition index -> centre.
for (const n of nodes) {
  if (n.category !== 'conlang') continue;
  const dir = n.id.split('/')[0];
  const idx = dir + '/index.html';
  if (n.id !== idx) addEdge(n.id, idx);
  else addEdge(n.id, CENTER_PAGE);
}
// 3) Category hubs -> site centre, forming the backbone of the map.
const hubPages = new Set(Object.values(CATEGORIES).map((c) => c.hub));
for (const hub of hubPages) addEdge(hub, CENTER_PAGE);

// 4) Curated semantic edges (only added when both pages exist). Per
//    GRAPH_CONNECTIONS.md — kept deliberately small.
const CURATED = [
  ['isms/existentialism.html', 'isms/absurdism.html'],
  ['isms/nihilism.html', 'isms/existentialism.html'],
  ['isms/capitalism.html', 'isms/communism.html'],
  ['isms/optimism.html', 'isms/pessimism.html'],
  ['isms/modernism.html', 'isms/post-modernism.html'],
  ['isms/post-modernism.html', 'isms/post-post-modernism.html'],
  ['projects/aquaponics.html', 'projects/circuits.html'],
  ['technology/return-to-linux.html', 'technology/artificial-intelligence.html'],
  ['technology/artificial-intelligence.html', 'projects/ai.html'],
  ['retro-gaming/nintendo-gamecube.html', 'retro-gaming/gameboy-advance-sp.html'],
  ['interlingua.html', 'ia/index.html'],
  ['ido.html', 'io/index.html'],
  ['interslavic.html', 'isv/index.html'],
  ['novial.html', 'nov/index.html'],
];
for (const [a, b] of CURATED) addEdge(a, b);

/* ── Deterministic, stable layout ─────────────────────────────────────── */
// Preserve positions from a previous build for any node that still exists.
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
const prevPos = new Map((prev?.nodes || []).map((n) => [n.id, [n.x, n.y]]));

const catIds = Object.keys(CATEGORIES);
const catIndex = Object.fromEntries(catIds.map((c, i) => [c, i]));
const N_CAT = catIds.length;
const SECTOR = (Math.PI * 2) / N_CAT;
const CAT_RADIUS = 620;   // distance of a category cluster centre from origin
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// group sizes for spiral spread
const catCounts = {};
for (const n of nodes) catCounts[n.category] = (catCounts[n.category] || 0) + 1;
const catSeen = {};

for (const n of nodes) {
  if (prevPos.has(n.id)) { const [x, y] = prevPos.get(n.id); n.x = x; n.y = y; continue; }
  if (n.id === CENTER_PAGE) { n.x = 0; n.y = 0; continue; }
  const ci = catIndex[n.category];
  const cx = Math.cos(ci * SECTOR) * CAT_RADIUS;
  const cy = Math.sin(ci * SECTOR) * CAT_RADIUS;
  // hub pages sit at the cluster centre; spokes spiral around it
  const hub = CATEGORIES[n.category].hub;
  if (n.id === hub) { n.x = cx; n.y = cy; continue; }
  const k = (catSeen[n.category] = (catSeen[n.category] || 0) + 1);
  const count = Math.max(1, catCounts[n.category]);
  const r = 70 + Math.sqrt(k) * 46 * Math.sqrt(60 / count + 1);
  const jitter = (rand01(hash(n.id)) - 0.5) * 0.5;
  const ang = k * GOLDEN + jitter;
  n.x = Math.round(cx + Math.cos(ang) * r);
  n.y = Math.round(cy + Math.sin(ang) * r);
}

/* ── Emit ──────────────────────────────────────────────────────────────── */
const categoriesOut = Object.fromEntries(
  catIds.map((id) => [id, { label: CATEGORIES[id].label, color: CATEGORIES[id].color }]),
);
const out = {
  generated: new Date().toISOString(),
  version: 1,
  counts: { nodes: nodes.length, edges: edges.length },
  categories: categoriesOut,
  nodes: nodes.map((n) => ({
    id: n.id, url: n.url, title: n.title, category: n.category,
    color: n.color, x: n.x, y: n.y,
  })),
  edges,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 0));

// summary to stdout
const perCat = {};
for (const n of nodes) perCat[n.category] = (perCat[n.category] || 0) + 1;
console.log(`Superorganism graph built: ${nodes.length} nodes, ${edges.length} edges`);
console.log('Per category:', JSON.stringify(perCat));
console.log('Reused positions:', [...prevPos.keys()].filter((id) => byId.has(id)).length);
console.log('Output:', relative(ROOT, OUT));
