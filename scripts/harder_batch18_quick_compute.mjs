#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 18:
// EP-778, EP-782, EP-787, EP-791, EP-792,
// EP-805, EP-811, EP-813, EP-821, EP-824.

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
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

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

function choose2(n) {
  return (n * (n - 1)) / 2;
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

function maxCliqueSizeFromAdjMasks(adjMasks, n) {
  let best = 0;

  function bronk(Rsz, P, X) {
    if (P === 0n && X === 0n) {
      if (Rsz > best) best = Rsz;
      return;
    }
    if (Rsz + popcountBigInt(P) <= best) return;

    let PX = P | X;
    let u = 0;
    if (PX !== 0n) u = lsbIndex(PX);
    let cand = P & ~adjMasks[u];

    while (cand) {
      const bit = cand & -cand;
      const v = lsbIndex(bit);
      bronk(Rsz + 1, P & adjMasks[v], X & adjMasks[v]);
      P &= ~bit;
      X |= bit;
      cand &= ~bit;
      if (Rsz + popcountBigInt(P) <= best) return;
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

// EP-778: simulated play for clique-building game.
{
  const rng = makeRng(20260304 ^ 1801);

  function allEdges(n) {
    const e = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) e.push([i, j]);
    }
    return e;
  }

  function cliquePotentialScore(adj, u, v) {
    let common = 0;
    for (let w = 0; w < adj.length; w += 1) {
      if (adj[u][w] && adj[v][w]) common += 1;
    }
    return common;
  }

  function play(n, strategyA, strategyB) {
    const edges = allEdges(n);
    const rem = new Set(edges.map(([u, v]) => `${u},${v}`));
    const red = Array.from({ length: n }, () => Array(n).fill(0));
    const blue = Array.from({ length: n }, () => Array(n).fill(0));

    function chooseEdge(strategy, colorAdj) {
      const list = [...rem];
      if (strategy === 'random') {
        const k = list[Math.floor(rng() * list.length)];
        const [u, v] = k.split(',').map(Number);
        return [u, v];
      }

      // greedy_triangle: maximize current common-neighbor gain.
      let best = null;
      let bestScore = -1;
      const inspect = list.length > 110 ? 110 : list.length;
      for (let t = 0; t < inspect; t += 1) {
        const k = list[Math.floor(rng() * list.length)];
        const [u, v] = k.split(',').map(Number);
        const s = cliquePotentialScore(colorAdj, u, v);
        if (s > bestScore) {
          bestScore = s;
          best = [u, v];
        }
      }
      return best;
    }

    let aliceTurn = true;
    while (rem.size) {
      if (aliceTurn) {
        const [u, v] = chooseEdge(strategyA, red);
        red[u][v] = red[v][u] = 1;
        rem.delete(`${Math.min(u, v)},${Math.max(u, v)}`);
      } else {
        const [u, v] = chooseEdge(strategyB, blue);
        blue[u][v] = blue[v][u] = 1;
        rem.delete(`${Math.min(u, v)},${Math.max(u, v)}`);
      }
      aliceTurn = !aliceTurn;
    }

    function masksFromAdj(adj) {
      const masks = Array(n).fill(0n);
      for (let i = 0; i < n; i += 1) {
        let m = 0n;
        for (let j = 0; j < n; j += 1) if (adj[i][j]) m |= 1n << BigInt(j);
        masks[i] = m;
      }
      return masks;
    }

    const redClique = maxCliqueSizeFromAdjMasks(masksFromAdj(red), n);
    const blueClique = maxCliqueSizeFromAdjMasks(masksFromAdj(blue), n);
    return { redClique, blueClique };
  }

  const rows = [];
  for (const n of [8, 10, 12, 14]) {
    for (const [sa, sb, trials] of [
      ['random', 'random', 180],
      ['greedy_triangle', 'greedy_triangle', 160],
      ['greedy_triangle', 'random', 160],
      ['random', 'greedy_triangle', 160],
    ]) {
      let aliceWins = 0;
      let bobWins = 0;
      let ties = 0;
      let sumGap = 0;
      for (let t = 0; t < trials; t += 1) {
        const { redClique, blueClique } = play(n, sa, sb);
        const gap = redClique - blueClique;
        sumGap += gap;
        if (redClique > blueClique) aliceWins += 1;
        else if (blueClique > redClique) bobWins += 1;
        else ties += 1;
      }
      rows.push({
        n,
        alice_strategy: sa,
        bob_strategy: sb,
        trials,
        alice_win_rate: Number((aliceWins / trials).toPrecision(6)),
        bob_win_rate: Number((bobWins / trials).toPrecision(6)),
        tie_rate: Number((ties / trials).toPrecision(6)),
        avg_red_minus_blue_clique: Number((sumGap / trials).toPrecision(6)),
      });
    }
  }

  out.results.ep778 = {
    description: 'Finite simulated outcomes for clique-building game under random/greedy policies.',
    rows,
  };
}

// EP-782: quasi-progressions and additive-cube probes in squares.
{
  const N = 2_000_000;
  const squares = [];
  const isSquare = new Uint8Array(N + 1);
  for (let k = 1; k * k <= N; k += 1) {
    const s = k * k;
    squares.push(s);
    isSquare[s] = 1;
  }

  function bestQuasiLen(C) {
    const startLimit = Math.min(squares.length, 600);
    const pairSpan = 80;

    const memo = new Map();
    function ext(prev, d) {
      const key = `${prev}|${d}`;
      if (memo.has(key)) return memo.get(key);
      let best = 0;
      for (let z = 0; z <= C; z += 1) {
        const nxt = prev + d + z;
        if (nxt <= N && isSquare[nxt]) {
          const e = 1 + ext(nxt, d);
          if (e > best) best = e;
        }
      }
      memo.set(key, best);
      return best;
    }

    let best = 1;
    for (let i = 0; i < startLimit; i += 1) {
      for (let j = i + 1; j < Math.min(startLimit, i + pairSpan); j += 1) {
        const d = squares[j] - squares[i];
        const len = 2 + ext(squares[j], d);
        if (len > best) best = len;
      }
    }
    return best;
  }

  const quasiRows = [];
  for (const C of [0, 1, 2, 4, 8, 12]) {
    quasiRows.push({ C, search_cap_N: N, best_length_found: bestQuasiLen(C) });
  }

  // 2D cube search: a, a+b1, a+b2, a+b1+b2 all squares.
  let count2D = 0;
  const examples2D = [];
  const sqSmall = squares.filter((x) => x <= 200_000);
  const sqSet = new Set(sqSmall);

  for (let i = 0; i < sqSmall.length; i += 1) {
    const a = sqSmall[i];
    for (let j = i + 1; j < sqSmall.length; j += 1) {
      const b1 = sqSmall[j] - a;
      if (b1 <= 0) continue;
      for (let k = j + 1; k < Math.min(sqSmall.length, j + 50); k += 1) {
        const b2 = sqSmall[k] - a;
        if (sqSet.has(a + b1 + b2)) {
          count2D += 1;
          if (examples2D.length < 8) examples2D.push({ a, b1, b2 });
        }
      }
    }
  }

  // Random 3D cube probe.
  const rng = makeRng(20260304 ^ 1802);
  let found3D = 0;
  let ex3D = null;
  const sqRnd = sqSmall.slice(0, 1200);
  const sqRndSet = new Set(sqRnd);

  for (let t = 0; t < 300_000; t += 1) {
    const a = sqRnd[Math.floor(rng() * sqRnd.length)];
    const x1 = sqRnd[Math.floor(rng() * sqRnd.length)];
    const x2 = sqRnd[Math.floor(rng() * sqRnd.length)];
    const x3 = sqRnd[Math.floor(rng() * sqRnd.length)];
    const b1 = Math.abs(x1 - a);
    const b2 = Math.abs(x2 - a);
    const b3 = Math.abs(x3 - a);
    if (!b1 || !b2 || !b3) continue;

    const vals = [
      a,
      a + b1,
      a + b2,
      a + b3,
      a + b1 + b2,
      a + b1 + b3,
      a + b2 + b3,
      a + b1 + b2 + b3,
    ];
    if (vals.every((v) => sqRndSet.has(v))) {
      found3D += 1;
      if (!ex3D) ex3D = { a, b1, b2, b3 };
      if (found3D >= 3) break;
    }
  }

  out.results.ep782 = {
    description: 'Finite quasi-progression and additive-cube probes inside square numbers.',
    quasi_rows: quasiRows,
    additive_cube_probe: {
      search_cap_for_square_values: 200_000,
      two_dimensional_cube_hits: count2D,
      two_dimensional_examples: examples2D,
      random_three_dimensional_hits: found3D,
      first_three_dimensional_example: ex3D,
    },
  };
}

// EP-787: maximal B in sampled A with no distinct b1+b2 in A.
{
  function maxIndependentSizeFromAdj(adjMasks, n) {
    const comp = Array(n).fill(0n);
    for (let i = 0; i < n; i += 1) {
      let m = 0n;
      for (let j = 0; j < n; j += 1) {
        if (i === j) continue;
        if (((adjMasks[i] >> BigInt(j)) & 1n) === 0n) m |= 1n << BigInt(j);
      }
      comp[i] = m;
    }
    return maxCliqueSizeFromAdjMasks(comp, n);
  }

  function alphaForA(A) {
    const n = A.length;
    const S = new Set(A);
    const adj = Array(n).fill(0n);

    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (S.has(A[i] + A[j])) {
          adj[i] |= 1n << BigInt(j);
          adj[j] |= 1n << BigInt(i);
        }
      }
    }
    return maxIndependentSizeFromAdj(adj, n);
  }

  const rng = makeRng(20260304 ^ 1803);

  function randomSet(size, maxVal) {
    const S = new Set();
    while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
    return [...S].sort((a, b) => a - b);
  }

  const rows = [];
  for (const n of [20, 28, 36]) {
    const candidates = [];
    candidates.push(Array.from({ length: n }, (_, i) => i + 1));
    candidates.push(Array.from({ length: n }, (_, i) => 2 * i + 1));
    for (let t = 0; t < 8; t += 1) candidates.push(randomSet(n, 5 * n));

    let worst = n;
    let worstType = 'unknown';
    let avg = 0;
    for (let i = 0; i < candidates.length; i += 1) {
      const A = candidates[i];
      const a = alphaForA(A);
      avg += a;
      if (a < worst) {
        worst = a;
        worstType = i === 0 ? 'interval' : i === 1 ? 'odd_interval' : 'random';
      }
    }

    rows.push({
      n,
      sampled_A_count: candidates.length,
      worst_max_B_size_found: worst,
      worst_case_family_sampled: worstType,
      avg_max_B_size_over_samples: Number((avg / candidates.length).toPrecision(7)),
      worst_over_n: Number((worst / n).toPrecision(7)),
    });
  }

  out.results.ep787 = {
    description: 'Sampled worst-case search for largest B with pairwise distinct sums avoiding A.',
    rows,
  };
}

