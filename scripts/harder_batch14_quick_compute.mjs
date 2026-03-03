#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 14:
// EP-522, EP-528, EP-529, EP-530, EP-531,
// EP-545, EP-552, EP-560, EP-567, EP-571.

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

function choose(arr, k) {
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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-522: count roots in |z|<=1 via argument principle on unit circle.
{
  const rng = makeRng(20260303 ^ 1401);

  function windingInside(coeff, M = 2048) {
    let total = 0;
    let prevArg = null;
    let unstable = false;

    for (let i = 0; i <= M; i += 1) {
      const t = (2 * Math.PI * i) / M;
      const ct = Math.cos(t);
      const st = Math.sin(t);

      // Evaluate f(e^{it}) by Horner in complex arithmetic.
      let re = 0;
      let im = 0;
      for (let k = coeff.length - 1; k >= 0; k -= 1) {
        const nre = re * ct - im * st + coeff[k];
        const nim = re * st + im * ct;
        re = nre;
        im = nim;
      }

      const mag = Math.hypot(re, im);
      if (mag < 1e-8) {
        unstable = true;
      }

      const arg = Math.atan2(im, re);
      if (prevArg !== null) {
        let d = arg - prevArg;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        total += d;
      }
      prevArg = arg;
    }

    const w = Math.round(total / (2 * Math.PI));
    return { rootsInside: w, unstable };
  }

  const rows = [];
  for (const [n, trials] of [[80, 40], [160, 35], [320, 30]]) {
    let used = 0;
    let sum = 0;
    let sumSq = 0;
    let unstableCount = 0;

    for (let t = 0; t < trials; t += 1) {
      const coeff = Array.from({ length: n + 1 }, () => (rng() < 0.5 ? -1 : 1));
      const { rootsInside, unstable } = windingInside(coeff);
      if (unstable) unstableCount += 1;
      used += 1;
      sum += rootsInside;
      sumSq += rootsInside * rootsInside;
    }

    const mean = sum / used;
    const varr = Math.max(0, sumSq / used - mean * mean);

    rows.push({
      n,
      trials,
      unstable_trials: unstableCount,
      avg_roots_inside_disk: Number(mean.toPrecision(7)),
      std_roots_inside_disk: Number(Math.sqrt(varr).toPrecision(7)),
      ratio_avg_over_n_over_2: Number((mean / (n / 2)).toPrecision(7)),
    });
  }

  out.results.ep522 = {
    description: 'Argument-principle Monte Carlo proxy for R_n roots inside the unit disk.',
    rows,
  };
}

// EP-528 + EP-529: exact small-n self-avoiding walk counts and displacement.
{
  function enumerateSAW(d, nMax) {
    const dirs = [];
    for (let i = 0; i < d; i += 1) {
      const a = Array(d).fill(0);
      a[i] = 1;
      dirs.push(a);
      const b = Array(d).fill(0);
      b[i] = -1;
      dirs.push(b);
    }

    const cnt = Array(nMax + 1).fill(0);
    const distSum = Array(nMax + 1).fill(0);

    const coord = Array(d).fill(0);
    const visited = new Set(['0'.repeat(d)]);

    function key(v) {
      return v.join(',');
    }

    function dfs(step) {
      if (step > 0) {
        cnt[step] += 1;
        let r2 = 0;
        for (let i = 0; i < d; i += 1) r2 += coord[i] * coord[i];
        distSum[step] += Math.sqrt(r2);
      }
      if (step === nMax) return;

      for (const mv of dirs) {
        for (let i = 0; i < d; i += 1) coord[i] += mv[i];
        const k = key(coord);
        if (!visited.has(k)) {
          visited.add(k);
          dfs(step + 1);
          visited.delete(k);
        }
        for (let i = 0; i < d; i += 1) coord[i] -= mv[i];
      }
    }

    dfs(0);
    return { cnt, distSum };
  }

  const configs = [
    { d: 2, nMax: 10 },
    { d: 3, nMax: 8 },
    { d: 4, nMax: 7 },
  ];

  const connectiveRows = [];
  const displacementRows = [];

  for (const cfg of configs) {
    const { d, nMax } = cfg;
    const { cnt, distSum } = enumerateSAW(d, nMax);

    for (let n = 2; n <= nMax; n += 1) {
      const c = cnt[n];
      const prev = cnt[n - 1];
      const muRoot = c ** (1 / n);
      const muRatio = c / prev;
      connectiveRows.push({
        d,
        n,
        f_n_k: c,
        root_estimate: Number(muRoot.toPrecision(7)),
        ratio_estimate: Number(muRatio.toPrecision(7)),
      });

      const dn = distSum[n] / c;
      displacementRows.push({
        d,
        n,
        expected_distance: Number(dn.toPrecision(7)),
        over_sqrt_n: Number((dn / Math.sqrt(n)).toPrecision(7)),
        over_n_pow_0_75: Number((dn / (n ** 0.75)).toPrecision(7)),
      });
    }
  }

  out.results.ep528 = {
    description: 'Exact small-n connective-constant proxies from self-avoiding walk counts.',
    rows: connectiveRows,
  };

  out.results.ep529 = {
    description: 'Exact small-n displacement profile for self-avoiding walks.',
    rows: displacementRows,
  };
}

// EP-530: maximum Sidon subset size in finite sets.
{
  function maxSidonSubset(A) {
    const n = A.length;
    let best = 0;

    function dfs(i, chosen, sums) {
      if (i === n) {
        if (chosen.length > best) best = chosen.length;
        return;
      }
      if (chosen.length + (n - i) <= best) return;

      // skip
      dfs(i + 1, chosen, sums);

      // include if possible
      const x = A[i];
      const newSums = [];
      let ok = true;

      const s2 = 2 * x;
      if (sums.has(s2)) ok = false;
      else newSums.push(s2);

      if (ok) {
        for (const a of chosen) {
          const s = a + x;
          if (sums.has(s)) {
            ok = false;
            break;
          }
          newSums.push(s);
        }
      }

      if (ok) {
        for (const s of newSums) sums.add(s);
        chosen.push(x);
        dfs(i + 1, chosen, sums);
        chosen.pop();
        for (const s of newSums) sums.delete(s);
      }
    }

    dfs(0, [], new Set());
    return best;
  }

  const rng = makeRng(20260303 ^ 1403);

  function randSet(size, maxVal) {
    const S = new Set();
    while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
    return [...S].sort((a, b) => a - b);
  }

  const rows = [];
  for (const N of [16, 20, 24]) {
    const A = Array.from({ length: N }, (_, i) => i + 1);
    const m = maxSidonSubset(A);
    rows.push({
      family: 'interval',
      N,
      max_sidon_size: m,
      ratio_over_sqrtN: Number((m / Math.sqrt(N)).toPrecision(7)),
    });
  }

  for (const N of [16, 20, 24]) {
    let best = 0;
    let avg = 0;
    const trials = N === 24 ? 15 : 20;
    for (let t = 0; t < trials; t += 1) {
      const A = randSet(N, 8 * N);
      const m = maxSidonSubset(A);
      avg += m;
      if (m > best) best = m;
    }
    rows.push({
      family: 'random_realized_as_distinct_integers',
      N,
      trials,
      best_max_sidon_size: best,
      avg_max_sidon_size: Number((avg / trials).toPrecision(7)),
      best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(7)),
    });
  }

  out.results.ep530 = {
    description: 'Exact small-N Sidon-subset maxima for interval and random sets.',
    rows,
  };
}

