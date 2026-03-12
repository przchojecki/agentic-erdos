#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function computeBMask(N, A, Xsets) {
  const banned = new Uint8Array(N + 1);
  for (let idx = 0; idx < A.length; idx += 1) {
    const n = A[idx];
    const X = Xsets[idx];
    for (let m = n + 1; m <= N; m += 1) {
      const r = m % n;
      if (X.has(r)) banned[m] = 1;
    }
  }
  const B = new Uint8Array(N + 1);
  for (let m = 1; m <= N; m += 1) B[m] = banned[m] ? 0 : 1;
  return B;
}

function logDensityRows(B, marks) {
  const rows = [];
  let hsum = 0;
  for (let m = 1; m < B.length; m += 1) {
    if (B[m]) hsum += 1 / m;
    if (marks.has(m)) rows.push({ X: m, harmonic_mass: Number(hsum.toPrecision(10)), normalized_by_logX: Number((hsum / Math.log(m)).toPrecision(10)) });
  }
  return rows;
}

const N = Number(process.env.N || 2000000);
const OUT = process.env.OUT || '';
const marks = new Set([10000,50000,100000,300000,500000,1000000,1500000,2000000]);

const cases = [
  {
    name: 'davenport_erdos_singletons_small_A',
    A: [2,3,4,5,6,7,8,9,10,11,12],
    Xsets: [0,0,0,0,0,0,0,0,0,0,0].map((x) => new Set([x])),
  },
  {
    name: 'two_residue_each_mod',
    A: [6,8,9,10,12,14],
    Xsets: [new Set([0,1]),new Set([0,3]),new Set([0,1]),new Set([0,1]),new Set([0,5]),new Set([0,1])],
  },
  {
    name: 'sparser_large_moduli',
    A: [30,42,66,70,78,102],
    Xsets: [new Set([0]),new Set([0,1]),new Set([0]),new Set([0,1]),new Set([0]),new Set([0,1])],
  },
];

const rows = [];
for (const c of cases) {
  const B = computeBMask(N, c.A, c.Xsets);
  const densRows = logDensityRows(B, marks);
  rows.push({ case: c.name, A: c.A, profile: densRows });
}

const out = {
  problem: 'EP-486',
  script: path.basename(process.argv[1]),
  method: 'finite_log_density_profiles_for_generalized_residue_avoidance_sets',
  params: { N },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
