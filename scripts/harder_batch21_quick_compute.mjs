#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 21:
// EP-931, EP-934, EP-936, EP-939, EP-942,
// EP-944, EP-945, EP-955, EP-959, EP-969.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
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

function factorDistinctSmall(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
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

function factorNumber(n, primes) {
  let x = n;
  const out = [];
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  if (x > 1) out.push([x, 1]);
  return out;
}

function isPowerfulFromFactorization(factors, r = 2) {
  if (factors.length === 0) return false;
  for (const [, e] of factors) {
    if (e < r) return false;
  }
  return true;
}

function makeGraph(n) {
  return Array.from({ length: n }, () => []);
}

function addEdge(adj, u, v) {
  if (u === v) return;
  adj[u].push(v);
  adj[v].push(u);
}

function copyAdj(adj) {
  return adj.map((x) => [...x]);
}

function edgesOfGraph(adj) {
  const out = [];
  for (let u = 0; u < adj.length; u += 1) {
    for (const v of adj[u]) if (u < v) out.push([u, v]);
  }
  return out;
}

function removeEdge(adj, a, b) {
  adj[a] = adj[a].filter((x) => x !== b);
  adj[b] = adj[b].filter((x) => x !== a);
}

function inducedSubgraph(adj, keep) {
  const idx = new Map();
  for (let i = 0; i < keep.length; i += 1) idx.set(keep[i], i);
  const out = makeGraph(keep.length);
  for (let i = 0; i < keep.length; i += 1) {
    const oldU = keep[i];
    for (const oldV of adj[oldU]) {
      const j = idx.get(oldV);
      if (j !== undefined && i < j) addEdge(out, i, j);
    }
  }
  return out;
}

// Exact chromatic number by DSATUR (works for small/medium n).
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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-931: finite search for equal-prime-support products of consecutive blocks.
{
  const NMAX = 240;
  const KMAX = 12;
  const LIM = NMAX + KMAX + 5;
  const spf = sieveSPF(LIM);

  const distinctFactors = Array.from({ length: LIM + 1 }, () => []);
  for (let x = 2; x <= LIM; x += 1) distinctFactors[x] = factorDistinctSmall(x, spf);

  function blockSignature(n, k) {
    // block is n+1,...,n+k
    const s = new Set();
    for (let t = 1; t <= k; t += 1) {
      for (const p of distinctFactors[n + t]) s.add(p);
    }
    return [...s].sort((a, b) => a - b).join('.');
  }

  const groups = new Map();
  for (let n = 0; n <= NMAX; n += 1) {
    for (let k = 3; k <= KMAX; k += 1) {
      if (n + k > LIM - 2) continue;
      const sig = blockSignature(n, k);
      if (!groups.has(sig)) groups.set(sig, []);
      groups.get(sig).push({ n, k });
    }
  }

  let pairCount = 0;
  const samples = [];
  let hasKnownCounterexample = false;

  for (const arr of groups.values()) {
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = 0; j < arr.length; j += 1) {
        if (i === j) continue;
        const a = arr[i];
        const b = arr[j];
        if (a.k < b.k) continue;
        if (b.n < a.n + a.k) continue;
        pairCount += 1;
        if (samples.length < 16) {
          samples.push({ n1: a.n, k1: a.k, n2: b.n, k2: b.k });
        }
        if (a.n === 0 && a.k === 10 && b.n === 13 && b.k === 3) hasKnownCounterexample = true;
      }
    }
  }

  out.results.ep931 = {
    description: 'Finite search for pairs of consecutive blocks with equal prime-support signatures.',
    NMAX,
    KMAX,
    admissible_pairs_found: pairCount,
    contains_alphaproof_counterexample_0_10_vs_13_3: hasKnownCounterexample,
    sample_pairs: samples,
  };
}

