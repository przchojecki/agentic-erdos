#!/usr/bin/env node
import fs from 'fs';

// EP-826 finite proxy:
// Search n so that tau(n+k)/k stays small uniformly for 1<=k<=K.
// This does not prove the infinite statement, but quantifies finite behavior.

const OUT = process.env.OUT || 'data/ep826_standalone_deeper.json';
const N_MAX = 40_000;
const K = 2_000;
const K_TAIL_MIN = 50;

const t0 = Date.now();
const LIMIT = N_MAX + K + 5;
const tau = new Uint16Array(LIMIT + 1);
for (let d = 1; d <= LIMIT; d += 1) {
  for (let m = d; m <= LIMIT; m += d) tau[m] += 1;
}

let bestN = 1;
let bestC = Infinity;
let bestTailN = 1;
let bestTailC = Infinity;
const records = [];
const tailRecords = [];
for (let n = 1; n <= N_MAX; n += 1) {
  let c = 0;
  let argK = 1;
  let cTail = 0;
  let argKTail = K_TAIL_MIN;
  for (let k = 1; k <= K; k += 1) {
    const ratio = tau[n + k] / k;
    if (ratio > c) {
      c = ratio;
      argK = k;
    }
    if (k >= K_TAIL_MIN && ratio > cTail) {
      cTail = ratio;
      argKTail = k;
    }
  }
  if (c < bestC) {
    bestC = c;
    bestN = n;
    records.push({
      n,
      max_tau_over_k_up_to_K: Number(c.toPrecision(8)),
      attained_at_k: argK,
      tau_n_plus_k: tau[n + argK],
    });
  }
  if (cTail < bestTailC) {
    bestTailC = cTail;
    bestTailN = n;
    tailRecords.push({
      n,
      max_tau_over_k_for_k_ge_K_TAIL_MIN: Number(cTail.toPrecision(8)),
      attained_at_k: argKTail,
      tau_n_plus_k: tau[n + argKTail],
    });
  }
}

const sampleRows = [];
for (const n of [100, 500, 1000, 2500, 5000, 10000, 20000, 30000, 40000]) {
  let c = 0;
  for (let k = 1; k <= K; k += 1) {
    const ratio = tau[n + k] / k;
    if (ratio > c) c = ratio;
  }
  sampleRows.push({
    n,
    max_tau_over_k_up_to_K: Number(c.toPrecision(8)),
  });
}

const out = {
  problem: 'EP-826',
  script: 'ep826.mjs',
  method: 'finite_uniform_shift_divisor_bound_scan',
  warning: 'Finite K and N_MAX proxy only; asymptotic infinite-k statement remains open.',
  params: { N_MAX, K, K_TAIL_MIN },
  best_n_found: bestN,
  best_uniform_constant_up_to_K: Number(bestC.toPrecision(8)),
  best_n_found_tail_metric: bestTailN,
  best_uniform_constant_for_k_ge_K_TAIL_MIN: Number(bestTailC.toPrecision(8)),
  record_improvements: records.slice(-25),
  tail_record_improvements: tailRecords.slice(-25),
  sample_rows: sampleRows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
