#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-854 constructive witness search:
// For given k and even t, try to construct x such that modulo n_k
// - x and x+t are coprime to n_k
// - every x+s (1<=s<t) is not coprime to n_k
// and (linear, non-wrap) 1 <= x <= n_k-t-1.

const K = Number(process.env.K || 9);
const T = Number(process.env.T || 20);
const FLEX_PRIMES = Number(process.env.FLEX_PRIMES || 7);
const CHOICES_PER_PRIME = Number(process.env.CHOICES_PER_PRIME || 3);

if (!Number.isInteger(K) || K < 1) throw new Error('K must be positive integer');
if (!Number.isInteger(T) || T < 2 || T % 2 !== 0) throw new Error('T must be even integer >=2');

function firstPrimes(k) {
  const out = [];
  let n = 2;
  while (out.length < k) {
    let ok = true;
    for (let d = 2; d * d <= n; d += 1) {
      if (n % d === 0) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(n);
    n += 1;
  }
  return out;
}

function egcd(a, b) {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}

function modInv(a, m) {
  const [g, x] = egcd(a, m);
  if (g !== 1n) throw new Error('inverse does not exist');
  return ((x % m) + m) % m;
}

function crtCombine(a, m, b, p) {
  // x ≡ a (mod m), x ≡ b (mod p), gcd(m,p)=1.
  const inv = modInv(m % p, p);
  const delta = ((b - (a % p)) % p + p) % p;
  const t = (delta * inv) % p;
  const x = a + m * t;
  return [x % (m * p), m * p];
}

function residueMod(x, p) {
  return Number(((x % BigInt(p)) + BigInt(p)) % BigInt(p));
}

function isCoprimeToNk(x, primes) {
  for (const p of primes) if (residueMod(x, p) === 0) return false;
  return true;
}

function verifyGap(x, t, primes, nk) {
  if (x < 1n || x + BigInt(t) > nk - 1n) return false;
  if (!isCoprimeToNk(x, primes)) return false;
  if (!isCoprimeToNk(x + BigInt(t), primes)) return false;
  for (let s = 1; s < t; s += 1) {
    if (isCoprimeToNk(x + BigInt(s), primes)) return false;
  }
  return true;
}

const primes = firstPrimes(K);
let nk = 1n;
for (const p of primes) nk *= BigInt(p);

const half = T / 2;
const neededUsed = half - 1; // even interior points: 2,4,...,T-2
const used = [];
for (const p of primes) if (p > T && used.length < neededUsed) used.push(p);

if (used.length < neededUsed) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        reason: 'not_enough_primes_gt_t',
        k: K,
        t: T,
        primes_gt_t_available: used.length,
        required: neededUsed,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const usedSet = new Set(used);
const remaining = primes.filter((p) => !usedSet.has(p));

// Base assignment:
// used primes q_i: x ≡ -2i (mod q_i), covering odd interior numbers x+2i.
// remaining primes p: x ≠ 0,-t (mod p), pick smallest allowed residue by default.
const assign = new Map(); // prime -> residue
for (let i = 1; i <= neededUsed; i += 1) {
  const e = 2 * i;
  const q = used[i - 1];
  const r = ((-e % q) + q) % q;
  assign.set(q, r);
}

const allowedByPrime = new Map();
for (const p of remaining) {
  const forb0 = 0;
  const forbT = ((-T % p) + p) % p;
  const allowed = [];
  for (let r = 0; r < p; r += 1) {
    if (r === forb0 || r === forbT) continue;
    allowed.push(r);
  }
  if (allowed.length === 0) {
    console.log(JSON.stringify({ ok: false, reason: 'no_allowed_residue', prime: p }, null, 2));
    process.exit(0);
  }
  allowedByPrime.set(p, allowed);
  assign.set(p, allowed[0]);
}

const flex = remaining.slice(0, Math.min(FLEX_PRIMES, remaining.length));

function solveFromAssign(mapAssign) {
  let x = 0n;
  let m = 1n;
  for (const p of primes) {
    const r = mapAssign.get(p);
    const [nx, nm] = crtCombine(x, m, BigInt(r), BigInt(p));
    x = nx;
    m = nm;
  }
  return [x, m];
}

let best = null;
let tested = 0;

function dfsFlex(idx) {
  if (idx === flex.length) {
    tested += 1;
    const [x] = solveFromAssign(assign);
    if (verifyGap(x, T, primes, nk)) {
      best = {
        x: x.toString(),
        x_plus_t: (x + BigInt(T)).toString(),
      };
      return true;
    }
    return false;
  }
  const p = flex[idx];
  const allowed = allowedByPrime.get(p);
  const lim = Math.min(CHOICES_PER_PRIME, allowed.length);
  const old = assign.get(p);
  for (let i = 0; i < lim; i += 1) {
    assign.set(p, allowed[i]);
    if (dfsFlex(idx + 1)) return true;
  }
  assign.set(p, old);
  return false;
}

dfsFlex(0);

const out = {
  problem: 'EP-854',
  script: path.basename(process.argv[1]),
  params: {
    k: K,
    t: T,
    flex_primes: FLEX_PRIMES,
    choices_per_prime: CHOICES_PER_PRIME,
  },
  nk: nk.toString(),
  primes,
  used_primes_for_interior_points: used,
  remaining_primes_count: remaining.length,
  tested_assignments: tested,
  witness_found: best != null,
  witness: best,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', `ep854_construct_witness_k${K}_t${T}.json`);
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, witness_found: out.witness_found, tested_assignments: tested, witness: best }, null, 2));