// EP-934: line-graph-distance proxy on C5 blow-up extremal constructions.
{
  function c5BlowupEvenD(d) {
    const q = Math.floor(d / 2);
    const sizes = [q, q, q, q, q];
    const offsets = [0];
    for (let i = 1; i < 5; i += 1) offsets[i] = offsets[i - 1] + sizes[i - 1];
    const n = offsets[4] + sizes[4];
    const adj = makeGraph(n);

    function vertex(part, idx) {
      return offsets[part] + idx;
    }

    for (let p = 0; p < 5; p += 1) {
      const np = (p + 1) % 5;
      for (let i = 0; i < sizes[p]; i += 1) {
        for (let j = 0; j < sizes[np]; j += 1) {
          addEdge(adj, vertex(p, i), vertex(np, j));
        }
      }
    }
    return adj;
  }

  function lineGraphDiameter(adj) {
    const edges = edgesOfGraph(adj);
    const m = edges.length;
    if (m <= 1) return 0;

    const inc = Array.from({ length: adj.length }, () => []);
    for (let i = 0; i < m; i += 1) {
      const [u, v] = edges[i];
      inc[u].push(i);
      inc[v].push(i);
    }

    const lg = Array.from({ length: m }, () => new Set());
    for (let v = 0; v < adj.length; v += 1) {
      const list = inc[v];
      for (let i = 0; i < list.length; i += 1) {
        for (let j = i + 1; j < list.length; j += 1) {
          lg[list[i]].add(list[j]);
          lg[list[j]].add(list[i]);
        }
      }
    }

    let diam = 0;
    for (let s = 0; s < m; s += 1) {
      const dist = new Int16Array(m);
      dist.fill(-1);
      const q = [s];
      dist[s] = 0;
      let head = 0;
      while (head < q.length) {
        const x = q[head++];
        for (const y of lg[x]) {
          if (dist[y] !== -1) continue;
          dist[y] = dist[x] + 1;
          q.push(y);
        }
      }
      for (let i = 0; i < m; i += 1) if (dist[i] > diam) diam = dist[i];
    }
    return diam;
  }

  const rows = [];
  for (const d of [4, 6, 8, 10]) {
    const G = c5BlowupEvenD(d);
    const degMax = Math.max(...G.map((x) => x.length));
    const m = edgesOfGraph(G).length;
    const diamL = lineGraphDiameter(G);
    rows.push({
      d,
      edge_count: m,
      formula_5_over_4_d2: (5 * d * d) / 4,
      max_degree: degMax,
      line_graph_diameter: diamL,
    });
  }

  out.results.ep934 = {
    description: 'Finite proxy checks on classical C5 blow-up constructions linked to h_2(d)-scale behavior.',
    rows,
    note: 'This checks structural proxy quantities; it does not prove sharpness beyond known theory.',
  };
}

// EP-936: search for powerful values among 2^n±1 and n!±1 at finite range.
{
  const { primes } = sievePrimes(1_100_000);

  const hits_pow2 = [];
  for (let n = 2; n <= 40; n += 1) {
    const a = 2 ** n - 1;
    const b = 2 ** n + 1;

    const fa = factorNumber(a, primes);
    const fb = factorNumber(b, primes);

    if (isPowerfulFromFactorization(fa, 2)) hits_pow2.push({ n, sign: '-', value: a });
    if (isPowerfulFromFactorization(fb, 2)) hits_pow2.push({ n, sign: '+', value: b });
  }

  const hits_fact = [];
  let fact = 1;
  for (let n = 1; n <= 13; n += 1) {
    fact *= n;
    if (n < 3) continue;
    const a = fact - 1;
    const b = fact + 1;
    const fa = factorNumber(a, primes);
    const fb = factorNumber(b, primes);
    if (isPowerfulFromFactorization(fa, 2)) hits_fact.push({ n, sign: '-', value: a });
    if (isPowerfulFromFactorization(fb, 2)) hits_fact.push({ n, sign: '+', value: b });
  }

  out.results.ep936 = {
    description: 'Finite exact factorization scan for powerful values in 2^n±1 and n!±1.',
    scanned_ranges: {
      pow2_n_range: [2, 40],
      factorial_n_range: [3, 13],
    },
    powerful_hits_pow2: hits_pow2,
    powerful_hits_factorial: hits_fact,
  };
}

