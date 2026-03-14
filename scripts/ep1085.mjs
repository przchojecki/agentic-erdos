#!/usr/bin/env node

// EP-1085 deep standalone computation:
// Construction-side profiles for unit-distance counts:
// - 2D/3D integer-grid baselines,
// - 4D Lenz-type orthogonal-circle construction with brute-force verification.

function round10(x) {
  return Number(x.toFixed(10));
}

function grid2dRows(tList) {
  return tList.map((t) => {
    const n = t * t;
    const unitPairs = 2 * t * (t - 1);
    return {
      t,
      n,
      unit_pairs_grid_2d: unitPairs,
      pairs_over_n_4_over_3: round10(unitPairs / Math.pow(n, 4 / 3)),
      pairs_over_n_log_n: round10(unitPairs / (n * Math.log(n))),
      pairs_over_n: round10(unitPairs / n),
    };
  });
}

function grid3dRows(tList) {
  return tList.map((t) => {
    const n = t * t * t;
    const unitPairs = 3 * t * t * (t - 1);
    return {
      t,
      n,
      unit_pairs_grid_3d: unitPairs,
      pairs_over_n_4_over_3: round10(unitPairs / Math.pow(n, 4 / 3)),
      pairs_over_n_3_over_2: round10(unitPairs / Math.pow(n, 3 / 2)),
      pairs_over_n: round10(unitPairs / n),
    };
  });
}

function generateCirclePoints(m, startPhase, offset4 = [0, 0, 0, 0]) {
  const pts = [];
  const tau = 2 * Math.PI;
  for (let i = 0; i < m; i += 1) {
    const th = startPhase + (tau * i) / m;
    const x = Math.cos(th) / Math.sqrt(2);
    const y = Math.sin(th) / Math.sqrt(2);
    pts.push([
      x + offset4[0],
      y + offset4[1],
      offset4[2],
      offset4[3],
    ]);
  }
  return pts;
}

function generateOrthogonalLenz4(a, b) {
  const A = generateCirclePoints(a, 0, [0, 0, 0, 0]).map(([x, y]) => [x, y, 0, 0]);
  const B = generateCirclePoints(b, Math.PI / Math.max(1, 2 * b), [0, 0, 0, 0]).map(([x, y]) => [0, 0, x, y]);
  return A.concat(B);
}

function dist2(p, q) {
  const dx0 = p[0] - q[0];
  const dx1 = p[1] - q[1];
  const dx2 = p[2] - q[2];
  const dx3 = p[3] - q[3];
  return dx0 * dx0 + dx1 * dx1 + dx2 * dx2 + dx3 * dx3;
}

function bruteUnitPairs(points, tol = 1e-9) {
  let cnt = 0;
  for (let i = 0; i < points.length; i += 1) {
    const pi = points[i];
    for (let j = i + 1; j < points.length; j += 1) {
      if (Math.abs(dist2(pi, points[j]) - 1) <= tol) cnt += 1;
    }
  }
  return cnt;
}

function lenzFormulaPairs(a, b) {
  // cross-circle pairs are all unit (a*b).
  // same-circle unit pairs occur when chord step is quarter-turn; for equally spaced
  // m points this gives m edges if m divisible by 4, else 0.
  const intraA = a % 4 === 0 ? a : 0;
  const intraB = b % 4 === 0 ? b : 0;
  return {
    total: a * b + intraA + intraB,
    cross: a * b,
    intraA,
    intraB,
  };
}

function bestLenzSplit(n) {
  let best = null;
  for (let a = 1; a < n; a += 1) {
    const b = n - a;
    const val = lenzFormulaPairs(a, b);
    if (best === null || val.total > best.total) {
      best = { a, b, ...val };
    }
  }
  return best;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const t2 = depth >= 4 ? [50, 100, 150, 200, 300, 400, 500, 700, 900, 1100] : [30, 50, 80, 120, 180, 260, 360, 500];
  const t3 = depth >= 4 ? [20, 30, 40, 50, 60, 80, 100, 120, 140] : [12, 16, 22, 30, 40, 50, 64, 80];

  const rows2d = grid2dRows(t2);
  const rows3d = grid3dRows(t3);

  const nListFormula = depth >= 4
    ? [500, 1000, 2000, 5000, 10000, 20000, 40000]
    : [300, 500, 800, 1200, 2000, 4000, 8000];

  const lenzFormulaRows = nListFormula.map((n) => {
    const best = bestLenzSplit(n);
    return {
      n,
      best_split: { a: best.a, b: best.b },
      unit_pairs_formula: best.total,
      quadratic_leading_ratio_over_n2: round10(best.total / (n * n)),
      cross_pairs_only_ratio: round10(best.cross / (n * n)),
      intra_correction: best.intraA + best.intraB,
    };
  });

  // Heavier exact verification by brute pair scan on moderate n.
  const verifyN = depth >= 4 ? [14000, 18000, 22000] : [3000, 5000, 7000, 9000];
  const verifyPasses = depth >= 4 ? 5 : 2;
  const verifyRows = [];
  let brutePairsChecked = 0;

  for (const n of verifyN) {
    const best = bestLenzSplit(n);
    const pts = generateOrthogonalLenz4(best.a, best.b);

    let stable = true;
    let brute = -1;
    let ms = 0;
    for (let pass = 0; pass < verifyPasses; pass += 1) {
      const t1 = Date.now();
      const cur = bruteUnitPairs(pts);
      ms += Date.now() - t1;
      if (brute < 0) brute = cur;
      else if (cur !== brute) stable = false;
    }

    brutePairsChecked += verifyPasses * ((n * (n - 1)) / 2);
    verifyRows.push({
      n,
      split: { a: best.a, b: best.b },
      verify_passes: verifyPasses,
      unit_pairs_formula: best.total,
      unit_pairs_bruteforce: brute,
      exact_match_formula_vs_bruteforce: brute === best.total,
      stable_across_passes: stable,
      ratio_over_n2: round10(brute / (n * n)),
      elapsed_ms_bruteforce_all_passes: ms,
      avg_ms_per_pass: round10(ms / verifyPasses),
    });
  }

  const payload = {
    problem: 'EP-1085',
    script: 'ep1085.mjs',
    method: 'deep_multifamily_unit_distance_construction_profiles_with_4d_lenz_bruteforce_verification',
    warning: 'Construction-side finite evidence only; does not prove extremal upper bounds in d=2 or d=3.',
    params: {
      depth,
      t2,
      t3,
      nListFormula,
      verifyN,
      verifyPasses,
    },
    rows: {
      grid_2d: rows2d,
      grid_3d: rows3d,
      lenz_4d_formula_optimal_splits: lenzFormulaRows,
      lenz_4d_bruteforce_verification: verifyRows,
      bruteforce_pairs_checked_total: brutePairsChecked,
    },
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
