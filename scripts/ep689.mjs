#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  const out = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
  return out;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function minCoverage(n, primes, residues) {
  const cov = new Uint16Array(n + 1);
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];
    const a = residues[i];
    for (let v = a === 0 ? p : a; v <= n; v += p) cov[v] += 1;
  }
  let mn = 1e9;
  for (let v = 1; v <= n; v += 1) if (cov[v] < mn) mn = cov[v];
  return mn;
}

function maximizeMinCoverage(n, restarts, steps, rng) {
  const primes = sievePrimes(n);
  let bestMin = -1;

  for (let r = 0; r < restarts; r += 1) {
    const residues = primes.map((p) => Math.floor(rng() * p));
    let cur = minCoverage(n, primes, residues);
    if (cur > bestMin) bestMin = cur;

    for (let it = 0; it < steps; it += 1) {
      const i = Math.floor(rng() * primes.length);
      const old = residues[i];
      residues[i] = Math.floor(rng() * primes[i]);
      const nxt = minCoverage(n, primes, residues);
      if (nxt >= cur || rng() < 0.002) {
        cur = nxt;
        if (cur > bestMin) bestMin = cur;
      } else residues[i] = old;
      if (bestMin >= 2) return { bestMin, primes: primes.length };
    }
  }

  return { bestMin, primes: primes.length };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 689);
const rows = [];

for (const [n, restarts, steps] of [
  [120, 28, 1200],
  [180, 24, 1100],
  [260, 20, 1000],
  [360, 16, 900],
  [500, 14, 800],
  [700, 12, 750],
  [1000, 10, 700],
]) {
  const r = maximizeMinCoverage(n, restarts, steps, rng);
  rows.push({
    n,
    primes_up_to_n: r.primes,
    restarts,
    steps_per_restart: steps,
    best_min_cover_count_found: r.bestMin,
    reached_double_cover_everywhere: r.bestMin >= 2,
  });
}

const out = {
  problem: 'EP-689',
  script: path.basename(process.argv[1]),
  method: 'stochastic_optimization_for_minimum_multiplicity_cover_of_1_to_n_by_prime_residue_classes',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
