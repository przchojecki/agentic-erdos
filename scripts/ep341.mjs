#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseSeeds(value) {
  if (!value) {
    return [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 2, 4],
      [1, 3, 7],
      [1, 5, 6],
      [2, 5, 9],
      [3, 8, 13],
    ];
  }
  const out = [];
  for (const part of value.split(';')) {
    const arr = part
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((x) => Number.isInteger(x) && x > 0)
      .sort((a, b) => a - b);
    if (arr.length >= 2) out.push([...new Set(arr)]);
  }
  return out;
}

function greedyPairwiseSumAvoiding(seed, termsTarget) {
  const A = [...seed].sort((a, b) => a - b);
  const sumSet = new Set();
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i; j < A.length; j += 1) sumSet.add(A[i] + A[j]);
  }
  let x = A[A.length - 1] + 1;
  while (A.length < termsTarget) {
    if (!sumSet.has(x)) {
      for (let i = 0; i < A.length; i += 1) sumSet.add(A[i] + x);
      sumSet.add(2 * x);
      A.push(x);
    }
    x += 1;
  }
  return A;
}

function findTailPeriod(diff, minTailStart, maxPeriod, verifyRepeats) {
  const n = diff.length;
  for (let p = 1; p <= maxPeriod; p += 1) {
    const start = Math.max(minTailStart, n - verifyRepeats * p);
    if (start + verifyRepeats * p > n) continue;
    let ok = true;
    for (let i = start; i < n - p; i += 1) {
      if (diff[i] !== diff[i + p]) {
        ok = false;
        break;
      }
    }
    if (ok) return { period: p, start };
  }
  return null;
}

const TERMS = Number(process.env.TERMS || 18000);
const MIN_TAIL_START = Number(process.env.MIN_TAIL_START || 8000);
const MAX_PERIOD = Number(process.env.MAX_PERIOD || 800);
const VERIFY_REPEATS = Number(process.env.VERIFY_REPEATS || 12);
const SEEDS = parseSeeds(process.env.SEEDS || '');
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const seed of SEEDS) {
  const t1 = Date.now();
  const A = greedyPairwiseSumAvoiding(seed, TERMS);
  const diff = new Int32Array(A.length - 1);
  for (let i = 0; i + 1 < A.length; i += 1) diff[i] = A[i + 1] - A[i];
  const periodic = findTailPeriod(diff, MIN_TAIL_START, MAX_PERIOD, VERIFY_REPEATS);
  rows.push({
    seed,
    terms: A.length,
    last_term: A[A.length - 1],
    mean_gap_last_2000: Number(
      (() => {
        const s = Math.max(0, diff.length - 2000);
        let sum = 0;
        for (let i = s; i < diff.length; i += 1) sum += diff[i];
        return (sum / (diff.length - s)).toFixed(6);
      })(),
    ),
    tail_period_detected: periodic ? periodic.period : null,
    tail_period_start_index: periodic ? periodic.start : null,
    sample_last_gaps: Array.from(diff.slice(-24)),
    runtime_ms: Date.now() - t1,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-341',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_tail_period_scan_for_greedy_pairwise_sum_avoiding_sequences',
  params: { TERMS, MIN_TAIL_START, MAX_PERIOD, VERIFY_REPEATS, seed_count: SEEDS.length },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
