#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randColor3Uniform(N, rng) {
  const col = new Map();
  for (let a = 0; a < N; a += 1) {
    for (let b = a + 1; b < N; b += 1) {
      for (let c = b + 1; c < N; c += 1) {
        col.set(`${a},${b},${c}`, rng() < 0.5 ? 0 : 1);
      }
    }
  }
  return col;
}

function hasMonoK4_3(col, N, color) {
  for (let a = 0; a < N; a += 1) {
    for (let b = a + 1; b < N; b += 1) {
      for (let c = b + 1; c < N; c += 1) {
        for (let d = c + 1; d < N; d += 1) {
          const e1 = col.get(`${a},${b},${c}`);
          const e2 = col.get(`${a},${b},${d}`);
          const e3 = col.get(`${a},${c},${d}`);
          const e4 = col.get(`${b},${c},${d}`);
          if (e1 === color && e2 === color && e3 === color && e4 === color) return true;
        }
      }
    }
  }
  return false;
}

function randomAvoidHitsK4_3(N, trials, rng) {
  let hits = 0;
  for (let t = 0; t < trials; t += 1) {
    const col = randColor3Uniform(N, rng);
    const bad = hasMonoK4_3(col, N, 0) || hasMonoK4_3(col, N, 1);
    if (!bad) hits += 1;
  }
  return hits;
}

function logIter(x, times) {
  let v = x;
  for (let i = 0; i < times; i += 1) {
    if (v <= 1) return 0;
    v = Math.log(v);
  }
  return v;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 562);

const random_rows = [];
for (const [N, trials] of [[10, 700], [11, 700], [12, 600], [13, 500]]) {
  random_rows.push({
    N,
    trials,
    avoiding_hits_no_mono_K4_3: randomAvoidHitsK4_3(N, trials, rng),
  });
}

const tower_proxy_rows = [];
for (const r of [3, 4, 5]) {
  for (const n of [4, 5, 6, 7, 8, 10, 12]) {
    // Symbolic proxy for the conjectural tower-height (r-1) regime:
    // log_{r-1} R_r(n) should be linear in n up to constants.
    const a = 0.12 + 0.03 * (3 / r);
    const b = 0.42 + 0.08 * (3 / r);
    tower_proxy_rows.push({
      r,
      n,
      log_iter_r_minus_1_lower_proxy: Number((a * n).toPrecision(8)),
      log_iter_r_minus_1_upper_proxy: Number((b * n).toPrecision(8)),
      linear_n_reference: n,
    });
  }
}

const out = {
  problem: 'EP-562',
  script: path.basename(process.argv[1]),
  method: 'random_K4_3_avoidance_plus_iterated_log_tower_scale_proxy',
  params: {},
  random_rows,
  tower_proxy_rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
