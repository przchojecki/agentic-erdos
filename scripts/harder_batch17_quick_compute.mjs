#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 17:
// EP-687, EP-690, EP-695, EP-701, EP-704,
// EP-705, EP-711, EP-713, EP-769, EP-774.

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

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function isPrimeNumber(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

function smallestPrimeCongruentOneMod(p, searchCapMultiplier = 200) {
  // Trial-division search; enough for small finite probes.
  const cap = searchCapMultiplier * p;
  let q = p + 1;
  if (q % 2 === 0) q += 1;
  while (q <= cap) {
    if (q % p === 1 && isPrimeNumber(q)) return q;
    q += 2;
  }
  return null;
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

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-687: random covering-system heuristic for Y(x).
{
  const rng = makeRng(20260304 ^ 1701);

  function longestCoveredPrefix(primes, residues, yMax) {
    const covered = new Uint8Array(yMax + 1);
    for (let i = 0; i < primes.length; i += 1) {
      const p = primes[i];
      const a = residues[i];
      let t = a;
      if (t <= 0) t += Math.ceil((1 - t) / p) * p;
      for (let v = t; v <= yMax; v += p) {
        if (v >= 1) covered[v] = 1;
      }
    }

    let y = 0;
    for (let v = 1; v <= yMax; v += 1) {
      if (!covered[v]) break;
      y = v;
    }
    return y;
  }

  function hillclimb(x, restarts, steps) {
    const primes = sieve(x).primes;
    const yMax = 6 * x * x;
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const residues = primes.map((p) => Math.floor(rng() * p));
      let cur = longestCoveredPrefix(primes, residues, yMax);

      for (let it = 0; it < steps; it += 1) {
        const i = Math.floor(rng() * primes.length);
        const old = residues[i];
        residues[i] = Math.floor(rng() * primes[i]);
        const nxt = longestCoveredPrefix(primes, residues, yMax);
        if (nxt >= cur) cur = nxt;
        else residues[i] = old;
      }

      if (cur > best) best = cur;
    }

    return { best, yMax, numPrimes: primes.length };
  }

  const rows = [];
  for (const x of [20, 30, 40, 60, 80, 100]) {
    const { best, yMax, numPrimes } = hillclimb(x, 20, 250);
    rows.push({
      x,
      primes_up_to_x: numPrimes,
      y_max_search_cap: yMax,
      best_prefix_length_found: best,
      best_over_x: Number((best / x).toPrecision(7)),
      best_over_x2: Number((best / (x * x)).toPrecision(7)),
    });
  }

  out.results.ep687 = {
    description: 'Heuristic coverage optimization for Jacobsthal-style Y(x) lower profiles.',
    rows,
  };
}

// EP-690: exact density profile d_k(p_i) via prime-divisibility recursion.
{
  const P = sieve(500).primes; // first ~95 primes.

  function densityProfile(k, numPrimes) {
    const delta = Array(k + 1).fill(0);
    delta[0] = 1;
    const vals = [];

    for (let i = 0; i < numPrimes; i += 1) {
      const p = P[i];
      const dkp = delta[k - 1] / p;
      vals.push({ prime: p, density: dkp });

      const next = Array(k + 1).fill(0);
      for (let r = 0; r <= k; r += 1) {
        next[r] += delta[r] * (1 - 1 / p);
        if (r >= 1) next[r] += delta[r - 1] * (1 / p);
      }
      for (let r = 0; r <= k; r += 1) delta[r] = next[r];
    }

    return vals;
  }

  const rows = [];
  for (const k of [1, 2, 3, 4, 5, 6, 8, 10]) {
    const vals = densityProfile(k, 70);
    let peaks = 0;
    for (let i = 1; i + 1 < vals.length; i += 1) {
      if (vals[i].density > vals[i - 1].density && vals[i].density > vals[i + 1].density) peaks += 1;
    }
    let best = vals[0];
    for (const v of vals) if (v.density > best.density) best = v;

    rows.push({
      k,
      sampled_primes: vals.length,
      argmax_prime_sampled: best.prime,
      max_density_sampled: Number(best.density.toPrecision(8)),
      strict_local_maxima_count_sampled: peaks,
      appears_unimodal_on_sample: peaks <= 1,
    });
  }

  out.results.ep690 = {
    description: 'Exact sampled d_k(p) profiles from prime-divisibility density recursion.',
    rows,
  };
}

// EP-695: greedy prime-chain growth profile.
{
  const rows = [];
  let p = 2;
  const chain = [p];

  for (let k = 1; k <= 10; k += 1) {
    if (k > 1) {
      const nxt = smallestPrimeCongruentOneMod(p, 250);
      if (nxt === null) break;
      p = nxt;
      chain.push(p);
    }

    const logp = Math.log(p);
    const kval = chain.length;
    const klogk = kval >= 2 ? kval * Math.log(kval) : 1;

    rows.push({
      k: kval,
      p_k: p,
      p_k_pow_1_over_k: Number((p ** (1 / kval)).toPrecision(7)),
      log_p_k_over_k_log_k: Number((logp / klogk).toPrecision(7)),
    });
  }

  out.results.ep695 = {
    description: 'Greedy prime-chain finite growth profile for p_{k+1}≡1 (mod p_k).',
    rows,
  };
}

// EP-701: random finite downset checks against the star-max intersecting property.
{
  const rng = makeRng(20260304 ^ 1704);

  function randomDownset(n, maxSets = 24) {
    const universe = 1 << n;

    for (let attempt = 0; attempt < 200; attempt += 1) {
      const tops = [];
      const topCount = 1 + Math.floor(rng() * (n + 2));

      for (let t = 0; t < topCount; t += 1) {
        // Prefer small-support maxima so closure stays tractable.
        let m = 0;
        for (let b = 0; b < n; b += 1) {
          if (rng() < 0.35) m |= 1 << b;
        }
        if (m >= universe) m = universe - 1;
        tops.push(m);
      }

      const F = new Set([0]);
      for (const m of tops) {
        let s = m;
        while (true) {
          F.add(s);
          if (s === 0) break;
          s = (s - 1) & m;
        }
      }

      if (F.size <= maxSets) return [...F];
    }

    // Guaranteed downset fallback.
    return [0];
  }

  function maxIntersectingExact(family) {
    const fam = family.filter((s) => s !== 0); // standard intersecting-family convention excludes the empty set
    const m = fam.length;
    let best = 0;

    function dfs(i, chosen) {
      if (chosen + (m - i) <= best) return;
      if (i === m) {
        if (chosen > best) best = chosen;
        return;
      }

      // skip
      dfs(i + 1, chosen);

      // take if intersecting with all currently selected
      const x = fam[i];
      let ok = true;
      for (let j = 0; j < i; j += 1) {
        if (!((maskChosen >> BigInt(j)) & 1n)) continue;
        if ((x & fam[j]) === 0) {
          ok = false;
          break;
        }
      }
      if (ok) {
        maskChosen |= 1n << BigInt(i);
        dfs(i + 1, chosen + 1);
        maskChosen &= ~(1n << BigInt(i));
      }
    }

    let maskChosen = 0n;
    dfs(0, 0);
    return best;
  }

  function bestStar(family, n) {
    let best = 0;
    for (let x = 0; x < n; x += 1) {
      const b = 1 << x;
      let c = 0;
      for (const s of family) if (s & b) c += 1;
      if (c > best) best = c;
    }
    return best;
  }

  const rows = [];
  for (const [n, samples] of [[5, 60], [6, 60], [7, 50]]) {
    let violations = 0;
    let avgGap = 0;

    for (let t = 0; t < samples; t += 1) {
      const F = randomDownset(n, 24);
      const mInt = maxIntersectingExact(F);
      const star = bestStar(F, n);
      const gap = star - mInt;
      avgGap += gap;
      if (gap < 0) violations += 1;
    }

    rows.push({
      n,
      samples,
      max_family_size_sampled: 24,
      violations_of_star_bound: violations,
      avg_star_minus_max_intersecting: Number((avgGap / samples).toPrecision(7)),
    });
  }

  out.results.ep701 = {
    description: 'Finite random-downset checks for Chvatal-type star dominance.',
    rows,
  };
}

// EP-704: quantitative window table for known exponential bounds.
{
  const rows = [];
  for (const n of [5, 10, 20, 30, 40, 60]) {
    const lower = 1.2 ** n;
    const upper = 3 ** n;
    rows.push({
      n,
      lower_1p2_pow_n: Number(lower.toPrecision(7)),
      upper_3_pow_n: Number(upper.toPrecision(7)),
      multiplicative_window_upper_over_lower: Number((upper / lower).toPrecision(7)),
      geometric_mean_base: Number(((lower * upper) ** (1 / (2 * n))).toPrecision(7)),
    });
  }

  out.results.ep704 = {
    description: 'Finite scaling window from the classical exponential lower/upper bounds for χ(G_n).',
    rows,
  };
}

// EP-705: verify a concrete 4-chromatic unit-distance graph (Moser spindle).
{
  // Sage edge dictionary for Moser spindle (a known unit-distance graph):
  // {0:[1,4,6],1:[2,5],2:[3,5],3:[4,5,6],4:[6],5:[],6:[]}
  const n = 7;
  const G = makeGraph(n);
  const edgeList = [
    [0, 1], [0, 4], [0, 6],
    [1, 2], [1, 5],
    [2, 3], [2, 5],
    [3, 4], [3, 5], [3, 6],
    [4, 6],
  ];
  for (const [u, v] of edgeList) addEdge(G, u, v);

  function canColor(k) {
    const col = Array(n).fill(-1);
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => G.neigh[b].length - G.neigh[a].length);

    function dfs(idx) {
      if (idx === n) return true;
      const v = order[idx];
      const used = new Set();
      for (const u of G.neigh[v]) if (col[u] >= 0) used.add(col[u]);
      for (let c = 0; c < k; c += 1) {
        if (used.has(c)) continue;
        col[v] = c;
        if (dfs(idx + 1)) return true;
        col[v] = -1;
      }
      return false;
    }

    return dfs(0);
  }

  let chi = n;
  for (let k = 1; k <= n; k += 1) {
    if (canColor(k)) {
      chi = k;
      break;
    }
  }

  // Girth by BFS from each edge.
  let girth = Infinity;
  for (let s = 0; s < n; s += 1) {
    const dist = Array(n).fill(-1);
    const par = Array(n).fill(-1);
    const q = [s];
    dist[s] = 0;
    let qi = 0;
    while (qi < q.length) {
      const u = q[qi++];
      for (const v of G.neigh[u]) {
        if (dist[v] < 0) {
          dist[v] = dist[u] + 1;
          par[v] = u;
          q.push(v);
        } else if (par[u] !== v) {
          girth = Math.min(girth, dist[u] + dist[v] + 1);
        }
      }
    }
  }

  out.results.ep705 = {
    description: 'Exact witness check on the standard Moser spindle unit-distance graph.',
    witness_vertices: n,
    witness_edges: G.m,
    chromatic_number_exact: chi,
    girth: Number.isFinite(girth) ? girth : null,
    note: 'Global EP-705 statement is disproved in literature (arbitrarily large girth with χ>=4).',
  };
}

