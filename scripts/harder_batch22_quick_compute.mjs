#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 22:
// EP-970, EP-978, EP-986, EP-997, EP-1005,
// EP-1011, EP-1016, EP-1017, EP-1021, EP-1039.

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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function modPow(base, exp, mod) {
  let b = base % mod;
  let e = exp;
  let out = 1n;
  while (e > 0n) {
    if (e & 1n) out = (out * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return out;
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

function isProbablePrime64(n) {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1n;
  }

  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
  for (const a0 of bases) {
    if (a0 >= n) continue;
    let x = modPow(a0, d, n);
    if (x === 1n || x === n - 1n) continue;
    let witness = true;
    for (let r = 1n; r < s; r += 1n) {
      x = (x * x) % n;
      if (x === n - 1n) {
        witness = false;
        break;
      }
    }
    if (witness) return false;
  }
  return true;
}

function pollardRho(n, rng) {
  if ((n & 1n) === 0n) return 2n;
  if (n % 3n === 0n) return 3n;

  while (true) {
    const c = BigInt(1 + Math.floor(rng() * 1_000_000));
    let x = BigInt(2 + Math.floor(rng() * 1_000_000));
    let y = x;
    let d = 1n;

    const f = (v) => (v * v + c) % n;
    while (d === 1n) {
      x = f(x);
      y = f(f(y));
      d = gcdBig(x - y, n);
    }
    if (d !== n) return d;
  }
}

function factorBig(n, out, rng) {
  if (n === 1n) return;
  if (isProbablePrime64(n)) {
    out.push(n);
    return;
  }
  const d = pollardRho(n, rng);
  factorBig(d, out, rng);
  factorBig(n / d, out, rng);
}

function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function graphEmpty(n) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  return { n, adj, m: 0 };
}

function addEdge(G, u, v) {
  if (u === v || G.adj[u][v]) return false;
  G.adj[u][v] = 1;
  G.adj[v][u] = 1;
  G.m += 1;
  return true;
}

function cloneGraph(G) {
  const H = graphEmpty(G.n);
  H.m = G.m;
  for (let i = 0; i < G.n; i += 1) H.adj[i].set(G.adj[i]);
  return H;
}

function graphToAdjLists(G) {
  const out = Array.from({ length: G.n }, () => []);
  for (let i = 0; i < G.n; i += 1) {
    for (let j = 0; j < G.n; j += 1) if (G.adj[i][j]) out[i].push(j);
  }
  return out;
}

// Exact chromatic number by DSATUR for small/medium n.
function chromaticNumberDSATUR(adj) {
  const n = adj.length;
  if (n === 0) return 0;

  const deg = new Int32Array(n);
  for (let v = 0; v < n; v += 1) deg[v] = adj[v].length;

  const colors = new Int16Array(n);
  colors.fill(-1);
  let best = n;

  function dfs(usedColors) {
    if (usedColors >= best) return;

    let left = 0;
    for (let v = 0; v < n; v += 1) if (colors[v] === -1) left += 1;
    if (left === 0) {
      if (usedColors < best) best = usedColors;
      return;
    }

    let pick = -1;
    let bestSat = -1;
    let bestDeg = -1;

    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const seen = new Uint8Array(usedColors);
      let sat = 0;
      for (const u of adj[v]) {
        const c = colors[u];
        if (c >= 0 && !seen[c]) {
          seen[c] = 1;
          sat += 1;
        }
      }
      if (sat > bestSat || (sat === bestSat && deg[v] > bestDeg)) {
        bestSat = sat;
        bestDeg = deg[v];
        pick = v;
      }
    }

    const forbidden = new Uint8Array(usedColors);
    for (const u of adj[pick]) {
      const c = colors[u];
      if (c >= 0) forbidden[c] = 1;
    }

    for (let c = 0; c < usedColors; c += 1) {
      if (forbidden[c]) continue;
      colors[pick] = c;
      dfs(usedColors);
      colors[pick] = -1;
    }

    colors[pick] = usedColors;
    dfs(usedColors + 1);
    colors[pick] = -1;
  }

  dfs(0);
  return best;
}

