#!/usr/bin/env node

// EP-1073 deep standalone computation:
// A(x): composite u<=x for which exists n with n! ≡ -1 (mod u).

function sieveSpf(N) {
  const spf = new Uint32Array(N + 1);
  const primes = [];
  for (let i = 2; i <= N; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      primes.push(i);
    }
    for (const p of primes) {
      const v = i * p;
      if (v > N || p > spf[i]) break;
      spf[v] = p;
    }
  }
  return spf;
}

function factorize(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function vpFact(n, p) {
  let s = 0;
  let x = n;
  while (x > 0) {
    x = Math.floor(x / p);
    s += x;
  }
  return s;
}

function leastNForPrimePower(p, e) {
  // binary search minimal n with v_p(n!) >= e
  let lo = 1;
  let hi = p * e + 5;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (vpFact(mid, p) >= e) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

function zeroThreshold(u, spf) {
  const fac = factorize(u, spf);
  let m = 0;
  for (const [p, e] of fac) {
    const t = leastNForPrimePower(p, e);
    if (t > m) m = t;
  }
  return m;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const X = Number(process.env.X_LIMIT || (40_000 + 20_000 * depth));

  const spf = sieveSpf(X);
  const probes = [20_000, 40_000, 80_000, 120_000, 160_000, 200_000, X]
    .filter((v, i, a) => v <= X && a.indexOf(v) === i)
    .sort((a, b) => a - b);

  let ptr = 0;
  let A = 0;
  const firstHits = [];
  const rows = [];
  let totalFactUpdates = 0;

  for (let u = 4; u <= X; u += 1) {
    if (spf[u] === u) {
      while (ptr < probes.length && u >= probes[ptr]) {
        rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toFixed(10)) });
        ptr += 1;
      }
      continue;
    }

    const stop = Math.min(u - 1, zeroThreshold(u, spf));
    let fac = 1 % u;
    let ok = false;
    for (let n = 1; n <= stop; n += 1) {
      fac = (fac * n) % u;
      totalFactUpdates += 1;
      if (fac === u - 1) {
        ok = true;
        break;
      }
      if (fac === 0) break;
    }

    if (ok) {
      A += 1;
      if (firstHits.length < 60) firstHits.push(u);
    }

    while (ptr < probes.length && u >= probes[ptr]) {
      rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toFixed(10)) });
      ptr += 1;
    }
  }

  const payload = {
    problem: 'EP-1073',
    script: 'ep1073.mjs',
    method: 'deep_exact_composite_modulus_scan_with_factorial_zero_threshold_pruning',
    warning: 'Finite x profile only; does not prove asymptotic subpolynomial growth.',
    params: { depth, X },
    rows: [
      {
        X,
        first_hits: firstHits,
        probe_rows: rows,
        total_factorial_updates: totalFactUpdates,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
