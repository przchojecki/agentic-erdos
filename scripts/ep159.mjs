#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function exUpperC4(N) {
  // KST-type coarse upper bound for ex(N,C4)
  return 0.5 * N * Math.sqrt(N) + 0.5 * N;
}

function edgeLowerIfAlphaLtN(v, n) {
  // Turan lower bound: if alpha(G) < n, then complement has no K_n => e(G^c) <= (1-1/(n-1))v^2/2
  // so e(G) >= v(v-1)/2 - e(G^c)
  const eCompMax = (1 - 1 / (n - 1)) * v * v / 2;
  return v * (v - 1) / 2 - eCompMax;
}

function upperBoundForR(n, maxV = 200000) {
  let best = 1;
  for (let v = 2; v <= maxV; v += 1) {
    const need = edgeLowerIfAlphaLtN(v, n);
    if (need <= exUpperC4(v)) best = v;
    else break;
  }
  return best + 1; // R(C4,K_n) <= best+1 in this coarse model
}

function lowerBoundSpencerLike(n) {
  return n ** 1.5 / (Math.log(Math.max(3, n)) ** 1.5);
}

function upperBoundSzemerediLike(n) {
  return (n * n) / (Math.log(Math.max(3, n)) ** 2);
}

const N_LIST = (process.env.N_LIST || '20,40,80,120,180,260,400').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const MAXV = Number(process.env.MAXV || 120000);
const OUT = process.env.OUT || '';

const rows = [];
for (const n of N_LIST) {
  const lb = lowerBoundSpencerLike(n);
  const ub = upperBoundSzemerediLike(n);
  const ubFinite = upperBoundForR(n, MAXV);
  rows.push({
    n,
    lower_template_n_3_2_over_log_3_2: Number(lb.toFixed(4)),
    upper_template_n2_over_log2: Number(ub.toFixed(4)),
    coarse_finite_upper_bound_via_ex_C4_turan: ubFinite,
    exponent_from_lb_loglog: Number((Math.log(lb) / Math.log(n)).toFixed(4)),
    exponent_from_ub_loglog: Number((Math.log(ub) / Math.log(n)).toFixed(4)),
  });
}

const out = {
  problem: 'EP-159',
  script: path.basename(process.argv[1]),
  method: 'analytic_template_and_finite_bound_profile_for_R_C4_Kn',
  params: { N_LIST, MAXV },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