function maxCliqueSizeFromAdjMasks(adjMasks, n) {
  let best = 0;

  function popcountBigInt(x) {
    let v = x;
    let c = 0;
    while (v) {
      v &= v - 1n;
      c += 1;
    }
    return c;
  }

  function lsbIndex(x) {
    let i = 0;
    let v = x;
    while ((v & 1n) === 0n) {
      v >>= 1n;
      i += 1;
    }
    return i;
  }

  function bronk(rSize, P, X) {
    if (P === 0n && X === 0n) {
      if (rSize > best) best = rSize;
      return;
    }
    if (rSize + popcountBigInt(P) <= best) return;

    let PX = P | X;
    let u = 0;
    if (PX !== 0n) u = lsbIndex(PX);
    let cand = P & ~adjMasks[u];

    while (cand) {
      const bit = cand & -cand;
      const v = lsbIndex(bit);
      bronk(rSize + 1, P & adjMasks[v], X & adjMasks[v]);
      P &= ~bit;
      X |= bit;
      cand &= ~bit;
      if (rSize + popcountBigInt(P) <= best) return;
    }
  }

  let all = 0n;
  for (let i = 0; i < n; i += 1) all |= 1n << BigInt(i);
  bronk(0, all, 0n);
  return best;
}

function frac(x) {
  return x - Math.floor(x);
}

function edgeListOfCompleteGraph(n) {
  const edges = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  }
  return edges;
}

function triangleFreeProcess(n, rng) {
  const G = graphEmpty(n);
  const edges = edgeListOfCompleteGraph(n);
  shuffle(edges, rng);

  for (const [u, v] of edges) {
    let closesTriangle = false;
    for (let w = 0; w < n; w += 1) {
      if (G.adj[u][w] && G.adj[v][w]) {
        closesTriangle = true;
        break;
      }
    }
    if (!closesTriangle) addEdge(G, u, v);
  }
  return G;
}

function fareySequence(orderN) {
  const numer = [];
  const denom = [];

  let a = 0;
  let b = 1;
  let c = 1;
  let d = orderN;

  numer.push(a);
  denom.push(b);
  while (c <= orderN) {
    numer.push(c);
    denom.push(d);
    const k = Math.floor((orderN + b) / d);
    const e = k * c - a;
    const f = k * d - b;
    a = c;
    b = d;
    c = e;
    d = f;
  }
  return { numer, denom };
}

function longestSimilarOrderRunLength(numer, denom) {
  const L = numer.length;
  if (L <= 1) return L;

  function scan(dir) {
    let start = 0;
    let best = 1;
    for (let i = 1; i < L; i += 1) {
      const da = numer[i] - numer[i - 1];
      const db = denom[i] - denom[i - 1];
      const ok = dir > 0 ? da >= 0 && db >= 0 : da <= 0 && db <= 0;
      if (!ok) start = i - 1;
      const len = i - start + 1;
      if (len > best) best = len;
    }
    return best;
  }

  return Math.max(scan(1), scan(-1));
}

function cycleLengthsPresent(adj) {
  const n = adj.length;
  const lim = 1 << n;
  const found = new Uint8Array(n + 1);
  const adjMask = new Int32Array(n);
  for (let i = 0; i < n; i += 1) {
    let m = 0;
    for (let j = 0; j < n; j += 1) if (adj[i][j]) m |= 1 << j;
    adjMask[i] = m;
  }

  for (let s = 0; s < n; s += 1) {
    const states = new Int32Array(lim);
    states[1 << s] = 1 << s;

    for (let mask = 0; mask < lim; mask += 1) {
      if ((mask & (1 << s)) === 0) continue;
      let ends = states[mask];
      if (!ends) continue;

      const bits = mask.toString(2).replaceAll('0', '').length;
      while (ends) {
        const bit = ends & -ends;
        const v = Math.log2(bit) | 0;
        ends ^= bit;

        if (bits >= 3 && adj[v][s]) found[bits] = 1;

        let can = adjMask[v] & ~mask;
        while (can) {
          const b = can & -can;
          const u = Math.log2(b) | 0;
          can ^= b;
          states[mask | (1 << u)] |= 1 << u;
        }
      }
    }
  }
  return found;
}

function hasCycleLength6(adj) {
  return cycleLengthsPresent(adj)[6] === 1;
}

function randomGraphWithMEdges(n, m, rng) {
  const G = graphEmpty(n);
  const edges = edgeListOfCompleteGraph(n);
  shuffle(edges, rng);
  for (let i = 0; i < m && i < edges.length; i += 1) {
    const [u, v] = edges[i];
    addEdge(G, u, v);
  }
  return G;
}

