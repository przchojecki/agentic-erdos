#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 24:
// EP-1063, EP-1065, EP-1066, EP-1068, EP-1070,
// EP-1072, EP-1073, EP-1074, EP-1083, EP-1084.

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

function bitIndexBigInt(bit) {
  let i = 0;
  let x = bit;
  while (x > 1n) {
    x >>= 1n;
    i += 1;
  }
  return i;
}

// Exact chromatic number by DSATUR (small/medium graphs).
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

function adjacencyMasksFromEdgeList(n, edges) {
  const masks = Array(n).fill(0n);
  for (const [u, v] of edges) {
    masks[u] |= 1n << BigInt(v);
    masks[v] |= 1n << BigInt(u);
  }
  return masks;
}

function adjacencyListFromMasks(masks) {
  const n = masks.length;
  const out = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if ((masks[i] >> BigInt(j)) & 1n) out[i].push(j);
    }
  }
  return out;
}

function inducedMasks(parentMasks, picked) {
  const n = picked.length;
  const idx = new Map();
  for (let i = 0; i < n; i += 1) idx.set(picked[i], i);
  const out = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    const old = picked[i];
    let m = parentMasks[old];
    while (m) {
      const b = m & -m;
      const jOld = bitIndexBigInt(b);
      m ^= b;
      const j = idx.get(jOld);
      if (j !== undefined) out[i] |= 1n << BigInt(j);
    }
  }
  return out;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-1063: finite exact n_k for small k.
{
  function binomBig(n, k) {
    const kk = Math.min(k, n - k);
    let r = 1n;
    for (let i = 1; i <= kk; i += 1) {
      r = (r * BigInt(n - kk + i)) / BigInt(i);
    }
    return r;
  }

  const rows = [];
  for (let k = 2; k <= 12; k += 1) {
    let foundN = null;
    let failIndex = null;
    for (let n = 2 * k; n <= 6000; n += 1) {
      const b = binomBig(n, k);
      let fails = 0;
      let fi = -1;
      for (let i = 0; i < k; i += 1) {
        if (b % BigInt(n - i) !== 0n) {
          fails += 1;
          fi = i;
        }
      }
      if (fails === 1) {
        foundN = n;
        failIndex = fi;
        break;
      }
    }
    rows.push({
      k,
      n_k_found: foundN,
      failing_i_for_nk: failIndex,
      n_k_over_k: foundN ? Number((foundN / k).toPrecision(7)) : null,
    });
  }

  out.results.ep1063 = {
    description: 'Finite exact search for n_k where exactly one divisibility failure occurs among n-i | C(n,k).',
    rows,
  };
}

// EP-1065: finite counts of primes p=2^a q+1 and p=2^a 3^b q+1 (q prime).
{
  const LIMIT = 2_000_000;
  const { isPrime, primes } = sievePrimes(LIMIT);

  let c1 = 0;
  let c2 = 0;
  let pi = 0;
  const probeX = [100_000, 300_000, 700_000, 1_200_000, 2_000_000];
  let ptr = 0;
  const rows = [];

  for (const p of primes) {
    if (p < 3) continue;
    pi += 1;
    let n = p - 1;

    let ok1 = false;
    let t = n;
    while (t % 2 === 0) {
      t /= 2;
      if (t > 1 && isPrime[t]) {
        ok1 = true;
        break;
      }
    }
    if (ok1) c1 += 1;

    let ok2 = false;
    let a = n;
    while (a % 2 === 0) {
      a /= 2;
      let b = a;
      while (b % 3 === 0) {
        b /= 3;
        if (b > 1 && isPrime[b]) {
          ok2 = true;
          break;
        }
      }
      if (ok2) break;
    }
    if (ok2) c2 += 1;

    while (ptr < probeX.length && p >= probeX[ptr]) {
      rows.push({
        x: probeX[ptr],
        pi_x: pi,
        count_2a_q_plus_1: c1,
        count_2a3b_q_plus_1: c2,
        density_2a_q_plus_1_among_primes: Number((c1 / pi).toPrecision(7)),
        density_2a3b_q_plus_1_among_primes: Number((c2 / pi).toPrecision(7)),
      });
      ptr += 1;
    }
  }

  out.results.ep1065 = {
    description: 'Finite prime-count profile for the forms p=2^a q+1 and p=2^a 3^b q+1 with q prime.',
    LIMIT,
    rows,
  };
}

