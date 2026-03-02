#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-156 finite heuristic:
// random-order greedy maximal Sidon sets in [1..N], record min/avg sizes.

const N_LIST = (process.env.N_LIST || '200,400,800,1600,3200')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x >= 20);
const TRIALS = Number(process.env.TRIALS || 400);
const SEED0 = Number(process.env.SEED || 1562026);

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function greedyMaximalSidonSize(N, rng) {
  const order = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(order, rng);

  const A = [];
  const sums = new Uint8Array(2 * N + 1);
  for (const x of order) {
    let ok = sums[2 * x] === 0;
    if (ok) {
      for (const a of A) {
        if (sums[a + x]) {
          ok = false;
          break;
        }
      }
    }
    if (!ok) continue;
    sums[2 * x] = 1;
    for (const a of A) sums[a + x] = 1;
    A.push(x);
  }
  return A.length;
}

const rows = [];
for (let idx = 0; idx < N_LIST.length; idx++) {
  const N = N_LIST[idx];
  const rng = makeRng(SEED0 + 7919 * (idx + 1));
  let best = 1e9;
  let worst = -1;
  let sum = 0;
  for (let t = 0; t < TRIALS; t++) {
    const s = greedyMaximalSidonSize(N, rng);
    sum += s;
    if (s < best) best = s;
    if (s > worst) worst = s;
  }
  const avg = sum / TRIALS;
  rows.push({
    N,
    trials: TRIALS,
    min_size_found: best,
    avg_size: Number(avg.toFixed(4)),
    max_size_found: worst,
    min_over_N_cuberoot: Number((best / Math.cbrt(N)).toFixed(6)),
    avg_over_N_cuberoot: Number((avg / Math.cbrt(N)).toFixed(6)),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  n_list: N_LIST,
  trials: TRIALS,
  seed: SEED0,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep156_maximal_sidon_random_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, trials: TRIALS }, null, 2));
