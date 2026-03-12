#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sievePrimes(n) {
  const is = new Uint8Array(n + 1);
  is.fill(1, 2);
  const ps = [];
  for (let i = 2; i <= n; i += 1) {
    if (!is[i]) continue;
    ps.push(i);
    if (i * i <= n) for (let j = i * i; j <= n; j += i) is[j] = 0;
  }
  return ps;
}

function greedyMaxHarmonicUnderMultiplicity(N, r, M, primes) {
  const cnt = new Int16Array(M + 1);
  const inA = new Uint8Array(N + 1);
  let hsum = 0;
  const A = [];

  function canAdd(a) {
    for (const p of primes) {
      const m = p * a;
      if (m > M) break;
      if (cnt[m] >= r) return false;
    }
    return true;
  }

  function add(a) {
    inA[a] = 1;
    A.push(a);
    hsum += 1 / a;
    for (const p of primes) {
      const m = p * a;
      if (m > M) break;
      cnt[m] += 1;
    }
  }

  for (let a = 1; a <= N; a += 1) if (canAdd(a)) add(a);

  return {
    N,
    r,
    M,
    size_A: A.length,
    harmonic_sum_A: Number(hsum.toPrecision(10)),
    harmonic_sum_over_logN: Number((hsum / Math.log(N)).toPrecision(10)),
    first_terms: A.slice(0, 30),
  };
}

const t0 = Date.now();
const configs = [
  { N: 2000, r: 1, M_factor: 300 },
  { N: 2000, r: 2, M_factor: 300 },
  { N: 3000, r: 2, M_factor: 250 },
  { N: 3000, r: 3, M_factor: 250 },
  { N: 4000, r: 3, M_factor: 200 },
];

const rows = [];
for (const cfg of configs) {
  const M = cfg.N * cfg.M_factor;
  const primes = sievePrimes(Math.floor(M / 2));
  rows.push(greedyMaxHarmonicUnderMultiplicity(cfg.N, cfg.r, M, primes));
}

const out = {
  problem: 'EP-538',
  script: path.basename(process.argv[1]),
  method: 'greedy_harmonic_maximization_under_truncated_prime_multiple_multiplicity_constraints',
  params: { configs },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
