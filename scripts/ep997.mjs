#!/usr/bin/env node

// EP-997 finite proxy:
// Well-distribution style sliding-window discrepancy for {alpha p_n}.

function frac(x) {
  const y = x - Math.floor(x);
  return y < 0 ? y + 1 : y;
}

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
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

function maxWindowDeviation(vals, intervals, k) {
  const N = vals.length;
  let best = 0;
  let bestI = null;

  for (const [L, R] of intervals) {
    const pref = new Int32Array(N + 1);
    for (let i = 0; i < N; i += 1) pref[i + 1] = pref[i] + (vals[i] >= L && vals[i] < R ? 1 : 0);

    for (let s = 0; s + k <= N; s += 1) {
      const c = pref[s + k] - pref[s];
      const dev = Math.abs(c - (R - L) * k) / k;
      if (dev > best) {
        best = dev;
        bestI = [L, R];
      }
    }
  }

  return { best, interval: bestI };
}

function main() {
  const t0 = Date.now();

  const N = 120000;
  const p = sievePrimes(1700000).slice(0, N);

  const named = [
    { name: 'sqrt2', val: Math.SQRT2 },
    { name: 'pi', val: Math.PI },
    { name: 'e', val: Math.E },
    { name: 'phi', val: (1 + Math.sqrt(5)) / 2 },
    { name: 'sqrt3', val: Math.sqrt(3) },
    { name: 'sqrt5', val: Math.sqrt(5) },
  ];

  const rng = makeRng(20260314 ^ 997);
  for (let i = 0; i < 24; i += 1) named.push({ name: `rand_${i}`, val: frac(rng() + Math.sqrt(7) * rng()) });

  const intervals = [];
  for (let a = 0; a < 20; a += 1) {
    const L = a / 20;
    for (let b = a + 2; b <= 20; b += 3) intervals.push([L, b / 20]);
  }

  const windows = [500, 1000, 2000, 5000, 10000];

  const rows = [];
  for (const A of named) {
    const vals = p.map((q) => frac(A.val * q));
    const wr = [];
    for (const k of windows) {
      const out = maxWindowDeviation(vals, intervals, k);
      wr.push({ k, max_relative_deviation: Number(out.best.toFixed(8)), interval: out.interval });
    }
    rows.push({ alpha: A.name, windows: wr });
  }

  const payload = {
    problem: 'EP-997',
    script: 'ep997.mjs',
    method: 'deep_sliding_window_well_distribution_proxy_for_alpha_times_primes',
    warning: 'Finite-window discrepancy proxy only; does not decide asymptotic well-distribution statement for every alpha.',
    params: { N, windows, alpha_count: named.length, interval_count: intervals.length },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