// EP-939: finite search for r-powerful additive patterns.
{
  const B = 2_000_000;
  const spf = sieveSPF(B);

  function isRPowerful(n, r) {
    let x = n;
    while (x > 1) {
      const p = spf[x] || x;
      let e = 0;
      while (x % p === 0) {
        x = Math.floor(x / p);
        e += 1;
      }
      if (e < r) return false;
    }
    return n > 1;
  }

  function listRPowerful(r) {
    const arr = [];
    for (let n = 2; n <= B; n += 1) if (isRPowerful(n, r)) arr.push(n);
    return arr;
  }

  const list3 = listRPowerful(3);
  const list4 = listRPowerful(4);
  const list5 = listRPowerful(5);

  const set3 = new Set(list3);
  const set4 = new Set(list4);
  const set5 = new Set(list5);

  const triples3 = [];
  for (let i = 0; i < list3.length; i += 1) {
    const a = list3[i];
    for (let j = i + 1; j < list3.length; j += 1) {
      const b = list3[j];
      const c = a + b;
      if (c > B) break;
      if (!set3.has(c)) continue;
      if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
      triples3.push({ a, b, c });
      if (triples3.length >= 12) break;
    }
    if (triples3.length >= 12) break;
  }

  const triples4 = [];
  for (let i = 0; i < list4.length; i += 1) {
    const a = list4[i];
    for (let j = i + 1; j < list4.length; j += 1) {
      const b = list4[j];
      const c = a + b;
      if (c > B) break;
      if (!set4.has(c)) continue;
      if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
      triples4.push({ a, b, c });
      if (triples4.length >= 12) break;
    }
    if (triples4.length >= 12) break;
  }

  const quads5 = [];
  for (let i = 0; i < list5.length; i += 1) {
    const a = list5[i];
    for (let j = i + 1; j < list5.length; j += 1) {
      const b = list5[j];
      for (let k = j + 1; k < list5.length; k += 1) {
        const c = list5[k];
        const d = a + b + c;
        if (d > B) break;
        if (!set5.has(d)) continue;
        if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
        if (gcd(a, d) !== 1 || gcd(b, d) !== 1 || gcd(c, d) !== 1) continue;
        quads5.push({ a, b, c, d });
        if (quads5.length >= 8) break;
      }
      if (quads5.length >= 8) break;
    }
    if (quads5.length >= 8) break;
  }

  out.results.ep939 = {
    description: 'Finite additive search for coprime r-powerful patterns at r=3,4,5.',
    B,
    counts_r_powerful_up_to_B: {
      r3: list3.length,
      r4: list4.length,
      r5: list5.length,
    },
    sample_coprime_3powerful_triples_a_plus_b_eq_c: triples3,
    sample_coprime_4powerful_pairs_a_plus_b_eq_c: triples4,
    sample_coprime_5powerful_triples_a_plus_b_plus_c_eq_d: quads5,
  };
}

