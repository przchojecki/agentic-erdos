#!/usr/bin/env node
import fs from 'fs';

// EP-846 finite analog:
// Given finite planar sets, measure:
// - alpha_3: largest subset with no three collinear;
// - chi_3: minimum colors so each color class has no three collinear.

const OUT = process.env.OUT || 'data/ep846_standalone_deeper.json';

function collinear(p1, p2, p3) {
  const [x1, y1] = p1, [x2, y2] = p2, [x3, y3] = p3;
  return (x2 - x1) * (y3 - y1) === (y2 - y1) * (x3 - x1);
}

function triples(points) {
  const n = points.length;
  const T = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        if (collinear(points[i], points[j], points[k])) T.push([i, j, k]);
      }
    }
  }
  return T;
}

function maxTripleFreeSubsetSize(n, T) {
  const chosen = new Int8Array(n);
  let best = 0;
  function violates() {
    for (const [a, b, c] of T) if (chosen[a] && chosen[b] && chosen[c]) return true;
    return false;
  }
  function dfs(i, cur) {
    if (cur + (n - i) <= best) return;
    if (i === n) {
      if (cur > best) best = cur;
      return;
    }
    chosen[i] = 1;
    if (!violates()) dfs(i + 1, cur + 1);
    chosen[i] = 0;
    dfs(i + 1, cur);
  }
  dfs(0, 0);
  return best;
}

function hasKColoring(n, T, k) {
  const col = new Int8Array(n).fill(-1);
  function bad() {
    for (const [a, b, c] of T) {
      const ca = col[a];
      if (ca >= 0 && ca === col[b] && ca === col[c]) return true;
    }
    return false;
  }
  function dfs(i) {
    if (i === n) return true;
    for (let c = 0; c < k; c += 1) {
      col[i] = c;
      if (!bad() && dfs(i + 1)) return true;
    }
    col[i] = -1;
    return false;
  }
  return dfs(0);
}

function minColors(n, T, kMax = 8) {
  for (let k = 1; k <= kMax; k += 1) if (hasKColoring(n, T, k)) return k;
  return null;
}

const sets = [
  { name: 'grid_4x4', points: Array.from({ length: 4 }, (_, x) => Array.from({ length: 4 }, (_, y) => [x, y])).flat() },
  { name: 'grid_5x3', points: Array.from({ length: 5 }, (_, x) => Array.from({ length: 3 }, (_, y) => [x, y])).flat() },
  { name: 'union_3_lines_5_each', points: [...Array.from({ length: 5 }, (_, t) => [t, 0]), ...Array.from({ length: 5 }, (_, t) => [t, 10]), ...Array.from({ length: 5 }, (_, t) => [t, 20])] },
  { name: 'parabola_15', points: Array.from({ length: 15 }, (_, i) => [i, i * i]) },
];

const t0 = Date.now();
const rows = [];
for (const S of sets) {
  const n = S.points.length;
  const T = triples(S.points);
  const alpha = maxTripleFreeSubsetSize(n, T);
  const chi = minColors(n, T, 10);
  rows.push({
    set_name: S.name,
    n,
    collinear_triples: T.length,
    alpha_no3collinear: alpha,
    alpha_over_n: Number((alpha / n).toPrecision(8)),
    min_colors_to_partition_into_no3collinear_classes: chi,
  });
}

const out = {
  problem: 'EP-846',
  script: 'ep846.mjs',
  method: 'finite_hypergraph_profile_for_no_three_collinear_vs_partition_number',
  warning: 'Finite analog exploration only, not a proof of the infinite decomposition statement.',
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
