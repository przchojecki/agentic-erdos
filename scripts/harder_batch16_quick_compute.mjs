#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 16:
// EP-620, EP-625, EP-633, EP-634, EP-642,
// EP-643, EP-652, EP-657, EP-668, EP-677.

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

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcmBig(a, b) {
  return (a / gcdBig(a, b)) * b;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function makeGraph(n) {
  const adj = Array.from({ length: n }, () => Array(n).fill(0));
  const neigh = Array.from({ length: n }, () => []);
  return { n, adj, neigh, m: 0 };
}

function addEdge(G, u, v) {
  if (u === v || G.adj[u][v]) return false;
  G.adj[u][v] = 1;
  G.adj[v][u] = 1;
  G.neigh[u].push(v);
  G.neigh[v].push(u);
  G.m += 1;
  return true;
}

function removeEdge(G, u, v) {
  if (!G.adj[u][v]) return false;
  G.adj[u][v] = 0;
  G.adj[v][u] = 0;
  G.neigh[u] = G.neigh[u].filter((x) => x !== v);
  G.neigh[v] = G.neigh[v].filter((x) => x !== u);
  G.m -= 1;
  return true;
}

function allEdges(n) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) out.push([i, j]);
  }
  return out;
}

function combinations(arr, k) {
  const out = [];
  const cur = [];

  function dfs(i, left) {
    if (left === 0) {
      out.push([...cur]);
      return;
    }
    for (let j = i; j <= arr.length - left; j += 1) {
      cur.push(arr[j]);
      dfs(j + 1, left - 1);
      cur.pop();
    }
  }

  dfs(0, k);
  return out;
}

function randomDistinctPoints(n, side, rng) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rng() * side);
    const y = Math.floor(rng() * side);
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    pts.push([x, y]);
  }
  return pts;
}

function lineKeyFromPoints(p, q) {
  let A = q[1] - p[1];
  let B = p[0] - q[0];
  let C = A * p[0] + B * p[1];
  const g = gcdInt(gcdInt(Math.abs(A), Math.abs(B)), Math.abs(C));
  if (g > 0) {
    A /= g;
    B /= g;
    C /= g;
  }
  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }
  return `${A},${B},${C}`;
}

function lineStats(points) {
  const n = points.length;
  const mp = new Map();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const key = lineKeyFromPoints(points[i], points[j]);
      if (!mp.has(key)) mp.set(key, new Set());
      mp.get(key).add(i);
      mp.get(key).add(j);
    }
  }
  const lineSizes = [];
  let maxCollinear = 1;
  for (const S of mp.values()) {
    lineSizes.push(S.size);
    if (S.size > maxCollinear) maxCollinear = S.size;
  }
  return { lineMap: mp, lineSizes, maxCollinear };
}

