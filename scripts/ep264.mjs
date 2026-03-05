#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function logA(type, n) {
  if (type === 'pow2pow2') return 2 ** n * Math.log(2);
  if (type === 'pow2n') return n * Math.log(2);
  if (type === 'factorial') {
    let s = 0;
    for (let i = 2; i <= n; i += 1) s += Math.log(i);
    return s;
  }
  if (type === 'exp_exp_0.6') return Math.exp(0.6 * n);
  if (type === 'exp_exp_0.8') return Math.exp(0.8 * n);
  throw new Error(`unknown sequence type ${type}`);
}

function criterionApprox(type, n, tailSpan = 120) {
  if (type === 'pow2n') return 1 / 3;
  const ln = logA(type, n);
  let s = 0;
  for (let k = n + 1; k <= n + tailSpan; k += 1) {
    const tk = 2 * (ln - logA(type, k));
    const term = Math.exp(tk);
    s += term;
  }
  return s;
}

const out = {
  problem: 'EP-264',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
};

const types = ['pow2pow2', 'pow2n', 'factorial', 'exp_exp_0.6', 'exp_exp_0.8'];
const nHeavy = Array.from({ length: 199 }, (_, i) => 4 + 2 * i); // 4..400
const nOut = [4, 8, 12, 20, 40, 80, 120, 160, 200, 280, 360, 400];
const deepPasses = 24;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const full = [];
  for (const type of types) {
    for (const n of nHeavy) {
      const v = criterionApprox(type, n, 1400);
      full.push({
        sequence: type,
        n,
        approx_a_n_sq_times_tail_sum_reciprocal_sq: Number(v.toExponential(6)),
      });
    }
  }
  rows = full.filter((r) => nOut.includes(r.n));
}

out.result = {
  description: 'Deep criterion-profile values a_n^2 * sum_{k>n} 1/a_k^2 for representative sequences.',
  deep_passes: deepPasses,
  rows,
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-264', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