function allTrianglesWithEdgeIds(adj) {
  const n = adj.length;
  const edgeId = new Map();
  let eid = 0;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (!adj[u][v]) continue;
      edgeId.set(`${u},${v}`, eid);
      eid += 1;
    }
  }

  const tris = [];
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      if (!adj[a][b]) continue;
      for (let c = b + 1; c < n; c += 1) {
        if (!adj[a][c] || !adj[b][c]) continue;
        const e1 = edgeId.get(`${a},${b}`);
        const e2 = edgeId.get(`${a},${c}`);
        const e3 = edgeId.get(`${b},${c}`);
        let mask = 0n;
        mask |= 1n << BigInt(e1);
        mask |= 1n << BigInt(e2);
        mask |= 1n << BigInt(e3);
        tris.push(mask);
      }
    }
  }
  return tris;
}

function greedyEdgeDisjointTrianglePacking(adj, rng, trials = 40) {
  const triMasks = allTrianglesWithEdgeIds(adj);
  if (triMasks.length === 0) return { best: 0, triangle_count: 0 };

  let best = 0;
  const idx = [...Array(triMasks.length).keys()];

  for (let t = 0; t < trials; t += 1) {
    shuffle(idx, rng);
    let used = 0n;
    let cnt = 0;
    for (const i of idx) {
      const m = triMasks[i];
      if (m & used) continue;
      used |= m;
      cnt += 1;
    }
    if (cnt > best) best = cnt;
  }
  return { best, triangle_count: triMasks.length };
}

function buildBipartitePlusInternalEdges(n, q, rng) {
  const a = Math.floor(n / 2);
  const b = n - a;
  const G = graphEmpty(n);

  for (let u = 0; u < a; u += 1) {
    for (let v = a; v < n; v += 1) addEdge(G, u, v);
  }

  const cand = [];
  for (let u = 0; u < a; u += 1) {
    for (let v = u + 1; v < a; v += 1) cand.push([u, v]);
  }
  shuffle(cand, rng);
  for (let i = 0; i < q && i < cand.length; i += 1) {
    const [u, v] = cand[i];
    addEdge(G, u, v);
  }
  return G;
}

function c6FreeGreedyGraph(n, rng) {
  const G = graphEmpty(n);
  const edges = edgeListOfCompleteGraph(n);
  shuffle(edges, rng);
  for (const [u, v] of edges) {
    addEdge(G, u, v);
    if (hasCycleLength6(G.adj)) {
      G.adj[u][v] = 0;
      G.adj[v][u] = 0;
      G.m -= 1;
    }
  }
  return G;
}

function complexMul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

function complexAbs(a) {
  return Math.hypot(a[0], a[1]);
}

function polyAbsFromRoots(z, roots) {
  let w = [1, 0];
  for (const r of roots) {
    w = complexMul(w, [z[0] - r[0], z[1] - r[1]]);
  }
  return complexAbs(w);
}

