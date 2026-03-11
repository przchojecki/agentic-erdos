#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const ps = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) ps.push(i);
  return ps;
}

function distinctPrimeFactorsCountOfPairSums(A, primes) {
  const used = new Set();
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i + 1; j < A.length; j += 1) {
      let x = A[i] + A[j];
      for (const p of primes) {
        if (p * p > x) break;
        if (x % p === 0) {
          used.add(p);
          while (x % p === 0) x /= p;
        }
      }
      if (x > 1) used.add(x);
    }
  }
  return used.size;
}

function allSubsets(n, k) {
  const out = [];
  const cur = [];
  function rec(start, need) {
    if (need === 0) {
      out.push(cur.slice());
      return;
    }
    for (let v = start; v <= n - need + 1; v += 1) {
      cur.push(v);
      rec(v + 1, need - 1);
      cur.pop();
    }
  }
  rec(1, k);
  return out;
}

function exactMinForRange(k, maxV, primes) {
  const subs = allSubsets(maxV, k);
  let best = Infinity;
  let witness = null;
  for (const A of subs) {
    const v = distinctPrimeFactorsCountOfPairSums(A, primes);
    if (v < best) {
      best = v;
      witness = A;
    }
  }
  return { k, maxV, subsets_checked: subs.length, exact_min_distinct_prime_factors: best, witness_set: witness };
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

function randomSet(k, maxV, rng) {
  const arr = Array.from({ length: maxV }, (_, i) => i + 1);
  for (let i = 0; i < k; i += 1) {
    const j = i + Math.floor(rng() * (maxV - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k).sort((a, b) => a - b);
}

function heuristicMin(k, maxV, trials, seed, primes) {
  const rng = makeRng(seed);
  let best = Infinity;
  let witness = null;
  for (let t = 0; t < trials; t += 1) {
    const A = randomSet(k, maxV, rng);
    const v = distinctPrimeFactorsCountOfPairSums(A, primes);
    if (v < best) {
      best = v;
      witness = A;
    }
  }
  return { k, maxV, trials, heuristic_best_distinct_prime_factors: best, witness_set: witness };
}

const EXACT_CASES = (process.env.EXACT_CASES || '4:16,5:20,6:24').split(',').map((s) => {
  const [k, m] = s.split(':').map((x) => Number(x.trim()));
  return { k, maxV: m };
});
const HEUR_CASES = (process.env.HEUR_CASES || '7:32,8:40,9:48,10:56').split(',').map((s) => {
  const [k, m] = s.split(':').map((x) => Number(x.trim()));
  return { k, maxV: m };
});
const TRIALS = Number(process.env.TRIALS || 9000);
const SEED = Number(process.env.SEED || 12602026);
const OUT = process.env.OUT || '';

const maxSum = 2 * Math.max(...EXACT_CASES.map(c => c.maxV), ...HEUR_CASES.map(c => c.maxV));
const primes = sievePrimes(maxSum + 10);

const exact_rows = EXACT_CASES.map((c) => exactMinForRange(c.k, c.maxV, primes));
const heuristic_rows = HEUR_CASES.map((c, i) => heuristicMin(c.k, c.maxV, TRIALS, SEED ^ (c.k * 409 + i * 17), primes));

const out = {
  problem: 'EP-126',
  script: path.basename(process.argv[1]),
  method: 'distinct_prime_factor_minimization_for_pair_sums',
  params: { EXACT_CASES, HEUR_CASES, TRIALS, SEED },
  exact_rows,
  heuristic_rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
