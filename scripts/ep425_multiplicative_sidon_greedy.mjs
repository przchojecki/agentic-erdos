#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_LIST = (process.env.N_LIST || '200,400,600,800,1000,1500,2000,2500,3000').split(',').map((x) => Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 80);

function sievePi(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i <= n; i++) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const pi = new Int32Array(n + 1);
  let c = 0;
  for (let i = 0; i <= n; i++) {
    if (isPrime[i]) c++;
    pi[i] = c;
  }
  return pi;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function greedySet(n, order) {
  const chosen = [];
  const usedProducts = new Set();
  for (const x of order) {
    let ok = true;
    const prods = [];
    for (const y of chosen) {
      const p = x * y;
      if (usedProducts.has(p)) {
        ok = false;
        break;
      }
      prods.push(p);
    }
    if (!ok) continue;
    chosen.push(x);
    for (const p of prods) usedProducts.add(p);
  }
  return chosen;
}

const maxN = Math.max(...N_LIST);
const pi = sievePi(maxN + 5);
const rows = [];

for (const n of N_LIST) {
  let best = [];

  // baseline order: primes first desc, then composites desc
  const primes = [];
  const comps = [];
  for (let x = n; x >= 1; x--) {
    if (pi[x] !== pi[x - 1]) primes.push(x);
    else comps.push(x);
  }
  const base = [...primes, ...comps];
  best = greedySet(n, base);

  const pool = Array.from({ length: n }, (_, i) => i + 1);
  for (let t = 0; t < TRIALS; t++) {
    const ord = pool.slice();
    shuffle(ord);
    const cur = greedySet(n, ord);
    if (cur.length > best.length) best = cur;
  }

  const delta = best.length - pi[n];
  const scale = (Math.pow(n, 0.75) / Math.pow(Math.log(n), 1.5));
  rows.push({
    n,
    pi_n: pi[n],
    best_greedy_size: best.length,
    delta_over_pi: delta,
    scaled_constant_estimate: Number((delta / scale).toFixed(6)),
    sample_best_prefix: best.slice(0, 20),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  trials_per_n: TRIALS,
  n_list: N_LIST,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep425_multiplicative_sidon_greedy.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, trials: TRIALS }, null, 2));
