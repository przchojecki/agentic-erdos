#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 5:
// EP-131, EP-132, EP-138, EP-141, EP-142, EP-143, EP-145, EP-146, EP-148, EP-149.

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

function roundedKey(x, digits = 10) {
  return x.toFixed(digits);
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

function randomPoints(n, rng) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([Math.floor(rng() * 1e6), Math.floor(rng() * 1e6)]);
  return pts;
}

function distanceMultiplicityProfile(points) {
  const mp = new Map();
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const d2 = dx * dx + dy * dy;
      const k = roundedKey(d2, 10);
      mp.set(k, (mp.get(k) || 0) + 1);
    }
  }
  const vals = [...mp.values()].sort((a, b) => b - a);
  return vals;
}

function buildAPs(N, k) {
  const aps = [];
  for (let a = 1; a <= N; a += 1) {
    for (let d = 1; a + (k - 1) * d <= N; d += 1) {
      const ap = [];
      for (let j = 0; j < k; j += 1) ap.push(a + j * d - 1); // zero-based indices
      aps.push(ap);
    }
  }
  return aps;
}

function exists2ColoringWithoutMonochAP(k, N, rng, restarts = 40, maxSteps = 50000) {
  const aps = buildAPs(N, k);
  const inAPs = Array.from({ length: N }, () => []);
  for (let i = 0; i < aps.length; i += 1) for (const v of aps[i]) inAPs[v].push(i);

  for (let rep = 0; rep < restarts; rep += 1) {
    const col = new Uint8Array(N);
    for (let i = 0; i < N; i += 1) col[i] = rng() < 0.5 ? 1 : 0;

    const ones = new Int16Array(aps.length);
    const bad = new Uint8Array(aps.length);
    const badList = [];
    for (let i = 0; i < aps.length; i += 1) {
      let s = 0;
      for (const v of aps[i]) s += col[v];
      ones[i] = s;
      if (s === 0 || s === k) {
        bad[i] = 1;
        badList.push(i);
      }
    }

    function removeBad(id) {
      if (!bad[id]) return;
      bad[id] = 0;
    }

    for (let step = 0; step < maxSteps; step += 1) {
      // Rebuild sparse bad-list occasionally for cleanliness.
      if (step % 2000 === 0) {
        badList.length = 0;
        for (let i = 0; i < aps.length; i += 1) if (bad[i]) badList.push(i);
      }
      if (badList.length === 0) return true;

      const apId = badList[Math.floor(rng() * badList.length)];
      if (!bad[apId]) continue;
      const ap = aps[apId];
      const v = ap[Math.floor(rng() * ap.length)];

      const old = col[v];
      const neu = old ^ 1;

      let deltaBad = 0;
      for (const aId of inAPs[v]) {
        const before = bad[aId] ? 1 : 0;
        const sOld = ones[aId];
        const sNew = sOld + (neu - old);
        const after = sNew === 0 || sNew === k ? 1 : 0;
        deltaBad += after - before;
      }

      // Accept improving moves, with occasional uphill move.
      if (deltaBad <= 0 || rng() < 0.015) {
        col[v] = neu;
        for (const aId of inAPs[v]) {
          const sNew = ones[aId] + (neu - old);
          ones[aId] = sNew;
          const isBad = sNew === 0 || sNew === k;
          if (isBad && !bad[aId]) {
            bad[aId] = 1;
            badList.push(aId);
          } else if (!isBad && bad[aId]) {
            removeBad(aId);
          }
        }
      }
    }
  }
  return false;
}

function isNonDividingSet(A) {
  const k = A.length;
  for (let i = 0; i < k; i += 1) {
    const a = A[i];
    const nonEmpty = new Uint8Array(a);
    for (let j = 0; j < k; j += 1) {
      if (j === i) continue;
      const x = A[j] % a;
      const nxt = nonEmpty.slice();
      nxt[x] = 1;
      for (let r = 0; r < a; r += 1) {
        if (!nonEmpty[r]) continue;
        nxt[(r + x) % a] = 1;
      }
      for (let r = 0; r < a; r += 1) nonEmpty[r] = nxt[r];
      if (nonEmpty[0]) return false;
    }
  }
  return true;
}

function randomGreedyNonDividing(N, restarts, rng) {
  let best = [];
  const base = Array.from({ length: N - 1 }, (_, i) => i + 2); // skip 1
  for (let t = 0; t < restarts; t += 1) {
    const ord = [...base];
    shuffle(ord, rng);
    const cur = [];
    for (const x of ord) {
      cur.push(x);
      if (!isNonDividingSet(cur)) cur.pop();
    }
    if (cur.length > best.length) best = [...cur];
  }
  return best;
}