// EP-1066: finite proxy via induced subgraphs of triangular-lattice contact graphs.
{
  const rng = makeRng(20260304 ^ 1066);
  const W = 9;
  const H = 9;
  const coords = [];
  const pos = new Map();
  for (let x = 0; x < W; x += 1) {
    for (let y = 0; y < H; y += 1) {
      const id = coords.length;
      coords.push([x, y]);
      pos.set(`${x},${y}`, id);
    }
  }

  const dirs = [
    [1, 0],
    [0, 1],
    [1, -1],
    [-1, 0],
    [0, -1],
    [-1, 1],
  ];

  const baseEdges = [];
  for (let i = 0; i < coords.length; i += 1) {
    const [x, y] = coords[i];
    for (const [dx, dy] of dirs) {
      const j = pos.get(`${x + dx},${y + dy}`);
      if (j !== undefined && i < j) baseEdges.push([i, j]);
    }
  }
  const baseMasks = adjacencyMasksFromEdgeList(coords.length, baseEdges);

  function alphaOfInduced(n) {
    const verts = [...Array(coords.length).keys()];
    shuffle(verts, rng);
    const picked = verts.slice(0, n);
    const masks = inducedMasks(baseMasks, picked);
    const comp = Array(n).fill(0n);
    for (let i = 0; i < n; i += 1) {
      let m = 0n;
      for (let j = 0; j < n; j += 1) {
        if (i === j) continue;
        if (((masks[i] >> BigInt(j)) & 1n) === 0n) m |= 1n << BigInt(j);
      }
      comp[i] = m;
    }
    return maxCliqueSizeFromAdjMasks(comp, n);
  }

  const rows = [];
  for (const n of [18, 24, 30, 36]) {
    let bestAlpha = n;
    const samples = [];
    for (let t = 0; t < 10; t += 1) {
      const a = alphaOfInduced(n);
      samples.push(a);
      if (a < bestAlpha) bestAlpha = a;
    }
    rows.push({
      n,
      min_alpha_found_in_samples: bestAlpha,
      min_alpha_over_n: Number((bestAlpha / n).toPrecision(7)),
      sampled_alpha_values: samples,
    });
  }

  out.results.ep1066 = {
    description: 'Finite contact-graph proxy using induced subgraphs of a triangular-lattice unit-distance graph.',
    base_patch_size: [W, H],
    rows,
  };
}

// EP-1068: finite analogue on high-chromatic Mycielski graphs.
{
  function cycle5() {
    const n = 5;
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ];
    return adjacencyMasksFromEdgeList(n, edges);
  }

  function mycielski(masks) {
    const n = masks.length;
    const m2 = Array(2 * n + 1).fill(0n);

    for (let u = 0; u < n; u += 1) {
      let mu = masks[u];
      while (mu) {
        const b = mu & -mu;
        const v = bitIndexBigInt(b);
        mu ^= b;
        if (u < v) {
          m2[u] |= 1n << BigInt(v);
          m2[v] |= 1n << BigInt(u);
          m2[u] |= 1n << BigInt(n + v);
          m2[n + v] |= 1n << BigInt(u);
          m2[v] |= 1n << BigInt(n + u);
          m2[n + u] |= 1n << BigInt(v);
        }
      }
    }
    const w = 2 * n;
    for (let u = 0; u < n; u += 1) {
      m2[n + u] |= 1n << BigInt(w);
      m2[w] |= 1n << BigInt(n + u);
    }
    return m2;
  }

  function kCoreNumber(masks) {
    const n = masks.length;
    const deg = Array(n).fill(0);
    for (let i = 0; i < n; i += 1) {
      let c = 0;
      let m = masks[i];
      while (m) {
        m &= m - 1n;
        c += 1;
      }
      deg[i] = c;
    }
    let best = 0;
    for (let k = 1; k <= n; k += 1) {
      const alive = new Uint8Array(n);
      alive.fill(1);
      let changed = true;
      const d = [...deg];
      while (changed) {
        changed = false;
        for (let v = 0; v < n; v += 1) {
          if (!alive[v] || d[v] >= k) continue;
          alive[v] = 0;
          changed = true;
          let m = masks[v];
          while (m) {
            const b = m & -m;
            const u = bitIndexBigInt(b);
            m ^= b;
            if (alive[u]) d[u] -= 1;
          }
        }
      }
      if (alive.some((x) => x)) best = k;
    }
    return best;
  }

  function isConnectedAfterRemoving(masks, remSet) {
    const n = masks.length;
    const banned = new Uint8Array(n);
    for (const v of remSet) banned[v] = 1;
    let s = -1;
    for (let i = 0; i < n; i += 1) {
      if (!banned[i]) {
        s = i;
        break;
      }
    }
    if (s === -1) return true;
    const q = [s];
    const seen = new Uint8Array(n);
    seen[s] = 1;
    let head = 0;
    while (head < q.length) {
      const v = q[head++];
      let m = masks[v];
      while (m) {
        const b = m & -m;
        const u = bitIndexBigInt(b);
        m ^= b;
        if (banned[u] || seen[u]) continue;
        seen[u] = 1;
        q.push(u);
      }
    }
    for (let i = 0; i < n; i += 1) if (!banned[i] && !seen[i]) return false;
    return true;
  }

  function minVertexCutSize(masks, cap = 4) {
    const n = masks.length;
    if (!isConnectedAfterRemoving(masks, [])) return 0;
    for (let t = 1; t <= Math.min(cap, n - 1); t += 1) {
      const cur = [];
      function dfs(start) {
        if (cur.length === t) return !isConnectedAfterRemoving(masks, cur);
        for (let v = start; v < n; v += 1) {
          cur.push(v);
          if (dfs(v + 1)) return true;
          cur.pop();
        }
        return false;
      }
      if (dfs(0)) return t;
    }
    return cap + 1;
  }

  const g0 = cycle5();
  const g1 = mycielski(g0);
  const g2 = mycielski(g1);
  const family = [g0, g1, g2];

  const rows = family.map((masks, idx) => {
    const adj = adjacencyListFromMasks(masks);
    return {
      graph: idx === 0 ? 'C5' : `Mycielski^${idx}(C5)`,
      n: masks.length,
      chi_exact: chromaticNumberDSATUR(adj),
      k_core_max: kCoreNumber(masks),
      min_vertex_cut_size_up_to_cap4: minVertexCutSize(masks, 4),
    };
  });

  out.results.ep1068 = {
    description: 'Finite high-chromatic proxy on Mycielski graphs (not a transfinite analogue).',
    rows,
  };
}

