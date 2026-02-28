#!/usr/bin/env node

// Heuristic adversarial search for EP-152 / EP-153:
// For each target size m, try to find Sidon sets minimizing:
//   - isolated(A+A)           [EP-152 stress]
//   - avg_sq_gap(A+A)         [EP-153 stress]
//
// Usage:
//   node scripts/ep152_ep153_adversarial_search.mjs
//   node scripts/ep152_ep153_adversarial_search.mjs 11 40 2000
//     (mStart=11, mEnd=40, restartsPerM=2000)

const mStart = Number(process.argv[2] || 11);
const mEnd = Number(process.argv[3] || 40);
const restartsPerM = Number(process.argv[4] || 1500);

if (!Number.isInteger(mStart) || !Number.isInteger(mEnd) || !Number.isInteger(restartsPerM) || mStart < 3 || mEnd < mStart || restartsPerM < 1) {
  console.error('Usage: node scripts/ep152_ep153_adversarial_search.mjs [mStart>=3] [mEnd>=mStart] [restarts>=1]');
  process.exit(1);
}

function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
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

function sidonFromPrefix(prefix, targetM, maxStep) {
  const arr = prefix.slice();
  const diffs = new Set();
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) diffs.add(arr[j] - arr[i]);
  }

  while (arr.length < targetM) {
    const base = arr[arr.length - 1];
    let placed = false;
    // Try many random nearby candidates first.
    for (let tries = 0; tries < 600; tries++) {
      const x = base + randInt(1, maxStep);
      let ok = true;
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        if (diffs.has(d)) {
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

    // Deterministic fallback: walk upward until a valid point appears.
    let x = base + 1;
    for (;;) {
      let ok = true;
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        if (diffs.has(d)) {
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
      if (x - base > maxStep * 20) return null;
    }
  }
  return arr;
}

function metrics(arr) {
  const m = arr.length;
  const sums = [];
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
  }
  sums.sort((a, b) => a - b);

  const t = sums.length;
  let sumSq = 0;
  let isolated = 0;
  let maxRun = 1;
  let run = 1;
  for (let i = 0; i < t; i++) {
    if (i > 0) {
      const g = sums[i] - sums[i - 1];
      sumSq += g * g;
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
    max_run_over_m: maxRun / m,
  };
}

function lexLess(a, b) {
  if (!b) return true;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return a.length < b.length;
}

function betterIso(candidateMetric, candidateSet, bestMetric, bestSet) {
  if (!bestMetric) return true;
  if (candidateMetric.isolated !== bestMetric.isolated) return candidateMetric.isolated < bestMetric.isolated;
  if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
  return lexLess(candidateSet, bestSet);
}

function betterAvg(candidateMetric, candidateSet, bestMetric, bestSet) {
  if (!bestMetric) return true;
  if (candidateMetric.avg_sq_gap !== bestMetric.avg_sq_gap) return candidateMetric.avg_sq_gap < bestMetric.avg_sq_gap;
  if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
  return lexLess(candidateSet, bestSet);
}

function generateSeed(m, seedKind) {
  // A few distinct seed modes to diversify search.
  if (seedKind === 0) return [1, 2];
  if (seedKind === 1) return [1, 3];
  if (seedKind === 2) return [1, 2, 4];
  return [1, 2, randInt(4, Math.max(4, Math.floor(m / 2) + 3))];
}

const rows = [];

for (let m = mStart; m <= mEnd; m++) {
  let bestIsoMetric = null;
  let bestIsoSet = null;
  let bestAvgMetric = null;
  let bestAvgSet = null;
  let validCount = 0;

  // Step scale tuned by m. Larger m allows a bit more exploration spread.
  const maxStep = Math.max(8, Math.floor(0.7 * m));

  for (let r = 0; r < restartsPerM; r++) {
    const seed = generateSeed(m, r % 4);
    const A = sidonFromPrefix(seed, m, maxStep);
    if (!A || !isSidon(A)) continue;
    validCount += 1;
    const mt = metrics(A);

    if (betterIso(mt, A, bestIsoMetric, bestIsoSet)) {
      bestIsoMetric = mt;
      bestIsoSet = A.slice();
    }
    if (betterAvg(mt, A, bestAvgMetric, bestAvgSet)) {
      bestAvgMetric = mt;
      bestAvgSet = A.slice();
    }
  }

  // Extra deterministic fallback using a dense-ish greedy completion.
  if (!bestIsoMetric || !bestAvgMetric) {
    const fallback = sidonFromPrefix([1, 2], m, 3);
    if (fallback && isSidon(fallback)) {
      const mt = metrics(fallback);
      if (betterIso(mt, fallback, bestIsoMetric, bestIsoSet)) {
        bestIsoMetric = mt;
        bestIsoSet = fallback.slice();
      }
      if (betterAvg(mt, fallback, bestAvgMetric, bestAvgSet)) {
        bestAvgMetric = mt;
        bestAvgSet = fallback.slice();
      }
      validCount += 1;
    }
  }

  if (!bestIsoMetric || !bestAvgMetric) {
    console.error(`m=${m}: no valid Sidon sample found`);
    continue;
  }

  const row = {
    m,
    restarts: restartsPerM,
    valid_samples: validCount,
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
    `m=${m} done: bestIso=${bestIsoMetric.isolated}, bestAvg=${bestAvgMetric.avg_sq_gap.toFixed(4)}, maxA(iso)=${
      bestIsoMetric.maxA
    }`
  );
}

console.log(
  JSON.stringify(
    {
      mStart,
      mEnd,
      restartsPerM,
      rows,
    },
    null,
    2
  )
);

