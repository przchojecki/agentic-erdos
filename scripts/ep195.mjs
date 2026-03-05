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


// EP-195: permutation proxy for monotone arithmetic progressions.
{
  function countMonoAP(perm, k) {
    const N = perm.length;
    const pos = new Int32Array(N + 1);
    for (let i = 0; i < N; i += 1) pos[perm[i]] = i;

    let inc = 0;
    let dec = 0;
    for (let a = 1; a <= N; a += 1) {
      for (let d = 1; a + (k - 1) * d <= N; d += 1) {
        let up = true;
        let down = true;
        for (let t = 1; t < k; t += 1) {
          const p0 = pos[a + (t - 1) * d];
          const p1 = pos[a + t * d];
          if (!(p0 < p1)) up = false;
          if (!(p0 > p1)) down = false;
          if (!up && !down) break;
        }
        if (up) inc += 1;
        if (down) dec += 1;
      }
    }
    return { total: inc + dec, inc, dec };
  }

  const rows = [];
  for (const N of [30, 40, 50, 60, 70]) {
    let best4 = Infinity;
    let best3 = Infinity;
    const trials = N <= 40 ? 7000 : N <= 60 ? 4500 : 2500;
    const base = Array.from({ length: N }, (_, i) => i + 1);

    for (let t = 0; t < trials; t += 1) {
      const p = [...base];
      shuffle(p, rng);
      const c4 = countMonoAP(p, 4).total;
      if (c4 < best4) best4 = c4;
      if (c4 === 0) {
        const c3 = countMonoAP(p, 3).total;
        if (c3 < best3) best3 = c3;
      }
    }

    rows.push({
      N,
      random_trials: trials,
      min_monotone_4AP_count_found: best4,
      exists_trial_without_monotone_4AP: best4 === 0,
      min_monotone_3AP_count_among_4AP_free_trials: Number.isFinite(best3) ? best3 : null,
    });
  }

  out.results.ep195 = {
    description: 'Random-permutation finite profile for monotone value-AP occurrences.',
    rows,
  };
}


const single={problem:'EP-195',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep195};
const OUT=process.env.OUT || path.join('data','ep195_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-195',out:OUT},null,2));
