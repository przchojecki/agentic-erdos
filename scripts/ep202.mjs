#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 7:
// EP-184, EP-188, EP-195, EP-202, EP-208, EP-212, EP-213, EP-222, EP-233, EP-236.

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
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function isPerfectSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

const rng = makeRng(20260303 ^ 709);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-202: disjoint congruence classes packing heuristic.
{
  function bestPacking(N, restarts) {
    let best = 0;

    const moduli = Array.from({ length: N - 1 }, (_, i) => i + 2);
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = [...moduli];
      shuffle(ord, rng);
      const selected = []; // [n,a]
      for (const n of ord) {
        const feasible = [];
        for (let a = 0; a < n; a += 1) {
          let ok = true;
          for (const [m, b] of selected) {
            const g = gcd(n, m);
            if (a % g === b % g) {
              ok = false;
              break;
            }
          }
          if (ok) feasible.push(a);
        }
        if (feasible.length === 0) continue;
        const a = feasible[Math.floor(rng() * feasible.length)];
        selected.push([n, a]);
      }
      if (selected.length > best) best = selected.length;
    }

    return best;
  }

  function gcd(a, b) {
    let x = a;
    let y = b;
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x;
  }

  const rows = [];
  for (const [N, restarts] of [
    [40, 3000],
    [80, 2200],
    [120, 1600],
    [160, 1200],
    [220, 900],
    [300, 700],
  ]) {
    const r = bestPacking(N, restarts);
    const L = Math.exp(Math.sqrt(Math.log(N) * Math.log(Math.log(N))));
    rows.push({
      N,
      restarts,
      best_r_found: r,
      ratio_r_over_N: Number((r / N).toFixed(6)),
      ratio_r_times_L_over_N: Number((r * L / N).toFixed(6)),
    });
  }

  out.results.ep202 = {
    description: 'Randomized packing profile for disjoint residue classes with distinct moduli <= N.',
    rows,
  };
}


const single={problem:'EP-202',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep202};
const OUT=process.env.OUT || path.join('data','ep202_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-202',out:OUT},null,2));
