#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieve(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function factorByPrimes(x, primes) {
  const out = new Map();
  let v = x;
  for (const p of primes) {
    if (p * p > v) break;
    if (v % p) continue;
    let e = 0;
    while (v % p === 0) {
      v = Math.floor(v / p);
      e += 1;
    }
    out.set(p, e);
  }
  if (v > 1) out.set(v, (out.get(v) || 0) + 1);
  return out;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep683_binom_largest_prime_scan.json');

const Nmax = Number(process.argv[2] || 2200);
const primes = sieve(Nmax);

// prefix valuations: vp[n][pi] = v_{p_i}(n!)
const P = primes.length;
const vp = Array.from({ length: Nmax + 1 }, () => new Int32Array(P));
for (let n = 1; n <= Nmax; n += 1) {
  vp[n].set(vp[n - 1]);
  const fac = factorByPrimes(n, primes);
  for (let pi = 0; pi < P; pi += 1) {
    const p = primes[pi];
    const e = fac.get(p) || 0;
    if (e) vp[n][pi] += e;
  }
}

let minExponentMargin = Number.POSITIVE_INFINITY;
let witnessMin = null;

const checkpoints = [];
for (let n = 4; n <= Nmax; n += 1) {
  const h = Math.floor(n / 2);
  for (let k = 2; k <= h; k += 1) {
    let Pbin = 1;
    for (let pi = P - 1; pi >= 0; pi -= 1) {
      const e = vp[n][pi] - vp[k][pi] - vp[n - k][pi];
      if (e > 0) {
        Pbin = primes[pi];
        break;
      }
    }

    const margin = Math.log(Pbin / k) / Math.log(k); // c such that Pbin = k^{1+margin}
    if (margin < minExponentMargin) {
      minExponentMargin = margin;
      witnessMin = { n, k, largest_prime_divisor: Pbin, margin_c: margin };
    }
  }

  if (n % 250 === 0) {
    checkpoints.push({ n, min_margin_c_up_to_n: minExponentMargin, witness: witnessMin });
    process.stderr.write(`n=${n}, min_c=${minExponentMargin.toFixed(4)}, witness=(n=${witnessMin.n},k=${witnessMin.k},P=${witnessMin.largest_prime_divisor})\n`);
  }
}

const out = {
  problem: 'EP-683',
  method: 'exact_largest_prime_divisor_of_binomial_via_factorial_prime_valuations',
  params: { Nmax },
  global_min_margin_c: minExponentMargin,
  global_min_witness: witnessMin,
  checkpoints,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
