/* ─────────────────────────────────────────────────────────────────────────
 * superorganism.js — Three.js knowledge-graph renderer for the whole site.
 *
 * Obsidian-style graph view: OLED-black canvas, tiny glowing nodes coloured by
 * site category, sparse connecting lines. Hovering a node enlarges it, shows
 * its title, and highlights direct connections; clicking opens the page.
 *
 * Data comes from superorganism-graph.json (built by tools/graph/build-graph.mjs).
 * Three.js is self-hosted at /vendor/ to satisfy the site's strict CSP — no CDN.
 *
 * Rendering uses a single THREE.Points (one draw call for all nodes) and a
 * single line geometry for all edges, so the design scales toward thousands of
 * pages (Decision 011).
 * ──────────────────────────────────────────────────────────────────────── */
import * as THREE from '/vendor/three.module.min.js';

const DATA_URL = 'superorganism-graph.json';

const canvas   = document.getElementById('so-canvas');
const stage    = document.getElementById('superorganism');
const labelEl  = document.getElementById('so-label');
const legendEl = document.getElementById('so-legend');
const hudEl    = document.getElementById('so-hud');
const loading  = document.getElementById('so-loading');
const searchIn = document.getElementById('so-search-input');

init().catch((err) => {
  console.error('[superorganism] failed:', err);
  loading.textContent = 'The graph could not load. Try refreshing.';
});

