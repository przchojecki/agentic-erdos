#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 10:
// EP-322, EP-325, EP-329, EP-336, EP-338, EP-342, EP-351, EP-352, EP-354, EP-358.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
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

function lcmBig(a, b) {
  if (a === 0n || b === 0n) return 0n;
  return (a / gcdBig(a, b)) * b;
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

function isPrimeInt(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

const rng = makeRng(20260303 ^ 1009);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Helpers: representations as sums of 3 or 4 powers.
function repCounts3Powers(k, N) {
  const vals = [];
  for (let a = 0; ; a += 1) {
    const p = a ** k;
    if (p > N) break;
    vals.push(p);
  }
  const cnt = new Uint32Array(N + 1);
  for (let i = 0; i < vals.length; i += 1) {
    const x = vals[i];
    for (let j = i; j < vals.length; j += 1) {
      const y = vals[j];
      if (x + y > N) break;
      for (let t = j; t < vals.length; t += 1) {
        const z = vals[t];
        const s = x + y + z;
        if (s > N) break;
        cnt[s] += 1;
      }
    }
  }
  return { cnt, vals };
}

function repCounts4Powers(k, N) {
  const vals = [];
  for (let a = 0; ; a += 1) {
    const p = a ** k;
    if (p > N) break;
    vals.push(p);
  }
  const cnt = new Uint32Array(N + 1);
  for (let i = 0; i < vals.length; i += 1) {
    const a = vals[i];
    for (let j = i; j < vals.length; j += 1) {
      const b = vals[j];
      if (a + b > N) break;
      for (let u = j; u < vals.length; u += 1) {
        const c = vals[u];
        if (a + b + c > N) break;
        for (let v = u; v < vals.length; v += 1) {
          const d = vals[v];
          const s = a + b + c + d;
          if (s > N) break;
          cnt[s] += 1;
        }
      }
    }
  }
  return { cnt, vals };
}

// EP-322: finite max multiplicity profile of representations by k k-th powers.
{
  const rows = [];

  {
    const N = 200000;
    const { cnt, vals } = repCounts3Powers(3, N);
    let maxRep = 0;
    let argMax = 0;
    let witness = 0;
    for (let n = 1; n <= N; n += 1) {
      if (cnt[n] > maxRep) {
        maxRep = cnt[n];
        argMax = n;
      }
      if (cnt[n] > n ** 0.1) witness += 1;
    }
    rows.push({
      k: 3,
      N,
      basis_values_count: vals.length,
      max_representation_count: maxRep,
      argmax_n: argMax,
      max_over_N_pow_0_1: Number((maxRep / (N ** 0.1)).toPrecision(6)),
      count_n_with_r_n_gt_n_pow_0_1: witness,
    });
  }

  {
    const N = 350000;
    const { cnt, vals } = repCounts4Powers(4, N);
    let maxRep = 0;
    let argMax = 0;
    let witness = 0;
    for (let n = 1; n <= N; n += 1) {
      if (cnt[n] > maxRep) {
        maxRep = cnt[n];
        argMax = n;
      }
      if (cnt[n] > n ** 0.05) witness += 1;
    }
    rows.push({
      k: 4,
      N,
      basis_values_count: vals.length,
      max_representation_count: maxRep,
      argmax_n: argMax,
      max_over_N_pow_0_05: Number((maxRep / (N ** 0.05)).toPrecision(6)),
      count_n_with_r_n_gt_n_pow_0_05: witness,
    });
  }

  out.results.ep322 = {
    description: 'Finite representation-multiplicity profile for sums of k many k-th powers (small k).',
    rows,
  };
}

// EP-325: finite profile of f_{k,3}(x), count of <=x representable as sum of three k-th powers.
{
  function fProfile(k, Xmax, milestones) {
    const { cnt } = repCounts3Powers(k, Xmax);
    const rows = [];
    for (const X of milestones) {
      let f = 0;
      for (let n = 0; n <= X; n += 1) if (cnt[n] > 0) f += 1;
      rows.push({
        k,
        X,
        f_k3_X: f,
        ratio_over_X_pow_3_over_k: Number((f / (X ** (3 / k))).toPrecision(6)),
        density: Number((f / X).toPrecision(6)),
      });
    }
    return rows;
  }

  out.results.ep325 = {
    description: 'Finite coverage profile f_{k,3}(X) for sums of three nonnegative k-th powers.',
    rows: [
      ...fProfile(3, 200000, [20000, 50000, 100000, 200000]),
      ...fProfile(4, 300000, [30000, 80000, 150000, 300000]),
      ...fProfile(5, 400000, [40000, 100000, 200000, 400000]),
    ],
  };
}

// EP-329: Sidon finite-density proxy via greedy construction.
{
  function greedySidonUpTo(N) {
    const A = [];
    const sums = new Set();
    for (let x = 1; x <= N; x += 1) {
      let ok = true;
      for (const a of A) {
        const s = a + x;
        if (sums.has(s)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (const a of A) sums.add(a + x);
      sums.add(2 * x);
      A.push(x);
    }
    return A;
  }

  const rows = [];
  for (const N of [5000, 10000, 20000, 50000, 100000, 200000]) {
    const A = greedySidonUpTo(N);
    rows.push({
      N,
      size: A.length,
      ratio_over_sqrtN: Number((A.length / Math.sqrt(N)).toPrecision(6)),
      first_20_terms: A.slice(0, 20),
    });
  }

  out.results.ep329 = {
    description: 'Finite limsup proxy |A∩[1,N]|/sqrt(N) using greedy Sidon construction.',
    rows,
  };
}

// EP-336: finite proxy of order vs exact-order behavior for basis-like sets.
{
  function buildHalfBlockSet(limit) {
    const A = [];
    for (let x = 1; x <= limit; x += 1) {
      let ok = false;
      for (let k = 0; ; k += 1) {
        const lo = 2 ** (2 * k);
        const hi = 2 ** (2 * k + 1);
        if (lo > limit) break;
        if (x > lo && x <= hi) {
          ok = true;
          break;
        }
      }
      if (ok) A.push(x);
    }
    return A;
  }

  function exactSumDP(A, Nmax, kMax) {
    const can = Array.from({ length: kMax + 1 }, () => new Uint8Array(Nmax + 1));
    can[0][0] = 1;
    for (let k = 1; k <= kMax; k += 1) {
      const prev = can[k - 1];
      const cur = can[k];
      for (let n = 0; n <= Nmax; n += 1) {
        if (!prev[n]) continue;
        for (const a of A) {
          const t = n + a;
          if (t > Nmax) break;
          cur[t] = 1;
        }
      }
    }
    return can;
  }

  function basisProxy(A, cfg) {
    const { N0, Nmax, kMax } = cfg;
    const can = exactSumDP(A, Nmax, kMax);

    let orderProxy = null;
    for (let r = 1; r <= kMax; r += 1) {
      let ok = true;
      for (let n = N0; n <= Nmax; n += 1) {
        let hit = false;
        for (let t = 1; t <= r; t += 1) {
          if (can[t][n]) {
            hit = true;
            break;
          }
        }
        if (!hit) {
          ok = false;
          break;
        }
      }
      if (ok) {
        orderProxy = r;
        break;
      }
    }

    let exactProxy = null;
    for (let r = 1; r <= kMax; r += 1) {
      let ok = true;
      for (let n = N0; n <= Nmax; n += 1) {
        if (!can[r][n]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        exactProxy = r;
        break;
      }
    }

    return { orderProxy, exactProxy };
  }

  const A = buildHalfBlockSet(2000);
  const prox = basisProxy(A, { N0: 500, Nmax: 3000, kMax: 8 });

  out.results.ep336 = {
    description: 'Finite order/exact-order proxy for a classical half-block basis-type construction.',
    set_size_up_to_2000: A.length,
    sample_terms: A.slice(0, 40),
    order_proxy_window_500_3000: prox.orderProxy,
    exact_order_proxy_window_500_3000: prox.exactProxy,
  };
}

// EP-338: restricted-order proxy with distinct summands for Bateman-type examples.
{
  function setBateman(h, limit) {
    const A = [1];
    for (let x = h; x <= limit; x += h) A.push(x);
    return A;
  }

  function distinctSubsetCoverage(A, Nmax) {
    const can = new Uint8Array(Nmax + 1);
    can[0] = 1;
    for (const a of A) {
      for (let s = Nmax - a; s >= 0; s -= 1) {
        if (can[s]) can[s + a] = 1;
      }
    }
    let covered = 0;
    for (let n = 1; n <= Nmax; n += 1) if (can[n]) covered += 1;
    return { can, covered };
  }

  function unrestrictedCoverage(A, Nmax, tMax) {
    const can = Array.from({ length: tMax + 1 }, () => new Uint8Array(Nmax + 1));
    can[0][0] = 1;
    for (let t = 1; t <= tMax; t += 1) {
      const cur = can[t];
      const prev = can[t - 1];
      for (let s = 0; s <= Nmax; s += 1) {
        if (!prev[s]) continue;
        for (const a of A) {
          const u = s + a;
          if (u > Nmax) break;
          cur[u] = 1;
        }
      }
    }
    return can;
  }

  const rows = [];
  for (const h of [3, 4, 5]) {
    const A = setBateman(h, 600);
    const Nmax = 1200;
    const { can: distCan, covered } = distinctSubsetCoverage(A, Nmax);
    let missingResidue = null;
    for (let r = 0; r < h; r += 1) {
      let allMissing = true;
      for (let n = r; n <= Nmax; n += h) {
        if (n > 0 && distCan[n]) {
          allMissing = false;
          break;
        }
      }
      if (allMissing) {
        missingResidue = r;
        break;
      }
    }

    const un = unrestrictedCoverage(A, Nmax, h + 2);
    let unrestrictedOrderProxy = null;
    for (let t = 1; t <= h + 2; t += 1) {
      let ok = true;
      for (let n = 400; n <= Nmax; n += 1) {
        let hit = false;
        for (let j = 1; j <= t; j += 1) {
          if (un[j][n]) {
            hit = true;
            break;
          }
        }
        if (!hit) {
          ok = false;
          break;
        }
      }
      if (ok) {
        unrestrictedOrderProxy = t;
        break;
      }
    }

    rows.push({
      h,
      A_size_up_to_600: A.length,
      distinct_coverage_density_up_to_1200: Number((covered / Nmax).toPrecision(6)),
      residue_class_fully_missing_distinct: missingResidue,
      unrestricted_order_proxy_window_400_1200: unrestrictedOrderProxy,
    });
  }

  out.results.ep338 = {
    description: 'Finite distinct-vs-unrestricted summand behavior for Bateman-style bases.',
    rows,
  };
}

// EP-342: Ulam sequence (1,2) finite structural diagnostics.
{
  function ulam12(terms) {
    const a = [1, 2];
    while (a.length < terms) {
      const n = a[a.length - 1];
      let x = n + 1;
      while (true) {
        let cnt = 0;
        let i = 0;
        let j = a.length - 1;
        while (i < j) {
          const s = a[i] + a[j];
          if (s < x) i += 1;
          else if (s > x) j -= 1;
          else {
            cnt += 1;
            if (cnt > 1) break;
            i += 1;
            j -= 1;
          }
        }
        if (cnt === 1) {
          a.push(x);
          break;
        }
        x += 1;
      }
    }
    return a;
  }

  const A = ulam12(3500);
  const rows = [];
  for (const X of [1000, 2000, 5000, 10000, 20000, 40000]) {
    let c = 0;
    for (const v of A) if (v <= X) c += 1;
    rows.push({
      X,
      count_terms_le_X: c,
      density: Number((c / X).toPrecision(6)),
    });
  }

  let twinPairs = 0;
  const setA = new Set(A);
  for (const x of A) if (setA.has(x + 2)) twinPairs += 1;

  const diffs = [];
  for (let i = 1; i < A.length; i += 1) diffs.push(A[i] - A[i - 1]);
  const tail = diffs.slice(-1200);
  const periodRows = [];
  for (const p of [2, 4, 6, 8, 10, 12, 16, 20]) {
    let eq = 0;
    let tot = 0;
    for (let i = p; i < tail.length; i += 1) {
      if (tail[i] === tail[i - p]) eq += 1;
      tot += 1;
    }
    periodRows.push({
      period: p,
      tail_match_ratio: Number((eq / Math.max(1, tot)).toPrecision(6)),
    });
  }

  out.results.ep342 = {
    description: 'Finite density and gap-structure diagnostics for the Ulam (1,2) sequence.',
    terms_generated: A.length,
    last_term: A[A.length - 1],
    twin_pair_count_in_prefix: twinPairs,
    density_rows: rows,
    periodicity_tail_rows: periodRows,
  };
}

// EP-351: finite subset-sum integer coverage for p(n)+1/n examples.
{
  function termPolyPlusInv(n, kind) {
    if (kind === 'linear') return [BigInt(n * n + 1), BigInt(n)]; // n + 1/n
    if (kind === 'quadratic') return [BigInt(n * n * n + 1), BigInt(n)]; // n^2 + 1/n
    return [BigInt(n * n * n * n + 1), BigInt(n)]; // n^3 + 1/n
  }

  function finiteCoverage(kind, nFrom, nTo) {
    const nums = [];
    const dens = [];
    for (let n = nFrom; n <= nTo; n += 1) {
      const [a, b] = termPolyPlusInv(n, kind);
      nums.push(a);
      dens.push(b);
    }
    let L = 1n;
    for (const d of dens) L = lcmBig(L, d);
    const weights = nums.map((a, i) => (a * (L / dens[i])));

    let sums = new Set([0n]);
    for (const w of weights) {
      const nxt = new Set(sums);
      for (const s of sums) nxt.add(s + w);
      sums = nxt;
    }

    const arr = [...sums].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    const ints = [...arr.filter((s) => s % L === 0n).map((s) => s / L)];
    ints.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));

    let longestRun = 0;
    let runStart = null;
    if (ints.length) {
      let curStart = ints[0];
      let curLen = 1;
      longestRun = 1;
      runStart = ints[0];
      for (let i = 1; i < ints.length; i += 1) {
        if (ints[i] === ints[i - 1] + 1n) {
          curLen += 1;
        } else {
          if (curLen > longestRun) {
            longestRun = curLen;
            runStart = curStart;
          }
          curStart = ints[i];
          curLen = 1;
        }
      }
      if (curLen > longestRun) {
        longestRun = curLen;
        runStart = curStart;
      }
    }

    return {
      kind,
      n_range: [nFrom, nTo],
      terms_used: weights.length,
      subset_count: sums.size,
      lcm_digits: L.toString().length,
      integer_values_count: ints.length,
      min_integer_value: ints.length ? Number(ints[0]) : null,
      max_integer_value: ints.length ? Number(ints[ints.length - 1]) : null,
      longest_consecutive_integer_run_length: longestRun,
      longest_run_start: runStart === null ? null : Number(runStart),
    };
  }

  out.results.ep351 = {
    description: 'Finite subset-sum integer reach for sequences p(n)+1/n with polynomial p.',
    rows: [
      finiteCoverage('linear', 2, 18),
      finiteCoverage('linear', 4, 20),
      finiteCoverage('quadratic', 2, 16),
      finiteCoverage('quadratic', 4, 18),
    ],
  };
}

// EP-352: discrete proxy on integer grids avoiding area-1 triangles.
{
  function area2(p, q, r) {
    const [x1, y1] = p;
    const [x2, y2] = q;
    const [x3, y3] = r;
    return Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
  }

  function bestAvoidArea1(m, restarts) {
    const pts = [];
    for (let x = 0; x <= m; x += 1) {
      for (let y = 0; y <= m; y += 1) pts.push([x, y]);
    }

    const n = pts.length;
    const pairsWithPoint = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        for (let k = j + 1; k < n; k += 1) {
          if (area2(pts[i], pts[j], pts[k]) !== 2) continue;
          pairsWithPoint[i].push([j, k]);
          pairsWithPoint[j].push([i, k]);
          pairsWithPoint[k].push([i, j]);
        }
      }
    }

    let best = 0;
    for (let r = 0; r < restarts; r += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        const t = ord[i];
        ord[i] = ord[j];
        ord[j] = t;
      }
      const chosen = new Uint8Array(n);
      let c = 0;
      for (const v of ord) {
        let bad = false;
        for (const [a, b] of pairsWithPoint[v]) {
          if (chosen[a] && chosen[b]) {
            bad = true;
            break;
          }
        }
        if (!bad) {
          chosen[v] = 1;
          c += 1;
        }
      }
      if (c > best) best = c;
    }
    return { points: n, best };
  }

  const rows = [];
  for (const m of [6, 8, 10]) {
    const { points, best } = bestAvoidArea1(m, 150);
    rows.push({
      grid_m: m,
      total_points: points,
      best_area1_free_subset_size: best,
      density: Number((best / points).toPrecision(6)),
    });
  }

  out.results.ep352 = {
    description: 'Grid-geometry proxy: large subsets of [0,m]^2 with no area-1 triangle among chosen points.',
    rows,
  };
}

