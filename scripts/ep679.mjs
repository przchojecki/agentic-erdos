#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function omegaSieve(n) {
  const omega = new Uint16Array(n + 1);
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p; m <= n; m += p) {
      omega[m] += 1;
      if (m > p) isPrime[m] = 0;
    }
  }
  return omega;
}

function threshold(k) {
  return Math.log(k) / Math.log(Math.log(k));
}

const t0 = Date.now();
const NMAX = 1200000;
const KMIN = 100;
const omega = omegaSieve(NMAX);
const rows = [];

for (const n of [20000, 50000, 100000, 200000, 400000, 800000, 1200000]) {
  let bestGap = -1e9;
  let bestK = -1;

  const scan = new Set();
  for (let t = KMIN; t <= Math.min(25000, n - 1); t += 1) scan.add(t);
  let x = 26000;
  while (x < n) {
    scan.add(Math.floor(x));
    x *= 1.02;
  }

  for (const k of scan) {
    if (k >= n) continue;
    const m = n - k;
    if (m < 2) continue;
    const val = omega[m] - threshold(k);
    if (val > bestGap) {
      bestGap = val;
      bestK = k;
    }
  }

  rows.push({
    n,
    k_min_in_scan: KMIN,
    scanned_k_count: scan.size,
    best_k_found: bestK,
    max_gap_omega_minus_log_over_loglog: Number(bestGap.toPrecision(8)),
    corresponding_omega_n_minus_k: omega[n - bestK],
    threshold_at_best_k: Number(threshold(bestK).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-679',
  script: path.basename(process.argv[1]),
  method: 'large_scale_numerical_stress_test_of_stronger_omega_bound_for_large_k',
  params: { NMAX, KMIN },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
