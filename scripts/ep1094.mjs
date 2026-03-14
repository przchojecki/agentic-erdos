#!/usr/bin/env node

// EP-1094 deep standalone computation:
// Exhaustive finite scan for exceptions to
// lpf(C(n,k)) <= max(n/k, k),  for n>=2k.

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let p = 2; p <= n; p += 1) if (isPrime[p]) primes.push(p);
  return primes;
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

function lpfBinom(n, k, primes) {
  const nk = n - k;
  for (const p of primes) {
    if (p > n) break;
    const v = vpFact(n, p) - vpFact(k, p) - vpFact(nk, p);
    if (v > 0) return p;
  }
  return 1;
}

function key(n, k) {
  return `${n},${k}`;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const NMAX = Number(process.env.NMAX || (depth >= 4 ? 2600 : 900));

  const primes = sievePrimes(NMAX);

  const known14 = new Set([
    key(7, 3), key(13, 4), key(23, 5), key(14, 4), key(44, 8), key(46, 10), key(47, 10),
    key(47, 11), key(62, 6), key(74, 10), key(94, 10), key(95, 10), key(241, 16), key(284, 28),
  ]);

  const exceptions = [];
  let tested = 0;
  let checkedPrimeValCalls = 0;

  for (let n = 4; n <= NMAX; n += 1) {
    const kMax = Math.floor(n / 2);
    for (let k = 2; k <= kMax; k += 1) {
      tested += 1;
      const lp = lpfBinom(n, k, primes);
      // count cost proxy: not exact per call, but lp position among primes
      let idx = 0;
      while (idx < primes.length && primes[idx] <= lp) idx += 1;
      checkedPrimeValCalls += idx;

      const bound = Math.max(n / k, k);
      if (lp > bound + 1e-12) {
        exceptions.push({ n, k, least_prime_factor: lp, bound });
      }
    }
  }

  const foundSet = new Set(exceptions.map((e) => key(e.n, e.k)));
  const missingFromKnown14 = [...known14].filter((x) => !foundSet.has(x));
  const newBeyondKnown14 = exceptions.filter((e) => !known14.has(key(e.n, e.k)));

  const probes = [420, 800, 1200, 1600, 2000, 2400, NMAX].filter((v, i, a) => v <= NMAX && a.indexOf(v) === i);
  const probeRows = [];
  let ptr = 0;
  let exSeen = 0;
  for (let n = 4; n <= NMAX; n += 1) {
    while (ptr < probes.length && n > probes[ptr]) ptr += 1;
    if (ptr >= probes.length) break;
    for (const e of exceptions) {
      if (e.n === n) exSeen += 1;
    }
    if (n === probes[ptr]) {
      probeRows.push({ n, exceptions_up_to_n: exSeen });
    }
  }

  const payload = {
    problem: 'EP-1094',
    script: 'ep1094.mjs',
    method: 'deep_exhaustive_p_adic_scan_for_least_prime_factor_of_binomial_coefficients',
    warning: 'Finite exhaustive verification up to NMAX only.',
    params: { depth, NMAX },
    rows: [
      {
        NMAX,
        tested_pairs_n_k: tested,
        exception_count: exceptions.length,
        exceptions_first_40: exceptions.slice(0, 40),
        exceptions_last_20: exceptions.slice(Math.max(0, exceptions.length - 20)),
        missing_from_known_14_within_range: missingFromKnown14,
        new_exceptions_beyond_known_14_within_range: newBeyondKnown14,
        probe_rows: probeRows,
        valuation_prime_checks_proxy: checkedPrimeValCalls,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
