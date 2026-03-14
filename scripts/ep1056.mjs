#!/usr/bin/env node

// EP-1056 deep standalone computation:
// prefix-factorial collisions mod p to detect interval products == 1 (mod p).

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

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const PRIMES_MAX = 400 + 200 * depth;

  const { primes } = sieveSpf(PRIMES_MAX);
  const sampleRows = [];
  const kMaxByPrime = [];

  for (const p of primes) {
    if (p < 5) continue;
    const pref = new Int32Array(p);
    pref[0] = 1;
    for (let i = 1; i < p; i += 1) pref[i] = (pref[i - 1] * i) % p;

    const pos = new Map();
    for (let i = 0; i < p; i += 1) {
      const v = pref[i];
      if (!pos.has(v)) pos.set(v, []);
      pos.get(v).push(i);
    }

    let bestList = [];
    for (const lst of pos.values()) if (lst.length > bestList.length) bestList = lst;
    const kMax = Math.max(0, bestList.length - 1);
    kMaxByPrime.push({ p, kMax });

    if (kMax >= 2 && sampleRows.length < 16) {
      const intervals = [];
      for (let i = 1; i <= Math.min(kMax, 6); i += 1) {
        intervals.push([bestList[i - 1] + 1, bestList[i]]);
      }
      sampleRows.push({ p, max_k_found_from_prefix_collisions: kMax, sample_intervals: intervals });
    }
  }

  const firstByK = [];
  const KMAX_TARGET = 12;
  for (let k = 2; k <= KMAX_TARGET; k += 1) {
    const hit = kMaxByPrime.find((r) => r.kMax >= k);
    if (hit) firstByK.push({ k, first_prime_with_detected_solution_size_at_least_k: hit.p });
  }

  const payload = {
    problem: 'EP-1056',
    script: 'ep1056.mjs',
    method: 'deep_prefix_factorial_collision_scan_mod_p',
    warning: 'Finite prime bound only; does not prove existence for arbitrarily large k.',
    params: { depth, PRIMES_MAX },
    rows: [
      {
        PRIMES_MAX,
        max_k_seen: Math.max(...kMaxByPrime.map((r) => r.kMax)),
        sample_rows: sampleRows,
        first_prime_by_detected_k: firstByK,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
