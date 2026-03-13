#!/usr/bin/env node
import fs from 'fs';

// EP-817:
// For k=3, finite search for large |A| in [1,N] such that subset sums have no nontrivial 3-AP.
// This is heuristic finite evidence only.

const OUT = process.env.OUT || 'data/ep817_standalone_deeper.json';
const N_LIST = [80, 120, 160, 220, 300];
const TRIES_PER_N = 3500;
const RUNTIME_CAP_MS = 5000;

function makeRng(seed = 1_234_567_891) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng(817_2026);

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function has3AP(bitset) {
  const m = bitset.length - 1;
  for (let y = 1; y < m; y += 1) {
    if (!bitset[y]) continue;
    const dMax = Math.min(y, m - y);
    for (let d = 1; d <= dMax; d += 1) {
      if (bitset[y - d] && bitset[y + d]) return true;
    }
  }
  return false;
}

function subsetSumsNo3AP(A) {
  let sums = [0];
  let max = 0;
  for (const a of A) {
    const len = sums.length;
    const next = new Array(len);
    for (let i = 0; i < len; i += 1) next[i] = sums[i] + a;
    sums = sums.concat(next);
    max += a;
  }
  const bitset = new Uint8Array(max + 1);
  for (const s of sums) bitset[s] = 1;
  return !has3AP(bitset);
}

function greedyCandidate(N, targetSizeHint) {
  const pool = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(pool);
  const A = [];
  for (const v of pool) {
    if (A.length >= targetSizeHint && rng() < 0.75) continue;
    A.push(v);
    if (!subsetSumsNo3AP(A)) A.pop();
  }
  return A.sort((a, b) => a - b);
}

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  let best = [];
  let tries = 0;
  while (tries < TRIES_PER_N && Date.now() - t0 < RUNTIME_CAP_MS) {
    const hint = best.length + 1 + Math.floor(rng() * 3);
    const A = greedyCandidate(N, hint);
    if (A.length > best.length) best = A;
    tries += 1;
  }
  rows.push({
    N,
    tries,
    best_size_found: best.length,
    best_set_found: best,
    lower_exponent_log3_size_over_logN:
      best.length >= 2 ? Number((Math.log(best.length) / Math.log(N)).toPrecision(7)) : null,
  });
}

const out = {
  problem: 'EP-817',
  script: 'ep817.mjs',
  method: 'randomized_greedy_search_for_large_sets_with_3AP-free_subset_sums',
  warning: 'Finite heuristic lower-bound exploration only.',
  params: { N_LIST, TRIES_PER_N, RUNTIME_CAP_MS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
