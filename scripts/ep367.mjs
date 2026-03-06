#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

function sieveSpf(limit) {
  const spf = new Int32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function logB2(n, spf) {
  let x = n;
  let out = 0;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e >= 2) out += (e - 1) * Math.log(p);
  }
  return out;
}

const LIMIT = Number(process.env.LIMIT || 30000000);
const K_LIST = parseIntList(process.env.K_LIST, Array.from({ length: 120 }, (_, i) => i + 1));
const MILESTONES = parseIntList(process.env.MILESTONES, [100000, 1000000, 5000000, 10000000, 20000000, 30000000]);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const kMax = K_LIST[K_LIST.length - 1];
const spf = sieveSpf(LIMIT + kMax + 2);

const logs = new Float64Array(LIMIT + kMax + 2);
for (let n = 1; n <= LIMIT + kMax; n += 1) logs[n] = logB2(n, spf);

const states = K_LIST.map((k) => ({
  k,
  sum: 0,
  best_gap_vs_2logn: -Infinity,
  best_n: -1,
  best_over_logn: -Infinity,
  rows: [],
}));
const mset = new Set(MILESTONES);

for (let n = 1; n <= LIMIT; n += 1) {
  const ln = Math.log(n);
  for (const st of states) {
    const k = st.k;
    st.sum += logs[n + k - 1] - logs[Math.max(1, n - 1)];
    const gap = st.sum - 2 * ln;
    if (gap > st.best_gap_vs_2logn) {
      st.best_gap_vs_2logn = gap;
      st.best_n = n;
    }
    if (n >= 3) {
      const over = st.sum / ln;
      if (over > st.best_over_logn) st.best_over_logn = over;
    }
    if (mset.has(n)) {
      st.rows.push({
        X: n,
        log_product_window: Number(st.sum.toFixed(6)),
        log_product_minus_2logn: Number(gap.toFixed(6)),
        ratio_log_product_over_logn: Number((st.sum / Math.max(1e-9, ln)).toFixed(6)),
      });
    }
  }
}

const rows = states.map((st) => ({
  k: st.k,
  best_gap_vs_2logn: Number(st.best_gap_vs_2logn.toFixed(6)),
  argmax_n_for_gap: st.best_n,
  best_ratio_log_product_over_logn: Number(st.best_over_logn.toFixed(6)),
  milestone_rows: st.rows,
}));

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-367',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_spf_scan_for_window_products_of_squareful_parts',
  params: { LIMIT, K_LIST, MILESTONES },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
