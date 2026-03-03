#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-1133 finite probe:
// For fixed nodes x_1,...,x_n and random ±1 labels y_i, sample many subsets
// S of size t=floor((1-eps)n). For each S, interpolate exactly on S (degree t-1),
// then estimate sup norm on a dense grid in [-1,1].
// This probes whether many labels admit bounded near-full fits.

const N = Number(process.env.N || 28);
const EPS = Number(process.env.EPS || 0.25);
const T = Math.max(2, Math.floor((1 - EPS) * N));
const Y_SAMPLES = Number(process.env.Y_SAMPLES || 140);
const SUBSET_SAMPLES = Number(process.env.SUBSET_SAMPLES || 140);
const GRID_POINTS = Number(process.env.GRID_POINTS || 1201);
const C_LIST = (process.env.C_LIST || '2,3,5,8')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isFinite(x) && x > 0)
  .sort((a, b) => a - b);
const NODE_TYPES = (process.env.NODE_TYPES || 'chebyshev,equispaced')
  .split(',')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
const SEED = Number(process.env.SEED || 20260302);

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function quantile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const t = idx - lo;
  return sorted[lo] * (1 - t) + sorted[hi] * t;
}

function buildNodes(type, n) {
  const xs = [];
  if (type === 'chebyshev') {
    // first-kind zeros
    for (let i = 1; i <= n; i += 1) {
      xs.push(Math.cos((Math.PI * (2 * i - 1)) / (2 * n)));
    }
  } else if (type === 'equispaced') {
    for (let i = 0; i < n; i += 1) xs.push(-1 + (2 * i) / (n - 1));
  } else {
    throw new Error(`Unknown node type: ${type}`);
  }
  return xs;
}

function randomSubsetIndices(n, t, rng) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, t).sort((a, b) => a - b);
}

function baryWeights(xs) {
  const m = xs.length;
  const w = new Array(m).fill(0);
  for (let i = 0; i < m; i += 1) {
    let denom = 1;
    for (let j = 0; j < m; j += 1) {
      if (i === j) continue;
      denom *= xs[i] - xs[j];
    }
    w[i] = 1 / denom;
  }
  return w;
}

function baryEval(x, xs, ys, ws) {
  const m = xs.length;
  for (let i = 0; i < m; i += 1) {
    if (Math.abs(x - xs[i]) < 1e-14) return ys[i];
  }
  let num = 0;
  let den = 0;
  for (let i = 0; i < m; i += 1) {
    const term = ws[i] / (x - xs[i]);
    num += term * ys[i];
    den += term;
  }
  return num / den;
}

function supNormOnGrid(xs, ys, ws, grid) {
  let mx = 0;
  for (const x of grid) {
    const v = Math.abs(baryEval(x, xs, ys, ws));
    if (v > mx) mx = v;
  }
  return mx;
}

const rng = makeRng(SEED);
const grid = [];
for (let i = 0; i < GRID_POINTS; i += 1) grid.push(-1 + (2 * i) / (GRID_POINTS - 1));

const summaries = [];
for (const nodeType of NODE_TYPES) {
  const xAll = buildNodes(nodeType, N);
  const minSupList = [];

  for (let ysIdx = 0; ysIdx < Y_SAMPLES; ysIdx += 1) {
    const yAll = new Array(N);
    for (let i = 0; i < N; i += 1) yAll[i] = rng() < 0.5 ? -1 : 1;

    let minSup = Number.POSITIVE_INFINITY;
    for (let s = 0; s < SUBSET_SAMPLES; s += 1) {
      const idx = randomSubsetIndices(N, T, rng);
      const xs = idx.map((i) => xAll[i]);
      const ys = idx.map((i) => yAll[i]);
      const ws = baryWeights(xs);
      const sup = supNormOnGrid(xs, ys, ws, grid);
      if (sup < minSup) minSup = sup;
    }
    minSupList.push(minSup);
  }

  minSupList.sort((a, b) => a - b);
  const cStats = C_LIST.map((C) => ({
    C,
    fraction_with_some_sampled_fit_le_C: minSupList.filter((v) => v <= C).length / minSupList.length,
  }));

  summaries.push({
    node_type: nodeType,
    n: N,
    epsilon: EPS,
    t: T,
    y_samples: Y_SAMPLES,
    subset_samples_per_y: SUBSET_SAMPLES,
    grid_points: GRID_POINTS,
    min_sup_stats: {
      mean: minSupList.reduce((a, b) => a + b, 0) / minSupList.length,
      p10: quantile(minSupList, 0.1),
      p50: quantile(minSupList, 0.5),
      p90: quantile(minSupList, 0.9),
      min: minSupList[0],
      max: minSupList[minSupList.length - 1],
    },
    C_stats: cStats,
  });
}

const out = {
  problem: 'EP-1133',
  script: path.basename(process.argv[1]),
  method: 'random_label_subset_interpolation_supnorm_scan',
  params: {
    n: N,
    epsilon: EPS,
    t: T,
    y_samples: Y_SAMPLES,
    subset_samples: SUBSET_SAMPLES,
    grid_points: GRID_POINTS,
    c_list: C_LIST,
    node_types: NODE_TYPES,
    seed: SEED,
  },
  summaries,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1133_subset_fit_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      n: N,
      epsilon: EPS,
      t: T,
      summaries: summaries.map((s) => ({
        node_type: s.node_type,
        min_sup_p50: s.min_sup_stats.p50,
        min_sup_p90: s.min_sup_stats.p90,
      })),
    },
    null,
    2
  )
);
