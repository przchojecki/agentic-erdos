#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep872_standalone_deeper.json';
const EXACT_N = [10, 12, 14, 16, 18, 20, 22];
const HEUR_N = [30, 40, 50, 70];
const HEUR_TRIALS = 120;

function makeRng(seed = 872_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function primeCount(n) {
  let c = 0;
  for (let x = 2; x <= n; x += 1) {
    let p = true;
    for (let d = 2; d * d <= x; d += 1) if (x % d === 0) p = false;
    if (p) c += 1;
  }
  return c;
}

function buildIncompat(n) {
  const vals = Array.from({ length: n - 1 }, (_, i) => i + 2);
  const m = vals.length;
  const incompat = Array.from({ length: m }, () => 0n);
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < m; j += 1) {
      if (i === j) continue;
      const a = vals[i], b = vals[j];
      if (a % b === 0 || b % a === 0) incompat[i] |= 1n << BigInt(j);
    }
  }
  return { vals, incompat };
}

function solveExact(n, longStarts) {
  const { incompat } = buildIncompat(n);
  const m = n - 1;
  const memoLong = new Map();
  const memoShort = new Map();

  function dfs(mask, longTurn) {
    const memo = longTurn ? memoLong : memoShort;
    if (memo.has(mask)) return memo.get(mask);
    const legal = [];
    for (let i = 0; i < m; i += 1) {
      const bit = 1n << BigInt(i);
      if (mask & bit) continue;
      if (mask & incompat[i]) continue;
      legal.push(i);
    }
    if (legal.length === 0) {
      memo.set(mask, 0);
      return 0;
    }
    let best = longTurn ? -1 : 1e9;
    for (const i of legal) {
      const v = 1 + dfs(mask | (1n << BigInt(i)), !longTurn);
      if (longTurn) best = Math.max(best, v);
      else best = Math.min(best, v);
    }
    memo.set(mask, best);
    return best;
  }
  return dfs(0n, longStarts);
}

function heuristicLength(n, longStarts) {
  const vals = Array.from({ length: n - 1 }, (_, i) => i + 2);
  const used = new Uint8Array(vals.length);
  let len = 0;
  let longTurn = longStarts;
  while (true) {
    const legal = [];
    for (let i = 0; i < vals.length; i += 1) {
      if (used[i]) continue;
      let ok = true;
      for (let j = 0; j < vals.length; j += 1) {
        if (!used[j]) continue;
        const a = vals[i], b = vals[j];
        if (a % b === 0 || b % a === 0) {
          ok = false;
          break;
        }
      }
      if (ok) legal.push(i);
    }
    if (legal.length === 0) break;
    // long player tends to pick small numbers; short player tends to block with highly divisible numbers.
    legal.sort((i, j) => vals[i] - vals[j]);
    let pick;
    if (longTurn) pick = legal[Math.floor(rng() * Math.min(5, legal.length))];
    else pick = legal[legal.length - 1 - Math.floor(rng() * Math.min(5, legal.length))];
    used[pick] = 1;
    len += 1;
    longTurn = !longTurn;
  }
  return len;
}

const t0 = Date.now();
const exact_rows = [];
for (const n of EXACT_N) {
  const lf = solveExact(n, true);
  const sf = solveExact(n, false);
  exact_rows.push({
    n,
    optimal_length_long_player_starts: lf,
    optimal_length_short_player_starts: sf,
    pi_n: primeCount(n),
    over_n_long_starts: Number((lf / n).toPrecision(8)),
  });
}

const heuristic_rows = [];
for (const n of HEUR_N) {
  let bestLong = 0;
  let avgLong = 0;
  for (let t = 0; t < HEUR_TRIALS; t += 1) {
    const v = heuristicLength(n, true);
    if (v > bestLong) bestLong = v;
    avgLong += v;
  }
  avgLong /= HEUR_TRIALS;
  heuristic_rows.push({
    n,
    trials: HEUR_TRIALS,
    heuristic_best_length_long_starts: bestLong,
    heuristic_avg_length_long_starts: Number(avgLong.toPrecision(8)),
    heuristic_best_over_n: Number((bestLong / n).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-872',
  script: 'ep872.mjs',
  method: 'exact_small_n_minimax_and_larger_n_heuristic_profile_for_divisibility_game',
  params: { EXACT_N, HEUR_N, HEUR_TRIALS },
  exact_rows,
  heuristic_rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