// EP-1070: finite upper-bound proxy from Moser-spindle disjoint unions.
{
  // Moser spindle via Hajos construction from two K4.
  const n = 7;
  const edges = [
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
    [0, 4],
    [0, 5],
    [6, 4],
    [6, 5],
    [4, 5],
    [1, 6],
  ];
  const masks = adjacencyMasksFromEdgeList(n, edges);
  const adj = adjacencyListFromMasks(masks);

  const comp = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    let m = 0n;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      if (((masks[i] >> BigInt(j)) & 1n) === 0n) m |= 1n << BigInt(j);
    }
    comp[i] = m;
  }
  const alpha = maxCliqueSizeFromAdjMasks(comp, n);
  const chi = chromaticNumberDSATUR(adj);

  const rows = [];
  for (let t = 1; t <= 8; t += 1) {
    const N = 7 * t;
    const a = alpha * t;
    rows.push({
      n: N,
      disjoint_spindle_alpha: a,
      alpha_over_n: Number((a / N).toPrecision(7)),
    });
  }

  out.results.ep1070 = {
    description: 'Finite unit-distance upper-bound proxy using disjoint unions of a 7-vertex spindle graph.',
    spindle_component_stats: { n_vertices: n, n_edges: edges.length, alpha_component: alpha, chi_component: chi },
    rows,
  };
}

// EP-1072: finite profile of f(p), the least n with n! ≡ -1 mod p.
{
  const LIMIT = 50_000;
  const { isPrime, primes } = sievePrimes(LIMIT);
  const probeX = [5_000, 10_000, 20_000, 35_000, 50_000];
  let ptr = 0;

  let pi = 0;
  let countFpEqPminus1 = 0;
  let avgRatio = 0;
  const rows = [];
  const smallSamples = [];

  for (const p of primes) {
    if (p <= 3) continue;
    pi += 1;
    let fac = 1 % p;
    let f = p - 1;
    for (let n = 1; n < p; n += 1) {
      fac = (fac * n) % p;
      if (fac === p - 1) {
        f = n;
        break;
      }
      if (fac === 0) break;
    }
    if (f === p - 1) countFpEqPminus1 += 1;
    avgRatio += f / p;
    if (smallSamples.length < 20) smallSamples.push({ p, f_p: f, ratio: Number((f / p).toPrecision(7)) });

    while (ptr < probeX.length && p >= probeX[ptr]) {
      rows.push({
        x: probeX[ptr],
        pi_x: pi,
        count_f_p_eq_p_minus_1: countFpEqPminus1,
        proportion_f_p_eq_p_minus_1: Number((countFpEqPminus1 / pi).toPrecision(7)),
        mean_f_over_p_up_to_x: Number((avgRatio / pi).toPrecision(7)),
      });
      ptr += 1;
    }
  }

  out.results.ep1072 = {
    description: 'Finite exact computation of f(p) by modular factorial scan for primes p<=50,000.',
    LIMIT,
    sample_rows_small_primes: smallSamples,
    probe_rows: rows,
  };
}

