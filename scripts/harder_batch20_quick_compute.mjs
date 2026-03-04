#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 20:
// EP-860, EP-872, EP-885, EP-889, EP-893,
// EP-901, EP-917, EP-920, EP-928, EP-929.

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

function factorDistinct(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

function intersectSortedArrays(a, b) {
  let i = 0;
  let j = 0;
  const out = [];
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push(a[i]);
      i += 1;
      j += 1;
    } else if (a[i] < b[j]) i += 1;
    else j += 1;
  }
  return out;
}

// DSATUR exact chromatic number for moderate n.
function chromaticNumberDSATUR(adj) {
  const n = adj.length;
  const deg = new Int32Array(n);
  for (let v = 0; v < n; v += 1) deg[v] = adj[v].length;

  const colors = new Int16Array(n);
  colors.fill(-1);
  let best = n;

  function dfs(usedColors) {
    if (usedColors >= best) return;

    let uncolored = 0;
    for (let v = 0; v < n; v += 1) if (colors[v] === -1) uncolored += 1;
    if (uncolored === 0) {
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

function makeGraph(n) {
  return Array.from({ length: n }, () => []);
}

function addUndirectedEdge(adj, u, v) {
  adj[u].push(v);
  adj[v].push(u);
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-860: finite matching proxy for h(n).
{
  const { primes } = sievePrimes(300);

  function firstPrimesUpTo(n) {
    return primes.filter((p) => p <= n);
  }

  function canMatch(primeList, m, h) {
    const r = primeList.length;
    const matchPos = new Int32Array(h + 1);
    matchPos.fill(-1);

    const adj = Array.from({ length: r }, () => []);
    for (let i = 0; i < r; i += 1) {
      const p = primeList[i];
      let j = (p - (m % p)) % p;
      if (j === 0) j = p;
      for (; j <= h; j += p) adj[i].push(j);
      if (adj[i].length === 0) return false;
    }

    function aug(i, seen) {
      for (const pos of adj[i]) {
        if (seen[pos]) continue;
        seen[pos] = 1;
        if (matchPos[pos] === -1 || aug(matchPos[pos], seen)) {
          matchPos[pos] = i;
          return true;
        }
      }
      return false;
    }

    let got = 0;
    for (let i = 0; i < r; i += 1) {
      const seen = new Uint8Array(h + 1);
      if (aug(i, seen)) got += 1;
      else return false;
    }
    return got === r;
  }

  function finiteHn(n, mMax, hCap) {
    const ps = firstPrimesUpTo(n);
    const r = ps.length;

    let worst = 0;
    let argm = 1;

    for (let m = 1; m <= mMax; m += 1) {
      let lo = Math.max(r, 1);
      let hi = lo;

      while (hi <= hCap && !canMatch(ps, m, hi)) hi *= 2;
      if (hi > hCap) {
        worst = Math.max(worst, hCap + 1);
        argm = m;
        continue;
      }

      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (canMatch(ps, m, mid)) hi = mid;
        else lo = mid + 1;
      }

      if (lo > worst) {
        worst = lo;
        argm = m;
      }
    }

    return { n, pi_n: ps.length, mMax, hCap, finite_worst_required_h: worst, witness_m: argm };
  }

  const rows = [];
  for (const [n, mMax, hCap] of [[30, 800, 600], [50, 800, 900], [80, 800, 1500]]) {
    rows.push(finiteHn(n, mMax, hCap));
  }

  out.results.ep860 = {
    description: 'Finite Hall-matching proxy for h(n) over initial m range.',
    rows,
    note: 'These are finite lower-bound style profiles; true h(n) quantifies over all m>=1.',
  };
}

// EP-872: exact minimax game lengths for small n.
{
  function solveGameLength(n, longStarts) {
    const vals = Array.from({ length: n - 1 }, (_, i) => i + 2);
    const m = vals.length;
    const incompat = new Uint32Array(m);

    for (let i = 0; i < m; i += 1) {
      for (let j = 0; j < m; j += 1) {
        if (i === j) continue;
        const a = vals[i];
        const b = vals[j];
        if (a % b === 0 || b % a === 0) incompat[i] |= (1 << j);
      }
    }

    const memoLong = new Map();
    const memoShort = new Map();

    function dfs(mask, longTurn) {
      const memo = longTurn ? memoLong : memoShort;
      if (memo.has(mask)) return memo.get(mask);

      const legal = [];
      for (let i = 0; i < m; i += 1) {
        const bit = 1 << i;
        if (mask & bit) continue;
        if (mask & incompat[i]) continue;
        legal.push(i);
      }

      if (legal.length === 0) {
        memo.set(mask, 0);
        return 0;
      }

      let best = longTurn ? -1 : 1e9;
      for (const i of legal) {
        const val = 1 + dfs(mask | (1 << i), !longTurn);
        if (longTurn) {
          if (val > best) best = val;
        } else if (val < best) best = val;
      }

      memo.set(mask, best);
      return best;
    }

    return dfs(0, longStarts);
  }

  const rows = [];
  for (const n of [10, 12, 14, 16, 18, 20]) {
    const lf = solveGameLength(n, true);
    const sf = solveGameLength(n, false);
    rows.push({
      n,
      optimal_length_long_player_starts: lf,
      optimal_length_short_player_starts: sf,
      pi_n: (() => {
        let c = 0;
        for (let x = 2; x <= n; x += 1) {
          let p = true;
          for (let d = 2; d * d <= x; d += 1) if (x % d === 0) p = false;
          if (p) c += 1;
        }
        return c;
      })(),
      over_n_long_starts: Number((lf / n).toPrecision(7)),
    });
  }

  out.results.ep872 = {
    description: 'Exact minimax game length profile for the divisibility-free saturation game at small n.',
    rows,
    note: 'State space grows quickly; this is exact only for tested n.',
  };
}

// EP-885: common intersection search for factor-difference sets.
{
  const N = 30000;
  const DofN = Array.from({ length: N + 1 }, () => []);
  const diffToNs = new Map();

  for (let n = 1; n <= N; n += 1) {
    const s = new Set();
    const lim = Math.floor(Math.sqrt(n));
    for (let a = 1; a <= lim; a += 1) {
      if (n % a !== 0) continue;
      const b = Math.floor(n / a);
      s.add(Math.abs(b - a));
    }
    const arr = Array.from(s).sort((x, y) => x - y);
    DofN[n] = arr;
    for (const d of arr) {
      if (!diffToNs.has(d)) diffToNs.set(d, []);
      diffToNs.get(d).push(n);
    }
  }

  function findWitness(k) {
    const cands = [];
    for (const [d, ns] of diffToNs.entries()) {
      if (ns.length >= k) cands.push({ d, ns });
    }
    cands.sort((a, b) => b.ns.length - a.ns.length || a.d - b.d);

    const maxDiffs = 220;
    const arr = cands.slice(0, maxDiffs);

    let answer = null;
    const t0 = Date.now();
    const timeLimitMs = 2600;

    function dfs(start, depth, curNs, chosenDiffs) {
      if (Date.now() - t0 > timeLimitMs) return true;
      if (depth === k) {
        if (curNs.length >= k) {
          answer = {
            k,
            common_differences: [...chosenDiffs],
            witness_N_values: curNs.slice(0, k),
            intersection_size: chosenDiffs.length,
          };
          return true;
        }
        return false;
      }

      for (let i = start; i < arr.length; i += 1) {
        if (arr.length - i < k - depth) break;
        const nextNs = curNs === null ? arr[i].ns : intersectSortedArrays(curNs, arr[i].ns);
        if (nextNs.length < k) continue;
        chosenDiffs.push(arr[i].d);
        const ok = dfs(i + 1, depth + 1, nextNs, chosenDiffs);
        chosenDiffs.pop();
        if (answer) return true;
        if (ok && Date.now() - t0 > timeLimitMs) return true;
      }
      return false;
    }

    dfs(0, 0, null, []);
    return {
      k,
      found: !!answer,
      witness: answer,
      searched_top_diff_supports: arr.slice(0, 12).map((x) => ({ d: x.d, support: x.ns.length })),
      hit_time_limit: Date.now() - t0 > timeLimitMs,
    };
  }

  const rows = [];
  for (const k of [2, 3, 4, 5, 6]) rows.push(findWitness(k));

  out.results.ep885 = {
    description: 'Finite search for k-tuples with at least k common factor differences.',
    N,
    rows,
    note: 'Not finding a witness for larger k in this finite bounded search is inconclusive.',
  };
}

// EP-889: finite profile of v_0(n) with bounded k-range.
{
  const N = 2500;
  const KMAX = 6000;
  const LIM = N + KMAX + 5;
  const spf = sieveSPF(LIM);

  const facs = Array.from({ length: LIM + 1 }, () => []);
  for (let x = 2; x <= LIM; x += 1) facs[x] = factorDistinct(x, spf);

  function vBounded(n) {
    let best = 0;
    let argk = 0;
    for (let k = 0; k <= KMAX; k += 1) {
      const arr = facs[n + k];
      let c = 0;
      for (const p of arr) if (p > k) c += 1;
      if (c > best) {
        best = c;
        argk = k;
      }
    }
    return { best, argk };
  }

  const v0 = new Int16Array(N + 1);
  const argk = new Int32Array(N + 1);
  let globalBest = 0;
  let globalN = 1;

  for (let n = 1; n <= N; n += 1) {
    const v = vBounded(n);
    v0[n] = v.best;
    argk[n] = v.argk;
    if (v.best > globalBest) {
      globalBest = v.best;
      globalN = n;
    }
  }

  const rows = [];
  for (const x of [200, 500, 1000, 1500, 2000, 2500]) {
    let mn = 1e9;
    let avg = 0;
    for (let n = 1; n <= x; n += 1) {
      if (v0[n] < mn) mn = v0[n];
      avg += v0[n];
    }
    rows.push({
      N_prefix: x,
      min_v0_bounded_over_n_le_N: mn,
      avg_v0_bounded_over_n_le_N: Number((avg / x).toPrecision(7)),
    });
  }

  out.results.ep889 = {
    description: 'Finite bounded-k profile for v_0(n) type quantity.',
    N,
    KMAX,
    max_v0_bounded_found: globalBest,
    argmax_n: globalN,
    argmax_k_for_argmax_n: argk[globalN],
    rows,
    note: 'This is max over 0<=k<=KMAX only; unbounded k may be larger.',
  };
}

// EP-893: exact tau(2^k-1) for feasible k by trial division.
{
  const KMAX = 44;
  const maxM = (1n << BigInt(KMAX)) - 1n;
  const sqrtMax = Math.floor(Math.sqrt(Number(maxM)));
  const { primes } = sievePrimes(sqrtMax + 5);

  function tauBigByTrial(n0) {
    let n = n0;
    let tau = 1;
    for (const p of primes) {
      const pb = BigInt(p);
      if (pb * pb > n) break;
      let e = 0;
      while (n % pb === 0n) {
        n /= pb;
        e += 1;
      }
      if (e > 0) tau *= (e + 1);
    }
    if (n > 1n) tau *= 2;
    return tau;
  }

  const tauVals = [];
  for (let k = 1; k <= KMAX; k += 1) {
    const m = (1n << BigInt(k)) - 1n;
    const t = tauBigByTrial(m);
    tauVals.push(t);
  }

  const f = [0];
  for (let i = 1; i <= KMAX; i += 1) f[i] = f[i - 1] + tauVals[i - 1];

  const rows = [];
  for (let n = 2; 2 * n <= KMAX; n += 1) {
    rows.push({
      n,
      f_n: f[n],
      f_2n: f[2 * n],
      ratio_f_2n_over_f_n: Number((f[2 * n] / f[n]).toPrecision(8)),
    });
  }

  let minRatio = 1e9;
  let maxRatio = 0;
  for (const r of rows) {
    if (r.ratio_f_2n_over_f_n < minRatio) minRatio = r.ratio_f_2n_over_f_n;
    if (r.ratio_f_2n_over_f_n > maxRatio) maxRatio = r.ratio_f_2n_over_f_n;
  }

  out.results.ep893 = {
    description: 'Exact finite prefix ratio profile for f(2n)/f(n) using tau(2^k-1) up to k=44.',
    KMAX,
    min_ratio_in_tested_range: minRatio,
    max_ratio_in_tested_range: maxRatio,
    rows,
  };
}

// EP-901: constructive upper bounds for m(n) via non-2-colorable n-uniform hypergraphs.
{
  const rng = makeRng(20260304 ^ 2201);

  function combinationsMasks(v, r) {
    const outMasks = [];
    const cur = [];

    function rec(start, need) {
      if (need === 0) {
        let mask = 0;
        for (const x of cur) mask |= (1 << x);
        outMasks.push(mask);
        return;
      }
      for (let x = start; x <= v - need; x += 1) {
        cur.push(x);
        rec(x + 1, need - 1);
        cur.pop();
      }
    }

    rec(0, r);
    return outMasks;
  }

  function nonMonochromaticColorings(v, edges) {
    const full = (1 << v) - 1;
    const ok = [];
    for (let c = 0; c < (1 << v); c += 1) {
      let good = true;
      const comp = full ^ c;
      for (const e of edges) {
        if ((e & c) === e || (e & comp) === e) {
          good = false;
          break;
        }
      }
      if (good) ok.push(c);
    }
    return ok;
  }

  function greedyConstruct(v, n, stepsCap, sampleCand) {
    const edgesAll = combinationsMasks(v, n);
    const used = new Set();
    const edges = [];
    let validColorings = nonMonochromaticColorings(v, edges);

    for (let step = 0; step < stepsCap && validColorings.length > 0; step += 1) {
      let bestEdge = -1;
      let bestKill = -1;

      for (let t = 0; t < sampleCand; t += 1) {
        const idx = Math.floor(rng() * edgesAll.length);
        if (used.has(idx)) continue;
        const e = edgesAll[idx];

        let kill = 0;
        const full = (1 << v) - 1;
        for (const c of validColorings) {
          const comp = full ^ c;
          if ((e & c) === e || (e & comp) === e) kill += 1;
        }

        if (kill > bestKill) {
          bestKill = kill;
          bestEdge = idx;
        }
      }

      if (bestEdge < 0) break;
      used.add(bestEdge);
      const e = edgesAll[bestEdge];
      edges.push(e);

      const full = (1 << v) - 1;
      validColorings = validColorings.filter((c) => {
        const comp = full ^ c;
        return !((e & c) === e || (e & comp) === e);
      });
    }

    return { edge_count: edges.length, remaining_colorings: validColorings.length };
  }

  const rows = [];
  for (const n of [4, 5, 6]) {
    const vCands = [2 * n, 2 * n + 1, 2 * n + 2];
    let globalBest = 1e9;
    let globalBestV = null;
    let bestRem = 1e9;

    for (const v of vCands) {
      for (let r = 0; r < 6; r += 1) {
        const g = greedyConstruct(v, n, 500, 140);
        if (g.remaining_colorings === 0 && g.edge_count < globalBest) {
          globalBest = g.edge_count;
          globalBestV = v;
        }
        if (g.remaining_colorings < bestRem) bestRem = g.remaining_colorings;
      }
    }

    rows.push({
      n,
      searched_v_values: vCands,
      best_v_found: globalBestV,
      finite_constructive_upper_bound_edges: Number.isFinite(globalBest) ? globalBest : null,
      smallest_remaining_coloring_count_seen: bestRem,
      trivial_probabilistic_lower_bound_2_pow_n_minus_1: 2 ** (n - 1),
      upper_over_2_pow_n: Number.isFinite(globalBest) ? Number((globalBest / (2 ** n)).toPrecision(7)) : null,
    });
  }

  out.results.ep901 = {
    description: 'Greedy constructive finite upper bounds for non-2-colorable n-uniform hypergraphs.',
    rows,
    note: 'Upper bounds depend on construction heuristic and do not certify exact m(n).',
  };
}

// EP-917: Dirac-type dense critical constructions for k=6.
{
  function diracJoinTwoOddCycles(t) {
    const m = 2 * t + 1;
    const n = 2 * m;
    const adj = makeGraph(n);

    // First odd cycle on [0, m-1], second on [m,2m-1].
    for (let i = 0; i < m; i += 1) {
      addUndirectedEdge(adj, i, (i + 1) % m);
      addUndirectedEdge(adj, m + i, m + ((i + 1) % m));
    }

    // Complete join between two cycles.
    for (let i = 0; i < m; i += 1) {
      for (let j = 0; j < m; j += 1) addUndirectedEdge(adj, i, m + j);
    }

    return adj;
  }

  function edgeList(adj) {
    const n = adj.length;
    const outE = [];
    const seen = new Set();
    for (let u = 0; u < n; u += 1) {
      for (const v of adj[u]) {
        if (u < v) {
          const key = `${u},${v}`;
          if (!seen.has(key)) {
            seen.add(key);
            outE.push([u, v]);
          }
        }
      }
    }
    return outE;
  }

  function copyAdj(adj) {
    return adj.map((x) => [...x]);
  }

  function removeEdge(adj, a, b) {
    adj[a] = adj[a].filter((x) => x !== b);
    adj[b] = adj[b].filter((x) => x !== a);
  }

  const rows = [];
  for (const t of [2, 3, 4, 5]) {
    const G = diracJoinTwoOddCycles(t);
    const n = G.length;
    const E = edgeList(G);

    const chiG = chromaticNumberDSATUR(G);
    let allDrop = true;

    const sample = E.length <= 80 ? E : E.filter((_, i) => i % Math.floor(E.length / 80) === 0);
    for (const [u, v] of sample) {
      const H = copyAdj(G);
      removeEdge(H, u, v);
      const chiH = chromaticNumberDSATUR(H);
      if (!(chiH < chiG)) {
        allDrop = false;
        break;
      }
    }

    rows.push({
      t,
      n,
      edge_count: E.length,
      edge_density_over_n2: Number((E.length / (n * n)).toPrecision(7)),
      chromatic_number: chiG,
      tested_edge_criticality_on_sample: allDrop,
      tested_edges: sample.length,
      dirac_formula_value_4t2_plus8t_plus3: 4 * t * t + 8 * t + 3,
    });
  }

  out.results.ep917 = {
    description: 'Finite verification profile for Dirac join-of-two-odd-cycles construction (k=6 case).',
    rows,
    note: 'Criticality check is exact on sampled edges only when E is large.',
  };
}

// EP-920: K4-free high-chromatic finite constructions (Mycielski chain).
{
  function makeC5() {
    const adj = makeGraph(5);
    for (let i = 0; i < 5; i += 1) addUndirectedEdge(adj, i, (i + 1) % 5);
    return adj;
  }

  function mycielskian(adj) {
    const n = adj.length;
    const outN = 2 * n + 1;
    const g = makeGraph(outN);

    // Old edges
    for (let u = 0; u < n; u += 1) {
      for (const v of adj[u]) if (u < v) addUndirectedEdge(g, u, v);
    }

    // Clone vertices u_i = n+i; connect u_i to neighbors of v_i.
    for (let i = 0; i < n; i += 1) {
      for (const nb of adj[i]) addUndirectedEdge(g, n + i, nb);
    }

    // New apex w connected to all clones.
    const w = 2 * n;
    for (let i = 0; i < n; i += 1) addUndirectedEdge(g, w, n + i);

    return g;
  }

  function hasK4(adj) {
    const n = adj.length;
    const mat = Array.from({ length: n }, () => new Uint8Array(n));
    for (let u = 0; u < n; u += 1) for (const v of adj[u]) mat[u][v] = 1;

    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        if (!mat[a][b]) continue;
        for (let c = b + 1; c < n; c += 1) {
          if (!(mat[a][c] && mat[b][c])) continue;
          for (let d = c + 1; d < n; d += 1) {
            if (mat[a][d] && mat[b][d] && mat[c][d]) return true;
          }
        }
      }
    }
    return false;
  }

  const rows = [];
  let G = makeC5();
  for (let it = 0; it <= 4; it += 1) {
    const n = G.length;
    const chiExact = n <= 23 ? chromaticNumberDSATUR(G) : null;
    const chiKnown = 3 + it;

    let e = 0;
    for (let u = 0; u < n; u += 1) e += G[u].length;
    e /= 2;

    rows.push({
      iteration_from_C5: it,
      n,
      edge_count: e,
      k4_free_check: !hasK4(G),
      chromatic_number_exact_if_computed: chiExact,
      chromatic_number_from_mycielski_construction: chiKnown,
      lower_bound_f4_of_n_from_construction: chiKnown,
      chi_over_n_to_2over3: Number((chiKnown / (n ** (2 / 3))).toPrecision(7)),
    });

    G = mycielskian(G);
  }

  out.results.ep920 = {
    description: 'Finite K4-free high-chromatic profile via Mycielski constructions.',
    rows,
    note: 'These are constructive lower bounds for f_4(n), not extremal optima.',
  };
}

// EP-928: empirical joint smoothness density profile.
{
  const N = 1_000_000;
  const lpf = new Uint32Array(N + 2);

  for (let p = 2; p <= N + 1; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let m = p; m <= N + 1; m += p) lpf[m] = p;
  }
  lpf[1] = 1;

  const rows = [];
  for (const [a, b] of [[0.5, 0.5], [0.5, 0.7], [0.7, 0.7], [0.8, 0.8]]) {
    let ca = 0;
    let cb = 0;
    let cab = 0;

    for (let n = 2; n <= N; n += 1) {
      const ea = lpf[n] < n ** a;
      const eb = lpf[n + 1] < (n + 1) ** b;
      if (ea) ca += 1;
      if (eb) cb += 1;
      if (ea && eb) cab += 1;
    }

    const dn = N - 1;
    const da = ca / dn;
    const db = cb / dn;
    const dj = cab / dn;

    rows.push({
      alpha: a,
      beta: b,
      N,
      density_event_a: Number(da.toPrecision(7)),
      density_event_b: Number(db.toPrecision(7)),
      density_joint: Number(dj.toPrecision(7)),
      product_density: Number((da * db).toPrecision(7)),
      joint_over_product: Number((dj / (da * db)).toPrecision(7)),
    });
  }

  out.results.ep928 = {
    description: 'Finite empirical joint density profile for smooth n and n+1 events.',
    rows,
  };
}

