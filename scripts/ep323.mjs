#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1000);
  return out.length ? out : fallback;
}

function parsePairs(value, fallback) {
  const src = value || fallback;
  return src
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [k, m] = s.split(':').map(Number);
      return { k, m };
    })
    .filter(({ k, m }) => Number.isInteger(k) && Number.isInteger(m) && k >= 2 && m >= 1 && m <= k);
}

function parseFloatList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);
  return out.length ? out : fallback;
}

function kthPowers(k, x) {
  const arr = [];
  for (let a = 0; ; a += 1) {
    const v = a ** k;
    if (v > x) break;
    arr.push(v);
  }
  return arr;
}

function countRepresentable(k, m, x) {
  const pw = kthPowers(k, x);
  const mark = new Uint8Array(x + 1);
  const len = pw.length;

  function rec(pos, startIdx, sum) {
    if (pos === m) {
      mark[sum] = 1;
      return;
    }
    for (let i = startIdx; i < len; i += 1) {
      const ns = sum + pw[i];
      if (ns > x) break;
      rec(pos + 1, i, ns);
    }
  }

  rec(0, 0, 0);
  let cnt = 0;
  for (let n = 1; n <= x; n += 1) if (mark[n]) cnt += 1;
  return { count: cnt, basis_size: len };
}

const BASE_X_LIST = parseIntList(
  process.env.X_LIST,
  [5000000, 10000000, 20000000, 30000000, 50000000, 80000000, 120000000, 160000000, 200000000],
);
const PAIRS = parsePairs(process.env.PAIRS, '3:2,3:3,4:2,4:4');
const DILATIONS = parseFloatList(process.env.DILATIONS, [1, 1.15, 1.35, 1.6]);
const X_LIST = [...new Set(BASE_X_LIST.flatMap((x) => DILATIONS.map((d) => Math.floor(x * d))))]
  .filter((x) => x >= 1000)
  .sort((a, b) => a - b);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const { k, m } of PAIRS) {
  for (const x of X_LIST) {
    const t1 = Date.now();
    const r = countRepresentable(k, m, x);
    rows.push({
      k,
      m,
      x,
      representable_count: r.count,
      basis_size: r.basis_size,
      ratio_over_x: Number((r.count / x).toFixed(8)),
      ratio_over_x_m_over_k: Number((r.count / (x ** (m / k))).toFixed(8)),
      runtime_ms: Date.now() - t1,
    });
  }
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-323',
  script: path.basename(process.argv[1]),
  method: 'standalone_exact_enumeration_of_m_term_kth_power_sums_nonnegative',
  params: { BASE_X_LIST, DILATIONS, X_LIST, PAIRS },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
