#!/usr/bin/env node

// EP-1086 deep standalone computation:
// Search for large multiplicity of equal-area triangles in planar n-point sets.
// For each n, run long-budget randomized search on integer grid points,
// evaluating exact area multiplicity via O(n^3) scan.

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let z = t;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function randomDistinctPoints(n, box, rand) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rand() * box);
    const y = Math.floor(rand() * box);
    const k = `${x},${y}`;
    if (used.has(k)) continue;
    used.add(k);
    pts.push([x, y]);
  }
  return pts;
}

function areaMultiplicity(points) {
  const m = points.length;
  const cnt = new Map();
  let best = 0;
  let bestArea2 = 0;
  let nondeg = 0;

  for (let i = 0; i < m; i += 1) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < m; j += 1) {
      const [x2, y2] = points[j];
      for (let k = j + 1; k < m; k += 1) {
        const [x3, y3] = points[k];
        const area2 = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
        if (area2 === 0) continue;
        nondeg += 1;
        const c = (cnt.get(area2) || 0) + 1;
        cnt.set(area2, c);
        if (c > best) {
          best = c;
          bestArea2 = area2;
        }
      }
    }
  }

  return { best, bestArea2, nondeg };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const box = Number(process.env.BOX || (depth >= 4 ? 95 : 75));
  const budgetPerNMs = Number(process.env.BUDGET_MS || (depth >= 4 ? 12000 : 6000));

  const nList = depth >= 4 ? [18, 22, 26, 30, 34] : [14, 18, 22, 26, 30];

  const rand = mulberry32(20260314 ^ 1086 ^ (depth * 131));
  const rows = [];
  let totalCandidates = 0;
  let totalTriplesEvaluated = 0;

  for (const n of nList) {
    const tN0 = Date.now();
    let best = -1;
    let bestArea2 = 0;
    let bestPts = null;
    let trials = 0;

    while (Date.now() - tN0 < budgetPerNMs) {
      const pts = randomDistinctPoints(n, box, rand);
      const r = areaMultiplicity(pts);
      trials += 1;
      totalCandidates += 1;
      totalTriplesEvaluated += (n * (n - 1) * (n - 2)) / 6;

      if (r.best > best) {
        best = r.best;
        bestArea2 = r.bestArea2;
        bestPts = pts.slice(0, Math.min(24, pts.length));
      }
    }

    rows.push({
      n,
      box,
      time_budget_ms: budgetPerNMs,
      trials,
      best_equal_area_triangle_count_found: best,
      best_area2: bestArea2,
      normalized_best_over_n_squared: Number((best / (n * n)).toFixed(10)),
      normalized_best_over_n_loglogn: Number((best / (n * Math.log(Math.log(Math.max(5, n))))).toFixed(10)),
      sample_witness_points_prefix: bestPts,
      elapsed_ms_for_n: Date.now() - tN0,
    });
  }

  const payload = {
    problem: 'EP-1086',
    script: 'ep1086.mjs',
    method: 'deep_randomized_integer_grid_search_for_maximum_equal_area_triangle_multiplicity',
    warning: 'Finite randomized lower-bound evidence only; does not prove asymptotic exponent.',
    params: { depth, box, budgetPerNMs, nList },
    rows,
    total_candidates_evaluated: totalCandidates,
    total_triangle_triples_scanned_estimate: totalTriplesEvaluated,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