// EP-942: h(n) profile for powerful numbers in [n^2, (n+1)^2).
{
  const N = 50_000;
  const X = (N + 1) * (N + 1);

  const B = Math.floor(Math.cbrt(X));
  const spfB = sieveSPF(B + 5);
  const squarefree = new Uint8Array(B + 1);
  squarefree.fill(1);
  squarefree[0] = 0;

  for (let b = 2; b <= B; b += 1) {
    let x = b;
    let ok = true;
    while (x > 1) {
      const p = spfB[x] || x;
      x = Math.floor(x / p);
      if (x % p === 0) {
        ok = false;
        break;
      }
      while (x % p === 0) x = Math.floor(x / p);
    }
    squarefree[b] = ok ? 1 : 0;
  }

  const vals = [];
  for (let b = 1; b <= B; b += 1) {
    if (!squarefree[b]) continue;
    const b3 = b * b * b;
    const maxA = Math.floor(Math.sqrt(X / b3));
    for (let a = 1; a <= maxA; a += 1) {
      vals.push(a * a * b3);
    }
  }

  vals.sort((u, v) => u - v);
  const powerful = [];
  for (let i = 0; i < vals.length; i += 1) {
    if (i === 0 || vals[i] !== vals[i - 1]) powerful.push(vals[i]);
  }

  let l = 0;
  let r = 0;
  const freq = new Map();
  let maxH = 0;
  let argN = -1;

  const rows = [];
  const probes = new Set([1_000, 5_000, 10_000, 20_000, 35_000, 50_000]);

  for (let n = 1; n <= N; n += 1) {
    const lo = n * n;
    const hi = (n + 1) * (n + 1);
    while (l < powerful.length && powerful[l] < lo) l += 1;
    if (r < l) r = l;
    while (r < powerful.length && powerful[r] < hi) r += 1;
    const h = r - l;
    freq.set(h, (freq.get(h) || 0) + 1);
    if (h > maxH) {
      maxH = h;
      argN = n;
    }
    if (probes.has(n)) {
      rows.push({
        n,
        h_n: h,
        running_max_h_up_to_n: maxH,
        density_h_eq_1_up_to_n: Number(((freq.get(1) || 0) / n).toPrecision(7)),
      });
    }
  }

  const topFreq = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 12)
    .map(([h, c]) => ({ h, count: c, density: Number((c / N).toPrecision(7)) }));

  out.results.ep942 = {
    description: 'Finite profile of powerful-number counts in quadratic intervals [n^2,(n+1)^2).',
    N,
    max_h_found: maxH,
    first_n_attaining_max_h: argN,
    top_frequency_table: topFreq,
    probe_rows: rows,
  };
}

// EP-944: random search for k=4 vertex-critical graphs with no single critical edge.
{
  const rng = makeRng(20260304 ^ 942);

  function randomGraph(n, p) {
    const adj = makeGraph(n);
    for (let u = 0; u < n; u += 1) {
      for (let v = u + 1; v < n; v += 1) {
        if (rng() < p) addEdge(adj, u, v);
      }
    }
    return adj;
  }

  function isVertexCriticalK(adj, k) {
    if (chromaticNumberDSATUR(adj) !== k) return false;
    for (let v = 0; v < adj.length; v += 1) {
      const keep = [];
      for (let u = 0; u < adj.length; u += 1) if (u !== v) keep.push(u);
      const H = inducedSubgraph(adj, keep);
      if (chromaticNumberDSATUR(H) >= k) return false;
    }
    return true;
  }

  function hasSingleCriticalEdge(adj, k) {
    const E = edgesOfGraph(adj);
    for (const [u, v] of E) {
      const H = copyAdj(adj);
      removeEdge(H, u, v);
      if (chromaticNumberDSATUR(H) < k) return true;
    }
    return false;
  }

  const rows = [];
  const candidates = [];

  for (const n of [8, 9, 10, 11, 12]) {
    let sampled = 0;
    let chi4 = 0;
    let vc4 = 0;
    let vc4_no_single_critical_edge = 0;

    for (let t = 0; t < 260; t += 1) {
      const p = 0.25 + 0.5 * rng();
      const G = randomGraph(n, p);
      sampled += 1;

      const chi = chromaticNumberDSATUR(G);
      if (chi !== 4) continue;
      chi4 += 1;

      if (!isVertexCriticalK(G, 4)) continue;
      vc4 += 1;

      if (!hasSingleCriticalEdge(G, 4)) {
        vc4_no_single_critical_edge += 1;
        if (candidates.length < 3) {
          candidates.push({
            n,
            edge_count: edgesOfGraph(G).length,
            adjacency_bitmasks: G.map((nbrs, i) => {
              let m = 0;
              for (const v of nbrs) m |= 1 << v;
              return { v: i, mask: m };
            }),
          });
        }
      }
    }

    rows.push({
      n,
      sampled_graphs: sampled,
      chi4_graphs: chi4,
      vertex_critical_chi4_graphs: vc4,
      vertex_critical_chi4_without_single_critical_edge: vc4_no_single_critical_edge,
    });
  }

  out.results.ep944 = {
    description: 'Finite random search for k=4 vertex-critical graphs with no critical single edge.',
    rows,
    candidate_graphs_if_any: candidates,
    note: 'Any candidate would require independent verification; non-detection is not evidence of nonexistence.',
  };
}

