#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;
  for (let i = 2; i * i <= limit; i += 1) if (isPrime[i]) for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  const p = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) p.push(i);
  return p;
}

function cdfProfile(primes, cGrid) {
  const ratios = [];
  for (let i = 0; i + 1 < primes.length; i += 1) {
    const g = primes[i + 1] - primes[i];
    const n = i + 1;
    const d = Math.log(Math.max(3, n));
    ratios.push(g / d);
  }
  ratios.sort((a, b) => a - b);
  const vals = [];
  let ptr = 0;
  for (const c of cGrid) {
    while (ptr < ratios.length && ratios[ptr] < c) ptr += 1;
    vals.push({ c: Number(c.toFixed(3)), f_c: Number((ptr / ratios.length).toFixed(6)) });
  }
  let maxJump = 0;
  for (let i = 0; i + 1 < vals.length; i += 1) {
    const j = Math.abs(vals[i + 1].f_c - vals[i].f_c);
    if (j > maxJump) maxJump = j;
  }
  return { sample_size: ratios.length, max_adjacent_grid_jump: Number(maxJump.toFixed(6)), values: vals };
}

const LIMITS = (process.env.LIMITS || '200000,500000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const C_MAX = Number(process.env.C_MAX || 6);
const C_STEP = Number(process.env.C_STEP || 0.1);
const OUT = process.env.OUT || '';

const maxLim = Math.max(...LIMITS);
const allPrimes = sieve(maxLim + 100);
const cGrid = [];
for (let c = 0; c <= C_MAX + 1e-12; c += C_STEP) cGrid.push(c);

const rows = [];
for (const lim of LIMITS) {
  const ps = allPrimes.filter((p) => p <= lim);
  const prof = cdfProfile(ps, cGrid);
  rows.push({
    x_limit: lim,
    primes_count: ps.length,
    sample_size: prof.sample_size,
    max_adjacent_grid_jump: prof.max_adjacent_grid_jump,
    cdf_values_sparse: prof.values.filter((_, i) => i % 5 === 0),
  });
}

const out = {
  problem: 'EP-234',
  script: path.basename(process.argv[1]),
  method: 'empirical_distribution_profile_of_normalized_prime_gaps',
  params: { LIMITS, C_MAX, C_STEP },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