// EP-791: finite additive 2-basis exact small n and greedy larger n.
{
  function minBasisExact(n) {
    const target = n + 1;

    function coverCount(arr) {
      const cov = new Uint8Array(n + 1);
      for (let i = 0; i < arr.length; i += 1) {
        for (let j = i; j < arr.length; j += 1) {
          const s = arr[i] + arr[j];
          if (s <= n) cov[s] = 1;
        }
      }
      let c = 0;
      for (let x = 0; x <= n; x += 1) c += cov[x];
      return c;
    }

    function feasible(k) {
      const arr = [0];

      function dfs(nextVal) {
        if (arr.length === k) return coverCount(arr) === target;

        const curCov = coverCount(arr);
        const r = k - arr.length;
        const curSize = arr.length;
        const maxNew = r * curSize + (r * (r + 1)) / 2;
        if (curCov + maxNew < target) return false;

        for (let v = nextVal; v <= n; v += 1) {
          arr.push(v);
          if (dfs(v + 1)) return true;
          arr.pop();
        }
        return false;
      }

      return dfs(1);
    }

    for (let k = Math.max(2, Math.floor(Math.sqrt(2 * n))); k <= n + 1; k += 1) {
      if (feasible(k)) return k;
    }
    return null;
  }

  function greedyBasis(n) {
    const A = [0];
    const cov = new Uint8Array(n + 1);
    cov[0] = 1;

    function add(v) {
      for (const a of A) {
        const s = a + v;
        if (s <= n) cov[s] = 1;
      }
      const s2 = 2 * v;
      if (s2 <= n) cov[s2] = 1;
      A.push(v);
    }

    while (true) {
      let uncovered = -1;
      for (let x = 0; x <= n; x += 1) {
        if (!cov[x]) {
          uncovered = x;
          break;
        }
      }
      if (uncovered < 0) break;

      let bestV = 1;
      let bestGain = -1;
      for (let v = 1; v <= n; v += 1) {
        if (A.includes(v)) continue;
        let gain = 0;
        for (const a of A) {
          const s = a + v;
          if (s <= n && !cov[s]) gain += 1;
        }
        const s2 = 2 * v;
        if (s2 <= n && !cov[s2]) gain += 1;
        if (gain > bestGain) {
          bestGain = gain;
          bestV = v;
        }
      }
      add(bestV);
    }

    return A.length;
  }

  const exactRows = [];
  for (const n of [10, 15, 20, 24]) {
    const g = minBasisExact(n);
    exactRows.push({
      n,
      g_n_exact: g,
      g_n_squared_over_n: Number(((g * g) / n).toPrecision(7)),
    });
  }

  const greedyRows = [];
  for (const n of [40, 60, 80, 120]) {
    const g = greedyBasis(n);
    greedyRows.push({
      n,
      g_n_greedy_upper: g,
      g_n_squared_over_n: Number(((g * g) / n).toPrecision(7)),
    });
  }

  out.results.ep791 = {
    description: 'Finite additive 2-basis profile: exact small n and greedy larger n.',
    exact_rows: exactRows,
    greedy_rows: greedyRows,
  };
}

