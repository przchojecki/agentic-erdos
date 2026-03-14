#!/usr/bin/env node

// EP-979
// f_k(n): number of ordered representations n = p_1^k + ... + p_k^k.
// Deep finite profile for k=2,3,4.

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

function profileK2(N) {
  const pmax = Math.floor(Math.sqrt(N));
  const primes = sievePrimes(pmax);
  const vals = primes.map((p) => p * p);
  const cnt = new Uint32Array(N + 1);
  for (const a of vals) {
    for (const b of vals) {
      const s = a + b;
      if (s > N) break;
      cnt[s] += 1;
    }
  }
  let mx = 0;
  let arg = 0;
  for (let n = 2; n <= N; n += 1) if (cnt[n] > mx) { mx = cnt[n]; arg = n; }
  return { k: 2, N, max_f_k_n: mx, argmax_n: arg, prime_count: primes.length };
}

function profileK3(N) {
  const pmax = Math.floor(Math.cbrt(N));
  const primes = sievePrimes(pmax);
  const vals = primes.map((p) => p * p * p);
  const cnt = new Uint32Array(N + 1);
  for (const a of vals) {
    for (const b of vals) {
      const ab = a + b;
      if (ab > N) break;
      for (const c of vals) {
        const s = ab + c;
        if (s > N) break;
        cnt[s] += 1;
      }
    }
  }
  let mx = 0;
  let arg = 0;
  for (let n = 2; n <= N; n += 1) if (cnt[n] > mx) { mx = cnt[n]; arg = n; }
  return { k: 3, N, max_f_k_n: mx, argmax_n: arg, prime_count: primes.length };
}

function profileK4(N) {
  const pmax = Math.floor(Math.pow(N, 0.25));
  const primes = sievePrimes(pmax);
  const vals = primes.map((p) => p ** 4);
  const cnt = new Uint32Array(N + 1);
  for (const a of vals) {
    for (const b of vals) {
      const ab = a + b;
      if (ab > N) break;
      for (const c of vals) {
        const abc = ab + c;
        if (abc > N) break;
        for (const d of vals) {
          const s = abc + d;
          if (s > N) break;
          cnt[s] += 1;
        }
      }
    }
  }
  let mx = 0;
  let arg = 0;
  for (let n = 2; n <= N; n += 1) if (cnt[n] > mx) { mx = cnt[n]; arg = n; }
  return { k: 4, N, max_f_k_n: mx, argmax_n: arg, prime_count: primes.length };
}

function main() {
  const t0 = Date.now();

  const rows = [
    profileK2(20_000_000),
    profileK3(200_000_000),
    profileK4(500_000_000),
  ];

  const payload = {
    problem: 'EP-979',
    script: 'ep979.mjs',
    method: 'deep_finite_max_multiplicity_scan_for_prime_power_sum_representations',
    warning: 'Finite profile only; does not prove limsup_{n->infty} f_k(n)=infty for all k.',
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
