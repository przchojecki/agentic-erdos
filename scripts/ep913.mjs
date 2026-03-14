#!/usr/bin/env node

// EP-913
// Search for n such that exponents in prime factorization of n(n+1) are all distinct.

function buildSpf(N) {
  const spf = new Int32Array(N + 1);
  for (let i = 2; i <= N; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i <= N) {
      for (let j = i * i; j <= N; j += i) {
        if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function factorExpList(x, spf) {
  const exps = [];
  let n = x;
  while (n > 1) {
    const p = spf[n];
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
      e += 1;
    }
    exps.push(e);
  }
  return exps;
}

function allDistinct(arr) {
  const s = new Set(arr);
  return s.size === arr.length;
}

function main() {
  const t0 = Date.now();

  const N = 50000000;
  const reportStride = 1000000;

  const spf = buildSpf(N + 1);

  const firstWitnesses = [];
  const checkpoints = [];
  let witnessCount = 0;
  let maxPrimeFactorCount = 0;
  let argmaxPrimeFactorCount = null;

  for (let n = 1; n <= N; n += 1) {
    const e1 = factorExpList(n, spf);
    const e2 = factorExpList(n + 1, spf);
    const exps = e1.concat(e2); // n and n+1 are coprime

    if (allDistinct(exps)) {
      witnessCount += 1;
      if (firstWitnesses.length < 60) {
        firstWitnesses.push({
          n,
          n_times_n_plus_1_prime_factor_count: exps.length,
          exponent_multiset: exps.slice().sort((a, b) => a - b),
        });
      }
    }

    if (exps.length > maxPrimeFactorCount) {
      maxPrimeFactorCount = exps.length;
      argmaxPrimeFactorCount = n;
    }

    if (n % reportStride === 0 || n === N) {
      checkpoints.push({
        n,
        witnesses_up_to_n: witnessCount,
        witness_density_up_to_n: Number((witnessCount / n).toFixed(8)),
      });
    }
  }

  const payload = {
    problem: 'EP-913',
    script: 'ep913.mjs',
    method: 'deep_finite_scan_for_distinct_exponents_in_factorization_of_n_times_n_plus_1',
    warning: 'Finite search only; cannot prove infinitude.',
    params: {
      N,
      reportStride,
    },
    first_witnesses: firstWitnesses,
    checkpoints,
    summary: {
      total_witnesses_up_to_N: witnessCount,
      final_density_up_to_N: Number((witnessCount / N).toFixed(8)),
      max_prime_factor_count_seen: maxPrimeFactorCount,
      first_n_with_that_count: argmaxPrimeFactorCount,
    },
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
