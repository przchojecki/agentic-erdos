#!/usr/bin/env node

// EP-972
// For irrational alpha>1, count primes p<=X with floor(alpha*p) prime.

function sievePrimeBits(N) {
  const isPrime = new Uint8Array(N + 1);
  if (N >= 2) {
    isPrime.fill(1, 2);
    for (let p = 2; p * p <= N; p += 1) {
      if (!isPrime[p]) continue;
      for (let m = p * p; m <= N; m += p) isPrime[m] = 0;
    }
  }
  return isPrime;
}

function main() {
  const t0 = Date.now();

  const X = 60_000_000;
  const alphas = [
    Math.sqrt(2),
    Math.sqrt(3),
    Math.PI,
    Math.E,
    (1 + Math.sqrt(5)) / 2,
    Math.sqrt(5),
    Math.sqrt(7),
    Math.sqrt(11),
    Math.sqrt(13),
    Math.sqrt(17),
    Math.PI * Math.E / 2,
    Math.sqrt(2) + Math.sqrt(3) / 3,
  ];
  const alphaNames = ['sqrt2', 'sqrt3', 'pi', 'e', 'phi', 'sqrt5', 'sqrt7', 'sqrt11', 'sqrt13', 'sqrt17', 'pi_e_half', 'mix23'];
  const maxAlpha = Math.max(...alphas);
  const isPrime = sievePrimeBits(Math.floor(maxAlpha * X) + 10);

  const checkpoints = [5_000_000, 10_000_000, 20_000_000, 40_000_000, 60_000_000];
  const rows = [];

  const counts = new Int32Array(alphas.length);
  let piX = 0;
  let ckIdx = 0;

  for (let n = 2; n <= X; n += 1) {
    if (isPrime[n]) {
      piX += 1;
      for (let i = 0; i < alphas.length; i += 1) {
        const q = Math.floor(alphas[i] * n);
        if (isPrime[q]) counts[i] += 1;
      }
    }

    while (ckIdx < checkpoints.length && n === checkpoints[ckIdx]) {
      const out = { x: checkpoints[ckIdx], pi_x: piX };
      for (let i = 0; i < alphas.length; i += 1) {
        const c = counts[i];
        out[`N_${alphaNames[i]}`] = c;
        out[`ratio_to_pi_x_${alphaNames[i]}`] = Number((c / piX).toFixed(8));
        out[`ratio_to_x_over_log2x_${alphaNames[i]}`] = Number((c / (checkpoints[ckIdx] / (Math.log(checkpoints[ckIdx]) ** 2))).toFixed(8));
      }
      rows.push(out);
      ckIdx += 1;
    }
  }

  const final = rows[rows.length - 1];

  const payload = {
    problem: 'EP-972',
    script: 'ep972.mjs',
    method: 'deep_multialpha_prime_beatty_pair_scan',
    warning: 'Finite empirical counts only; does not prove infinitude.',
    params: { X, alphas: alphaNames },
    checkpoints: rows,
    final_summary: final,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
