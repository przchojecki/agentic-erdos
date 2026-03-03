#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-203 finite counterexample-oriented scan:
// Search m (gcd(m,6)=1) such that all tested values 2^k 3^l m + 1 are composite
// on a finite exponent box 0<=k<=KMAX, 0<=l<=LMAX.

const MMAX = Number(process.env.MMAX || 20000);
const KMAX = Number(process.env.KMAX || 8);
const LMAX = Number(process.env.LMAX || 6);

if (!Number.isInteger(MMAX) || MMAX < 10) throw new Error('MMAX must be integer >=10');
if (!Number.isInteger(KMAX) || KMAX < 0) throw new Error('KMAX must be integer >=0');
if (!Number.isInteger(LMAX) || LMAX < 0) throw new Error('LMAX must be integer >=0');

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  if (limit >= 2) isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let x = 2; x <= limit; x += 1) if (isPrime[x]) primes.push(x);
  return primes;
}

const maxVal = MMAX * (2 ** KMAX) * (3 ** LMAX) + 1;
const primes = sieve(Math.floor(Math.sqrt(maxVal)) + 5);

function isPrime32(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  if (n % 3 === 0) return n === 3;
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];
    if (p * p > n) break;
    if (n % p === 0) return n === p;
  }
  return true;
}

const pow2 = Array.from({ length: KMAX + 1 }, (_, k) => 2 ** k);
const pow3 = Array.from({ length: LMAX + 1 }, (_, l) => 3 ** l);

let testedM = 0;
const survivors = [];
const nearMisses = []; // minimal (k,l) prime witness for failed m

for (let m = 1; m <= MMAX; m += 1) {
  if (m % 2 === 0 || m % 3 === 0) continue;
  testedM += 1;

  let ok = true;
  let witness = null;
  for (let k = 0; k <= KMAX && ok; k += 1) {
    for (let l = 0; l <= LMAX; l += 1) {
      const n = m * pow2[k] * pow3[l] + 1;
      if (isPrime32(n)) {
        ok = false;
        witness = { k, l, prime: n };
        break;
      }
    }
  }

  if (ok) survivors.push(m);
  else if (nearMisses.length < 40) nearMisses.push({ m, witness });
}

const out = {
  problem: 'EP-203',
  script: path.basename(process.argv[1]),
  method: 'finite_exponent_box_composite_filter_for_2k3l_m_plus_1',
  params: { MMAX, KMAX, LMAX },
  tested_m_coprime_to_6: testedM,
  survivors_count: survivors.length,
  survivors_first_200: survivors.slice(0, 200),
  near_miss_examples: nearMisses,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep203_2k3l_m_plus_1_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      tested_m_coprime_to_6: testedM,
      survivors_count: survivors.length,
      first_survivors: survivors.slice(0, 20),
    },
    null,
    2
  )
);
