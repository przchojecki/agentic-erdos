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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1000);
  return out.length ? out : fallback;
}

function greedyNaturalSidon(N) {
  const used = new Uint8Array(2 * N + 1);
  const A = [];
  for (let x = 1; x <= N; x += 1) {
    let ok = true;
    for (let i = 0; i < A.length; i += 1) {
      if (used[A[i] + x]) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (let i = 0; i < A.length; i += 1) used[A[i] + x] = 1;
    used[2 * x] = 1;
    A.push(x);
  }
  return A;
}

function randomAffineSidon(N, restarts, seed) {
  const rng = makeRng(seed ^ (N * 1009));
  let best = [];

  for (let r = 0; r < restarts; r += 1) {
    let a = 2 * Math.floor(rng() * Math.floor(N / 2)) + 1;
    while (gcd(a, N) !== 1) {
      a += 2;
      if (a >= N) a = 1;
    }
    const b = Math.floor(rng() * N);

    const used = new Uint8Array(2 * N + 1);
    const A = [];
    for (let i = 0; i < N; i += 1) {
      const x = ((a * i + b) % N) + 1;
      let ok = true;
      for (let j = 0; j < A.length; j += 1) {
        if (used[A[j] + x]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let j = 0; j < A.length; j += 1) used[A[j] + x] = 1;
      used[2 * x] = 1;
      A.push(x);
    }
    if (A.length > best.length) best = [...A].sort((u, v) => u - v);
  }
  return best;
}

const N_LIST = parseIntList(process.env.N_LIST, [120000, 250000, 500000, 800000]);
const RESTARTS = Number(process.env.RESTARTS || 80);
const SEED = Number(process.env.SEED || 3292026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  const t1 = Date.now();
  const det = greedyNaturalSidon(N);
  const rand = randomAffineSidon(N, RESTARTS, SEED);
  rows.push({
    N,
    restarts: RESTARTS,
    deterministic_size: det.length,
    deterministic_ratio_over_sqrtN: Number((det.length / Math.sqrt(N)).toFixed(8)),
    randomized_best_size: rand.length,
    randomized_best_ratio_over_sqrtN: Number((rand.length / Math.sqrt(N)).toFixed(8)),
    randomized_gain: rand.length - det.length,
    randomized_first_20_terms: rand.slice(0, 20),
    runtime_ms: Date.now() - t1,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-329',
  script: path.basename(process.argv[1]),
  method: 'standalone_deterministic_vs_deep_randomized_affine_order_sidon_search',
  params: { N_LIST, RESTARTS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
