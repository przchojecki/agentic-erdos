#!/usr/bin/env node

// EP-1095 deep standalone computation:
// g(k) = smallest n > k+1 such that every prime factor of C(n,k) is > k.
// Equivalent: for every prime p<=k, p does NOT divide C(n,k).
// We test divisibility via Lucas theorem digit condition.

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

function lucasNonZeroModP(n, k, p) {
  // C(n,k) mod p != 0 iff every base-p digit of k <= digit of n.
  let nn = n;
  let kk = k;
  while (kk > 0) {
    const nd = nn % p;
    const kd = kk % p;
    if (kd > nd) return false;
    nn = Math.floor(nn / p);
    kk = Math.floor(kk / p);
  }
  return true;
}

function findGk(k, primesLeK, nCap, perKBudgetMs) {
  const t0 = Date.now();
  const startN = k + 2;
  let testedN = 0;
  let primeChecks = 0;

  for (let n = startN; n <= nCap; n += 1) {
    testedN += 1;
    if (Date.now() - t0 > perKBudgetMs) {
      return { gk: null, found: false, timeout: true, testedN, primeChecks };
    }

    let ok = true;
    for (const p of primesLeK) {
      primeChecks += 1;
      if (!lucasNonZeroModP(n, k, p)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      return { gk: n, found: true, timeout: false, testedN, primeChecks };
    }
  }

  return { gk: null, found: false, timeout: false, testedN, primeChecks };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const KMAX = Number(process.env.KMAX || (depth >= 4 ? 90 : 50));
  const N_CAP = Number(process.env.N_CAP || (depth >= 4 ? 2500000 : 500000));
  const perKBudgetMs = Number(process.env.PER_K_BUDGET_MS || (depth >= 4 ? 14000 : 5000));

  const primes = sievePrimes(KMAX);
  const rows = [];

  let totalNTested = 0;
  let totalPrimeChecks = 0;

  for (let k = 2; k <= KMAX; k += 1) {
    const ple = primes.filter((p) => p <= k);
    const r = findGk(k, ple, N_CAP, perKBudgetMs);
    totalNTested += r.testedN;
    totalPrimeChecks += r.primeChecks;

    rows.push({
      k,
      g_k_found: r.gk,
      found_within_cap: r.found,
      timeout_hit: r.timeout,
      ratio_log_g_over_k_over_logk:
        r.gk && k > 2 ? Number((Math.log(r.gk) / (k / Math.log(k))).toFixed(10)) : null,
      tested_n_values: r.testedN,
      lucas_prime_checks: r.primeChecks,
    });
  }

  const foundRows = rows.filter((x) => x.g_k_found !== null);
  const missingRows = rows.filter((x) => x.g_k_found === null);

  const payload = {
    problem: 'EP-1095',
    script: 'ep1095.mjs',
    method: 'deep_exact_search_for_gk_using_lucas_theorem_divisibility_tests',
    warning: 'Exact for reported found values; unresolved rows may require larger cap/time.',
    params: { depth, KMAX, N_CAP, perKBudgetMs },
    rows: [
      {
        KMAX,
        N_CAP,
        perKBudgetMs,
        found_count: foundRows.length,
        unresolved_count: missingRows.length,
        unresolved_k_list: missingRows.map((r) => r.k),
        sample_rows_first_40: rows.slice(0, 40),
        sample_rows_last_30: rows.slice(Math.max(0, rows.length - 30)),
        total_n_values_tested: totalNTested,
        total_lucas_prime_checks: totalPrimeChecks,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
