#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep820_Hn_scan.json');

const nMax = Number(process.argv[2] || 140);
const lMax = Number(process.argv[3] || 220);

const rows = [];
let countH3 = 0;

for (let n = 1; n <= nMax; n += 1) {
  const nBig = BigInt(n);
  const vals = new Array(lMax + 1).fill(0n);
  for (let b = 2; b <= lMax; b += 1) {
    vals[b] = BigInt(b) ** nBig - 1n;
  }

  let bestL = null;
  let bestK = null;

  outer: for (let l = 3; l <= lMax; l += 1) {
    for (let k = 2; k < l; k += 1) {
      if (gcdBig(vals[k], vals[l]) === 1n) {
        bestL = l;
        bestK = k;
        break outer;
      }
    }
  }

  const g23 = gcdBig((2n ** nBig) - 1n, (3n ** nBig) - 1n);
  const pair23Coprime = g23 === 1n;
  if (bestL === 3) countH3 += 1;

  rows.push({
    n,
    H_n_within_scan: bestL,
    witness_k: bestK,
    pair_2_3_coprime: pair23Coprime,
    gcd_2n_1_3n_1: g23.toString(),
  });

  if (n % 10 === 0) process.stderr.write(`n=${n}/${nMax}, H3_count=${countH3}\n`);
}

const valid = rows.filter((r) => r.H_n_within_scan != null);
const unresolved = rows.filter((r) => r.H_n_within_scan == null).map((r) => r.n);

const out = {
  problem: 'EP-820',
  method: 'direct_bigint_gcd_search_for_minimal_l',
  params: { nMax, lMax },
  rows,
  summary: {
    resolved_count: valid.length,
    unresolved_n_values: unresolved,
    count_H_n_eq_3_within_range: rows.filter((r) => r.H_n_within_scan === 3).length,
    count_pair_2_3_coprime: rows.filter((r) => r.pair_2_3_coprime).length,
  },
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
