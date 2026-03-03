#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 3:
// EP-65, EP-66, EP-77, EP-78, EP-80, EP-82, EP-84, EP-86, EP-89, EP-90.

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

function chooseBigInt(n, k) {
  let kk = k;
  if (kk > n - kk) kk = n - kk;
  let num = 1n;
  let den = 1n;
  for (let i = 1; i <= kk; i += 1) {
    num *= BigInt(n - kk + i);
    den *= BigInt(i);
  }
  return num / den;
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function harmonicsRange(a, b) {
  let s = 0;
  for (let x = a; x <= b; x += 1) s += 1 / x;
  return s;
}

function harmonic(m) {
  let s = 0;
  for (let i = 1; i <= m; i += 1) s += 1 / i;
  return s;
}

function addEdgeList(n) {
  const edges = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  return edges;
}

function edgeKey(u, v) {
  return u < v ? `${u},${v}` : `${v},${u}`;
}

function countC4InGraph(n, edgeSet) {
  const adj = Array.from({ length: n }, () => []);
  for (const e of edgeSet) {
    const [u, v] = e.split(',').map(Number);
    adj[u].push(v);
    adj[v].push(u);
  }
  let c4 = 0;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      let common = 0;
      const nb = new Uint8Array(n);
      for (const x of adj[u]) nb[x] = 1;
      for (const x of adj[v]) if (nb[x]) common += 1;
      c4 += (common * (common - 1)) / 2;
    }
  }
  return Math.floor(c4 / 2);
}

function maxRegularInducedSubgraphSize(adj) {
  const n = adj.length;
  let best = 1;
  const limit = 1 << n;
  for (let mask = 1; mask < limit; mask += 1) {
    const sz = Math.floor(Math.log2(mask & -mask)); // cheap op; real size below
    void sz;
    const bits = [];
    for (let v = 0; v < n; v += 1) if ((mask >>> v) & 1) bits.push(v);
    if (bits.length <= best) continue;
    let target = -1;
    let ok = true;
    for (const v of bits) {
      let d = 0;
      for (const u of bits) if (u !== v && adj[v][u]) d += 1;
      if (target < 0) target = d;
      else if (d !== target) {
        ok = false;
        break;
      }
    }
    if (ok) best = bits.length;
  }
  return best;
}

function distinctSquaredDistances(points) {
  const set = new Set();
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      set.add(dx * dx + dy * dy);
    }
  }
  return set.size;
}

function countUnitPairsLattice(points, type) {
  const s = new Set(points.map((p) => `${p[0]},${p[1]}`));
  let cnt = 0;
  if (type === 'square') {
    const dirs = [
      [1, 0],
      [0, 1],
    ];
    for (const [x, y] of points) {
      for (const [dx, dy] of dirs) if (s.has(`${x + dx},${y + dy}`)) cnt += 1;
    }
    return cnt;
  }
  // triangular axial coordinates: unit neighbors are 6 directions; count oriented half.
  const dirs = [
    [1, 0],
    [0, 1],
    [1, -1],
  ];
  for (const [x, y] of points) {
    for (const [dx, dy] of dirs) if (s.has(`${x + dx},${y + dy}`)) cnt += 1;
  }
  return cnt;
}

function sqrtNGridPoints(n) {
  const m = Math.floor(Math.sqrt(n));
  const pts = [];
  for (let i = 0; i < m; i += 1) for (let j = 0; j < m; j += 1) pts.push([i, j]);
  while (pts.length < n) pts.push([m, pts.length - m * m]);
  return pts.slice(0, n);
}

function triPatchPoints(n) {
  const pts = [];
  let r = 0;
  while (pts.length < n) {
    for (let x = 0; x <= r; x += 1) {
      const y = r - x;
      pts.push([x, y]);
      if (pts.length >= n) break;
    }
    r += 1;
  }
  return pts.slice(0, n);
}

function randomPoints(n, rng) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([Math.floor(rng() * 1e6), Math.floor(rng() * 1e6)]);
  return pts;
}

