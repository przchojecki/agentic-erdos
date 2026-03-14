#!/usr/bin/env node
import fs from 'fs';

// EP-866 finite proxy:
// For A subset [1..2N], test existence of k distinct b_i in [1..N]
// with all pairwise sums in A.
const OUT = process.env.OUT || 'data/ep866_standalone_deeper.json';
const CASES = [
  [4, 40, 80],
  [4, 60, 80],
  [5, 40, 60],
  [5, 60, 60],
];

function makeRng(seed = 866_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function hasKPairwiseSumPattern(Aset, N, k) {
  const adj = Array.from({ length: N + 1 }, () => []);
  for (let i = 1; i <= N; i += 1) {
    for (let j = i + 1; j <= N; j += 1) if (Aset.has(i + j)) adj[i].push(j);
  }
  const chosen = [];
  function canAdd(v) {
    for (const u of chosen) {
      const a = Math.min(u, v), b = Math.max(u, v);
      if (!Aset.has(a + b)) return false;
    }
    return true;
  }
  function dfs(start) {
    if (chosen.length >= k) return true;
    for (let v = start; v <= N; v += 1) {
      if (!canAdd(v)) continue;
      chosen.push(v);
      if (dfs(v + 1)) return true;
      chosen.pop();
    }
    return false;
  }
  return dfs(1);
}

function randomSet(size, maxV) {
  const arr = Array.from({ length: maxV }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return new Set(arr.slice(0, size));
}

function finiteLowerBoundG(k, N, trials) {
  // Try to find large A with no k-pattern, which gives lower bounds on g_k(N).
  let bestNoPatternSize = 0;

  // Deterministic parity baseline.
  const oddSet = new Set();
  for (let x = 1; x <= 2 * N; x += 2) oddSet.add(x);
  if (!hasKPairwiseSumPattern(oddSet, N, k)) bestNoPatternSize = Math.max(bestNoPatternSize, oddSet.size);

  // Start from odd set and greedily add elements if pattern-free.
  const evenVals = Array.from({ length: N }, (_, i) => 2 * (i + 1));
  for (let t = 0; t < Math.max(8, Math.floor(trials / 4)); t += 1) {
    const A = new Set(oddSet);
    // shuffle even candidates
    for (let i = evenVals.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = evenVals[i];
      evenVals[i] = evenVals[j];
      evenVals[j] = tmp;
    }
    for (const e of evenVals) {
      A.add(e);
      if (hasKPairwiseSumPattern(A, N, k)) A.delete(e);
    }
    if (A.size > bestNoPatternSize) bestNoPatternSize = A.size;
  }

  for (let t = 0; t < trials; t += 1) {
    let lo = N;
    let hi = 2 * N;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      const A = randomSet(mid, 2 * N);
      if (!hasKPairwiseSumPattern(A, N, k)) lo = mid;
      else hi = mid - 1;
    }
    if (lo > bestNoPatternSize) bestNoPatternSize = lo;
  }
  return {
    k,
    N,
    trials,
    best_no_pattern_set_size_found: bestNoPatternSize,
    implied_finite_lower_bound_on_gkN: bestNoPatternSize - N + 1,
  };
}

const t0 = Date.now();
const rows = CASES.map(([k, N, trials]) => finiteLowerBoundG(k, N, trials));
const out = {
  problem: 'EP-866',
  script: 'ep866.mjs',
  method: 'finite_random_search_for_pattern-free_sets_giving_lower_bounds_on_gkN',
  warning: 'Finite randomized lower-bound proxy only.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
