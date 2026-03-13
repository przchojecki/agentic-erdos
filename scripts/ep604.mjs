#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomDistinctPoints(n, grid, rng) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rng() * grid);
    const y = Math.floor(rng() * grid);
    const k = `${x},${y}`;
    if (used.has(k)) continue;
    used.add(k);
    pts.push([x, y]);
  }
  return pts;
}

function pinnedStats(points) {
  const n = points.length;
  let maxPinned = 0;
  let sumPinned = 0;
  for (let i = 0; i < n; i += 1) {
    const D = new Set();
    const [x1, y1] = points[i];
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const [x2, y2] = points[j];
      const dx = x1 - x2;
      const dy = y1 - y2;
      D.add(dx * dx + dy * dy);
    }
    const c = D.size;
    sumPinned += c;
    if (c > maxPinned) maxPinned = c;
  }
  return { maxPinned, avgPinned: sumPinned / n };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 604);
const rows = [];

for (const m of [12, 16, 20]) {
  const gridPts = [];
  for (let x = 0; x < m; x += 1) for (let y = 0; y < m; y += 1) gridPts.push([x, y]);
  const n = gridPts.length;
  const gs = pinnedStats(gridPts);

  const randPts = randomDistinctPoints(n, 3000, rng);
  const rs = pinnedStats(randPts);

  const scale = n / Math.sqrt(Math.log(Math.max(3, n)));

  rows.push({
    n,
    family: 'grid_m_by_m',
    m,
    max_pinned_distinct_distances: gs.maxPinned,
    avg_pinned_distinct_distances: Number(gs.avgPinned.toPrecision(8)),
    max_over_n_over_sqrt_log_n: Number((gs.maxPinned / scale).toPrecision(8)),
    max_over_n: Number((gs.maxPinned / n).toPrecision(8)),
  });

  rows.push({
    n,
    family: 'random_integer_points',
    grid_side: 3000,
    max_pinned_distinct_distances: rs.maxPinned,
    avg_pinned_distinct_distances: Number(rs.avgPinned.toPrecision(8)),
    max_over_n_over_sqrt_log_n: Number((rs.maxPinned / scale).toPrecision(8)),
    max_over_n: Number((rs.maxPinned / n).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-604',
  script: path.basename(process.argv[1]),
  method: 'deeper_pinned_distance_profile_grid_vs_random',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
