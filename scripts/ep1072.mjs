#!/usr/bin/env node

// EP-1072 deep standalone computation:
// for prime p, f(p)=least n with n! ≡ -1 (mod p), if any n<p.

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
  return primes;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const LIMIT = Number(process.env.P_LIMIT || (120_000 + 30_000 * depth));

  const primes = sievePrimes(LIMIT);
  const probeX = [50_000, 80_000, 120_000, 160_000, 200_000, LIMIT]
    .filter((v, i, a) => v <= LIMIT && a.indexOf(v) === i)
    .sort((a, b) => a - b);

  let ptr = 0;
  let pi = 0;
  let countEq = 0;
  let avgRatio = 0;
  let totalInnerSteps = 0;

  const sampleRows = [];
  const probeRows = [];

  for (const p of primes) {
    if (p <= 3) continue;
    pi += 1;

    let fac = 1 % p;
    let f = p - 1;
    for (let n = 1; n < p; n += 1) {
      fac = (fac * n) % p;
      totalInnerSteps += 1;
      if (fac === p - 1) {
        f = n;
        break;
      }
    }

    if (f === p - 1) countEq += 1;
    avgRatio += f / p;

    if (sampleRows.length < 40) {
      sampleRows.push({ p, f_p: f, f_over_p: Number((f / p).toFixed(8)) });
    }

    while (ptr < probeX.length && p >= probeX[ptr]) {
      probeRows.push({
        x: probeX[ptr],
        pi_x: pi,
        count_f_p_eq_p_minus_1: countEq,
        proportion_f_p_eq_p_minus_1: Number((countEq / pi).toFixed(10)),
        mean_f_over_p_up_to_x: Number((avgRatio / pi).toFixed(10)),
      });
      ptr += 1;
    }
  }

  const payload = {
    problem: 'EP-1072',
    script: 'ep1072.mjs',
    method: 'deep_exact_factorial_residue_scan_for_least_n_with_factorial_minus1_mod_p',
    warning: 'Finite prime range only; does not settle asymptotic limit questions.',
    params: { depth, LIMIT },
    rows: [
      {
        LIMIT,
        sample_rows_small_primes: sampleRows,
        probe_rows: probeRows,
        total_factorial_updates: totalInnerSteps,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
