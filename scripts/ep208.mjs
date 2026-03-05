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


// EP-208: squarefree gaps profile.
{
  function squarefreeMask(X) {
    const sf = new Uint8Array(X + 1);
    sf.fill(1, 1);
    const r = Math.floor(Math.sqrt(X));
    for (let p = 2; p <= r; p += 1) {
      const sq = p * p;
      for (let v = sq; v <= X; v += sq) sf[v] = 0;
    }
    sf[0] = 0;
    return sf;
  }

  const rows = [];
  for (const X of [200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000]) {
    const sf = squarefreeMask(X);
    let prev = -1;
    let maxGap = 0;
    let gapStart = null;
    for (let n = 1; n <= X; n += 1) {
      if (!sf[n]) continue;
      if (prev >= 0) {
        const g = n - prev;
        if (g > maxGap) {
          maxGap = g;
          gapStart = prev;
        }
      }
      prev = n;
    }
    const scale = (Math.PI * Math.PI / 6) * (Math.log(gapStart) / Math.log(Math.log(gapStart)));
    rows.push({
      X,
      max_gap_observed: maxGap,
      gap_start_at: gapStart,
      ratio_over_pi2_over6_log_over_loglog: Number((maxGap / scale).toFixed(6)),
      ratio_over_gap_start_pow_0_2: Number((maxGap / (gapStart ** 0.2)).toFixed(6)),
    });
  }

  out.results.ep208 = {
    description: 'Finite maximum-gap profile for squarefree numbers.',
    rows,
  };
}


const single={problem:'EP-208',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep208};
const OUT=process.env.OUT || path.join('data','ep208_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-208',out:OUT},null,2));