function pinnedRValues(points) {
  const n = points.length;
  const vals = [];
  for (let i = 0; i < n; i += 1) {
    const D = new Set();
    const [x1, y1] = points[i];
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const [x2, y2] = points[j];
      const dx = x1 - x2;
      const dy = y1 - y2;
      D.add(dx * dx + dy * dy);
    }
    vals.push(D.size);
  }
  vals.sort((a, b) => a - b);
  return vals;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-620: K4-free graphs and triangle-free induced subgraph size heuristics.
{
  const rng = makeRng(20260304 ^ 1601);

  function createsK4(G, u, v) {
    const common = [];
    for (let x = 0; x < G.n; x += 1) {
      if (G.adj[u][x] && G.adj[v][x]) common.push(x);
    }
    for (let i = 0; i < common.length; i += 1) {
      for (let j = i + 1; j < common.length; j += 1) {
        if (G.adj[common[i]][common[j]]) return true;
      }
    }
    return false;
  }

  function maximalK4Free(n) {
    const G = makeGraph(n);
    const edges = allEdges(n);
    shuffle(edges, rng);

    for (const [u, v] of edges) {
      if (createsK4(G, u, v)) continue;
      addEdge(G, u, v);
    }
    return G;
  }

  function largestTriangleFreeInducedHeuristic(G) {
    const n = G.n;
    const alive = Array(n).fill(true);

    while (true) {
      const triCount = Array(n).fill(0);
      let found = false;

      for (let a = 0; a < n; a += 1) {
        if (!alive[a]) continue;
        for (let b = a + 1; b < n; b += 1) {
          if (!alive[b] || !G.adj[a][b]) continue;
          for (let c = b + 1; c < n; c += 1) {
            if (!alive[c]) continue;
            if (G.adj[a][c] && G.adj[b][c]) {
              triCount[a] += 1;
              triCount[b] += 1;
              triCount[c] += 1;
              found = true;
            }
          }
        }
      }

      if (!found) break;

      let bestV = -1;
      let bestC = -1;
      for (let v = 0; v < n; v += 1) {
        if (!alive[v]) continue;
        if (triCount[v] > bestC) {
          bestC = triCount[v];
          bestV = v;
        }
      }
      if (bestV < 0) break;
      alive[bestV] = false;
    }

    let sz = 0;
    for (let v = 0; v < n; v += 1) if (alive[v]) sz += 1;
    return sz;
  }

  const rows = [];
  for (const [n, trials] of [[50, 8], [70, 7], [90, 6]]) {
    let best = 0;
    let avg = 0;
    let avgEdges = 0;

    for (let t = 0; t < trials; t += 1) {
      const G = maximalK4Free(n);
      avgEdges += G.m;
      const s = largestTriangleFreeInducedHeuristic(G);
      avg += s;
      if (s > best) best = s;
    }

    avg /= trials;
    avgEdges /= trials;

    rows.push({
      n,
      trials,
      avg_edges_in_random_maximal_K4_free_graph: Number(avgEdges.toPrecision(7)),
      best_triangle_free_induced_size_found: best,
      avg_triangle_free_induced_size_found: Number(avg.toPrecision(7)),
      best_over_sqrt_n: Number((best / Math.sqrt(n)).toPrecision(7)),
      best_over_n_pow_0_6: Number((best / (n ** 0.6)).toPrecision(7)),
    });
  }

  out.results.ep620 = {
    description: 'Random maximal K4-free graph probe for forced triangle-free induced subgraph size.',
    rows,
  };
}

// EP-625: random graph estimates for chi(G)-zeta(G).
{
  const rng = makeRng(20260304 ^ 1602);

  function randomGraph(n, p = 0.5) {
    const G = makeGraph(n);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (rng() < p) addEdge(G, i, j);
      }
    }
    return G;
  }

  function greedyChiUpper(G, restarts = 12) {
    const n = G.n;
    let best = n;

    for (let r = 0; r < restarts; r += 1) {
      const order = Array.from({ length: n }, (_, i) => i);
      shuffle(order, rng);
      const col = Array(n).fill(-1);
      let maxC = -1;

      for (const v of order) {
        const used = new Set();
        for (const u of G.neigh[v]) {
          if (col[u] >= 0) used.add(col[u]);
        }
        let c = 0;
        while (used.has(c)) c += 1;
        col[v] = c;
        if (c > maxC) maxC = c;
      }

      const num = maxC + 1;
      if (num < best) best = num;
    }
    return best;
  }

  function greedyZetaUpper(G, restarts = 16) {
    const n = G.n;
    let best = n;

    for (let r = 0; r < restarts; r += 1) {
      const order = Array.from({ length: n }, (_, i) => i);
      shuffle(order, rng);

      const classes = []; // {type:0 unknown,1 clique,2 indep, verts:number[]}

      for (const v of order) {
        let placed = false;

        // best-fit heuristic: prefer class with largest size.
        const idx = Array.from({ length: classes.length }, (_, i) => i);
        idx.sort((a, b) => classes[b].verts.length - classes[a].verts.length);

        for (const ci of idx) {
          const C = classes[ci];
          if (C.type === 1) {
            let ok = true;
            for (const u of C.verts) {
              if (!G.adj[u][v]) {
                ok = false;
                break;
              }
            }
            if (!ok) continue;
            C.verts.push(v);
            placed = true;
            break;
          } else if (C.type === 2) {
            let ok = true;
            for (const u of C.verts) {
              if (G.adj[u][v]) {
                ok = false;
                break;
              }
            }
            if (!ok) continue;
            C.verts.push(v);
            placed = true;
            break;
          } else {
            const u = C.verts[0];
            C.verts.push(v);
            C.type = G.adj[u][v] ? 1 : 2;
            placed = true;
            break;
          }
        }

        if (!placed) {
          classes.push({ type: 0, verts: [v] });
        }
      }

      if (classes.length < best) best = classes.length;
    }

    return best;
  }

  const rows = [];
  for (const [n, trials] of [[60, 8], [90, 6], [120, 5]]) {
    let sumChi = 0;
    let sumZeta = 0;
    let minDiff = Infinity;
    let maxDiff = -Infinity;

    for (let t = 0; t < trials; t += 1) {
      const G = randomGraph(n, 0.5);
      const chi = greedyChiUpper(G, 14);
      const zeta = greedyZetaUpper(G, 18);
      const diff = chi - zeta;

      sumChi += chi;
      sumZeta += zeta;
      if (diff < minDiff) minDiff = diff;
      if (diff > maxDiff) maxDiff = diff;
    }

    rows.push({
      n,
      trials,
      avg_greedy_chi_upper: Number((sumChi / trials).toPrecision(7)),
      avg_greedy_zeta_upper: Number((sumZeta / trials).toPrecision(7)),
      avg_gap_chi_minus_zeta: Number(((sumChi - sumZeta) / trials).toPrecision(7)),
      min_gap_observed: minDiff,
      max_gap_observed: maxDiff,
    });
  }

  out.results.ep625 = {
    description: 'Heuristic random-graph profile for chromatic minus cochromatic number.',
    rows,
  };
}