function countConsecutivePrimeAP(primes, k) {
  let count = 0;
  let first = null;
  let last = null;
  for (let i = 0; i + k - 1 < primes.length; i += 1) {
    const d = primes[i + 1] - primes[i];
    let ok = true;
    for (let j = 2; j < k; j += 1) {
      if (primes[i + j] - primes[i + j - 1] !== d) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    count += 1;
    if (!first) first = { start: primes[i], diff: d };
    last = { start: primes[i], diff: d };
  }
  return { count, first, last };
}

function greedyNo3APSize(N) {
  const inSet = new Uint8Array(N + 1);
  const elems = [];
  for (let x = 1; x <= N; x += 1) {
    let bad = false;
    for (const y of elems) {
      const z1 = 2 * y - x;
      if (z1 >= 1 && inSet[z1]) {
        bad = true;
        break;
      }
      const s = x + y;
      if ((s & 1) === 0) {
        const z2 = s >> 1;
        if (inSet[z2]) {
          bad = true;
          break;
        }
      }
    }
    if (!bad) {
      inSet[x] = 1;
      elems.push(x);
    }
  }
  return elems.length;
}

function greedyNo4APSize(N) {
  const inSet = new Uint8Array(N + 1);
  const elems = [];
  for (let x = 1; x <= N; x += 1) {
    let bad = false;
    for (let d = 1; x - 3 * d >= 1; d += 1) {
      if (inSet[x - d] && inSet[x - 2 * d] && inSet[x - 3 * d]) {
        bad = true;
        break;
      }
    }
    if (!bad) {
      inSet[x] = 1;
      elems.push(x);
    }
  }
  return elems.length;
}

function finiteApproxCondition143(setScaled, xScaled, K) {
  // finite proxy for |k x - y| >= 1 with x,y in tenths (scaled by 10)
  for (const y of setScaled) {
    for (let k = 1; k <= K; k += 1) {
      if (Math.abs(k * xScaled - y) < 10) return false;
      if (Math.abs(k * y - xScaled) < 10) return false;
    }
  }
  return true;
}

function randomGreedy143Proxy(M, K, restarts, rng) {
  const lo = 11;
  const hi = 10 * M;
  const base = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  let bestSet = [];

  for (let t = 0; t < restarts; t += 1) {
    const ord = [...base];
    shuffle(ord, rng);
    const cur = [];
    for (const x of ord) {
      if (finiteApproxCondition143(cur, x, K)) cur.push(x);
    }
    if (cur.length > bestSet.length) bestSet = [...cur];
  }

  let hsum = 0;
  for (const x of bestSet) hsum += 10 / x;
  return { size: bestSet.length, harmonic_sum: hsum };
}

function squarefreeMarks(limit) {
  const sf = new Uint8Array(limit + 1);
  sf.fill(1, 1);
  const root = Math.floor(Math.sqrt(limit));
  for (let p = 2; p <= root; p += 1) {
    const sq = p * p;
    for (let m = sq; m <= limit; m += sq) sf[m] = 0;
  }
  sf[0] = 0;
  return sf;
}

function buildGraph(n) {
  return Array.from({ length: n }, () => new Uint8Array(n));
}

function commonNeighbors(adj, u, v) {
  let c = 0;
  for (let w = 0; w < adj.length; w += 1) if (adj[u][w] && adj[v][w]) c += 1;
  return c;
}

function randomGreedyC4Free(n, trials, rng) {
  const edges = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const ord = [...edges];
    shuffle(ord, rng);
    const adj = buildGraph(n);
    let m = 0;
    for (const [u, v] of ord) {
      if (commonNeighbors(adj, u, v) >= 2) continue;
      adj[u][v] = 1;
      adj[v][u] = 1;
      m += 1;
    }
    if (m > best) best = m;
  }
  return best;
}

