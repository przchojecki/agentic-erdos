#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 6:
// EP-160, EP-161, EP-165, EP-169, EP-170, EP-172, EP-174, EP-177, EP-181, EP-183.

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

function choose2(x) {
  return (x * (x - 1)) / 2;
}

const rng = makeRng(20260303 ^ 601);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-181: bound profile + finite Q2=C4 monochromatic proxy.
{
  const c = 0.03656;
  const boundRows = [];
  for (const n of [4, 6, 8, 10, 12, 16]) {
    const log2Upper = (2 - c) * n;
    const log2Target = n;
    boundRows.push({
      n,
      log2_upper_bound_tikhomirov_style: Number(log2Upper.toFixed(6)),
      log2_linear_target_2_pow_n: log2Target,
      ratio_exponent_log2_upper_over_target: Number((log2Upper - log2Target).toFixed(6)),
    });
  }

  function randomColorK(m) {
    const cmat = Array.from({ length: m }, () => new Uint8Array(m));
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        const c0 = rng() < 0.5 ? 0 : 1;
        cmat[i][j] = c0;
        cmat[j][i] = c0;
      }
    }
    return cmat;
  }

  function hasMonoC4(cmat) {
    const m = cmat.length;
    for (let u = 0; u < m; u += 1) {
      for (let v = u + 1; v < m; v += 1) {
        let redCommon = 0;
        let blueCommon = 0;
        for (let w = 0; w < m; w += 1) {
          if (w === u || w === v) continue;
          if (cmat[u][w] === 1 && cmat[v][w] === 1) redCommon += 1;
          if (cmat[u][w] === 0 && cmat[v][w] === 0) blueCommon += 1;
          if (redCommon >= 2 || blueCommon >= 2) return true;
        }
      }
    }
    return false;
  }

  const trialBudgetByM = new Map([
    [4, 120000],
    [5, 80000],
    [6, 40000],
    [7, 30000],
    [8, 20000],
    [10, 12000],
    [12, 8000],
  ]);
  const proxyRows = [];
  for (const m of [4, 5, 6, 7, 8, 10, 12]) {
    const trials = trialBudgetByM.get(m);
    let hits = 0;
    for (let t = 0; t < trials; t += 1) if (hasMonoC4(randomColorK(m))) hits += 1;
    proxyRows.push({
      m,
      trials,
      monochromatic_C4_found_rate: Number((hits / trials).toFixed(6)),
    });
  }

  out.results.ep181 = {
    description: 'Asymptotic-bound profile for R(Q_n) plus finite monochromatic C4 proxy.',
    bound_rows: boundRows,
    q2_proxy_rows: proxyRows,
  };
}


const single={problem:'EP-181',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep181};
const OUT=process.env.OUT || path.join('data','ep181_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-181',out:OUT},null,2));