// EP-633 + EP-634: arithmetic coverage map from known constructive families.
{
  const NMAX = 260;
  const represented = new Set();

  // Universal square construction.
  for (let n = 1; n * n <= NMAX; n += 1) represented.add(n * n);

  // Soifer families.
  for (let n = 1; n * n <= NMAX; n += 1) {
    for (const c of [2, 3, 6]) {
      const v = c * n * n;
      if (v <= NMAX) represented.add(v);
    }
  }

  for (let a = 1; a * a <= NMAX; a += 1) {
    for (let b = 1; b * b <= NMAX; b += 1) {
      const v = a * a + b * b;
      if (v <= NMAX) represented.add(v);
    }
  }

  // Zhang 2025 family: n^2 * a * b for n >= 3*ceil((a^2+b^2+ab-a-b)/(ab)), a>=b.
  for (let a = 1; a <= 10; a += 1) {
    for (let b = 1; b <= a; b += 1) {
      const thresh = 3 * Math.ceil((a * a + b * b + a * b - a - b) / (a * b));
      for (let n = Math.max(1, thresh); n <= 20; n += 1) {
        const v = n * n * a * b;
        if (v <= NMAX) represented.add(v);
      }
    }
  }

  const missing = [];
  const nonSquareRepresented = [];
  for (let x = 1; x <= NMAX; x += 1) {
    if (!represented.has(x)) missing.push(x);
    const rt = Math.floor(Math.sqrt(x));
    if (represented.has(x) && rt * rt !== x) nonSquareRepresented.push(x);
  }

  out.results.ep633 = {
    description: 'Finite arithmetic map illustrating abundance of non-square congruent-tiling counts from known families.',
    NMAX,
    represented_non_square_count_up_to_NMAX: nonSquareRepresented.length,
    first_40_represented_non_squares: nonSquareRepresented.slice(0, 40),
  };

  out.results.ep634 = {
    description: 'Coverage of n-values reachable by currently recorded constructive families.',
    NMAX,
    represented_count_up_to_NMAX: represented.size,
    missing_count_up_to_NMAX: missing.length,
    first_50_missing_values: missing.slice(0, 50),
    checks: {
      contains_7: represented.has(7),
      contains_11: represented.has(11),
      contains_19: represented.has(19),
    },
  };
}

