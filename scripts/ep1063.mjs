#!/usr/bin/env node

// EP-1063 deep standalone computation:
// For each k, find smallest n such that among i=0..k-1,
// divisibility (n-i) | C(n,k) fails for exactly one i.

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

function factorWithSpf(x, spf) {
  const out = [];
  let n = x;
  while (n > 1) {
    const p = spf[n] || n;
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
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

function vpBinom(n, k, p) {
  return vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const kMax = 12 + depth;
  const nMax = 80_000 + 60_000 * depth;
  const perKBudgetMs = 15_000 * depth;

  const spf = sieveSpf(nMax);
  const factCache = Array(nMax + 1);
  for (let x = 2; x <= nMax; x += 1) factCache[x] = factorWithSpf(x, spf);

  const rows = [];

  for (let k = 2; k <= kMax; k += 1) {
    const kStart = Date.now();
    const firstSolutions = [];
    let scanned = 0;
    let timedOut = false;

    for (let n = 2 * k; n <= nMax; n += 1) {
      scanned += 1;
      if ((scanned & 1023) === 0 && Date.now() - kStart > perKBudgetMs) {
        timedOut = true;
        break;
      }

      let fails = 0;
      let fi = -1;

      for (let i = 0; i < k; i += 1) {
        const m = n - i;
        const fac = factCache[m] || [];
        let divides = true;

        for (const [p, e] of fac) {
          if (vpBinom(n, k, p) < e) {
            divides = false;
            break;
          }
        }

        if (!divides) {
          fails += 1;
          fi = i;
          if (fails >= 2) break;
        }
      }

      if (fails === 1 && firstSolutions.length < 4) firstSolutions.push({ n, failing_i: fi });
    }

    rows.push({
      k,
      n_k_found: firstSolutions.length ? firstSolutions[0].n : null,
      failing_i_for_nk: firstSolutions.length ? firstSolutions[0].failing_i : null,
      n_k_over_k: firstSolutions.length ? Number((firstSolutions[0].n / k).toFixed(8)) : null,
      first_solutions_found: firstSolutions,
      scanned_n_values: scanned,
      timed_out: timedOut,
      elapsed_ms_for_k: Date.now() - kStart,
    });
  }

  const payload = {
    problem: 'EP-1063',
    script: 'ep1063.mjs',
    method: 'deep_prime_valuation_exact_search_for_single_divisibility_failure_index',
    warning: 'Rows with timed_out=true are unresolved within finite budget.',
    params: { depth, kMax, nMax, perKBudgetMs },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
