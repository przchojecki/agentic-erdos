#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function kthPowers(k, nMaxTerm, limit) {
  const vals = [];
  for (let n = 1; n <= nMaxTerm; n += 1) {
    const v = n ** k;
    if (v > limit) break;
    vals.push(v);
  }
  return vals;
}

function subsetSumCoverageDistinct(values, limit) {
  let bits = new Uint8Array(limit + 1);
  bits[0] = 1;
  for (const v of values) {
    for (let s = limit - v; s >= 0; s -= 1) {
      if (bits[s]) bits[s + v] = 1;
    }
  }
  return bits;
}

function largestMissingAtOrBelow(bits) {
  for (let s = bits.length - 1; s >= 0; s -= 1) if (!bits[s]) return s;
  return -1;
}

const K_LIST = parseIntList(process.env.K_LIST, [2, 3, 4, 5, 6]);
const LIMIT_LIST = parseIntList(process.env.LIMIT_LIST, [2500000, 4000000, 5500000, 7000000, 8500000]);
const N_MAX_TERM = Number(process.env.N_MAX_TERM || 480);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const limit of LIMIT_LIST) {
  for (const k of K_LIST) {
    const t1 = Date.now();
    const vals = kthPowers(k, N_MAX_TERM, limit);
    const bits = subsetSumCoverageDistinct(vals, limit);
    const largestMissing = largestMissingAtOrBelow(bits);
    let tailCoveredRun = 0;
    for (let s = limit; s >= 0; s -= 1) {
      if (!bits[s]) break;
      tailCoveredRun += 1;
    }
    rows.push({
      k,
      limit,
      terms_used: vals.length,
      largest_missing_le_limit: largestMissing,
      tail_consecutive_covered_from_limit: tailCoveredRun,
      runtime_ms: Date.now() - t1,
    });
  }
}

const byLimit = [];
for (const limit of LIMIT_LIST) {
  const part = rows.filter((r) => r.limit === limit);
  const monotonicDrops = [];
  for (let i = 0; i + 1 < part.length; i += 1) {
    if (part[i].largest_missing_le_limit > part[i + 1].largest_missing_le_limit) {
      monotonicDrops.push({ from_k: part[i].k, to_k: part[i + 1].k });
    }
  }
  byLimit.push({ limit, monotonic_drops: monotonicDrops });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-345',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_finite_proxy_scan_for_power_completeness_thresholds',
  params: { K_LIST, LIMIT_LIST, N_MAX_TERM },
  rows,
  monotonic_drop_checks: byLimit,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