// EP-642: maximize edges under cycle-diagonal constraint (small n exact-check within greedy).
{
  const rng = makeRng(20260304 ^ 1604);

  function hasViolation(G) {
    const n = G.n;
    const seenMask = new Map();

    function checkCycle(path) {
      let mask = 0;
      for (const v of path) mask |= 1 << v;
      if (seenMask.has(mask)) return seenMask.get(mask);

      const S = path;
      let mS = 0;
      for (let i = 0; i < S.length; i += 1) {
        for (let j = i + 1; j < S.length; j += 1) {
          if (G.adj[S[i]][S[j]]) mS += 1;
        }
      }

      const viol = mS - S.length >= S.length;
      seenMask.set(mask, viol);
      return viol;
    }

    for (let s = 0; s < n; s += 1) {
      const visited = Array(n).fill(false);
      const path = [s];
      visited[s] = true;

      function dfs(u) {
        for (const v of G.neigh[u]) {
          if (v < s) continue;
          if (v === s) {
            if (path.length >= 3) {
              const second = path[1];
              const last = u;
              if (second < last && checkCycle(path)) return true;
            }
            continue;
          }
          if (visited[v]) continue;
          visited[v] = true;
          path.push(v);
          const bad = dfs(v);
          path.pop();
          visited[v] = false;
          if (bad) return true;
        }
        return false;
      }

      if (dfs(s)) return true;
    }

    return false;
  }

  function greedyMaxNoViolation(n, restarts) {
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const G = makeGraph(n);
      const edges = allEdges(n);
      shuffle(edges, rng);

      for (const [u, v] of edges) {
        addEdge(G, u, v);
        if (hasViolation(G)) removeEdge(G, u, v);
      }

      if (G.m > best) best = G.m;
    }

    return best;
  }

  const rows = [];
  for (const [n, restarts] of [[8, 22], [9, 18], [10, 14]]) {
    const best = greedyMaxNoViolation(n, restarts);
    rows.push({
      n,
      restarts,
      best_edges_found: best,
      best_over_n: Number((best / n).toPrecision(7)),
      best_over_n_log_n: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
    });
  }

  out.results.ep642 = {
    description: 'Small-n greedy maxima under exact cycle-diagonal violation checks.',
    rows,
  };
}

// EP-643: 3-uniform hypergraph avoiding A∪B=C∪D with disjoint pairs.
{
  const rng = makeRng(20260304 ^ 1605);

  function disjoint3(a, b) {
    return !(
      a[0] === b[0] || a[0] === b[1] || a[0] === b[2] ||
      a[1] === b[0] || a[1] === b[1] || a[1] === b[2] ||
      a[2] === b[0] || a[2] === b[1] || a[2] === b[2]
    );
  }

  function union6Key(a, b) {
    const U = [a[0], a[1], a[2], b[0], b[1], b[2]].sort((x, y) => x - y);
    return `${U[0]},${U[1]},${U[2]},${U[3]},${U[4]},${U[5]}`;
  }

  function greedyMax(n, restarts) {
    const verts = Array.from({ length: n }, (_, i) => i);
    const triples = combinations(verts, 3);
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const order = [...triples];
      shuffle(order, rng);

      const chosen = [];
      const pairCount = new Map();

      for (const e of order) {
        const touched = [];
        let bad = false;

        for (const f of chosen) {
          if (!disjoint3(e, f)) continue;
          const key = union6Key(e, f);
          const c = pairCount.get(key) || 0;
          if (c >= 1) {
            bad = true;
            break;
          }
          touched.push(key);
        }

        if (bad) continue;
        chosen.push(e);
        for (const key of touched) {
          pairCount.set(key, (pairCount.get(key) || 0) + 1);
        }
      }

      if (chosen.length > best) best = chosen.length;
    }

    return best;
  }

  const rows = [];
  for (const [n, restarts] of [[12, 24], [15, 18], [18, 14]]) {
    const best = greedyMax(n, restarts);
    rows.push({
      n,
      restarts,
      best_edges_found_t3: best,
      binom_n_2: choose2(n),
      best_over_binom_n_2: Number((best / choose2(n)).toPrecision(7)),
    });
  }

  out.results.ep643 = {
    description: 'Greedy lower-bound search for f(n;3)-type extremal size under union-equality obstruction.',
    rows,
  };
}

