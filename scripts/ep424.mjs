#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const CAP = Number(process.env.CAP || 200000);
const OUT = process.env.OUT || '';
const MILESTONES = (process.env.MILESTONES || '2000,5000,10000,20000,50000,100000,200000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const seen = new Uint8Array(CAP + 1);
const vals = [2, 3];
seen[2] = 1;
seen[3] = 1;

for (let i = 0; i < vals.length; i += 1) {
  const a = vals[i];
  for (let j = i + 1; j < vals.length; j += 1) {
    const b = vals[j];
    const c = a * b - 1;
    if (c <= CAP && !seen[c]) {
      seen[c] = 1;
      vals.push(c);
    }
  }
}

const pref = new Uint32Array(CAP + 1);
for (let i = 1; i <= CAP; i += 1) pref[i] = pref[i - 1] + seen[i];

const rows = [];
for (const X of MILESTONES) {
  if (X > CAP) continue;
  let c0 = 0, c1 = 0, c2 = 0;
  for (let n = 1; n <= X; n += 1) {
    if (!seen[n]) continue;
    const r = n % 3;
    if (r === 0) c0 += 1;
    else if (r === 1) c1 += 1;
    else c2 += 1;
  }
  rows.push({
    X,
    reached_count_up_to_X: pref[X],
    density: Number((pref[X] / X).toPrecision(8)),
    reached_mod3_counts: { r0: c0, r1: c1, r2: c2 },
  });
}

const out = {
  problem: 'EP-424',
  script: path.basename(process.argv[1]),
  method: 'finite_closure_growth_for_hofstadter_ai_aj_minus_1_sequence',
  params: { CAP, MILESTONES },
  total_reached_up_to_CAP: pref[CAP],
  first_120_values_sorted: vals.slice().sort((a, b) => a - b).slice(0, 120),
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
