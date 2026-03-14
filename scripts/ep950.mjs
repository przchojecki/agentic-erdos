#!/usr/bin/env node

// EP-950
// f(n)=sum_{p<n} 1/(n-p), p prime.
// Deep finite profile for moments, extremes, and normalization trends.

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

  const N = 300000;
  const checkpoints = [50000, 100000, 150000, 200000, 250000, 300000];

  const { primes } = sievePrimes(N);
  const f = new Float64Array(N + 1);

  const rec = new Float64Array(N + 1);
  for (let d = 1; d <= N; d += 1) rec[d] = 1 / d;

  for (const p of primes) {
    const lim = N - p;
    for (let d = 1; d <= lim; d += 1) f[p + d] += rec[d];
  }

  const rows = [];
  let sum = 0;
  let sumsq = 0;
  let minv = 1e100;
  let maxv = -1;
  let argmin = -1;
  let argmax = -1;

  let ckIdx = 0;
  for (let n = 2; n <= N; n += 1) {
    const v = f[n];
    sum += v;
    sumsq += v * v;
    if (v < minv) { minv = v; argmin = n; }
    if (v > maxv) { maxv = v; argmax = n; }

    if (ckIdx < checkpoints.length && n === checkpoints[ckIdx]) {
      const m = n - 1;
      const mean = sum / m;
      const meanSq = sumsq / m;
      rows.push({
        N_prefix: n,
        mean_f: Number(mean.toFixed(8)),
        mean_f2: Number(meanSq.toFixed(8)),
        mean_square_deviation_from_1: Number((meanSq - 2 * mean + 1).toFixed(8)),
        min_f_up_to_prefix: Number(minv.toFixed(8)),
        argmin_up_to_prefix: argmin,
        max_f_up_to_prefix: Number(maxv.toFixed(8)),
        argmax_up_to_prefix: argmax,
        max_over_loglogN: Number((maxv / Math.log(Math.log(n))).toFixed(8)),
      });
      ckIdx += 1;
    }
  }

  const top = [];
  for (let n = 2; n <= N; n += 1) {
    const v = f[n];
    if (top.length < 25 || v > top[top.length - 1].f_n) {
      top.push({ n, f_n: Number(v.toFixed(10)) });
      top.sort((a, b) => b.f_n - a.f_n || a.n - b.n);
      if (top.length > 25) top.pop();
    }
  }

  const payload = {
    problem: 'EP-950',
    script: 'ep950.mjs',
    method: 'deep_finite_profile_for_prime_tail_reciprocal_sum_function',
    warning: 'Finite-range data only; does not settle liminf/limsup conjectures.',
    params: { N, checkpoints },
    checkpoint_moment_profile: rows,
    global_extremes: {
      min_f: Number(minv.toFixed(10)),
      argmin_n: argmin,
      max_f: Number(maxv.toFixed(10)),
      argmax_n: argmax,
      max_over_loglogN_at_end: Number((maxv / Math.log(Math.log(N))).toFixed(8)),
    },
    top_values: top,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