function randomGreedyK23Free(n, trials, rng) {
  const edges = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  let best = 0;

  for (let t = 0; t < trials; t += 1) {
    const ord = [...edges];
    shuffle(ord, rng);
    const adj = buildGraph(n);
    let m = 0;

    for (const [u, v] of ord) {
      let bad = false;
      // only pairs involving u or v can gain a common neighbor after adding uv.
      for (let w = 0; w < n; w += 1) {
        if (w === u || w === v) continue;
        if (adj[v][w] && commonNeighbors(adj, u, w) >= 2) {
          bad = true;
          break;
        }
        if (adj[u][w] && commonNeighbors(adj, v, w) >= 2) {
          bad = true;
          break;
        }
      }
      if (bad) continue;

      adj[u][v] = 1;
      adj[v][u] = 1;
      m += 1;
    }

    if (m > best) best = m;
  }

  return best;
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

function countEgyptianDistinct(k) {
  const memo = new Map();

  function key(num, den, start, left) {
    return `${num}/${den}|${start}|${left}`;
  }

  function dfs(num, den, start, left) {
    if (num <= 0n) return 0n;
    if (left === 0) return num === 0n ? 1n : 0n;

    const kk = key(num, den, start, left);
    if (memo.has(kk)) return memo.get(kk);

    if (left === 1) {
      if (den % num !== 0n) {
        memo.set(kk, 0n);
        return 0n;
      }
      const d = den / num;
      const ans = d >= BigInt(start) ? 1n : 0n;
      memo.set(kk, ans);
      return ans;
    }

    const minD = Math.max(start, Number((den + num - 1n) / num));
    const maxD = Number((BigInt(left) * den) / num);
    if (minD > maxD) {
      memo.set(kk, 0n);
      return 0n;
    }

    let total = 0n;
    for (let d = minD; d <= maxD; d += 1) {
      const db = BigInt(d);
      const newNum = num * db - den;
      if (newNum <= 0n) continue;
      const newDen = den * db;
      const g = gcdBig(newNum, newDen);
      total += dfs(newNum / g, newDen / g, d + 1, left - 1);
    }

    memo.set(kk, total);
    return total;
  }

  return dfs(1n, 1n, 2, k);
}

function edgeConflictInStrongColoring(adj, e1, e2) {
  const [a, b] = e1;
  const [c, d] = e2;
  if (a === c || a === d || b === c || b === d) return true;
  if (adj[a][c] || adj[a][d] || adj[b][c] || adj[b][d]) return true;
  return false;
}

function greedyStrongColorCount(adj, edges) {
  const m = edges.length;
  const conflict = Array.from({ length: m }, () => new Uint8Array(m));
  const deg = new Int32Array(m);
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      if (edgeConflictInStrongColoring(adj, edges[i], edges[j])) {
        conflict[i][j] = 1;
        conflict[j][i] = 1;
        deg[i] += 1;
        deg[j] += 1;
      }
    }
  }

  const order = Array.from({ length: m }, (_, i) => i).sort((i, j) => deg[j] - deg[i]);
  const color = new Int32Array(m);
  color.fill(-1);
  let used = 0;

  for (const v of order) {
    const blocked = new Uint8Array(used + 2);
    for (let u = 0; u < m; u += 1) {
      if (!conflict[v][u]) continue;
      const c = color[u];
      if (c >= 0) blocked[c] = 1;
    }
    let c = 0;
    while (blocked[c]) c += 1;
    color[v] = c;
    if (c + 1 > used) used = c + 1;
  }

  return used;
}

function buildBlowupC5(t) {
  const n = 5 * t;
  const part = (v) => Math.floor(v / t);
  const adj = buildGraph(n);
  const edges = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      const pu = part(u);
      const pv = part(v);
      const diff = (pv - pu + 5) % 5;
      if (diff === 1 || diff === 4) {
        adj[u][v] = 1;
        adj[v][u] = 1;
        edges.push([u, v]);
      }
    }
  }
  const Delta = 2 * t;
  return { n, edges, adj, Delta };
}

function randomBoundedDegreeGraph(n, Delta, rng) {
  const adj = buildGraph(n);
  const deg = new Int16Array(n);
  const pairs = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) pairs.push([u, v]);
  shuffle(pairs, rng);
  const edges = [];
  for (const [u, v] of pairs) {
    if (deg[u] >= Delta || deg[v] >= Delta) continue;
    if (rng() < 0.28) continue;
    adj[u][v] = 1;
    adj[v][u] = 1;
    deg[u] += 1;
    deg[v] += 1;
    edges.push([u, v]);
  }
  return { adj, edges, maxDeg: Math.max(...deg) };
}

const rng = makeRng(20260303 ^ 511);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-131
{
  const rows = [];
  for (const [N, restarts] of [
    [80, 120],
    [120, 100],
    [180, 80],
    [260, 60],
  ]) {
    const best = randomGreedyNonDividing(N, restarts, rng);
    rows.push({
      N,
      restarts,
      best_size_found: best.length,
      best_size_over_N_pow_quarter: Number((best.length / N ** 0.25).toFixed(6)),
      best_size_over_sqrtN: Number((best.length / Math.sqrt(N)).toFixed(6)),
    });
  }
  out.results.ep131 = {
    description: 'Random-greedy finite profile for non-dividing sets in [1,N].',
    rows,
  };
}

