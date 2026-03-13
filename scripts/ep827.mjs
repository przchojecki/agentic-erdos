#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep827_standalone_deeper.json';
const CASES = [
  [10, 36, 12],
  [12, 48, 10],
  [13, 56, 8],
  [14, 64, 6],
];

function makeRng(seed = 1_911_311) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng(827_2026);

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return Math.abs(a);
}

function randomGeneralPositionPoints(n, side) {
  while (true) {
    const pts = [];
    const used = new Set();
    while (pts.length < n) {
      const x = Math.floor(rng() * side);
      const y = Math.floor(rng() * side);
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      used.add(key);
      pts.push([x, y]);
    }
    let ok = true;
    for (let i = 0; i < n && ok; i += 1) {
      for (let j = i + 1; j < n && ok; j += 1) {
        for (let k = j + 1; k < n; k += 1) {
          const x1 = pts[i][0], y1 = pts[i][1];
          const x2 = pts[j][0], y2 = pts[j][1];
          const x3 = pts[k][0], y3 = pts[k][1];
          const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
          if (cross === 0) {
            ok = false;
            break;
          }
        }
      }
    }
    if (ok) return pts;
  }
}

function radiusKey(p1, p2, p3) {
  const a2 = (p2[0] - p3[0]) ** 2 + (p2[1] - p3[1]) ** 2;
  const b2 = (p1[0] - p3[0]) ** 2 + (p1[1] - p3[1]) ** 2;
  const c2 = (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
  const cross = Math.abs((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]));
  if (cross === 0) return null;
  let num = a2 * b2 * c2;
  let den = 4 * cross * cross;
  const g = gcd(num, den);
  num /= g;
  den /= g;
  return `${num}/${den}`;
}

function bestSubsetSize(pts) {
  const n = pts.length;
  const chosen = [];
  const radSet = new Set();
  let best = 0;
  let nodes = 0;

  function dfs(i) {
    nodes += 1;
    if (chosen.length + (n - i) <= best) return;
    if (i === n) {
      if (chosen.length > best) best = chosen.length;
      return;
    }
    const newKeys = [];
    let ok = true;
    for (let a = 0; a < chosen.length && ok; a += 1) {
      for (let b = a + 1; b < chosen.length; b += 1) {
        const key = radiusKey(pts[chosen[a]], pts[chosen[b]], pts[i]);
        if (key === null || radSet.has(key)) {
          ok = false;
          break;
        }
        newKeys.push(key);
      }
    }
    if (ok) {
      for (const k of newKeys) radSet.add(k);
      chosen.push(i);
      dfs(i + 1);
      chosen.pop();
      for (const k of newKeys) radSet.delete(k);
    }
    dfs(i + 1);
  }

  dfs(0);
  return { best, nodes };
}

const t0 = Date.now();
const rows = [];
for (const [n, side, samples] of CASES) {
  let best = 0;
  let avg = 0;
  let totalNodes = 0;
  for (let t = 0; t < samples; t += 1) {
    const pts = randomGeneralPositionPoints(n, side);
    const res = bestSubsetSize(pts);
    avg += res.best;
    totalNodes += res.nodes;
    if (res.best > best) best = res.best;
  }
  rows.push({
    n,
    side,
    samples,
    best_subset_size_all_circumradii_distinct: best,
    avg_best_subset_size: Number((avg / samples).toPrecision(7)),
    best_over_n: Number((best / n).toPrecision(7)),
    avg_dfs_nodes: Number((totalNodes / samples).toPrecision(7)),
  });
}

const out = {
  problem: 'EP-827',
  script: 'ep827.mjs',
  method: 'deeper_random_general_position_search_with_exact_branch_and_bound_selection',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
