#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 4:
// EP-91, EP-92, EP-96, EP-100, EP-101, EP-114, EP-120, EP-123, EP-124, EP-125.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function roundedKey(x, digits = 10) {
  return x.toFixed(digits);
}

function distinctDistanceCount(points) {
  const s = new Set();
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      s.add(roundedKey(Math.hypot(dx, dy), 10));
    }
  }
  return s.size;
}

function regularPolygon(n, radius = 1, theta0 = 0) {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const t = theta0 + (2 * Math.PI * i) / n;
    pts.push([radius * Math.cos(t), radius * Math.sin(t)]);
  }
  return pts;
}

function reflectPointAcrossLine(p, a, b) {
  const [x0, y0] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  const t = ((x0 - x1) * dx + (y0 - y1) * dy) / len2;
  const xf = x1 + t * dx;
  const yf = y1 + t * dy;
  return [2 * xf - x0, 2 * yf - y0];
}

function localEquidistantMin(points) {
  // For each center x, take max multiplicity over distances from x;
  // then minimize over centers.
  let best = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const freq = new Map();
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const k = roundedKey(dx * dx + dy * dy, 10);
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    let mx = 0;
    for (const v of freq.values()) if (v > mx) mx = v;
    if (mx < best) best = mx;
  }
  return best;
}

function gridPoints(m) {
  const pts = [];
  for (let i = 0; i < m; i += 1) for (let j = 0; j < m; j += 1) pts.push([i, j]);
  return pts;
}

function triPatchPoints(n) {
  const pts = [];
  let r = 0;
  while (pts.length < n) {
    for (let x = 0; x <= r; x += 1) {
      const y = r - x;
      const X = x + y / 2;
      const Y = (Math.sqrt(3) / 2) * y;
      pts.push([X, Y]);
      if (pts.length >= n) break;
    }
    r += 1;
  }
  return pts;
}

function randomConvexOnCircle(n, rng) {
  const ang = [];
  for (let i = 0; i < n; i += 1) ang.push(rng() * 2 * Math.PI);
  ang.sort((a, b) => a - b);
  return ang.map((t) => [Math.cos(t), Math.sin(t)]);
}

function maxDistanceMultiplicity(points) {
  const freq = new Map();
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const k = roundedKey(Math.hypot(dx, dy), 10);
      freq.set(k, (freq.get(k) || 0) + 1);
    }
  }
  let mx = 0;
  for (const v of freq.values()) if (v > mx) mx = v;
  return mx;
}

function lineKeyInt(p, q) {
  let A = q[1] - p[1];
  let B = p[0] - q[0];
  let C = -(A * p[0] + B * p[1]);

  const g = (x, y) => {
    let a = Math.abs(x);
    let b = Math.abs(y);
    while (b !== 0) {
      const t = a % b;
      a = b;
      b = t;
    }
    return a;
  };
  let gg = g(A, B);
  gg = g(gg, C);
  if (gg > 0) {
    A /= gg;
    B /= gg;
    C /= gg;
  }
  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }
  return `${A},${B},${C}`;
}

function profileFourLines(points) {
  const mp = new Map();
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const k = lineKeyInt(points[i], points[j]);
      let s = mp.get(k);
      if (!s) {
        s = new Set();
        mp.set(k, s);
      }
      s.add(i);
      s.add(j);
    }
  }
  let c4 = 0;
  let maxCol = 1;
  for (const s of mp.values()) {
    const z = s.size;
    if (z > maxCol) maxCol = z;
    if (z === 4) c4 += 1;
  }
  return { fourLines: c4, maxCollinear: maxCol };
}

