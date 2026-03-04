#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 25:
// EP-1085, EP-1086, EP-1094, EP-1095, EP-1097,
// EP-1103, EP-1104, EP-1105, EP-1109, EP-1110.

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

function bitIndexBigInt(bit) {
  let i = 0;
  let x = bit;
  while (x > 1n) {
    x >>= 1n;
    i += 1;
  }
  return i;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

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

function isSquarefree(n, spf) {
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    x = Math.floor(x / p);
    if (x % p === 0) return false;
    while (x % p === 0) x = Math.floor(x / p);
  }
  return true;
}

function vpFactorial(n, p) {
  let s = 0;
  let x = n;
  while (x > 0) {
    x = Math.floor(x / p);
    s += x;
  }
  return s;
}

function vpBinom(n, k, p) {
  return vpFactorial(n, p) - vpFactorial(k, p) - vpFactorial(n - k, p);
}

function leastPrimeFactorBinom(n, k, primes) {
  for (const p of primes) {
    if (p > n) break;
    if (vpBinom(n, k, p) > 0) return p;
  }
  return null;
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
    let m = masks[i];
    while (m) {
      const b = m & -m;
      const j = bitIndexBigInt(b);
      m ^= b;
      out[i].push(j);
    }
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

  function bronk(rSize, P, X) {
    if (P === 0n && X === 0n) {
      if (rSize > best) best = rSize;
      return;
    }
    if (rSize + popcountBigInt(P) <= best) return;

    let PX = P | X;
    let u = 0;
    if (PX !== 0n) u = bitIndexBigInt(PX & -PX);
    let cand = P & ~adjMasks[u];

    while (cand) {
      const bit = cand & -cand;
      const v = bitIndexBigInt(bit);
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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-1085: finite construction profile for unit-distance pair counts.
{
  const rows2 = [];
  for (let t = 4; t <= 20; t += 4) {
    const n = t * t;
    const unitPairs = 2 * t * (t - 1);
    rows2.push({
      t,
      n,
      unit_pairs_grid_2d: unitPairs,
      pairs_over_n_4_over_3: Number((unitPairs / (n ** (4 / 3))).toPrecision(7)),
      pairs_over_n_log_n: Number((unitPairs / (n * Math.log(n))).toPrecision(7)),
    });
  }

  const rows3 = [];
  for (let t = 3; t <= 11; t += 2) {
    const n = t ** 3;
    const unitPairs = 3 * t * t * (t - 1);
    rows3.push({
      t,
      n,
      unit_pairs_grid_3d: unitPairs,
      pairs_over_n_4_over_3: Number((unitPairs / (n ** (4 / 3))).toPrecision(7)),
      pairs_over_n_3_over_2: Number((unitPairs / (n ** (3 / 2))).toPrecision(7)),
    });
  }

  out.results.ep1085 = {
    description: 'Finite lattice-construction profile for unit-distance pair counts in d=2 and d=3.',
    rows_2d_grid: rows2,
    rows_3d_grid: rows3,
  };
}

// EP-1086: finite search for many equal-area triangles.
{
  const rng = makeRng(20260304 ^ 1086);

  function maxRepeatedArea(points) {
    const m = points.length;
    const cnt = new Map();
    let best = 0;
    for (let i = 0; i < m; i += 1) {
      const [x1, y1] = points[i];
      for (let j = i + 1; j < m; j += 1) {
        const [x2, y2] = points[j];
        for (let k = j + 1; k < m; k += 1) {
          const [x3, y3] = points[k];
          const area2 = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
          if (area2 === 0) continue;
          const c = (cnt.get(area2) || 0) + 1;
          cnt.set(area2, c);
          if (c > best) best = c;
        }
      }
    }
    return best;
  }

  function randomDistinctPoints(n, box) {
    const used = new Set();
    const pts = [];
    while (pts.length < n) {
      const x = Math.floor(rng() * box);
      const y = Math.floor(rng() * box);
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      used.add(key);
      pts.push([x, y]);
    }
    return pts;
  }

  const rows = [];
  for (const n of [12, 16, 20, 24]) {
    let best = 0;
    for (let t = 0; t < 240; t += 1) {
      const pts = randomDistinctPoints(n, 45);
      const b = maxRepeatedArea(pts);
      if (b > best) best = b;
    }
    rows.push({
      n,
      best_equal_area_triangle_count_found: best,
      normalized_best_over_n_squared: Number((best / (n * n)).toPrecision(7)),
    });
  }

  out.results.ep1086 = {
    description: 'Finite random-grid search for maximal multiplicity of a triangle area.',
    rows,
  };
}

// EP-1094: finite exception scan for least prime factor of C(n,k).
{
  const NMAX = 420;
  const { primes } = sievePrimes(NMAX);

  const exceptions = [];
  let tested = 0;
  for (let n = 4; n <= NMAX; n += 1) {
    for (let k = 2; k <= Math.floor(n / 2); k += 1) {
      if (n < 2 * k) continue;
      tested += 1;
      const lp = leastPrimeFactorBinom(n, k, primes);
      const bound = Math.max(n / k, k);
      if (lp > bound + 1e-12) exceptions.push({ n, k, least_prime_factor: lp, bound });
    }
  }

  out.results.ep1094 = {
    description: 'Finite exact scan of least prime factor condition for binomial coefficients.',
    NMAX,
    tested_pairs_n_k: tested,
    exception_count: exceptions.length,
    exception_sample_first_30: exceptions.slice(0, 30),
  };
}

// EP-1095: finite exact g(k) values for small k.
{
  const KMAX = 36;
  const N_CAP = 80_000;
  const { primes } = sievePrimes(Math.max(KMAX, N_CAP));

  const rows = [];
  for (let k = 2; k <= KMAX; k += 1) {
    let gk = null;
    for (let n = k + 2; n <= N_CAP; n += 1) {
      let hasSmallPrime = false;
      for (const p of primes) {
        if (p > k) break;
        if (vpBinom(n, k, p) > 0) {
          hasSmallPrime = true;
          break;
        }
      }
      if (!hasSmallPrime) {
        gk = n;
        break;
      }
    }
    rows.push({
      k,
      g_k_found: gk,
      found_within_cap: gk !== null,
      ratio_log_g_over_k_over_logk: gk && k > 2 ? Number((Math.log(gk) / (k / Math.log(k))).toPrecision(7)) : null,
    });
  }

  out.results.ep1095 = {
    description: 'Finite exact search for g(k): first n with all prime divisors of C(n,k) exceeding k.',
    KMAX,
    N_CAP,
    rows,
  };
}

// EP-1097: finite search for many distinct 3-AP differences.
{
  const rng = makeRng(20260304 ^ 1097);

  function differenceCount(A) {
    const s = new Set(A);
    const arr = [...A].sort((x, y) => x - y);
    const D = new Set();
    const m = arr.length;
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        const a = arr[i];
        const c = arr[j];
        if (((c - a) & 1) !== 0) continue;
        const b = (a + c) >> 1;
        if (s.has(b)) D.add((c - a) >> 1);
      }
    }
    return D.size;
  }

  function randomSet(n, M) {
    const arr = [...Array(M).keys()].map((x) => x + 1);
    shuffle(arr, rng);
    return arr.slice(0, n);
  }

  const rows = [];
  for (const n of [20, 28, 36, 44]) {
    const M = 8 * n;
    let best = 0;
    for (let t = 0; t < 2500; t += 1) {
      const A = randomSet(n, M);
      const d = differenceCount(A);
      if (d > best) best = d;
    }
    rows.push({
      n,
      M,
      best_distinct_d_found: best,
      ratio_over_n_3_over_2: Number((best / (n ** 1.5)).toPrecision(7)),
      ratio_over_n_log_n: Number((best / (n * Math.log(n))).toPrecision(7)),
    });
  }

  out.results.ep1097 = {
    description: 'Finite random-search profile for number of distinct 3-AP common differences.',
    rows,
  };
}

// EP-1103: finite greedy growth for infinite squarefree-sumset sequence proxy.
{
  const MAX_A = 20_000;
  const spf = sieveSPF(2 * MAX_A + 5);
  const A = [];

  function compatible(x) {
    if (!isSquarefree(2 * x, spf)) return false;
    for (const a of A) {
      if (!isSquarefree(a + x, spf)) return false;
    }
    return true;
  }

  for (let x = 1; x <= MAX_A; x += 1) {
    if (compatible(x)) A.push(x);
  }

  const probes = [200, 500, 1000, 2000, 5000, 10000, 20000];
  const rows = probes.map((x) => ({
    x,
    count_a_le_x: A.filter((a) => a <= x).length,
    count_over_log_x: Number((A.filter((a) => a <= x).length / Math.log(x)).toPrecision(7)),
  }));

  out.results.ep1103 = {
    description: 'Finite greedy-construction proxy for an infinite sequence A with A+A squarefree.',
    MAX_A,
    first_terms: A.slice(0, 40),
    rows,
  };
}

// EP-1104: finite triangle-free chromatic profile (Mycielski + random process).
{
  function mycielski(masks) {
    const n = masks.length;
    const outMasks = Array(2 * n + 1).fill(0n);
    for (let u = 0; u < n; u += 1) {
      let m = masks[u];
      while (m) {
        const b = m & -m;
        const v = bitIndexBigInt(b);
        m ^= b;
        if (u < v) {
          outMasks[u] |= 1n << BigInt(v);
          outMasks[v] |= 1n << BigInt(u);
          outMasks[u] |= 1n << BigInt(n + v);
          outMasks[n + v] |= 1n << BigInt(u);
          outMasks[v] |= 1n << BigInt(n + u);
          outMasks[n + u] |= 1n << BigInt(v);
        }
      }
    }
    const w = 2 * n;
    for (let u = 0; u < n; u += 1) {
      outMasks[n + u] |= 1n << BigInt(w);
      outMasks[w] |= 1n << BigInt(n + u);
    }
    return outMasks;
  }

  const c5 = adjacencyMasksFromEdgeList(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0],
  ]);
  const m1 = mycielski(c5);
  const m2 = mycielski(m1);
  const family = [c5, m1, m2];
  const familyRows = family.map((masks, i) => ({
    graph: i === 0 ? 'C5' : `Mycielski^${i}(C5)`,
    n: masks.length,
    chi_exact: chromaticNumberDSATUR(adjacencyListFromMasks(masks)),
  }));

  const rng = makeRng(20260304 ^ 1104);
  function triangleFreeProcess(n) {
    const edges = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
    }
    shuffle(edges, rng);
    const masks = Array(n).fill(0n);
    for (const [u, v] of edges) {
      if ((masks[u] & masks[v]) !== 0n) continue;
      masks[u] |= 1n << BigInt(v);
      masks[v] |= 1n << BigInt(u);
    }
    return masks;
  }

  const randomRows = [];
  for (const n of [18, 22, 26, 30]) {
    let bestChi = 0;
    for (let t = 0; t < 20; t += 1) {
      const masks = triangleFreeProcess(n);
      const chi = chromaticNumberDSATUR(adjacencyListFromMasks(masks));
      if (chi > bestChi) bestChi = chi;
    }
    randomRows.push({
      n,
      best_chi_found_in_samples: bestChi,
      proxy_sqrt_n_over_log_n: Number(Math.sqrt(n / Math.log(n)).toPrecision(7)),
      ratio_best_over_sqrt_n_over_log_n: Number((bestChi / Math.sqrt(n / Math.log(n))).toPrecision(7)),
    });
  }

  out.results.ep1104 = {
    description: 'Finite triangle-free chromatic profile from Mycielski constructions and random triangle-free process samples.',
    mycielski_rows: familyRows,
    random_rows: randomRows,
  };
}

