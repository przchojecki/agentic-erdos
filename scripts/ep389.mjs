#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i]) continue;
    spf[i] = i;
    if (i * i <= n) {
      for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
  }
  return spf;
}

function factorList(x, spf, pIndex) {
  const out = [];
  let n = x;
  while (n > 1) {
    const p = spf[n];
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
      e += 1;
    }
    out.push([pIndex.get(p), e]);
  }
  return out;
}

function applyFactors(diff, factors, scale, negCounter) {
  for (const [idx, e] of factors) {
    const before = diff[idx];
    const after = before + scale * e;
    if (before < 0 && after >= 0) negCounter.count -= 1;
    if (before >= 0 && after < 0) negCounter.count += 1;
    diff[idx] = after;
  }
}

const NMAX = Number(process.env.NMAX || 120);
const KMAX = Number(process.env.KMAX || 12000);
const MILESTONES = (process.env.MILESTONES || '20,40,60,80,100,120').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const limit = NMAX + 2 * KMAX + 5;
const spf = sieveSpf(limit);
const primes = [];
for (let i = 2; i <= limit; i += 1) if (spf[i] === i) primes.push(i);
const pIndex = new Map(primes.map((p, i) => [p, i]));

const factors = Array.from({ length: limit + 1 }, () => []);
for (let n = 2; n <= limit; n += 1) factors[n] = factorList(n, spf, pIndex);

const milestoneSet = new Set(MILESTONES);
const rows = [];
const firstWitnesses = [];
let foundCount = 0;
let unresolvedCount = 0;
let maxWitnessK = 0;
let maxWitnessN = null;

for (let n = 1; n <= NMAX; n += 1) {
  const diff = new Int16Array(primes.length);
  const negCounter = { count: 0 };

  applyFactors(diff, factors[n + 1], +1, negCounter);
  applyFactors(diff, factors[Math.max(1, n)], -1, negCounter);

  let witnessK = null;
  if (negCounter.count === 0) witnessK = 1;

  for (let k = 1; k < KMAX && witnessK === null; k += 1) {
    applyFactors(diff, factors[n + 2 * k], +1, negCounter);
    applyFactors(diff, factors[n + 2 * k + 1], +1, negCounter);
    applyFactors(diff, factors[n + k], -2, negCounter);
    if (negCounter.count === 0) witnessK = k + 1;
  }

  if (witnessK !== null) {
    foundCount += 1;
    if (firstWitnesses.length < 40) firstWitnesses.push({ n, minimal_k_up_to_cap: witnessK });
    if (witnessK > maxWitnessK) {
      maxWitnessK = witnessK;
      maxWitnessN = n;
    }
  } else {
    unresolvedCount += 1;
  }

  if (milestoneSet.has(n)) {
    rows.push({
      n,
      solved_up_to_n_within_cap: foundCount,
      unresolved_up_to_n: unresolvedCount,
      current_max_witness_k: maxWitnessK,
      current_argmax_n: maxWitnessN,
    });
  }
}

const out = {
  problem: 'EP-389',
  script: path.basename(process.argv[1]),
  method: 'incremental_prime_valuation_search_for_minimal_k',
  params: { NMAX, KMAX, MILESTONES },
  found_count: foundCount,
  unresolved_count_within_cap: unresolvedCount,
  first_witnesses: firstWitnesses,
  max_witness_k: maxWitnessK,
  argmax_n: maxWitnessN,
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
