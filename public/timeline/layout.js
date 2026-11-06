'use strict';
// Places every event above or below the centre axis. Pure: no page access.
// Each card hangs off a connector whose length varies so that no card overlaps
// another card and no connector runs through a card. Dense periods get more
// room on the axis, and long empty periods are shortened, so the axis is not
// linear in time. Axis ticks are read back from the placed events.
(function (root) {
  const CURRENT_YEAR = 2026;
  const PX_PER_YEAR = 1.2;
  const TIERS = {
    large: {w: 204, h: 170, img: 118},
    medium: {w: 158, h: 124, img: 78},
    small: {w: 122, h: 106, img: 62},
    text: {w: 146, h: 72, img: 0},
    textLarge: {w: 180, h: 84, img: 0},
  };

  const astro = y => (y < 0 ? y + 1 : y);
  const yearValue = d => astro(d.y) + ((d.m || 1) - 1) / 12 + ((d.d || 1) - 1) / 365;

  function tierOf(e) {
    const image = Boolean(e.slide && e.slide.media);
    if (!image) return e.importance === 3 ? 'textLarge' : 'text';
    return e.importance === 3 ? 'large' : e.importance === 1 ? 'small' : 'medium';
  }

  function compute(events, {stageHeight, reserveBottom = 22}) {
    // Fewer stacked rows on short screens, so cards stay readable.
    const scale = Math.max(0.8, Math.min(1.25, stageHeight / 780));
    const half = stageHeight / 2;
    const near = {up: 14 * scale, down: 30 * scale};
    const limit = {up: half - 10, down: half - reserveBottom - 6};
    const gap = 8 * scale;
    const maxGap = 230 * scale;
    const minStep = 11 * scale;
    const worldStart = 150 * scale;

    const active = {up: [], down: []};
    const items = [];
    let x = worldStart;
    let lastYear = null;
    let flip = false;

    const fits = (side, rx, d, left, right, h) => {
      const far = d + h;
      for (const r of active[side]) {
        const overlapsX = left < r.right + gap && right + gap > r.left;
        if (overlapsX && d < r.far + gap && far + gap > r.near) return false;
        if (rx >= r.left - 4 && rx <= r.right + 4 && d > r.near) return false;
        if (r.x >= left - 4 && r.x <= right + 4 && r.near > d) return false;
      }
      return true;
    };

    const place = (side, rx, w, h, offset) => {
      const left = rx - offset;
      const right = left + w;
      const top = limit[side] - h;
      if (top < near[side]) return null;
      const options = new Set([top, near[side]]);
      for (const r of active[side]) {
        const candidate = r.far + gap;
        if (candidate <= top) options.add(candidate);
      }
      // Farthest first keeps the space close to the axis free for the next events.
      for (const d of [...options].sort((p, q) => q - p)) {
        if (fits(side, rx, d, left, right, h)) return {side, d, left, right};
      }
      return null;
    };

    events.forEach((event, index) => {
      const year = yearValue(event.start);
      const tier = tierOf(event);
      const size = TIERS[tier];
      const w = size.w * scale;
      const h = size.h * scale;
      const offset = Math.min(22 * scale, w * 0.2);
      const elapsed = lastYear === null ? 0 : Math.max(0, year - lastYear);
      x += index === 0 ? 0 : Math.max(minStep, Math.min(maxGap, elapsed * PX_PER_YEAR * scale));

      let spot = null;
      for (let guard = 0; guard < 4000 && !spot; guard++) {
        const sides = flip ? ['down', 'up'] : ['up', 'down'];
        const keep = x - 400 * scale;
        for (const side of sides) active[side] = active[side].filter(r => r.right + 8 >= keep);
        spot = place(sides[0], x, w, h, offset) || place(sides[1], x, w, h, offset);
        if (!spot) x += 5 * scale;
      }
      if (!spot) spot = {side: 'up', d: near.up, left: x - offset, right: x - offset + w};
      flip = !flip;

      const rect = {x, left: spot.left, right: spot.right, near: spot.d, far: spot.d + h};
      active[spot.side].push(rect);
      items.push({event, tier, side: spot.side, x, left: spot.left, width: w, height: h, imageHeight: size.img * scale, distance: spot.d, year});
      lastYear = year;
    });

    const lastX = items.length ? items[items.length - 1].x + 260 * scale : worldStart + 400;
    const today = CURRENT_YEAR + 0.85;
    const endX = lastYear === null ? lastX : Math.max(lastX, x + Math.min(maxGap, Math.max(0, today - lastYear) * PX_PER_YEAR * scale));
    const width = endX + 190 * scale;

    // Year-to-position mapping, read back from the placed events.
    const anchors = [];
    for (const item of items) if (!anchors.length || item.year > anchors[anchors.length - 1].year) anchors.push({year: item.year, x: item.x});
    if (!anchors.length) anchors.push({year: 1, x: worldStart});
    if (anchors[anchors.length - 1].year < today) anchors.push({year: today, x: endX});

    const xOfYear = year => {
      if (year <= anchors[0].year) return anchors[0].x - Math.min(worldStart * 0.5, (anchors[0].year - year) * PX_PER_YEAR * scale);
      let low = 0;
      let high = anchors.length - 1;
      if (year >= anchors[high].year) return anchors[high].x;
      while (high - low > 1) {
        const mid = (low + high) >> 1;
        if (anchors[mid].year <= year) low = mid; else high = mid;
      }
      const a = anchors[low];
      const b = anchors[high];
      return a.x + (b.x - a.x) * ((year - a.year) / (b.year - a.year));
    };
    const yearOfX = pos => {
      if (pos <= anchors[0].x) return anchors[0].year;
      let low = 0;
      let high = anchors.length - 1;
      if (pos >= anchors[high].x) return anchors[high].year;
      while (high - low > 1) {
        const mid = (low + high) >> 1;
        if (anchors[mid].x <= pos) low = mid; else high = mid;
      }
      const a = anchors[low];
      const b = anchors[high];
      return a.year + (b.year - a.year) * ((pos - a.x) / (b.x - a.x));
    };

    return {items, width, height: stageHeight, axisY: half, scale, today, endX, boundaryX: xOfYear(1), xOfYear, yearOfX, ticks: makeTicks(xOfYear, anchors, scale)};
  }

  // Round years get priority, and a year is dropped when it would crowd a rounder one.
  function makeTicks(xOfYear, anchors, scale) {
    const first = anchors[0].year;
    const last = Math.min(anchors[anchors.length - 1].year, CURRENT_YEAR);
    const candidates = [];
    const rank = n => (n % 1000 === 0 ? 6 : n % 500 === 0 ? 5 : n % 100 === 0 ? 4 : n % 50 === 0 ? 3 : n % 10 === 0 ? 2 : n % 5 === 0 ? 1 : 0);
    for (let n = 10; n <= 10000; n += 10) {
      const a = 1 - n;
      if (a >= first) candidates.push({y: -n, a, rank: rank(n)});
    }
    for (let n = 1; n <= last; n++) {
      const r = rank(n);
      if (n >= 1900 || (n >= 1500 && r >= 1) || r >= 2) if (n >= first) candidates.push({y: n, a: n, rank: r});
    }
    candidates.sort((p, q) => q.rank - p.rank || p.a - q.a);
    const spacing = 92 * scale;
    const taken = new Map();
    const free = x => {
      const bucket = Math.floor(x / spacing);
      for (let b = bucket - 1; b <= bucket + 1; b++) for (const t of taken.get(b) || []) if (Math.abs(t - x) < spacing) return false;
      return true;
    };
    const take = x => {
      const bucket = Math.floor(x / spacing);
      if (!taken.has(bucket)) taken.set(bucket, []);
      taken.get(bucket).push(x);
    };
    take(xOfYear(1));
    const ticks = [];
    for (const c of candidates) {
      const x = xOfYear(c.a);
      if (!free(x)) continue;
      take(x);
      ticks.push({y: c.y, x, major: c.rank >= 4});
    }
    return ticks.sort((p, q) => p.x - q.x);
  }

  root.TimelineLayout = {compute, TIERS, tierOf, yearValue, CURRENT_YEAR};
})(typeof window !== 'undefined' ? window : globalThis);