async function init() {
  const res = await fetch(DATA_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error('graph data ' + res.status);
  const data = await res.json();
  const nodes = data.nodes;
  const edges = data.edges;
  const cats  = data.categories;

  const index = new Map(nodes.map((n, i) => [n.id, i]));

  // adjacency: neighbour index sets, for hover highlighting
  const adj = nodes.map(() => new Set());
  const edgePairs = []; // [iA, iB]
  for (const e of edges) {
    const a = index.get(e.source), b = index.get(e.target);
    if (a == null || b == null) continue;
    adj[a].add(b); adj[b].add(a);
    edgePairs.push([a, b]);
  }
  // node degree -> base size (hubs slightly larger, like Obsidian)
  const deg = nodes.map((_, i) => adj[i].size);
  const maxDeg = Math.max(1, ...deg);

  /* ── Renderer / scene / camera ─────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(0x000000, 1);
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();

  // graph bounds -> initial frustum
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
    minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const spanX = (maxX - minX) || 100, spanY = (maxY - minY) || 100;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  camera.position.set(cx, cy, 10);
  const view = { halfH: Math.max(spanX, spanY) * 0.62 }; // world half-height baseline

  function applyFrustum() {
    const aspect = canvas.clientWidth / canvas.clientHeight || 1;
    const hh = view.halfH;
    camera.top = hh; camera.bottom = -hh;
    camera.left = -hh * aspect; camera.right = hh * aspect;
    camera.updateProjectionMatrix();
  }

  /* ── Node geometry (single Points) ─────────────────────────────────── */
  const N = nodes.length;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const baseSize = new Float32Array(N);
  const aSize = new Float32Array(N);
  const aAlpha = new Float32Array(N);
  const tmp = new THREE.Color();
  for (let i = 0; i < N; i++) {
    positions[i * 3] = nodes[i].x; positions[i * 3 + 1] = nodes[i].y; positions[i * 3 + 2] = 0;
    tmp.set(nodes[i].color);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
    const s = 7 + 9 * Math.sqrt(deg[i] / maxDeg); // px radius-ish, hubs bigger
    baseSize[i] = s; aSize[i] = s; aAlpha[i] = 1;
  }
  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  nGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  nGeo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  nGeo.setAttribute('aAlpha', new THREE.BufferAttribute(aAlpha, 1));

  const nMat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 1 }, uDpr: { value: DPR } },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `
      attribute vec3 aColor; attribute float aSize; attribute float aAlpha;
      uniform float uScale; uniform float uDpr;
      varying vec3 vColor; varying float vAlpha;
      void main(){
        vColor = aColor; vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uScale * uDpr;
      }`,
    fragmentShader: `
      precision mediump float;
      varying vec3 vColor; varying float vAlpha;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.40, d);
        float glow = smoothstep(0.5, 0.0, d) * 0.45;
        float a = max(core, glow) * vAlpha;
        if(a < 0.012) discard;
        vec3 col = mix(vColor, vec3(1.0), core * 0.25); // bright centre
        gl_FragColor = vec4(col, a);
      }`,
  });
  const points = new THREE.Points(nGeo, nMat);
  points.frustumCulled = false;
  scene.add(points);

  /* ── Edge geometry (single line set) ───────────────────────────────── */
  const E = edgePairs.length;
  const ePos = new Float32Array(E * 6);
  const eAlpha = new Float32Array(E * 2);
  for (let i = 0; i < E; i++) {
    const [a, b] = edgePairs[i];
    ePos[i * 6]     = nodes[a].x; ePos[i * 6 + 1] = nodes[a].y; ePos[i * 6 + 2] = 0;
    ePos[i * 6 + 3] = nodes[b].x; ePos[i * 6 + 4] = nodes[b].y; ePos[i * 6 + 5] = 0;
    eAlpha[i * 2] = eAlpha[i * 2 + 1] = 0.10;
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  eGeo.setAttribute('aAlpha', new THREE.BufferAttribute(eAlpha, 1));
  const eMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x8fa0c0) } },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `
      attribute float aAlpha; varying float vA;
      void main(){ vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      precision mediump float; uniform vec3 uColor; varying float vA;
      void main(){ gl_FragColor = vec4(uColor, vA); }`,
  });
  const lines = new THREE.LineSegments(eGeo, eMat);
  lines.frustumCulled = false;
  scene.add(lines);

  /* ── State ─────────────────────────────────────────────────────────── */
  let hover = -1;
  let searchMatch = null;     // Set<index> or null
  const hiddenCats = new Set();

  function isHidden(i) { return hiddenCats.has(nodes[i].category); }

  function updateHighlight() {
    const neigh = hover >= 0 ? adj[hover] : null;
    for (let i = 0; i < N; i++) {
      let alpha = 1, size = baseSize[i];
      if (isHidden(i)) { alpha = 0.04; }
      else if (hover >= 0) {
        if (i === hover) { alpha = 1; size = baseSize[i] * 1.9; }
        else if (neigh.has(i)) { alpha = 1; size = baseSize[i] * 1.25; }
        else { alpha = 0.14; }
      }
      if (searchMatch) {
        if (searchMatch.has(i)) { alpha = 1; size = Math.max(size, baseSize[i] * 1.5); }
        else if (!isHidden(i)) { alpha = Math.min(alpha, 0.12); }
      }
      aAlpha[i] = alpha; aSize[i] = size;
    }
    nGeo.attributes.aAlpha.needsUpdate = true;
    nGeo.attributes.aSize.needsUpdate = true;

    for (let i = 0; i < E; i++) {
      const [a, b] = edgePairs[i];
      let al = 0.10;
      if (isHidden(a) || isHidden(b)) al = 0.015;
      else if (hover >= 0) al = (a === hover || b === hover) ? 0.55 : 0.04;
      eAlpha[i * 2] = eAlpha[i * 2 + 1] = al;
    }
    eGeo.attributes.aAlpha.needsUpdate = true;
  }

  /* ── Pan / zoom ────────────────────────────────────────────────────── */
  function worldPerPixel() { return (view.halfH * 2) / canvas.clientHeight; }

  function zoomAt(px, py, factor) {
    const before = screenToWorld(px, py);
    view.halfH = Math.min(Math.max(view.halfH * factor, 18), Math.max(spanX, spanY) * 2.5);
    applyFrustum();
    const after = screenToWorld(px, py);
    camera.position.x += before.x - after.x;
    camera.position.y += before.y - after.y;
  }
  function screenToWorld(px, py) {
    const rect = canvas.getBoundingClientRect();
    const nx = ((px - rect.left) / rect.width) * 2 - 1;
    const ny = -(((py - rect.top) / rect.height) * 2 - 1);
    return { x: camera.position.x + nx * (camera.right), y: camera.position.y + ny * (camera.top) };
  }

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.0012));
  }, { passive: false });

  let dragging = false, moved = false, lastX = 0, lastY = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; lastX = e.clientX; lastY = e.clientY;
    stage.classList.add('dragging'); canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      const wpp = worldPerPixel();
      camera.position.x -= dx * wpp; camera.position.y += dy * wpp;
      lastX = e.clientX; lastY = e.clientY;
    } else {
      handleHover(e.clientX, e.clientY);
    }
  });
  function endDrag(e) {
    if (dragging && e) { try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} }
    dragging = false; stage.classList.remove('dragging');
  }
  canvas.addEventListener('pointerup', (e) => {
    endDrag(e);
    if (!moved) handleClick(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { if (!dragging) setHover(-1, 0, 0); });

  /* ── Picking ───────────────────────────────────────────────────────── */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(px, py) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((px - rect.left) / rect.width) * 2 - 1;
    ndc.y = -(((py - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(ndc, camera);
    // threshold scales with current zoom so picking matches on-screen dot size
    raycaster.params.Points.threshold = worldPerPixel() * 11;
    const hits = raycaster.intersectObject(points, false);
    for (const h of hits) { if (!isHidden(h.index)) return h.index; }
    return -1;
  }
  function handleHover(px, py) {
    const i = pick(px, py);
    setHover(i, px, py);
  }
  function setHover(i, px, py) {
    if (i === hover) {
      if (i >= 0) positionLabel(px, py);
      return;
    }
    hover = i;
    if (i >= 0) {
      labelEl.textContent = nodes[i].title;
      labelEl.classList.add('show');
      positionLabel(px, py);
      canvas.style.cursor = 'pointer';
    } else {
      labelEl.classList.remove('show');
      canvas.style.cursor = '';
    }
    updateHighlight();
  }
  function positionLabel(px, py) { labelEl.style.left = px + 'px'; labelEl.style.top = py + 'px'; }
  function handleClick(px, py) {
    const i = pick(px, py);
    if (i >= 0) window.location.href = nodes[i].url;
  }

  /* ── Legend ────────────────────────────────────────────────────────── */
  const usedCats = [...new Set(nodes.map((n) => n.category))];
  const catOrder = Object.keys(cats).filter((c) => usedCats.includes(c));
  for (const c of catOrder) {
    const item = document.createElement('div');
    item.className = 'item'; item.dataset.cat = c;
    const dot = document.createElement('span');
    dot.className = 'dot'; dot.style.color = cats[c].color; dot.style.background = cats[c].color;
    const txt = document.createElement('span'); txt.textContent = cats[c].label;
    item.append(dot, txt);
    item.addEventListener('click', () => {
      if (hiddenCats.has(c)) { hiddenCats.delete(c); item.classList.remove('dim'); }
      else { hiddenCats.add(c); item.classList.add('dim'); }
      updateHighlight();
    });
    legendEl.appendChild(item);
  }

  /* ── Search ────────────────────────────────────────────────────────── */
  searchIn.addEventListener('input', () => {
    const q = searchIn.value.trim().toLowerCase();
    if (!q) { searchMatch = null; updateHighlight(); return; }
    searchMatch = new Set();
    for (let i = 0; i < N; i++) {
      if (nodes[i].title.toLowerCase().includes(q) || nodes[i].id.toLowerCase().includes(q)) searchMatch.add(i);
    }
    updateHighlight();
  });
  searchIn.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !searchMatch || searchMatch.size === 0) return;
    const first = [...searchMatch][0];
    window.location.href = nodes[first].url;
  });

  /* ── HUD ───────────────────────────────────────────────────────────── */
  hudEl.innerHTML = `<b>${N}</b> pages · <b>${E}</b> links<br>drag to pan · scroll to zoom · click a node to open`;

  /* ── Resize + render loop ──────────────────────────────────────────── */
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    applyFrustum();
  }
  window.addEventListener('resize', resize);
  resize();

  // initial framing: fit whole graph with margin
  view.halfH = Math.max(spanX * (canvas.clientHeight / canvas.clientWidth || 1), spanY) * 0.62;
  applyFrustum();

  updateHighlight();
  loading.classList.add('hide');

  function frame() {
    // point size scales gently with zoom so dots feel anchored in space
    const baseHalf = Math.max(spanX, spanY) * 0.62;
    nMat.uniforms.uScale.value = Math.min(Math.max(baseHalf / view.halfH, 0.55), 2.6);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