// EP-945: longest run with distinct tau(n) values up to x.
{
  const X = 2_000_000;
  const tau = new Uint16Array(X + 1);
  for (let d = 1; d <= X; d += 1) {
    for (let m = d; m <= X; m += d) tau[m] += 1;
  }

  let maxTau = 0;
  for (let i = 1; i <= X; i += 1) {
    if (tau[i] > maxTau) maxTau = tau[i];
  }
  const lastPos = new Int32Array(maxTau + 1);
  lastPos.fill(0);

  let left = 1;
  let best = 0;
  const scales = new Set([10_000, 100_000, 500_000, 1_000_000, 2_000_000]);
  const rows = [];

  for (let i = 1; i <= X; i += 1) {
    const t = tau[i];
    if (lastPos[t] >= left) left = lastPos[t] + 1;
    lastPos[t] = i;
    const len = i - left + 1;
    if (len > best) best = len;

    if (scales.has(i)) {
      rows.push({
        x: i,
        F_x_finite_proxy: best,
        over_log_x: Number((best / Math.log(i)).toPrecision(7)),
      });
    }
  }

  out.results.ep945 = {
    description: 'Finite profile of maximal consecutive runs with pairwise distinct divisor counts.',
    X,
    rows,
  };
}

// EP-955: preimage-density probes for sparse target sets A under s(n)=sigma(n)-n.
{
  const N = 1_000_000;
  const sigma = new Uint32Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) sigma[m] += d;
  }

  const svals = new Uint32Array(N + 1);
  let maxS = 0;
  for (let n = 1; n <= N; n += 1) {
    const v = sigma[n] - n;
    svals[n] = v;
    if (v > maxS) maxS = v;
  }

  const { isPrime } = sievePrimes(maxS + 5);

  const isPow2 = new Uint8Array(maxS + 1);
  for (let x = 1; x <= maxS; x <<= 1) isPow2[x] = 1;

  const isSquare = new Uint8Array(maxS + 1);
  for (let a = 0; a * a <= maxS; a += 1) isSquare[a * a] = 1;

  const isSum2Sq = new Uint8Array(maxS + 1);
  const lim = Math.floor(Math.sqrt(maxS));
  for (let a = 0; a <= lim; a += 1) {
    const a2 = a * a;
    for (let b = 0; a2 + b * b <= maxS; b += 1) {
      isSum2Sq[a2 + b * b] = 1;
    }
  }

  let cPrime = 0;
  let cPow2 = 0;
  let cSquare = 0;
  let cSum2Sq = 0;

  const scales = new Set([100_000, 200_000, 500_000, 1_000_000]);
  const rows = [];

  for (let n = 1; n <= N; n += 1) {
    const s = svals[n];
    if (isPrime[s]) cPrime += 1;
    if (isPow2[s]) cPow2 += 1;
    if (isSquare[s]) cSquare += 1;
    if (isSum2Sq[s]) cSum2Sq += 1;

    if (scales.has(n)) {
      rows.push({
        x: n,
        preimage_density_primes: Number((cPrime / n).toPrecision(7)),
        preimage_density_powers_of_2: Number((cPow2 / n).toPrecision(7)),
        preimage_density_squares: Number((cSquare / n).toPrecision(7)),
        preimage_density_sums_of_two_squares: Number((cSum2Sq / n).toPrecision(7)),
      });
    }
  }

  out.results.ep955 = {
    description: 'Finite preimage-density profiles s^{-1}(A) for several explicit density-zero sets A.',
    N,
    max_s_n_over_range: maxS,
    rows,
  };
}

