#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 13:
// EP-478, EP-483, EP-488, EP-500, EP-503,
// EP-507, EP-508, EP-510, EP-520, EP-521.

function sieveSPF(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) {
      if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

function primesFromSPF(spf) {
  const p = [];
  for (let i = 2; i < spf.length; i += 1) if (spf[i] === i) p.push(i);
  return p;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function choose3(n) {
  return (n * (n - 1) * (n - 2)) / 6;
}

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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Shared prime tables.
const SPF_MAX = 1_200_000;
const spf = sieveSPF(SPF_MAX);
const primes = primesFromSPF(spf);

// EP-478: size of A_p = {k! mod p}.
{
  function aPSize(p) {
    let f = 1;
    const seen = new Uint8Array(p);
    for (let k = 1; k < p; k += 1) {
      f = (f * k) % p;
      seen[f] = 1;
    }
    let c = 0;
    for (let i = 0; i < p; i += 1) c += seen[i];
    return c;
  }

  const samplePrimes = [101, 503, 1009, 5003, 10007, 20011, 50021, 100003, 200003, 500009];
  const rows = [];
  const target = 1 - 1 / Math.E;

  for (const p of samplePrimes) {
    // ensure primality for larger sample items
    if (p >= spf.length || spf[p] !== p) continue;
    const s = aPSize(p);
    rows.push({
      p,
      size_A_p: s,
      ratio_A_p_over_p: Number((s / p).toPrecision(8)),
      ratio_over_target_1_minus_1_over_e: Number((s / (target * p)).toPrecision(8)),
      deficit_from_p_minus_2: p - 2 - s,
    });
  }

  let countEqualPminus2 = 0;
  let countPrime = 0;
  const smallLimit = 20000;
  for (const p of primes) {
    if (p > smallLimit) break;
    countPrime += 1;
    const s = aPSize(p);
    if (s === p - 2) countEqualPminus2 += 1;
  }

  out.results.ep478 = {
    description: 'Finite profile of |A_p| for factorial residues modulo p.',
    sample_rows: rows,
    exhaustive_small_prime_scan_limit: smallLimit,
    primes_scanned: countPrime,
    count_with_A_p_equal_p_minus_2: countEqualPminus2,
  };
}

// EP-483: Schur-number finite profiles.
{
  function colorableSchur(N, k) {
    const col = new Int8Array(N + 1);
    col.fill(-1);

    function dfs(x) {
      if (x > N) return true;
      for (let c = 0; c < k; c += 1) {
        let ok = true;
        for (let a = 1; a < x; a += 1) {
          const b = x - a;
          if (b < 1) continue;
          if (col[a] === c && col[b] === c) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        col[x] = c;
        if (dfs(x + 1)) return true;
        col[x] = -1;
      }
      return false;
    }

    return dfs(1);
  }

  function exactMaxForK(k, cap) {
    let best = 0;
    for (let N = 1; N <= cap; N += 1) {
      if (colorableSchur(N, k)) best = N;
      else return best;
    }
    return best;
  }

  const exactRows = [];
  for (const [k, cap] of [[1, 6], [2, 12], [3, 20]]) {
    const m = exactMaxForK(k, cap);
    exactRows.push({ k, exact_max_sum_free_coloring_length: m });
  }
  exactRows.push({ k: 4, exact_max_sum_free_coloring_length: 45, source: 'known_value_background' });

  const rng = makeRng(20260303 ^ 1301);

  function greedyRun(k, Nmax) {
    const col = new Int8Array(Nmax + 1);
    col.fill(-1);
    for (let x = 1; x <= Nmax; x += 1) {
      const valid = [];
      for (let c = 0; c < k; c += 1) {
        let ok = true;
        for (let a = 1; a < x; a += 1) {
          const b = x - a;
          if (b < 1) continue;
          if (col[a] === c && col[b] === c) {
            ok = false;
            break;
          }
        }
        if (ok) valid.push(c);
      }
      if (!valid.length) return x - 1;
      const c = valid[Math.floor(rng() * valid.length)];
      col[x] = c;
    }
    return Nmax;
  }

  const heuristicRows = [];
  for (const [k, trials, Nmax] of [[5, 180, 350], [6, 180, 500], [7, 180, 700]]) {
    let best = 0;
    let avg = 0;
    for (let t = 0; t < trials; t += 1) {
      const len = greedyRun(k, Nmax);
      avg += len;
      if (len > best) best = len;
    }
    heuristicRows.push({
      k,
      trials,
      search_cap: Nmax,
      best_greedy_length: best,
      avg_greedy_length: Number((avg / trials).toPrecision(7)),
      best_over_3p2806_pow_k: Number((best / (3.2806 ** k)).toPrecision(7)),
    });
  }

  out.results.ep483 = {
    description: 'Exact small-k and heuristic larger-k profiles for Schur-number growth.',
    exact_rows: exactRows,
    heuristic_rows: heuristicRows,
  };
}

// EP-488: density-ratio inequality profile for multiples-union sets.
{
  function buildPrefix(A, Nmax) {
    const mark = new Uint8Array(Nmax + 1);
    for (const a of A) {
      for (let m = a; m <= Nmax; m += a) mark[m] = 1;
    }
    const pref = new Uint32Array(Nmax + 1);
    for (let i = 1; i <= Nmax; i += 1) pref[i] = pref[i - 1] + mark[i];
    return pref;
  }

  function maxRatioForA(A, Nmax) {
    const n0 = Math.max(...A);
    const pref = buildPrefix(A, Nmax);
    const dens = new Float64Array(Nmax + 1);
    for (let n = 1; n <= Nmax; n += 1) dens[n] = pref[n] / n;

    const sufMax = new Float64Array(Nmax + 2);
    const sufArg = new Int32Array(Nmax + 2);
    for (let n = Nmax; n >= 1; n -= 1) {
      if (dens[n] >= sufMax[n + 1]) {
        sufMax[n] = dens[n];
        sufArg[n] = n;
      } else {
        sufMax[n] = sufMax[n + 1];
        sufArg[n] = sufArg[n + 1];
      }
    }

    let best = 0;
    let bestN = n0;
    let bestM = n0 + 1;

    for (let n = n0; n < Nmax; n += 1) {
      if (dens[n] === 0) continue;
      const r = sufMax[n + 1] / dens[n];
      if (r > best) {
        best = r;
        bestN = n;
        bestM = sufArg[n + 1];
      }
    }

    return {
      ratio: best,
      n: bestN,
      m: bestM,
      density_n: dens[bestN],
      density_m: dens[bestM],
    };
  }

  const rows = [];

  // Near-tight singleton witnesses.
  for (const a of [10, 25, 50, 100, 200]) {
    const n = 2 * a - 1;
    const m = 2 * a;
    const dn = Math.floor(n / a) / n;
    const dm = Math.floor(m / a) / m;
    rows.push({
      family: `singleton_a_${a}`,
      n,
      m,
      ratio_dm_over_dn: Number((dm / dn).toPrecision(8)),
      gap_to_2: Number((2 - dm / dn).toPrecision(8)),
    });
  }

  const rng = makeRng(20260303 ^ 1302);
  let bestGlobal = { ratio: 0, n: 0, m: 0, A: [] };
  for (let t = 0; t < 250; t += 1) {
    const size = 2 + Math.floor(rng() * 6);
    const Aset = new Set();
    while (Aset.size < size) Aset.add(2 + Math.floor(rng() * 120));
    const A = [...Aset].sort((x, y) => x - y);
    const r = maxRatioForA(A, 20000);
    if (r.ratio > bestGlobal.ratio) bestGlobal = { ...r, A };
  }

  out.results.ep488 = {
    description: 'Finite ratio profiles for density(B∩[1,m])/m relative to density at n.',
    singleton_rows: rows,
    random_search_best: {
      A: bestGlobal.A,
      ratio: Number(bestGlobal.ratio.toPrecision(8)),
      n: bestGlobal.n,
      m: bestGlobal.m,
      density_n: Number(bestGlobal.density_n.toPrecision(8)),
      density_m: Number(bestGlobal.density_m.toPrecision(8)),
    },
  };
}

// EP-500: K4^3-free 3-graph random-greedy lower-bound profile.
{
  function turanConstructionDensity(n) {
    const s = [Math.floor(n / 3), Math.floor((n + 1) / 3), Math.floor((n + 2) / 3)];
    s.sort((a, b) => b - a);
    const [a, b, c] = s;

    let e = a * b * c; // one from each class
    // two in Xi, one in Xi+1 cyclic
    e += choose2(a) * b;
    e += choose2(b) * c;
    e += choose2(c) * a;

    return e / choose3(n);
  }

  function greedyLower(n, trials, rng) {
    const triples = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        for (let k = j + 1; k < n; k += 1) triples.push([i, j, k]);
      }
    }
    const E = triples.length;

    const foursets = [];
    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        for (let c = b + 1; c < n; c += 1) {
          for (let d = c + 1; d < n; d += 1) {
            foursets.push([a, b, c, d]);
          }
        }
      }
    }

    const keyToEdge = new Map();
    for (let i = 0; i < E; i += 1) {
      const [a, b, c] = triples[i];
      keyToEdge.set(`${a},${b},${c}`, i);
    }

    const contain = Array.from({ length: E }, () => []);
    for (let fi = 0; fi < foursets.length; fi += 1) {
      const [a, b, c, d] = foursets[fi];
      const edgeIds = [
        keyToEdge.get(`${a},${b},${c}`),
        keyToEdge.get(`${a},${b},${d}`),
        keyToEdge.get(`${a},${c},${d}`),
        keyToEdge.get(`${b},${c},${d}`),
      ];
      for (const e of edgeIds) contain[e].push(fi);
    }

    let best = 0;
    for (let t = 0; t < trials; t += 1) {
      const ord = Array.from({ length: E }, (_, i) => i);
      shuffle(ord, rng);
      const cnt4 = new Uint8Array(foursets.length);
      let kept = 0;

      for (const e of ord) {
        let ok = true;
        for (const fi of contain[e]) {
          if (cnt4[fi] >= 3) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        kept += 1;
        for (const fi of contain[e]) cnt4[fi] += 1;
      }
      if (kept > best) best = kept;
    }

    return best / E;
  }

  const rng = makeRng(20260303 ^ 1303);
  const rows = [];
  for (const [n, trials] of [[12, 120], [16, 100], [20, 90]]) {
    const g = greedyLower(n, trials, rng);
    rows.push({
      n,
      random_greedy_best_density: Number(g.toPrecision(7)),
      turan_construction_density: Number(turanConstructionDensity(n).toPrecision(7)),
      razborov_upper_density: 0.5611666,
    });
  }

  out.results.ep500 = {
    description: 'Finite random-greedy lower-bound densities for K4^3-free 3-graphs.',
    rows,
  };
}