// EP-1105: exact small-n anti-Ramsey for triangles (C3 case) via backtracking.
{
  function maxColorsNoRainbowTriangle(n) {
    const edges = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
    }
    const m = edges.length;
    const color = new Int16Array(m);
    color.fill(-1);

    // Triangles as edge-index triples.
    const edgeId = new Map();
    edges.forEach(([u, v], idx) => edgeId.set(`${u},${v}`, idx));
    const trianglesByEdge = Array.from({ length: m }, () => []);
    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        for (let c = b + 1; c < n; c += 1) {
          const e1 = edgeId.get(`${a},${b}`);
          const e2 = edgeId.get(`${a},${c}`);
          const e3 = edgeId.get(`${b},${c}`);
          trianglesByEdge[e1].push([e1, e2, e3]);
          trianglesByEdge[e2].push([e1, e2, e3]);
          trianglesByEdge[e3].push([e1, e2, e3]);
        }
      }
    }

    let best = 0;
    function dfs(pos, usedColors) {
      if (pos === m) {
        if (usedColors > best) best = usedColors;
        return;
      }
      if (usedColors + (m - pos) <= best) return;

      const maxTry = usedColors;
      for (let c = 0; c <= maxTry; c += 1) {
        color[pos] = c;
        let ok = true;
        for (const tri of trianglesByEdge[pos]) {
          const [e1, e2, e3] = tri;
          const c1 = color[e1];
          const c2 = color[e2];
          const c3 = color[e3];
          if (c1 === -1 || c2 === -1 || c3 === -1) continue;
          if (c1 !== c2 && c1 !== c3 && c2 !== c3) {
            ok = false;
            break;
          }
        }
        if (ok) dfs(pos + 1, Math.max(usedColors, c + 1));
        color[pos] = -1;
      }
    }

    dfs(0, 0);
    return best;
  }

  const rows = [];
  for (const n of [4, 5, 6]) {
    const ar = maxColorsNoRainbowTriangle(n);
    rows.push({
      n,
      exact_ar_n_C3: ar,
      n_minus_1: n - 1,
      matches_n_minus_1: ar === n - 1,
    });
  }

  out.results.ep1105 = {
    description: 'Exact small-n anti-Ramsey computation for C3 (rainbow-triangle avoidance).',
    rows,
  };
}