// EP-132
{
  const rows = [];

  const triGlue = [
    [0, 0],
    [1, 0],
    [0.5, Math.sqrt(3) / 2],
    [0.5, -Math.sqrt(3) / 2],
  ];
  const mult4 = distanceMultiplicityProfile(triGlue);
  rows.push({
    model: 'n4_two_equilateral_triangles_sharing_edge',
    n: 4,
    distances_with_multiplicity_le_n: mult4.filter((x) => x <= 4).length,
    top_multiplicities: mult4.slice(0, 4),
  });

  for (const n of [36, 64, 100, 144]) {
    const g = gridPoints(Math.round(Math.sqrt(n)));
    const t = triPatchPoints(n);
    const r = randomPoints(n, rng);

    for (const [name, pts] of [
      ['grid', g],
      ['tri_patch', t],
      ['random', r],
    ]) {
      const vals = distanceMultiplicityProfile(pts);
      const leN = vals.filter((x) => x <= n).length;
      const gtN = vals.filter((x) => x > n).length;
      rows.push({
        model: name,
        n,
        distinct_distance_count: vals.length,
        distances_with_multiplicity_le_n: leN,
        distances_with_multiplicity_gt_n: gtN,
        top3_multiplicities: vals.slice(0, 3),
      });
    }
  }

  out.results.ep132 = {
    description: 'Distance-multiplicity finite profiles for representative planar point models.',
    rows,
  };
}

// EP-138
{
  const searchRows = [];
  for (const N of [34, 35, 40]) {
    const ok = exists2ColoringWithoutMonochAP(4, N, rng, 50, 50000);
    searchRows.push({ k: 4, N_tested: N, found_coloring_without_monochromatic_kAP: ok });
  }

  const knownSmall = [
    { k: 3, exact_W_k: 27 },
    { k: 4, exact_W_k: 35 },
  ];

  const berlekampRows = [];
  for (const p of [2, 3, 5, 7, 11, 13]) {
    const k = p + 1;
    const lower = p * 2 ** p;
    berlekampRows.push({
      prime_p: p,
      k: p + 1,
      lower_bound_W_of_k: lower,
      lower_root_bound: Number(lower ** (1 / k)).toFixed(6),
    });
  }

  out.results.ep138 = {
    description: 'Finite coloring search at small k and classical Berlekamp lower-root profile.',
    known_exact_small_k: knownSmall,
    search_rows: searchRows,
    berlekamp_rows: berlekampRows,
  };
}

// EP-141
{
  const { primes } = sieve(5_000_000);
  const rows = [];
  for (const k of [3, 4, 5, 6, 7]) {
    const ans = countConsecutivePrimeAP(primes, k);
    rows.push({
      k,
      count_up_to_5e6: ans.count,
      first_example: ans.first,
      last_example: ans.last,
    });
  }
  out.results.ep141 = {
    description: 'Counts of consecutive-prime arithmetic progressions up to 5e6.',
    prime_limit: 5_000_000,
    rows,
  };
}

// EP-142
{
  const rows = [];
  for (const N of [10_000, 20_000, 50_000]) {
    const sz = greedyNo3APSize(N);
    rows.push({
      k: 3,
      N,
      greedy_size: sz,
      density: Number((sz / N).toFixed(6)),
      size_over_N_div_logN: Number((sz / (N / Math.log(N))).toFixed(6)),
    });
  }

  for (const N of [4_000, 8_000, 12_000]) {
    const sz = greedyNo4APSize(N);
    rows.push({
      k: 4,
      N,
      greedy_size: sz,
      density: Number((sz / N).toFixed(6)),
      size_over_N_div_sqrtlogN: Number((sz / (N / Math.sqrt(Math.log(N)))).toFixed(6)),
    });
  }

  out.results.ep142 = {
    description: 'Finite greedy AP-free set sizes for k=3 and k=4.',
    rows,
  };
}

// EP-143
{
  const rows = [];
  const K = 60;
  const { primes } = sieve(2000);

  for (const M of [50, 100, 150]) {
    const proxy = randomGreedy143Proxy(M, K, 80, rng);

    let primeH = 0;
    let primeCnt = 0;
    for (const p of primes) {
      if (p > M) break;
      primeCnt += 1;
      primeH += 1 / p;
    }

    rows.push({
      M,
      finite_k_cutoff_K: K,
      best_proxy_size_found: proxy.size,
      best_proxy_harmonic_sum: Number(proxy.harmonic_sum.toFixed(6)),
      primes_count_le_M: primeCnt,
      primes_harmonic_sum_le_M: Number(primeH.toFixed(6)),
    });
  }

  out.results.ep143 = {
    description: 'Finite discrete proxy search for the |kx-y|>=1 sparsity condition.',
    rows,
  };
}