// EP-503: explicit lower-construction validity checks.
{
  function dist2(x, y) {
    let s = 0;
    for (let i = 0; i < x.length; i += 1) {
      const d = x[i] - y[i];
      s += d * d;
    }
    return s;
  }

  function allTriplesIsosceles(points, eps = 1e-9) {
    const n = points.length;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        for (let k = j + 1; k < n; k += 1) {
          const a = dist2(points[i], points[j]);
          const b = dist2(points[i], points[k]);
          const c = dist2(points[j], points[k]);
          if (Math.abs(a - b) > eps && Math.abs(a - c) > eps && Math.abs(b - c) > eps) return false;
        }
      }
    }
    return true;
  }

  const rows = [];
  for (let d = 2; d <= 8; d += 1) {
    const m = d + 1;
    const pts = [];
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        const v = Array(m).fill(0);
        v[i] = 1;
        v[j] = 1;
        pts.push(v);
      }
    }
    const centroid = Array(m).fill(2 / m);
    const ptsPlus = [...pts, centroid];

    rows.push({
      d,
      base_size_binom_dplus1_2: pts.length,
      base_valid: allTriplesIsosceles(pts),
      plus1_size: ptsPlus.length,
      plus1_valid: allTriplesIsosceles(ptsPlus),
      upper_bound_binom_dplus2_2: choose2(d + 2),
    });
  }

  out.results.ep503 = {
    description: 'Validity checks for known explicit lower constructions in the all-triples-isosceles problem.',
    rows,
  };
}