// EP-652: finite profiles for sorted pinned-distance counts.
{
  const rng = makeRng(20260304 ^ 1606);

  function gridPoints(m) {
    const pts = [];
    for (let x = 0; x < m; x += 1) {
      for (let y = 0; y < m; y += 1) pts.push([x, y]);
    }
    return pts;
  }

  const rows = [];
  for (const m of [10, 14]) {
    const pts = gridPoints(m);
    const n = pts.length;
    const R = pinnedRValues(pts);
    for (const k of [2, 4, 8, 16]) {
      if (k > n) continue;
      rows.push({
        family: 'grid',
        n,
        k,
        R_x_k: R[k - 1],
        R_x_k_over_sqrt_n: Number((R[k - 1] / Math.sqrt(n)).toPrecision(7)),
      });
    }
  }

  for (const n of [100, 196]) {
    const trials = 10;
    const best = new Map();
    for (const k of [2, 4, 8, 16]) best.set(k, Infinity);

    for (let t = 0; t < trials; t += 1) {
      const pts = randomDistinctPoints(n, 4000, rng);
      const R = pinnedRValues(pts);
      for (const k of [2, 4, 8, 16]) {
        const v = R[k - 1];
        if (v < best.get(k)) best.set(k, v);
      }
    }

    for (const k of [2, 4, 8, 16]) {
      rows.push({
        family: 'random_best_of_trials',
        n,
        trials,
        k,
        best_R_x_k_over_trials: best.get(k),
        best_R_x_k_over_sqrt_n: Number((best.get(k) / Math.sqrt(n)).toPrecision(7)),
      });
    }
  }

  out.results.ep652 = {
    description: 'Finite sorted pinned-distance profile R(x_k) for structured and random point sets.',
    rows,
  };
}

// EP-657: 1D AP-free surrogate search minimizing distinct differences.
{
  const rng = makeRng(20260304 ^ 1607);

  function isAPFree(setArr) {
    const S = new Set(setArr);
    const arr = [...setArr].sort((a, b) => a - b);
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) {
        const a = arr[i];
        const b = arr[j];
        const c = 2 * b - a;
        if (S.has(c)) return false;
      }
    }
    return true;
  }

  function canAddWithout3AP(S, x) {
    for (const a of S) {
      if (S.has(2 * a - x)) return false;
      if ((a + x) % 2 === 0 && S.has((a + x) / 2)) return false;
      if (S.has(2 * x - a)) return false;
    }
    return true;
  }

  function diffCount(S) {
    const arr = [...S].sort((a, b) => a - b);
    const D = new Set();
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) D.add(arr[j] - arr[i]);
    }
    return D.size;
  }

  function randomAPFreeSet(n, M) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const perm = Array.from({ length: M }, (_, i) => i + 1);
      shuffle(perm, rng);
      const S = new Set();
      for (const x of perm) {
        if (S.size >= n) break;
        if (canAddWithout3AP(S, x)) S.add(x);
      }
      if (S.size === n) return S;
    }
    return null;
  }

  function improveSet(S, M, iters) {
    let best = diffCount(S);

    for (let it = 0; it < iters; it += 1) {
      const arr = [...S];
      const rem = arr[Math.floor(rng() * arr.length)];
      S.delete(rem);

      let added = null;
      for (let tr = 0; tr < 35; tr += 1) {
        const x = 1 + Math.floor(rng() * M);
        if (S.has(x)) continue;
        if (!canAddWithout3AP(S, x)) continue;
        added = x;
        break;
      }

      if (added === null) {
        S.add(rem);
        continue;
      }

      S.add(added);
      const cur = diffCount(S);
      if (cur <= best) {
        best = cur;
      } else {
        S.delete(added);
        S.add(rem);
      }
    }

    return best;
  }

  const rows = [];
  for (const n of [10, 12, 14]) {
    const M = 6 * n;
    const restarts = 36;
    let best = Infinity;

    for (let r = 0; r < restarts; r += 1) {
      const S = randomAPFreeSet(n, M);
      if (!S) continue;
      const cur = improveSet(S, M, 1500);
      if (cur < best) best = cur;
    }

    rows.push({
      n,
      ambient_interval_size_M: M,
      restarts,
      best_distinct_differences_found: best,
      best_over_n: Number((best / n).toPrecision(7)),
      best_over_n_log_n: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
    });
  }

  out.results.ep657 = {
    description: '1D AP-free difference-minimization surrogate for no-isosceles-distance growth behavior.',
    rows,
  };
}

