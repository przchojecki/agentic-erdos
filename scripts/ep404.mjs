#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function vpFactorial(n, p) {
  let s = 0;
  let pp = p;
  while (pp <= n) {
    s += Math.floor(n / pp);
    pp *= p;
  }
  return s;
}

function powInt(base, exp) {
  let v = 1n;
  const b = BigInt(base);
  for (let i = 0; i < exp; i += 1) v *= b;
  return v;
}

function reachableZeroResidue(a, p, K, aMax) {
  const mod = powInt(p, K);
  const residues = new Set();
  residues.add((BigInt(a) <= 1n ? 1n : factorialMods[a]) % mod);

  for (let t = a + 1; t <= aMax; t += 1) {
    const f = factorialMods[t] % mod;
    const cur = Array.from(residues);
    for (const r of cur) residues.add((r + f) % mod);
  }

  return residues.has(0n);
}

const AMAX = Number(process.env.AMAX || 26);
const KMAX = Number(process.env.KMAX || 20);
const CASES = (process.env.CASES || '2:2,2:3,3:2,3:3,4:2').split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
  const [a, p] = s.split(':').map(Number);
  return { a, p };
});
const OUT = process.env.OUT || '';

const factorialMods = Array(AMAX + 1).fill(1n);
for (let n = 2; n <= AMAX; n += 1) factorialMods[n] = factorialMods[n - 1] * BigInt(n);

const rows = [];
for (const { a, p } of CASES) {
  let bestK = 0;
  const hits = [];
  for (let K = 1; K <= KMAX; K += 1) {
    const ok = reachableZeroResidue(a, p, K, AMAX);
    if (ok) {
      bestK = K;
      if (hits.length < 25) hits.push(K);
    }
  }
  rows.push({ a, p, search_amax: AMAX, search_kmax: KMAX, best_k_found: bestK, first_hit_levels: hits });
}

const out = {
  problem: 'EP-404',
  script: path.basename(process.argv[1]),
  method: 'subset_residue_dp_for_p_adic_divisibility_of_factorial_sums',
  params: { AMAX, KMAX, CASES },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
