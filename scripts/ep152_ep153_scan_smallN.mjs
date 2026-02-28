#!/usr/bin/env node

// EP-152 / EP-153 exhaustive small-N scan.
// For each Sidon set A subseteq [1..N] with min(A)=1, compute:
// - EP-152 metric: isolated sums in A+A
// - EP-153 metric: average squared successive gap in sorted A+A
//
// Usage:
//   node scripts/ep152_ep153_scan_smallN.mjs
//   node scripts/ep152_ep153_scan_smallN.mjs 10 60

const startN = Number(process.argv[2] || 10);
const endN = Number(process.argv[3] || 60);

if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN) {
  console.error('Usage: node scripts/ep152_ep153_scan_smallN.mjs [startN] [endN]');
  process.exit(1);
}

function diffBit(d) {
  // d in [1, ...]
  return 1n << BigInt(d - 1);
}

function metricsForSet(arr) {
  const m = arr.length;
  const sums = [];
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
  }
  sums.sort((a, b) => a - b);

  const t = sums.length;
  let sumSq = 0;
  for (let i = 0; i < t - 1; i++) {
    const g = sums[i + 1] - sums[i];
    sumSq += g * g;
  }

  let isolated = 0;
  for (let i = 0; i < t; i++) {
    const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
    const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
    if (leftMissing && rightMissing) isolated += 1;
  }

  return {
    isolated,
    avg_sq_gap: sumSq / t,
  };
}

function setLexLess(a, b) {
  if (!b) return true;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return a.length < b.length;
}

function updateMin(bySize, m, arr, metric) {
  const curr = bySize.get(m) || {
    min_isolated: Infinity,
    min_isolated_set: null,
    min_avg_sq_gap: Infinity,
    min_avg_sq_gap_set: null,
  };

  if (
    metric.isolated < curr.min_isolated ||
    (metric.isolated === curr.min_isolated && setLexLess(arr, curr.min_isolated_set))
  ) {
    curr.min_isolated = metric.isolated;
    curr.min_isolated_set = arr.slice();
  }

  if (
    metric.avg_sq_gap < curr.min_avg_sq_gap ||
    (metric.avg_sq_gap === curr.min_avg_sq_gap && setLexLess(arr, curr.min_avg_sq_gap_set))
  ) {
    curr.min_avg_sq_gap = metric.avg_sq_gap;
    curr.min_avg_sq_gap_set = arr.slice();
  }

  bySize.set(m, curr);
}

function bySizeToObject(bySize) {
  const out = {};
  const sizes = [...bySize.keys()].sort((a, b) => a - b);
  for (const m of sizes) {
    const rec = bySize.get(m);
    out[String(m)] = {
      m,
      min_isolated: rec.min_isolated,
      min_isolated_set: rec.min_isolated_set,
      min_avg_sq_gap: rec.min_avg_sq_gap,
      min_avg_sq_gap_set: rec.min_avg_sq_gap_set,
    };
  }
  return out;
}

const rows = [];
const globalBySize = new Map();

for (let N = startN; N <= endN; N++) {
  const t0 = Date.now();
  const arr = [1];
  let usedDiffMask = 0n;
  let sidonSetCount = 0;

  const bySize = new Map();

  function recordCurrent() {
    sidonSetCount += 1;
    const m = arr.length;
    const metric = metricsForSet(arr);
    updateMin(bySize, m, arr, metric);
    updateMin(globalBySize, m, arr, metric);
  }

  recordCurrent();

  function rec(next) {
    for (let x = next; x <= N; x++) {
      let ok = true;
      let addMask = 0n;
      for (let i = 0; i < arr.length; i++) {
        const bit = diffBit(x - arr[i]);
        if ((usedDiffMask & bit) !== 0n || (addMask & bit) !== 0n) {
          ok = false;
          break;
        }
        addMask |= bit;
      }
      if (!ok) continue;

      arr.push(x);
      usedDiffMask |= addMask;
      recordCurrent();
      rec(x + 1);
      usedDiffMask ^= addMask;
      arr.pop();
    }
  }

  rec(2);

  const row = {
    N,
    sidon_sets_min1_count: sidonSetCount,
    by_size: bySizeToObject(bySize),
    total_ms: Date.now() - t0,
  };
  rows.push(row);
  console.error(`N=${N} done, sets(min=1)=${sidonSetCount}, ms=${row.total_ms}`);
}

console.log(
  JSON.stringify(
    {
      startN,
      endN,
      rows,
      global_min_by_size: bySizeToObject(globalBySize),
    },
    null,
    2
  )
);

