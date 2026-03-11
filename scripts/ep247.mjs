#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildBitsFromSeq(L, mode) {
  const bits = new Uint8Array(L + 1); // position i means coefficient of 2^{-i}
  if (mode === 'n2') {
    for (let n = 1; n * n <= L; n += 1) bits[n * n] = 1;
  } else if (mode === 'nlogn') {
    for (let n = 2; ; n += 1) {
      const a = Math.floor(n * Math.log(n));
      if (a > L) break;
      bits[a] = 1;
    }
  } else if (mode === 'nlog2n') {
    for (let n = 2; ; n += 1) {
      const a = Math.floor(n * Math.log(n) * Math.log(n));
      if (a > L) break;
      bits[a] = 1;
    }
  } else if (mode === 'n1p5') {
    for (let n = 1; ; n += 1) {
      const a = Math.floor(n ** 1.5);
      if (a > L) break;
      bits[a] = 1;
    }
  }
  return bits;
}

function periodicityScore(bits, start, period) {
  let mism = 0;
  let cnt = 0;
  for (let i = start; i + period < bits.length; i += 1) {
    cnt += 1;
    if (bits[i] !== bits[i + period]) mism += 1;
  }
  return { mismatches: mism, pairs_checked: cnt, mismatch_ratio: cnt ? mism / cnt : 0 };
}

const L = Number(process.env.L || 120000);
const START = Number(process.env.START || 2000);
const MAX_PERIOD = Number(process.env.MAX_PERIOD || 600);
const MODES = (process.env.MODES || 'n2,n1p5,nlogn,nlog2n').split(',').map((x) => x.trim()).filter(Boolean);
const OUT = process.env.OUT || '';

const rows = [];
for (const mode of MODES) {
  const bits = buildBitsFromSeq(L, mode);
  let ones = 0;
  for (let i = 1; i <= L; i += 1) if (bits[i]) ones += 1;

  let best = null;
  for (let p = 1; p <= MAX_PERIOD; p += 1) {
    const s = periodicityScore(bits, START, p);
    if (!best || s.mismatch_ratio < best.mismatch_ratio) best = { period: p, ...s };
  }
  rows.push({ mode, L, start: START, ones_up_to_L: ones, best_periodicity_fit_up_to_max_period: { ...best, mismatch_ratio: Number(best.mismatch_ratio.toFixed(6)) } });
}

const out = {
  problem: 'EP-247',
  script: path.basename(process.argv[1]),
  method: 'binary_tail_periodicity_stress_for_sparse_exponent_series',
  params: { L, START, MAX_PERIOD, MODES },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