// EP-354: finite completeness proxy for floor(alpha*2^k), floor(beta*2^k).
{
  function floorSeq(alpha, K) {
    const arr = [];
    for (let k = 0; k <= K; k += 1) arr.push(Math.floor(alpha * (2 ** k)));
    return arr;
  }

  function contiguousReachFromMultiset(values) {
    const v = [...values].filter((x) => x > 0).sort((a, b) => a - b);
    let reach = 0;
    for (const x of v) {
      if (x > reach + 1) break;
      reach += x;
    }
    return reach;
  }

  const cases = [
    { name: 'irr_ratio_sqrt2_sqrt3', alpha: Math.SQRT2, beta: Math.sqrt(3) },
    { name: 'irr_ratio_pi_e', alpha: Math.PI, beta: Math.E },
    { name: 'power2_related_alpha1.5_beta6', alpha: 1.5, beta: 6.0 },
  ];

  const rows = [];
  for (const c of cases) {
    const row = { case: c.name, rows: [] };
    for (const K of [10, 12, 14, 16]) {
      const s1 = floorSeq(c.alpha, K);
      const s2 = floorSeq(c.beta, K);
      const reach = contiguousReachFromMultiset([...s1, ...s2]);
      row.rows.push({
        K,
        terms_total: s1.length + s2.length,
        min_term: Math.min(...s1, ...s2),
        max_term: Math.max(...s1, ...s2),
        contiguous_reach_from_1: reach,
      });
    }
    rows.push(row);
  }

  out.results.ep354 = {
    description: 'Contiguous subset-sum reach proxy for two floor-doubling sequences.',
    rows,
  };
}