function estimateRhoByGrid(roots) {
  const step = 0.08;
  const bound = 1.2;
  const m = Math.floor((2 * bound) / step) + 1;
  let best = 0;
  let bestCenter = [0, 0];

  function insideAllBoundary(center, radius) {
    const M = 20;
    for (let t = 0; t < M; t += 1) {
      const ang = (2 * Math.PI * t) / M;
      const z = [center[0] + radius * Math.cos(ang), center[1] + radius * Math.sin(ang)];
      if (polyAbsFromRoots(z, roots) >= 1) return false;
    }
    return true;
  }

  for (let i = 0; i < m; i += 1) {
    const x = -bound + i * step;
    for (let j = 0; j < m; j += 1) {
      const y = -bound + j * step;
      const c = [x, y];
      if (polyAbsFromRoots(c, roots) >= 1) continue;

      let lo = 0;
      let hi = 0.8;
      for (let it = 0; it < 9; it += 1) {
        const mid = (lo + hi) / 2;
        if (insideAllBoundary(c, mid)) lo = mid;
        else hi = mid;
      }
      if (lo > best) {
        best = lo;
        bestCenter = c;
      }
    }
  }
  return { rho_est: best, center: bestCenter };
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-970: Jacobsthal-function finite profile for primorial and sampled squarefree n.
{
  const rng = makeRng(20260304 ^ 970);
  const plist = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  function jacobsthalFromFactors(factors) {
    let n = 1;
    for (const p of factors) n *= p;
    const blocked = new Uint8Array(n);
    for (const p of factors) {
      for (let i = 0; i < n; i += p) blocked[i] = 1;
    }

    let maxRun = 0;
    let cur = 0;
    for (let i = 0; i < n; i += 1) {
      if (blocked[i]) {
        cur += 1;
        if (cur > maxRun) maxRun = cur;
      } else cur = 0;
    }
    // Circular wrap.
    let pref = 0;
    while (pref < n && blocked[pref]) pref += 1;
    let suff = 0;
    while (suff < n && blocked[n - 1 - suff]) suff += 1;
    if (pref + suff > maxRun) maxRun = pref + suff;

    return { n, j_of_n: maxRun + 1 };
  }

  const primorialRows = [];
  let prod = 1;
  for (let k = 1; k <= 8; k += 1) {
    prod *= plist[k - 1];
    const factors = plist.slice(0, k);
    const { j_of_n } = jacobsthalFromFactors(factors);
    primorialRows.push({ k, n: prod, j_of_n, j_over_k2: Number((j_of_n / (k * k)).toPrecision(7)) });
  }

  const sampledRows = [];
  for (let k = 2; k <= 7; k += 1) {
    let best = { j: -1, n: 1, factors: [] };
    for (let t = 0; t < 140; t += 1) {
      const idx = [...Array(plist.length).keys()];
      shuffle(idx, rng);
      const pick = idx.slice(0, k).map((i) => plist[i]).sort((a, b) => a - b);
      let n = 1;
      for (const p of pick) n *= p;
      if (n > 2_000_000) continue;
      const { j_of_n } = jacobsthalFromFactors(pick);
      if (j_of_n > best.j) best = { j: j_of_n, n, factors: pick };
    }
    sampledRows.push({
      k,
      best_sampled_n: best.n,
      best_sampled_j_n: best.j,
      factorization: best.factors.join(' * '),
    });
  }

  out.results.ep970 = {
    description: 'Finite Jacobsthal-profile computation for squarefree moduli (primorial baseline + random samples).',
    primorial_rows: primorialRows,
    sampled_rows: sampledRows,
  };
}

// EP-978: exact finite factorization scan for squarefreeness of n^4+2.
{
  const rng = makeRng(20260304 ^ 978);
  const N = 3000;
  let squarefreeCount = 0;
  const probes = new Set([500, 1000, 2000, 3000]);
  const rows = [];
  const nonSquarefreeSamples = [];

  for (let n = 1; n <= N; n += 1) {
    const v = BigInt(n) ** 4n + 2n;
    const factors = [];
    factorBig(v, factors, rng);
    factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    let isSqFree = true;
    for (let i = 1; i < factors.length; i += 1) {
      if (factors[i] === factors[i - 1]) {
        isSqFree = false;
        break;
      }
    }
    if (isSqFree) squarefreeCount += 1;
    else if (nonSquarefreeSamples.length < 12) {
      const mp = new Map();
      for (const p of factors) mp.set(p.toString(), (mp.get(p.toString()) || 0) + 1);
      nonSquarefreeSamples.push({
        n,
        value: v.toString(),
        repeated_prime_factors: [...mp.entries()]
          .filter(([, e]) => e >= 2)
          .map(([p, e]) => `${p}^${e}`),
      });
    }

    if (probes.has(n)) {
      rows.push({
        n,
        squarefree_values_count: squarefreeCount,
        squarefree_density: Number((squarefreeCount / n).toPrecision(7)),
      });
    }
  }

  out.results.ep978 = {
    description: 'Exact finite scan of squarefreeness for n^4+2 using 64-bit-safe Pollard-rho factorization.',
    N,
    rows,
    sample_non_squarefree_values: nonSquarefreeSamples,
  };
}

// EP-986: finite random triangle-free constructions and exact independence profile (k=3 proxy).
{
  const rng = makeRng(20260304 ^ 986);
  const rows = [];

  for (const n of [22, 26, 30]) {
    let bestEdge = -1;
    let bestAlpha = null;

    for (let t = 0; t < 12; t += 1) {
      const G = triangleFreeProcess(n, rng);
      const masksComp = Array(n).fill(0n);
      for (let i = 0; i < n; i += 1) {
        let m = 0n;
        for (let j = 0; j < n; j += 1) {
          if (i === j) continue;
          if (!G.adj[i][j]) m |= 1n << BigInt(j);
        }
        masksComp[i] = m;
      }
      const alpha = maxCliqueSizeFromAdjMasks(masksComp, n);
      if (G.m > bestEdge || (G.m === bestEdge && alpha < bestAlpha)) {
        bestEdge = G.m;
        bestAlpha = alpha;
      }
    }

    rows.push({
      n,
      best_triangle_free_edges_found: bestEdge,
      corresponding_independence_number_alpha: bestAlpha,
      implied_lower_bound_R_3_alpha_plus_1_gt_n: `R(3,${bestAlpha + 1}) > ${n}`,
      edge_scale_over_n_3_over_2: Number((bestEdge / (n ** 1.5)).toPrecision(7)),
    });
  }

  out.results.ep986 = {
    description: 'Finite k=3 proxy: random triangle-free process with exact alpha(G) on sampled best graphs.',
    rows,
  };
}

// EP-997: sliding-window discrepancy profile for {alpha * p_n} on sampled irrational alphas.
{
  const N = 40_000;
  const { primes } = sievePrimes(500_000);
  const p = primes.slice(0, N);

  const alphaRows = [
    { name: 'sqrt2', val: Math.SQRT2 },
    { name: 'pi', val: Math.PI },
    { name: 'e', val: Math.E },
    { name: 'phi', val: (1 + Math.sqrt(5)) / 2 },
  ];
  const windows = [200, 500, 1000, 2000];
  const intervals = [
    [0, 0.5],
    [0, 1 / 3],
    [1 / 3, 2 / 3],
    [0.2, 0.7],
  ];

  const outRows = [];
  for (const a of alphaRows) {
    const vals = p.map((x) => frac(a.val * x));
    const stats = [];

    for (const k of windows) {
      let best = { relDev: -1, interval: null };
      for (const [L, R] of intervals) {
        const ind = new Uint8Array(N);
        for (let i = 0; i < N; i += 1) if (vals[i] >= L && vals[i] < R) ind[i] = 1;
        const pref = new Int32Array(N + 1);
        for (let i = 0; i < N; i += 1) pref[i + 1] = pref[i] + ind[i];

        let localBest = 0;
        for (let s = 0; s + k <= N; s += 97) {
          const c = pref[s + k] - pref[s];
          const dev = Math.abs(c - (R - L) * k) / k;
          if (dev > localBest) localBest = dev;
        }

        if (localBest > best.relDev) best = { relDev: localBest, interval: [L, R] };
      }
      stats.push({
        k,
        max_relative_deviation_found: Number(best.relDev.toPrecision(7)),
        interval: best.interval,
      });
    }
    outRows.push({ alpha: a.name, rows: stats });
  }

  out.results.ep997 = {
    description: 'Finite discrepancy scan for fractional parts of alpha times primes in sliding windows.',
    N,
    sampled_alphas: outRows,
  };
}

// EP-1005: exact finite f(n) from Farey sequences via similarly-ordered run lengths.
{
  const rows = [];
  for (const n of [40, 60, 80, 120, 160, 200, 240]) {
    const { numer, denom } = fareySequence(n);
    const runLen = longestSimilarOrderRunLength(numer, denom);
    const f = runLen - 1;
    rows.push({
      n,
      farey_length: numer.length,
      f_n_exact_in_this_computation: f,
      f_over_n: Number((f / n).toPrecision(7)),
    });
  }

  out.results.ep1005 = {
    description: 'Exact finite computation of similarly-ordered local window lengths in Farey sequences.',
    rows,
  };
}

// EP-1011: sampled max edges of triangle-free 4-chromatic graphs for small n.
{
  const rng = makeRng(20260304 ^ 1011);
  const rows = [];
  for (const n of [11, 12, 13, 14, 15, 16]) {
    let bestM = -1;
    let sampleCount = 0;
    for (let t = 0; t < 120; t += 1) {
      const G = triangleFreeProcess(n, rng);
      const chi = chromaticNumberDSATUR(graphToAdjLists(G));
      if (chi >= 4) {
        sampleCount += 1;
        if (G.m > bestM) bestM = G.m;
      }
    }

    rows.push({
      n,
      max_edges_seen_with_triangle_free_and_chi_ge_4: bestM,
      sampled_graphs_with_chi_ge_4: sampleCount,
      rwwy24_formula_floor_n_minus_3_sq_over_4_plus_6: Math.floor(((n - 3) * (n - 3)) / 4) + 6,
    });
  }

  out.results.ep1011 = {
    description: 'Finite random triangle-free process search for dense chi>=4 graphs at small n.',
    rows,
  };
}

// EP-1016: finite random search for pancyclic graphs with n+h edges.
{
  const rng = makeRng(20260304 ^ 1016);
  const rows = [];
  for (const n of [8, 9, 10, 11, 12]) {
    let bestH = null;
    let witnessM = null;
    for (let h = 0; h <= 12; h += 1) {
      const m = n + h;
      let found = false;
      for (let t = 0; t < 220; t += 1) {
        const G = randomGraphWithMEdges(n, m, rng);
        const cyc = cycleLengthsPresent(G.adj);
        let ok = true;
        for (let k = 3; k <= n; k += 1) {
          if (!cyc[k]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          found = true;
          break;
        }
      }
      if (found) {
        bestH = h;
        witnessM = m;
        break;
      }
    }

    rows.push({
      n,
      minimal_h_found_in_random_search: bestH,
      witness_edge_count_n_plus_h: witnessM,
      log2_n: Number(Math.log2(n).toPrecision(7)),
    });
  }

  out.results.ep1016 = {
    description: 'Finite random search profile for small-n pancyclicity threshold n+h.',
    rows,
    caveat: 'Random search provides upper-bound witnesses only; non-detection is not a lower-bound proof.',
  };
}

// EP-1017: edge-disjoint triangle packing in K4-free graphs above n^2/4 via explicit constructions.
{
  const rng = makeRng(20260304 ^ 1017);
  const rows = [];
  for (const n of [20, 26, 32]) {
    const base = Math.floor((n * n) / 4);
    for (const q of [1, 2, 3, 4, 5]) {
      const G = buildBipartitePlusInternalEdges(n, q, rng);
      const { best, triangle_count } = greedyEdgeDisjointTrianglePacking(G.adj, rng, 60);
      rows.push({
        n,
        edges: G.m,
        floor_n2_over_4: base,
        q_above_threshold: G.m - base,
        total_triangles_in_graph: triangle_count,
        best_greedy_edge_disjoint_triangles_found: best,
        verifies_best_ge_q_in_greedy_trials: best >= q,
      });
    }
  }

  out.results.ep1017 = {
    description: 'Finite exact packing checks for K4-free constructions with edges floor(n^2/4)+q.',
    rows,
  };
}

// EP-1021: finite C6-free greedy constructions (k=3 case where G_3 = C6).
{
  const rng = makeRng(20260304 ^ 1021);
  const rows = [];
  for (const n of [10, 12, 14]) {
    let best = -1;
    for (let t = 0; t < 16; t += 1) {
      const G = c6FreeGreedyGraph(n, rng);
      if (G.m > best) best = G.m;
    }
    rows.push({
      n,
      best_c6_free_edge_count_found: best,
      n_to_7_over_6: Number((n ** (7 / 6)).toPrecision(7)),
      ratio_best_over_n_7_over_6: Number((best / (n ** (7 / 6))).toPrecision(7)),
    });
  }

  out.results.ep1021 = {
    description: 'Finite C6-free greedy constructions as a concrete proxy for the k=3 (subdivision/C6) case.',
    rows,
  };
}

// EP-1039: grid-based radius estimates for largest discs in {|f|<1}.
{
  const rng = makeRng(20260304 ^ 1039);
  const rows = [];

  function rootsOnUnitCircle(n) {
    const r = [];
    for (let j = 0; j < n; j += 1) {
      const ang = (2 * Math.PI * j) / n;
      r.push([Math.cos(ang), Math.sin(ang)]);
    }
    return r;
  }

  function randomRootsInUnitDisk(n) {
    const roots = [];
    for (let i = 0; i < n; i += 1) {
      const ang = 2 * Math.PI * rng();
      const rad = Math.sqrt(rng());
      roots.push([rad * Math.cos(ang), rad * Math.sin(ang)]);
    }
    return roots;
  }

  for (const n of [8, 12, 16]) {
    const circ = rootsOnUnitCircle(n);
    const rand = randomRootsInUnitDisk(n);
    const e1 = estimateRhoByGrid(circ);
    const e2 = estimateRhoByGrid(rand);

    rows.push({
      n,
      circle_roots_rho_est: Number(e1.rho_est.toPrecision(7)),
      circle_roots_n_times_rho_est: Number((n * e1.rho_est).toPrecision(7)),
      random_roots_rho_est: Number(e2.rho_est.toPrecision(7)),
      random_roots_n_times_rho_est: Number((n * e2.rho_est).toPrecision(7)),
    });
  }

  out.results.ep1039 = {
    description: 'Finite grid-based geometric estimates for largest inscribed discs in polynomial lemniscate sublevel sets.',
    rows,
    caveat: 'These are coarse numerical estimates (grid + boundary sampling), not certified exact radii.',
  };
}

const outPath = path.join('data', 'harder_batch22_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
