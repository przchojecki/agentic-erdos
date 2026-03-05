#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function isPrime(x) {
  if (x < 2) return false;
  if (x % 2 === 0) return x === 2;
  for (let d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
  return true;
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
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const K = Number(process.env.K || 3);
const N = Number(process.env.N || 1200000);
const P_MAX = Number(process.env.P_MAX || 420);
const RESTARTS = Number(process.env.RESTARTS || 360);
const SEED0 = Number(process.env.SEED || 2792026);
const TAIL_START = Number(process.env.TAIL_START || 20000);

const primes = [];
for (let p = 2; p <= P_MAX; p += 1) if (isPrime(p)) primes.push(p);

let best = null;
for (let r = 0; r < RESTARTS; r += 1) {
  const rng = makeRng(SEED0 + 911 * (r + 1));
  const order = primes.slice();
  shuffle(order, rng);

  const covered = new Uint8Array(N + 1);
  let coveredCount = 0;

  for (const p of order) {
    const counts = new Uint32Array(p);
    for (let n = 1; n <= N; n += 1) {
      if (covered[n]) continue;
      const a = n % p;
      if (n >= a + K * p) counts[a] += 1;
    }

    let bestA = 0;
    let bestGain = -1;
    for (let a = 0; a < p; a += 1) {
      if (counts[a] > bestGain) {
        bestGain = counts[a];
        bestA = a;
      }
    }

    if (bestGain > 0) {
      for (let n = 1; n <= N; n += 1) {
        if (covered[n]) continue;
        if (n % p !== bestA) continue;
        if (n < bestA + K * p) continue;
        covered[n] = 1;
        coveredCount += 1;
      }
    }
  }

  const uncoveredCount = N - coveredCount;
  const tailLen = N - TAIL_START + 1;
  let tailCovered = 0;
  for (let n = TAIL_START; n <= N; n += 1) if (covered[n]) tailCovered += 1;

  const row = {
    restart: r + 1,
    covered_count: coveredCount,
    uncovered_count: uncoveredCount,
    covered_ratio: Number((coveredCount / N).toFixed(8)),
    tail_covered_ratio: Number((tailCovered / tailLen).toFixed(8)),
  };

  if (!best || row.uncovered_count < best.uncovered_count) best = row;
}

const out = {
  problem: 'EP-279',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    method: 'randomized_greedy_finite_prefix_cover_with_t_ge_k',
    params: { K, N, P_MAX, RESTARTS, seed: SEED0 },
    prime_count: primes.length,
    best_restart: best,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-279', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
