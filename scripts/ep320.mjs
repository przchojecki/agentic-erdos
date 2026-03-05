#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcmBig(a, b) {
  return (a / gcdBig(a, b)) * b;
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

const N_MAX = Number(process.env.N_MAX || 30);
const N_MIN_REPORT = Number(process.env.N_MIN_REPORT || 8);
const SNAPSHOT_N = parseIntList(process.env.SNAPSHOT_N, [20, 24, 28, 30]);
const OUT = process.env.OUT || '';

const t0 = Date.now();
let L = 1n;
let sums = new Set([0n]);
const rows = [];
for (let n = 1; n <= N_MAX; n += 1) {
  const tN0 = Date.now();
  const prevL = L;
  L = lcmBig(L, BigInt(n));
  const scale = L / prevL;
  const w = L / BigInt(n);
  const next = new Set();
  for (const s of sums) {
    const ss = s * scale;
    next.add(ss);
    next.add(ss + w);
  }
  sums = next;
  const runtime_ms = Date.now() - tN0;
  if (n >= N_MIN_REPORT) {
    rows.push({
      N: n,
      S_N: sums.size,
      lcm_digits: L.toString().length,
      log_S_N: Number(Math.log(sums.size).toFixed(8)),
      log_S_over_N_over_logN: Number((Math.log(sums.size) / (n / Math.log(n))).toFixed(6)),
      runtime_ms,
    });
  }
}

const snapshots = rows.filter((r) => SNAPSHOT_N.includes(r.N));

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-320',
  script: path.basename(process.argv[1]),
  method: 'exact_subset_sum_count_over_common_lcm_progressive_dp',
  params: { N_MAX, N_MIN_REPORT, SNAPSHOT_N },
  rows,
  snapshots,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
