#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function parseNumList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);
  return xs.length ? xs : fallback;
}

function sieveLargestPrimeFactorAndPrimes(limit) {
  const lpf = new Int32Array(limit + 1);
  const primes = [];
  for (let p = 2; p <= limit; p += 1) {
    if (lpf[p] !== 0) continue;
    primes.push(p);
    for (let j = p; j <= limit; j += p) lpf[j] = p;
  }
  return { lpf, primes };
}

const N_MAX = Number(process.env.N_MAX || 120000000);
const BETA_LIST = parseNumList(
  process.env.BETA_LIST,
  [
    0.6, 0.7, 0.8, 0.9, 1.0,
    1.1, 1.2, 1.3, 1.4, 1.5,
    1.6, 1.7, 1.8, 1.9, 2.0,
    2.1, 2.2, 2.3, 2.4, 2.5,
    2.6, 2.7, 2.8, 2.9, 3.0,
    3.2, 3.4, 3.6, 3.8, 4.0,
  ],
);
const MILESTONES = parseIntList(
  process.env.MILESTONES,
  [1000000, 5000000, 10000000, 20000000, 40000000, 80000000, 120000000],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const { lpf, primes } = sieveLargestPrimeFactorAndPrimes(N_MAX);
const mset = new Set(MILESTONES);

let gapIntervals = 0;
const states = BETA_LIST.map((beta) => ({
  beta,
  gapsWithAtLeast1: 0,
  gapsWithAtLeast2: 0,
  maxCount: 0,
  maxRow: null,
  firstRowsAtLeast2: [],
}));
const milestoneRows = [];

for (let i = 0; i + 1 < primes.length; i += 1) {
  const p = primes[i];
  const q = primes[i + 1];
  const g = q - p;
  if (q > N_MAX) break;

  const cntByBeta = new Array(states.length).fill(0);
  const thrByBeta = states.map((st) => g ** st.beta);
  for (let n = p + 1; n <= q - 1; n += 1) {
    const lp = lpf[n];
    for (let b = 0; b < states.length; b += 1) {
      if (lp < thrByBeta[b]) cntByBeta[b] += 1;
    }
  }

  gapIntervals += 1;
  for (let b = 0; b < states.length; b += 1) {
    const st = states[b];
    const cnt = cntByBeta[b];
    if (cnt >= 1) st.gapsWithAtLeast1 += 1;
    if (cnt >= 2) {
      st.gapsWithAtLeast2 += 1;
      if (st.firstRowsAtLeast2.length < 20) {
        st.firstRowsAtLeast2.push({
          r_index: i + 1,
          p_r: p,
          p_r1: q,
          gap: g,
          qualifying_count: cnt,
        });
      }
    }
    if (cnt > st.maxCount) {
      st.maxCount = cnt;
      st.maxRow = { r_index: i + 1, p_r: p, p_r1: q, gap: g, qualifying_count: cnt };
    }
  }

  if (mset.has(q)) {
    const betaRows = states.map((st) => ({
      beta: st.beta,
      proportion_with_at_least1: Number((st.gapsWithAtLeast1 / gapIntervals).toPrecision(8)),
      proportion_with_at_least2: Number((st.gapsWithAtLeast2 / gapIntervals).toPrecision(8)),
      count_with_at_least2: st.gapsWithAtLeast2,
    }));
    milestoneRows.push({
      X: q,
      intervals_scanned: gapIntervals,
      by_beta: betaRows,
    });
  }
}

const byBeta = states.map((st) => ({
  beta: st.beta,
  gaps_with_at_least1: st.gapsWithAtLeast1,
  gaps_with_at_least2: st.gapsWithAtLeast2,
  proportion_with_at_least1: Number((st.gapsWithAtLeast1 / Math.max(1, gapIntervals)).toPrecision(10)),
  proportion_with_at_least2: Number((st.gapsWithAtLeast2 / Math.max(1, gapIntervals)).toPrecision(10)),
  first_examples_with_at_least2: st.firstRowsAtLeast2,
  max_qualifying_count_row: st.maxRow,
}));

const out = {
  problem: 'EP-932',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_prime_gap_scan_for_gap-smooth_interior_counts',
  params: { N_MAX, BETA_LIST, MILESTONES },
  intervals_scanned: gapIntervals,
  by_beta: byBeta,
  milestone_rows: milestoneRows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