function buildNoFiveSet(targetN, gridM, maxAttempts, rng) {
  const points = [];
  const pointSet = new Set();
  const lines = new Map(); // line -> Set(point indices)

  let attempts = 0;
  while (points.length < targetN && attempts < maxAttempts) {
    attempts += 1;
    const x = Math.floor(rng() * (2 * gridM + 1)) - gridM;
    const y = Math.floor(rng() * (2 * gridM + 1)) - gridM;
    const pk = `${x},${y}`;
    if (pointSet.has(pk)) continue;

    let bad = false;
    const cand = [x, y];
    for (let i = 0; i < points.length; i += 1) {
      const lk = lineKeyInt(cand, points[i]);
      const s = lines.get(lk);
      if (s && s.size >= 4) {
        bad = true;
        break;
      }
    }
    if (bad) continue;

    const idx = points.length;
    points.push(cand);
    pointSet.add(pk);

    for (let i = 0; i < idx; i += 1) {
      const lk = lineKeyInt(cand, points[i]);
      let s = lines.get(lk);
      if (!s) {
        s = new Set([i, idx]);
        lines.set(lk, s);
      } else {
        s.add(i);
        s.add(idx);
      }
    }
  }

  return points;
}

function gammaLn(z) {
  // Lanczos approximation.
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - gammaLn(1 - z);

  let x = 0.99999999999980993;
  const zz = z - 1;
  for (let i = 0; i < p.length; i += 1) x += p[i] / (zz + i + 1);
  const t = zz + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (zz + 0.5) * Math.log(t) - t + Math.log(x);
}

function beta(a, b) {
  return Math.exp(gammaLn(a) + gammaLn(b) - gammaLn(a + b));
}

function digitSet(base, k, N) {
  const vals = new Set([0]);
  for (let p = base ** k; p <= N; p *= base) {
    const cur = [...vals];
    for (const v of cur) {
      const w = v + p;
      if (w <= N) vals.add(w);
    }
    if (p > Number.MAX_SAFE_INTEGER / base) break;
  }
  return [...vals].sort((a, b) => a - b);
}

function sumsetCoverage(sets, N) {
  let active = [0];
  for (const S of sets) {
    const mark = new Uint8Array(N + 1);
    const nxt = [];
    for (const s of S) {
      for (const x of active) {
        const y = x + s;
        if (y > N) continue;
        if (!mark[y]) {
          mark[y] = 1;
          nxt.push(y);
        }
      }
    }
    nxt.sort((a, b) => a - b);
    active = nxt;
  }
  const mark = new Uint8Array(N + 1);
  for (const x of active) mark[x] = 1;

  let covered = 0;
  for (let x = 1; x <= N; x += 1) covered += mark[x];

  let firstMissing = null;
  for (let x = 1; x <= N; x += 1) {
    if (!mark[x]) {
      firstMissing = x;
      break;
    }
  }

  let tailCovered = 0;
  const L = Math.floor(N / 2);
  for (let x = L; x <= N; x += 1) tailCovered += mark[x];

  return {
    covered_1_to_N: covered,
    density_1_to_N: covered / N,
    covered_tail_L_to_N: tailCovered,
    density_tail_L_to_N: tailCovered / (N - L + 1),
    first_missing: firstMissing,
  };
}

function longestGap(mark, N) {
  let cur = 0;
  let best = 0;
  for (let x = 1; x <= N; x += 1) {
    if (!mark[x]) cur += 1;
    else {
      if (cur > best) best = cur;
      cur = 0;
    }
  }
  if (cur > best) best = cur;
  return best;
}

function generateABC(a, b, c, N) {
  const s = new Set();
  for (let pa = 1; pa <= N; pa *= a) {
    for (let pb = 1; pa * pb <= N; pb *= b) {
      for (let pc = 1; pa * pb * pc <= N; pc *= c) {
        s.add(pa * pb * pc);
        if (pc > Number.MAX_SAFE_INTEGER / c) break;
      }
      if (pb > Number.MAX_SAFE_INTEGER / b) break;
    }
    if (pa > Number.MAX_SAFE_INTEGER / a) break;
  }
  return [...s].sort((x, y) => y - x);
}

