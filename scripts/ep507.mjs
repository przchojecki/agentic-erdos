#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const STEP = Number(process.env.STEP || 0.03);
const ITER_SCALE = Number(process.env.ITER_SCALE || 1);

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function randomPointDisk(rng) {
  const r = Math.sqrt(rng());
  const t = 2 * Math.PI * rng();
  return [r * Math.cos(t), r * Math.sin(t)];
}

function clampToDisk([x, y]) {
  const r2 = x * x + y * y;
  if (r2 <= 1) return [x, y];
  const r = Math.sqrt(r2);
  return [x / r, y / r];
}

function minTriangleArea(points) {
  const n = points.length;
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < n; i += 1) {
    const [xi, yi] = points[i];
    for (let j = i + 1; j < n; j += 1) {
      const [xj, yj] = points[j];
      for (let k = j + 1; k < n; k += 1) {
        const [xk, yk] = points[k];
        const area = 0.5 * Math.abs((xj - xi) * (yk - yi) - (xk - xi) * (yj - yi));
        if (area < best) best = area;
      }
    }
  }
  return best;
}

function optimizeForN(n, restarts, iterations, rng) {
  let globalBest = 0;
  let sumBest = 0;

  for (let r = 0; r < restarts; r += 1) {
    let pts = Array.from({ length: n }, () => randomPointDisk(rng));
    let best = minTriangleArea(pts);

    for (let it = 0; it < iterations; it += 1) {
      const idx = Math.floor(rng() * n);
      const old = pts[idx];
      const cand = clampToDisk([
        old[0] + STEP * (2 * rng() - 1),
        old[1] + STEP * (2 * rng() - 1),
      ]);
      pts[idx] = cand;
      const v = minTriangleArea(pts);
      if (v >= best) {
        best = v;
      } else {
        pts[idx] = old;
      }
    }

    sumBest += best;
    if (best > globalBest) globalBest = best;
  }

  return {
    n,
    restarts,
    iterations,
    best_min_area_found: Number(globalBest.toPrecision(8)),
    mean_restart_best_min_area: Number((sumBest / restarts).toPrecision(8)),
    best_times_n_sq: Number((globalBest * n * n).toPrecision(8)),
    best_times_n_pow_7_over_6: Number((globalBest * n ** (7 / 6)).toPrecision(8)),
  };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 507);
const tasks = [
  { n: 24, restarts: 70, iterations: Math.floor(3000 * ITER_SCALE) },
  { n: 40, restarts: 55, iterations: Math.floor(2600 * ITER_SCALE) },
  { n: 60, restarts: 42, iterations: Math.floor(2200 * ITER_SCALE) },
  { n: 80, restarts: 30, iterations: Math.floor(1800 * ITER_SCALE) },
];

const rows = tasks.map((t) => optimizeForN(t.n, t.restarts, t.iterations, rng));

const out = {
  problem: 'EP-507',
  script: path.basename(process.argv[1]),
  method: 'deep_local_search_profile_for_heilbronn_triangle_parameter',
  params: {
    tasks,
    move_step: STEP,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
