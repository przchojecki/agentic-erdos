#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function gridPoints(m) {
  const pts = [];
  for (let x = 0; x < m; x += 1) for (let y = 0; y < m; y += 1) pts.push([x, y]);
  return pts;
}

function randomDistinctPoints(n, lim, rng) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rng() * lim);
    const y = Math.floor(rng() * lim);
    const k = `${x},${y}`;
    if (used.has(k)) continue;
    used.add(k);
    pts.push([x, y]);
  }
  return pts;
}

function pinnedRValues(pts) {
  const n = pts.length;
  const R = [];
  for (let i = 0; i < n; i += 1) {
    const s = new Set();
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      s.add(dx * dx + dy * dy);
    }
    R.push(s.size);
  }
  R.sort((a, b) => a - b);
  return R;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 652);
const rows = [];

for (const m of [10, 14, 18, 22, 26, 30]) {
  const pts = gridPoints(m);
  const n = pts.length;
  const R = pinnedRValues(pts);
  for (const k of [2, 4, 8, 16, 32, 64]) {
    if (k > n) continue;
    rows.push({
      family: 'grid',
      n,
      k,
      R_x_k: R[k - 1],
      R_x_k_over_sqrt_n: Number((R[k - 1] / Math.sqrt(n)).toPrecision(8)),
    });
  }
}

for (const n of [196, 324, 484, 676]) {
  const trials = 14;
  const best = new Map();
  for (const k of [2, 4, 8, 16, 32]) best.set(k, Infinity);

  for (let t = 0; t < trials; t += 1) {
    const pts = randomDistinctPoints(n, 12000, rng);
    const R = pinnedRValues(pts);
    for (const k of [2, 4, 8, 16, 32]) {
      const v = R[k - 1];
      if (v < best.get(k)) best.set(k, v);
    }
  }

  for (const k of [2, 4, 8, 16, 32]) {
    rows.push({
      family: 'random_best_of_trials',
      n,
      trials,
      k,
      best_R_x_k_over_trials: best.get(k),
      best_R_x_k_over_sqrt_n: Number((best.get(k) / Math.sqrt(n)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-652',
  script: path.basename(process.argv[1]),
  method: 'deeper_ordered_pinned_distance_profiles_for_grid_and_random_sets',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
