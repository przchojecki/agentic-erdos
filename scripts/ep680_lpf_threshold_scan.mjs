#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-680 finite check:
// For each n, does there exist k with p(n+k) > k^2+1 ?
// Here p(m) is least prime factor of m.

const N_MAX = Number(process.env.N_MAX || 80000);
const CHECKPOINTS = (process.env.CHECKPOINTS || '100,500,1000,2000,5000,10000,20000,40000,80000,160000,250000')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x >= 2 && x <= N_MAX);

function lpfTable(n) {
  const lpf = new Int32Array(n + 1);
  lpf[1] = 1;
  for (let p = 2; p <= n; p++) {
    if (lpf[p] !== 0) continue;
    for (let j = p; j <= n; j += p) if (lpf[j] === 0) lpf[j] = p;
  }
  return lpf;
}

function kUpperBound(n) {
  // Need k^2 + 1 < n + k (otherwise impossible since p(n+k) <= n+k).
  // So k^2 - k - (n-1) < 0.
  return Math.floor((1 + Math.sqrt(1 + 4 * (n - 1))) / 2);
}

const K_MAX = kUpperBound(N_MAX);
const lpf = lpfTable(N_MAX + K_MAX + 5);

const hasWitness = new Uint8Array(N_MAX + 1);
const firstK = new Int32Array(N_MAX + 1);

for (let n = 2; n <= N_MAX; n++) {
  const ku = kUpperBound(n);
  let ok = false;
  let kHit = -1;
  for (let k = 1; k <= ku; k++) {
    const m = n + k;
    if (lpf[m] > k * k + 1) {
      ok = true;
      kHit = k;
      break;
    }
  }
  hasWitness[n] = ok ? 1 : 0;
  firstK[n] = kHit;
}

const prefixRows = [];
let prefGood = 0;
let prefBad = 0;
let ptr = 0;
const sortedCheckpoints = [...new Set([...CHECKPOINTS, N_MAX])].sort((a, b) => a - b);

for (let n = 2; n <= N_MAX; n++) {
  if (hasWitness[n]) prefGood++;
  else prefBad++;
  while (ptr < sortedCheckpoints.length && sortedCheckpoints[ptr] === n) {
    prefixRows.push({
      n,
      good_count: prefGood,
      bad_count: prefBad,
      good_ratio: Number((prefGood / (n - 1)).toFixed(6)),
    });
    ptr++;
  }
}

const firstBad = [];
for (let n = 2; n <= N_MAX && firstBad.length < 60; n++) if (!hasWitness[n]) firstBad.push(n);

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  k_max_global: K_MAX,
  total_good: prefGood,
  total_bad: prefBad,
  first_bad_n: firstBad,
  checkpoints: prefixRows,
  sample_witnesses: [50, 100, 500, 1000, 5000, 10000, 50000, 80000, 160000, 250000, N_MAX]
    .filter((n) => n <= N_MAX)
    .map((n) => ({ n, witness_k: firstK[n] })),
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep680_lpf_threshold_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX, total_bad: out.total_bad }, null, 2));