// EP-668: random lattice search for many unit distances and multiplicity of maximizers found.
{
  const rng = makeRng(20260304 ^ 1608);

  function randomPointSetFromLattice(n, side) {
    const all = [];
    for (let x = 0; x < side; x += 1) {
      for (let y = 0; y < side; y += 1) all.push([x, y]);
    }
    shuffle(all, rng);
    return all.slice(0, n);
  }

  function unitEdgeCount(pts) {
    let c = 0;
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        if (dx * dx + dy * dy === 1) c += 1;
      }
    }
    return c;
  }

  function signature(pts) {
    const D = [];
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        D.push(dx * dx + dy * dy);
      }
    }
    D.sort((a, b) => a - b);
    return D.join(',');
  }

  const rows = [];
  for (const [n, side, trials] of [[4, 5, 6000], [5, 6, 8000], [6, 7, 12000], [7, 8, 16000]]) {
    let best = -1;
    const sig = new Set();

    for (let t = 0; t < trials; t += 1) {
      const pts = randomPointSetFromLattice(n, side);
      const u = unitEdgeCount(pts);
      if (u > best) {
        best = u;
        sig.clear();
        sig.add(signature(pts));
      } else if (u === best) {
        sig.add(signature(pts));
      }
    }

    rows.push({
      n,
      lattice_side: side,
      trials,
      best_unit_edges_found: best,
      distinct_distance_multiset_signatures_at_best: sig.size,
    });
  }

  out.results.ep668 = {
    description: 'Random lattice search for extremal unit-edge counts and multiplicity of best signatures.',
    rows,
  };
}

// EP-677: collision search for M(n,k)=lcm(n+1,...,n+k).
{
  function M(n, k) {
    let v = 1n;
    for (let i = 1; i <= k; i += 1) {
      v = lcmBig(v, BigInt(n + i));
    }
    return v;
  }

  const NMAX = 500;
  const KMAX = 8;

  const collisionsSameK = [];
  const crossKCollisions = [];

  for (let k = 2; k <= KMAX; k += 1) {
    const seen = new Map();
    for (let n = 1; n <= NMAX; n += 1) {
      const v = M(n, k).toString();
      if (!seen.has(v)) seen.set(v, []);
      const prev = seen.get(v);

      for (const m0 of prev) {
        const a = Math.min(m0, n);
        const b = Math.max(m0, n);
        if (b >= a + k) {
          collisionsSameK.push({ k, n: a, m: b, lcm_value_digits: v.length });
        }
      }

      prev.push(n);
    }
  }

  // Search M(n,k)=M(m,l) with l<k, m>=n+k, small ranges.
  const vals = [];
  for (let k = 2; k <= 6; k += 1) {
    for (let n = 1; n <= 200; n += 1) {
      vals.push({ n, k, v: M(n, k).toString() });
    }
  }

  const byValue = new Map();
  for (const r of vals) {
    if (!byValue.has(r.v)) byValue.set(r.v, []);
    byValue.get(r.v).push(r);
  }

  for (const arr of byValue.values()) {
    if (arr.length < 2) continue;
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) {
        const a = arr[i];
        const b = arr[j];
        let x = a;
        let y = b;
        if (x.k < y.k) {
          const t = x;
          x = y;
          y = t;
        }
        if (y.k >= x.k) continue;
        if (y.n >= x.n + x.k) {
          crossKCollisions.push({ n: x.n, k: x.k, m: y.n, l: y.k });
        }
      }
    }
  }

  out.results.ep677 = {
    description: 'Finite collision scan for equal interval-LCM values.',
    search_limits: {
      n_up_to_same_k: NMAX,
      k_up_to_same_k: KMAX,
      n_up_to_cross_k: 200,
      k_up_to_cross_k: 6,
    },
    same_k_collisions_count: collisionsSameK.length,
    first_40_same_k_collisions: collisionsSameK.slice(0, 40),
    cross_k_collisions_count: crossKCollisions.length,
    first_40_cross_k_collisions: crossKCollisions.slice(0, 40),
  };
}

const outPath = path.join('data', 'harder_batch16_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
