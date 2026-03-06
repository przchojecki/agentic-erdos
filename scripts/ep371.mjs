#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function sieveLargestPrimeFactor(limit) {
  const lpf = new Int32Array(limit + 1);
  for (let p = 2; p <= limit; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let j = p; j <= limit; j += p) lpf[j] = p;
  }
  return lpf;
}

const LIMIT = Number(process.env.LIMIT || 200000000);
const MILESTONES = parseIntList(
  process.env.MILESTONES,
  [10000000, 20000000, 50000000, 100000000, 150000000, 200000000],
);
const BLOCK = Number(process.env.BLOCK || 1000000);
const SHIFTS = parseIntList(process.env.SHIFTS, Array.from({ length: 100 }, (_, i) => i + 1));
const OUT = process.env.OUT || '';

const t0 = Date.now();
const lpf = sieveLargestPrimeFactor(LIMIT + 1);

const blockRows = [];
const milestoneRows = [];
const mset = new Set(MILESTONES);
const shiftRows = [];
let countShift1 = 0;
let curWin = 0;

for (const shift of SHIFTS) {
  let count = 0;
  for (let n = 1; n <= LIMIT - shift; n += 1) {
    const good = lpf[n] < lpf[n + shift] ? 1 : 0;
    count += good;
    if (shift === 1) {
      countShift1 += good;
      curWin += good;
      if (n % BLOCK === 0) {
        const dens = curWin / BLOCK;
        blockRows.push({
          end: n,
          block_density: Number(dens.toPrecision(8)),
          signed_error_from_half: Number((dens - 0.5).toPrecision(8)),
        });
        curWin = 0;
      }
      if (mset.has(n)) {
        const dens = countShift1 / n;
        milestoneRows.push({
          X: n,
          count: countShift1,
          prefix_density: Number(dens.toPrecision(8)),
          signed_error_from_half: Number((dens - 0.5).toPrecision(8)),
        });
      }
    }
  }
  const denom = LIMIT - shift;
  const dens = count / denom;
  shiftRows.push({
    shift,
    count,
    denominator: denom,
    density: Number(dens.toPrecision(10)),
    signed_error_from_half: Number((dens - 0.5).toPrecision(10)),
  });
}

let minBlock = Infinity;
let maxBlock = -Infinity;
for (const row of blockRows) {
  if (row.block_density < minBlock) minBlock = row.block_density;
  if (row.block_density > maxBlock) maxBlock = row.block_density;
}

const out = {
  problem: 'EP-371',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_density_profile_lpf_n_lt_lpf_nplus1',
  params: { LIMIT, MILESTONES, BLOCK, SHIFTS },
  final_prefix_density_shift1: Number((countShift1 / LIMIT).toPrecision(10)),
  final_signed_error_from_half_shift1: Number(((countShift1 / LIMIT) - 0.5).toPrecision(10)),
  block_density_range: {
    min: Number(minBlock.toPrecision(8)),
    max: Number(maxBlock.toPrecision(8)),
  },
  shift_densities: shiftRows,
  milestones: milestoneRows,
  block_rows: blockRows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
