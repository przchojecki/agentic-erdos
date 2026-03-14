#!/usr/bin/env node

// EP-1065 deep standalone computation:
// prime-count profiles for p = 2^a q + 1 and p = 2^a 3^b q + 1 with q prime.

function sievePrimes(N) {
  const isPrime = new Uint8Array(N + 1);
  if (N >= 2) {
    isPrime.fill(1, 2);
    for (let p = 2; p * p <= N; p += 1) {
      if (!isPrime[p]) continue;
      for (let m = p * p; m <= N; m += p) isPrime[m] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= N; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const LIMIT = 2_000_000 + 1_000_000 * depth;

  const { isPrime, primes } = sievePrimes(LIMIT);

  let c1 = 0;
  let c2 = 0;
  let pi = 0;

  const probeX = [1_000_000, 2_000_000, 4_000_000, 8_000_000, 12_000_000, LIMIT]
    .filter((v, i, a) => v <= LIMIT && a.indexOf(v) === i)
    .sort((a, b) => a - b);
  let ptr = 0;
  const rows = [];

  for (const p of primes) {
    if (p < 3) continue;
    pi += 1;
    const n = p - 1;

    let ok1 = false;
    let t = n;
    while ((t & 1) === 0) {
      t >>= 1;
      if (t > 1 && isPrime[t]) {
        ok1 = true;
        break;
      }
    }
    if (ok1) c1 += 1;

    let ok2 = false;
    let a = n;
    while ((a & 1) === 0) {
      a >>= 1;
      let b = a;
      while (b % 3 === 0) {
        b = Math.floor(b / 3);
        if (b > 1 && isPrime[b]) {
          ok2 = true;
          break;
        }
      }
      if (ok2) break;
    }
    if (ok2) c2 += 1;

    while (ptr < probeX.length && p >= probeX[ptr]) {
      rows.push({
        x: probeX[ptr],
        pi_x: pi,
        count_2a_q_plus_1: c1,
        count_2a3b_q_plus_1: c2,
        density_2a_q_plus_1_among_primes: Number((c1 / pi).toFixed(10)),
        density_2a3b_q_plus_1_among_primes: Number((c2 / pi).toFixed(10)),
      });
      ptr += 1;
    }
  }

  const payload = {
    problem: 'EP-1065',
    script: 'ep1065.mjs',
    method: 'deep_large_range_prime_form_density_profile_scan',
    warning: 'Finite range density evidence only; does not prove infinitude.',
    params: { depth, LIMIT },
    rows: [
      {
        LIMIT,
        probe_rows: rows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