// EP-531: Folkman-number finite profiles.
{
  function tuplesK2(N) {
    const t = [];
    for (let a = 1; a <= N; a += 1) {
      for (let b = a + 1; b <= N; b += 1) {
        const s = a + b;
        if (s <= N) t.push([a, b, s]);
      }
    }
    return t;
  }

  function tuplesK3(N) {
    const t = [];
    for (let a = 1; a <= N; a += 1) {
      for (let b = a + 1; b <= N; b += 1) {
        for (let c = b + 1; c <= N; c += 1) {
          const sums = [a, b, c, a + b, a + c, b + c, a + b + c];
          if (Math.max(...sums) <= N) t.push(sums);
        }
      }
    }
    return t;
  }

  function hasMono(tupleList, col) {
    for (const tp of tupleList) {
      const c = col[tp[0]];
      let ok = true;
      for (let i = 1; i < tp.length; i += 1) {
        if (col[tp[i]] !== c) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }

  // Exact F(2) via full search.
  function avoidableK2(N) {
    const tuples = tuplesK2(N);
    const col = new Int8Array(N + 1);
    col.fill(-1);

    function dfs(x) {
      if (x > N) return true;
      for (let c = 0; c <= 1; c += 1) {
        col[x] = c;
        if (!hasMono(tuples.filter((tp) => tp.includes(x)), col)) {
          if (dfs(x + 1)) return true;
        }
      }
      col[x] = -1;
      return false;
    }

    return dfs(1);
  }

  let maxAvoid2 = 0;
  for (let N = 1; N <= 10; N += 1) {
    if (avoidableK2(N)) maxAvoid2 = N;
    else break;
  }

  // Heuristic lower bounds for k=3 by randomized greedy colorings.
  const rng = makeRng(20260303 ^ 1404);

  function greedyAvoidK3(N) {
    const tuples = tuplesK3(N);
    const touched = Array.from({ length: N + 1 }, () => []);
    for (let i = 0; i < tuples.length; i += 1) {
      for (const x of tuples[i]) touched[x].push(i);
    }

    const col = new Int8Array(N + 1);
    col.fill(-1);

    function monoTuple(i) {
      const tp = tuples[i];
      const c0 = col[tp[0]];
      if (c0 < 0) return false;
      for (let j = 1; j < tp.length; j += 1) if (col[tp[j]] !== c0) return false;
      return true;
    }

    for (let x = 1; x <= N; x += 1) {
      const options = [];
      for (let c = 0; c <= 1; c += 1) {
        col[x] = c;
        let bad = false;
        for (const ti of touched[x]) {
          if (monoTuple(ti)) {
            bad = true;
            break;
          }
        }
        if (!bad) options.push(c);
      }
      if (!options.length) return x - 1;
      col[x] = options[Math.floor(rng() * options.length)];
    }
    return N;
  }

  const rows = [];
  for (const [N, trials] of [[20, 80], [30, 80], [40, 70]]) {
    let best = 0;
    let avg = 0;
    for (let t = 0; t < trials; t += 1) {
      const len = greedyAvoidK3(N);
      avg += len;
      if (len > best) best = len;
    }
    rows.push({
      N,
      trials,
      best_avoidable_prefix_length_for_k3: best,
      avg_avoidable_prefix_length_for_k3: Number((avg / trials).toPrecision(7)),
    });
  }

  out.results.ep531 = {
    description: 'Exact small-k and randomized lower-bound profiles for Folkman-type finite-sums monochromatic sets.',
    exact: {
      F_2_exact: maxAvoid2 + 1,
      max_2color_avoidable_prefix_for_k2: maxAvoid2,
    },
    heuristic_k3_rows: rows,
  };
}

// EP-545: small-m exact counterexample check for "as complete as possible" maximizer.
{
  function edgeListComplete(N) {
    const e = [];
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) e.push([i, j]);
    }
    return e;
  }

  function graphBitHelpers(N) {
    const edges = edgeListComplete(N);
    const idx = Array.from({ length: N }, () => Array(N).fill(-1));
    edges.forEach(([u, v], i) => {
      idx[u][v] = i;
      idx[v][u] = i;
    });
    return { edges, idx };
  }

  function embeddingEdgeMasks(G, N, idx) {
    const out = [];
    const used = Array(N).fill(false);
    const map = Array(G.v).fill(-1);

    function dfs(i) {
      if (i === G.v) {
        let m = 0n;
        for (const [a, b] of G.edges) {
          const e = idx[map[a]][map[b]];
          m |= 1n << BigInt(e);
        }
        out.push(m);
        return;
      }
      for (let x = 0; x < N; x += 1) {
        if (used[x]) continue;
        used[x] = true;
        map[i] = x;
        dfs(i + 1);
        used[x] = false;
      }
    }

    dfs(0);
    return out;
  }

  function hasMonoFromMasks(mask, edgeMasks) {
    for (const em of edgeMasks) {
      if ((mask & em) === em) return true; // all red
      if ((mask & em) === 0n) return true; // all blue
    }
    return false;
  }

  function ramseyDiagonalExact(G, capN = 6) {
    for (let N = G.v; N <= capN; N += 1) {
      const { edges, idx } = graphBitHelpers(N);
      const E = edges.length;
      const edgeMasks = embeddingEdgeMasks(G, N, idx);
      const total = 1n << BigInt(E);
      let foundAvoid = false;
      for (let m = 0n; m < total; m += 1n) {
        if (!hasMonoFromMasks(m, edgeMasks)) {
          foundAvoid = true;
          break;
        }
      }
      if (!foundAvoid) return N;
    }
    return null;
  }

  const P3 = { v: 3, edges: [[0, 1], [1, 2]] };
  const M2 = { v: 4, edges: [[0, 1], [2, 3]] };
  const K3 = { v: 3, edges: [[0, 1], [0, 2], [1, 2]] };

  const rows = [
    { graph: 'P3', m_edges: 2, R_diag_exact_cap6: ramseyDiagonalExact(P3, 6) },
    { graph: '2K2', m_edges: 2, R_diag_exact_cap6: ramseyDiagonalExact(M2, 6) },
    { graph: 'K3', m_edges: 3, R_diag_exact_cap6: ramseyDiagonalExact(K3, 6) },
  ];

  out.results.ep545 = {
    description: 'Exact tiny-m diagonal Ramsey checks showing small-edge counterexample behavior.',
    rows,
    explicit_m2_counterexample: 'R(2K2)=5 > R(P3)=3 where P3 is the as-complete-as-possible graph for m=2.',
  };
}