function hypercubeData(d) {
  const V = 1 << d;
  const edges = [];
  const edgeId = new Map();
  for (let u = 0; u < V; u += 1) {
    for (let b = 0; b < d; b += 1) {
      const v = u ^ (1 << b);
      if (u < v) {
        const id = edges.length;
        edges.push([u, v]);
        edgeId.set(edgeKey(u, v), id);
      }
    }
  }

  const c4ByEdge = Array.from({ length: edges.length }, () => []);
  for (let u = 0; u < V; u += 1) {
    for (let i = 0; i < d; i += 1) {
      for (let j = i + 1; j < d; j += 1) {
        const a = u ^ (1 << i);
        const b = u ^ (1 << j);
        const c = u ^ (1 << i) ^ (1 << j);
        const cyc = [
          edgeId.get(edgeKey(u, a)),
          edgeId.get(edgeKey(u, b)),
          edgeId.get(edgeKey(a, c)),
          edgeId.get(edgeKey(b, c)),
        ];
        const uniq = [...new Set(cyc)];
        if (uniq.length !== 4) continue;
        for (const e of uniq) {
          const others = uniq.filter((x) => x !== e);
          c4ByEdge[e].push(others);
        }
      }
    }
  }
  return { edges, c4ByEdge };
}

const rng = makeRng(20260303);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Shared prime table for EP-66.
const { isPrime, primes } = sieve(800000);

// EP-65: cycle-length reciprocal sums for complete bipartite profile.
{
  const n = 400;
  const kList = [2, 4, 8, 16, 24, 32, 40];
  const rows = [];
  for (const k of kList) {
    const m = k * n;
    let a = Math.max(2, Math.floor(m / n));
    while (a < n && a * (n - a) < m) a += 1;
    if (a >= n) a = n - 1;
    const b = n - a;
    const minPart = Math.min(a, b);
    const recip = 0.5 * (harmonic(minPart) - 1);
    rows.push({
      n,
      k,
      target_edges_kn: m,
      bipartition: [a, b],
      edges_in_Kab: a * b,
      reciprocal_cycle_length_sum_even_cycles_only: Number(recip.toFixed(6)),
      reciprocal_sum_over_logk: Number((recip / Math.log(k)).toFixed(6)),
    });
  }
  out.results.ep65 = {
    description: 'Complete-bipartite cycle-length reciprocal profile at edge scale kn.',
    rows,
  };
}

// EP-66: finite profile for model sets A and 1_A * 1_A(n) / log n.
{
  const N = 200000;
  const models = [];

  const squares = new Uint8Array(N + 1);
  for (let t = 1; t * t <= N; t += 1) squares[t * t] = 1;
  models.push({ name: 'squares', ind: squares });

  const pset = new Uint8Array(N + 1);
  for (const p of primes) {
    if (p > N) break;
    pset[p] = 1;
  }
  models.push({ name: 'primes', ind: pset });

  const pow2 = new Uint8Array(N + 1);
  for (let v = 1; v <= N; v *= 2) pow2[v] = 1;
  models.push({ name: 'powers_of_2', ind: pow2 });

  const checkpoints = [20000, 50000, 100000, 150000, 200000];
  const rows = [];
  for (const model of models) {
    const vals = [];
    for (const n of checkpoints) {
      let r = 0;
      for (let a = 1; a <= n - 1; a += 1) if (model.ind[a] && model.ind[n - a]) r += 1;
      vals.push({
        n,
        conv_value: r,
        ratio_over_logn: Number((r / Math.log(n)).toFixed(6)),
      });
    }
    rows.push({ model: model.name, checkpoints: vals });
  }
  out.results.ep66 = {
    description: 'Finite self-convolution-over-log profile for simple model sets.',
    rows,
  };
}

// EP-77: explicit lower/upper kth-root bound windows from classic bounds.
{
  const rows = [];
  for (let k = 3; k <= 20; k += 1) {
    let n = 2;
    let best = 1;
    while (true) {
      const comb = Number(chooseBigInt(n, k));
      const expect = comb * 2 ** (1 - (k * (k - 1)) / 2);
      if (expect < 1) {
        best = n;
        n += 1;
      } else break;
    }
    const upper = Number(chooseBigInt(2 * k - 2, k - 1));
    rows.push({
      k,
      probabilistic_nonconstructive_lower_n: best,
      lower_root: Number(best ** (1 / k)).toFixed(6),
      erdos_szekeres_upper_n: upper,
      upper_root: Number(upper ** (1 / k)).toFixed(6),
    });
  }
  out.results.ep77 = {
    description: 'kth-root windows from classic diagonal Ramsey lower/upper bounds.',
    rows,
  };
}