// EP-929: finite-density proxy for S(k).
{
  const N = 250000;
  const LIM = N + 80;
  const lpf = new Uint32Array(LIM + 1);
  for (let p = 2; p <= LIM; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let m = p; m <= LIM; m += p) lpf[m] = p;
  }
  lpf[1] = 1;

  function blockDensity(k, x) {
    const M = N + k + 2;
    const bad = new Uint8Array(M + 1);
    for (let i = 1; i <= M; i += 1) bad[i] = lpf[i] <= x ? 0 : 1;

    let curBad = 0;
    for (let i = 2; i <= 1 + k; i += 1) curBad += bad[i];

    let good = 0;
    const total = N;
    for (let n = 1; n <= N; n += 1) {
      if (curBad === 0) good += 1;
      curBad -= bad[n + 1];
      curBad += bad[n + k + 1];
    }

    return { good, density: good / total };
  }

  const rows = [];
  for (const k of [6, 8, 10, 12, 16]) {
    const maxX = k + 8;
    let xPos = null;
    let xDense = null;
    const eps = 1e-4;
    const profile = [];

    for (let x = 2; x <= maxX; x += 1) {
      const d = blockDensity(k, x);
      profile.push({ x, good_starts: d.good, density: Number(d.density.toPrecision(7)) });
      if (xPos === null && d.good > 0) xPos = x;
      if (xDense === null && d.density >= eps) xDense = x;
    }

    rows.push({
      k,
      N,
      eps_density_threshold: eps,
      finite_min_x_with_any_occurrence: xPos,
      finite_min_x_with_density_at_least_eps: xDense,
      profile,
    });
  }

  out.results.ep929 = {
    description: 'Finite positive-density proxy profile for S(k) using bounded-window smooth blocks.',
    rows,
    note: 'Finite-N proxy depends on chosen epsilon threshold and search range for x.',
  };
}

const outPath = path.join('data', 'harder_batch20_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
