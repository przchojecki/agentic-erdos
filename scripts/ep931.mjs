#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function sieveSpf(limit) {
  const spf = new Int32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function distinctPrimeFactors(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

function binarySearchFirstGe(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo < arr.length ? lo : -1;
}

function makeHashPair(p) {
  // Deterministic 32-bit pair from prime value.
  let x = (p ^ 0x9e3779b9) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  let y = (p ^ 0x7f4a7c15) >>> 0;
  y ^= y >>> 15;
  y = Math.imul(y, 0x2c1b3c6d) >>> 0;
  y ^= y >>> 12;
  y = Math.imul(y, 0x297a2d39) >>> 0;
  y ^= y >>> 15;
  return [x >>> 0, y >>> 0];
}

function exactSupportKey(n, k, factors) {
  const s = new Set();
  for (let t = 1; t <= k; t += 1) {
    for (const p of factors[n + t]) s.add(p);
  }
  return [...s].sort((a, b) => a - b).join('.');
}

function buildRollingHashes(NMAX, k, factors, primeHash) {
  const cnt = new Map();
  let h1 = 0;
  let h2 = 0;

  function addPrime(p) {
    const c = cnt.get(p) || 0;
    cnt.set(p, c + 1);
    if (c === 0) {
      const [a, b] = primeHash.get(p);
      h1 ^= a;
      h2 ^= b;
    }
  }
  function delPrime(p) {
    const c = cnt.get(p) || 0;
    if (c <= 1) {
      cnt.delete(p);
      const [a, b] = primeHash.get(p);
      h1 ^= a;
      h2 ^= b;
    } else {
      cnt.set(p, c - 1);
    }
  }

  for (let x = 1; x <= k; x += 1) {
    for (const p of factors[x]) addPrime(p);
  }

  const out = new Array(NMAX + 1);
  for (let n = 0; n <= NMAX; n += 1) {
    out[n] = `${h1 >>> 0}:${h2 >>> 0}`;
    if (n === NMAX) break;
    for (const p of factors[n + 1]) delPrime(p);
    for (const p of factors[n + k + 1]) addPrime(p);
  }
  return out;
}

const NMAX = Number(process.env.NMAX || 1000000);
const K_SMALL = parseIntList(process.env.K_SMALL, [3, 4, 5, 6, 7, 8]);
const K_QUERY = parseIntList(
  process.env.K_QUERY,
  [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const KMAX = Math.max(...K_QUERY, ...K_SMALL);
const LIM = NMAX + KMAX + 5;
const spf = sieveSpf(LIM);

const primeHash = new Map();
for (let p = 2; p <= LIM; p += 1) {
  if (spf[p] === p) primeHash.set(p, makeHashPair(p));
}

const factors = Array.from({ length: LIM + 1 }, () => []);
for (let x = 2; x <= LIM; x += 1) factors[x] = distinctPrimeFactors(x, spf);

const smallIndex = new Map(); // k -> Map(hash -> sorted n-list)
for (const k of K_SMALL) {
  const hashes = buildRollingHashes(NMAX, k, factors, primeHash);
  const m = new Map();
  for (let n = 0; n <= NMAX; n += 1) {
    const key = hashes[n];
    const arr = m.get(key);
    if (arr) arr.push(n);
    else m.set(key, [n]);
  }
  smallIndex.set(k, m);
}

const rows = [];
for (const k1 of K_QUERY) {
  const hashes = buildRollingHashes(NMAX, k1, factors, primeHash);
  let intervalsWithWitness = 0;
  let firstWitness = null;
  let checkedCandidates = 0;
  let collisionsRejected = 0;

  for (let n1 = 0; n1 <= NMAX; n1 += 1) {
    const key = hashes[n1];
    const threshold = n1 + k1;
    let foundForThisN = false;

    for (const k2 of K_SMALL) {
      if (k2 > k1) continue;
      const m = smallIndex.get(k2);
      const arr = m.get(key);
      if (!arr) continue;
      const idx = binarySearchFirstGe(arr, threshold);
      if (idx < 0) continue;
      const n2 = arr[idx];
      checkedCandidates += 1;

      const s1 = exactSupportKey(n1, k1, factors);
      const s2 = exactSupportKey(n2, k2, factors);
      if (s1 !== s2) {
        collisionsRejected += 1;
        continue;
      }
      intervalsWithWitness += 1;
      foundForThisN = true;
      if (!firstWitness) firstWitness = { n1, k1, n2, k2 };
      break;
    }
    if (foundForThisN) continue;
  }

  rows.push({
    k1,
    intervals_tested: NMAX + 1,
    intervals_with_disjoint_match_to_small_k2: intervalsWithWitness,
    first_witness: firstWitness,
    checked_candidates: checkedCandidates,
    hash_collisions_rejected_by_exact_check: collisionsRejected,
  });
}

const knownCounterexampleRecovered = (() => {
  const sA = exactSupportKey(0, 10, factors);
  const sB = exactSupportKey(13, 3, factors);
  return sA === sB;
})();

const out = {
  problem: 'EP-931',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_rolling_prime_support_signature_search_with_exact_collision_check',
  params: { NMAX, K_SMALL, K_QUERY },
  known_alphaproof_counterexample_0_10_vs_13_3_recovered: knownCounterexampleRecovered,
  rows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