// EP-78: random-coloring explicit witness search for small k.
{
  function countMonochK(n, k, bits) {
    const verts = Array.from({ length: n }, (_, i) => i);
    let bad = 0;
    function rec(start, left, cur) {
      if (left === 0) {
        let red = true;
        let blue = true;
        for (let i = 0; i < cur.length; i += 1) {
          for (let j = i + 1; j < cur.length; j += 1) {
            const a = cur[i];
            const b = cur[j];
            const id = a * n + b;
            const c = bits[id];
            red = red && c === 1;
            blue = blue && c === 0;
            if (!red && !blue) return;
          }
        }
        if (red || blue) bad += 1;
        return;
      }
      for (let x = start; x <= n - left; x += 1) {
        cur.push(verts[x]);
        rec(x + 1, left - 1, cur);
        cur.pop();
      }
    }
    rec(0, k, []);
    return bad;
  }

  const tests = [
    { k: 4, n: 17, trials: 120 },
    { k: 5, n: 30, trials: 60 },
    { k: 5, n: 35, trials: 40 },
  ];
  const rows = [];
  for (const { k, n, trials } of tests) {
    let knownConstructionBad = null;
    if (k === 4 && n === 17) {
      // Paley-type coloring on F_17: red iff difference is a nonzero square mod 17.
      const squares = new Set([1, 2, 4, 8, 9, 13, 15, 16]);
      const bits = new Uint8Array(n * n);
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          const d = (j - i + n) % n;
          const red = squares.has(d) ? 1 : 0;
          bits[i * n + j] = red;
          bits[j * n + i] = red;
        }
      }
      knownConstructionBad = countMonochK(n, k, bits);
    }

    let foundZero = false;
    let best = Infinity;
    for (let t = 0; t < trials; t += 1) {
      const bits = new Uint8Array(n * n);
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          const c = rng() < 0.5 ? 1 : 0;
          bits[i * n + j] = c;
          bits[j * n + i] = c;
        }
      }
      const bad = countMonochK(n, k, bits);
      if (bad < best) best = bad;
      if (bad === 0) {
        foundZero = true;
        break;
      }
    }
    rows.push({
      k,
      n_tested: n,
      trials,
      known_construction_monochromatic_Kk_count: knownConstructionBad,
      found_explicit_coloring_without_monochromatic_Kk: foundZero,
      best_monochromatic_Kk_count_found: best,
    });
  }
  out.results.ep78 = {
    description: 'Small-k explicit witness search by random 2-colorings.',
    rows,
  };
}

// EP-80: complete multipartite proxies (every edge in a triangle if >=3 parts).
{
  const n = 300;
  const rows = [];
  for (let t = 3; t <= 12; t += 1) {
    const parts = Array(t).fill(Math.floor(n / t));
    for (let i = 0; i < n % t; i += 1) parts[i] += 1;
    let edges = 0;
    for (let i = 0; i < t; i += 1) for (let j = i + 1; j < t; j += 1) edges += parts[i] * parts[j];
    let maxBook = 0;
    for (let i = 0; i < t; i += 1) {
      for (let j = i + 1; j < t; j += 1) {
        const common = n - parts[i] - parts[j];
        if (common > maxBook) maxBook = common;
      }
    }
    rows.push({
      n,
      parts_count_t: t,
      edge_density_c: Number((edges / (n * n)).toFixed(6)),
      max_book_size_in_model: maxBook,
      book_over_n: Number((maxBook / n).toFixed(6)),
    });
  }
  out.results.ep80 = {
    description: 'Complete-multipartite model profile for edge-density vs max book size.',
    rows,
  };
}

// EP-82: random-graph lower envelope for max regular induced subgraph size.
{
  const nList = [10, 12, 14, 16];
  const rows = [];
  for (const n of nList) {
    let worst = Infinity;
    const trials = 40;
    for (let t = 0; t < trials; t += 1) {
      const adj = Array.from({ length: n }, () => new Uint8Array(n));
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          if (rng() < 0.5) {
            adj[i][j] = 1;
            adj[j][i] = 1;
          }
        }
      }
      const v = maxRegularInducedSubgraphSize(adj);
      if (v < worst) worst = v;
    }
    rows.push({
      n,
      trials,
      worst_max_regular_induced_size_found: worst,
      ratio_over_logn: Number((worst / Math.log(n)).toFixed(6)),
    });
  }
  out.results.ep82 = {
    description: 'Random finite lower-envelope for guaranteed regular induced subgraph size.',
    rows,
  };
}