function heuristicRepresentable(n, termsDesc, rng, attempts = 8, budgetPerAttempt = 1800) {
  function dfs(rem, startIdx, selected, budgetObj) {
    if (rem === 0) return true;
    if (budgetObj.left <= 0) return false;
    budgetObj.left -= 1;

    const cand = [];
    for (let i = startIdx; i < termsDesc.length; i += 1) {
      const t = termsDesc[i];
      if (t > rem) continue;
      let ok = true;
      for (const s of selected) {
        if (s % t === 0 || t % s === 0) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      if (t === rem) return true;
      cand.push(i);
      if (cand.length >= 20) break;
    }
    if (!cand.length) return false;

    shuffle(cand, rng);
    const lim = Math.min(cand.length, 7);
    for (let j = 0; j < lim; j += 1) {
      const idx = cand[j];
      const t = termsDesc[idx];
      selected.push(t);
      if (dfs(rem - t, idx + 1, selected, budgetObj)) return true;
      selected.pop();
    }
    return false;
  }

  for (let k = 0; k < attempts; k += 1) {
    const budgetObj = { left: budgetPerAttempt };
    if (dfs(n, 0, [], budgetObj)) return true;
  }
  return false;
}

function affineAvoidanceDensityFinitePower2(m, N, rng, repeats = 30) {
  const pattern = [];
  for (let j = 0; j < m; j += 1) pattern.push(2 ** j);
  const maxP = pattern[pattern.length - 1];

  const copies = [];
  const pointToCopies = Array.from({ length: N + 1 }, () => []);

  for (let t = 1; t * maxP <= N; t += 1) {
    const maxX = N - t * maxP;
    for (let x = 0; x <= maxX; x += 1) {
      const cp = pattern.map((p) => x + t * p);
      const id = copies.length;
      copies.push(cp);
      for (const v of cp) pointToCopies[v].push(id);
    }
  }

  let bestActive = 0;

  for (let rep = 0; rep < repeats; rep += 1) {
    const active = new Uint8Array(N + 1);
    active.fill(1);
    active[0] = 0;

    const cnt = new Int16Array(copies.length);
    for (let i = 0; i < copies.length; i += 1) cnt[i] = m;

    const queue = Array.from({ length: copies.length }, (_, i) => i);
    shuffle(queue, rng);

    let alive = N;
    for (const id of queue) {
      if (cnt[id] < m) continue;
      const cp = copies[id];
      const options = cp.filter((v) => active[v]);
      if (!options.length) continue;
      const kill = options[Math.floor(rng() * options.length)];
      if (!active[kill]) continue;
      active[kill] = 0;
      alive -= 1;
      for (const cId of pointToCopies[kill]) cnt[cId] -= 1;
    }

    if (alive > bestActive) bestActive = alive;
  }

  return {
    m,
    N,
    best_avoidance_set_size_found: bestActive,
    best_density_found: Number((bestActive / N).toFixed(6)),
    copies_tested: copies.length,
  };
}

const rng = makeRng(20260303 ^ 917);

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-91: explicit small-n configurations from background and nearby examples.
{
  const rows = [];

  const square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const triShare = [
    [0, 0],
    [1, 0],
    [0.5, Math.sqrt(3) / 2],
    [0.5, -Math.sqrt(3) / 2],
  ];
  rows.push({ n: 4, model: 'square', distinct_distances: distinctDistanceCount(square) });
  rows.push({ n: 4, model: 'two_equilateral_triangles_sharing_edge', distinct_distances: distinctDistanceCount(triShare) });

  const pent = regularPolygon(5, 1, Math.PI / 2);
  rows.push({ n: 5, model: 'regular_pentagon', distinct_distances: distinctDistanceCount(pent) });

  const nonagon = regularPolygon(9, 1, Math.PI / 2);
  const hex = regularPolygon(6, 1, 0);
  const center = [0, 0];
  // Two reflections of the center across neighboring sides around one vertex of a regular hexagon.
  const r1 = reflectPointAcrossLine(center, hex[0], hex[1]);
  const r2 = reflectPointAcrossLine(center, hex[5], hex[0]);
  const hegyiLike = [...hex, center, r1, r2];

  const dNonagon = distinctDistanceCount(nonagon);
  const dHegyi = distinctDistanceCount(hegyiLike);
  rows.push({ n: 9, model: 'regular_nonagon', distinct_distances: dNonagon });
  rows.push({ n: 9, model: 'hexagon_plus_center_plus_two_reflections', distinct_distances: dHegyi });
  rows.push({ n: 9, model: 'pair_same_distinct_count_in_this_probe', value: dNonagon === dHegyi });

  out.results.ep91 = {
    description: 'Explicit finite configuration check for non-similar low-distance candidates.',
    rows,
  };
}

// EP-92: finite profiles for f(n)-style local equidistance in model sets.
{
  const rows = [];

  for (const m of [4, 5, 6, 8]) {
    const pts = gridPoints(m);
    const n = pts.length;
    const f = localEquidistantMin(pts);
    rows.push({
      model: 'square_grid',
      n,
      f_model: f,
      f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
    });
  }

  for (const n of [16, 25, 36, 64]) {
    const pts = triPatchPoints(n);
    const f = localEquidistantMin(pts);
    rows.push({
      model: 'triangular_patch',
      n,
      f_model: f,
      f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
    });
  }

  for (const n of [12, 18, 24, 30]) {
    const pts = regularPolygon(n, 1, 0);
    const f = localEquidistantMin(pts);
    rows.push({
      model: 'regular_polygon',
      n,
      f_model: f,
      f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
    });
  }

  out.results.ep92 = {
    description: 'Finite model lower profiles for per-center equidistant multiplicity.',
    rows,
  };
}

// EP-96: unit-distance multiplicity behavior in convex polygons.
{
  const rows = [];

  for (const n of [20, 40, 80, 120]) {
    // For regular n-gon: scaling can make any chosen chord class equal to 1.
    // The best class always has multiplicity n (for k < n/2).
    rows.push({
      model: 'regular_polygon_theoretical_after_scaling',
      n,
      max_unit_pairs_possible: n,
      ratio_over_n: 1,
    });
  }

  for (const n of [20, 40, 80, 120]) {
    let best = 0;
    const trials = 160;
    for (let t = 0; t < trials; t += 1) {
      const pts = randomConvexOnCircle(n, rng);
      const v = maxDistanceMultiplicity(pts);
      if (v > best) best = v;
    }
    rows.push({
      model: 'random_convex_on_circle_best_distance_multiplicity',
      n,
      trials,
      best_distance_multiplicity_found: best,
      ratio_over_n: Number((best / n).toFixed(6)),
      compare_to_nlog2n_plus_4n: Number((best / (n * Math.log2(n) + 4 * n)).toFixed(6)),
    });
  }

  out.results.ep96 = {
    description: 'Finite convex-polygon distance-multiplicity profile (scaling to unit distance).',
    rows,
  };
}

// EP-100: lattice greedy search under separated-distance constraints.
{
  const rows = [];

  function admissible(existingPts, uniqueD, cand) {
    const nd = [];
    for (const p of existingPts) {
      const d = Math.hypot(cand[0] - p[0], cand[1] - p[1]);
      if (d < 1 - 1e-9) return null;
      nd.push(d);
    }

    for (let i = 0; i < nd.length; i += 1) {
      for (const e of uniqueD) {
        const diff = Math.abs(nd[i] - e);
        if (diff > 1e-9 && diff < 1 - 1e-9) return null;
      }
      for (let j = i + 1; j < nd.length; j += 1) {
        const diff = Math.abs(nd[i] - nd[j]);
        if (diff > 1e-9 && diff < 1 - 1e-9) return null;
      }
    }

    const nu = [...uniqueD];
    for (const d of nd) {
      let seen = false;
      for (const e of nu) {
        if (Math.abs(d - e) <= 1e-9) {
          seen = true;
          break;
        }
      }
      if (!seen) nu.push(d);
    }
    return nu;
  }

  function diameter(pts) {
    let mx = 0;
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d > mx) mx = d;
      }
    }
    return mx;
  }

  const R = 7;
  const pool = [];
  for (let x = -R; x <= R; x += 1) for (let y = -R; y <= R; y += 1) pool.push([x, y]);

  for (const n of [6, 7, 8, 9, 10]) {
    let bestDiam = Infinity;
    let bestDistinct = null;
    let reached = false;

    const restarts = 420;
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = [...pool];
      shuffle(ord, rng);
      const pts = [];
      let uniq = [];

      for (const c of ord) {
        const nu = admissible(pts, uniq, c);
        if (!nu) continue;
        pts.push(c);
        uniq = nu;
        if (pts.length >= n) break;
      }

      if (pts.length < n) continue;
      reached = true;
      const d = diameter(pts);
      if (d < bestDiam) {
        bestDiam = d;
        bestDistinct = uniq.length;
      }
    }

    rows.push({
      n,
      restarts,
      found_size_n_set: reached,
      best_diameter_found: reached ? Number(bestDiam.toFixed(6)) : null,
      best_diameter_over_n: reached ? Number((bestDiam / n).toFixed(6)) : null,
      distinct_distance_count_in_best: bestDistinct,
    });
  }

  out.results.ep100 = {
    description: 'Finite lattice-greedy search for small-diameter sets with 1-separated distinct distance spectrum.',
    rows,
  };
}

