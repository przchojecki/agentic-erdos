#!/usr/bin/env node

// EP-1074 deep standalone computation:
// Build finite profiles for
// S = { m : exists prime p with m! == -1 (mod p) and p % m != 1 }
// P = { such primes p }.

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

function countSUpTo(bitset, x) {
  let c = 0;
  const lim = Math.min(x, bitset.length - 1);
  for (let i = 1; i <= lim; i += 1) if (bitset[i]) c += 1;
  return c;
}

function countPUpTo(primes, inP, x) {
  let pi = 0;
  let c = 0;
  for (const p of primes) {
    if (p > x) break;
    pi += 1;
    if (inP[p]) c += 1;
  }
  return { pi, c };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const LIMIT = Number(process.env.LIMIT || (60_000 + 40_000 * depth));

  const { primes } = sieve(LIMIT);
  const inS = new Uint8Array(LIMIT + 1);
  const inP = new Uint8Array(LIMIT + 1);

  let innerMults = 0;
  let breakOnHit = 0;

  for (const p of primes) {
    if (p <= 3) continue;
    let fac = 1 % p;
    let hit = false;
    for (let m = 1; m < p; m += 1) {
      fac = (fac * m) % p;
      innerMults += 1;
      if (fac === p - 1 && p % m !== 1) {
        inS[m] = 1;
        inP[p] = 1;
        hit = true;
        break;
      }
      if (fac === 0) break;
    }
    if (hit) breakOnHit += 1;
  }

  const probesS = [
    Math.min(1000, LIMIT),
    Math.min(5000, LIMIT),
    Math.min(10000, LIMIT),
    Math.min(20000, LIMIT),
    Math.min(40000, LIMIT),
    LIMIT,
  ];
  const dedupS = [...new Set(probesS)].sort((a, b) => a - b);

  const probesP = [
    Math.min(10000, LIMIT),
    Math.min(20000, LIMIT),
    Math.min(40000, LIMIT),
    Math.min(80000, LIMIT),
    LIMIT,
  ];
  const dedupP = [...new Set(probesP)].sort((a, b) => a - b);

  const rowsS = dedupS.map((x) => {
    const c = countSUpTo(inS, x);
    return {
      x,
      count_S_intersect_1_to_x: c,
      density: Number((c / x).toFixed(10)),
    };
  });

  const rowsP = dedupP.map((x) => {
    const { pi, c } = countPUpTo(primes, inP, x);
    return {
      x,
      count_P_intersect_primes_to_x: c,
      pi_x: pi,
      proportion_in_primes: pi === 0 ? 0 : Number((c / pi).toFixed(10)),
    };
  });

  const sampleS = [];
  for (let m = 1; m <= LIMIT && sampleS.length < 60; m += 1) {
    if (inS[m]) sampleS.push(m);
  }
  const sampleP = [];
  for (const p of primes) {
    if (inP[p]) sampleP.push(p);
    if (sampleP.length >= 60) break;
  }

  const payload = {
    problem: 'EP-1074',
    script: 'ep1074.mjs',
    method: 'deep_exact_prime_scan_for_factorial_minus1_hits_and_empirical_S_P_density_profiles',
    warning: 'Finite-range evidence only; limiting densities remain open.',
    params: { depth, LIMIT },
    rows: [
      {
        LIMIT,
        sample_small_S: sampleS,
        sample_small_P: sampleP,
        rows_S: rowsS,
        rows_P: rowsP,
        primes_scanned: primes.length,
        hits_in_P: breakOnHit,
        total_inner_factorial_multiplications: innerMults,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
