#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep888_standalone_deeper.json';
const EXACT_N_LIST = [22, 24, 26, 28];
const GREEDY_N_LIST = [80, 100, 120, 150, 180];
const GREEDY_TRIALS = 40;

function makeRng(seed = 888_2026) {
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

function isSquare(x) {
  const r = Math.floor(Math.sqrt(x));
  return r * r === x;
}

function violates(A, x) {
  const B = A.concat([x]).sort((a, b) => a - b);
  const m = B.length;
  for (let i = 0; i < m; i += 1) {
    for (let j = i; j < m; j += 1) {
      for (let k = j; k < m; k += 1) {
        for (let t = k; t < m; t += 1) {
          const a = B[i], b = B[j], c = B[k], d = B[t];
          if (!isSquare(a * b * c * d)) continue;
          if (a * d !== b * c) return true;
        }
      }
    }
  }
  return false;
}

function exactMax(n) {
  const vals = Array.from({ length: n }, (_, i) => n - i);
  let best = [];
  const cur = [];
  function dfs(i) {
    if (cur.length + (vals.length - i) <= best.length) return;
    if (i === vals.length) {
      if (cur.length > best.length) best = cur.slice();
      return;
    }
    const x = vals[i];
    if (!violates(cur, x)) {
      cur.push(x);
      dfs(i + 1);
      cur.pop();
    }
    dfs(i + 1);
  }
  dfs(0);
  return best.sort((a, b) => a - b);
}

function greedy(n) {
  const vals = Array.from({ length: n }, (_, i) => i + 1);
  shuffle(vals);
  const A = [];
  for (const x of vals) if (!violates(A, x)) A.push(x);
  return A.length;
}

function primeCount(n) {
  let c = 0;
  for (let x = 2; x <= n; x += 1) {
    let p = true;
    for (let d = 2; d * d <= x; d += 1) if (x % d === 0) p = false;
    if (p) c += 1;
  }
  return c;
}

const t0 = Date.now();
const exact_rows = [];
for (const n of EXACT_N_LIST) {
  const A = exactMax(n);
  exact_rows.push({
    n,
    exact_best_size: A.length,
    exact_best_over_n: Number((A.length / n).toPrecision(8)),
    prime_count_up_to_n: primeCount(n),
    exact_best_set: A,
  });
}

const greedy_rows = [];
for (const n of GREEDY_N_LIST) {
  let best = 0, avg = 0;
  for (let t = 0; t < GREEDY_TRIALS; t += 1) {
    const s = greedy(n);
    if (s > best) best = s;
    avg += s;
  }
  avg /= GREEDY_TRIALS;
  greedy_rows.push({
    n,
    trials: GREEDY_TRIALS,
    best_size_found: best,
    avg_size_found: Number(avg.toPrecision(8)),
    best_over_n: Number((best / n).toPrecision(8)),
    best_vs_nloglog_over_log: Number((best / (n * Math.log(Math.log(Math.max(3, n))) / Math.log(n))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-888',
  script: 'ep888.mjs',
  method: 'exact_small_n_and_greedy_larger_n_profiles_for_square_product_constraint',
  params: { EXACT_N_LIST, GREEDY_N_LIST, GREEDY_TRIALS },
  exact_rows,
  greedy_rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
