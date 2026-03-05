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
    .filter((x) => Number.isInteger(x) && x >= 100);
  return out.length ? out : fallback;
}

function randomSubset(n, p, rng) {
  const arr = new Uint8Array(n + 1);
  let cnt = 0;
  for (let i = 1; i <= n; i += 1) {
    if (rng() < p) {
      arr[i] = 1;
      cnt += 1;
    }
  }
  if (cnt === 0) arr[1] = 1;
  return arr;
}

function cloneSet(A) {
  const B = new Uint8Array(A.length);
  B.set(A);
  return B;
}

function evalSet(A, N, L, U, wCover, wMinEssential, wDensity, wZeroPenalty) {
  const inA = [];
  for (let i = 1; i <= N; i += 1) if (A[i]) inA.push(i);
  const sizeA = inA.length;
  const wLen = U - L + 1;

  const rep = new Int32Array(U + 1);
  for (let i = 0; i < sizeA; i += 1) {
    const a = inA[i];
    for (let j = i; j < sizeA; j += 1) {
      const s = a + inA[j];
      if (s > U) break;
      rep[s] += a === inA[j] ? 1 : 2;
    }
  }

  let covered = 0;
  for (let s = L; s <= U; s += 1) if (rep[s] > 0) covered += 1;
  const coverRatio = covered / wLen;

  let minEssential = Infinity;
  let zeroEssentialCount = 0;
  for (let idx = 0; idx < sizeA; idx += 1) {
    const a = inA[idx];
    let essential = 0;
    for (let s = L; s <= U; s += 1) {
      if (rep[s] <= 0) continue;
      const b = s - a;
      let usesA = 0;
      if (b >= 1 && b <= N && A[b]) usesA += b === a ? 1 : 2;
      if (usesA > 0 && rep[s] - usesA <= 0) essential += 1;
    }
    const essentialRatio = essential / wLen;
    if (essential === 0) zeroEssentialCount += 1;
    if (essentialRatio < minEssential) minEssential = essentialRatio;
  }
  if (sizeA === 0) minEssential = 0;
  const density = sizeA / N;
  const score = wCover * coverRatio + wMinEssential * minEssential + wDensity * density - wZeroPenalty * zeroEssentialCount;
  return {
    score,
    sizeA,
    density,
    cover_ratio: coverRatio,
    min_essential_ratio: Number(minEssential.toFixed(8)),
    zero_essential_count: zeroEssentialCount,
  };
}

function optimizeForN(N, restarts, steps, initDensity, seed) {
  const L = N;
  const U = 2 * N;
  const wCover = 2.0;
  const wMinEssential = 2.8;
  const wDensity = 0.3;
  const wZeroPenalty = 0.01;

  const rng = makeRng(seed ^ (N * 1009));
  let globalBest = null;
  let globalBestSet = null;

  for (let r = 0; r < restarts; r += 1) {
    let cur = randomSubset(N, initDensity, rng);
    let curEval = evalSet(cur, N, L, U, wCover, wMinEssential, wDensity, wZeroPenalty);
    let temp = 0.02;
    for (let step = 0; step < steps; step += 1) {
      const i = 1 + Math.floor(rng() * N);
      const cand = cloneSet(cur);
      cand[i] = cand[i] ? 0 : 1;
      const e = evalSet(cand, N, L, U, wCover, wMinEssential, wDensity, wZeroPenalty);
      const accept = e.score >= curEval.score || rng() < Math.exp((e.score - curEval.score) / Math.max(1e-9, temp));
      if (accept) {
        cur = cand;
        curEval = e;
      }
      temp *= 0.9995;
    }
    if (!globalBest || curEval.score > globalBest.score) {
      globalBest = curEval;
      globalBestSet = cloneSet(cur);
    }
  }

  const sample = [];
  for (let i = 1; i <= N && sample.length < 80; i += 1) if (globalBestSet[i]) sample.push(i);
  return { N, window: [L, U], ...globalBest, elements_sample: sample };
}

const N_LIST = parseIntList(process.env.N_LIST, [520, 700, 900]);
const RESTARTS = Number(process.env.RESTARTS || 28);
const STEPS = Number(process.env.STEPS || 4200);
const INIT_DENSITY = Number(process.env.INIT_DENSITY || 0.18);
const SEED = Number(process.env.SEED || 3302026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) rows.push(optimizeForN(N, RESTARTS, STEPS, INIT_DENSITY, SEED));

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-330',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_hillclimb_for_dense_finite_minimal_basis_surrogate',
  params: { N_LIST, RESTARTS, STEPS, INIT_DENSITY, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