// EP-1109: finite exact f(N) for A subset [1,N] with (A+A) squarefree.
{
  const N_LIST = [30, 40, 50, 60, 70, 80];
  const NMAX = Math.max(...N_LIST);
  const spf = sieveSPF(2 * NMAX + 5);

  function exactF(N) {
    const allowed = [];
    for (let i = 1; i <= N; i += 1) if (isSquarefree(2 * i, spf)) allowed.push(i);
    const m = allowed.length;
    const compat = Array.from({ length: m }, () => Array(m).fill(false));
    for (let i = 0; i < m; i += 1) {
      for (let j = i; j < m; j += 1) {
        const ok = isSquarefree(allowed[i] + allowed[j], spf);
        compat[i][j] = ok;
        compat[j][i] = ok;
      }
    }

    const masks = Array(m).fill(0n);
    for (let i = 0; i < m; i += 1) {
      let ms = 0n;
      for (let j = 0; j < m; j += 1) {
        if (i === j) continue;
        if (compat[i][j]) ms |= 1n << BigInt(j);
      }
      masks[i] = ms;
    }
    return maxCliqueSizeFromAdjMasks(masks, m);
  }

  const rows = [];
  for (const N of N_LIST) {
    const fN = exactF(N);
    rows.push({
      N,
      exact_f_N: fN,
      f_over_log_N: Number((fN / Math.log(N)).toPrecision(7)),
      f_over_sqrt_N: Number((fN / Math.sqrt(N)).toPrecision(7)),
    });
  }

  out.results.ep1109 = {
    description: 'Exact finite maximum-set computation for A subset [1,N] with all sums squarefree.',
    rows,
  };
}

