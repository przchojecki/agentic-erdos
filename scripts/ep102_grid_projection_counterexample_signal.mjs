#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-102 finite construction signal:
// Analyze d-dimensional integer grids [0..m-1]^d (projectable to R^2) and count
// how many point-pairs lie on lines containing >=K grid points, while max line
// multiplicity is only m = n^(1/d).
//
// This does NOT directly settle h_c(n)->infty in the exact 2D statement, but it
// quantifies the known projected-grid counterexample mechanism.

const CASES = (process.env.CASES || '4x6,5x5,6x4')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    const m = /^(\d+)x(\d+)$/.exec(s);
    if (!m) return null;
    return { d: Number(m[1]), m: Number(m[2]) };
  })
  .filter((x) => x && x.d >= 2 && x.m >= 3);
const K = Number(process.env.K || 4); // "more than three points" -> >=4

function gcd2(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function gcdVec(arr) {
  let g = 0;
  for (const v of arr) g = gcd2(g, v);
  return g;
}

function ceilSafe(x) {
  return Math.ceil(x - 1e-12);
}

function floorSafe(x) {
  return Math.floor(x + 1e-12);
}

function lineLengthInGrid(a, b, m, d) {
  const delta = new Array(d);
  for (let i = 0; i < d; i += 1) delta[i] = b[i] - a[i];
  const g = gcdVec(delta);
  if (g <= 0) return 1;
  const v = delta.map((x) => x / g);

  let tLow = -1e18;
  let tHigh = 1e18;
  for (let i = 0; i < d; i += 1) {
    const vi = v[i];
    const ai = a[i];
    if (vi === 0) continue;
    const t1 = (0 - ai) / vi;
    const t2 = (m - 1 - ai) / vi;
    const lo = Math.min(t1, t2);
    const hi = Math.max(t1, t2);
    if (lo > tLow) tLow = lo;
    if (hi < tHigh) tHigh = hi;
  }

  const L = ceilSafe(tLow);
  const R = floorSafe(tHigh);
  if (R < L) return 0;
  return R - L + 1;
}

function decodePoint(idx, m, d) {
  const a = new Array(d).fill(0);
  let x = idx;
  for (let i = 0; i < d; i += 1) {
    a[i] = x % m;
    x = Math.floor(x / m);
  }
  return a;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

const rows = [];
for (const { d, m } of CASES) {
  const n = m ** d;
  const totalPairs = choose2(n);
  const started = Date.now();

  let richPairCount = 0;
  const sampleRich = [];
  let sampled = 0;

  for (let i = 0; i < n; i += 1) {
    const a = decodePoint(i, m, d);
    for (let j = i + 1; j < n; j += 1) {
      const b = decodePoint(j, m, d);
      const len = lineLengthInGrid(a, b, m, d);
      if (len >= K) {
        richPairCount += 1;
        if (sampleRich.length < 12) {
          sampleRich.push({
            i,
            j,
            a,
            b,
            line_points_in_grid: len,
          });
        }
      }
      sampled += 1;
    }
  }

  // In [0..m-1]^d, any line has at most m grid points.
  const maxLineMultiplicity = m;
  // Lower bound on #rich lines from pair counting.
  const richLinesLowerBound = richPairCount / choose2(maxLineMultiplicity);
  const richLinesLowerBoundOverN2 = richLinesLowerBound / (n * n);
  const richPairsOverN2 = richPairCount / (n * n);

  rows.push({
    d,
    m,
    n,
    k_threshold: K,
    total_pairs: totalPairs,
    sampled_pairs: sampled,
    rich_pair_count: richPairCount,
    rich_pairs_over_n2: Number(richPairsOverN2.toFixed(6)),
    max_line_multiplicity: maxLineMultiplicity,
    rich_lines_lower_bound: Math.floor(richLinesLowerBound),
    rich_lines_lower_bound_over_n2: Number(richLinesLowerBoundOverN2.toFixed(6)),
    sample_rich_pairs: sampleRich,
    runtime_ms: Date.now() - started,
  });

  process.stderr.write(
    `d=${d}, m=${m}, n=${n}: rich_pairs=${richPairCount}, lb_lines_over_n2=${richLinesLowerBoundOverN2.toFixed(6)}\n`
  );
}

const out = {
  problem: 'EP-102',
  script: path.basename(process.argv[1]),
  method: 'exact_grid_pair_line_length_count_for_projected_grid_counterexample_signal',
  params: {
    cases: CASES,
    k_threshold: K,
  },
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep102_grid_projection_counterexample_signal.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      summary: rows.map((r) => ({
        d: r.d,
        m: r.m,
        n: r.n,
        rich_pairs_over_n2: r.rich_pairs_over_n2,
        max_line_multiplicity: r.max_line_multiplicity,
        rich_lines_lower_bound_over_n2: r.rich_lines_lower_bound_over_n2,
      })),
    },
    null,
    2
  )
);