// EP-1073: finite count A(x) for composite u with n! ≡ -1 mod u for some n.
{
  const X = 12_000;
  const { isPrime } = sievePrimes(X);
  const probes = [2_000, 4_000, 6_000, 8_000, 10_000, 12_000];
  let ptr = 0;

  let A = 0;
  const firstHits = [];
  const rows = [];

  for (let u = 4; u <= X; u += 1) {
    if (isPrime[u]) {
      while (ptr < probes.length && u >= probes[ptr]) {
        rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toPrecision(7)) });
        ptr += 1;
      }
      continue;
    }

    let fac = 1 % u;
    let ok = false;
    for (let n = 1; n < u; n += 1) {
      fac = (fac * n) % u;
      if (fac === u - 1) {
        ok = true;
        break;
      }
      if (fac === 0) break;
    }
    if (ok) {
      A += 1;
      if (firstHits.length < 24) firstHits.push(u);
    }

    while (ptr < probes.length && u >= probes[ptr]) {
      rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toPrecision(7)) });
      ptr += 1;
    }
  }

  out.results.ep1073 = {
    description: 'Finite composite-modulus scan for existence of n with n! ≡ -1 (mod u).',
    X,
    first_hits: firstHits,
    probe_rows: rows,
  };
}

// EP-1074: finite S,P profiles from prime congruence hits of m!+1.
{
  const LIMIT = 30_000;
  const { isPrime, primes } = sievePrimes(LIMIT);
  const S = new Set();
  const P = new Set();

  for (const p of primes) {
    if (p <= 3) continue;
    let fac = 1 % p;
    for (let m = 1; m < p; m += 1) {
      fac = (fac * m) % p;
      if (fac === p - 1) {
        if (p % m !== 1) {
          S.add(m);
          P.add(p);
          break;
        }
      }
      if (fac === 0) break;
    }
  }

  const rowsS = [];
  for (const x of [200, 500, 1000, 2000, 5000]) {
    let c = 0;
    for (const m of S) if (m <= x) c += 1;
    rowsS.push({ x, count_S_intersect_1_to_x: c, density: Number((c / x).toPrecision(7)) });
  }

  const rowsP = [];
  for (const x of [5000, 10000, 20000, 30000]) {
    let c = 0;
    let pi = 0;
    for (const p of primes) {
      if (p > x) break;
      pi += 1;
      if (P.has(p)) c += 1;
    }
    rowsP.push({ x, count_P_intersect_primes_to_x: c, pi_x: pi, proportion_in_primes: Number((c / pi).toPrecision(7)) });
  }

  out.results.ep1074 = {
    description: 'Finite density proxy for EHS-number set S and Pillai-prime set P from p<=30,000 scans.',
    LIMIT,
    sample_small_S: [...S].sort((a, b) => a - b).slice(0, 24),
    sample_small_P: [...P].sort((a, b) => a - b).slice(0, 24),
    rows_S: rowsS,
    rows_P: rowsP,
  };
}

// EP-1083: 3D grid distinct-distance counts (upper-bound-style construction).
{
  const rows = [];
  for (let t = 3; t <= 10; t += 1) {
    const sq = new Set();
    for (let dx = 0; dx < t; dx += 1) {
      for (let dy = 0; dy < t; dy += 1) {
        for (let dz = 0; dz < t; dz += 1) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          sq.add(dx * dx + dy * dy + dz * dz);
        }
      }
    }
    const n = t ** 3;
    const m = sq.size;
    rows.push({
      t,
      n,
      distinct_distances_count: m,
      n_to_2_over_3: t * t,
      ratio_m_over_n_2_over_3: Number((m / (t * t)).toPrecision(7)),
    });
  }

  out.results.ep1083 = {
    description: 'Finite distinct-distance profile on cubic-lattice point sets in R^3.',
    rows,
  };
}

// EP-1084: FCC-lattice block contact counts in 3D (lower-bound constructions).
{
  const neigh = [];
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      neigh.push([a, b, 0]);
      neigh.push([a, 0, b]);
      neigh.push([0, a, b]);
    }
  }

  const rows = [];
  for (let L = 4; L <= 10; L += 1) {
    const pts = [];
    const id = new Map();
    for (let x = 0; x < L; x += 1) {
      for (let y = 0; y < L; y += 1) {
        for (let z = 0; z < L; z += 1) {
          if ((x + y + z) % 2 !== 0) continue;
          const idx = pts.length;
          pts.push([x, y, z]);
          id.set(`${x},${y},${z}`, idx);
        }
      }
    }
    let edges = 0;
    for (const [x, y, z] of pts) {
      for (const [dx, dy, dz] of neigh) {
        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;
        if (id.has(`${nx},${ny},${nz}`)) edges += 1;
      }
    }
    edges = Math.floor(edges / 2);
    const n = pts.length;
    rows.push({
      L,
      n_points: n,
      unit_distance_pairs: edges,
      pairs_over_n: Number((edges / n).toPrecision(7)),
      deficit_from_6n: 6 * n - edges,
      deficit_over_n_2_over_3: Number(((6 * n - edges) / (n ** (2 / 3))).toPrecision(7)),
    });
  }

  out.results.ep1084 = {
    description: 'Finite 3D contact-number construction using parity-sublattice (FCC) blocks.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch24_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
