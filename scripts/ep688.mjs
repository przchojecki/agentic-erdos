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

function coverageCount(n, primes, residues) {
  const covered = new Uint8Array(n + 1);
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];
    const a = residues[i];
    for (let v = a === 0 ? p : a; v <= n; v += p) covered[v] = 1;
  }
  let c = 0;
  for (let v = 1; v <= n; v += 1) c += covered[v];
  return c;
}

function canFullCover(n, eps, restarts, steps, rng) {
  const lo = Math.floor(Math.pow(n, eps)) + 1;
  const primesAll = sievePrimes(n);
  const primes = primesAll.filter((p) => p >= lo);
  if (primes.length === 0) return { ok: false, coverage: 0, primes: 0 };

  let bestCov = 0;
  for (let r = 0; r < restarts; r += 1) {
    const residues = primes.map((p) => Math.floor(rng() * p));
    let cur = coverageCount(n, primes, residues);
    if (cur > bestCov) bestCov = cur;

    for (let it = 0; it < steps; it += 1) {
      const i = Math.floor(rng() * primes.length);
      const old = residues[i];
      residues[i] = Math.floor(rng() * primes[i]);
      const nxt = coverageCount(n, primes, residues);
      if (nxt >= cur || rng() < 0.002) {
        cur = nxt;
        if (cur > bestCov) bestCov = cur;
      } else residues[i] = old;
      if (cur === n) return { ok: true, coverage: n, primes: primes.length };
    }
  }

  return { ok: bestCov === n, coverage: bestCov, primes: primes.length };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 688);
const rows = [];

for (const n of [200, 300, 500, 800, 1200, 2000, 3200]) {
  let bestEps = null;
  let bestCoverageRatio = 0;
  for (const eps of [0.05, 0.08, 0.12, 0.16, 0.2, 0.25, 0.3, 0.35, 0.4]) {
    const r = canFullCover(n, eps, 22, 700, rng);
    const ratio = r.coverage / n;
    if (ratio > bestCoverageRatio) bestCoverageRatio = ratio;
    if (r.ok) {
      bestEps = eps;
      break;
    }
  }
  rows.push({
    n,
    best_eps_found_for_full_cover_in_grid: bestEps,
    best_coverage_ratio_in_grid: Number(bestCoverageRatio.toPrecision(8)),
    lower_bound_proxy_if_no_full_cover: bestEps === null ? '>0.4 (in tested grid)' : null,
  });
}

const out = {
  problem: 'EP-688',
  script: path.basename(process.argv[1]),
  method: 'stochastic_search_for_covering_1_to_n_using_primes_above_n_power_eps',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