// EP-358: interval-sum representation count profiles f(n) for candidate sequences.
{
  function makeSequence(kind, M) {
    const a = [];
    if (kind === 'integers') {
      for (let n = 1; n <= M; n += 1) a.push(n);
    } else if (kind === 'primes') {
      let x = 2;
      while (a.length < M) {
        if (isPrimeInt(x)) a.push(x);
        x += 1;
      }
    } else if (kind === 'squares') {
      for (let n = 1; n <= M; n += 1) a.push(n * n);
    } else {
      for (let n = 1; n <= M; n += 1) a.push(n + Math.floor(Math.sqrt(n)));
    }
    return a;
  }

  function intervalSumCounts(a, Xmax) {
    const pref = [0];
    for (const x of a) pref.push(pref[pref.length - 1] + x);
    const cnt = new Uint32Array(Xmax + 1);
    for (let i = 0; i < a.length; i += 1) {
      for (let j = i + 1; j <= a.length; j += 1) {
        const s = pref[j] - pref[i];
        if (s > Xmax) break;
        cnt[s] += 1;
      }
    }
    return cnt;
  }

  const rows = [];
  const cases = [
    { kind: 'integers', M: 1800, Xmax: 200000 },
    { kind: 'primes', M: 700, Xmax: 200000 },
    { kind: 'squares', M: 350, Xmax: 200000 },
    { kind: 'n_plus_sqrt_n', M: 1200, Xmax: 200000 },
  ];

  for (const c of cases) {
    const a = makeSequence(c.kind, c.M);
    const cnt = intervalSumCounts(a, c.Xmax);
    let maxF = 0;
    let maxN = 0;
    let tailMin = Number.POSITIVE_INFINITY;
    let tailMinN = -1;
    let tailCovered = 0;
    for (let n = 1; n <= c.Xmax; n += 1) {
      if (cnt[n] > maxF) {
        maxF = cnt[n];
        maxN = n;
      }
      if (n > c.Xmax / 2) {
        if (cnt[n] < tailMin) {
          tailMin = cnt[n];
          tailMinN = n;
        }
        if (cnt[n] > 0) tailCovered += 1;
      }
    }
    const tailLen = c.Xmax / 2;
    rows.push({
      kind: c.kind,
      terms_used: c.M,
      Xmax: c.Xmax,
      max_f_n: maxF,
      argmax_n: maxN,
      min_f_on_tail_X_over_2_to_X: tailMin,
      argmin_tail_n: tailMinN,
      tail_positive_density: Number((tailCovered / tailLen).toPrecision(6)),
    });
  }

  out.results.ep358 = {
    description: 'Finite interval-sum multiplicity profile f(n) for representative increasing sequences A.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch10_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
