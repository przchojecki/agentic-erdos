#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function phiTable(n) {
  const phi = Array.from({ length: n + 1 }, (_, i) => i);
  for (let p = 2; p <= n; p += 1) {
    if (phi[p] !== p) continue;
    for (let m = p; m <= n; m += p) phi[m] -= Math.floor(phi[m] / p);
  }
  return phi;
}

const t0 = Date.now();
const MMAX = 300000;
const phi = phiTable(MMAX);

const minM = new Map();
const maxM = new Map();
for (let m = 1; m <= MMAX; m += 1) {
  const n = phi[m];
  if (!minM.has(n) || m < minM.get(n)) minM.set(n, m);
  if (!maxM.has(n) || m > maxM.get(n)) maxM.set(n, m);
}

const rows = [];
for (const x of [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]) {
  let bestRatio = 0;
  let bestN = -1;
  let bestPair = null;
  for (let n = 1; n <= x; n += 1) {
    if (!minM.has(n) || !maxM.has(n)) continue;
    const mn = minM.get(n);
    const mx = maxM.get(n);
    const r = mx / mn;
    if (r > bestRatio) {
      bestRatio = r;
      bestN = n;
      bestPair = [mn, mx];
    }
  }
  rows.push({
    x,
    best_ratio_maxM_over_minM_up_to_x: Number(bestRatio.toPrecision(10)),
    n_achieving_best_ratio: bestN,
    minM_at_best: bestPair ? bestPair[0] : null,
    maxM_at_best: bestPair ? bestPair[1] : null,
  });
}

const out = {
  problem: 'EP-694',
  script: path.basename(process.argv[1]),
  method: 'totient_preimage_sweep_for_extremal_max_over_min_ratio',
  params: { MMAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