// EP-507: random upper-bound search for alpha(n) in unit disk.
{
  const rng = makeRng(20260303 ^ 1304);

  function randomPointDisk() {
    const r = Math.sqrt(rng());
    const t = 2 * Math.PI * rng();
    return [r * Math.cos(t), r * Math.sin(t)];
  }

  function minTriangleArea(points) {
    const n = points.length;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < n; i += 1) {
      const [xi, yi] = points[i];
      for (let j = i + 1; j < n; j += 1) {
        const [xj, yj] = points[j];
        for (let k = j + 1; k < n; k += 1) {
          const [xk, yk] = points[k];
          const area = 0.5 * Math.abs((xj - xi) * (yk - yi) - (xk - xi) * (yj - yi));
          if (area < best) best = area;
        }
      }
    }
    return best;
  }

  const rows = [];
  for (const [n, restarts] of [[20, 200], [40, 180], [70, 150], [100, 120]]) {
    let best = 0;
    let avg = 0;
    for (let t = 0; t < restarts; t += 1) {
      const pts = Array.from({ length: n }, () => randomPointDisk());
      const v = minTriangleArea(pts);
      avg += v;
      if (v > best) best = v;
    }
    rows.push({
      n,
      restarts,
      best_min_area_found: Number(best.toPrecision(7)),
      avg_min_area: Number((avg / restarts).toPrecision(7)),
      best_times_n_sq: Number((best * n * n).toPrecision(7)),
      best_times_n_pow_7_over_6: Number((best * n ** (7 / 6)).toPrecision(7)),
    });
  }

  out.results.ep507 = {
    description: 'Random finite upper-bound probes for Heilbronn triangle parameter alpha(n).',
    rows,
  };
}

