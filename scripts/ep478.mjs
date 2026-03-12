#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function aPSize(p) {
  let f = 1;
  const seen = new Uint8Array(p);
  for (let k = 1; k < p; k += 1) {
    f = (f * k) % p;
    seen[f] = 1;
  }
  let c = 0;
  for (let i = 0; i < p; i += 1) c += seen[i];
  return c;
}

const SAMPLE = (process.env.SAMPLE || '101,503,1009,5003,10007,20011,50021,100003,200003,500009,1000003').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SMALL_LIMIT = Number(process.env.SMALL_LIMIT || 50000);
const OUT = process.env.OUT || '';

const sampleRows = [];
const target = 1 - 1 / Math.E;
for (const p of SAMPLE) {
  const s = aPSize(p);
  sampleRows.push({
    p,
    size_A_p: s,
    ratio_A_p_over_p: Number((s / p).toPrecision(8)),
    ratio_over_target_1_minus_1_over_e: Number((s / (target * p)).toPrecision(8)),
    deficit_from_p_minus_2: p - 2 - s,
  });
}

const primesSmall = sievePrimes(SMALL_LIMIT);
let countEq = 0;
let minRatio = 1;
let minWitness = null;
for (const p of primesSmall) {
  const s = aPSize(p);
  if (s === p - 2) countEq += 1;
  const r = s / p;
  if (r < minRatio) {
    minRatio = r;
    minWitness = { p, s, ratio: Number(r.toPrecision(8)) };
  }
}

const out = {
  problem: 'EP-478',
  script: path.basename(process.argv[1]),
  method: 'deeper_factorial_residue_set_size_profile_mod_p',
  params: { SAMPLE, SMALL_LIMIT },
  sample_rows: sampleRows,
  primes_scanned_up_to_small_limit: primesSmall.length,
  count_with_A_p_equal_p_minus_2: countEq,
  minimum_ratio_in_small_scan: minWitness,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
