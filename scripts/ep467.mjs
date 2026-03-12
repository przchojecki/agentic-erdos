#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(n) {
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

function tryInstance(X, attempts, rnd) {
  const primes = sievePrimes(X);
  for (let at = 0; at < attempts; at += 1) {
    const a = new Map();
    for (const p of primes) a.set(p, Math.floor(rnd() * p));

    const cover = Array.from({ length: X }, () => []);
    for (let i = 0; i < primes.length; i += 1) {
      const p = primes[i];
      const r = a.get(p);
      for (let n = r; n < X; n += p) cover[n].push(i);
    }

    let bad = false;
    for (let n = 0; n < X; n += 1) if (cover[n].length < 2) { bad = true; break; }
    if (bad) continue;

    const color = new Int8Array(primes.length);
    for (let i = 0; i < primes.length; i += 1) color[i] = rnd() < 0.5 ? 0 : 1;

    for (let iter = 0; iter < 2500; iter += 1) {
      let conflicts = 0;
      const contrib = new Int32Array(primes.length);

      for (let n = 0; n < X; n += 1) {
        let c0 = 0, c1 = 0;
        for (const idx of cover[n]) {
          if (color[idx] === 0) c0 += 1;
          else c1 += 1;
        }
        if (c0 === 0 || c1 === 0) {
          conflicts += 1;
          for (const idx of cover[n]) contrib[idx] += 1;
        }
      }

      if (conflicts === 0) {
        const cnt0 = color.reduce((s, v) => s + (v === 0 ? 1 : 0), 0);
        const cnt1 = color.length - cnt0;
        if (cnt0 > 0 && cnt1 > 0) {
          return {
            found: true,
            X,
            prime_count: primes.length,
            attempts_used: at + 1,
            color_sizes: { A: cnt0, B: cnt1 },
          };
        }
      }

      let best = -1;
      let pick = -1;
      for (let i = 0; i < contrib.length; i += 1) {
        if (contrib[i] > best) {
          best = contrib[i];
          pick = i;
        }
      }
      if (pick < 0) break;
      color[pick] = 1 - color[pick];
    }
  }

  return { found: false, X, prime_count: sievePrimes(X).length, attempts_used: attempts };
}

const X_LIST = (process.env.X_LIST || '60,80,100,120,150,180').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const ATTEMPTS = Number(process.env.ATTEMPTS || 120);
const OUT = process.env.OUT || '';
const rnd = rng(20260312 ^ 467);

const rows = X_LIST.map((X) => tryInstance(X, ATTEMPTS, rnd));

const out = {
  problem: 'EP-467',
  script: path.basename(process.argv[1]),
  method: 'finite_random_sat_search_for_quantified_congruence_partition_instance',
  params: { X_LIST, ATTEMPTS },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
