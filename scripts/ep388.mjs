#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function factorials(N) {
  const f = [1n];
  for (let i = 1; i <= N; i += 1) f[i] = f[i - 1] * BigInt(i);
  return f;
}

function blockProd(fact, m, k) {
  return fact[m + k] / fact[m];
}

const MMAX = Number(process.env.MMAX || 160);
const KMAX = Number(process.env.KMAX || 10);
const OUT = process.env.OUT || '';

const fact = factorials(MMAX + KMAX + 5);
const blocks = [];
for (let m = 1; m <= MMAX; m += 1) {
  for (let k = 4; k <= KMAX; k += 1) {
    if (m + k > MMAX) continue;
    blocks.push({ m, k, end: m + k, v: blockProd(fact, m, k) });
  }
}

const sols = [];
for (let i = 0; i < blocks.length; i += 1) {
  const A = blocks[i];
  for (let j = i + 1; j < blocks.length; j += 1) {
    const B = blocks[j];
    if (A.end > B.m) continue; // disjoint with required order
    if (A.v === B.v) sols.push({ m1: A.m, k1: A.k, m2: B.m, k2: B.k, value: A.v.toString() });
  }
}

const out = {
  problem: 'EP-388',
  script: path.basename(process.argv[1]),
  method: 'finite_disjoint_consecutive_product_equality_search',
  params: { MMAX, KMAX },
  candidate_block_count: blocks.length,
  solution_count: sols.length,
  solutions_first_50: sols.slice(0, 50),
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
