#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sieve(n) {
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function profile(k, numPrimes, primes) {
  const delta = Array(k + 1).fill(0);
  delta[0] = 1;
  const vals = [];

  for (let i = 0; i < numPrimes; i += 1) {
    const p = primes[i];
    vals.push({ i, p, d: delta[k - 1] / p });

    const nxt = Array(k + 1).fill(0);
    for (let r = 0; r <= k; r += 1) {
      nxt[r] += delta[r] * (1 - 1 / p);
      if (r >= 1) nxt[r] += delta[r - 1] * (1 / p);
    }
    for (let r = 0; r <= k; r += 1) delta[r] = nxt[r];
  }
  return vals;
}

const t0 = Date.now();
const primes = sieve(4000);
const rows = [];

for (const k of [1,2,3,4,5,6,8,10,12,15,20,25,30]) {
  const vals = profile(k, Math.min(300, primes.length), primes);
  let peaks = 0;
  const peakPrimes = [];
  for (let i = 1; i + 1 < vals.length; i += 1) {
    if (vals[i].d > vals[i-1].d && vals[i].d > vals[i+1].d) {
      peaks += 1;
      if (peakPrimes.length < 12) peakPrimes.push(vals[i].p);
    }
  }
  let best = vals[0];
  for (const v of vals) if (v.d > best.d) best = v;

  rows.push({
    k,
    sampled_primes: vals.length,
    argmax_prime_sampled: best.p,
    max_density_sampled: Number(best.d.toPrecision(10)),
    strict_local_maxima_count_sampled: peaks,
    first_local_maxima_primes: peakPrimes,
    appears_unimodal_on_sample: peaks <= 1,
  });
}

const out = {
  problem: 'EP-690',
  script: path.basename(process.argv[1]),
  method: 'deep_density_recursion_profiles_for_kth_smallest_prime_factor_distribution',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