// EP-792: sampled worst-case max sum-free subset size.
{
  const rng = makeRng(20260304 ^ 1804);

  function maxSumFreeExact(A) {
    const n = A.length;
    const idx = new Map();
    for (let i = 0; i < n; i += 1) idx.set(A[i], i);

    const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => A[j] - A[i]);
    const chosenVals = new Set();
    let best = 0;

    function canAdd(v) {
      if (chosenVals.has(2 * v)) return false;
      for (const y of chosenVals) {
        if (chosenVals.has(v + y)) return false;
        if (chosenVals.has(v - y)) return false;
        if (chosenVals.has(y - v)) return false;
      }
      return true;
    }

    function dfs(pos, cur) {
      if (cur + (n - pos) <= best) return;
      if (pos === n) {
        if (cur > best) best = cur;
        return;
      }

      const i = order[pos];
      const v = A[i];

      if (canAdd(v)) {
        chosenVals.add(v);
        dfs(pos + 1, cur + 1);
        chosenVals.delete(v);
      }

      dfs(pos + 1, cur);
    }

    dfs(0, 0);
    return best;
  }

  function randomSet(size, maxVal) {
    const S = new Set();
    while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
    return [...S].sort((a, b) => a - b);
  }

  const rows = [];
  for (const n of [16, 20, 24]) {
    const samples = [];
    samples.push(Array.from({ length: n }, (_, i) => i + 1));
    samples.push(Array.from({ length: n }, (_, i) => i + 2));
    for (let t = 0; t < 6; t += 1) samples.push(randomSet(n, 5 * n));

    let worst = n;
    let avg = 0;
    for (const A of samples) {
      const v = maxSumFreeExact(A);
      avg += v;
      if (v < worst) worst = v;
    }

    rows.push({
      n,
      sampled_A_count: samples.length,
      worst_max_sum_free_size_found: worst,
      avg_max_sum_free_size: Number((avg / samples.length).toPrecision(7)),
      worst_minus_n_over_3: Number((worst - n / 3).toPrecision(7)),
      worst_over_n: Number((worst / n).toPrecision(7)),
    });
  }

  out.results.ep792 = {
    description: 'Sampled finite profile for largest guaranteed sum-free subset size.',
    rows,
  };
}

