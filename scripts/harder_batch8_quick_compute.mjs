#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 8:
// EP-241, EP-243, EP-244, EP-252, EP-256, EP-257, EP-261, EP-263, EP-264, EP-265.

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

function bestRationalApprox(x, qMax) {
  let best = { p: 0, q: 1, err: Math.abs(x) };
  for (let q = 1; q <= qMax; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < best.err) best = { p, q, err };
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

function fracAdd([a, b], [c, d]) {
  const num = a * d + c * b;
  const den = b * d;
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function fracSub([a, b], [c, d]) {
  const num = a * d - c * b;
  const den = b * d;
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function fracToNumber([a, b]) {
  return Number(a) / Number(b);
}

const rng = makeRng(20260303 ^ 809);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-241: B3-set finite profiles.
{
  function tryAddB3(A, sumSet, x) {
    const newSums = new Set();

    const s0 = 3 * x;
    if (sumSet.has(s0)) return false;
    newSums.add(s0);

    for (const a of A) {
      const s = 2 * x + a;
      if (sumSet.has(s) || newSums.has(s)) return false;
      newSums.add(s);
    }

    for (let i = 0; i < A.length; i += 1) {
      for (let j = i; j < A.length; j += 1) {
        const s = x + A[i] + A[j];
        if (sumSet.has(s) || newSums.has(s)) return false;
        newSums.add(s);
      }
    }

    A.push(x);
    for (const s of newSums) sumSet.add(s);
    return true;
  }

  function greedyB3UpTo(N) {
    const A = [];
    const sumSet = new Set();
    for (let x = 1; x <= N; x += 1) tryAddB3(A, sumSet, x);
    return A.length;
  }

  function randomGreedyB3(N, trials) {
    const base = Array.from({ length: N }, (_, i) => i + 1);
    let best = 0;
    for (let t = 0; t < trials; t += 1) {
      const ord = [...base];
      shuffle(ord, rng);
      const A = [];
      const sumSet = new Set();
      for (const x of ord) tryAddB3(A, sumSet, x);
      if (A.length > best) best = A.length;
    }
    return best;
  }

  const rows = [];
  for (const N of [5000, 10000, 20000, 50000]) {
    const g = greedyB3UpTo(N);
    const r = randomGreedyB3(N, 20);
    rows.push({
      N,
      greedy_size: g,
      random_best_of_20: r,
      greedy_over_N_pow_1_over_3: Number((g / N ** (1 / 3)).toFixed(6)),
      random_over_N_pow_1_over_3: Number((r / N ** (1 / 3)).toFixed(6)),
    });
  }

  out.results.ep241 = {
    description: 'Finite greedy profiles for B3-type sets with distinct triple sums.',
    rows,
  };
}

// EP-243: Sylvester-type telescoping identity vs perturbation.
{
  function sylvesterTerms(a1, len) {
    const a = [BigInt(a1)];
    while (a.length < len) {
      const x = a[a.length - 1];
      a.push(x * x - x + 1n);
    }
    return a;
  }

  function telescopingResidual(a) {
    // Sum_i [1/a_i - (1/(a_i-1) - 1/(a_{i+1}-1))]
    let res = [0n, 1n];
    for (let i = 0; i + 1 < a.length; i += 1) {
      const term1 = [1n, a[i]];
      const term2 = fracSub([1n, a[i] - 1n], [1n, a[i + 1] - 1n]);
      const diff = fracSub(term1, term2);
      res = fracAdd(res, diff);
    }
    return res;
  }

  const rows = [];
  for (const a1 of [2, 3, 5]) {
    const a = sylvesterTerms(a1, 8);
    const r = telescopingResidual(a);
    rows.push({
      model: 'exact_sylvester',
      a1,
      terms_checked: 8,
      residual_numerator: r[0].toString(),
      residual_denominator: r[1].toString(),
      residual_as_number: fracToNumber(r),
    });

    const b = [...a];
    b[4] += 1n; // perturb one term
    const rp = telescopingResidual(b);
    rows.push({
      model: 'single_perturbation_at_index5',
      a1,
      terms_checked: 8,
      residual_numerator: rp[0].toString(),
      residual_denominator: rp[1].toString(),
      residual_as_number: fracToNumber(rp),
    });
  }

  out.results.ep243 = {
    description: 'Exact telescoping residual check for Sylvester recurrence and perturbed variants.',
    rows,
  };
}

// EP-244: density of p + floor(C^k) in finite ranges.
{
  const X = 200000;
  const { isPrime } = sieve(X);

  function shiftsForC(C, Xmax) {
    const s = new Set();
    let v = 1;
    for (let k = 0; k < 200; k += 1) {
      const f = Math.floor(v);
      if (f > Xmax) break;
      s.add(f);
      v *= C;
      if (!Number.isFinite(v)) break;
    }
    return [...s].sort((a, b) => a - b);
  }

  function densityForC(C) {
    const shifts = shiftsForC(C, X);
    const mark = new Uint8Array(X + 1);
    for (let n = 1; n <= X; n += 1) {
      let ok = false;
      for (const s of shifts) {
        if (s >= n) break;
        if (isPrime[n - s]) {
          ok = true;
          break;
        }
      }
      if (ok) mark[n] = 1;
    }
    let all = 0;
    let tail = 0;
    const L = Math.floor(X / 2);
    for (let n = 1; n <= X; n += 1) {
      all += mark[n];
      if (n >= L) tail += mark[n];
    }
    return {
      C: Number(C.toFixed(6)),
      shifts_count: shifts.length,
      density_1_to_X: Number((all / X).toFixed(6)),
      density_tail_half: Number((tail / (X - L + 1)).toFixed(6)),
    };
  }

  const rows = [1.3, Math.sqrt(2), (1 + Math.sqrt(5)) / 2, Math.PI, 2, 3].map(densityForC);

  out.results.ep244 = {
    description: 'Finite density profile for representations n = p + floor(C^k).',
    X,
    rows,
  };
}

// EP-252: finite approximants for sum sigma_k(n)/n!.
{
  const Ntail = 140;
  const sigma = Array.from({ length: 7 }, () => new Float64Array(Ntail + 1));
  for (let k = 1; k <= 6; k += 1) {
    for (let d = 1; d <= Ntail; d += 1) {
      const dk = d ** k;
      for (let n = d; n <= Ntail; n += d) sigma[k][n] += dk;
    }
  }

  const invFact = new Float64Array(Ntail + 1);
  invFact[0] = 1;
  for (let n = 1; n <= Ntail; n += 1) invFact[n] = invFact[n - 1] / n;

  const rows = [];
  for (let k = 1; k <= 6; k += 1) {
    const partialN = 40;
    let s40 = 0;
    let s140 = 0;
    for (let n = 1; n <= partialN; n += 1) s40 += sigma[k][n] * invFact[n];
    for (let n = 1; n <= Ntail; n += 1) s140 += sigma[k][n] * invFact[n];
    const tail = Math.abs(s140 - s40);
    const best = bestRationalApprox(s140, 20000);
    rows.push({
      k,
      partial_sum_N40: Number(s40.toPrecision(14)),
      extended_sum_N140: Number(s140.toPrecision(14)),
      N40_to_N140_tail_size: Number(tail.toExponential(4)),
      best_rational_q_le_20000: `${best.p}/${best.q}`,
      approx_error: Number(best.err.toExponential(4)),
    });
  }

  out.results.ep252 = {
    description: 'Finite high-truncation approximants for alpha_k = sum sigma_k(n)/n! (k<=6).',
    rows,
  };
}

// EP-256: max-product profile for candidate exponent sets.
{
  function maxLogProduct(exponents, grid = 2048) {
    let best = -Infinity;
    for (let t = 1; t <= grid; t += 1) {
      const theta = (2 * Math.PI * t) / (grid + 1);
      let s = 0;
      for (const a of exponents) {
        const v = Math.abs(2 * Math.sin((a * theta) / 2));
        s += Math.log(Math.max(v, 1e-15));
      }
      if (s > best) best = s;
    }
    return best;
  }

  function randomSet(n, m) {
    const arr = Array.from({ length: m }, (_, i) => i + 1);
    shuffle(arr, rng);
    return arr.slice(0, n).sort((a, b) => a - b);
  }

  const rows = [];
  for (const n of [8, 12, 16, 20, 24]) {
    const consec = Array.from({ length: n }, (_, i) => i + 1);
    const p2 = Array.from({ length: n }, (_, i) => 2 ** i);

    const lc = maxLogProduct(consec);
    const lp2 = maxLogProduct(p2);

    let bestRnd = Infinity;
    for (let t = 0; t < 60; t += 1) {
      const ex = randomSet(n, 6 * n);
      const v = maxLogProduct(ex, 1536);
      if (v < bestRnd) bestRnd = v;
    }

    rows.push({
      n,
      log_max_product_consecutive: Number(lc.toFixed(6)),
      log_max_product_powers_of_2: Number(lp2.toFixed(6)),
      min_log_max_product_random_60: Number(bestRnd.toFixed(6)),
    });
  }

  out.results.ep256 = {
    description: 'Grid-based finite profile for log max_{|z|=1} prod_i |1-z^{a_i}| over candidate exponent sets.',
    rows,
  };
}

// EP-257: partial sums for canonical infinite sets A.
{
  function primePowers(limit) {
    const { primes } = sieve(limit);
    const set = new Set();
    for (const p of primes) {
      let v = p;
      while (v <= limit) {
        set.add(v);
        if (v > Math.floor(limit / p)) break;
        v *= p;
      }
    }
    return [...set].sort((a, b) => a - b);
  }

  function partialAhmes(A, L) {
    let s = 0;
    for (const n of A) {
      if (n > L) break;
      s += 1 / (2 ** n - 1);
    }
    return s;
  }

  const L = 400;
  const { primes } = sieve(L);
  const families = [
    { name: 'primes', A: primes },
    { name: 'prime_powers', A: primePowers(L) },
    { name: 'powers_of_2', A: Array.from({ length: 15 }, (_, i) => 2 ** i).filter((x) => x <= L) },
    { name: 'squares', A: Array.from({ length: Math.floor(Math.sqrt(L)) }, (_, i) => (i + 1) ** 2) },
  ];

  const rows = [];
  for (const f of families) {
    const s200 = partialAhmes(f.A, 200);
    const s400 = partialAhmes(f.A, 400);
    const best = bestRationalApprox(s400, 50000);
    rows.push({
      family: f.name,
      terms_up_to_400: f.A.filter((x) => x <= 400).length,
      partial_sum_L200: Number(s200.toPrecision(14)),
      partial_sum_L400: Number(s400.toPrecision(14)),
      delta_200_to_400: Number(Math.abs(s400 - s200).toExponential(4)),
      best_rational_q_le_50000: `${best.p}/${best.q}`,
      approx_error: Number(best.err.toExponential(4)),
    });
  }

  out.results.ep257 = {
    description: 'Finite partial-sum profile of sum_{n in A} 1/(2^n-1) for representative infinite sets A.',
    rows,
  };
}

// EP-261: structured subset-offset representations.
{
  function generatedNByOffsetSubsets(L, Nmax) {
    const denBase = 1 << L;
    const hit = new Uint8Array(Nmax + 1);
    const totalMasks = 1 << L;
    for (let mask = 1; mask < totalMasks; mask += 1) {
      let bits = 0;
      let C1 = 0;
      let C0 = 0;
      for (let i = 1; i <= L; i += 1) {
        if (((mask >>> (i - 1)) & 1) === 0) continue;
        bits += 1;
        const w = 1 << (L - i);
        C1 += w;
        C0 += i * w;
      }
      if (bits < 2) continue;
      const den = denBase - C1;
      if (den <= 0) continue;
      if (C0 % den !== 0) continue;
      const n = C0 / den;
      if (n >= 1 && n <= Nmax) hit[n] = 1;
    }
    return hit;
  }

  const Nmax = 5000;
  const rows = [];
  const union = new Uint8Array(Nmax + 1);
  for (const L of [8, 10, 12, 15, 20]) {
    const h = generatedNByOffsetSubsets(L, Nmax);
    let c = 0;
    let mx = 0;
    for (let n = 1; n <= Nmax; n += 1) {
      if (h[n]) {
        c += 1;
        mx = n;
        union[n] = 1;
      }
    }
    rows.push({
      offset_window_L: L,
      represented_n_count_up_to_Nmax: c,
      density_up_to_Nmax: Number((c / Nmax).toFixed(6)),
      largest_represented_n_up_to_Nmax: mx,
    });
  }

  let unionCount = 0;
  let unionMx = 0;
  for (let n = 1; n <= Nmax; n += 1) {
    if (union[n]) {
      unionCount += 1;
      unionMx = n;
    }
  }

  out.results.ep261 = {
    description: 'Finite coverage profile from subset-offset representation ansatz a_i = n + i.',
    Nmax,
    rows,
    union_over_L_up_to_20: {
      represented_count: unionCount,
      represented_density: Number((unionCount / Nmax).toFixed(6)),
      largest_represented_n: unionMx,
    },
  };
}

// EP-263 + EP-264: growth/criterion metrics.
{
  function logA(type, n) {
    if (type === 'pow2pow2') return 2 ** n * Math.log(2); // a_n = 2^(2^n)
    if (type === 'pow2n') return n * Math.log(2); // a_n = 2^n
    if (type === 'factorial') {
      let s = 0;
      for (let i = 2; i <= n; i += 1) s += Math.log(i);
      return s;
    }
    if (type === 'exp_exp_0.6') return Math.exp(0.6 * n);
    if (type === 'exp_exp_0.8') return Math.exp(0.8 * n);
    throw new Error('bad type');
  }

  function criterionApprox(type, n) {
    if (type === 'pow2n') {
      // exact: a_n^2 * sum_{k>n} 1/a_k^2 = sum_{j>=1} 4^{-j} = 1/3
      return 1 / 3;
    }
    const ln = logA(type, n);
    let s = 0;
    for (let k = n + 1; k <= n + 60; k += 1) {
      const tk = 2 * (ln - logA(type, k));
      const term = Math.exp(tk);
      s += term;
      if (term < 1e-16 && k > n + 6) break;
    }
    return s;
  }

  const types = ['pow2pow2', 'pow2n', 'factorial', 'exp_exp_0.6', 'exp_exp_0.8'];

  const rows263 = [];
  for (const type of types) {
    for (const n of [4, 6, 8, 10, 12]) {
      const ln = logA(type, n);
      const lnNext = logA(type, n + 1);
      rows263.push({
        sequence: type,
        n,
        log_a_n: Number(ln.toExponential(6)),
        log_ratio_a_next_over_a_n_sq: Number((lnNext - 2 * ln).toExponential(6)),
        log_a_n_over_2_pow_n: Number((ln / 2 ** n).toExponential(6)),
      });
    }
  }

  const rows264 = [];
  for (const type of types) {
    for (const n of [4, 6, 8, 10, 12]) {
      const v = criterionApprox(type, n);
      rows264.push({
        sequence: type,
        n,
        approx_a_n_sq_times_tail_sum_reciprocal_sq: Number(v.toExponential(6)),
      });
    }
  }

  out.results.ep263 = {
    description: 'Growth-diagnostic metrics relevant to irrationality-sequence criteria (type [263]).',
    rows: rows263,
  };

  out.results.ep264 = {
    description: 'Criterion-profile values a_n^2 * sum_{k>n} 1/a_k^2 for representative sequences (type [264]).',
    rows: rows264,
  };
}

// EP-265: growth and rational-approximation profiles for known constructions.
{
  function sequenceTri(limitN) {
    const a = [];
    for (let n = 3; n <= limitN; n += 1) a.push((n * (n - 1)) / 2);
    return a;
  }

  function sequencePoly(limitN) {
    const a = [];
    for (let n = 2; n <= limitN; n += 1) a.push(n ** 3 + 6 * n ** 2 + 5 * n);
    return a;
  }

  function partialShifted(A, shift) {
    let s = 0;
    for (const x of A) s += 1 / (x - shift);
    return s;
  }

  const tri = sequenceTri(80000);
  const poly = sequencePoly(50000);

  const S_tri_0 = partialShifted(tri, 0);
  const S_tri_1 = partialShifted(tri, 1);
  const S_poly_0 = partialShifted(poly, 0);
  const S_poly_12 = partialShifted(poly, 12);

  const rows = [
    {
      family: 'triangular_choose_n_2_start_n=3',
      terms_used: tri.length,
      partial_sum_shift_0: Number(S_tri_0.toPrecision(14)),
      partial_sum_shift_1: Number(S_tri_1.toPrecision(14)),
      'best_rational_shift_0_q<=5000': (() => {
        const b = bestRationalApprox(S_tri_0, 5000);
        return `${b.p}/${b.q}`;
      })(),
      'best_rational_shift_1_q<=5000': (() => {
        const b = bestRationalApprox(S_tri_1, 5000);
        return `${b.p}/${b.q}`;
      })(),
    },
    {
      family: 'cubic_n3+6n2+5n_start_n=2',
      terms_used: poly.length,
      partial_sum_shift_0: Number(S_poly_0.toPrecision(14)),
      partial_sum_shift_12: Number(S_poly_12.toPrecision(14)),
      'best_rational_shift_0_q<=5000': (() => {
        const b = bestRationalApprox(S_poly_0, 5000);
        return `${b.p}/${b.q}`;
      })(),
      'best_rational_shift_12_q<=5000': (() => {
        const b = bestRationalApprox(S_poly_12, 5000);
        return `${b.p}/${b.q}`;
      })(),
    },
  ];

  const growthRows = [
    { family: 'triangular', n: 2000, root_n: Number((((2000 * 1999) / 2) ** (1 / 2000)).toFixed(6)) },
    { family: 'cubic_shifted', n: 2000, root_n: Number(((2000 ** 3 + 6 * 2000 ** 2 + 5 * 2000) ** (1 / 2000)).toFixed(6)) },
    { family: 'double_exponential_model_2^(2^n)', n: 10, root_n: Number(((2 ** (2 ** 10)) ** (1 / 10)).toExponential(6)) },
  ];

  out.results.ep265 = {
    description: 'Finite partial-sum and growth profiles for canonical constructions related to dual-shift rationality phenomena.',
    rows,
    growth_rows: growthRows,
  };
}

const outPath = path.join('data', 'harder_batch8_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
