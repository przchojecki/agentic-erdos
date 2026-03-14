#!/usr/bin/env node

// EP-975 finite profile for S_f(X)=sum_{n<=X} tau(f(n)) on irreducible quadratics.

function sievePrimes(N) {
  const isPrime = new Uint8Array(N + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= N; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= N; m += p) isPrime[m] = 0;
  }
  const primes = [];
  for (let i = 2; i <= N; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function tauOf(n, primes) {
  let x = n;
  let ans = 1;
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    ans *= (e + 1);
  }
  if (x > 1) ans *= 2;
  return ans;
}

function evalPoly(poly, n) {
  // poly coefficients high->low
  let v = 0;
  for (const c of poly) v = v * n + c;
  return v;
}

function main() {
  const t0 = Date.now();

  const X = 50000;
  const polys = [
    { name: 'n^2+1', coeff: [1, 0, 1] },
    { name: 'n^2+n+41', coeff: [1, 1, 41] },
    { name: 'n^2+2', coeff: [1, 0, 2] },
    { name: 'n^2+3', coeff: [1, 0, 3] },
  ];

  let maxVal = 0;
  for (const P of polys) {
    const v = evalPoly(P.coeff, X);
    if (v > maxVal) maxVal = v;
  }
  const primes = sievePrimes(Math.floor(Math.sqrt(maxVal)) + 5);

  const checkpoints = [5000, 10000, 20000, 30000, 40000, 50000];
  const rows = [];

  for (const P of polys) {
    let S = 0;
    let ckIdx = 0;
    const cRows = [];
    for (let n = 1; n <= X; n += 1) {
      const v = evalPoly(P.coeff, n);
      S += tauOf(v, primes);
      if (ckIdx < checkpoints.length && n === checkpoints[ckIdx]) {
        const approx = S / (n * Math.log(n));
        cRows.push({
          X_prefix: n,
          S_f_X: S,
          S_over_XlogX: Number(approx.toFixed(8)),
        });
        ckIdx += 1;
      }
    }
    rows.push({ poly: P.name, checkpoints: cRows });
  }

  const payload = {
    problem: 'EP-975',
    script: 'ep975.mjs',
    method: 'deep_finite_tau_of_polynomial_values_scan_for_irreducible_quadratics',
    warning: 'Finite evidence only; asymptotic constant c(f) is not proved here.',
    params: { X, polynomials: polys.map((p) => p.name) },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
