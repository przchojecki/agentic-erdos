#!/usr/bin/env node

// EP-1 standalone computation:
// A subset A subset [1..N] has distinct subset sums iff
// (S) and (S+A) are disjoint at each insertion step (S = reachable sums).

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function exactMaxDistinctSubsetSums(N) {
  let bestSize = 0;
  let bestSet = [];

  function dfs(next, sumsBits, chosen) {
    if (chosen.length + (N - next + 1) <= bestSize) return;

    if (chosen.length > bestSize) {
      bestSize = chosen.length;
      bestSet = chosen.slice();
    }

    for (let x = next; x <= N; x += 1) {
      const shifted = sumsBits << BigInt(x);
      if ((sumsBits & shifted) !== 0n) continue;
      chosen.push(x);
      dfs(x + 1, sumsBits | shifted, chosen);
      chosen.pop();
    }
  }

  dfs(1, 1n, []);
  return { N, bestSize, witness_set: bestSet };
}

function randomizedLowerBound(N, trials, rand) {
  let bestSet = [];
  for (let t = 0; t < trials; t += 1) {
    const order = Array.from({ length: N }, (_, i) => i + 1);
    shuffle(order, rand);
    let bits = 1n;
    const chosen = [];
    for (const x of order) {
      const shifted = bits << BigInt(x);
      if ((bits & shifted) !== 0n) continue;
      bits |= shifted;
      chosen.push(x);
    }
    if (chosen.length > bestSet.length) bestSet = chosen.slice();
  }
  return { N, bestSizeFound: bestSet.length, witness_set: bestSet.sort((a, b) => a - b) };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const exactMaxN = Number(process.env.EXACT_MAX_N || (depth >= 4 ? 70 : 55));
  const randomMaxN = Number(process.env.RANDOM_MAX_N || (depth >= 4 ? 500 : 250));
  const randomStep = Number(process.env.RANDOM_STEP || 25);
  const randomTrials = Number(process.env.RANDOM_TRIALS || (depth >= 4 ? 8000 : 1500));
  const rand = makeRng(0x1eedf00d ^ (depth * 911));

  const exactRows = [];
  for (let N = 8; N <= exactMaxN; N += 1) {
    const r = exactMaxDistinctSubsetSums(N);
    exactRows.push({
      N: r.N,
      max_cardinality: r.bestSize,
      log2_N: Number(Math.log2(N).toFixed(6)),
      max_minus_floor_log2N_plus1: r.bestSize - (Math.floor(Math.log2(N)) + 1),
      witness_set: r.witness_set,
    });
  }

  const randomRows = [];
  for (let N = Math.max(exactMaxN + randomStep, randomStep); N <= randomMaxN; N += randomStep) {
    const r = randomizedLowerBound(N, randomTrials, rand);
    randomRows.push({
      N: r.N,
      randomized_lower_bound_cardinality: r.bestSizeFound,
      floor_log2N_plus1: Math.floor(Math.log2(N)) + 1,
      gap_over_power2_construction: r.bestSizeFound - (Math.floor(Math.log2(N)) + 1),
      witness_set_sample_prefix: r.witness_set.slice(0, 16),
    });
  }

  const payload = {
    problem: 'EP-1',
    script: 'ep1.mjs',
    method: 'exact_branch_and_bound_for_small_N_plus_large_N_randomized_construction_search',
    warning: 'Computational evidence only; does not prove asymptotic N >> 2^n.',
    params: { depth, exactMaxN, randomMaxN, randomStep, randomTrials },
    exact_rows: exactRows,
    random_rows: randomRows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
