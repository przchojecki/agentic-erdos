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

function longestCoveredPrefix(primes, residues, yMax) {
  const covered = new Uint8Array(yMax + 1);
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];
    let a = residues[i] % p;
    if (a < 0) a += p;
    let t = a;
    if (t <= 0) t += Math.ceil((1 - t) / p) * p;
    for (let v = t; v <= yMax; v += p) covered[v] = 1;
  }
  let y = 0;
  for (let v = 1; v <= yMax; v += 1) {
    if (!covered[v]) break;
    y = v;
  }
  return y;
}

function hillclimb(x, restarts, steps, rng) {
  const primes = sievePrimes(x);
  const yMax = 8 * x * x;
  let best = 0;

  for (let r = 0; r < restarts; r += 1) {
    const residues = primes.map((p) => Math.floor(rng() * p));
    let cur = longestCoveredPrefix(primes, residues, yMax);

    for (let it = 0; it < steps; it += 1) {
      const i = Math.floor(rng() * primes.length);
      const old = residues[i];
      residues[i] = Math.floor(rng() * primes[i]);
      const nxt = longestCoveredPrefix(primes, residues, yMax);
      if (nxt >= cur || rng() < 0.0025) cur = nxt;
      else residues[i] = old;
    }

    if (cur > best) best = cur;
  }

  return { best, yMax, numPrimes: primes.length };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 687);
const rows = [];

for (const [x, restarts, steps] of [
  [40, 40, 700],
  [60, 34, 650],
  [80, 28, 600],
  [100, 24, 550],
  [120, 20, 500],
  [160, 16, 450],
  [200, 14, 420],
]) {
  const r = hillclimb(x, restarts, steps, rng);
  rows.push({
    x,
    primes_up_to_x: r.numPrimes,
    y_max_search_cap: r.yMax,
    best_prefix_length_found: r.best,
    best_over_x: Number((r.best / x).toPrecision(8)),
    best_over_x_log_x: Number((r.best / (x * Math.log(x))).toPrecision(8)),
    best_over_x2: Number((r.best / (x * x)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-687',
  script: path.basename(process.argv[1]),
  method: 'deeper_hillclimb_for_jacobsthal_style_prime_residue_covering_prefixes',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
