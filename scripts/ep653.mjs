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

function gValue(points) {
  const n = points.length;
  const R = [];
  for (let i = 0; i < n; i += 1) {
    const ds = new Set();
    const [xi, yi] = points[i];
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const dx = xi - points[j][0];
      const dy = yi - points[j][1];
      ds.add(dx * dx + dy * dy);
    }
    R.push(ds.size);
  }
  return new Set(R).size;
}

function lineAP(n) {
  return Array.from({ length: n }, (_, i) => [i, 0]);
}

function twoParallelAP(n) {
  const a = [];
  const m = Math.floor(n / 2);
  for (let i = 0; i < m; i += 1) a.push([i, 0]);
  for (let i = 0; i < n - m; i += 1) a.push([2 * i + 1, 3]);
  return a;
}

function optimize1D(n, L, restarts, steps, rng) {
  let globalBest = 0;
  let bestX = null;

  function makePoints(x) {
    return x.map((v) => [v, 0]);
  }

  for (let r = 0; r < restarts; r += 1) {
    const pool = Array.from({ length: L }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    let x = pool.slice(0, n).sort((a, b) => a - b);
    let used = new Set(x);
    let cur = gValue(makePoints(x));
    if (cur > globalBest) {
      globalBest = cur;
      bestX = x.slice();
    }

    for (let st = 0; st < steps; st += 1) {
      const i = Math.floor(rng() * n);
      const old = x[i];
      used.delete(old);
      let cand = Math.floor(rng() * L);
      let guard = 0;
      while (used.has(cand) && guard < 50) {
        cand = Math.floor(rng() * L);
        guard += 1;
      }
      if (used.has(cand)) {
        used.add(old);
        continue;
      }
      x[i] = cand;
      x.sort((a, b) => a - b);
      used = new Set(x);
      const nxt = gValue(makePoints(x));
      if (nxt >= cur || rng() < 0.002) {
        cur = nxt;
        if (cur > globalBest) {
          globalBest = cur;
          bestX = x.slice();
        }
      } else {
        x = x.filter((v, idx) => idx !== x.indexOf(cand));
        x.push(old);
        x.sort((a, b) => a - b);
        used = new Set(x);
      }
    }
  }

  return {
    best: globalBest,
    witness_prefix: bestX ? bestX.slice(0, 20) : [],
  };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 653);
const rows = [];

for (const n of [60, 80, 100, 120]) {
  const ap = gValue(lineAP(n));
  const two = gValue(twoParallelAP(n));
  const opt = optimize1D(n, 8 * n, 16, 180, rng);
  rows.push({
    n,
    g_line_arithmetic_progression: ap,
    g_two_parallel_progressions: two,
    best_g_from_1D_local_search: opt.best,
    best_g_over_n: Number((opt.best / n).toPrecision(8)),
    witness_x_prefix: opt.witness_prefix,
  });
}

const out = {
  problem: 'EP-653',
  script: path.basename(process.argv[1]),
  method: 'targeted_construction_plus_1D_local_search_for_large_number_of_distinct_R_values',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
