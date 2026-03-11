#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function isSidon(A) {
  const diffs = new Set();
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i + 1; j < A.length; j += 1) {
      const d = A[j] - A[i];
      if (diffs.has(d)) return false;
      diffs.add(d);
    }
  }
  return true;
}

function avgSqGap(A) {
  const sums = [];
  for (let i = 0; i < A.length; i += 1) for (let j = i; j < A.length; j += 1) sums.push(A[i] + A[j]);
  sums.sort((a, b) => a - b);
  let ss = 0;
  for (let i = 0; i + 1 < sums.length; i += 1) {
    const g = sums[i + 1] - sums[i];
    ss += g * g;
  }
  return ss / sums.length;
}

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomSidon(m, maxA, rng) {
  const A = [1];
  const diffs = new Set();
  while (A.length < m) {
    let placed = false;
    for (let tries = 0; tries < 1200; tries += 1) {
      const x = 2 + Math.floor(rng() * (maxA - 1));
      if (A.includes(x)) continue;
      let ok = true;
      for (const a of A) {
        const d = Math.abs(x - a);
        if (d === 0 || diffs.has(d)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (const a of A) diffs.add(Math.abs(x - a));
      A.push(x);
      A.sort((u, v) => u - v);
      placed = true;
      break;
    }
    if (!placed) return null;
  }
  return A;
}

const M_LIST = (process.env.M_LIST || '12,16,20,24,28,32').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const TRIALS = Number(process.env.TRIALS || 9000);
const SEED = Number(process.env.SEED || 15302026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const m of M_LIST) {
  let best = Infinity;
  let witness = null;
  const maxA = Math.max(80, 2 * m * m);
  for (let t = 0; t < TRIALS; t += 1) {
    const A = randomSidon(m, maxA, rng);
    if (!A || !isSidon(A)) continue;
    const v = avgSqGap(A);
    if (v < best) {
      best = v;
      witness = A;
    }
  }
  rows.push({
    m,
    trials: TRIALS,
    best_avg_sq_gap_found: Number(best.toFixed(6)),
    best_avg_sq_gap_over_m: Number((best / m).toFixed(6)),
    witness_set_prefix: witness ? witness.slice(0, 12) : null,
  });
}

const out = {
  problem: 'EP-153',
  script: path.basename(process.argv[1]),
  method: 'adversarial_sidon_search_for_min_avg_squared_sumset_gap',
  params: { M_LIST, TRIALS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
