#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildSet(name, N) {
  if (name === 'squares') {
    const A = [];
    for (let n = 1; n * n <= N; n += 1) A.push(n * n);
    return A;
  }
  if (name === 'primes') {
    const isPrime = new Uint8Array(N + 1);
    isPrime.fill(1);
    isPrime[0] = 0;
    isPrime[1] = 0;
    for (let p = 2; p * p <= N; p += 1) if (isPrime[p]) for (let q = p * p; q <= N; q += p) isPrime[q] = 0;
    const A = [];
    for (let i = 2; i <= N; i += 1) if (isPrime[i]) A.push(i);
    return A;
  }
  if (name === 'random_20pct') {
    const A = [];
    for (let i = 1; i <= N; i += 1) if (Math.random() < 0.2) A.push(i);
    return A;
  }
  if (name === 'random_5pct') {
    const A = [];
    for (let i = 1; i <= N; i += 1) if (Math.random() < 0.05) A.push(i);
    return A;
  }
  if (name === 'powers_of_2') {
    const A = [];
    for (let x = 1; x <= N; x *= 2) A.push(x);
    return A;
  }
  return [];
}

function diffFreq(A, N) {
  const freq = new Int32Array(N + 1);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = 0; j < A.length; j += 1) {
      if (i === j) continue;
      const d = A[i] - A[j];
      if (d > 0 && d <= N) freq[d] += 1;
    }
  }
  return freq;
}

function maxGapOfCovered(freq, threshold) {
  const covered = [];
  for (let d = 1; d < freq.length; d += 1) if (freq[d] >= threshold) covered.push(d);
  if (covered.length === 0) return null;
  let maxGap = covered[0] - 1;
  for (let i = 1; i < covered.length; i += 1) {
    const g = covered[i] - covered[i - 1] - 1;
    if (g > maxGap) maxGap = g;
  }
  const tail = (freq.length - 1) - covered[covered.length - 1];
  if (tail > maxGap) maxGap = tail;
  return { maxGap, coveredCount: covered.length };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep332_difference_set_gap_scan.json');

const N = Number(process.argv[2] || 6000);
const families = ['squares', 'primes', 'powers_of_2', 'random_5pct', 'random_20pct'];
const thresholds = [1, 2, 3, 5, 8, 13];

const rows = [];
for (const fam of families) {
  const A = buildSet(fam, N);
  const f = diffFreq(A, N);
  const rec = { family: fam, N, size_A: A.length, density: A.length / N, thresholds: [] };
  for (const t of thresholds) {
    const g = maxGapOfCovered(f, t);
    rec.thresholds.push({ threshold: t, ...(g || { maxGap: null, coveredCount: 0 }) });
  }
  rows.push(rec);
  process.stderr.write(`${fam}: size=${A.length}\n`);
}

const out = {
  problem: 'EP-332',
  method: 'finite_difference-frequency_gap_proxies_for_various_set_families',
  params: { N, thresholds },
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
