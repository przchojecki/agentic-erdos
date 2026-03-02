#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-10 finite probe:
// coverage of n as prime + at most k powers of 2 (powers may repeat).

const N_MAX = Number(process.env.N_MAX || 400000);
const K_LIST = (process.env.K_LIST || '1,2,3,4').split(',').map((x) => Number(x.trim())).filter((x) => x >= 1);

function sievePrime(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  }
  return isPrime;
}

const isPrime = sievePrime(N_MAX);
const primes = [];
for (let i = 2; i <= N_MAX; i++) if (isPrime[i]) primes.push(i);

const powers = [];
for (let p = 1; p <= N_MAX; p <<= 1) powers.push(p);

function sumsAtMostK(k) {
  let cur = new Set([0]);
  for (let step = 1; step <= k; step++) {
    const next = new Set(cur);
    for (const s of cur) {
      for (const p of powers) {
        const v = s + p;
        if (v > N_MAX) break;
        next.add(v);
      }
    }
    cur = next;
  }
  return [...cur].sort((a, b) => a - b);
}

const rows = [];
for (const k of K_LIST) {
  const sums = sumsAtMostK(k);
  const can = new Uint8Array(N_MAX + 1);
  for (const s of sums) {
    for (const p of primes) {
      const v = p + s;
      if (v > N_MAX) break;
      can[v] = 1;
    }
  }
  let covered = 0;
  const firstMiss = [];
  for (let n = 1; n <= N_MAX; n++) {
    if (can[n]) covered++;
    else if (firstMiss.length < 40) firstMiss.push(n);
  }
  rows.push({
    k,
    n_max: N_MAX,
    distinct_power_sums_count: sums.length,
    covered_count: covered,
    covered_ratio: Number((covered / N_MAX).toFixed(6)),
    first_missing: firstMiss,
  });
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  k_list: K_LIST,
  powers_count: powers.length,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep10_prime_plus_pow2_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, n_max: N_MAX }, null, 2));
