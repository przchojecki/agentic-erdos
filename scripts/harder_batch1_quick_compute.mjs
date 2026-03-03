#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for first 10 "harder" problems:
// EP-1,3,5,9,12,15,17,20,28,30.

function chooseBigInt(n, k) {
  let kk = k;
  if (kk > n - kk) kk = n - kk;
  let num = 1n;
  let den = 1n;
  for (let i = 1; i <= kk; i += 1) {
    num *= BigInt(n - kk + i);
    den *= BigInt(i);
  }
  return num / den;
}

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

function nthPrimeUpper(n) {
  if (n < 6) return 20;
  const nn = n;
  return Math.ceil(nn * (Math.log(nn) + Math.log(Math.log(nn)) + 1));
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

function quantile(sortedVals, q) {
  if (sortedVals.length === 0) return null;
  const idx = Math.min(sortedVals.length - 1, Math.max(0, Math.floor(q * (sortedVals.length - 1))));
  return sortedVals[idx];
}

function bitCount(x) {
  let v = x >>> 0;
  let c = 0;
  while (v) {
    v &= v - 1;
    c += 1;
  }
  return c;
}

function allSubsetsOfSize(U, m) {
  const out = [];
  function rec(start, left, mask) {
    if (left === 0) {
      out.push(mask);
      return;
    }
    for (let x = start; x <= U - left + 1; x += 1) {
      rec(x + 1, left - 1, mask | (1 << (x - 1)));
    }
  }
  rec(1, m, 0);
  return out;
}

function candCreates3Sunflower(cand, family) {
  for (let i = 0; i < family.length; i += 1) {
    const a = family[i];
    const core = a & cand;
    for (let j = i + 1; j < family.length; j += 1) {
      const b = family[j];
      if ((a & b) !== core) continue;
      if ((b & cand) !== core) continue;
      return true;
    }
  }
  return false;
}

function greedyMaximalSidonSize(N, rng) {
  const order = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(order, rng);

  const A = [];
  const sums = new Uint8Array(2 * N + 1);
  for (const x of order) {
    let ok = sums[2 * x] === 0;
    if (ok) {
      for (const a of A) {
        if (sums[a + x]) {
          ok = false;
          break;
        }
      }
    }
    if (!ok) continue;
    sums[2 * x] = 1;
    for (const a of A) sums[a + x] = 1;
    A.push(x);
  }
  return A.length;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-1: central binomial lower bound scale.
{
  const nList = [8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];
  const rows = [];
  for (const n of nList) {
    const c = chooseBigInt(n, Math.floor(n / 2));
    const cNum = Number(c);
    const ratioTo2n = cNum / 2 ** n;
    rows.push({
      n,
      lower_bound_binom_central: c.toString(),
      ratio_binom_over_2pow_n: Number(ratioTo2n.toFixed(8)),
      scaled_ratio_times_sqrt_n: Number((ratioTo2n * Math.sqrt(n)).toFixed(8)),
    });
  }
  out.results.ep1 = {
    description: 'Central-binomial lower bound profile against 2^n scale.',
    rows,
  };
}

// Global sieve for EP-5 / EP-15 and shared primality checks.
const EP15_N_MAX = 1000000;
let sieveLimit = nthPrimeUpper(EP15_N_MAX + 2);
let sieveData = sieve(sieveLimit);
while (sieveData.primes.length < EP15_N_MAX + 2) {
  sieveLimit *= 2;
  sieveData = sieve(sieveLimit);
}

// EP-3: simple greedy 3-AP-free sequence growth and harmonic sum.
{
  const NList = [1000, 3000, 10000, 30000, 100000];
  const rows = [];
  for (const N of NList) {
    const inSet = new Uint8Array(N + 1);
    const A = [];
    let harmonic = 0;
    for (let n = 1; n <= N; n += 1) {
      let ok = true;
      for (let i = 0; i < A.length; i += 1) {
        const y = A[i];
        const x = 2 * y - n;
        if (x > 0 && inSet[x]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      inSet[n] = 1;
      A.push(n);
      harmonic += 1 / n;
    }
    rows.push({
      N,
      greedy_3ap_free_size: A.length,
      size_over_sqrtN: Number((A.length / Math.sqrt(N)).toFixed(6)),
      harmonic_sum_over_set: Number(harmonic.toFixed(6)),
    });
  }
  out.results.ep3 = {
    description: 'Ascending greedy 3-AP-free set profile (finite proxy only).',
    rows,
  };
}

// EP-5: normalized prime gap finite profile.
{
  const N_PRIMES = 400000;
  const vals = [];
  const binW = 0.25;
  const bins = new Uint8Array(Math.floor(10 / binW));
  let minVal = Infinity;
  let maxVal = -Infinity;
  let argMax = null;
  for (let n = 2; n <= N_PRIMES; n += 1) {
    const g = (sieveData.primes[n] - sieveData.primes[n - 1]) / Math.log(n);
    if (g < minVal) minVal = g;
    if (g > maxVal) {
      maxVal = g;
      argMax = n;
    }
    vals.push(g);
    if (g >= 0 && g < 10) bins[Math.floor(g / binW)] = 1;
  }
  vals.sort((a, b) => a - b);
  out.results.ep5 = {
    description: 'Normalized prime-gap empirical distribution for first 4e5 prime indices.',
    n_primes_used: N_PRIMES,
    min_value: Number(minVal.toFixed(6)),
    max_value: Number(maxVal.toFixed(6)),
    argmax_index_n: argMax,
    q05: Number(quantile(vals, 0.05).toFixed(6)),
    q50: Number(quantile(vals, 0.5).toFixed(6)),
    q95: Number(quantile(vals, 0.95).toFixed(6)),
    occupied_bins_in_0_10_step_0_25: bins.reduce((s, x) => s + x, 0),
    total_bins_in_0_10_step_0_25: bins.length,
  };
}

// EP-9: odd numbers not representable as p + 2^a + 2^b.
{
  const N = 1000000;
  const pows = [];
  for (let v = 1; v <= N; v *= 2) pows.push(v);
  const sumSet = new Set();
  for (let i = 0; i < pows.length; i += 1) {
    for (let j = i; j < pows.length; j += 1) {
      const s = pows[i] + pows[j];
      if (s <= N) sumSet.add(s);
    }
  }
  const sums = [...sumSet].sort((a, b) => a - b);

  let exceptional = 0;
  let oddCount = 0;
  const cpTargets = [100000, 200000, 400000, 600000, 800000, 1000000];
  const cp = [];
  let tIdx = 0;

  for (let n = 1; n <= N; n += 2) {
    oddCount += 1;
    let ok = false;
    for (let i = 0; i < sums.length; i += 1) {
      const s = sums[i];
      if (s > n - 2) break;
      if (sieveData.isPrime[n - s]) {
        ok = true;
        break;
      }
    }
    if (!ok) exceptional += 1;
    while (tIdx < cpTargets.length && n >= cpTargets[tIdx]) {
      cp.push({
        N: cpTargets[tIdx],
        exceptional_odds: exceptional,
        odd_count: Math.floor((cpTargets[tIdx] + 1) / 2),
        exceptional_density_among_odds: Number((exceptional / Math.floor((cpTargets[tIdx] + 1) / 2)).toFixed(6)),
      });
      tIdx += 1;
    }
  }
  while (tIdx < cpTargets.length) {
    const tgt = cpTargets[tIdx];
    cp.push({
      N: tgt,
      exceptional_odds: exceptional,
      odd_count: Math.floor((tgt + 1) / 2),
      exceptional_density_among_odds: Number((exceptional / Math.floor((tgt + 1) / 2)).toFixed(6)),
    });
    tIdx += 1;
  }

  out.results.ep9 = {
    description: 'Finite scan of exceptional odd integers for p + 2^a + 2^b up to 1e6.',
    N_max: N,
    exceptional_odds: exceptional,
    odd_count: oddCount,
    exceptional_density_among_odds: Number((exceptional / oddCount).toFixed(6)),
    checkpoints: cp,
  };
}

// EP-12: profile of the classical p^2, p = 3 mod 4 construction.
{
  const NList = [10000, 100000, 1000000, 10000000, 100000000];
  const pMod4eq3 = sieveData.primes.filter((p) => p <= 10000 && p % 4 === 3);
  const seq = pMod4eq3.map((p) => p * p).sort((a, b) => a - b);

  const rows = [];
  let ptr = 0;
  let harmonic = 0;
  for (const N of NList) {
    while (ptr < seq.length && seq[ptr] <= N) {
      harmonic += 1 / seq[ptr];
      ptr += 1;
    }
    rows.push({
      N,
      count: ptr,
      count_times_logN_over_sqrtN: Number((ptr * Math.log(N) / Math.sqrt(N)).toFixed(6)),
      reciprocal_sum_partial: Number(harmonic.toFixed(8)),
    });
  }

  const M = Math.min(120, seq.length);
  let violation = null;
  for (let i = 0; i < M && !violation; i += 1) {
    const a = seq[i];
    for (let j = i + 1; j < M && !violation; j += 1) {
      for (let k = j + 1; k < M; k += 1) {
        if ((seq[j] + seq[k]) % a === 0) {
          violation = { a, b: seq[j], c: seq[k] };
          break;
        }
      }
    }
  }

  out.results.ep12 = {
    description: 'Classical p^2 (p = 3 mod 4) construction profile and local property check.',
    rows,
    local_property_check_first_terms: {
      checked_terms: M,
      found_violation_a_divides_b_plus_c: violation !== null,
      witness_if_any: violation,
    },
  };
}

// EP-15: alternating prime series partial sums.
{
  const cpSet = new Set([1000, 10000, 100000, 500000, 1000000]);
  const checkpoints = [];
  let s = 0;
  let sMin = 0;
  let sMax = 0;
  let argMin = 0;
  let argMax = 0;
  for (let n = 1; n <= EP15_N_MAX; n += 1) {
    const term = ((n & 1) ? -1 : 1) * (n / sieveData.primes[n - 1]);
    s += term;
    if (s < sMin) {
      sMin = s;
      argMin = n;
    }
    if (s > sMax) {
      sMax = s;
      argMax = n;
    }
    if (cpSet.has(n)) checkpoints.push({ n, partial_sum: Number(s.toFixed(10)) });
  }
  out.results.ep15 = {
    description: 'Partial sums of sum (-1)^n n / p_n up to n=1e6.',
    n_max: EP15_N_MAX,
    partial_sum_at_n_max: Number(s.toFixed(12)),
    min_partial_sum: Number(sMin.toFixed(12)),
    argmin_n: argMin,
    max_partial_sum: Number(sMax.toFixed(12)),
    argmax_n: argMax,
    checkpoints,
  };
}

// EP-17: cluster-prime scan.
{
  const P_MAX = 200000;
  const primes = [];
  for (const p of sieveData.primes) {
    if (p > P_MAX) break;
    primes.push(p);
  }
  const canDiff = new Uint8Array(P_MAX + 1);
  const clusterPrimes = [];
  const pref = [];
  for (const p of primes) {
    for (const q of pref) {
      canDiff[p - q] = 1;
    }
    pref.push(p);
    let ok = true;
    for (let n = 2; n <= p - 3; n += 2) {
      if (!canDiff[n]) {
        ok = false;
        break;
      }
    }
    if (ok) clusterPrimes.push(p);
  }
  out.results.ep17 = {
    description: 'Finite scan for cluster primes up to 2e5.',
    p_max: P_MAX,
    cluster_primes_count: clusterPrimes.length,
    largest_cluster_prime_found: clusterPrimes.length ? clusterPrimes[clusterPrimes.length - 1] : null,
    first_cluster_primes: clusterPrimes.slice(0, 50),
    last_cluster_primes: clusterPrimes.slice(-25),
  };
}

// EP-20: random greedy sunflower-free families (k=3), small n-uniform regimes.
{
  const rng = makeRng(20260303);
  const rows = [];
  const mList = [3, 4, 5];
  for (const m of mList) {
    const U = 2 * m + 6;
    const all = allSubsetsOfSize(U, m);
    const trials = 60;
    let best = 0;
    let sum = 0;
    for (let t = 0; t < trials; t += 1) {
      const order = all.slice();
      shuffle(order, rng);
      const fam = [];
      for (const s of order) {
        if (!candCreates3Sunflower(s, fam)) fam.push(s);
      }
      if (fam.length > best) best = fam.length;
      sum += fam.length;
    }
    rows.push({
      m,
      universe_size: U,
      candidate_sets_total: all.length,
      trials,
      best_family_size_found: best,
      avg_family_size: Number((sum / trials).toFixed(4)),
      best_size_to_the_1_over_m: Number((best ** (1 / m)).toFixed(6)),
    });
  }
  out.results.ep20 = {
    description: 'Small-scale random greedy profile for 3-sunflower-free m-uniform families.',
    rows,
  };
}

// EP-28: near-cover random additive-basis proxies and max representation counts.
{
  const rng = makeRng(28032026);
  const NList = [500, 1000, 2000];
  const densities = [0.1, 0.13, 0.16, 0.2, 0.24];
  const trials = 60;
  const rows = [];

  for (const N of NList) {
    let bestCoverage = 0;
    let minMax99 = null;
    let minMax995 = null;
    for (const d of densities) {
      for (let t = 0; t < trials; t += 1) {
        const A = [];
        for (let x = 1; x <= N; x += 1) {
          if (rng() < d) A.push(x);
        }
        if (A.length < 2) continue;
        const r = new Uint16Array(2 * N + 1);
        for (let i = 0; i < A.length; i += 1) {
          const ai = A[i];
          for (let j = 0; j < A.length; j += 1) {
            r[ai + A[j]] += 1;
          }
        }
        let covered = 0;
        let maxR = 0;
        for (let s = 2; s <= 2 * N; s += 1) {
          if (r[s] > 0) covered += 1;
          if (r[s] > maxR) maxR = r[s];
        }
        const cov = covered / (2 * N - 1);
        if (cov > bestCoverage) bestCoverage = cov;
        if (cov >= 0.99 && (minMax99 === null || maxR < minMax99)) minMax99 = maxR;
        if (cov >= 0.995 && (minMax995 === null || maxR < minMax995)) minMax995 = maxR;
      }
    }
    rows.push({
      N,
      densities,
      trials_per_density: trials,
      best_coverage_found: Number(bestCoverage.toFixed(6)),
      min_observed_max_rep_if_coverage_ge_0_99: minMax99,
      min_observed_max_rep_if_coverage_ge_0_995: minMax995,
    });
  }

  out.results.ep28 = {
    description: 'Random finite proxies: near-full sumset coverage versus peak representation multiplicity.',
    rows,
  };
}

// EP-30: random greedy Sidon constructions and scale comparison.
{
  const rng = makeRng(30032026);
  const NList = [500, 1000, 2000, 5000, 10000];
  const trials = 300;
  const rows = [];
  for (const N of NList) {
    let best = 0;
    let worst = 1e9;
    let sum = 0;
    for (let t = 0; t < trials; t += 1) {
      const s = greedyMaximalSidonSize(N, rng);
      if (s > best) best = s;
      if (s < worst) worst = s;
      sum += s;
    }
    const avg = sum / trials;
    const sqrtN = Math.sqrt(N);
    const refinedUpper = sqrtN + 0.98183 * N ** 0.25;
    rows.push({
      N,
      trials,
      min_size_found: worst,
      avg_size_found: Number(avg.toFixed(4)),
      max_size_found: best,
      max_minus_sqrtN: Number((best - sqrtN).toFixed(6)),
      refined_upper_sqrt_plus_0_98183_N_quarter: Number(refinedUpper.toFixed(6)),
      refined_upper_minus_max_found: Number((refinedUpper - best).toFixed(6)),
    });
  }
  const singerLikeRows = [31, 61, 127, 251, 509].map((q) => {
    const N = q * q + q + 1;
    const size = q + 1;
    return {
      q_prime: q,
      N_q2_plus_q_plus_1: N,
      lower_bound_size_q_plus_1: size,
      ratio_over_sqrtN: Number((size / Math.sqrt(N)).toFixed(6)),
      lower_bound_minus_sqrtN: Number((size - Math.sqrt(N)).toFixed(6)),
    };
  });
  out.results.ep30 = {
    description: 'Random greedy Sidon lower-bound profile against sqrt(N) and refined N^(1/4) correction scale.',
    rows,
    structured_prime_power_family_profile: singerLikeRows,
  };
}

const outPath = path.join('data', 'harder_batch1_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