// EP-959: finite multiplicity-gap search over sampled point configurations.
{
  const rng = makeRng(20260304 ^ 959);

  function distGap(points) {
    const mp = new Map();
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const d2 = dx * dx + dy * dy;
        mp.set(d2, (mp.get(d2) || 0) + 1);
      }
    }
    const vals = [...mp.values()].sort((a, b) => b - a);
    const f1 = vals.length ? vals[0] : 0;
    const f2 = vals.length > 1 ? vals[1] : 0;
    return { f1, f2, gap: f1 - f2, distinct_distances: vals.length };
  }

  function gridPoints(n) {
    const w = Math.floor(Math.sqrt(n));
    const h = Math.ceil(n / w);
    const pts = [];
    for (let y = 0; y < h && pts.length < n; y += 1) {
      for (let x = 0; x < w && pts.length < n; x += 1) pts.push([x, y]);
    }
    return pts;
  }

  function twoLines(n) {
    const a = Math.floor(n / 2);
    const b = n - a;
    const pts = [];
    for (let i = 0; i < a; i += 1) pts.push([i, 0]);
    for (let j = 0; j < b; j += 1) pts.push([j, 1]);
    return pts;
  }

  function randomPoints(n, side) {
    const pts = [];
    const seen = new Set();
    while (pts.length < n) {
      const x = Math.floor(rng() * side);
      const y = Math.floor(rng() * side);
      const key = `${x},${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pts.push([x, y]);
    }
    return pts;
  }

  const rows = [];
  for (const n of [40, 60, 80, 100]) {
    let best = { gap: -1, family: 'none', f1: 0, f2: 0, distinct_distances: 0 };

    const g = distGap(gridPoints(n));
    if (g.gap > best.gap) best = { ...g, family: 'grid' };

    const t = distGap(twoLines(n));
    if (t.gap > best.gap) best = { ...t, family: 'two_lines' };

    for (let trial = 0; trial < 220; trial += 1) {
      const pts = randomPoints(n, 6 * n);
      const r = distGap(pts);
      if (r.gap > best.gap) best = { ...r, family: 'random' };
    }

    rows.push({
      n,
      best_family_found: best.family,
      best_gap_f1_minus_f2: best.gap,
      f1: best.f1,
      f2: best.f2,
      best_gap_over_n_log_n: Number((best.gap / (n * Math.log(n))).toPrecision(7)),
      distinct_distances_in_best: best.distinct_distances,
    });
  }

  out.results.ep959 = {
    description: 'Finite sampled search for large multiplicity gaps f(d1)-f(d2) in planar point sets.',
    rows,
  };
}

// EP-969: squarefree counting error profile Q(x)-6/pi^2*x.
{
  const X = 2_000_000;

  const primes = [];
  const lp = new Int32Array(X + 1);
  const mu = new Int8Array(X + 1);
  mu[1] = 1;

  for (let i = 2; i <= X; i += 1) {
    if (lp[i] === 0) {
      lp[i] = i;
      primes.push(i);
      mu[i] = -1;
    }
    for (const p of primes) {
      const v = i * p;
      if (v > X) break;
      lp[v] = p;
      if (p === lp[i]) {
        mu[v] = 0;
        break;
      }
      mu[v] = -mu[i];
    }
  }

  const c = 6 / (Math.PI * Math.PI);
  let Q = 0;
  let maxAbsE = 0;

  const scales = new Set([10_000, 100_000, 500_000, 1_000_000, 2_000_000]);
  const rows = [];

  for (let x = 1; x <= X; x += 1) {
    if (mu[x] !== 0) Q += 1;
    const E = Q - c * x;
    const aE = Math.abs(E);
    if (aE > maxAbsE) maxAbsE = aE;

    if (scales.has(x)) {
      rows.push({
        x,
        Q_x: Q,
        E_x: Number(E.toPrecision(8)),
        abs_E_x: Number(aE.toPrecision(8)),
        max_abs_E_up_to_x: Number(maxAbsE.toPrecision(8)),
        log_max_abs_E_over_log_x: Number((Math.log(maxAbsE) / Math.log(x)).toPrecision(7)),
      });
    }
  }

  out.results.ep969 = {
    description: 'Finite error-term profile for squarefree counting function Q(x).',
    X,
    rows,
  };
}

const outPath = path.join('data', 'harder_batch21_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
