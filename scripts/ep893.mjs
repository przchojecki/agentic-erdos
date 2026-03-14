#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep893_standalone_deeper.json';
const KMAX = 48;

function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) if (isPrime[p]) {
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

const t0 = Date.now();
const maxM = (1n << BigInt(KMAX)) - 1n;
const sqrtMax = Math.floor(Math.sqrt(Number(maxM)));
const primes = sievePrimes(sqrtMax + 5);

function tauBigByTrial(n0) {
  let n = n0;
  let tau = 1;
  for (const p of primes) {
    const pb = BigInt(p);
    if (pb * pb > n) break;
    let e = 0;
    while (n % pb === 0n) {
      n /= pb;
      e += 1;
    }
    if (e > 0) tau *= (e + 1);
  }
  if (n > 1n) tau *= 2;
  return tau;
}

const tauVals = [];
for (let k = 1; k <= KMAX; k += 1) {
  const m = (1n << BigInt(k)) - 1n;
  tauVals.push(tauBigByTrial(m));
}

const f = [0];
for (let i = 1; i <= KMAX; i += 1) f[i] = f[i - 1] + tauVals[i - 1];

const rows = [];
for (let n = 2; 2 * n <= KMAX; n += 1) {
  rows.push({
    n,
    f_n: f[n],
    f_2n: f[2 * n],
    ratio_f_2n_over_f_n: Number((f[2 * n] / f[n]).toPrecision(9)),
  });
}
let minRatio = 1e9, maxRatio = 0, argMaxN = 0;
for (const r of rows) {
  if (r.ratio_f_2n_over_f_n < minRatio) minRatio = r.ratio_f_2n_over_f_n;
  if (r.ratio_f_2n_over_f_n > maxRatio) {
    maxRatio = r.ratio_f_2n_over_f_n;
    argMaxN = r.n;
  }
}

const out = {
  problem: 'EP-893',
  script: 'ep893.mjs',
  method: 'deeper_exact_prefix_ratio_profile_for_f2n_over_fn',
  params: { KMAX },
  min_ratio_in_tested_range: minRatio,
  max_ratio_in_tested_range: maxRatio,
  argmax_n_for_ratio: argMaxN,
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
