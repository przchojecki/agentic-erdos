#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function lcmRange(a, b) {
  let out = 1n;
  for (let n = a; n <= b; n += 1) out = lcm(out, BigInt(n));
  return out;
}

function enumerateSums(weights) {
  const n = weights.length;
  const total = 1 << n;
  const sums = new Array(total);
  sums[0] = 0n;
  for (let mask = 1; mask < total; mask += 1) {
    const bit = mask & -mask;
    const i = Math.log2(bit) | 0;
    sums[mask] = sums[mask ^ bit] + weights[i];
  }
  return sums;
}

function upperBoundBigInt(sorted, x) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}

function bestSubsetUnderOneForDenoms(denoms) {
  const minD = Math.min(...denoms);
  const maxD = Math.max(...denoms);
  const D = lcmRange(minD, maxD);
  const weights = denoms.map((n) => D / BigInt(n));
  const totalRecipNumerator = weights.reduce((a, b) => a + b, 0n);

  const mid = Math.floor(weights.length / 2);
  const left = weights.slice(0, mid);
  const right = weights.slice(mid);

  const leftSums = enumerateSums(left);
  const rightSums = enumerateSums(right).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  let best = 0n;
  for (const ls of leftSums) {
    if (ls > D) continue;
    const idx = upperBoundBigInt(rightSums, D - ls);
    if (idx < 0) continue;
    const cand = ls + rightSums[idx];
    if (cand > best) best = cand;
  }

  const gap = D - best;
  const relGap = Number(gap) / Number(D);
  return {
    denom_start: minD,
    denom_end: maxD,
    terms_count: denoms.length,
    lcm_D_digits: D.toString().length,
    total_recip_sum: Number(totalRecipNumerator) / Number(D),
    best_sum_le_1: Number(best) / Number(D),
    gap_to_1: relGap,
    gap_times_start2: relGap * minD * minD,
    gap_times_start3: relGap * minD * minD * minD,
  };
}

function parseListInt(value, fallback, minVal = 1) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= minVal)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

const INITIAL_N_LIST = parseListInt(
  process.env.INITIAL_N_LIST,
  [8, 10, 12, 14, 16, 18, 20, 22],
  4,
);
const BLOCK_START_LIST = parseListInt(
  process.env.BLOCK_START_LIST,
  [20, 30, 40, 60, 80, 100, 140, 180, 220],
  2,
);
const BLOCK_LEN = Number(process.env.BLOCK_LEN || 20);
if (!Number.isInteger(BLOCK_LEN) || BLOCK_LEN < 4 || BLOCK_LEN > 26) {
  throw new Error('BLOCK_LEN must be integer in [4,26]');
}
const OUT = process.env.OUT || '';

const t0 = Date.now();
const initial_segment_rows = INITIAL_N_LIST.map((nMax) => {
  const denoms = [];
  for (let n = 2; n <= nMax; n += 1) denoms.push(n);
  return {
    model: 'initial_segment_from_2',
    ...bestSubsetUnderOneForDenoms(denoms),
  };
});
const shifted_block_rows = BLOCK_START_LIST.map((start) => {
  const denoms = [];
  for (let n = start; n < start + BLOCK_LEN; n += 1) denoms.push(n);
  return {
    model: 'shifted_consecutive_block',
    block_len: BLOCK_LEN,
    ...bestSubsetUnderOneForDenoms(denoms),
  };
});
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-312',
  script: path.basename(process.argv[1]),
  method: 'exact_meet_in_middle_best_reciprocal_subset_sum_below_one_on_selected_denominator_families',
  params: { INITIAL_N_LIST, BLOCK_START_LIST, BLOCK_LEN },
  initial_segment_rows,
  shifted_block_rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