// EP-805: random-graph induced-subset local Ramsey checks.
{
  const rng = makeRng(20260304 ^ 1805);

  function randomGraph(n, p) {
    const G = makeGraph(n);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (rng() < p) addEdge(G, i, j);
      }
    }
    return G;
  }

  function hasCliqueAtLeastT(localAdjMasks, t) {
    const m = localAdjMasks.length;
    const all = (1n << BigInt(m)) - 1n;

    function dfs(cand, need) {
      if (need <= 0) return true;
      if (popcountBigInt(cand) < need) return false;
      let c = cand;
      while (c) {
        const bit = c & -c;
        const v = lsbIndex(bit);
        if (dfs(cand & localAdjMasks[v], need - 1)) return true;
        c &= ~bit;
        cand &= ~bit;
        if (popcountBigInt(cand) < need) return false;
      }
      return false;
    }

    return dfs(all, t);
  }

  function sampleSubset(n, g) {
    const arr = Array.from({ length: n }, (_, i) => i);
    shuffle(arr, rng);
    return arr.slice(0, g);
  }

  function buildLocalMasks(G, subset, complement = false) {
    const m = subset.length;
    const masks = Array(m).fill(0n);
    for (let i = 0; i < m; i += 1) {
      let mm = 0n;
      for (let j = 0; j < m; j += 1) {
        if (i === j) continue;
        const u = subset[i];
        const v = subset[j];
        const edge = G.adj[u][v] === 1;
        if (complement ? !edge : edge) mm |= 1n << BigInt(j);
      }
      masks[i] = mm;
    }
    return masks;
  }

  const rows = [];
  for (const n of [128, 256]) {
    const G = randomGraph(n, 0.5);
    const t = Math.ceil(Math.log2(n));

    for (const g of [24, 32, 40, 56, 72, 96]) {
      if (g >= n) continue;
      const samples = 140;
      let pass = 0;

      for (let s = 0; s < samples; s += 1) {
        const subset = sampleSubset(n, g);
        const masks = buildLocalMasks(G, subset, false);
        const hasCl = hasCliqueAtLeastT(masks, t);
        if (!hasCl) continue;
        const compMasks = buildLocalMasks(G, subset, true);
        const hasInd = hasCliqueAtLeastT(compMasks, t);
        if (hasInd) pass += 1;
      }

      rows.push({
        n,
        target_log2_n_threshold_t: t,
        g,
        samples,
        sampled_fraction_subsets_with_both_clique_and_independent_size_at_least_t: Number((pass / samples).toPrecision(6)),
      });
    }
  }

  out.results.ep805 = {
    description: 'Sampled induced-subset local Ramsey profile in random graphs.',
    rows,
  };
}