// EP-101: finite constructive search for many 4-point lines with no 5-point line.
{
  const rows = [];

  for (const targetN of [40, 60, 80]) {
    let best4 = -1;
    let bestMaxCol = null;
    let bestAchieved = 0;

    const trials = 90;
    for (let t = 0; t < trials; t += 1) {
      const pts = buildNoFiveSet(targetN, 35, 26000, rng);
      const prof = profileFourLines(pts);
      if (pts.length > bestAchieved) bestAchieved = pts.length;
      if (prof.fourLines > best4) {
        best4 = prof.fourLines;
        bestMaxCol = prof.maxCollinear;
      }
    }

    rows.push({
      target_n: targetN,
      trials,
      best_achieved_n: bestAchieved,
      best_four_point_lines_found: best4,
      max_collinear_in_best_case: bestMaxCol,
      four_lines_over_n2: Number((best4 / (targetN * targetN)).toFixed(6)),
    });
  }

  // Theoretical lower-profile line from Solymosi-Stojakovic-type exponent form n^(2-c/sqrt(log n)).
  const theory = [];
  for (const n of [1e3, 1e4, 1e5, 1e6]) {
    const c = 1;
    const exp = 2 - c / Math.sqrt(Math.log(n));
    const val = n ** exp;
    theory.push({
      n,
      model_value_n_2_minus_c_over_sqrtlogn_c1: Number(val.toFixed(3)),
      ratio_to_n2: Number((val / (n * n)).toFixed(6)),
    });
  }

  out.results.ep101 = {
    description: 'Finite no-5-collinear construction search and asymptotic comparison profile.',
    rows,
    theory_profile: theory,
  };
}