// EP-1110: finite representability profile for selected (p,q) pairs.
{
  function termsPQ(p, q, N) {
    const terms = [];
    for (let a = 0, pa = 1; pa <= N; a += 1, pa *= p) {
      for (let b = 0, qb = 1; pa * qb <= N; b += 1, qb *= q) {
        terms.push(pa * qb);
      }
    }
    terms.sort((x, y) => x - y);
    return [...new Set(terms)];
  }

  function representabilityProfile(p, q, N) {
    const terms = termsPQ(p, q, N);
    const m = terms.length;
    const comp = Array.from({ length: m }, () => Array(m).fill(false));
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        if (terms[j] % terms[i] === 0) {
          comp[i][j] = true;
          comp[j][i] = true;
        }
      }
    }

    const rep = new Uint8Array(N + 1);
    function dfs(idx, sum, chosen) {
      if (sum <= N) rep[sum] = 1;
      for (let i = idx; i < m; i += 1) {
        const t = terms[i];
        if (sum + t > N) break;
        let ok = true;
        for (const j of chosen) {
          if (comp[i][j]) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        chosen.push(i);
        dfs(i + 1, sum + t, chosen);
        chosen.pop();
      }
    }
    dfs(0, 0, []);

    let non = 0;
    let nonCoprimeToPQ = 0;
    const firstNon = [];
    for (let n = 1; n <= N; n += 1) {
      if (rep[n]) continue;
      non += 1;
      if (gcd(n, p * q) === 1) nonCoprimeToPQ += 1;
      if (firstNon.length < 30) firstNon.push(n);
    }
    return { terms_count: m, non_count: non, non_coprime_to_pq_count: nonCoprimeToPQ, first_nonrepresentable: firstNon };
  }

  const N = 5000;
  const rows = [
    { p: 5, q: 2, ...representabilityProfile(5, 2, N) },
    { p: 7, q: 3, ...representabilityProfile(7, 3, N) },
    { p: 11, q: 2, ...representabilityProfile(11, 2, N) },
  ];

  out.results.ep1110 = {
    description: 'Finite antichain-sum representability profile for selected coprime (p,q) pairs.',
    N,
    rows,
  };
}

const outPath = path.join('data', 'harder_batch25_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