// EP-811: balanced 6-colorings of K_13 via cyclic distance classes; rainbow K4/C6 checks.
{
  const n = 13;
  // Color by cyclic distance class in Z_13: colors 0..5 correspond to distances 1..6.
  const color = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      const d = Math.abs(u - v);
      const dd = Math.min(d, n - d);
      const c = dd - 1;
      color[u][v] = color[v][u] = c;
    }
  }

  function hasRainbowK4() {
    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        for (let c = b + 1; c < n; c += 1) {
          for (let d = c + 1; d < n; d += 1) {
            const cols = [
              color[a][b], color[a][c], color[a][d],
              color[b][c], color[b][d], color[c][d],
            ];
            const S = new Set(cols);
            if (S.size === 6) return true;
          }
        }
      }
    }
    return false;
  }

  function hasRainbowC6() {
    const used = Array(n).fill(false);
    const path = [];

    for (let start = 0; start < n; start += 1) {
      path.length = 0;
      used.fill(false);
      path.push(start);
      used[start] = true;

      function dfs() {
        if (path.length === 6) {
          const cols = [];
          for (let i = 0; i < 6; i += 1) {
            const u = path[i];
            const v = path[(i + 1) % 6];
            cols.push(color[u][v]);
          }
          return new Set(cols).size === 6;
        }

        const last = path[path.length - 1];
        for (let v = 0; v < n; v += 1) {
          if (used[v]) continue;
          if (v < start) continue; // mild symmetry break
          path.push(v);
          used[v] = true;
          if (dfs()) return true;
          used[v] = false;
          path.pop();
        }
        return false;
      }

      if (dfs()) return true;
    }

    return false;
  }

  // Verify balance per vertex per color.
  const deg = Array.from({ length: n }, () => Array(6).fill(0));
  for (let u = 0; u < n; u += 1) {
    for (let v = 0; v < n; v += 1) {
      if (u === v) continue;
      deg[u][color[u][v]] += 1;
    }
  }

  const balanced = deg.every((arr) => arr.every((x) => x === 2));

  out.results.ep811 = {
    description: 'Structured balanced 6-coloring test on K_13 for rainbow K4 and C6.',
    n,
    colors: 6,
    balanced_degrees_confirmed: balanced,
    per_vertex_color_degree: 2,
    has_rainbow_K4: hasRainbowK4(),
    has_rainbow_C6: hasRainbowC6(),
  };
}