// EP-145
{
  const Xmax = 2_010_000;
  const sf = squarefreeMarks(Xmax);
  const sq = [];
  for (let n = 1; n <= Xmax; n += 1) if (sf[n]) sq.push(n);

  const alphaList = [1, 2, 3, 3.5, 3.75, 4];
  const rows = [];
  for (const X of [200_000, 500_000, 1_000_000, 2_000_000]) {
    let idx = 0;
    while (idx + 1 < sq.length && sq[idx] <= X) idx += 1;

    const sums = new Map(alphaList.map((a) => [a, 0]));
    for (let i = 0; i + 1 < sq.length && sq[i] <= X; i += 1) {
      const g = sq[i + 1] - sq[i];
      for (const a of alphaList) sums.set(a, sums.get(a) + g ** a);
    }

    const row = { X, squarefree_count_le_X: sq.findIndex((v) => v > X) };
    for (const a of alphaList) {
      row[`moment_alpha_${String(a).replace('.', '_')}`] = Number((sums.get(a) / X).toFixed(6));
    }
    rows.push(row);
  }

  out.results.ep145 = {
    description: 'Empirical moments of squarefree gaps over growing ranges.',
    rows,
  };
}

// EP-146
{
  const rows = [];
  for (const n of [40, 60, 80, 100]) {
    const c4 = randomGreedyC4Free(n, 30, rng);
    const k23 = randomGreedyK23Free(n, 24, rng);
    rows.push({
      n,
      best_edges_C4_free_found: c4,
      C4_ratio_over_n_3_over_2: Number((c4 / (n ** 1.5)).toFixed(6)),
      best_edges_K2_3_free_found: k23,
      K23_ratio_over_n_3_over_2: Number((k23 / (n ** 1.5)).toFixed(6)),
    });
  }
  out.results.ep146 = {
    description: 'Finite random-greedy H-free edge profiles for r=2-degenerate examples (C4 and K2,3).',
    rows,
  };
}

// EP-148
{
  const rows = [];
  for (const k of [2, 3, 4, 5]) {
    const Fk = countEgyptianDistinct(k);
    rows.push({
      k,
      exact_F_k_small_k: Number(Fk),
      log2_F_k: Number((Math.log2(Number(Fk) || 1)).toFixed(6)),
    });
  }
  out.results.ep148 = {
    description: 'Exact small-k values for the number of distinct-denominator Egyptian-fraction representations of 1.',
    rows,
  };
}

// EP-149
{
  const blowupRows = [];
  for (const t of [2, 3, 4]) {
    const { edges, adj, Delta } = buildBlowupC5(t);
    const greedyColors = greedyStrongColorCount(adj, edges);
    blowupRows.push({
      construction: 'C5_blowup',
      t,
      n_vertices: 5 * t,
      edge_count: edges.length,
      Delta,
      target_5_over_4_Delta_sq: Number((1.25 * Delta * Delta).toFixed(6)),
      greedy_strong_color_count: greedyColors,
      greedy_over_Delta_sq: Number((greedyColors / (Delta * Delta)).toFixed(6)),
    });
  }

  const randomRows = [];
  for (const Delta of [4, 6, 8]) {
    const n = 42;
    let best = 0;
    const trials = 18;
    for (let t = 0; t < trials; t += 1) {
      const g = randomBoundedDegreeGraph(n, Delta, rng);
      if (g.maxDeg === 0 || g.edges.length === 0) continue;
      const colors = greedyStrongColorCount(g.adj, g.edges);
      if (colors > best) best = colors;
    }
    randomRows.push({
      n,
      Delta_target: Delta,
      trials,
      max_greedy_strong_colors_found: best,
      ratio_over_Delta_sq: Number((best / (Delta * Delta)).toFixed(6)),
      ratio_over_5_over_4_Delta_sq: Number((best / (1.25 * Delta * Delta)).toFixed(6)),
    });
  }

  out.results.ep149 = {
    description: 'Finite strong-edge-coloring profiles for extremal blowup and random bounded-degree graphs.',
    blowup_rows: blowupRows,
    random_rows: randomRows,
  };
}

const outPath = path.join('data', 'harder_batch5_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