// EP-552: exact small-n R(C4, S_n) profile.
{
  function c4ExistsInColor(mask, N, red = true) {
    const idx = Array.from({ length: N }, () => Array(N).fill(-1));
    let e = 0;
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        idx[i][j] = e;
        idx[j][i] = e;
        e += 1;
      }
    }

    for (let u = 0; u < N; u += 1) {
      for (let v = u + 1; v < N; v += 1) {
        let common = 0;
        for (let w = 0; w < N; w += 1) {
          if (w === u || w === v) continue;
          const b1 = ((mask >> BigInt(idx[u][w])) & 1n) === 1n;
          const b2 = ((mask >> BigInt(idx[v][w])) & 1n) === 1n;
          const c1 = red ? b1 : !b1;
          const c2 = red ? b2 : !b2;
          if (c1 && c2) {
            common += 1;
            if (common >= 2) return true;
          }
        }
      }
    }
    return false;
  }

  function blueStarExists(mask, N, nLeaves) {
    const degBlue = Array(N).fill(0);
    let ei = 0;
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        const isRed = ((mask >> BigInt(ei)) & 1n) === 1n;
        if (!isRed) {
          degBlue[i] += 1;
          degBlue[j] += 1;
        }
        ei += 1;
      }
    }
    return degBlue.some((d) => d >= nLeaves);
  }

  function R_C4_Star_small(nLeaves, cap = 6) {
    for (let N = Math.max(4, nLeaves + 1); N <= cap; N += 1) {
      const E = (N * (N - 1)) / 2;
      const total = 1n << BigInt(E);
      let avoidFound = false;
      for (let mask = 0n; mask < total; mask += 1n) {
        const redC4 = c4ExistsInColor(mask, N, true);
        const blueStar = blueStarExists(mask, N, nLeaves);
        if (!redC4 && !blueStar) {
          avoidFound = true;
          break;
        }
      }
      if (!avoidFound) return N;
    }
    return null;
  }

  const rng = makeRng(20260303 ^ 1407);

  function randomMask(E) {
    let mask = 0n;
    for (let e = 0; e < E; e += 1) {
      if (rng() < 0.5) mask |= 1n << BigInt(e);
    }
    return mask;
  }

  function randomAvoidHits(nLeaves, N, trials) {
    const E = (N * (N - 1)) / 2;
    let hits = 0;
    for (let t = 0; t < trials; t += 1) {
      const mask = randomMask(E);
      const redC4 = c4ExistsInColor(mask, N, true);
      const blueStar = blueStarExists(mask, N, nLeaves);
      if (!redC4 && !blueStar) hits += 1;
    }
    return hits;
  }

  const exact_rows = [];
  const random_rows = [];
  for (const n of [2, 3, 4]) {
    const targetA = n + Math.ceil(Math.sqrt(n));
    const targetB = targetA + 1;
    const R = R_C4_Star_small(n, 6);
    exact_rows.push({
      n,
      R_C4_Sn_exact_if_at_most_6_else_null: R,
      n_plus_ceil_sqrt_n: targetA,
      n_plus_ceil_sqrt_n_plus_1: targetB,
    });

    for (const N of [Math.max(4, targetA - 1), targetA, targetB]) {
      random_rows.push({
        n,
        N,
        trials: 600,
        random_avoiding_hits: randomAvoidHits(n, N, 600),
      });
    }
  }

  out.results.ep552 = {
    description: 'Exact tiny-n computations and random avoidance probes for R(C4, S_n).',
    exact_rows,
    random_rows,
  };
}