// EP-711: finite matching computation for f(n,m).
{
  function hopcroftKarp(adj) {
    const nL = adj.length;
    const nR = Math.max(...adj.flat(), -1) + 1;
    const pairU = Array(nL).fill(-1);
    const pairV = Array(nR).fill(-1);
    const dist = Array(nL).fill(0);

    function bfs() {
      const q = [];
      for (let u = 0; u < nL; u += 1) {
        if (pairU[u] === -1) {
          dist[u] = 0;
          q.push(u);
        } else {
          dist[u] = -1;
        }
      }

      let found = false;
      for (let qi = 0; qi < q.length; qi += 1) {
        const u = q[qi];
        for (const v of adj[u]) {
          const u2 = pairV[v];
          if (u2 >= 0 && dist[u2] < 0) {
            dist[u2] = dist[u] + 1;
            q.push(u2);
          }
          if (u2 === -1) found = true;
        }
      }
      return found;
    }

    function dfs(u) {
      for (const v of adj[u]) {
        const u2 = pairV[v];
        if (u2 === -1 || (dist[u2] === dist[u] + 1 && dfs(u2))) {
          pairU[u] = v;
          pairV[v] = u;
          return true;
        }
      }
      dist[u] = -1;
      return false;
    }

    let matching = 0;
    while (bfs()) {
      for (let u = 0; u < nL; u += 1) {
        if (pairU[u] === -1 && dfs(u)) matching += 1;
      }
    }

    return matching;
  }

  function hasFeasible(n, m, L) {
    const left = n;
    const rightSize = L;
    const adj = Array.from({ length: left }, () => []);

    for (let k = 1; k <= n; k += 1) {
      for (let t = m + 1; t <= m + L; t += 1) {
        if (t % k === 0) adj[k - 1].push(t - (m + 1));
      }
      if (!adj[k - 1].length) return false;
    }

    const mat = hopcroftKarp(adj);
    return mat === n;
  }

  function fnm(n, m) {
    let lo = n;
    let hi = 4 * n;
    while (!hasFeasible(n, m, hi)) hi *= 2;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (hasFeasible(n, m, mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  const rows = [];
  for (const n of [20, 30, 40]) {
    const base = fnm(n, n);
    let best = base;
    let bestM = n;
    for (let m = n; m <= n + 350; m += 1) {
      const v = fnm(n, m);
      if (v > best) {
        best = v;
        bestM = m;
      }
    }

    rows.push({
      n,
      f_n_n: base,
      max_f_n_m_sampled_m_in_n_to_n_plus_350: best,
      argmax_m_sampled: bestM,
      sampled_gap_max_minus_f_n_n: best - base,
      max_over_n: Number((best / n).toPrecision(7)),
    });
  }

  out.results.ep711 = {
    description: 'Exact finite matching computation for f(n,m) over sampled m-ranges.',
    rows,
  };
}

// EP-713: finite exponent proxies from C4-free greedy constructions.
{
  const rng = makeRng(20260304 ^ 1708);

  function greedyC4FreeEdges(n, restarts) {
    const all = [];
    for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) all.push([u, v]);
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const G = makeGraph(n);
      shuffle(all, rng);

      for (const [u, v] of all) {
        let common = 0;
        for (const x of G.neigh[u]) {
          if (G.adj[v][x]) {
            common += 1;
            if (common >= 1) break;
          }
        }
        if (common === 0) addEdge(G, u, v);
      }

      if (G.m > best) best = G.m;
    }

    return best;
  }

  const rows = [];
  const ns = [30, 40, 50, 60, 80, 100];
  const vals = [];

  for (const n of ns) {
    const e = greedyC4FreeEdges(n, 14);
    vals.push([n, e]);
    rows.push({
      n,
      best_greedy_C4_free_edges: e,
      edges_over_n_pow_1p5: Number((e / (n ** 1.5)).toPrecision(7)),
    });
  }

  const slopes = [];
  for (let i = 1; i < vals.length; i += 1) {
    const [n1, e1] = vals[i - 1];
    const [n2, e2] = vals[i];
    slopes.push(Number((Math.log(e2 / e1) / Math.log(n2 / n1)).toPrecision(7)));
  }

  out.results.ep713 = {
    description: 'Finite exponent proxy using greedy C4-free extremal edge growth.',
    rows,
    local_loglog_slopes: slopes,
    note: 'Serves as one rational-exponent benchmark (near 3/2) within the broader EP-713 landscape.',
  };
}

// EP-769: numeric bound landscape for c(n).
{
  const rows = [];
  for (let n = 2; n <= 14; n += 1) {
    const lowerClassic = 2 ** n + 2 ** (n - 1);
    const lower2018 = n >= 3 ? 2 ** (n + 1) - 1 : null;
    const upperGeneral = n >= 3 ? (2 * n) ** (n - 1) : null;
    const upperPrimeCase = 1.8 * (n ** (n + 1));
    const upperOther = Math.E ** 2 * (n ** n);

    rows.push({
      n,
      lower_hadwiger: lowerClassic,
      lower_2018_if_n_ge_3: lower2018,
      upper_general_2n_pow_n_minus_1: upperGeneral === null ? null : Number(upperGeneral.toPrecision(7)),
      upper_if_n_plus_1_prime: Number(upperPrimeCase.toPrecision(7)),
      upper_otherwise: Number(upperOther.toPrecision(7)),
      lower_over_n_pow_n: Number((lowerClassic / (n ** n)).toPrecision(7)),
    });
  }

  out.results.ep769 = {
    description: 'Finite numeric comparison of known lower/upper bounds for c(n).',
    rows,
  };
}

// EP-774: finite surrogates for dissociated dimension and partition count.
{
  const rng = makeRng(20260304 ^ 1710);

  function subsetSums(arr) {
    const sums = [0];
    for (const x of arr) {
      const len = sums.length;
      for (let i = 0; i < len; i += 1) sums.push(sums[i] + x);
    }
    return sums;
  }

  function isDissociated(arr) {
    const sums = subsetSums(arr);
    sums.sort((a, b) => a - b);
    for (let i = 1; i < sums.length; i += 1) if (sums[i] === sums[i - 1]) return false;
    return true;
  }

  function maxDissociatedSize(A) {
    const n = A.length;
    let best = 0;
    for (let mask = 1; mask < (1 << n); mask += 1) {
      const bits = mask.toString(2).split('0').join('').length;
      if (bits <= best) continue;
      const S = [];
      for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) S.push(A[i]);
      if (isDissociated(S)) best = bits;
    }
    return best;
  }

  function canPartitionIntoTDissociated(A, t) {
    const n = A.length;
    const bins = Array.from({ length: t }, () => []);
    const order = [...A].sort((a, b) => b - a);

    function dfs(i) {
      if (i === n) return true;
      const x = order[i];
      for (let b = 0; b < t; b += 1) {
        bins[b].push(x);
        if (isDissociated(bins[b]) && dfs(i + 1)) return true;
        bins[b].pop();
      }
      return false;
    }

    return dfs(0);
  }

  function randomSet(m, maxV) {
    const S = new Set();
    while (S.size < m) S.add(1 + Math.floor(rng() * maxV));
    return [...S].sort((a, b) => a - b);
  }

  const rows = [];
  for (const [m, trials] of [[12, 8], [14, 7], [16, 6]]) {
    let bestRatio = 0;
    let worstT = 1;

    for (let t = 0; t < trials; t += 1) {
      const A = randomSet(m, 300);
      const d = maxDissociatedSize(A);
      const ratio = d / m;
      if (ratio > bestRatio) bestRatio = ratio;

      let tNeed = m;
      for (let k = 1; k <= 5; k += 1) {
        if (canPartitionIntoTDissociated(A, k)) {
          tNeed = k;
          break;
        }
      }
      if (tNeed > worstT) worstT = tNeed;
    }

    rows.push({
      m,
      trials,
      best_dissociated_dimension_ratio_found: Number(bestRatio.toPrecision(7)),
      worst_min_partition_count_into_dissociated_classes_found: worstT,
    });
  }

  out.results.ep774 = {
    description: 'Finite surrogate profile for dissociated dimension and minimal partition into dissociated classes.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch17_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
