#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function popcount32(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}

function maskToSet(mask, n) {
  const out = [];
  for (let i = 0; i < n; i += 1) if ((mask >>> i) & 1) out.push(i + 1);
  return out;
}

function schnirelmannProxy(mask, n) {
  let cnt = 0;
  let inf = 1;
  for (let i = 1; i <= n; i += 1) {
    if ((mask >>> (i - 1)) & 1) cnt += 1;
    const d = cnt / i;
    if (d < inf) inf = d;
  }
  return inf;
}

function gainForB(mask, n, bList) {
  const fullMask = n === 32 ? 0xffffffff : ((1 << n) - 1);
  const base = popcount32(mask);
  let bestGain = -1;
  let bestB = -1;
  for (const b of bList) {
    if (b <= 0 || b >= n) continue;
    const shifted = (mask << b) & fullMask;
    const union = mask | shifted;
    const gain = (popcount32(union) - base) / n;
    if (gain > bestGain) {
      bestGain = gain;
      bestB = b;
    }
  }
  return { bestGain, bestB };
}

function evaluateCandidate(n, alphaMin, bList) {
  const total = 1 << n;
  let worstGain = Infinity;
  let witnessMask = 0;
  let witnessAlpha = 0;
  let witnessB = -1;
  let tested = 0;

  for (let mask = 1; mask < total - 1; mask += 1) {
    const alpha = schnirelmannProxy(mask, n);
    if (alpha < alphaMin || alpha >= 1) continue;
    tested += 1;
    const { bestGain, bestB } = gainForB(mask, n, bList);
    if (bestGain < worstGain) {
      worstGain = bestGain;
      witnessMask = mask;
      witnessAlpha = alpha;
      witnessB = bestB;
    }
  }

  return {
    n,
    alphaMin,
    tested_sets: tested,
    worst_best_gain: Number(worstGain.toFixed(6)),
    witness_alpha: Number(witnessAlpha.toFixed(6)),
    witness_best_shift: witnessB,
    witness_set: maskToSet(witnessMask, n).slice(0, 30),
  };
}

function buildCandidates(n) {
  const all = Array.from({ length: n - 1 }, (_, i) => i + 1);
  return [
    { name: 'all_shifts_1_to_n-1', shifts: all },
    { name: 'even_shifts', shifts: all.filter((b) => b % 2 === 0) },
    { name: 'odd_shifts', shifts: all.filter((b) => b % 2 === 1) },
    { name: 'multiples_of_3', shifts: all.filter((b) => b % 3 === 0) },
    { name: 'powers_of_2', shifts: all.filter((b) => (b & (b - 1)) === 0) },
    { name: 'prime_shifts', shifts: all.filter((b) => {
      if (b < 2) return false;
      for (let d = 2; d * d <= b; d += 1) if (b % d === 0) return false;
      return true;
    }) },
  ];
}

const N = Number(process.env.N || 20);
const ALPHAS = (process.env.ALPHAS || '0.05,0.1,0.15,0.2')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isFinite(x) && x > 0 && x < 1);
const OUT = process.env.OUT || '';

if (N < 3 || N > 24) {
  console.error('N should be in [3,24] for this exhaustive bitmask scan.');
  process.exit(1);
}

const candidates = buildCandidates(N);
const rows = [];
for (const c of candidates) {
  const perAlpha = [];
  for (const alphaMin of ALPHAS) {
    perAlpha.push(evaluateCandidate(N, alphaMin, c.shifts));
  }
  rows.push({
    candidate: c.name,
    shifts_count: c.shifts.length,
    alpha_rows: perAlpha,
  });
}

const out = {
  problem: 'EP-38',
  script: path.basename(process.argv[1]),
  method: 'finite_schnirelmann_increment_proxy_exhaustive',
  params: { N, ALPHAS },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
