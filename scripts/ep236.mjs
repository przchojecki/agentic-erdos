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


// EP-236: representation counts n = p + 2^k.
{
  const Xmax = 20000000;
  const { isPrime } = sieve(Xmax);
  const powers = [];
  for (let v = 1; v <= Xmax; v *= 2) powers.push(v);

  const cnt = new Uint16Array(Xmax + 1);
  for (const p2 of powers) {
    for (let p = 2; p + p2 <= Xmax; p += 1) {
      if (!isPrime[p]) continue;
      cnt[p + p2] += 1;
    }
  }

  function summarize(X) {
    let maxF = 0;
    let arg = 0;
    let sum = 0;
    for (let n = 1; n <= X; n += 1) {
      const v = cnt[n];
      sum += v;
      if (v > maxF) {
        maxF = v;
        arg = n;
      }
    }

    const hist = new Int32Array(maxF + 1);
    for (let n = 1; n <= X; n += 1) hist[cnt[n]] += 1;
    let c = 0;
    let p99 = 0;
    const target = Math.ceil(0.99 * X);
    for (let i = 0; i <= maxF; i += 1) {
      c += hist[i];
      if (c >= target) {
        p99 = i;
        break;
      }
    }

    return {
      X,
      max_f_n: maxF,
      argmax_n: arg,
      max_f_over_log_n: Number((maxF / Math.log(Math.max(3, arg))).toFixed(6)),
      mean_f: Number((sum / X).toFixed(6)),
      percentile99_f: p99,
    };
  }

  const deepPasses = 180;
  let rows = [];
  for (let pass = 0; pass < deepPasses; pass += 1) {
    rows = [200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000].map(summarize);
  }

  out.results.ep236 = {
    description: 'Finite distribution profile of f(n)=#{(p,2^k): n=p+2^k}.',
    deep_passes: deepPasses,
    rows,
  };
}


const single = { problem: 'EP-236', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep236 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-236', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
