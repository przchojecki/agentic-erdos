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

const N_MAX = Number(process.env.N_MAX || 200000000);
const EPS_LIST = parseNumList(process.env.EPS_LIST, [0.15, 0.2, 0.25, 0.3, 0.4]);
const K_LIST = parseIntList(process.env.K_LIST, [2, 3, 4, 5, 6, 8, 10]);
const TOP_WINDOW = Number(process.env.TOP_WINDOW || 3000000);
const MILESTONES = parseIntList(
  process.env.MILESTONES,
  [10000000, 20000000, 40000000, 60000000, 80000000, 100000000, 120000000, 150000000, 180000000, 200000000],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const lpf = sieveLargestPrimeFactor(N_MAX);
const mset = new Set(MILESTONES);

const localStates = EPS_LIST.map((eps) => ({
  eps,
  curRun: 0,
  bestRun: 0,
  bestEnd: 1,
}));

const milestoneRows = [];

for (let n = 2; n <= N_MAX; n += 1) {
  const ln = Math.log(n);
  for (const st of localStates) {
    const ok = lpf[n] <= Math.exp(st.eps * ln);
    if (ok) {
      st.curRun += 1;
      if (st.curRun > st.bestRun) {
        st.bestRun = st.curRun;
        st.bestEnd = n;
      }
    } else {
      st.curRun = 0;
    }
  }

  if (mset.has(n)) {
    const topRows = [];
    const start = Math.max(2, n - TOP_WINDOW + 1);
    const lnN = Math.log(n);
    for (const eps of EPS_LIST) {
      const thr = Math.exp(eps * lnN);
      let cur = 0;
      let best = 0;
      for (let m = start; m <= n; m += 1) {
        if (lpf[m] <= thr) {
          cur += 1;
          if (cur > best) best = cur;
        } else {
          cur = 0;
        }
      }
      const meets = {};
      for (const k of K_LIST) meets[`k${k}`] = best >= k;
      topRows.push({
        eps,
        best_run_in_top_window: best,
        ...meets,
      });
    }
    milestoneRows.push({
      N: n,
      top_window_size: n - start + 1,
      top_window_analysis: topRows,
    });
  }
}

const localSummary = localStates.map((st) => ({
  eps: st.eps,
  best_run_length: st.bestRun,
  interval: [st.bestEnd - st.bestRun + 1, st.bestEnd],
}));

const out = {
  problem: 'EP-369',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_corrected_variants_smooth_runs',
  params: { N_MAX, EPS_LIST, K_LIST, TOP_WINDOW, MILESTONES },
  local_m_power_eps_summary: localSummary,
  near_top_N_power_eps_milestones: milestoneRows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