// EP-114: length profile for z^n-1 using exact beta-function expression.
{
  const rows = [];
  for (const n of [2, 3, 4, 5, 8, 12, 20, 40, 80]) {
    const L = beta(1 / (2 * n), 0.5);
    const approx = 2 * n + 4 * Math.log(2);
    rows.push({
      n,
      lemniscate_length_z_pow_n_minus_1: Number(L.toFixed(9)),
      asymptotic_2n_plus_4log2: Number(approx.toFixed(9)),
      relative_gap: Number(((L - approx) / approx).toFixed(9)),
    });
  }
  out.results.ep114 = {
    description: 'Exact length profile for the conjectured extremizer p(z)=z^n-1.',
    rows,
  };
}

// EP-120: finite discrete affine-copy avoidance for geometric-pattern proxies.
{
  const rows = [];
  for (const m of [4, 5, 6]) {
    for (const N of [128, 256, 384]) {
      rows.push(affineAvoidanceDensityFinitePower2(m, N, rng, 24));
    }
  }
  out.results.ep120 = {
    description: 'Finite proxy: large subsets of [1,N] avoiding affine copies of {1,2,4,...,2^(m-1)}.',
    rows,
  };
}

// EP-123: heuristic finite representability with antichain (non-divisibility) constraint.
{
  const rows = [];
  const N = 1400;
  const sampleCount = 120;

  for (const [a, b, c] of [
    [3, 5, 7],
    [2, 5, 11],
    [2, 5, 31],
  ]) {
    const terms = generateABC(a, b, c, N);
    let success = 0;
    for (let s = 0; s < sampleCount; s += 1) {
      const n = Math.floor(N / 2) + Math.floor(rng() * (N / 2));
      if (heuristicRepresentable(n, terms, rng, 8, 1800)) success += 1;
    }
    rows.push({
      triple: [a, b, c],
      N,
      terms_count_up_to_N: terms.length,
      sampled_targets_in_half_interval: sampleCount,
      heuristic_success_count: success,
      heuristic_success_rate: Number((success / sampleCount).toFixed(6)),
    });
  }

  out.results.ep123 = {
    description: 'Heuristic finite antichain-representation success profile on sampled targets.',
    rows,
  };
}

