#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-854: rigorous finite disproof artifact for the historical sub-conjecture.
// n_6 = 2*3*5*7*11*13 = 30030.
// Verify by two independent constructions that:
//  - max consecutive reduced-residue gap is 22
//  - gap 20 never appears.

const N = 30030;
const P = [2, 3, 5, 7, 11, 13];

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function residuesByGcd(n) {
  const out = [];
  for (let a = 1; a < n; a += 1) if (gcd(a, n) === 1) out.push(a);
  return out;
}

function residuesByMarking(n, primes) {
  const isCoprime = new Uint8Array(n);
  isCoprime.fill(1);
  isCoprime[0] = 0;
  for (const p of primes) for (let m = p; m < n; m += p) isCoprime[m] = 0;
  const out = [];
  for (let a = 1; a < n; a += 1) if (isCoprime[a]) out.push(a);
  return out;
}

function gapStats(residues) {
  const gaps = [];
  const gapSet = new Set();
  let maxGap = 0;
  for (let i = 0; i + 1 < residues.length; i += 1) {
    const g = residues[i + 1] - residues[i];
    gaps.push(g);
    gapSet.add(g);
    if (g > maxGap) maxGap = g;
  }
  const evenPresent = [];
  const evenMissingUpToMax = [];
  for (let t = 2; t <= maxGap; t += 2) {
    if (gapSet.has(t)) evenPresent.push(t);
    else evenMissingUpToMax.push(t);
  }
  return { maxGap, gapSet, evenPresent, evenMissingUpToMax };
}

const r1 = residuesByGcd(N);
const r2 = residuesByMarking(N, P);

const sameResidues =
  r1.length === r2.length &&
  r1.every((v, i) => v === r2[i]);

const s1 = gapStats(r1);
const s2 = gapStats(r2);

const sameGapSet =
  s1.gapSet.size === s2.gapSet.size &&
  [...s1.gapSet].every((g) => s2.gapSet.has(g));

const result = {
  problem: 'EP-854',
  script: path.basename(process.argv[1]),
  n6: N,
  prime_factors: P,
  checks: {
    residues_equal_between_methods: sameResidues,
    gap_set_equal_between_methods: sameGapSet,
  },
  gcd_method: {
    phi_n6: r1.length,
    max_gap: s1.maxGap,
    even_present_up_to_max: s1.evenPresent,
    even_missing_up_to_max: s1.evenMissingUpToMax,
  },
  marking_method: {
    phi_n6: r2.length,
    max_gap: s2.maxGap,
    even_present_up_to_max: s2.evenPresent,
    even_missing_up_to_max: s2.evenMissingUpToMax,
  },
  historical_subconjecture_all_even_up_to_max: s1.evenMissingUpToMax.length === 0,
  verdict: s1.evenMissingUpToMax.length === 0 ? 'not_disproved' : 'disproved_at_n6',
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep854_k6_dual_check.json');
fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      sameResidues,
      sameGapSet,
      maxGap: s1.maxGap,
      missingEven: s1.evenMissingUpToMax,
      verdict: result.verdict,
    },
    null,
    2
  )
);
