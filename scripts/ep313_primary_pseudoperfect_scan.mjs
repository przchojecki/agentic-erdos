#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-313 finite scan:
// m is primary pseudoperfect iff m is squarefree and
//   sum_{p|m} (m/p) + 1 = m.

const MMAX = Number(process.env.MMAX || 20000000);
if (!Number.isInteger(MMAX) || MMAX < 2) throw new Error('MMAX must be integer >=2');

const spf = new Uint32Array(MMAX + 1);
const primes = [];
for (let i = 2; i <= MMAX; i += 1) {
  if (spf[i] === 0) {
    spf[i] = i;
    primes.push(i);
  }
  for (let j = 0; j < primes.length; j += 1) {
    const p = primes[j];
    const v = i * p;
    if (v > MMAX) break;
    spf[v] = p;
    if (p === spf[i]) break;
  }
}

function distinctPrimeFactorsOfSquarefree(n) {
  const fac = [];
  let x = n;
  let last = 0;
  while (x > 1) {
    const p = spf[x];
    if (p === last) return null; // repeated factor => not squarefree
    fac.push(p);
    x = Math.floor(x / p);
    last = p;
  }
  return fac;
}

const hits = [];
for (let m = 2; m <= MMAX; m += 1) {
  const fac = distinctPrimeFactorsOfSquarefree(m);
  if (!fac) continue;
  let lhs = 1; // +1 term
  for (const p of fac) lhs += Math.floor(m / p);
  if (lhs === m) hits.push({ m, primes: fac });
}

const out = {
  problem: 'EP-313',
  script: path.basename(process.argv[1]),
  method: 'squarefree_scan_with_primary_pseudoperfect_identity',
  params: { MMAX },
  hits_count: hits.length,
  hits,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep313_primary_pseudoperfect_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      MMAX,
      hits_count: hits.length,
      largest_hit: hits.length ? hits[hits.length - 1].m : null,
    },
    null,
    2
  )
);