// EP-813: sampled graphs with local 7-vertex triangle condition and clique size.
{
  const rng = makeRng(20260304 ^ 1806);

  function randomGraph(n, p) {
    const G = makeGraph(n);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (rng() < p) addEdge(G, i, j);
      }
    }
    return G;
  }

  function sampledLocalViolations(G, samples) {
    const n = G.n;
    let bad = 0;
    for (let s = 0; s < samples; s += 1) {
      const verts = Array.from({ length: n }, (_, i) => i);
      shuffle(verts, rng);
      const A = verts.slice(0, 7);

      let hasTri = false;
      for (let i = 0; i < 7 && !hasTri; i += 1) {
        for (let j = i + 1; j < 7 && !hasTri; j += 1) {
          if (!G.adj[A[i]][A[j]]) continue;
          for (let k = j + 1; k < 7; k += 1) {
            if (G.adj[A[i]][A[k]] && G.adj[A[j]][A[k]]) {
              hasTri = true;
              break;
            }
          }
        }
      }

      if (!hasTri) bad += 1;
    }
    return bad;
  }

  function cliqueSizeExact(G) {
    const n = G.n;
    const masks = Array(n).fill(0n);
    for (let i = 0; i < n; i += 1) {
      let m = 0n;
      for (let j = 0; j < n; j += 1) if (G.adj[i][j]) m |= 1n << BigInt(j);
      masks[i] = m;
    }
    return maxCliqueSizeFromAdjMasks(masks, n);
  }

  const rows = [];
  for (const [n, p, tries] of [[26, 0.52, 30], [30, 0.52, 28], [34, 0.53, 24]]) {
    let best = null;
    for (let t = 0; t < tries; t += 1) {
      const G = randomGraph(n, p);
      const bad = sampledLocalViolations(G, 12_000);
      if (best === null || bad < best.bad || (bad === best.bad && G.m < best.m)) {
        best = { G, bad, m: G.m };
      }
    }

    const clique = cliqueSizeExact(best.G);
    rows.push({
      n,
      edge_count: best.m,
      sampled_7set_triangle_free_violations_in_12000_samples: best.bad,
      clique_number_exact: clique,
      clique_over_n_pow_1_over_3: Number((clique / (n ** (1 / 3))).toPrecision(7)),
      clique_over_sqrt_n: Number((clique / Math.sqrt(n)).toPrecision(7)),
    });
  }

  out.results.ep813 = {
    description: 'Sampled local-condition graph search with exact clique computation on best candidates.',
    rows,
  };
}

// EP-821: totient preimage multiplicity scan.
{
  const N = 500_000;
  const phi = Array.from({ length: N + 1 }, (_, i) => i);
  for (let p = 2; p <= N; p += 1) {
    if (phi[p] !== p) continue;
    for (let k = p; k <= N; k += p) {
      phi[k] -= Math.floor(phi[k] / p);
    }
  }

  const freq = new Uint32Array(N + 1);
  for (let m = 1; m <= N; m += 1) {
    const v = phi[m];
    if (v <= N) freq[v] += 1;
  }

  let bestN = 1;
  let bestG = 0;
  const tops = [];
  for (let n = 1; n <= N; n += 1) {
    const g = freq[n];
    if (g > bestG) {
      bestG = g;
      bestN = n;
    }
    if (g >= 20) tops.push({ n, g });
  }

  const topSorted = tops.sort((a, b) => b.g - a.g || a.n - b.n).slice(0, 30);

  out.results.ep821 = {
    description: 'Finite scan of g(n)=#{m:phi(m)=n} for n up to 5e5.',
    N,
    max_g_n_found: bestG,
    argmax_n_found: bestN,
    max_exponent_log_g_over_log_n: Number((Math.log(bestG) / Math.log(bestN)).toPrecision(7)),
    top_values: topSorted,
  };
}

// EP-824: coprime pairs with equal sigma.
{
  const MAXX = 30_000;
  const sigma = new Uint32Array(MAXX + 1);
  for (let d = 1; d <= MAXX; d += 1) {
    for (let m = d; m <= MAXX; m += d) sigma[m] += d;
  }

  function hOfX(x) {
    const mp = new Map();
    for (let a = 1; a < x; a += 1) {
      const s = sigma[a];
      if (!mp.has(s)) mp.set(s, []);
      mp.get(s).push(a);
    }

    let h = 0;
    for (const arr of mp.values()) {
      if (arr.length < 2) continue;
      for (let i = 0; i < arr.length; i += 1) {
        for (let j = i + 1; j < arr.length; j += 1) {
          if (gcd(arr[i], arr[j]) === 1) h += 1;
        }
      }
    }
    return h;
  }

  const rows = [];
  for (const x of [5_000, 10_000, 20_000, 30_000]) {
    const h = hOfX(x);
    rows.push({
      x,
      h_x: h,
      h_over_x: Number((h / x).toPrecision(7)),
      h_over_x_pow_1p5: Number((h / (x ** 1.5)).toPrecision(7)),
      log_h_over_log_x: h > 0 ? Number((Math.log(h) / Math.log(x)).toPrecision(7)) : null,
    });
  }

  out.results.ep824 = {
    description: 'Finite coprime-equal-sigma pair counts for increasing x.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch18_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
