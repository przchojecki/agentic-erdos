#!/usr/bin/env node

// EP-1057 deep standalone computation:
// Carmichael counting C(x) via Korselt criterion up to X.

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

function isCarmichael(n, spf) {
  if (n < 3 || spf[n] === n) return false;
  let x = n;
  const facts = [];
  while (x > 1) {
    const p = spf[x] || x;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e > 1) return false;
    facts.push(p);
  }
  if (facts.length < 3) return false;
  for (const p of facts) if ((n - 1) % (p - 1) !== 0) return false;
  return true;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const X = 1_000_000 + 1_000_000 * depth;

  const spf = sieveSpf(X);
  const probeSet = new Set([100_000, 500_000, 1_000_000, 2_000_000, 5_000_000, X]);
  const rows = [];
  const firstSamples = [];

  let count = 0;
  for (let n = 3; n <= X; n += 1) {
    if (isCarmichael(n, spf)) {
      count += 1;
      if (firstSamples.length < 30) firstSamples.push(n);
    }
    if (probeSet.has(n)) {
      rows.push({
        x: n,
        C_x: count,
        C_over_x: Number((count / n).toFixed(10)),
        logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toFixed(10)) : 0,
      });
    }
  }

  const payload = {
    problem: 'EP-1057',
    script: 'ep1057.mjs',
    method: 'deep_korselt_criterion_carmichael_count_profile',
    warning: 'Finite x profile only; does not prove asymptotic exponent claims.',
    params: { depth, X },
    rows: [
      {
        X,
        probe_rows: rows,
        first_carmichael_numbers_in_scan: firstSamples,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
