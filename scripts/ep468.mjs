#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N = Number(process.env.N || 20000);
const TARGETS = (process.env.TARGETS || '100,200,500,1000,2000,5000,10000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const divisors = Array.from({ length: N + 1 }, () => []);
for (let d = 2; d <= N; d += 1) {
  for (let m = d; m <= N; m += d) divisors[m].push(d);
}
for (let n = 2; n <= N; n += 1) divisors[n].sort((a, b) => a - b);

const minN = new Map();
const noveltyRows = [];

for (let n = 2; n <= N; n += 1) {
  let s = 0;
  let newCnt = 0;
  for (const d of divisors[n]) {
    s += d;
    if (!minN.has(s)) {
      minN.set(s, n);
      newCnt += 1;
    }
  }
  if ([100, 500, 1000, 2000, 5000, 10000, 20000].includes(n)) {
    noveltyRows.push({ n, new_values_added_at_n: newCnt, cumulative_distinct_values: minN.size });
  }
}

const fRows = [];
for (const T of TARGETS) {
  let found = 0;
  for (let v = 1; v <= T; v += 1) if (minN.has(v)) found += 1;
  const missing = T - found;
  const witnesses = [];
  for (let v = 1; v <= T && witnesses.length < 25; v += 1) {
    const n = minN.get(v);
    if (n !== undefined) witnesses.push({ N: v, fN: n, ratio_f_over_N: Number((n / v).toPrecision(8)) });
  }
  fRows.push({ T, represented_count_up_to_T: found, missing_count_up_to_T: missing, represented_density: Number((found / T).toPrecision(8)), sample_witnesses: witnesses });
}

const out = {
  problem: 'EP-468',
  script: path.basename(process.argv[1]),
  method: 'finite_novelty_and_inverse_profile_for_divisor_prefix_sum_sets',
  params: { N, TARGETS },
  novelty_rows: noveltyRows,
  f_profile_rows: fRows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
