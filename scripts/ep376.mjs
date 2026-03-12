#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function noCarryDoubleInBase(n, b) {
  let x = n;
  while (x > 0) {
    if ((x % b) * 2 >= b) return false;
    x = Math.floor(x / b);
  }
  return true;
}

const N = Number(process.env.N || 5000000);
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,500000,1000000,2000000,5000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';
const mset = new Set(MILESTONES);

let cnt = 0;
let last = 0;
let maxGap = 0;
const first = [];
const rows = [];

for (let n = 1; n <= N; n += 1) {
  const ok = noCarryDoubleInBase(n, 3) && noCarryDoubleInBase(n, 5) && noCarryDoubleInBase(n, 7);
  if (ok) {
    cnt += 1;
    if (first.length < 50) first.push(n);
    if (last) maxGap = Math.max(maxGap, n - last);
    last = n;
  }
  if (mset.has(n)) {
    rows.push({ X: n, count_up_to_X: cnt, density: Number((cnt / n).toExponential(6)), max_gap_so_far: maxGap });
  }
}

const out = {
  problem: 'EP-376',
  script: path.basename(process.argv[1]),
  method: 'extended_no_carry_digit_criterion_scan_for_coprime_binomial_105',
  params: { N, MILESTONES },
  first_terms: first,
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
