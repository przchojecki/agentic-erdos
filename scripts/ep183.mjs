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


// EP-183: deeper bound-window profile and finite randomized triangle-Ramsey proxy.
{
  const rows = [];

  // recursion upper bound: U_1=3, U_k <= 2 + k(U_{k-1}-1)
  const U = [0, 3];
  for (let k = 2; k <= 400; k += 1) U[k] = 2 + k * (U[k - 1] - 1);

  const lowerRoot = 380 ** (1 / 5);
  for (const k of [5, 10, 20, 30, 40, 60, 80, 120, 160, 220, 300, 400]) {
    const upper = U[k];
    rows.push({
      k,
      lower_root_from_schur_bound: Number(lowerRoot.toFixed(6)),
      recursive_upper_n: upper,
      recursive_upper_root: Number(upper ** (1 / k)).toFixed(6),
    });
  }

  function randomEdgeColors(n, kColors) {
    const mat = Array.from({ length: n }, () => new Uint8Array(n));
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const c = Math.floor(rng() * kColors);
        mat[i][j] = c;
        mat[j][i] = c;
      }
    }
    return mat;
  }

  function hasMonochromaticTriangle(mat) {
    const n = mat.length;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const cij = mat[i][j];
        for (let k = j + 1; k < n; k += 1) {
          if (mat[i][k] === cij && mat[j][k] === cij) return true;
        }
      }
    }
    return false;
  }

  const random3ColorRows = [];
  for (const n of [20, 24, 26, 28, 29, 30, 31, 32]) {
    const trials = 2500;
    let hit = 0;
    for (let t = 0; t < trials; t += 1) if (hasMonochromaticTriangle(randomEdgeColors(n, 3))) hit += 1;
    random3ColorRows.push({
      n,
      colors: 3,
      trials,
      monochromatic_triangle_found_rate: Number((hit / trials).toFixed(6)),
    });
  }

  out.results.ep183 = {
    description: 'Deeper finite windows from Schur/recursive bounds plus randomized monochromatic-triangle proxy for 3-color Ramsey thresholds.',
    rows,
    random_3color_triangle_proxy_rows: random3ColorRows,
  };
}


const single={problem:'EP-183',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep183};
const OUT=process.env.OUT || path.join('data','ep183_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-183',out:OUT},null,2));
