#!/usr/bin/env node

// EP-912
// Exact finite computation of h(n): number of distinct exponents in n! prime factorization.
// We track exponent updates incrementally as n increases.

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

function factorBySpf(x, spf) {
  const out = [];
  let n = x;
  while (n > 1) {
    const p = spf[n];
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function main() {
  const t0 = Date.now();

  const N = 50000000;
  const sampleStride = 400000;
  const tailWindow = 80;

  const spf = buildSpf(N);
  const primeExp = new Int32Array(N + 1);
  const expFreq = new Map(); // exponent -> number of primes with that exponent

  function decExp(e) {
    const c = expFreq.get(e) || 0;
    if (c <= 1) expFreq.delete(e);
    else expFreq.set(e, c - 1);
  }

  function incExp(e) {
    expFreq.set(e, (expFreq.get(e) || 0) + 1);
  }

  const rows = [];
  let maxScaled = -1;
  let minScaled = 1e100;
  let argmax = null;
  let argmin = null;

  for (let n = 2; n <= N; n += 1) {
    const fac = factorBySpf(n, spf);
    for (const [p, add] of fac) {
      const oldE = primeExp[p];
      if (oldE > 0) decExp(oldE);
      const newE = oldE + add;
      primeExp[p] = newE;
      incExp(newE);
    }

    if (n % sampleStride === 0 || n === N) {
      const hn = expFreq.size;
      const scale = Math.sqrt(n / Math.log(n));
      const scaled = hn / scale;
      const row = {
        n,
        h_n: hn,
        sqrt_n_over_log_n: Number(scale.toFixed(8)),
        h_over_sqrt_n_over_log_n: Number(scaled.toFixed(8)),
      };
      rows.push(row);

      if (scaled > maxScaled) {
        maxScaled = scaled;
        argmax = row;
      }
      if (scaled < minScaled) {
        minScaled = scaled;
        argmin = row;
      }
    }
  }

  const tail = rows.slice(-tailWindow);
  const tailMean = tail.reduce((s, r) => s + r.h_over_sqrt_n_over_log_n, 0) / tail.length;
  const tailMin = Math.min(...tail.map((r) => r.h_over_sqrt_n_over_log_n));
  const tailMax = Math.max(...tail.map((r) => r.h_over_sqrt_n_over_log_n));

  const payload = {
    problem: 'EP-912',
    script: 'ep912.mjs',
    method: 'incremental_exact_h_n_scan_for_factorial_exponent_diversity',
    warning: 'Finite-range estimation only; does not prove asymptotic constant.',
    params: {
      N,
      sampleStride,
      tailWindow,
    },
    samples: rows,
    tail_constant_estimate: {
      mean_h_over_sqrt_n_over_log_n: Number(tailMean.toFixed(8)),
      min_h_over_sqrt_n_over_log_n: Number(tailMin.toFixed(8)),
      max_h_over_sqrt_n_over_log_n: Number(tailMax.toFixed(8)),
    },
    global_extrema_on_samples: {
      max_row: argmax,
      min_row: argmin,
    },
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