// EP-560: random-color threshold proxy on complete bipartite hosts.
{
  const rng = makeRng(20260303 ^ 1408);

  function hasMonoKss(M, s, mat) {
    const left = Array.from({ length: M }, (_, i) => i);
    const right = Array.from({ length: M }, (_, i) => i);
    const Ls = choose(left, s);
    const Rs = choose(right, s);

    for (const L of Ls) {
      for (const R of Rs) {
        let allRed = true;
        let allBlue = true;
        for (const i of L) {
          for (const j of R) {
            const red = mat[i][j] === 1;
            if (!red) allRed = false;
            if (red) allBlue = false;
            if (!allRed && !allBlue) break;
          }
          if (!allRed && !allBlue) break;
        }
        if (allRed || allBlue) return true;
      }
    }
    return false;
  }

  const rows = [];
  for (const [s, Mvals, trials] of [
    [2, [3, 4, 5, 6], 300],
    [3, [5, 6, 7, 8], 250],
  ]) {
    for (const M of Mvals) {
      let hit = 0;
      for (let t = 0; t < trials; t += 1) {
        const mat = Array.from({ length: M }, () => Array(M).fill(0));
        for (let i = 0; i < M; i += 1) {
          for (let j = 0; j < M; j += 1) {
            mat[i][j] = rng() < 0.5 ? 0 : 1;
          }
        }
        if (hasMonoKss(M, s, mat)) hit += 1;
      }
      rows.push({
        s,
        M,
        host_edges: M * M,
        trials,
        monochromatic_Kss_probability: Number((hit / trials).toPrecision(6)),
      });
    }
  }

  out.results.ep560 = {
    description: 'Random-coloring threshold proxy for monochromatic K_{s,s} on K_{M,M}.',
    rows,
  };
}