// EP-124: finite coverage probes for tuple-of-bases formulation.
{
  const rows = [];
  const N = 20000;

  const configs = [
    { d: [3, 4, 7], k: 0, label: 'classical_positive_example' },
    { d: [3, 4, 7], k: 1, label: 'gcd_condition_shifted_digits' },
    { d: [3, 5, 7], k: 1, label: 'pairwise_coprime_shifted_digits' },
    { d: [3, 9, 81], k: 0, label: 'known_bad_generalized_family_comparison' },
  ];

  for (const cfg of configs) {
    const sets = cfg.d.map((dd) => digitSet(dd, cfg.k, N));
    const cov = sumsetCoverage(sets, N);
    rows.push({
      label: cfg.label,
      d_tuple: cfg.d,
      k: cfg.k,
      set_sizes: sets.map((s) => s.length),
      ...Object.fromEntries(Object.entries(cov).map(([k, v]) => [k, typeof v === 'number' ? Number(v.toFixed(6)) : v])),
    });
  }

  out.results.ep124 = {
    description: 'Finite coverage profile for base-digit sumset representations.',
    rows,
  };
}

// EP-125: density profile for A+B where A uses base-3 digits {0,1}, B base-4 digits {0,1}.
{
  function markAB(N) {
    const A = digitSet(3, 0, N);
    const B = digitSet(4, 0, N);
    const mark = new Uint8Array(N + 1);
    for (const a of A) {
      for (const b of B) {
        const s = a + b;
        if (s <= N) mark[s] = 1;
      }
    }
    return { A, B, mark };
  }

  const rows = [];
  for (const N of [20000, 50000, 100000, 200000, 500000, 800000]) {
    const { A, B, mark } = markAB(N);
    let covered = 0;
    for (let x = 1; x <= N; x += 1) covered += mark[x];
    const dens = covered / N;

    let tail = 0;
    const L = Math.floor((3 * N) / 4);
    for (let x = L; x <= N; x += 1) tail += mark[x];
    const tailD = tail / (N - L + 1);

    rows.push({
      N,
      size_A: A.length,
      size_B: B.length,
      covered_1_to_N: covered,
      density_1_to_N: Number(dens.toFixed(6)),
      density_tail_3N_over_4_to_N: Number(tailD.toFixed(6)),
      longest_missing_gap_up_to_N: longestGap(mark, N),
    });
  }

  out.results.ep125 = {
    description: 'Finite density and gap profile for sums of base-{3,4} binary-digit sets.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch4_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
