#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 6);
  return out.length ? out : fallback;
}

function splitOptions(D, N) {
  const present = new Set(D);
  const ops = [];
  for (let i = 0; i < D.length; i += 1) {
    const d = D[i];
    const a = d + 1;
    const b = d * (d + 1);
    if (b > N) continue;
    if (present.has(a) || present.has(b)) continue;
    ops.push([i, d]);
  }
  return ops;
}

function randomSplitConstruction(N, rounds, seed) {
  const rng = makeRng(seed ^ (N * 1009));
  let best = [2, 3, 6];
  const histogram = new Map();

  for (let r = 0; r < rounds; r += 1) {
    const D = [2, 3, 6];
    while (true) {
      const ops = splitOptions(D, N);
      if (!ops.length) break;

      let bestScore = -Infinity;
      const candidates = [];
      for (const [idx, d] of ops) {
        const b = d * (d + 1);
        // Favor creating large denominators while retaining randomized exploration.
        const score = Math.log(b) + 0.2 * rng();
        if (score > bestScore) {
          bestScore = score;
          candidates.length = 0;
          candidates.push([idx, d]);
        } else if (score >= bestScore - 1e-12) {
          candidates.push([idx, d]);
        }
      }

      const [i, d] = candidates[Math.floor(rng() * candidates.length)];
      D.splice(i, 1, d + 1, d * (d + 1));
      D.sort((x, y) => x - y);
    }

    const size = D.length;
    histogram.set(size, (histogram.get(size) || 0) + 1);
    if (size > best.length) best = D;
  }

  const histRows = [...histogram.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([size, count]) => ({ size, count, freq: Number((count / rounds).toFixed(6)) }));

  return { best, histRows };
}

const N_LIST = parseIntList(process.env.N_LIST, [100, 140, 180, 240, 320, 420, 560]);
const ROUNDS = Number(process.env.ROUNDS || 220000);
const SEED = Number(process.env.SEED || 3192026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  const { best, histRows } = randomSplitConstruction(N, ROUNDS, SEED);
  rows.push({
    N,
    rounds: ROUNDS,
    best_B_size_found: best.length,
    implied_A_size_lower_bound: best.length + 1,
    implied_A_over_N: Number(((best.length + 1) / N).toPrecision(6)),
    best_B: best,
    histogram_tail: histRows.slice(-5),
  });
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-319',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_randomized_egyptian_split_search',
  params: { N_LIST, ROUNDS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
