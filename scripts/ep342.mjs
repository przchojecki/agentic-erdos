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

function generateUlam12(termsTarget) {
  const A = [1, 2];
  const rep = new Map();
  rep.set(3, 1);
  let x = 3;
  while (A.length < termsTarget) {
    while ((rep.get(x) || 0) !== 1) x += 1;
    const next = x;
    for (let i = 0; i < A.length; i += 1) {
      const s = A[i] + next;
      const c = rep.get(s) || 0;
      if (c < 255) rep.set(s, c + 1);
    }
    A.push(next);
    x = next + 1;
  }
  return A;
}

function periodicityRows(diff, periods, tailLen) {
  const tail = diff.slice(-tailLen);
  const rows = [];
  for (const p of periods) {
    let eq = 0;
    let tot = 0;
    for (let i = p; i < tail.length; i += 1) {
      if (tail[i] === tail[i - p]) eq += 1;
      tot += 1;
    }
    rows.push({ period: p, tail_match_ratio: Number((eq / Math.max(1, tot)).toFixed(6)) });
  }
  return rows;
}

const TERMS = Number(process.env.TERMS || 50000);
const X_LIST = parseIntList(
  process.env.X_LIST,
  [10000, 30000, 100000, 300000, 1000000, 3000000, 7000000, 12000000],
);
const PERIODS = parseIntList(process.env.PERIODS, [2, 4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 60]);
const TAIL_LEN = Number(process.env.TAIL_LEN || 14000);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const A = generateUlam12(TERMS);
const setA = new Set(A);

const rows = [];
let j = 0;
for (const X of X_LIST) {
  while (j < A.length && A[j] <= X) j += 1;
  rows.push({
    X,
    count_terms_le_X: j,
    density: Number((j / X).toFixed(8)),
  });
}

let twinPairs = 0;
for (const x of A) if (setA.has(x + 2)) twinPairs += 1;
const diffs = [];
for (let i = 1; i < A.length; i += 1) diffs.push(A[i] - A[i - 1]);
const periodicity_tail_rows = periodicityRows(diffs, PERIODS, Math.min(TAIL_LEN, diffs.length));

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-342',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_ulam12_generation_and_tail_structure_diagnostics',
  params: { TERMS, X_LIST, PERIODS, TAIL_LEN },
  terms_generated: A.length,
  last_term: A[A.length - 1],
  twin_pair_count_in_prefix: twinPairs,
  density_rows: rows,
  periodicity_tail_rows,
  sample_last_terms: A.slice(-30),
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
