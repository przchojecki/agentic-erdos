#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 11);
  return out.length ? out : fallback;
}

function randomSet(m, k, rng) {
  const arr = Array.from({ length: m }, (_, i) => i);
  for (let i = m - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr.slice(0, k);
}

function intervalSet(m, k, shift) {
  const out = [];
  for (let i = 0; i < k; i += 1) out.push((shift + i) % m);
  return out;
}

function sumsetSize(m, A, B) {
  const seen = new Uint8Array(m);
  let cnt = 0;
  for (let i = 0; i < A.length; i += 1) {
    const a = A[i];
    for (let j = 0; j < B.length; j += 1) {
      const s = (a + B[j]) % m;
      if (!seen[s]) {
        seen[s] = 1;
        cnt += 1;
      }
    }
  }
  return cnt;
}

const MOD_LIST = parseIntList(process.env.MOD_LIST, [127, 191, 257, 383, 509]);
const TRIALS = Number(process.env.TRIALS || 22000);
const SEED = Number(process.env.SEED || 3352026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const t0 = Date.now();
const rows = [];

for (const m of MOD_LIST) {
  const profiles = [
    { alpha: 0.15, beta: 0.18 },
    { alpha: 0.2, beta: 0.25 },
    { alpha: 0.28, beta: 0.31 },
  ];
  for (const pf of profiles) {
    const aSize = Math.max(2, Math.floor(m * pf.alpha));
    const bSize = Math.max(2, Math.floor(m * pf.beta));
    let bestGapRandom = Infinity;
    let bestGapInterval = Infinity;
    let exactRandomHits = 0;
    let exactIntervalHits = 0;
    const target = Math.min(m, aSize + bSize - 1);

    for (let t = 0; t < TRIALS; t += 1) {
      const Ar = randomSet(m, aSize, rng);
      const Br = randomSet(m, bSize, rng);
      const sr = sumsetSize(m, Ar, Br);
      const gr = sr - target;
      if (gr < bestGapRandom) bestGapRandom = gr;
      if (gr === 0) exactRandomHits += 1;

      const shA = Math.floor(rng() * m);
      const shB = Math.floor(rng() * m);
      const Ai = intervalSet(m, aSize, shA);
      const Bi = intervalSet(m, bSize, shB);
      const si = sumsetSize(m, Ai, Bi);
      const gi = si - target;
      if (gi < bestGapInterval) bestGapInterval = gi;
      if (gi === 0) exactIntervalHits += 1;
    }

    rows.push({
      m,
      alpha: pf.alpha,
      beta: pf.beta,
      a_size: aSize,
      b_size: bSize,
      trials: TRIALS,
      target_min_sumset_size: target,
      best_gap_random: bestGapRandom,
      best_gap_interval: bestGapInterval,
      exact_hit_rate_random: Number((exactRandomHits / TRIALS).toFixed(6)),
      exact_hit_rate_interval: Number((exactIntervalHits / TRIALS).toFixed(6)),
    });
  }
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-335',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_finite_cyclic_sumset_additivity_scan',
  params: { MOD_LIST, TRIALS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
