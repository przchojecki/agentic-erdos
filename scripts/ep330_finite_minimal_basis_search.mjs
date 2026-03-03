#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-330 finite surrogate search:
// Find dense A ⊂ [1,N] so that in a target window W=[L,U]:
// - A+A covers a large fraction of W
// - every a in A is indispensable for a positive fraction of W
//   (numbers representable by A but not by A\\{a}).

const N = Number(process.env.N || 320);
const L = Number(process.env.L || N);
const U = Number(process.env.U || 2 * N);
const RESTARTS = Number(process.env.RESTARTS || 30);
const STEPS = Number(process.env.STEPS || 2500);
const INIT_DENSITY = Number(process.env.INIT_DENSITY || 0.24);
const SEED = Number(process.env.SEED || 20260302);
const W_COVER = Number(process.env.W_COVER || 1.8);
const W_MIN_ESSENTIAL = Number(process.env.W_MIN_ESSENTIAL || 2.5);
const W_MEAN_ESSENTIAL = Number(process.env.W_MEAN_ESSENTIAL || 0.0);
const W_DENSITY = Number(process.env.W_DENSITY || 0.4);
const W_ZERO_ESSENTIAL_PENALTY = Number(process.env.W_ZERO_ESSENTIAL_PENALTY || 0.0);

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function randomSubset(n, p, rng) {
  const arr = new Uint8Array(n + 1);
  for (let i = 1; i <= n; i += 1) arr[i] = rng() < p ? 1 : 0;
  // Keep nonempty.
  if (!arr.some((v, i) => i >= 1 && v)) arr[1] = 1;
  return arr;
}

function evalSet(A) {
  const wLen = U - L + 1;
  const inA = [];
  for (let i = 1; i <= N; i += 1) if (A[i]) inA.push(i);
  const sizeA = inA.length;

  const rep = new Int32Array(U + 1);
  for (let i = 0; i < sizeA; i += 1) {
    const a = inA[i];
    for (let j = i; j < sizeA; j += 1) {
      const b = inA[j];
      const s = a + b;
      if (s <= U) {
        if (a === b) rep[s] += 1;
        else rep[s] += 2; // ordered pairs (a,b),(b,a)
      }
    }
  }

  let covered = 0;
  for (let s = L; s <= U; s += 1) if (rep[s] > 0) covered += 1;
  const coverRatio = covered / wLen;

  let minEssential = Number.POSITIVE_INFINITY;
  let meanEssential = 0;
  let zeroEssentialCount = 0;
  const sampleEssential = [];
  for (let idx = 0; idx < sizeA; idx += 1) {
    const a = inA[idx];
    let essentialCount = 0;
    for (let s = L; s <= U; s += 1) {
      if (rep[s] <= 0) continue;
      let usesA = 0;
      const b = s - a;
      if (b >= 1 && b <= N && A[b]) {
        usesA += b === a ? 1 : 2;
      }
      if (usesA > 0 && rep[s] - usesA <= 0) essentialCount += 1;
    }
    const essentialRatio = essentialCount / wLen;
    if (essentialCount === 0) zeroEssentialCount += 1;
    minEssential = Math.min(minEssential, essentialRatio);
    meanEssential += essentialRatio;
    if (sampleEssential.length < 12) sampleEssential.push({ a, essential_ratio: essentialRatio });
  }
  if (sizeA > 0) meanEssential /= sizeA;
  else {
    minEssential = 0;
    meanEssential = 0;
  }

  const density = sizeA / N;
  const score =
    W_COVER * coverRatio +
    W_MIN_ESSENTIAL * minEssential +
    W_MEAN_ESSENTIAL * meanEssential +
    W_DENSITY * density -
    W_ZERO_ESSENTIAL_PENALTY * zeroEssentialCount;
  return {
    score,
    N,
    window: [L, U],
    sizeA,
    density,
    cover_ratio: coverRatio,
    min_essential_ratio: minEssential,
    mean_essential_ratio: meanEssential,
    zero_essential_count: zeroEssentialCount,
    sample_essential: sampleEssential,
  };
}

function cloneSet(A) {
  const B = new Uint8Array(A.length);
  B.set(A);
  return B;
}

const rng = makeRng(SEED);
let globalBest = null;
let globalBestSet = null;
const history = [];

for (let r = 0; r < RESTARTS; r += 1) {
  let cur = randomSubset(N, INIT_DENSITY, rng);
  let curEval = evalSet(cur);
  let bestLocal = curEval;
  let bestLocalSet = cloneSet(cur);

  for (let step = 0; step < STEPS; step += 1) {
    const i = 1 + Math.floor(rng() * N);
    const cand = cloneSet(cur);
    cand[i] = cand[i] ? 0 : 1;
    const candEval = evalSet(cand);
    const temp = 0.015 + 0.035 * (1 - step / Math.max(1, STEPS - 1));
    const accept =
      candEval.score >= curEval.score || rng() < Math.exp((candEval.score - curEval.score) / temp);
    if (accept) {
      cur = cand;
      curEval = candEval;
    }
    if (curEval.score > bestLocal.score) {
      bestLocal = curEval;
      bestLocalSet = cloneSet(cur);
    }
  }

  history.push({
    restart: r + 1,
    best_score: bestLocal.score,
    sizeA: bestLocal.sizeA,
    density: bestLocal.density,
    cover_ratio: bestLocal.cover_ratio,
    min_essential_ratio: bestLocal.min_essential_ratio,
  });

  if (!globalBest || bestLocal.score > globalBest.score) {
    globalBest = bestLocal;
    globalBestSet = bestLocalSet;
  }
}

const bestElements = [];
for (let i = 1; i <= N; i += 1) if (globalBestSet[i]) bestElements.push(i);

const out = {
  problem: 'EP-330',
  script: path.basename(process.argv[1]),
  method: 'finite_window_hillclimb_for_dense_basis_like_sets_with_elementwise_essentiality',
  params: {
    N,
    window: [L, U],
    restarts: RESTARTS,
    steps: STEPS,
    init_density: INIT_DENSITY,
    seed: SEED,
    objective_weights: {
      cover: W_COVER,
      min_essential: W_MIN_ESSENTIAL,
      mean_essential: W_MEAN_ESSENTIAL,
      density: W_DENSITY,
      zero_essential_penalty: W_ZERO_ESSENTIAL_PENALTY,
    },
  },
  best: {
    ...globalBest,
    elements_sample: bestElements.slice(0, 80),
    sizeA: bestElements.length,
  },
  history,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep330_finite_minimal_basis_search.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      best_score: globalBest.score,
      best_density: globalBest.density,
      best_cover_ratio: globalBest.cover_ratio,
      best_min_essential_ratio: globalBest.min_essential_ratio,
      best_sizeA: bestElements.length,
    },
    null,
    2
  )
);
