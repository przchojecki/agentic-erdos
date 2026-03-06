#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

function generateMianChowla(limitValue) {
  const A = [1];
  const sums = new Set();
  let next = 2;
  while (A[A.length - 1] <= limitValue) {
    let x = next;
    while (true) {
      let ok = true;
      for (let i = 0; i < A.length; i += 1) {
        if (sums.has(A[i] + x)) {
          ok = false;
          break;
        }
      }
      if (ok) break;
      x += 1;
    }
    for (let i = 0; i < A.length; i += 1) sums.add(A[i] + x);
    A.push(x);
    next = x + 1;
  }
  return A;
}

const NMAX = Number(process.env.NMAX || 20000000);
const CHECKPOINTS = parseIntList(
  process.env.CHECKPOINTS,
  [1000, 3000, 10000, 30000, 100000, 300000, 1000000, 3000000, 7000000, 12000000, 20000000],
).filter((x) => x <= NMAX);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const A = generateMianChowla(NMAX);

const rows = [];
let j = 0;
for (const N of CHECKPOINTS) {
  while (j < A.length && A[j] <= N) j += 1;
  const cnt = j;
  rows.push({
    N,
    count_A_le_N: cnt,
    count_over_sqrtN: Number((cnt / Math.sqrt(N)).toFixed(8)),
    count_over_Npow_045: Number((cnt / (N ** 0.45)).toFixed(8)),
    count_over_Npow_049: Number((cnt / (N ** 0.49)).toFixed(8)),
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-340',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_direct_generation_of_mian_chowla_greedy_sidon_sequence',
  params: { NMAX, CHECKPOINTS },
  generated_terms: A.length,
  last_term: A[A.length - 1],
  first_terms: A.slice(0, 50),
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
