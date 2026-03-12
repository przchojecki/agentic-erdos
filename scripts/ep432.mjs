#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function sievePrime(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0x100000000;
  };
}

function sampleSet(M, size, rnd) {
  const arr = Array.from({ length: M }, (_, i) => i + 1);
  for (let i = 0; i < size; i += 1) {
    const j = i + Math.floor(rnd() * (M - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, size).sort((a, b) => a - b);
}

function evaluate(A, B, X) {
  const s = new Set();
  for (const a of A) for (const b of B) {
    const v = a + b;
    if (v <= X) s.add(v);
  }
  const vals = [...s].sort((u, v) => u - v);
  for (let i = 0; i < vals.length; i += 1) {
    for (let j = i + 1; j < vals.length; j += 1) {
      if (gcd(vals[i], vals[j]) !== 1) return { ok: false, count: vals.length, vals };
    }
  }
  return { ok: true, count: vals.length, vals };
}

const X = Number(process.env.X || 1200);
const M = Number(process.env.M || 400);
const TRIALS = Number(process.env.TRIALS || 2500);
const OUT = process.env.OUT || '';

const rnd = rng(20260312 ^ 432);
const primes = sievePrime(X + 200);

let best = { count: -1, A: [], B: [], vals: [], tag: '' };
const testCases = [];

// deterministic templates: singleton + prime subset translates
const primeSubset = primes.filter((p) => p <= X - 2).slice(0, 180);
for (const a of [1, 2, 3, 4, 5, 10]) {
  const A = [a];
  const B = primeSubset.map((p) => p - a).filter((b) => b >= 1);
  const ev = evaluate(A, B, X);
  testCases.push({ tag: `singleton_translate_a_${a}`, ok: ev.ok, count: ev.count, density: Number((ev.count / X).toPrecision(8)) });
  if (ev.ok && ev.count > best.count) best = { count: ev.count, A, B, vals: ev.vals, tag: `singleton_translate_a_${a}` };
}

// randomized search over small sizes where feasibility is nontrivial but possible
let feasibleTrials = 0;
for (const [SA, SB] of [[1, 50], [2, 10], [2, 14], [3, 6], [3, 8]]) {
  for (let t = 0; t < TRIALS; t += 1) {
    const A = sampleSet(M, SA, rnd);
    const B = sampleSet(M, SB, rnd);
    const ev = evaluate(A, B, X);
    if (!ev.ok) continue;
    feasibleTrials += 1;
    if (ev.count > best.count) best = { count: ev.count, A, B, vals: ev.vals, tag: `random_${SA}x${SB}` };
  }
}

const out = {
  problem: 'EP-432',
  script: path.basename(process.argv[1]),
  method: 'template_plus_random_search_for_pairwise_coprime_sumset_density',
  params: { X, M, TRIALS },
  tested_templates: testCases,
  feasible_random_trials: feasibleTrials,
  best_source: best.tag,
  best_sumset_size_up_to_X: Math.max(0, best.count),
  best_density_up_to_X: best.count > 0 ? Number((best.count / X).toPrecision(8)) : 0,
  best_A: best.A,
  best_B_first_120: best.B.slice(0, 120),
  best_sumset_first_120: best.vals.slice(0, 120),
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
