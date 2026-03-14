#!/usr/bin/env node

// EP-1097 deep standalone computation:
// Maximize number of distinct d such that A contains x, x+d, x+2d.
// Time-budgeted local search with random restarts and swap moves.

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let z = t;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSubset(n, M, rand) {
  const arr = [];
  for (let i = 1; i <= M; i += 1) arr.push(i);
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(rand() * (M - i));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, n).sort((a, b) => a - b);
}

function toBitset(A, M) {
  const b = new Uint8Array(M + 1);
  for (const x of A) b[x] = 1;
  return b;
}

function fromBitset(bit) {
  const out = [];
  for (let i = 1; i < bit.length; i += 1) if (bit[i]) out.push(i);
  return out;
}

function distinctDifferenceCount(bit, M) {
  let cnt = 0;
  for (let d = 1; d * 2 <= M - 1; d += 1) {
    let found = false;
    for (let x = 1; x + 2 * d <= M; x += 1) {
      if (bit[x] && bit[x + d] && bit[x + 2 * d]) {
        found = true;
        break;
      }
    }
    if (found) cnt += 1;
  }
  return cnt;
}

function randomOne(bit, want, rand) {
  const M = bit.length - 1;
  while (true) {
    const x = 1 + Math.floor(rand() * M);
    if (bit[x] === want) return x;
  }
}

function optimizeForN(n, M, budgetMs, rand) {
  const t0 = Date.now();
  let evals = 0;
  let restarts = 0;
  let accepted = 0;

  let globalBest = -1;
  let globalBestSet = null;

  while (Date.now() - t0 < budgetMs) {
    restarts += 1;
    const A0 = randomSubset(n, M, rand);
    const bit = toBitset(A0, M);
    let cur = distinctDifferenceCount(bit, M);
    evals += 1;

    if (cur > globalBest) {
      globalBest = cur;
      globalBestSet = fromBitset(bit);
    }

    // Annealing-like local walk
    let temp = 1.0;
    for (let step = 0; step < 5000; step += 1) {
      if (Date.now() - t0 >= budgetMs) break;

      const outX = randomOne(bit, 1, rand);
      const inX = randomOne(bit, 0, rand);

      bit[outX] = 0;
      bit[inX] = 1;
      const nxt = distinctDifferenceCount(bit, M);
      evals += 1;

      const delta = nxt - cur;
      const accept = delta >= 0 || rand() < Math.exp(delta / Math.max(0.05, temp));
      if (accept) {
        cur = nxt;
        accepted += 1;
        if (cur > globalBest) {
          globalBest = cur;
          globalBestSet = fromBitset(bit);
        }
      } else {
        bit[inX] = 0;
        bit[outX] = 1;
      }

      temp *= 0.9993;
    }
  }

  return {
    n,
    M,
    time_budget_ms: budgetMs,
    best_distinct_d_found: globalBest,
    ratio_over_n_3_over_2: Number((globalBest / Math.pow(n, 1.5)).toFixed(10)),
    ratio_over_n_c_1_77898: Number((globalBest / Math.pow(n, 1.77898)).toFixed(10)),
    ratio_over_n_log_n: Number((globalBest / (n * Math.log(n))).toFixed(10)),
    restarts,
    accepted_moves: accepted,
    objective_evaluations: evals,
    best_set_prefix_40: globalBestSet ? globalBestSet.slice(0, 40) : null,
    elapsed_ms_for_n: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const rows = [];
  const rand = mulberry32(0x1097 ^ (depth * 991));

  const nList = depth >= 4 ? [44, 56, 68, 80] : [28, 36, 44, 56];
  const perNBudgetMs = depth >= 4 ? 30000 : 8000;

  for (const n of nList) {
    const M = 12 * n;
    rows.push(optimizeForN(n, M, perNBudgetMs, rand));
  }

  const payload = {
    problem: 'EP-1097',
    script: 'ep1097.mjs',
    method: 'deep_time_budgeted_local_search_for_many_distinct_three_term_AP_differences',
    warning: 'Finite lower-bound constructions only; no proof of optimal exponent.',
    params: { depth, nList, perNBudgetMs },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
