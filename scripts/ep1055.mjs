#!/usr/bin/env node

// EP-1055 deep standalone computation:
// recursive prime classes via factorization of p+1.

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
  return { spf, primes };
}

function distinctPrimeFactors(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const LIMIT = 1_000_000 + 1_000_000 * depth;

  const { spf, primes } = sieveSpf(LIMIT + 1);
  const cls = new Map();
  const firstPrime = new Map();
  const counts = new Map();

  for (const p of primes) {
    if (p > LIMIT) break;
    const facts = distinctPrimeFactors(p + 1, spf);
    let c;
    if (facts.every((q) => q === 2 || q === 3)) {
      c = 1;
    } else {
      let mx = 0;
      for (const q of facts) {
        if (q === 2 || q === 3) continue;
        const cq = cls.get(q) || 0;
        if (cq > mx) mx = cq;
      }
      c = mx + 1;
    }
    cls.set(p, c);
    if (!firstPrime.has(c)) firstPrime.set(c, p);
    counts.set(c, (counts.get(c) || 0) + 1);
  }

  const firstRows = [...firstPrime.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([c, p]) => ({
      class: c,
      first_prime: p,
      p_to_1_over_class: Number((p ** (1 / c)).toFixed(8)),
    }))
    .slice(0, 20);

  const countRows = [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([c, cnt]) => ({ class: c, prime_count_up_to_limit: cnt }))
    .slice(0, 20);

  const payload = {
    problem: 'EP-1055',
    script: 'ep1055.mjs',
    method: 'deep_recursive_prime_class_profile_via_prime_factors_of_p_plus_1',
    warning: 'Finite range only; does not prove infinitude in each class.',
    params: { depth, LIMIT },
    rows: [
      {
        LIMIT,
        max_class_seen: Math.max(...counts.keys()),
        first_primes_by_class: firstRows,
        class_population_rows: countRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
