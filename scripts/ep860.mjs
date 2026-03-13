#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep860_standalone_deeper.json';
const CASES = [
  [30, 3000, 600],
  [50, 3000, 1000],
  [80, 3000, 1600],
  [100, 3000, 2200],
];

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

const primes = sievePrimes(500);

function firstPrimesUpTo(n) {
  return primes.filter((p) => p <= n);
}

function canMatch(primeList, m, h) {
  const r = primeList.length;
  const matchPos = new Int32Array(h + 1);
  matchPos.fill(-1);

  const adj = Array.from({ length: r }, () => []);
  for (let i = 0; i < r; i += 1) {
    const p = primeList[i];
    let j = (p - (m % p)) % p;
    if (j === 0) j = p;
    for (; j <= h; j += p) adj[i].push(j);
    if (adj[i].length === 0) return false;
  }

  function aug(i, seen) {
    for (const pos of adj[i]) {
      if (seen[pos]) continue;
      seen[pos] = 1;
      if (matchPos[pos] === -1 || aug(matchPos[pos], seen)) {
        matchPos[pos] = i;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < r; i += 1) {
    const seen = new Uint8Array(h + 1);
    if (!aug(i, seen)) return false;
  }
  return true;
}

function finiteHn(n, mMax, hCap) {
  const ps = firstPrimesUpTo(n);
  const r = ps.length;
  let worst = 0;
  let argm = 1;

  for (let m = 1; m <= mMax; m += 1) {
    let lo = Math.max(r, 1);
    let hi = lo;
    while (hi <= hCap && !canMatch(ps, m, hi)) hi *= 2;
    if (hi > hCap) {
      worst = Math.max(worst, hCap + 1);
      argm = m;
      continue;
    }
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (canMatch(ps, m, mid)) hi = mid;
      else lo = mid + 1;
    }
    if (lo > worst) {
      worst = lo;
      argm = m;
    }
  }

  return {
    n,
    pi_n: r,
    mMax,
    hCap,
    finite_worst_required_h: worst,
    witness_m: argm,
    finite_ratio_h_over_n: Number((worst / n).toPrecision(8)),
  };
}

const t0 = Date.now();
const rows = CASES.map(([n, mMax, hCap]) => finiteHn(n, mMax, hCap));
const out = {
  problem: 'EP-860',
  script: 'ep860.mjs',
  method: 'deeper_finite_hall_matching_proxy_for_hn',
  warning: 'Finite over m<=mMax and h<=hCap; true h(n) quantifies over all m.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
