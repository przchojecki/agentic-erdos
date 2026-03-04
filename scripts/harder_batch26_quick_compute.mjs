#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 26:
// EP-1111, EP-1112, EP-1113, EP-1117, EP-1122, EP-1129, EP-1135.

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

function sieveSPF(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
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

function factorDistinctByPrimes(n, primes) {
  let x = n;
  const out = [];
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  if (x > 1) out.push(x);
  return out;
}

function isPrimeByTrial(n, primes) {
  if (n < 2) return false;
  for (const p of primes) {
    if (p * p > n) break;
    if (n % p === 0) return false;
  }
  return true;
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

function inducedAdjListFromMask(fullMasks, mask) {
  const verts = [];
  for (let i = 0; i < fullMasks.length; i += 1) if ((mask >> BigInt(i)) & 1n) verts.push(i);
  const idx = new Map();
  for (let i = 0; i < verts.length; i += 1) idx.set(verts[i], i);
  const out = Array.from({ length: verts.length }, () => []);
  for (let i = 0; i < verts.length; i += 1) {
    let m = fullMasks[verts[i]];
    while (m) {
      const b = m & -m;
      const jOld = bitIndexBigInt(b);
      m ^= b;
      const j = idx.get(jOld);
      if (j !== undefined) out[i].push(j);
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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-1111: finite anticomplete-pair chromatic profile in high-chi, omega=2 examples.
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
  const m1 = mycielski(c5); // n=11, chi=4
  const m2 = mycielski(m1); // n=23, chi=5

  const n1 = m1.length;
  const ALL1 = (1n << BigInt(n1)) - 1n;
  const neighUnion = Array(1 << n1).fill(0n);
  for (let mask = 1; mask < (1 << n1); mask += 1) {
    const b = mask & -mask;
    const i = Math.log2(b) | 0;
    neighUnion[mask] = neighUnion[mask ^ b] | m1[i];
  }

  const chiCache = new Map();
  function chiSubset(maskBig) {
    if (chiCache.has(maskBig)) return chiCache.get(maskBig);
    const adj = inducedAdjListFromMask(m1, maskBig);
    const c = chromaticNumberDSATUR(adj);
    chiCache.set(maskBig, c);
    return c;
  }

  let bestMinChi = 0;
  let bestPair = null;
  for (let A = 1; A < (1 << n1); A += 1) {
    const ABig = BigInt(A);
    const allowedB = (ALL1 ^ ABig) & ~neighUnion[A];
    let B = allowedB;
    const chiA = chiSubset(ABig);
    while (B > 0n) {
      const chiB = chiSubset(B);
      const mm = Math.min(chiA, chiB);
      if (mm > bestMinChi) {
        bestMinChi = mm;
        bestPair = { A_mask: ABig.toString(), B_mask: B.toString(), chiA, chiB };
      }
      B = (B - 1n) & allowedB;
    }
  }

  // Random sampling on n=23 variant.
  const rng = makeRng(20260304 ^ 1111);
  const samples = [];
  let best23 = 0;
  for (let t = 0; t < 2000; t += 1) {
    let A = 0n;
    for (let i = 0; i < m2.length; i += 1) if (rng() < 0.28) A |= 1n << BigInt(i);
    if (A === 0n) continue;
    let neigh = 0n;
    for (let i = 0; i < m2.length; i += 1) if ((A >> BigInt(i)) & 1n) neigh |= m2[i];
    const allowed = (((1n << BigInt(m2.length)) - 1n) ^ A) & ~neigh;
    if (allowed === 0n) continue;
    let B = 0n;
    for (let i = 0; i < m2.length; i += 1) if (((allowed >> BigInt(i)) & 1n) && rng() < 0.45) B |= 1n << BigInt(i);
    if (B === 0n) continue;
    const chiA = chromaticNumberDSATUR(inducedAdjListFromMask(m2, A));
    const chiB = chromaticNumberDSATUR(inducedAdjListFromMask(m2, B));
    const mm = Math.min(chiA, chiB);
    if (mm > best23) best23 = mm;
    if (samples.length < 12 && mm >= 2) samples.push({ chiA, chiB, minChi: mm });
  }

  out.results.ep1111 = {
    description: 'Finite anticomplete-pair chromatic search on Mycielski triangle-free high-chromatic graphs.',
    exact_on_mycielski1_n11: {
      chi_graph: chromaticNumberDSATUR(adjacencyListFromMasks(m1)),
      best_min_of_chiA_chiB_over_anticomplete_pairs: bestMinChi,
      witness_pair_summary: bestPair,
    },
    sampled_on_mycielski2_n23: {
      chi_graph: chromaticNumberDSATUR(adjacencyListFromMasks(m2)),
      best_min_of_chiA_chiB_in_samples: best23,
      sample_rows: samples,
    },
  };
}

// EP-1112: finite greedy construction profile for bounded-gap A avoiding kA ∩ B.
{
  function buildLacunaryPowers(base, N) {
    const outB = [];
    let x = base;
    while (x <= N) {
      outB.push(x);
      x *= base;
    }
    return outB;
  }

  function buildLacunaryRandom(r, N, rng) {
    const outB = [5];
    while (true) {
      const prev = outB[outB.length - 1];
      const next = Math.floor(r * prev + 1 + rng() * prev * 0.25);
      if (next > N) break;
      outB.push(next);
    }
    return outB;
  }

  function greedyGapSequenceAvoidingB({ d1, d2, k, N, B }) {
    const isB = new Uint8Array(N + 1);
    for (const b of B) if (b <= N) isB[b] = 1;

    const A = [1];
    const inS1 = new Uint8Array(N + 1);
    const inS2 = new Uint8Array(N + 1);
    const inS3 = new Uint8Array(N + 1);
    inS1[1] = 1;
    if (k === 2) inS2[2] = 1;
    if (k === 3) {
      inS2[2] = 1;
      inS3[3] = 1;
    }

    function tryAdd(a) {
      if (a > N) return false;
      if (k === 2) {
        const new2 = [];
        for (let x = 1; x <= N; x += 1) {
          if (!inS1[x]) continue;
          const s = a + x;
          if (s <= N && !inS2[s]) {
            if (isB[s]) return false;
            new2.push(s);
          }
        }
        if (2 * a <= N && !inS2[2 * a]) {
          if (isB[2 * a]) return false;
          new2.push(2 * a);
        }
        A.push(a);
        inS1[a] = 1;
        for (const s of new2) inS2[s] = 1;
        return true;
      }

      // k=3
      const mark2 = new Uint8Array(N + 1);
      const new2 = [];
      for (let x = 1; x <= N; x += 1) {
        if (!inS1[x]) continue;
        const s = a + x;
        if (s <= N && !inS2[s] && !mark2[s]) {
          mark2[s] = 1;
          new2.push(s);
        }
      }
      if (2 * a <= N && !inS2[2 * a] && !mark2[2 * a]) {
        mark2[2 * a] = 1;
        new2.push(2 * a);
      }

      const mark3 = new Uint8Array(N + 1);
      const new3 = [];
      for (let t = 1; t <= N; t += 1) {
        if (!inS2[t] && !mark2[t]) continue;
        const s = a + t;
        if (s <= N && !inS3[s] && !mark3[s]) {
          if (isB[s]) return false;
          mark3[s] = 1;
          new3.push(s);
        }
      }

      A.push(a);
      inS1[a] = 1;
      for (const s of new2) inS2[s] = 1;
      for (const s of new3) inS3[s] = 1;
      return true;
    }

    while (true) {
      const cur = A[A.length - 1];
      let moved = false;
      for (let gap = d1; gap <= d2; gap += 1) {
        if (tryAdd(cur + gap)) {
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }
    return { length: A.length, last: A[A.length - 1], first_terms: A.slice(0, 30) };
  }

  const N = 1200;
  const rng = makeRng(20260304 ^ 1112);
  const scenarios = [
    { name: 'k3_gaps2_3_B=2^i', d1: 2, d2: 3, k: 3, B: buildLacunaryPowers(2, N) },
    { name: 'k3_gaps2_3_B=3^i', d1: 2, d2: 3, k: 3, B: buildLacunaryPowers(3, N) },
    { name: 'k3_gaps2_3_random_lacunary_r2', d1: 2, d2: 3, k: 3, B: buildLacunaryRandom(2, N, rng) },
    { name: 'k2_gaps2_3_B=2^i_control', d1: 2, d2: 3, k: 2, B: buildLacunaryPowers(2, N) },
  ];

  const rows = scenarios.map((s) => ({
    scenario: s.name,
    B_size: s.B.length,
    ...greedyGapSequenceAvoidingB({ d1: s.d1, d2: s.d2, k: s.k, N, B: s.B }),
  }));

  out.results.ep1112 = {
    description: 'Finite greedy bounded-gap construction tests for avoiding k-fold sumsets against lacunary B.',
    N,
    rows,
  };
}

// EP-1113: finite pseudo-Sierpinski screening and small covering-set profile.
{
  const M_MAX = 3000;
  const K_MAX = 14;
  const MAX_VAL = (1 << K_MAX) * M_MAX + 1;
  const { primes } = sievePrimes(Math.floor(Math.sqrt(MAX_VAL)) + 100);

  function primeFactorsDistinct(n) {
    return factorDistinctByPrimes(n, primes);
  }

  const candidates = [];
  for (let m = 3; m <= M_MAX; m += 2) {
    let allComposite = true;
    const factorSets = [];
    for (let k = 0; k <= K_MAX; k += 1) {
      const v = (m << k) + 1;
      if (isPrimeByTrial(v, primes)) {
        allComposite = false;
        break;
      }
      factorSets.push(primeFactorsDistinct(v));
    }
    if (!allComposite) continue;

    // Greedy set-cover over exponent indices 0..K_MAX.
    const uncovered = new Set([...Array(K_MAX + 1).keys()]);
    const chosen = [];
    const primeToIdx = new Map();
    for (let k = 0; k <= K_MAX; k += 1) {
      for (const p of factorSets[k]) {
        if (!primeToIdx.has(p)) primeToIdx.set(p, []);
        primeToIdx.get(p).push(k);
      }
    }
    while (uncovered.size) {
      let bestP = null;
      let bestHit = [];
      for (const [p, idxs] of primeToIdx.entries()) {
        const hit = idxs.filter((x) => uncovered.has(x));
        if (hit.length > bestHit.length) {
          bestHit = hit;
          bestP = p;
        }
      }
      if (!bestP || bestHit.length === 0) break;
      chosen.push(bestP);
      for (const x of bestHit) uncovered.delete(x);
    }

    candidates.push({
      m,
      greedy_cover_size_for_k0_to_kmax: chosen.length,
      greedy_cover_primes_sample: chosen.slice(0, 12),
    });
  }

  candidates.sort((a, b) => a.greedy_cover_size_for_k0_to_kmax - b.greedy_cover_size_for_k0_to_kmax || a.m - b.m);

  out.results.ep1113 = {
    description: 'Finite pseudo-Sierpinski scan (composite checks for 2^k m+1 up to k<=14) with greedy covering-prime profile.',
    M_MAX,
    K_MAX,
    pseudo_sierpinski_count_in_scan: candidates.length,
    best_candidates_by_small_cover_size: candidates.slice(0, 20),
  };
}

// EP-1117: finite angular-maxima profile for polynomial proxies.
{
  function maximaCountOnCircle(polyDegrees, r, samples = 4096) {
    const vals = new Float64Array(samples);
    for (let i = 0; i < samples; i += 1) {
      const th = (2 * Math.PI * i) / samples;
      let re = 0;
      let im = 0;
      for (const d of polyDegrees) {
        const rd = r ** d;
        re += rd * Math.cos(d * th);
        im += rd * Math.sin(d * th);
      }
      vals[i] = Math.hypot(re, im);
    }
    let cnt = 0;
    for (let i = 0; i < samples; i += 1) {
      const a = vals[(i - 1 + samples) % samples];
      const b = vals[i];
      const c = vals[(i + 1) % samples];
      if (b >= a && b > c) cnt += 1;
    }
    return cnt;
  }

  const controlRows = [4, 8, 16, 32].map((m) => ({
    family: `z^${m}+1`,
    r: 1,
    estimated_u_r: maximaCountOnCircle([0, m], 1, 8192),
  }));

  const lacunary = [0, 1, 2, 4, 8, 16, 32, 64];
  const radii = [];
  for (let r = 0.70; r <= 1.40 + 1e-12; r += 0.05) radii.push(Number(r.toFixed(2)));
  const scanRows = radii.map((r) => ({
    r,
    estimated_u_r_for_sum_z_pow_2j: maximaCountOnCircle(lacunary, r, 8192),
  }));

  const topRows = [...scanRows]
    .sort((a, b) => b.estimated_u_r_for_sum_z_pow_2j - a.estimated_u_r_for_sum_z_pow_2j)
    .slice(0, 8);

  out.results.ep1117 = {
    description: 'Finite circle-maxima counts for polynomial proxies to ν(r) behavior.',
    control_rows: controlRows,
    lacunary_scan_top_rows: topRows,
  };
}

// EP-1122: finite density profile of A={n: f(n+1)<f(n)} for sample additive functions.
{
  const N = 200_000;
  const spf = sieveSPF(N + 5);

  const omega = new Uint16Array(N + 1);
  const Omega = new Uint16Array(N + 1);

  for (let n = 2; n <= N; n += 1) {
    const p = spf[n] || n;
    const m = Math.floor(n / p);
    Omega[n] = Omega[m] + 1;
    omega[n] = omega[m] + (m % p === 0 ? 0 : 1);
  }

  const rng = makeRng(20260304 ^ 1122);
  const w = new Float64Array(N + 1);
  for (let p = 2; p <= N; p += 1) if ((spf[p] || p) === p) w[p] = 2 * rng() - 1;
  const fRand = new Float64Array(N + 1);
  for (let n = 2; n <= N; n += 1) {
    const p = spf[n] || n;
    fRand[n] = fRand[Math.floor(n / p)] + w[p];
  }

  const probes = [10_000, 30_000, 60_000, 100_000, 150_000, 200_000];
  let cLog = 0;
  let cOmega = 0;
  let comega = 0;
  let cRand = 0;
  const rows = [];

  for (let n = 1; n < N; n += 1) {
    if (Math.log(n + 1) < Math.log(n)) cLog += 1;
    if (Omega[n + 1] < Omega[n]) cOmega += 1;
    if (omega[n + 1] < omega[n]) comega += 1;
    if (fRand[n + 1] < fRand[n]) cRand += 1;

    if (probes.includes(n + 1)) {
      rows.push({
        x: n + 1,
        density_A_for_log_n: Number((cLog / (n + 1)).toPrecision(7)),
        density_A_for_Omega: Number((cOmega / (n + 1)).toPrecision(7)),
        density_A_for_omega: Number((comega / (n + 1)).toPrecision(7)),
        density_A_for_random_additive: Number((cRand / (n + 1)).toPrecision(7)),
      });
    }
  }

  out.results.ep1122 = {
    description: 'Finite density comparison of descent set A for sample additive functions.',
    N,
    rows,
  };
}

// EP-1129: finite Lebesgue-constant comparisons for node systems.
{
  function lebesgueConstant(nodes, samples = 4000) {
    const n = nodes.length;
    const w = Array(n).fill(1);
    for (let i = 0; i < n; i += 1) {
      let den = 1;
      for (let j = 0; j < n; j += 1) if (i !== j) den *= nodes[i] - nodes[j];
      w[i] = 1 / den;
    }

    let best = 0;
    for (let s = 0; s <= samples; s += 1) {
      const x = -1 + (2 * s) / samples;
      let atNode = -1;
      for (let i = 0; i < n; i += 1) if (Math.abs(x - nodes[i]) < 1e-12) atNode = i;
      if (atNode !== -1) {
        if (1 > best) best = 1;
        continue;
      }
      let denom = 0;
      const tmp = Array(n).fill(0);
      for (let i = 0; i < n; i += 1) {
        tmp[i] = w[i] / (x - nodes[i]);
        denom += tmp[i];
      }
      let sum = 0;
      for (let i = 0; i < n; i += 1) sum += Math.abs(tmp[i] / denom);
      if (sum > best) best = sum;
    }
    return best;
  }

  function equispaced(n) {
    return [...Array(n).keys()].map((i) => -1 + (2 * i) / (n - 1));
  }
  function chebyshevRoots(n) {
    return [...Array(n).keys()].map((i) => Math.cos(((2 * (i + 1) - 1) * Math.PI) / (2 * n)));
  }

  const rows = [];
  for (const n of [8, 16]) {
    const lEq = lebesgueConstant(equispaced(n), 4000);
    const lCh = lebesgueConstant(chebyshevRoots(n), 4000);
    rows.push({
      n,
      lambda_equispaced_est: Number(lEq.toPrecision(8)),
      lambda_chebyshev_est: Number(lCh.toPrecision(8)),
      ratio_eq_over_cheb: Number((lEq / lCh).toPrecision(7)),
    });
  }

  // Canonical n=4 symmetric family: nodes (-1,-t,t,1).
  let bestT = 0;
  let bestL = Infinity;
  for (let i = 0; i <= 1000; i += 1) {
    const t = 0.2 + (0.5 * i) / 1000;
    const l = lebesgueConstant([-1, -t, t, 1], 4000);
    if (l < bestL) {
      bestL = l;
      bestT = t;
    }
  }

  out.results.ep1129 = {
    description: 'Finite numerical Lebesgue-constant comparisons and symmetric n=4 canonical search.',
    rows,
    n4_symmetric_search: {
      best_t_est: Number(bestT.toPrecision(7)),
      lambda_est: Number(bestL.toPrecision(8)),
      reference_t_from_literature_approx: 0.4177,
    },
  };
}

// EP-1135: finite verification of accelerated Collatz map f(n).
{
  const N = 2_000_000;
  const memo = new Uint32Array(N + 1); // store steps+1, 0 means unknown.
  memo[1] = 1;

  function nextCollatz(x) {
    return x % 2n === 0n ? x / 2n : (3n * x + 1n) / 2n;
  }

  let maxSteps = 0;
  let argMax = 1;
  const probes = [100_000, 300_000, 600_000, 1_000_000, 1_500_000, 2_000_000];
  let ptr = 0;
  const rows = [];

  for (let n = 1; n <= N; n += 1) {
    let x = BigInt(n);
    const path = [];

    while (true) {
      if (x <= BigInt(N) && memo[Number(x)] > 0) break;
      path.push(x);
      x = nextCollatz(x);
    }

    let s = x <= BigInt(N) ? memo[Number(x)] - 1 : 0;
    for (let i = path.length - 1; i >= 0; i -= 1) {
      s += 1;
      const v = path[i];
      if (v <= BigInt(N) && memo[Number(v)] === 0) memo[Number(v)] = s + 1;
    }
    const steps = memo[n] > 0 ? memo[n] - 1 : s;

    if (steps > maxSteps) {
      maxSteps = steps;
      argMax = n;
    }

    if (ptr < probes.length && n === probes[ptr]) {
      rows.push({
        x: n,
        max_steps_up_to_x: maxSteps,
        n_attaining_max_steps: argMax,
      });
      ptr += 1;
    }
  }

  out.results.ep1135 = {
    description: 'Finite accelerated-Collatz stopping-time verification for all starts n<=2,000,000.',
    N,
    rows,
  };
}

const outPath = path.join('data', 'harder_batch26_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
