#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 9:
// EP-271, EP-274, EP-276, EP-283, EP-291, EP-293, EP-304, EP-306, EP-319, EP-320.

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

function reduceFrac(num, den) {
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function ceilDivBig(a, b) {
  return (a + b - 1n) / b;
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
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
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

const rng = makeRng(20260303 ^ 909);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-271: greedy no-3AP Stanley sequence profiles from different starts A(n).
{
  function canAddNo3APAsLargest(A, Aset, x) {
    for (const z of A) {
      const y = 2 * z - x;
      if (y >= 0 && y < z && Aset.has(y)) return false;
    }
    return true;
  }

  function buildAofN(n, terms) {
    const A = [0, n];
    const Aset = new Set(A);
    while (A.length < terms) {
      let x = A[A.length - 1] + 1;
      while (true) {
        if (canAddNo3APAsLargest(A, Aset, x)) {
          A.push(x);
          Aset.add(x);
          break;
        }
        x += 1;
      }
    }
    return A;
  }

  function fitExponent(A, kStart) {
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    let cnt = 0;
    for (let k = kStart; k < A.length; k += 1) {
      if (k <= 0 || A[k] <= 0) continue;
      const x = Math.log(k);
      const y = Math.log(A[k]);
      sx += x;
      sy += y;
      sxx += x * x;
      sxy += x * y;
      cnt += 1;
    }
    const den = cnt * sxx - sx * sx;
    if (cnt < 2 || Math.abs(den) < 1e-12) return null;
    return (cnt * sxy - sx * sy) / den;
  }

  const alpha = Math.log(3) / Math.log(2);
  const rows = [];
  for (const n of [1, 2, 3, 4, 5, 7, 10]) {
    const A = buildAofN(n, 220);
    const exp = fitExponent(A, 40);
    const k = A.length - 1;
    rows.push({
      n,
      terms_used: A.length,
      last_index: k,
      last_value: A[k],
      fitted_growth_exponent: exp === null ? null : Number(exp.toFixed(6)),
      ratio_last_over_k_pow_log2_3: Number((A[k] / (k ** alpha)).toPrecision(7)),
      first_15_terms: A.slice(0, 15),
    });
  }

  out.results.ep271 = {
    description: 'Greedy finite profiles for A(n) no-3AP sequence growth exponents.',
    rows,
  };
}

// EP-274: exact-cover search in cyclic groups Z_n by cosets with distinct indices.
{
  function cosetsZn(n) {
    const cands = [];
    for (let idx = 2; idx <= n; idx += 1) {
      if (n % idx !== 0) continue;
      for (let r = 0; r < idx; r += 1) {
        let mask = 0n;
        for (let x = r; x < n; x += idx) mask |= 1n << BigInt(x);
        cands.push({ index: idx, mask });
      }
    }
    return cands;
  }

  function hasDistinctIndexCosetPartitionZn(n) {
    const cands = cosetsZn(n);
    const allMask = (1n << BigInt(n)) - 1n;

    const idxVals = [...new Set(cands.map((c) => c.index))].sort((a, b) => a - b);
    const idxPos = new Map(idxVals.map((v, i) => [v, i]));

    const elemToCands = Array.from({ length: n }, () => []);
    for (let i = 0; i < cands.length; i += 1) {
      const { mask } = cands[i];
      for (let e = 0; e < n; e += 1) {
        if ((mask >> BigInt(e)) & 1n) elemToCands[e].push(i);
      }
    }

    for (const list of elemToCands) {
      list.sort((i, j) => {
        const ai = cands[i].mask.toString(2).length;
        const aj = cands[j].mask.toString(2).length;
        return ai - aj;
      });
    }

    function dfs(covered, usedIdxBits, chosen) {
      if (covered === allMask) return chosen > 1;

      let e = 0;
      while (e < n && ((covered >> BigInt(e)) & 1n)) e += 1;
      if (e >= n) return chosen > 1;

      for (const ci of elemToCands[e]) {
        const c = cands[ci];
        const bit = 1n << BigInt(idxPos.get(c.index));
        if (usedIdxBits & bit) continue;
        if (covered & c.mask) continue;
        if (dfs(covered | c.mask, usedIdxBits | bit, chosen + 1)) return true;
      }
      return false;
    }

    return dfs(0n, 0n, 0);
  }

  const rows = [];
  let foundAny = false;
  for (const n of [6, 8, 10, 12, 14, 16, 18, 20, 24, 30]) {
    const ok = hasDistinctIndexCosetPartitionZn(n);
    if (ok) foundAny = true;
    rows.push({ n, has_partition: ok });
  }

  out.results.ep274 = {
    description: 'Brute-force exact-cover search in small cyclic groups for distinct-index coset partitions.',
    rows,
    any_partition_found: foundAny,
  };
}

// EP-276: search small-seed Lucas recurrences for long initial all-composite runs with gcd profile.
{
  function lucasSeq(a0, a1, len) {
    const a = [a0, a1];
    for (let i = 2; i < len; i += 1) {
      const next = a[i - 1] + a[i - 2];
      if (!Number.isSafeInteger(next) || next <= 0) return a;
      a.push(next);
    }
    return a;
  }

  function compositePrefixLen(arr) {
    let t = 0;
    while (t < arr.length && !isPrimeInt(arr[t])) t += 1;
    return t;
  }

  const compositeSeeds = [];
  for (let x = 4; x <= 120; x += 1) if (!isPrimeInt(x)) compositeSeeds.push(x);

  let bestAny = null;
  let bestGcd1 = null;

  for (const a0 of compositeSeeds) {
    for (const a1 of compositeSeeds) {
      const seq = lucasSeq(a0, a1, 28);
      if (seq.length < 8) continue;
      const t = compositePrefixLen(seq);
      if (t < 6) continue;
      let g = 0;
      for (let i = 0; i < t; i += 1) g = gcdInt(g, seq[i]);
      const rec = {
        a0,
        a1,
        composite_prefix_len: t,
        gcd_prefix: g,
        prefix_tail_value: seq[t - 1],
      };
      if (!bestAny || t > bestAny.composite_prefix_len || (t === bestAny.composite_prefix_len && rec.gcd_prefix < bestAny.gcd_prefix)) {
        bestAny = rec;
      }
      if (g === 1 && (!bestGcd1 || t > bestGcd1.composite_prefix_len)) {
        bestGcd1 = rec;
      }
    }
  }

  out.results.ep276 = {
    description: 'Small-seed Lucas scan for long initial composite runs and gcd behavior.',
    seed_range: [4, 120],
    terms_tested: 28,
    best_overall: bestAny,
    best_with_prefix_gcd_1: bestGcd1,
  };
}

// EP-283: random split-generated Egyptian decompositions of 1; induced polynomial-sum coverage proxies.
{
  function splitStep(D, maxDen) {
    const present = new Set(D);
    const options = [];
    for (let i = 0; i < D.length; i += 1) {
      const d = D[i];
      const a = d + 1;
      const b = d * (d + 1);
      if (b > maxDen) continue;
      if (present.has(a) || present.has(b)) continue;
      options.push(i);
    }
    if (!options.length) return false;
    const i = options[Math.floor(rng() * options.length)];
    const d = D[i];
    D.splice(i, 1, d + 1, d * (d + 1));
    D.sort((x, y) => x - y);
    return true;
  }

  const m1Set = new Set();
  const m2Set = new Set();
  let bestTerms = 0;

  const restarts = 6000;
  const maxSteps = 14;
  const maxDen = 200000;

  for (let r = 0; r < restarts; r += 1) {
    const D = [2, 3, 6];
    const steps = 1 + Math.floor(rng() * maxSteps);
    for (let s = 0; s < steps; s += 1) {
      if (!splitStep(D, maxDen)) break;
    }

    let m1 = 0;
    let m2 = 0;
    for (const d of D) {
      m1 += d;
      m2 += d * d;
    }
    m1Set.add(m1);
    m2Set.add(m2);
    if (D.length > bestTerms) bestTerms = D.length;
  }

  function coverageStats(set, M, tail) {
    let c = 0;
    let t = 0;
    for (let x = 1; x <= M; x += 1) {
      if (set.has(x)) c += 1;
      if (x > M - tail && set.has(x)) t += 1;
    }
    return {
      M,
      covered_count: c,
      covered_density: Number((c / M).toPrecision(6)),
      tail_window: tail,
      tail_density: Number((t / tail).toPrecision(6)),
    };
  }

  out.results.ep283 = {
    description: 'Random split-generated Egyptian decompositions and resulting m=Σp(n_i) coverage proxies for p(x)=x and p(x)=x^2.',
    generation: { restarts, maxSteps, maxDen, best_terms_found: bestTerms },
    linear_p_of_x_rows: [
      coverageStats(m1Set, 10000, 2000),
      coverageStats(m1Set, 25000, 5000),
      coverageStats(m1Set, 50000, 10000),
    ],
    quadratic_p_of_x_rows: [
      coverageStats(m2Set, 20000, 4000),
      coverageStats(m2Set, 50000, 10000),
      coverageStats(m2Set, 100000, 20000),
    ],
  };
}

// EP-291: exact BigInt profile of gcd(a_n, L_n), H_n = a_n / L_n.
{
  let num = 0n;
  let den = 1n;
  let L = 1n;

  let coprimeCount = 0;
  let nontrivialCount = 0;
  let firstCoprime = null;
  let firstNontrivial = null;
  const rows = [];

  const milestones = new Set([100, 200, 300, 400, 500]);
  for (let n = 1; n <= 500; n += 1) {
    const bn = BigInt(n);
    [num, den] = reduceFrac(num * bn + den, den * bn);
    L = lcmBig(L, bn);

    const a = num * (L / den);
    const g = gcdBig(a, L);
    if (g === 1n) {
      coprimeCount += 1;
      if (firstCoprime === null) firstCoprime = n;
    } else {
      nontrivialCount += 1;
      if (firstNontrivial === null) firstNontrivial = n;
    }

    if (milestones.has(n)) {
      rows.push({
        n,
        coprime_count_up_to_n: coprimeCount,
        nontrivial_count_up_to_n: nontrivialCount,
        coprime_density: Number((coprimeCount / n).toPrecision(6)),
      });
    }
  }

  out.results.ep291 = {
    description: 'Exact finite profile of gcd(a_n,L_n) for n<=500 via BigInt harmonic arithmetic.',
    first_n_with_gcd_eq_1: firstCoprime,
    first_n_with_gcd_gt_1: firstNontrivial,
    rows,
  };
}

// EP-293: small-k exact denominator-appearance profile in Egyptian decompositions of 1.
{
  function collectDenominatorsForK(k, maxDen) {
    const usedDenoms = new Set();
    let solutionCount = 0;

    function dfs(num, den, start, termsLeft, chosen) {
      if (termsLeft === 1) {
        if (num <= 0n) return;
        if (den % num !== 0n) return;
        const d = Number(den / num);
        if (!Number.isFinite(d) || d < start || d > maxDen) return;
        solutionCount += 1;
        for (const x of chosen) usedDenoms.add(x);
        usedDenoms.add(d);
        return;
      }

      // Upper-bound pruning: with termsLeft denominators >= start, total <= termsLeft/start.
      if (num * BigInt(start) > den * BigInt(termsLeft)) return;

      let dMin = Number(ceilDivBig(den, num));
      if (dMin < start) dMin = start;

      for (let d = dMin; d <= maxDen; d += 1) {
        const bd = BigInt(d);
        const newNumRaw = num * bd - den;
        if (newNumRaw <= 0n) continue;
        const newDenRaw = den * bd;
        const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);

        const t = termsLeft - 1;
        if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;

        chosen.push(d);
        dfs(newNum, newDen, d + 1, t, chosen);
        chosen.pop();
      }
    }

    dfs(1n, 1n, 2, k, []);

    let vProxy = 2;
    while (usedDenoms.has(vProxy)) vProxy += 1;

    return {
      k,
      max_denom_searched: maxDen,
      solution_count: solutionCount,
      distinct_denominators_seen: usedDenoms.size,
      v_proxy_min_missing_from_2: vProxy,
    };
  }

  const rows = [
    collectDenominatorsForK(3, 400),
    collectDenominatorsForK(4, 800),
    collectDenominatorsForK(5, 1500),
    collectDenominatorsForK(6, 2200),
  ];

  out.results.ep293 = {
    description: 'Exact finite-k denominator-appearance scan for 1=sum 1/n_i, yielding a proxy for v(k).',
    rows,
  };
}

// Shared DFS for EP-304 style Egyptian length search (all denominators >1, distinct).
function minEgyptLengthGeneral(targetNum, targetDen, cfg) {
  const { maxDen, kMax } = cfg;

  function canAtDepth(num, den, start, termsLeft, memo) {
    const key = `${num}/${den}|${start}|${termsLeft}`;
    if (memo.has(key)) return memo.get(key);

    if (termsLeft === 1) {
      if (num <= 0n || den % num !== 0n) {
        memo.set(key, false);
        return false;
      }
      const d = Number(den / num);
      const ok = Number.isFinite(d) && d >= start && d <= maxDen && d > 1;
      memo.set(key, ok);
      return ok;
    }

    if (num * BigInt(start) > den * BigInt(termsLeft)) {
      memo.set(key, false);
      return false;
    }

    let dMin = Number(ceilDivBig(den, num));
    if (dMin < start) dMin = start;

    for (let d = dMin; d <= maxDen; d += 1) {
      const bd = BigInt(d);
      const newNumRaw = num * bd - den;
      if (newNumRaw <= 0n) continue;
      const newDenRaw = den * bd;
      const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
      const t = termsLeft - 1;
      if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;
      if (canAtDepth(newNum, newDen, d + 1, t, memo)) {
        memo.set(key, true);
        return true;
      }
    }

    memo.set(key, false);
    return false;
  }

  const [num0, den0] = reduceFrac(BigInt(targetNum), BigInt(targetDen));
  for (let k = 1; k <= kMax; k += 1) {
    const memo = new Map();
    if (canAtDepth(num0, den0, 2, k, memo)) return k;
  }
  return null;
}

// EP-304: finite small-b profile for N(a,b), N(b).
{
  const rows = [];
  for (const b of [8, 10, 12, 15, 18, 24]) {
    let solved = 0;
    let unresolved = 0;
    let maxMinLen = 0;
    for (let a = 1; a < b; a += 1) {
      const k = minEgyptLengthGeneral(a, b, { maxDen: 600, kMax: 8 });
      if (k === null) {
        unresolved += 1;
      } else {
        solved += 1;
        if (k > maxMinLen) maxMinLen = k;
      }
    }
    rows.push({
      b,
      solved_count: solved,
      unresolved_count: unresolved,
      max_min_length_among_solved: maxMinLen,
      loglog_b: Number(Math.log(Math.log(b)).toPrecision(6)),
    });
  }

  out.results.ep304 = {
    description: 'Finite search profile for minimal Egyptian lengths N(a,b) on small denominators b.',
    search_limits: { maxDen: 600, kMax: 8 },
    rows,
  };
}

// EP-306: restricted Egyptian representations with semiprime (distinct-prime-product) denominators.
{
  const maxDen = 700;
  const { isPrime } = sieve(maxDen + 10);
  const semiprimes = [];
  for (let n = 6; n <= maxDen; n += 1) {
    let cnt = 0;
    let p1 = -1;
    let p2 = -1;
    for (let p = 2; p * p <= n; p += 1) {
      if (!isPrime[p] || n % p !== 0) continue;
      const q = n / p;
      if (q !== p && isPrime[q]) {
        cnt += 1;
        p1 = p;
        p2 = q;
      }
    }
    if (cnt === 1 && p1 !== p2) semiprimes.push(n);
  }

  function minEgyptLengthSemiprime(a, b, kMax) {
    const [num0, den0] = reduceFrac(BigInt(a), BigInt(b));

    function canAtDepth(num, den, pos, termsLeft, memo) {
      const key = `${num}/${den}|${pos}|${termsLeft}`;
      if (memo.has(key)) return memo.get(key);

      if (termsLeft === 1) {
        if (num <= 0n || den % num !== 0n) {
          memo.set(key, false);
          return false;
        }
        const d = Number(den / num);
        const ok = Number.isFinite(d) && semiprimes.includes(d) && d >= semiprimes[pos];
        memo.set(key, ok);
        return ok;
      }

      const start = semiprimes[pos] ?? maxDen + 1;
      if (!Number.isFinite(start)) {
        memo.set(key, false);
        return false;
      }
      if (num * BigInt(start) > den * BigInt(termsLeft)) {
        memo.set(key, false);
        return false;
      }

      const dMin0 = Number(ceilDivBig(den, num));
      for (let i = pos; i < semiprimes.length; i += 1) {
        const d = semiprimes[i];
        if (d < dMin0) continue;
        const bd = BigInt(d);
        const newNumRaw = num * bd - den;
        if (newNumRaw <= 0n) continue;
        const newDenRaw = den * bd;
        const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
        const t = termsLeft - 1;
        const nextStart = semiprimes[i + 1] ?? (maxDen + 1);
        if (newNum * BigInt(nextStart) > newDen * BigInt(t)) continue;
        if (canAtDepth(newNum, newDen, i + 1, t, memo)) {
          memo.set(key, true);
          return true;
        }
      }

      memo.set(key, false);
      return false;
    }

    for (let k = 1; k <= kMax; k += 1) {
      const memo = new Map();
      if (canAtDepth(num0, den0, 0, k, memo)) return k;
    }
    return null;
  }

  const rows = [];
  for (const b of [6, 10, 14, 15, 21, 30]) {
    let solved = 0;
    let unresolved = 0;
    let maxLen = 0;
    for (let a = 1; a < b; a += 1) {
      if (gcdInt(a, b) !== 1) continue;
      const k = minEgyptLengthSemiprime(a, b, 8);
      if (k === null) {
        unresolved += 1;
      } else {
        solved += 1;
        if (k > maxLen) maxLen = k;
      }
    }
    rows.push({
      b,
      represented_coprime_a_count: solved,
      unresolved_coprime_a_count: unresolved,
      max_min_length_among_represented: maxLen,
    });
  }

  out.results.ep306 = {
    description: 'Finite representability profile for a/b using distinct semiprime denominators.',
    semiprime_count_up_to_maxDen: semiprimes.length,
    search_limits: { maxDen, kMax: 8 },
    rows,
  };
}

// EP-319: constructive lower-bound proxy via large Egyptian decomposition B with sum_{b in B}1/b=1.
{
  function splitOptions(D, N) {
    const present = new Set(D);
    const ops = [];
    for (let i = 0; i < D.length; i += 1) {
      const d = D[i];
      const a = d + 1;
      const b = d * (d + 1);
      if (b > N) continue;
      if (present.has(a) || present.has(b)) continue;
      ops.push(i);
    }
    return ops;
  }

  function hasProperSubsetSumOne(denoms) {
    const m = denoms.length;
    if (m > 22) return null;
    let L = 1n;
    for (const d of denoms) L = lcmBig(L, BigInt(d));
    const weights = denoms.map((d) => L / BigInt(d));
    const total = L;
    const maxMask = 1 << m;
    for (let mask = 1; mask < maxMask - 1; mask += 1) {
      let s = 0n;
      for (let i = 0; i < m; i += 1) {
        if ((mask >> i) & 1) s += weights[i];
      }
      if (s === total) return true;
    }
    return false;
  }

  const rows = [];
  for (const N of [30, 40, 50, 60, 80, 100]) {
    let best = [2, 3, 6];
    for (let r = 0; r < 4000; r += 1) {
      const D = [2, 3, 6];
      while (true) {
        const ops = splitOptions(D, N);
        if (!ops.length) break;
        const i = ops[Math.floor(rng() * ops.length)];
        const d = D[i];
        D.splice(i, 1, d + 1, d * (d + 1));
        D.sort((x, y) => x - y);
      }
      if (D.length > best.length) best = D;
    }

    const properSubsetHitsOne = hasProperSubsetSumOne(best);
    rows.push({
      N,
      best_B_size_found: best.length,
      implied_A_size_lower_bound: best.length + 1,
      implied_A_over_N: Number(((best.length + 1) / N).toPrecision(6)),
      proper_subset_sum_1_exists: properSubsetHitsOne,
      sample_B_prefix: best.slice(0, 10),
    });
  }

  out.results.ep319 = {
    description: 'Randomized split construction lower-bound proxy for large minimal signed harmonic relation sets.',
    rows,
  };
}

// EP-320: exact distinct subset-sum counts S(N) for small N via common-denominator DP.
{
  function exactSofN(N) {
    let L = 1n;
    for (let i = 1; i <= N; i += 1) L = lcmBig(L, BigInt(i));
    let sums = new Set([0n]);
    for (let i = 1; i <= N; i += 1) {
      const w = L / BigInt(i);
      const next = new Set(sums);
      for (const s of sums) next.add(s + w);
      sums = next;
    }
    return { S: sums.size, lcm_digits: L.toString().length };
  }

  const rows = [];
  for (const N of [8, 10, 12, 14, 16, 18, 20]) {
    const { S, lcm_digits } = exactSofN(N);
    rows.push({
      N,
      S_N: S,
      log_S_N: Number(Math.log(S).toPrecision(8)),
      lcm_digits,
      log_S_over_N_over_logN: Number((Math.log(S) / (N / Math.log(N))).toPrecision(6)),
    });
  }

  out.results.ep320 = {
    description: 'Exact S(N) for small N using subset-sum DP over common denominator lcm(1..N).',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch9_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
