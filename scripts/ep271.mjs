#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function canAddNo3APAsLargest(A, Aset, x) {
  for (const z of A) {
    const y = 2 * z - x;
    if (y >= 0 && y < z && Aset.has(y)) return false;
  }
  return true;
}

function buildAofN(n, terms) {
  const A = [0, n];
  const Aset = new Set(A);
  while (A.length < terms) {
    let x = A[A.length - 1] + 1;
    for (;;) {
      if (canAddNo3APAsLargest(A, Aset, x)) {
        A.push(x);
        Aset.add(x);
        break;
      }
      x += 1;
    }
  }
  return A;
}

function fitExponent(A, kStart) {
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  let cnt = 0;
  for (let k = kStart; k < A.length; k += 1) {
    if (k <= 0 || A[k] <= 0) continue;
    const x = Math.log(k);
    const y = Math.log(A[k]);
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
    cnt += 1;
  }
  const den = cnt * sxx - sx * sx;
  if (cnt < 2 || Math.abs(den) < 1e-12) return null;
  return (cnt * sxy - sx * sy) / den;
}

const alpha = Math.log(3) / Math.log(2);
const deepPasses = 130;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const cur = [];
  for (const n of [1, 2, 3, 4, 5, 7, 10, 13]) {
    const A = buildAofN(n, 520);
    const exp = fitExponent(A, 120);
    const k = A.length - 1;
    cur.push({
      n,
      terms_used: A.length,
      last_index: k,
      last_value: A[k],
      fitted_growth_exponent: exp === null ? null : Number(exp.toFixed(6)),
      ratio_last_over_k_pow_log2_3: Number((A[k] / (k ** alpha)).toPrecision(8)),
      first_15_terms: A.slice(0, 15),
    });
  }
  rows = cur;
}

const out = {
  problem: 'EP-271',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep greedy finite profiles for A(n) no-3AP sequence growth exponents.',
    deep_passes: deepPasses,
    rows,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-271', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
