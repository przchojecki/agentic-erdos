#!/usr/bin/env node
import fs from 'fs';

// EP-831 finite proxy:
// For random/general-position n-point sets, count distinct circumradii among all triples.
// Gives heuristic lower profiles for h(n), not extremal guarantee.

const OUT = process.env.OUT || 'data/ep831_standalone_deeper.json';
const CASES = [
  [10, 80, 120],
  [12, 90, 100],
  [14, 100, 80],
  [16, 110, 60],
];

function makeRng(seed = 831_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

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
      const k = `${x},${y}`;
      if (used.has(k)) continue;
      used.add(k);
      pts.push([x, y]);
    }

    let good = true;
    for (let i = 0; i < n && good; i += 1) {
      for (let j = i + 1; j < n && good; j += 1) {
        for (let k = j + 1; k < n; k += 1) {
          const x1 = pts[i][0], y1 = pts[i][1];
          const x2 = pts[j][0], y2 = pts[j][1];
          const x3 = pts[k][0], y3 = pts[k][1];
          const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
          if (cross === 0) {
            good = false;
            break;
          }
        }
      }
    }
    if (good) return pts;
  }
}

function radiusKey(p1, p2, p3) {
  const a2 = (p2[0] - p3[0]) ** 2 + (p2[1] - p3[1]) ** 2;
  const b2 = (p1[0] - p3[0]) ** 2 + (p1[1] - p3[1]) ** 2;
  const c2 = (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
  const cross = Math.abs((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]));
  let num = a2 * b2 * c2;
  let den = 4 * cross * cross;
  const g = gcd(num, den);
  num /= g;
  den /= g;
  return `${num}/${den}`;
}

function distinctRadiiCount(pts) {
  const n = pts.length;
  const set = new Set();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) set.add(radiusKey(pts[i], pts[j], pts[k]));
    }
  }
  return set.size;
}

const t0 = Date.now();
const rows = [];
for (const [n, side, samples] of CASES) {
  const totTriples = (n * (n - 1) * (n - 2)) / 6;
  let minD = Infinity;
  let maxD = 0;
  let sumD = 0;
  for (let t = 0; t < samples; t += 1) {
    const pts = randomGeneralPositionPoints(n, side);
    const d = distinctRadiiCount(pts);
    if (d < minD) minD = d;
    if (d > maxD) maxD = d;
    sumD += d;
  }
  rows.push({
    n,
    samples,
    total_triples: totTriples,
    min_distinct_radii_seen: minD,
    avg_distinct_radii_seen: Number((sumD / samples).toPrecision(8)),
    max_distinct_radii_seen: maxD,
    min_ratio_distinct_over_all_triples: Number((minD / totTriples).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-831',
  script: 'ep831.mjs',
  method: 'random_general_position_distinct_circumradii_profile',
  warning: 'Heuristic finite profile, not extremal lower-bound proof.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
