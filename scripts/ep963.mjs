#!/usr/bin/env node

// EP-963 finite proxy:
// For n-element integer sets, estimate worst-case maximum dissociated subset size.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function isDissociated(arr) {
  let sums = new Set([0]);
  for (const x of arr) {
    const next = new Set();
    for (const s of sums) {
      const a = s - x;
      const b = s;
      const c = s + x;
      if (next.has(a) || next.has(b) || next.has(c)) return false;
      next.add(a);
      next.add(b);
      next.add(c);
    }
    sums = next;
  }
  return true;
}

function maxDissociatedSize(A) {
  const n = A.length;
  let best = 0;
  const chosen = [];

  function dfs(i) {
    if (chosen.length + (n - i) <= best) return;
    if (i === n) {
      if (chosen.length > best) best = chosen.length;
      return;
    }

    // take A[i]
    chosen.push(A[i]);
    if (isDissociated(chosen)) dfs(i + 1);
    chosen.pop();

    // skip
    dfs(i + 1);
  }

  dfs(0);
  return best;
}

function randomSubset(U, n, rng) {
  const arr = Array.from({ length: U }, (_, i) => i + 1);
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(rng() * (U - i));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  arr.length = n;
  arr.sort((a, b) => a - b);
  return arr;
}

function main() {
  const t0 = Date.now();

  const configs = [
    { n: 8, U: 24, trials: 600 },
    { n: 10, U: 30, trials: 500 },
    { n: 12, U: 36, trials: 450 },
    { n: 14, U: 42, trials: 350 },
    { n: 16, U: 48, trials: 280 },
    { n: 18, U: 54, trials: 220 },
    { n: 20, U: 60, trials: 180 },
  ];

  const rows = [];
  const hardExamples = [];

  for (let ci = 0; ci < configs.length; ci += 1) {
    const cfg = configs[ci];
    let bestMin = 1e9;
    let avg = 0;
    let maxSeen = 0;

    for (let t = 0; t < cfg.trials; t += 1) {
      const rng = makeRng((20260314 ^ (ci * 811) ^ (t * 65537) ^ (cfg.n * 97)) >>> 0);
      const A = randomSubset(cfg.U, cfg.n, rng);
      const m = maxDissociatedSize(A);
      avg += m;
      if (m < bestMin) {
        bestMin = m;
        if (hardExamples.length < 12) hardExamples.push({ n: cfg.n, U: cfg.U, A, max_dissociated_size: m });
      }
      if (m > maxSeen) maxSeen = m;
    }

    rows.push({
      ...cfg,
      min_max_dissociated_size_seen: bestMin,
      mean_max_dissociated_size: Number((avg / cfg.trials).toFixed(6)),
      max_max_dissociated_size_seen: maxSeen,
      floor_log2_n: Math.floor(Math.log2(cfg.n)),
      floor_log3_n: Math.floor(Math.log(cfg.n) / Math.log(3)),
    });
  }

  const payload = {
    problem: 'EP-963',
    script: 'ep963.mjs',
    method: 'deep_random_adversarial_search_for_small_dissociated_cores_with_exact_branch_and_bound',
    warning: 'Finite random proxy only; not a proof of universal lower bound for all real sets.',
    rows,
    hard_examples: hardExamples,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
