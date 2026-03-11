#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function cR(r) {
  return (1 / 6) * Math.log(1 / (1 - 1 / (r ** 3)));
}

function expectedBadSubsetsLogUpper(n, r, gamma) {
  const t = (n * (n - 1)) / 6; // STS edge-disjoint triangle count (admissible n)
  const logN = gamma * n;
  const logChooseUpper = n * (1 + logN - Math.log(n)); // log (eN/n)^n upper bound
  const logBad = Math.log(r) + t * Math.log(1 - 1 / (r ** 3));
  return logChooseUpper + logBad;
}

function admissibleN(limit) {
  const out = [];
  for (let n = 3; n <= limit; n += 1) if (n % 6 === 1 || n % 6 === 3) out.push(n);
  return out;
}

const R_LIST = (process.env.R_LIST || '2,3,4,5').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const N_MAX = Number(process.env.N_MAX || 181);
const GAMMA_FACTOR = Number(process.env.GAMMA_FACTOR || 0.85); // gamma = factor * c_r
const OUT = process.env.OUT || '';

const rows = [];
for (const r of R_LIST) {
  const cr = cR(r);
  const gamma = GAMMA_FACTOR * cr;
  let firstNegativeN = null;
  let lastLogE = null;
  for (const n of admissibleN(N_MAX)) {
    const le = expectedBadSubsetsLogUpper(n, r, gamma);
    lastLogE = { n, logE: Number(le.toFixed(6)) };
    if (firstNegativeN === null && le < 0) firstNegativeN = n;
  }
  rows.push({
    r,
    c_r: Number(cr.toPrecision(8)),
    gamma: Number(gamma.toPrecision(8)),
    first_admissible_n_with_logE_lt_0: firstNegativeN,
    last_checked: lastLogE,
    lower_bound_shape: 'R(n;3,r) >= exp(gamma*n) on admissible n once logE<0',
  });
}

const out = {
  problem: 'EP-129',
  script: path.basename(process.argv[1]),
  method: 'sts_random_coloring_first_moment_threshold_profile',
  params: { R_LIST, N_MAX, GAMMA_FACTOR },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
