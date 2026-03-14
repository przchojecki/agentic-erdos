#!/usr/bin/env node

// EP-1103 deep standalone computation:
// Multiple large-cutoff greedy constructions for A+A squarefree,
// including seeded variants to probe construction sensitivity.

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

function nonSquarefreeBitset(limit) {
  const bad = new Uint8Array(limit + 1);
  const primes = sievePrimes(Math.floor(Math.sqrt(limit)) + 2);
  for (const p of primes) {
    const sq = p * p;
    for (let m = sq; m <= limit; m += sq) bad[m] = 1;
  }
  return bad;
}

function buildGreedy(MAX_A, bad, initialA) {
  const inA = new Uint8Array(MAX_A + 1);
  const A = [];
  for (const x of initialA) {
    if (x >= 1 && x <= MAX_A) {
      inA[x] = 1;
      A.push(x);
    }
  }
  A.sort((a, b) => a - b);

  let checks = 0;

  for (let x = 1; x <= MAX_A; x += 1) {
    if (inA[x]) continue;
    if (bad[2 * x]) continue;

    let ok = true;
    for (const a of A) {
      checks += 1;
      if (bad[a + x]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      inA[x] = 1;
      A.push(x);
    }
  }

  A.sort((a, b) => a - b);
  return { A, checks };
}

function countLeq(A, x) {
  let lo = 0;
  let hi = A.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (A[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const MAX_A = Number(process.env.MAX_A || (depth >= 4 ? 20000000 : 2000000));

  const bad = nonSquarefreeBitset(2 * MAX_A + 5);

  const seedList =
    depth >= 4
      ? [1, 5, 13, 17, 21, 29, 37, 41, 53, 65, 73, 85]
      : [1, 5, 13, 21, 37, 41];

  const variants = [];
  let totalChecks = 0;

  for (const seed of seedList) {
    if (bad[2 * seed]) continue;
    const { A, checks } = buildGreedy(MAX_A, bad, [seed]);
    totalChecks += checks;
    variants.push({
      seed,
      terms_found: A.length,
      first_terms_24: A.slice(0, 24),
      last_terms_24: A.slice(Math.max(0, A.length - 24)),
      count_at_1e5: countLeq(A, Math.min(100000, MAX_A)),
      count_at_1e6: countLeq(A, Math.min(1000000, MAX_A)),
      count_at_MAX_A: A.length,
      checks,
    });
  }

  // Canonical unseeded run
  const base = buildGreedy(MAX_A, bad, []);
  totalChecks += base.checks;

  const probes = [200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 1000000, 5000000, 10000000, MAX_A]
    .filter((v, i, arr) => v <= MAX_A && arr.indexOf(v) === i);
  const probeRows = probes.map((x) => {
    const c = countLeq(base.A, x);
    return {
      x,
      count_a_le_x: c,
      count_over_log_x: Number((c / Math.log(x)).toFixed(10)),
      count_over_x_quarter: Number((c / Math.pow(x, 0.25)).toFixed(10)),
      count_over_x_third: Number((c / Math.pow(x, 1 / 3)).toFixed(10)),
    };
  });

  const payload = {
    problem: 'EP-1103',
    script: 'ep1103.mjs',
    method: 'deep_large_cutoff_multi_seed_greedy_construction_for_squarefree_sumset_sequences',
    warning: 'Greedy/seeded constructions provide explicit lower-bound examples only.',
    params: { depth, MAX_A, seeds_tried: seedList },
    rows: [
      {
        canonical_unseeded: {
          terms_found: base.A.length,
          first_terms_80: base.A.slice(0, 80),
          last_terms_40: base.A.slice(Math.max(0, base.A.length - 40)),
          probe_rows: probeRows,
          checks: base.checks,
        },
        seeded_variants: variants,
        total_compatibility_checks_all_runs: totalChecks,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
