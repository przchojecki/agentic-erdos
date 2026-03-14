#!/usr/bin/env node

// EP-1059 deep standalone computation:
// primes p such that p-k! is composite for every k! < p.

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

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const P_MAX = 1_000_000 + 500_000 * depth;

  const spf = sieveSpf(P_MAX);
  const facts = [];
  let f = 1;
  for (let k = 1; k <= 15; k += 1) {
    f *= k;
    if (f >= P_MAX) break;
    facts.push({ k, value: f });
  }

  const firstHits = [];
  let cnt = 0;
  const probes = new Set([1_000_000, 2_000_000, 4_000_000, P_MAX]);
  const probeRows = [];

  for (let p = 2; p <= P_MAX; p += 1) {
    if (spf[p] !== p) {
      if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
      continue;
    }

    let good = true;
    for (const { value } of facts) {
      if (value >= p) break;
      const q = p - value;
      if (q <= 3 || spf[q] === q) {
        good = false;
        break;
      }
    }

    if (good) {
      cnt += 1;
      if (firstHits.length < 80) firstHits.push(p);
    }

    if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
  }

  const payload = {
    problem: 'EP-1059',
    script: 'ep1059.mjs',
    method: 'deep_prime_scan_for_factorial_shifted_composite_condition',
    warning: 'Finite prime-range evidence only; does not prove infinitude.',
    params: { depth, P_MAX },
    rows: [
      {
        P_MAX,
        factorials_used: facts,
        first_hits: firstHits,
        probe_rows: probeRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
