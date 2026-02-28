#!/usr/bin/env node

// Stronger seeded local-search minimization for EP-152 / EP-153.
//
// For each m, optimize two objectives separately:
// - isolated(A+A)            (EP-152)
// - avg_sq_gap(A+A)          (EP-153)
//
// Seeds include:
// - Mian-Chowla prefix
// - Ruzsa prime constructions (or prefixes)
// - random dense Sidon builds
//
// Usage:
//   node scripts/ep152_ep153_anneal_search.mjs
//   node scripts/ep152_ep153_anneal_search.mjs 11 50 16 3500
//     (mStart=11, mEnd=50, restartsPerObjective=16, iterationsPerRestart=3500)

const mStart = Number(process.argv[2] || 11);
const mEnd = Number(process.argv[3] || 60);
const restartsPerObjective = Number(process.argv[4] || 12);
const iterationsPerRestart = Number(process.argv[5] || 2800);

if (
  !Number.isInteger(mStart) ||
  !Number.isInteger(mEnd) ||
  !Number.isInteger(restartsPerObjective) ||
  !Number.isInteger(iterationsPerRestart) ||
  mStart < 3 ||
  mEnd < mStart ||
  restartsPerObjective < 1 ||
  iterationsPerRestart < 100
) {
  console.error(
    'Usage: node scripts/ep152_ep153_anneal_search.mjs [mStart>=3] [mEnd>=mStart] [restarts>=1] [iterations>=100]'
  );
  process.exit(1);
}

function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

function nextPrime(n) {
  let p = Math.max(2, n);
  while (!isPrime(p)) p += 1;
  return p;
}

function isSidon(arr) {
  const diffs = new Set();
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const d = arr[j] - arr[i];
      if (diffs.has(d)) return false;
      diffs.add(d);
    }
  }
  return true;
}

function metrics(arr) {
  const m = arr.length;
  const sums = [];
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
  }
  sums.sort((a, b) => a - b);

  const t = sums.length;
  let isolated = 0;
  let sumSq = 0;
  let maxRun = 1;
  let run = 1;
  let positiveGapCount = 0;
  let extraGapSum = 0;

  for (let i = 0; i < t; i++) {
    if (i > 0) {
      const g = sums[i] - sums[i - 1];
      sumSq += g * g;
      if (g > 1) {
        positiveGapCount += 1;
        extraGapSum += g - 1;
      }
      if (g === 1) {
        run += 1;
        if (run > maxRun) maxRun = run;
      } else {
        run = 1;
      }
    }
    const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
    const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
    if (leftMissing && rightMissing) isolated += 1;
  }

  return {
    m,
    maxA: arr[m - 1],
    t,
    isolated,
    isolated_over_m2: isolated / (m * m),
    avg_sq_gap: sumSq / t,
    avg_sq_gap_over_m: (sumSq / t) / m,
    max_consecutive_run: maxRun,
    positive_gap_count: positiveGapCount,
    extra_gap_sum: extraGapSum,
  };
}

function objectiveValue(metric, mode) {
  if (mode === 'iso') return metric.isolated + 1e-6 * metric.maxA;
  return metric.avg_sq_gap + 1e-6 * metric.maxA;
}

function lexLess(a, b) {
  if (!b) return true;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return a.length < b.length;
}

function better(candidateSet, candidateMetric, bestSet, bestMetric, mode) {
  if (!bestSet || !bestMetric) return true;
  if (mode === 'iso') {
    if (candidateMetric.isolated !== bestMetric.isolated) return candidateMetric.isolated < bestMetric.isolated;
    if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
    return lexLess(candidateSet, bestSet);
  }
  if (candidateMetric.avg_sq_gap !== bestMetric.avg_sq_gap) return candidateMetric.avg_sq_gap < bestMetric.avg_sq_gap;
  if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
  return lexLess(candidateSet, bestSet);
}

function mianChowlaPrefix(m) {
  const arr = [1, 2];
  const diffs = new Set([1]);
  while (arr.length < m) {
    let x = arr[arr.length - 1] + 1;
    for (;;) {
      let ok = true;
      const pending = [];
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        if (diffs.has(d)) {
          ok = false;
          break;
        }
        pending.push(d);
      }
      if (ok) {
        for (const d of pending) diffs.add(d);
        arr.push(x);
        break;
      }
      x += 1;
    }
  }
  return arr;
}

function ruzsaSet(p) {
  const out = [];
  for (let i = 0; i < p; i++) out.push(2 * p * i + ((i * i) % p));
  return out;
}