// EP-84: exact small-n cycle-set counts.
{
  function hasCycleLen(adj, n, L) {
    const used = new Uint8Array(n);
    function dfs(start, cur, depth) {
      if (depth === L) return adj[cur][start] === 1;
      used[cur] = 1;
      for (let nxt = 0; nxt < n; nxt += 1) {
        if (!adj[cur][nxt]) continue;
        if (used[nxt]) continue;
        if (nxt < start) continue;
        if (dfs(start, nxt, depth + 1)) {
          used[cur] = 0;
          return true;
        }
      }
      used[cur] = 0;
      return false;
    }
    for (let s = 0; s < n; s += 1) {
      used.fill(0);
      if (dfs(s, s, 1)) return true;
    }
    return false;
  }

  const rows = [];
  for (let n = 3; n <= 7; n += 1) {
    const edges = addEdgeList(n);
    const E = edges.length;
    const totalGraphs = 1 << E;
    const lim = n <= 6 ? totalGraphs : 30000;
    const sets = new Set();
    for (let mask = 0; mask < lim; mask += 1) {
      const adj = Array.from({ length: n }, () => new Uint8Array(n));
      for (let e = 0; e < E; e += 1) {
        if (((mask >>> e) & 1) === 0) continue;
        const [u, v] = edges[e];
        adj[u][v] = 1;
        adj[v][u] = 1;
      }
      let cycMask = 0;
      for (let L = 3; L <= n; L += 1) {
        if (hasCycleLen(adj, n, L)) cycMask |= 1 << (L - 3);
      }
      sets.add(cycMask);
    }
    rows.push({
      n,
      graphs_processed: lim,
      total_graphs_if_exhaustive: totalGraphs,
      distinct_cycle_sets_found: sets.size,
      normalized_over_2_pow_n: Number((sets.size / 2 ** n).toFixed(6)),
      exact: n <= 6,
    });
  }
  out.results.ep84 = {
    description: 'Small-n cycle-set counting profile (exact for n<=6, sampled for n=7).',
    rows,
  };
}

// EP-86: greedy C4-free subgraphs in Q_d.
{
  const rows = [];
  for (let d = 4; d <= 9; d += 1) {
    const { edges, c4ByEdge } = hypercubeData(d);
    let best = 0;
    const trials = 100;
    for (let t = 0; t < trials; t += 1) {
      const order = Array.from({ length: edges.length }, (_, i) => i);
      shuffle(order, rng);
      const inG = new Uint8Array(edges.length);
      let m = 0;
      for (const e of order) {
        let ok = true;
        for (const tri of c4ByEdge[e]) {
          if (inG[tri[0]] && inG[tri[1]] && inG[tri[2]]) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        inG[e] = 1;
        m += 1;
      }
      if (m > best) best = m;
    }
    rows.push({
      d,
      vertices: 2 ** d,
      total_edges: edges.length,
      best_C4_free_edges_found: best,
      density_over_total_edges: Number((best / edges.length).toFixed(6)),
      half_density_benchmark_edges: edges.length / 2,
    });
  }
  out.results.ep86 = {
    description: 'Random greedy lower profile for C4-free subgraphs of hypercubes.',
    rows,
  };
}

// EP-89 and EP-90: distance profiles on grid/random/triangular models.
{
  const nList = [256, 400, 625, 900];
  const rows89 = [];
  const rows90 = [];
  for (const n of nList) {
    const grid = sqrtNGridPoints(n);
    const tri = triPatchPoints(n);
    const rnd = randomPoints(n, rng);

    const dGrid = distinctSquaredDistances(grid);
    const dTri = distinctSquaredDistances(tri);
    const dRnd = distinctSquaredDistances(rnd);

    rows89.push({
      n,
      distinct_distances_grid: dGrid,
      distinct_distances_tri_patch: dTri,
      distinct_distances_random: dRnd,
      grid_ratio_over_n_over_sqrt_log_n: Number((dGrid / (n / Math.sqrt(Math.log(n)))).toFixed(6)),
    });

    const uGrid = countUnitPairsLattice(grid, 'square');
    const uTri = countUnitPairsLattice(tri, 'tri');
    rows90.push({
      n,
      unit_pairs_grid: uGrid,
      unit_pairs_tri_patch: uTri,
      grid_ratio_over_n_1_plus_1_over_loglog_n: Number((uGrid / n ** (1 + 1 / Math.log(Math.log(n)))).toFixed(6)),
      tri_ratio_over_n_1_plus_1_over_loglog_n: Number((uTri / n ** (1 + 1 / Math.log(Math.log(n)))).toFixed(6)),
    });
  }
  out.results.ep89 = {
    description: 'Distinct-distance finite profiles for grid/triangular/random point sets.',
    rows: rows89,
  };
  out.results.ep90 = {
    description: 'Unit-distance finite profiles for square-grid and triangular-lattice patches.',
    rows: rows90,
  };
}

const outPath = path.join('data', 'harder_batch3_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
