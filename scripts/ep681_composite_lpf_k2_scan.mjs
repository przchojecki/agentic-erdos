#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-681 finite counterexample search:
// For each n, ask whether there exists k >= 1 such that:
//   (1) n+k is composite
//   (2) lpf(n+k) > k^2
// where lpf is the least prime factor.

const N_MAX = Number(process.env.N_MAX || 1000000);
const CHECKPOINTS = (process.env.CHECKPOINTS || '100,1000,10000,100000,250000,500000,750000,1000000')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x >= 2 && x <= N_MAX);

function buildSpf(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i <= Math.floor(limit / i)) {
      for (let j = i * i; j <= limit; j += i) {
        if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

// Necessary condition for lpf(n+k) > k^2:
// need n+k > k^2, i.e. k^2-k-(n-1) < 0.
function kUpperBound(n) {
  return Math.floor((1 + Math.sqrt(1 + 4 * (n - 1))) / 2);
}

const K_MAX = kUpperBound(N_MAX);
const spf = buildSpf(N_MAX + K_MAX + 5);

const hasWitness = new Uint8Array(N_MAX + 1);
const firstWitnessK = new Int32Array(N_MAX + 1);

for (let n = 2; n <= N_MAX; n += 1) {
  let ok = false;
  let kHit = -1;

  // k=1 works iff n+1 is composite (then lpf >= 2 > 1).
  if (spf[n + 1] !== n + 1) {
    ok = true;
    kHit = 1;
  } else {
    const ku = kUpperBound(n);
    for (let k = 2; k <= ku; k += 1) {
      const m = n + k;
      // composite and lpf(m) > k^2
      if (spf[m] !== m && spf[m] > k * k) {
        ok = true;
        kHit = k;
        break;
      }
    }
  }

  hasWitness[n] = ok ? 1 : 0;
  firstWitnessK[n] = kHit;
}

const sortedCheckpoints = [...new Set([...CHECKPOINTS, N_MAX])].sort((a, b) => a - b);
const checkpointRows = [];
let ptr = 0;
let prefGood = 0;
let prefBad = 0;
const firstBad = [];
const lastBadRing = [];

for (let n = 2; n <= N_MAX; n += 1) {
  if (hasWitness[n]) {
    prefGood += 1;
  } else {
    prefBad += 1;
    if (firstBad.length < 100) firstBad.push(n);
    if (lastBadRing.length < 100) lastBadRing.push(n);
    else {
      lastBadRing.shift();
      lastBadRing.push(n);
    }
  }

  while (ptr < sortedCheckpoints.length && sortedCheckpoints[ptr] === n) {
    checkpointRows.push({
      n,
      good_count: prefGood,
      bad_count: prefBad,
      bad_ratio: Number((prefBad / (n - 1)).toFixed(6)),
    });
    ptr += 1;
  }
}

const sampleN = [10, 100, 1000, 10000, 100000, 250000, 500000, 750000, 1000000, N_MAX]
  .filter((n, i, arr) => n <= N_MAX && arr.indexOf(n) === i);
const sampleWitnesses = sampleN.map((n) => ({
  n,
  witness_k: firstWitnessK[n],
  has_witness: firstWitnessK[n] !== -1,
}));

const out = {
  problem: 'EP-681',
  script: path.basename(process.argv[1]),
  method: 'exact_spf_scan_for_exists_composite_n_plus_k_with_lpf_gt_k2',
  n_max: N_MAX,
  k_max_global: K_MAX,
  total_good: prefGood,
  total_bad: prefBad,
  first_bad_n: firstBad,
  last_bad_n: lastBadRing,
  checkpoints: checkpointRows,
  sample_witnesses: sampleWitnesses,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep681_composite_lpf_k2_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, n_max: N_MAX, total_bad: prefBad }, null, 2));
