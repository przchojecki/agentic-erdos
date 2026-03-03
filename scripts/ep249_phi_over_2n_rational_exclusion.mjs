#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-249 finite irrationality evidence:
// S = sum_{n>=1} phi(n)/2^n.
// Compute exact partial S_N and rigorous tail bound, then exclude rationals p/q
// with q <= QMAX that can lie in [S_N, S_N + tail].

const N = Number(process.env.N || 120);
const QMAX = Number(process.env.QMAX || 2000000);

if (!Number.isInteger(N) || N < 10) throw new Error('N must be integer >= 10');
if (!Number.isInteger(QMAX) || QMAX < 1) throw new Error('QMAX must be positive integer');

function phiSieve(n) {
  const phi = new Uint32Array(n + 1);
  for (let i = 0; i <= n; i += 1) phi[i] = i;
  for (let p = 2; p <= n; p += 1) {
    if (phi[p] !== p) continue;
    for (let k = p; k <= n; k += p) phi[k] = (phi[k] / p) * (p - 1);
  }
  return phi;
}

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function reduce(num, den) {
  const g = gcd(num, den);
  return [num / g, den / g];
}

const phi = phiSieve(N);
const twoN = 1n << BigInt(N);

// S_N = A / 2^N exactly.
let A = 0n;
for (let n = 1; n <= N; n += 1) {
  A += BigInt(phi[n]) << BigInt(N - n);
}

// Tail bound: sum_{n>N} phi(n)/2^n <= sum_{n>N} n/2^n = (N+2)/2^N.
const tailNum = BigInt(N + 2);
const tailDen = twoN;

// Interval [L, U] with common denominator 2^N:
const Lnum = A;
const Lden = twoN;
const Unum = A + tailNum;
const Uden = twoN;

let firstCandidate = null;
let checked = 0;

for (let q = 1; q <= QMAX; q += 1) {
  const qB = BigInt(q);
  // p_min = ceil(L * q) = ceil(Lnum*q / Lden)
  const t = Lnum * qB;
  const pMin = (t + (Lden - 1n)) / Lden;
  // candidate exists if pMin/q <= U
  if (pMin * Uden <= Unum * qB) {
    firstCandidate = { p: pMin.toString(), q };
    break;
  }
  checked += 1;
}

const [lNumRed, lDenRed] = reduce(Lnum, Lden);
const [uNumRed, uDenRed] = reduce(Unum, Uden);

const out = {
  problem: 'EP-249',
  script: path.basename(process.argv[1]),
  method: 'partial_sum_with_rigorous_tail_and_denominator_scan',
  params: { N, QMAX },
  interval: {
    lower: { num: lNumRed.toString(), den: lDenRed.toString() },
    upper: { num: uNumRed.toString(), den: uDenRed.toString() },
    tail_bound: { num: tailNum.toString(), den: tailDen.toString() },
  },
  checked_denominators: checked,
  candidate_found: firstCandidate != null,
  first_candidate: firstCandidate,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep249_phi_over_2n_rational_exclusion.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      candidate_found: out.candidate_found,
      checked_denominators: out.checked_denominators,
      first_candidate: out.first_candidate,
    },
    null,
    2
  )
);