// EP-508: finite unit-distance graph coloring checks.
{
  function chromaticNumber(n, edges) {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }
    const ord = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);

    function colorable(k) {
      const col = new Int8Array(n);
      col.fill(-1);
      function dfs(t) {
        if (t === n) return true;
        const v = ord[t];
        for (let c = 0; c < k; c += 1) {
          let ok = true;
          for (const u of adj[v]) {
            if (col[u] === c) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;
          col[v] = c;
          if (dfs(t + 1)) return true;
          col[v] = -1;
        }
        return false;
      }
      return dfs(0);
    }

    for (let k = 1; k <= n; k += 1) if (colorable(k)) return k;
    return n;
  }

  function unitEdges(points, eps = 1e-9) {
    const e = [];
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const d = Math.hypot(dx, dy);
        if (Math.abs(d - 1) < eps) e.push([i, j]);
      }
    }
    return e;
  }

  // Moser spindle from two rhombi sharing one acute vertex.
  const s = Math.sqrt(3) / 2;
  const t = 0.5856855434571508;
  const O = [0, 0];
  const A = [1, 0];
  const B = [0.5, s];
  const C = [1.5, s];
  const D = [Math.cos(t), Math.sin(t)];
  const E = [Math.cos(t + Math.PI / 3), Math.sin(t + Math.PI / 3)];
  const F = [D[0] + E[0], D[1] + E[1]];
  const moserPts = [O, A, B, C, D, E, F];
  const moserEdges = unitEdges(moserPts);

  // Triangular-lattice patches (unit-distance induced graph).
  function triPatch(m) {
    const pts = [];
    const s3 = Math.sqrt(3) / 2;
    for (let y = 0; y <= m; y += 1) {
      for (let x = 0; x <= m; x += 1) {
        pts.push([x + 0.5 * y, s3 * y]);
      }
    }
    return pts;
  }

  const rows = [];
  rows.push({
    graph: 'moser_spindle_7v',
    vertices: moserPts.length,
    edges: moserEdges.length,
    chromatic_number_exact: chromaticNumber(moserPts.length, moserEdges),
  });

  for (const m of [2, 3, 4]) {
    const pts = triPatch(m);
    const e = unitEdges(pts);
    rows.push({
      graph: `triangular_patch_m_${m}`,
      vertices: pts.length,
      edges: e.length,
      chromatic_number_exact: chromaticNumber(pts.length, e),
    });
  }

  out.results.ep508 = {
    description: 'Finite chromatic checks on benchmark unit-distance graphs in the plane.',
    rows,
  };
}

