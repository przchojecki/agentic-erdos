#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2);
  return out.length ? out : fallback;
}

function setBateman(h, limit) {
  const A = [1];
  for (let x = h; x <= limit; x += h) A.push(x);
  return A;
}

function distinctSubsetCoverage(A, Nmax) {
  const can = new Uint8Array(Nmax + 1);
  can[0] = 1;
  for (const a of A) {
    for (let s = Nmax - a; s >= 0; s -= 1) {
      if (can[s]) can[s + a] = 1;
    }
  }
  return can;
}

function unrestrictedMinTerms(A, Nmax) {
  const INF = 1 << 29;
  const dp = new Int32Array(Nmax + 1);
  dp.fill(INF);
  dp[0] = 0;
  for (let n = 1; n <= Nmax; n += 1) {
    let best = INF;
    for (let i = 0; i < A.length; i += 1) {
      const a = A[i];
      if (a > n) break;
      const v = dp[n - a] + 1;
      if (v < best) best = v;
    }
    dp[n] = best;
  }
  return dp;
}

const H_LIST = parseIntList(process.env.H_LIST, [3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20]);
const LIMIT = Number(process.env.LIMIT || 12000);
const NMAX = Number(process.env.NMAX || 600000);
const WINDOW_START = Number(process.env.WINDOW_START || 200000);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const h of H_LIST) {
  const t1 = Date.now();
  const A = setBateman(h, LIMIT);
  const distCan = distinctSubsetCoverage(A, NMAX);
  const minTerms = unrestrictedMinTerms(A, NMAX);

  let coveredDistinct = 0;
  for (let n = 1; n <= NMAX; n += 1) if (distCan[n]) coveredDistinct += 1;

  let residueMissing = null;
  for (let r = 0; r < h; r += 1) {
    let allMissing = true;
    for (let n = r; n <= NMAX; n += h) {
      if (n > 0 && distCan[n]) {
        allMissing = false;
        break;
      }
    }
    if (allMissing) {
      residueMissing = r;
      break;
    }
  }

  let orderProxy = 0;
  let worstN = WINDOW_START;
  for (let n = WINDOW_START; n <= NMAX; n += 1) {
    if (minTerms[n] > orderProxy) {
      orderProxy = minTerms[n];
      worstN = n;
    }
  }

  rows.push({
    h,
    limit: LIMIT,
    NMAX,
    A_size: A.length,
    distinct_coverage_density: Number((coveredDistinct / NMAX).toFixed(8)),
    residue_class_fully_missing_distinct: residueMissing,
    unrestricted_order_proxy_window: orderProxy,
    argmax_unrestricted_terms: worstN,
    runtime_ms: Date.now() - t1,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-338',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_distinct_vs_unrestricted_order_profiles_for_bateman_sets',
  params: { H_LIST, LIMIT, NMAX, WINDOW_START },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
