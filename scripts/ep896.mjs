#!/usr/bin/env node

// EP-896
// For A,B \subseteq {1,...,N}, let F(A,B) be the number of m=ab that have exactly one
// representation with a in A, b in B. This script performs:
// 1) exact exhaustive maxima for small N,
// 2) deeper constructive scans for larger N.

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  if (n >= 2) {
    isPrime.fill(1, 2);
    for (let p = 2; p * p <= n; p += 1) {
      if (!isPrime[p]) continue;
      for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function bitmaskToList(mask, n) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    if (mask & (1 << i)) out.push(i + 1);
  }
  return out;
}

function uniqueProductStats(A, B) {
  const cnt = new Map();
  for (const a of A) {
    for (const b of B) {
      const m = a * b;
      cnt.set(m, (cnt.get(m) || 0) + 1);
    }
  }
  let unique = 0;
  let collisions = 0;
  for (const c of cnt.values()) {
    if (c === 1) unique += 1;
    else collisions += 1;
  }
  return { unique, collisions, distinct_products: cnt.size, pair_count: A.length * B.length };
}

function exactSmallN(N) {
  const lim = 1 << N;
  const listCache = new Array(lim);
  for (let mask = 0; mask < lim; mask += 1) listCache[mask] = bitmaskToList(mask, N);

  let best = -1;
  let bestA = 0;
  let bestB = 0;
  for (let maskA = 1; maskA < lim; maskA += 1) {
    const A = listCache[maskA];
    for (let maskB = 1; maskB < lim; maskB += 1) {
      const B = listCache[maskB];
      const st = uniqueProductStats(A, B);
      if (st.unique > best) {
        best = st.unique;
        bestA = maskA;
        bestB = maskB;
      }
    }
  }
  const A = listCache[bestA];
  const B = listCache[bestB];
  const st = uniqueProductStats(A, B);
  return {
    N,
    exact_max_F: best,
    best_A_size: A.length,
    best_B_size: B.length,
    best_A: A,
    best_B: B,
    best_distinct_products: st.distinct_products,
    best_pair_count: st.pair_count,
    best_collision_bins: st.collisions,
  };
}

function constructionLowerHalfTimesLargePrimes(N, primes) {
  const A = [];
  for (let a = 1; a <= Math.floor(N / 2); a += 1) A.push(a);
  const B = primes.filter((p) => p > Math.floor(N / 2) && p <= N);
  const st = uniqueProductStats(A, B);
  return {
    construction: 'A=[1..floor(N/2)], B=primes in (N/2,N]',
    N,
    A_size: A.length,
    B_size: B.length,
    unique_count: st.unique,
    collision_bins: st.collisions,
    pair_count: st.pair_count,
    ratio_to_N2_over_logN: Number((st.unique / (N * N / Math.log(N))).toFixed(8)),
  };
}

function constructionFullTimesLargePrimes(N, primes) {
  const A = [];
  for (let a = 1; a <= N; a += 1) A.push(a);
  const B = primes.filter((p) => p > Math.floor(N / 2) && p <= N);
  const st = uniqueProductStats(A, B);
  return {
    construction: 'A=[1..N], B=primes in (N/2,N]',
    N,
    A_size: A.length,
    B_size: B.length,
    unique_count: st.unique,
    collision_bins: st.collisions,
    pair_count: st.pair_count,
    ratio_to_N2_over_logN: Number((st.unique / (N * N / Math.log(N))).toFixed(8)),
  };
}

function main() {
  const t0 = Date.now();

  const smallN = [6, 7, 8, 9, 10];
  const exact = smallN.map((N) => exactSmallN(N));

  const deepN = [1000, 2000, 4000, 8000, 12000];
  const maxN = deepN[deepN.length - 1];
  const primes = sievePrimes(maxN);

  const constructive = [];
  for (const N of deepN) {
    const row1 = constructionLowerHalfTimesLargePrimes(N, primes);
    const row2 = constructionFullTimesLargePrimes(N, primes);
    constructive.push(row1, row2);
  }

  const payload = {
    problem: 'EP-896',
    script: 'ep896.mjs',
    method: 'exact_smallN_maximization_plus_deep_constructive_asymptotic_scans',
    warning: 'Finite computations only; asymptotic theorem remains open.',
    params: {
      exact_smallN: smallN,
      deepN,
    },
    exact_smallN_results: exact,
    constructive_results: constructive,
    best_exact_observed: exact.reduce((acc, x) => (x.exact_max_F > acc.exact_max_F ? x : acc), exact[0]),
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