// EP-510: finite cosine-sum minima profiles.
{
  const rng = makeRng(20260303 ^ 1305);

  function minCosGrid(A, M = 4096) {
    let best = Infinity;
    let bestTheta = 0;
    for (let t = 0; t < M; t += 1) {
      const theta = (2 * Math.PI * t) / M;
      let s = 0;
      for (const n of A) s += Math.cos(n * theta);
      if (s < best) {
        best = s;
        bestTheta = theta;
      }
    }
    return { minSum: best, theta: bestTheta };
  }

  function randomSet(size, maxVal) {
    const S = new Set();
    while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
    return [...S];
  }

  function greedySidon(size, Nmax) {
    const A = [];
    const sums = new Set();
    for (let x = 1; x <= Nmax && A.length < size; x += 1) {
      let ok = true;
      for (const a of A) {
        const s = a + x;
        if (sums.has(s)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (const a of A) sums.add(a + x);
      sums.add(2 * x);
      A.push(x);
    }
    return A;
  }

  const rows = [];
  for (const [N, trials] of [[40, 120], [80, 100], [160, 80], [320, 60]]) {
    let bestNeg = 0;
    let avgNeg = 0;
    for (let t = 0; t < trials; t += 1) {
      const A = randomSet(N, 10 * N);
      const { minSum } = minCosGrid(A);
      const neg = -minSum;
      avgNeg += neg;
      if (neg > bestNeg) bestNeg = neg;
    }
    rows.push({
      family: 'random',
      N,
      trials,
      best_negative_min: Number(bestNeg.toPrecision(7)),
      avg_negative_min: Number((avgNeg / trials).toPrecision(7)),
      best_over_sqrtN: Number((bestNeg / Math.sqrt(N)).toPrecision(7)),
      best_over_N_pow_1_over_7: Number((bestNeg / (N ** (1 / 7))).toPrecision(7)),
    });
  }

  const B = greedySidon(20, 1200);
  const diff = new Set();
  for (const x of B) for (const y of B) diff.add(x - y);
  const Astruct = [...diff];
  const { minSum: sMin } = minCosGrid(Astruct);
  rows.push({
    family: 'sidon_difference_B_minus_B',
    N: Astruct.length,
    trials: 1,
    best_negative_min: Number((-sMin).toPrecision(7)),
    avg_negative_min: Number((-sMin).toPrecision(7)),
    best_over_sqrtN: Number(((-sMin) / Math.sqrt(Astruct.length)).toPrecision(7)),
    best_over_N_pow_1_over_7: Number(((-sMin) / (Astruct.length ** (1 / 7))).toPrecision(7)),
  });

  out.results.ep510 = {
    description: 'Grid-minimum cosine-sum profiles for random and structured sets A.',
    rows,
  };
}

// EP-520: random multiplicative function partial-sum limsup proxies.
{
  const N = 300000;
  const trials = 24;
  const primeList = primes.filter((p) => p <= N);
  const rng = makeRng(20260303 ^ 1306);

  const limsupRows = [];
  const samplePathMilestones = [5000, 20000, 50000, 100000, 200000, 300000];
  const samplePath = [];

  for (let tr = 0; tr < trials; tr += 1) {
    const sign = new Int8Array(N + 1);
    for (const p of primeList) sign[p] = rng() < 0.5 ? -1 : 1;

    const f = new Int8Array(N + 1);
    f[1] = 1;
    let S = 0;
    let limsupLIL = -Infinity;
    let limsupQuarter = -Infinity;

    for (let n = 1; n <= N; n += 1) {
      if (n > 1) {
        const p = spf[n];
        const m = Math.floor(n / p);
        if (m % p === 0) f[n] = 0;
        else f[n] = f[m] * sign[p];
      }
      S += f[n];

      if (n >= 20) {
        const ll = Math.log(Math.log(n));
        const rL = S / Math.sqrt(n * ll);
        const rQ = Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25));
        if (rL > limsupLIL) limsupLIL = rL;
        if (rQ > limsupQuarter) limsupQuarter = rQ;
      }

      if (tr === 0 && samplePathMilestones.includes(n)) {
        const ll = Math.log(Math.log(n));
        samplePath.push({
          n,
          S_n: S,
          S_over_sqrt_n_loglog_n: Number((S / Math.sqrt(n * ll)).toPrecision(7)),
          absS_over_sqrt_n_loglog_quarter: Number((Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25))).toPrecision(7)),
        });
      }
    }

    limsupRows.push({ trial: tr + 1, limsup_lil_norm: limsupLIL, limsup_quarter_norm: limsupQuarter });
  }

  const lilVals = limsupRows.map((r) => r.limsup_lil_norm).sort((a, b) => a - b);
  const qVals = limsupRows.map((r) => r.limsup_quarter_norm).sort((a, b) => a - b);

  function quant(arr, q) {
    const i = Math.max(0, Math.min(arr.length - 1, Math.floor(q * (arr.length - 1))));
    return arr[i];
  }

  out.results.ep520 = {
    description: 'Monte-Carlo limsup proxies for partial sums of random Rademacher multiplicative functions.',
    N,
    trials,
    summary: {
      lil_norm_mean: Number((lilVals.reduce((a, b) => a + b, 0) / lilVals.length).toPrecision(7)),
      lil_norm_median: Number(quant(lilVals, 0.5).toPrecision(7)),
      lil_norm_q90: Number(quant(lilVals, 0.9).toPrecision(7)),
      quarter_norm_mean: Number((qVals.reduce((a, b) => a + b, 0) / qVals.length).toPrecision(7)),
      quarter_norm_median: Number(quant(qVals, 0.5).toPrecision(7)),
      quarter_norm_q90: Number(quant(qVals, 0.9).toPrecision(7)),
    },
    sample_path_trial_1: samplePath,
  };
}

