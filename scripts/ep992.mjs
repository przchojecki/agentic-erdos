#!/usr/bin/env node

// EP-992 finite metrical discrepancy profile over sampled alpha.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function frac(x) {
  const y = x - Math.floor(x);
  return y < 0 ? y + 1 : y;
}

function discrepancyStar(values) {
  const n = values.length;
  const a = values.slice().sort((u, v) => u - v);
  let d = 0;
  for (let i = 0; i < n; i += 1) {
    const up = (i + 1) / n - a[i];
    const lo = a[i] - i / n;
    if (up > d) d = up;
    if (lo > d) d = lo;
  }
  return d * n;
}

function sievePrimes(N) {
  const isPrime = new Uint8Array(N + 1);
  if (N >= 2) {
    isPrime.fill(1, 2);
    for (let p = 2; p * p <= N; p += 1) {
      if (!isPrime[p]) continue;
      for (let m = p * p; m <= N; m += p) isPrime[m] = 0;
    }
  }
  const out = [];
  for (let i = 2; i <= N; i += 1) if (isPrime[i]) out.push(i);
  return out;
}

function quantile(arr, q) {
  const a = arr.slice().sort((u, v) => u - v);
  const idx = Math.floor(q * (a.length - 1));
  return a[idx];
}

function main() {
  const t0 = Date.now();

  const Nmax = 6000;
  const Nlist = [1000, 2000, 4000, 6000];
  const alphaSamples = 120;

  const seqs = [];
  seqs.push({ name: 'linear', x: Array.from({ length: Nmax }, (_, i) => i + 1) });
  seqs.push({ name: 'squares', x: Array.from({ length: Nmax }, (_, i) => (i + 1) * (i + 1)) });
  {
    const lac = [];
    let v = 3;
    for (let i = 0; i < Nmax; i += 1) {
      lac.push(v);
      v = Math.floor(v * 1.05) + 1;
    }
    seqs.push({ name: 'lacunary_1p05', x: lac });
  }
  seqs.push({ name: 'primes', x: sievePrimes(70000).slice(0, Nmax) });

  const rng = makeRng(20260314 ^ 992);
  const alphas = [];
  for (let i = 0; i < alphaSamples; i += 1) {
    // irrational-like sample by adding sqrt2 component
    const a = frac(rng() + Math.SQRT2 * rng());
    alphas.push(a);
  }

  const rows = [];

  for (const S of seqs) {
    const out = { sequence: S.name, profile: [] };

    for (const N of Nlist) {
      const valsPerAlpha = [];
      const ratios = [];
      for (const alpha of alphas) {
        const vals = Array(N);
        for (let i = 0; i < N; i += 1) vals[i] = frac(alpha * S.x[i]);
        const D = discrepancyStar(vals);
        valsPerAlpha.push(D);
        ratios.push(D / Math.sqrt(N));
      }

      out.profile.push({
        N,
        median_D_over_sqrtN: Number(quantile(ratios, 0.5).toFixed(8)),
        q90_D_over_sqrtN: Number(quantile(ratios, 0.9).toFixed(8)),
        max_D_over_sqrtN: Number(Math.max(...ratios).toFixed(8)),
      });
    }

    rows.push(out);
  }

  const payload = {
    problem: 'EP-992',
    script: 'ep992.mjs',
    method: 'deep_metrical_discrepancy_sampling_over_alpha_for_multiple_integer_sequences',
    warning: 'Finite Monte Carlo metrical proxy only; not an almost-everywhere theorem.',
    params: { Nlist, alphaSamples, sequences: seqs.map((s) => s.name) },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
