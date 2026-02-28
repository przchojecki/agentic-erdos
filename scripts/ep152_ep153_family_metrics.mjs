#!/usr/bin/env node

// EP-152 / EP-153 construction-family metrics.
//
// Families:
// 1) Ruzsa prime family:
//    A_p = { 2*p*i + (i^2 mod p) : 0 <= i < p }.
// 2) Mian-Chowla greedy Sidon sequence prefixes.
//
// Usage:
//   node scripts/ep152_ep153_family_metrics.mjs
//   node scripts/ep152_ep153_family_metrics.mjs 101 120
//     (maxPrime=101, mianChowlaMaxSize=120)

const maxPrime = Number(process.argv[2] || 101);
const mianChowlaMaxSize = Number(process.argv[3] || 120);

if (!Number.isInteger(maxPrime) || !Number.isInteger(mianChowlaMaxSize) || maxPrime < 3 || mianChowlaMaxSize < 2) {
  console.error('Usage: node scripts/ep152_ep153_family_metrics.mjs [maxPrime>=3] [mianChowlaMaxSize>=2]');
  process.exit(1);
}

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

function sidonDiffCheck(arr) {
  const diffs = new Set();
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const d = arr[j] - arr[i];
      if (diffs.has(d)) return false;
      diffs.add(d);
    }
  }
  return true;
}

function metricsForSet(arr) {
  const m = arr.length;
  const sums = [];
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
  }
  sums.sort((a, b) => a - b);

  const t = sums.length;
  let sumSq = 0;
  for (let i = 0; i < t - 1; i++) {
    const g = sums[i + 1] - sums[i];
    sumSq += g * g;
  }

  let isolated = 0;
  for (let i = 0; i < t; i++) {
    const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
    const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
    if (leftMissing && rightMissing) isolated += 1;
  }

  return {
    m,
    maxA: arr[arr.length - 1],
    t,
    isolated,
    avg_sq_gap: sumSq / t,
    isolated_over_m2: isolated / (m * m),
    avg_sq_gap_over_m: (sumSq / t) / m,
  };
}

function ruzsaSet(p) {
  const out = [];
  for (let i = 0; i < p; i++) out.push(2 * p * i + ((i * i) % p));
  return out;
}

function mianChowlaPrefix(maxSize) {
  const arr = [1, 2];
  const diffs = new Set([1]);
  while (arr.length < maxSize) {
    let x = arr[arr.length - 1] + 1;
    for (;;) {
      let ok = true;
      const pending = [];
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        if (diffs.has(d)) {
          ok = false;
          break;
        }
        pending.push(d);
      }
      if (ok) {
        for (const d of pending) diffs.add(d);
        arr.push(x);
        break;
      }
      x += 1;
    }
  }
  return arr;
}

const ruzsaPrimeFamily = [];
for (let p = 3; p <= maxPrime; p++) {
  if (!isPrime(p)) continue;
  const A = ruzsaSet(p);
  ruzsaPrimeFamily.push({
    p,
    sidon_check: sidonDiffCheck(A),
    ...metricsForSet(A),
  });
}

const mc = mianChowlaPrefix(mianChowlaMaxSize);
const mianChowlaFamily = [];
for (let m = 2; m <= mc.length; m++) {
  const A = mc.slice(0, m);
  mianChowlaFamily.push({
    ...metricsForSet(A),
  });
}

console.log(
  JSON.stringify(
    {
      maxPrime,
      mianChowlaMaxSize,
      ruzsa_prime_family: ruzsaPrimeFamily,
      mian_chowla_prefix_family: mianChowlaFamily,
    },
    null,
    2
  )
);