// EP-567: finite heuristic for H5 Ramsey-size linearity using H = mK2.
{
  // H5 (K4 with one subdivided edge): 5 vertices, 7 edges.
  const H5 = {
    v: 5,
    edges: [[0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 4], [1, 4]],
  };

  function edgeIndex(N) {
    const idx = Array.from({ length: N }, () => Array(N).fill(-1));
    let e = 0;
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        idx[i][j] = e;
        idx[j][i] = e;
        e += 1;
      }
    }
    return idx;
  }

  function redContainsH5Sample(mask, N, idx, rng, samples = 800) {
    const verts = Array.from({ length: N }, (_, i) => i);

    for (let s = 0; s < samples; s += 1) {
      // Partial Fisher-Yates sample of 5 distinct vertices.
      for (let i = 0; i < 5; i += 1) {
        const j = i + Math.floor(rng() * (N - i));
        const tmp = verts[i];
        verts[i] = verts[j];
        verts[j] = tmp;
      }
      const map = verts;
      let ok = true;
      for (const [a, b] of H5.edges) {
        const bit = ((mask >> BigInt(idx[map[a]][map[b]])) & 1n) === 1n;
        if (!bit) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }

  function blueMatchingNumber(mask, N, idx) {
    const memo = new Map();

    function dfs(maskV) {
      if (memo.has(maskV)) return memo.get(maskV);
      if (maskV === 0) return 0;

      let v = 0;
      while (((maskV >> v) & 1) === 0) v += 1;
      let best = dfs(maskV & ~(1 << v)); // leave v unmatched

      for (let u = v + 1; u < N; u += 1) {
        if (((maskV >> u) & 1) === 0) continue;
        const isRed = ((mask >> BigInt(idx[v][u])) & 1n) === 1n;
        if (!isRed) {
          const cand = 1 + dfs(maskV & ~(1 << v) & ~(1 << u));
          if (cand > best) best = cand;
        }
      }
      memo.set(maskV, best);
      return best;
    }

    return dfs((1 << N) - 1);
  }

  const rng = makeRng(20260303 ^ 1409);
  const rows = [];

  for (const m of [2, 3, 4]) {
    let heuristicThreshold = null;

    for (const N of [8, 10, 12]) {
      const E = (N * (N - 1)) / 2;
      const idx = edgeIndex(N);

      let avoidFound = 0;
      const trials = 60;
      for (let t = 0; t < trials; t += 1) {
        let mask = 0n;
        for (let e = 0; e < E; e += 1) {
          if (rng() < 0.5) mask |= 1n << BigInt(e);
        }
        const redH5 = redContainsH5Sample(mask, N, idx, rng, 1000);
        if (redH5) continue;
        const blueMatch = blueMatchingNumber(mask, N, idx);
        if (blueMatch < m) avoidFound += 1;
      }

      rows.push({
        target_H_matching_size_m: m,
        N,
        trials,
        avoiding_coloring_hits: avoidFound,
      });

      if (heuristicThreshold === null && avoidFound === 0) heuristicThreshold = N;
    }

    rows.push({
      target_H_matching_size_m: m,
      heuristic_zero_avoid_threshold_N: heuristicThreshold,
      ratio_threshold_over_m: heuristicThreshold === null ? null : Number((heuristicThreshold / m).toPrecision(6)),
    });
  }

  out.results.ep567 = {
    description: 'Finite heuristic on R(H5, mK2) via random-coloring avoidance search.',
    rows,
  };
}

// EP-571: finite coverage map of known Turan-exponent families.
{
  const known = new Set();

  function addRat(num, den) {
    const g = gcd(num, den);
    known.add(`${num / g}/${den / g}`);
  }

  // Families from background, parameter-limited map.
  for (let s = 2; s <= 40; s += 1) {
    addRat(3 * s - 1, 2 * s); // 3/2 - 1/(2s)
    addRat(4 * s - 1, 3 * s); // 4/3 - 1/(3s)
    addRat(5 * s - 1, 4 * s); // 5/4 - 1/(4s)
  }
  for (let b = 2; b <= 60; b += 1) addRat(2 * b, 2 * b + 1); // 2 - 2/(2b+1)

  // 1 + a/b with b > a^2
  for (let a = 1; a <= 12; a += 1) {
    for (let b = a * a + 1; b <= 80; b += 1) addRat(a + b, b);
  }

  // 2 - a/b with b >= (a-1)^2
  for (let a = 1; a <= 20; a += 1) {
    for (let b = Math.max(a + 1, (a - 1) * (a - 1)); b <= 80; b += 1) addRat(2 * b - a, b);
  }

  // 2 - a/b with b ≡ ±1 mod a
  for (let a = 1; a <= 20; a += 1) {
    for (let b = a + 1; b <= 120; b += 1) {
      if (b % a === 1 || b % a === a - 1) addRat(2 * b - a, b);
    }
  }

  const all = [];
  const hit = [];
  const miss = [];

  for (let den = 2; den <= 60; den += 1) {
    for (let num = den; num < 2 * den; num += 1) {
      if (gcd(num, den) !== 1) continue;
      const key = `${num}/${den}`;
      all.push(key);
      if (known.has(key)) hit.push(key);
      else miss.push(key);
    }
  }

  out.results.ep571 = {
    description: 'Finite denominator-bounded coverage map of known Turan-exponent families in [1,2).',
    denominator_bound: 60,
    total_reduced_rationals_in_1_2: all.length,
    covered_count: hit.length,
    covered_ratio: Number((hit.length / all.length).toPrecision(7)),
    sample_uncovered_first_40: miss.slice(0, 40),
  };
}

const outPath = path.join('data', 'harder_batch14_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
