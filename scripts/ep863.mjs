#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep863_standalone_deeper.json';
const N_LIST = [80, 120, 180, 240];
const R_LIST = [2, 3];
const TRIALS = 200;

function makeRng(seed = 863_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function greedyMax(N, r, mode) {
  const vals = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(vals);
  const A = [];
  const cnt = new Map();

  function keySum(a, b) { return a + b; }
  function keyDiff(a, b) { return a - b; }
  const keyFn = mode === 'sum' ? keySum : keyDiff;

  for (const x of vals) {
    const touched = [];
    let ok = true;
    if (mode === 'sum') {
      for (const a of A) {
        const k = keyFn(a, x);
        const c = (cnt.get(k) || 0) + 1;
        if (c > r) {
          ok = false;
          break;
        }
        touched.push(k);
      }
      const d = keyFn(x, x);
      const cd = (cnt.get(d) || 0) + 1;
      if (ok && cd > r) ok = false;
      if (ok) touched.push(d);
    } else {
      for (const a of A) {
        // Difference analogue proxy: count positive unordered differences only.
        const d = Math.abs(a - x);
        if (d === 0) continue;
        const c = (cnt.get(d) || 0) + 1;
        if (c > r) {
          ok = false;
          break;
        }
        touched.push(d);
      }
    }
    if (!ok) continue;
    A.push(x);
    for (const k of touched) cnt.set(k, (cnt.get(k) || 0) + 1);
  }
  return A.length;
}

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  for (const r of R_LIST) {
    let bestSum = 0;
    let bestDiff = 0;
    let avgSum = 0;
    let avgDiff = 0;
    for (let t = 0; t < TRIALS; t += 1) {
      const s = greedyMax(N, r, 'sum');
      const d = greedyMax(N, r, 'diff');
      if (s > bestSum) bestSum = s;
      if (d > bestDiff) bestDiff = d;
      avgSum += s;
      avgDiff += d;
    }
    avgSum /= TRIALS;
    avgDiff /= TRIALS;
    rows.push({
      N,
      r,
      trials: TRIALS,
      best_sum_constrained_size: bestSum,
      best_diff_constrained_size: bestDiff,
      avg_sum_constrained_size: Number(avgSum.toPrecision(8)),
      avg_diff_constrained_size: Number(avgDiff.toPrecision(8)),
      best_sum_over_sqrtN: Number((bestSum / Math.sqrt(N)).toPrecision(8)),
      best_diff_over_sqrtN: Number((bestDiff / Math.sqrt(N)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-863',
  script: 'ep863.mjs',
  method: 'finite_random_greedy_comparison_sum_vs_difference_B2r_regimes',
  warning: 'Finite heuristic proxy only; not asymptotic constants c_r, c_r\'.',
  params: { N_LIST, R_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