// EP-521: approximate real-root counts in [-1,1] for random +/-1 polynomials.
{
  const rng = makeRng(20260303 ^ 1307);

  function evalPoly(coeff, x) {
    let v = 0;
    for (let i = coeff.length - 1; i >= 0; i -= 1) v = v * x + coeff[i];
    return v;
  }

  function approxRootsInInterval(coeff, L, R, grid = 700) {
    const eps = 1e-10;
    let roots = 0;
    let prev = evalPoly(coeff, L);
    if (Math.abs(prev) < eps) prev = 0;

    for (let i = 1; i <= grid; i += 1) {
      const x = L + ((R - L) * i) / grid;
      let cur = evalPoly(coeff, x);
      if (Math.abs(cur) < eps) cur = 0;

      if (prev === 0 && cur === 0) {
        // skip flat near-zero numerics
      } else if (prev === 0 || cur === 0) {
        roots += 1;
      } else if (prev * cur < 0) {
        roots += 1;
      }

      prev = cur;
    }
    return roots;
  }

  const rows = [];
  for (const [n, trials] of [[150, 80], [300, 70], [600, 60], [900, 50]]) {
    let sumRoots = 0;
    let maxRoots = 0;

    for (let t = 0; t < trials; t += 1) {
      const coeff = Array.from({ length: n + 1 }, () => (rng() < 0.5 ? -1 : 1));
      const r = approxRootsInInterval(coeff, -1, 1, 700);
      sumRoots += r;
      if (r > maxRoots) maxRoots = r;
    }

    const avg = sumRoots / trials;
    rows.push({
      n,
      trials,
      approx_avg_roots_in_minus1_1: Number(avg.toPrecision(7)),
      approx_avg_over_log_n: Number((avg / Math.log(n)).toPrecision(7)),
      approx_max_roots_in_minus1_1: maxRoots,
    });
  }

  out.results.ep521 = {
    description: 'Approximate root-count profile in [-1,1] for random ±1-coefficient polynomials.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch13_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