function randomDenseSidon(m, maxStep) {
  const arr = [1, 2];
  const diffs = new Set([1]);
  while (arr.length < m) {
    const base = arr[arr.length - 1];
    let placed = false;
    for (let t = 0; t < 800; t++) {
      const x = base + randInt(1, maxStep);
      let ok = true;
      for (let i = 0; i < arr.length; i++) {
        if (diffs.has(x - arr[i])) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
      arr.push(x);
      placed = true;
      break;
    }
    if (placed) continue;
    let x = base + 1;
    for (;;) {
      let ok = true;
      for (let i = 0; i < arr.length; i++) {
        if (diffs.has(x - arr[i])) {
          ok = false;
          break;
        }
      }
      if (ok) {
        for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
        arr.push(x);
        break;
      }
      x += 1;
      if (x - base > maxStep * 40) return null;
    }
  }
  return arr;
}

function mutateOne(arr) {
  const out = arr.slice();
  const m = out.length;
  const i = randInt(1, m - 1); // keep first element anchored at 1

  const left = out[i - 1] + 1;
  let right;
  if (i === m - 1) {
    right = out[i - 1] + Math.max(4, Math.floor(0.35 * m * m));
  } else {
    right = out[i + 1] - 1;
    if (right < left) return null;
  }

  // Mix local and wider jumps.
  let candidate;
  if (Math.random() < 0.75) {
    const radius = Math.max(2, Math.floor(0.08 * m * m));
    const lo = Math.max(left, out[i] - radius);
    const hi = Math.min(right, out[i] + radius);
    if (lo > hi) return null;
    candidate = randInt(lo, hi);
  } else {
    candidate = randInt(left, right);
  }

  if (candidate === out[i]) return null;
  out[i] = candidate;
  return out;
}

function anneal(seed, mode, steps) {
  let curr = seed.slice();
  if (!isSidon(curr)) return null;
  let currMetric = metrics(curr);
  let currVal = objectiveValue(currMetric, mode);

  let bestSet = curr.slice();
  let bestMetric = { ...currMetric };
  let bestVal = currVal;

  let temp = 1.0;
  const cool = Math.exp(Math.log(0.004) / Math.max(1, steps - 1));

  for (let it = 0; it < steps; it++) {
    const cand = mutateOne(curr);
    if (!cand) {
      temp *= cool;
      continue;
    }
    if (!isSidon(cand)) {
      temp *= cool;
      continue;
    }
    const candMetric = metrics(cand);
    const candVal = objectiveValue(candMetric, mode);
    const delta = candVal - currVal;
    const accept = delta <= 0 || Math.random() < Math.exp(-delta / Math.max(1e-9, temp));
    if (accept) {
      curr = cand;
      currMetric = candMetric;
      currVal = candVal;
      if (candVal < bestVal || (candVal === bestVal && lexLess(cand, bestSet))) {
        bestSet = cand.slice();
        bestMetric = { ...candMetric };
        bestVal = candVal;
      }
    }
    temp *= cool;
  }

  return {
    set: bestSet,
    metric: bestMetric,
  };
}

function makeSeeds(m) {
  const seeds = [];

  // Mian-Chowla seed
  seeds.push(mianChowlaPrefix(m));

  // Ruzsa seeds: prime near m and a few larger.
  const p0 = nextPrime(m);
  for (const p of [p0, nextPrime(p0 + 1), nextPrime(p0 + 8)]) {
    const rz = ruzsaSet(p).slice(0, m).map((x) => x - ruzsaSet(p)[0] + 1);
    // Re-normalize to start at 1 while preserving Sidon.
    if (isSidon(rz)) seeds.push(rz);
  }

  // Random dense seeds.
  const maxStep = Math.max(6, Math.floor(0.45 * m));
  for (let s = 0; s < 6; s++) {
    const rd = randomDenseSidon(m, maxStep);
    if (rd && isSidon(rd)) seeds.push(rd);
  }

  // Deduplicate by key.
  const uniq = new Map();
  for (const s of seeds) {
    uniq.set(s.join(','), s);
  }
  return [...uniq.values()];
}

const rows = [];

for (let m = mStart; m <= mEnd; m++) {
  const seeds = makeSeeds(m);

  let bestIsoSet = null;
  let bestIsoMetric = null;
  let bestAvgSet = null;
  let bestAvgMetric = null;
  let isoTries = 0;
  let avgTries = 0;

  // Seed-only baseline
  for (const seed of seeds) {
    if (!isSidon(seed)) continue;
    const mt = metrics(seed);
    if (better(seed, mt, bestIsoSet, bestIsoMetric, 'iso')) {
      bestIsoSet = seed.slice();
      bestIsoMetric = { ...mt };
    }
    if (better(seed, mt, bestAvgSet, bestAvgMetric, 'avg')) {
      bestAvgSet = seed.slice();
      bestAvgMetric = { ...mt };
    }
  }

  const seedPool = seeds.length > 0 ? seeds : [mianChowlaPrefix(m)];

  for (let r = 0; r < restartsPerObjective; r++) {
    const isoSeed = seedPool[randInt(0, seedPool.length - 1)];
    const avgSeed = seedPool[randInt(0, seedPool.length - 1)];

    const isoOut = anneal(isoSeed, 'iso', iterationsPerRestart);
    if (isoOut) {
      isoTries += 1;
      if (better(isoOut.set, isoOut.metric, bestIsoSet, bestIsoMetric, 'iso')) {
        bestIsoSet = isoOut.set.slice();
        bestIsoMetric = { ...isoOut.metric };
      }
    }

    const avgOut = anneal(avgSeed, 'avg', iterationsPerRestart);
    if (avgOut) {
      avgTries += 1;
      if (better(avgOut.set, avgOut.metric, bestAvgSet, bestAvgMetric, 'avg')) {
        bestAvgSet = avgOut.set.slice();
        bestAvgMetric = { ...avgOut.metric };
      }
    }
  }

  const row = {
    m,
    seeds_used: seedPool.length,
    restarts_per_objective: restartsPerObjective,
    iterations_per_restart: iterationsPerRestart,
    iso_anneal_runs: isoTries,
    avg_anneal_runs: avgTries,
    iso_objective_best: {
      set: bestIsoSet,
      ...bestIsoMetric,
    },
    avg_sq_objective_best: {
      set: bestAvgSet,
      ...bestAvgMetric,
    },
  };
  rows.push(row);

  console.error(
    `m=${m} done: iso=${bestIsoMetric.isolated}, avg=${bestAvgMetric.avg_sq_gap.toFixed(4)}, maxA(iso)=${bestIsoMetric.maxA}, maxA(avg)=${bestAvgMetric.maxA}`
  );
}

console.log(
  JSON.stringify(
    {
      mStart,
      mEnd,
      restartsPerObjective,
      iterationsPerRestart,
      rows,
    },
    null,
    2
  )
);

