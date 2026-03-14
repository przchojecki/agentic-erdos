#!/usr/bin/env node

// EP-978 deep finite profile for squarefreeness of n^4+2.
// Part A: exact (small N) via 64-bit Pollard-Rho factorization.
// Part B: large-N proxy using small-prime-square sieve constraints.

function gcd(a, b) {
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function modPow(a, e, m) {
  let r = 1n;
  let x = a % m;
  let k = e;
  while (k > 0n) {
    if (k & 1n) r = (r * x) % m;
    x = (x * x) % m;
    k >>= 1n;
  }
  return r;
}

function isPrime64(n) {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1;
  }
  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
  for (const a of bases) {
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let ok = false;
    for (let r = 1; r < s; r += 1) {
      x = (x * x) % n;
      if (x === n - 1n) { ok = true; break; }
    }
    if (!ok) return false;
  }
  return true;
}

function pollardRho(n) {
  if (n % 2n === 0n) return 2n;
  if (n % 3n === 0n) return 3n;
  let c = 1n;
  while (true) {
    let x = 2n;
    let y = 2n;
    let d = 1n;
    const f = (v) => (v * v + c) % n;
    while (d === 1n) {
      x = f(x);
      y = f(f(y));
      const diff = x > y ? x - y : y - x;
      d = gcd(diff, n);
    }
    if (d !== n) return d;
    c += 1n;
  }
}

function factorRec(n, out) {
  if (n === 1n) return;
  if (isPrime64(n)) {
    out.push(n);
    return;
  }
  const d = pollardRho(n);
  factorRec(d, out);
  factorRec(n / d, out);
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

function main() {
  const t0 = Date.now();

  const NExact = 7000;
  let sqfExact = 0;
  const exactRows = [];
  const probesExact = new Set([1000, 2000, 3500, 5000, 7000]);

  for (let n = 1; n <= NExact; n += 1) {
    const v = BigInt(n) ** 4n + 2n;
    const fac = [];
    factorRec(v, fac);
    fac.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    let sqf = true;
    for (let i = 1; i < fac.length; i += 1) {
      if (fac[i] === fac[i - 1]) { sqf = false; break; }
    }
    if (sqf) sqfExact += 1;
    if (probesExact.has(n)) {
      exactRows.push({
        n,
        squarefree_count: sqfExact,
        squarefree_density: Number((sqfExact / n).toFixed(8)),
      });
    }
  }

  // Large-N proxy: exclude divisibility by p^2 for small primes only.
  const NProxy = 1_000_000;
  const PBound = 2000;
  const smallPrimes = sievePrimes(PBound);
  const bad = new Uint8Array(NProxy + 1);

  for (const p of smallPrimes) {
    const p2 = p * p;
    for (let n = 1; n <= NProxy; n += 1) {
      if (bad[n]) continue;
      const r = ((BigInt(n) ** 4n + 2n) % BigInt(p2));
      if (r === 0n) bad[n] = 1;
    }
  }

  let ok = 0;
  const proxyRows = [];
  const probesProxy = [100000, 250000, 500000, 750000, 1000000];
  let ip = 0;
  for (let n = 1; n <= NProxy; n += 1) {
    if (!bad[n]) ok += 1;
    if (ip < probesProxy.length && n === probesProxy[ip]) {
      proxyRows.push({ n, B_squarefree_survivors: ok, survivor_density: Number((ok / n).toFixed(8)) });
      ip += 1;
    }
  }

  const payload = {
    problem: 'EP-978',
    script: 'ep978.mjs',
    method: 'deep_exact_plus_proxy_squarefreeness_profile_for_n4_plus_2',
    warning: 'Exact only up to NExact; large-N section is proxy using small prime-square filters.',
    params: { NExact, NProxy, PBound },
    exact_rows: exactRows,
    proxy_rows: proxyRows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
