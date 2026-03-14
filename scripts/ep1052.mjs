#!/usr/bin/env node

// EP-1052 deep standalone computation:
// scan n<=N for unitary-perfect condition sigma*(n)=2n.

function smallestPrimeFactor(N) {
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

function sigmaUnitary(n, spf) {
  let x = n;
  let out = 1;
  while (x > 1) {
    const p = spf[x] || x;
    let pe = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pe *= p;
    }
    out *= (pe + 1);
  }
  return out;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const N = 2_000_000 + 1_000_000 * depth;

  const spf = smallestPrimeFactor(N);
  const hits = [];
  let oddHits = 0;

  for (let n = 2; n <= N; n += 1) {
    if (sigmaUnitary(n, spf) === 2 * n) {
      hits.push(n);
      if (n % 2 === 1) oddHits += 1;
    }
  }

  const payload = {
    problem: 'EP-1052',
    script: 'ep1052.mjs',
    method: 'deep_exact_unitary_perfect_scan_with_spf_factorization',
    warning: 'Finite scan only; cannot prove finiteness or infinitude.',
    params: { depth, N },
    rows: [
      {
        N,
        hit_count: hits.length,
        odd_hits_count: oddHits,
        unitary_perfect_hits_up_to_N: hits,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
