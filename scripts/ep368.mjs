#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseNumList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);
  return xs.length ? xs : fallback;
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function sieveLargestPrimeFactor(limit) {
  const lpf = new Int32Array(limit + 1);
  for (let p = 2; p <= limit; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let j = p; j <= limit; j += p) lpf[j] = p;
  }
  return lpf;
}

const LIMIT = Number(process.env.LIMIT || 120000000);
const ALPHAS = parseNumList(process.env.ALPHAS, [1.6, 1.8, 2.0, 2.2, 2.5]);
const MILESTONES = parseIntList(
  process.env.MILESTONES,
  [100000, 1000000, 5000000, 10000000, 20000000, 40000000, 60000000, 80000000, 100000000, 120000000],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const lpf = sieveLargestPrimeFactor(LIMIT + 1);

const states = ALPHAS.map((alpha) => ({
  alpha,
  count: 0,
  rows: [],
}));
const mset = new Set(MILESTONES);

let maxFrac = 0;
let argMaxFrac = 2;

for (let n = 2; n <= LIMIT; n += 1) {
  const F = lpf[n] > lpf[n + 1] ? lpf[n] : lpf[n + 1];
  const ln = Math.log(n);
  const frac = F / n;
  if (frac > maxFrac) {
    maxFrac = frac;
    argMaxFrac = n;
  }

  for (const st of states) {
    const threshold = ln ** st.alpha;
    if (F <= threshold) st.count += 1;
    if (mset.has(n)) {
      st.rows.push({
        X: n,
        alpha: st.alpha,
        count_F_le_logn_alpha: st.count,
        proportion_F_le_logn_alpha: Number((st.count / (n - 1)).toPrecision(8)),
      });
    }
  }
}

const rows = states.map((st) => ({
  alpha: st.alpha,
  final_count: st.count,
  final_proportion: Number((st.count / (LIMIT - 1)).toPrecision(8)),
  milestones: st.rows,
}));

const out = {
  problem: 'EP-368',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_scan_lpf_n_nplus1_against_log_powers',
  params: { LIMIT, ALPHAS, MILESTONES },
  max_fraction_F_over_n: Number(maxFrac.toFixed(6)),
  argmax_n_for_fraction: argMaxFrac,
  rows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
