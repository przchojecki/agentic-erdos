#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpfPhi(n) {
  const spf = new Int32Array(n + 1);
  const phi = new Int32Array(n + 1);
  phi[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      phi[i] = i - 1;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
    if (!phi[i]) {
      const p = spf[i];
      const m = Math.floor(i / p);
      phi[i] = m % p === 0 ? phi[m] * p : phi[m] * (p - 1);
    }
  }
  return { spf, phi };
}

function phiByFactorization(x, primes) {
  let n = x;
  let res = x;
  for (const p of primes) {
    if (p * p > n) break;
    if (n % p !== 0) continue;
    while (n % p === 0) n = Math.floor(n / p);
    res = Math.floor((res / p) * (p - 1));
  }
  if (n > 1) res = Math.floor((res / n) * (n - 1));
  return res;
}

const N = Number(process.env.N || 20000);
const RMAX = Number(process.env.RMAX || 8);
const LEN = Number(process.env.LEN || 26);
const CAP = Number(process.env.CAP || 500000000);
const PHI_LIM = Number(process.env.PHI_LIM || 3000000);
const OUT = process.env.OUT || '';

const { spf, phi } = sieveSpfPhi(PHI_LIM);
const primes = [];
for (let i = 2; i <= PHI_LIM; i += 1) if (spf[i] === i) primes.push(i);

const phiCache = new Map();
function phiAny(x) {
  if (x <= PHI_LIM) return phi[x];
  const v = phiCache.get(x);
  if (v !== undefined) return v;
  const w = phiByFactorization(x, primes);
  phiCache.set(x, w);
  return w;
}

function g(x) {
  return x + phiAny(x);
}

function iterG(n, len, cap) {
  const arr = [n];
  let x = n;
  for (let i = 0; i < len; i += 1) {
    x = g(x);
    if (!Number.isFinite(x) || x > cap) return null;
    arr.push(x);
  }
  return arr;
}

const hits = [];
const byR = Array(RMAX + 1).fill(0);
let scanned = 0;

for (let n = 2; n <= N; n += 1) {
  const seq = iterG(n, LEN + RMAX, CAP);
  if (!seq) continue;
  scanned += 1;
  for (let r = 1; r <= RMAX; r += 1) {
    let bestK = null;
    for (let K = 2; K <= 16; K += 1) {
      let ok = true;
      for (let k = K; k <= K + 7; k += 1) {
        if (seq[k + r] !== 2 * seq[k]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        bestK = K;
        break;
      }
    }
    if (bestK !== null) {
      byR[r] += 1;
      if (hits.length < 80) hits.push({ n, r, witness_K: bestK });
    }
  }
}

function verifyKnown(n, r) {
  const seq = iterG(n, 90 + r, 9e15);
  if (!seq) return null;
  for (let k = 4; k <= 80; k += 1) if (seq[k + r] !== 2 * seq[k]) return false;
  return true;
}

const out = {
  problem: 'EP-411',
  script: path.basename(process.argv[1]),
  method: 'window_scan_and_known_case_verification_for_g_iterates',
  params: { N, RMAX, LEN, CAP, PHI_LIM },
  scanned_sequences_within_limits: scanned,
  hit_count_by_r: byR.slice(1).map((count, idx) => ({ r: idx + 1, count })),
  candidate_hits_first_80: hits,
  known_case_checks: [
    { n: 10, r: 2, holds_on_checked_window: verifyKnown(10, 2) },
    { n: 94, r: 2, holds_on_checked_window: verifyKnown(94, 2) },
  ],
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
