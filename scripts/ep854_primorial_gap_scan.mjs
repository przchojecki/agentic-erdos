#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-854 finite verification of residue-gap spectrum for primorial moduli.
// For n_k = product of first k primes, with reduced residues
// 1 = a_1 < ... < a_{phi(n_k)} = n_k - 1,
// analyze gaps g_i = a_{i+1}-a_i.

const KMAX = Number(process.env.KMAX || 8);
const N_LIMIT = Number(process.env.N_LIMIT || 12_000_000);

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

function reducedResiduesMask(n, primeFactors) {
  const isCoprime = new Uint8Array(n);
  isCoprime.fill(1);
  isCoprime[0] = 0;
  for (const p of primeFactors) {
    for (let m = p; m < n; m += p) isCoprime[m] = 0;
  }
  return isCoprime;
}

function analyzeOne(k, n, primeFactors) {
  const isCoprime = reducedResiduesMask(n, primeFactors);
  let phi = 0;
  const gapSet = new Set();
  let maxGap = 0;
  let maxGapCount = 0;
  let firstMaxGapIndex = -1; // 1-based j with a_{j+1}-a_j=maxGap
  let gapCount = 0;
  let prev = -1;

  for (let a = 1; a < n; a += 1) {
    if (!isCoprime[a]) continue;
    phi += 1;
    if (prev !== -1) {
      const g = a - prev;
      gapCount += 1;
      gapSet.add(g);
      if (g > maxGap) {
        maxGap = g;
        maxGapCount = 1;
        firstMaxGapIndex = gapCount;
      } else if (g === maxGap) {
        maxGapCount += 1;
      }
    }
    prev = a;
  }

  // Encourage GC between large k.
  // eslint-disable-next-line no-unused-vars
  let _free = isCoprime;
  _free = null;

  const missingEven = [];
  for (let t = 2; t <= maxGap; t += 2) if (!gapSet.has(t)) missingEven.push(t);
  const representedEvenCount = [...gapSet].filter((g) => g % 2 === 0).length;

  return {
    k,
    n_k: n,
    prime_factors: primeFactors.slice(),
    phi_nk: phi,
    gap_count: gapCount,
    max_gap: maxGap,
    max_gap_occurrences: maxGapCount,
    first_index_with_max_gap: firstMaxGapIndex,
    represented_even_gap_count_up_to_max: representedEvenCount,
    missing_even_gaps_up_to_max: missingEven,
    first_missing_even_gap: missingEven.length ? missingEven[0] : null,
  };
}

const ps = firstPrimes(KMAX);
const rows = [];
let n = 1;
for (let k = 1; k <= KMAX; k += 1) {
  n *= ps[k - 1];
  if (n > N_LIMIT) break;
  const primeFactors = ps.slice(0, k);
  rows.push(analyzeOne(k, n, primeFactors));
}

// Ignore tiny trivial cases (k<3), where gap spectrum is too short.
const firstFailure = rows.find((r) => r.k >= 3 && r.first_missing_even_gap != null);

const out = {
  problem: 'EP-854',
  script: path.basename(process.argv[1]),
  method: 'exact_reduced_residue_gap_spectrum_scan_for_primorials',
  params: { kmax: KMAX, n_limit: N_LIMIT },
  rows,
  first_k_with_missing_even_gap_up_to_max: firstFailure
    ? { k: firstFailure.k, n_k: firstFailure.n_k, first_missing_even_gap: firstFailure.first_missing_even_gap }
    : null,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep854_primorial_gap_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      rows: rows.length,
      first_failure: out.first_k_with_missing_even_gap_up_to_max,
    },
    null,
    2
  )
);
