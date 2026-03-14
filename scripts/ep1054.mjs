#!/usr/bin/env node

// EP-1054 deep standalone computation:
// bounded search for minimal m such that n is a prefix sum of sorted divisors of m.

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

function divisorsSorted(n, spf) {
  const fac = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    fac.push([p, e]);
  }
  let divs = [1];
  for (const [p, e] of fac) {
    const cur = [];
    let pe = 1;
    for (let i = 0; i <= e; i += 1) {
      for (const d of divs) cur.push(d * pe);
      pe *= p;
    }
    divs = cur;
  }
  divs.sort((a, b) => a - b);
  return divs;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const N_TARGET = 700 + 200 * depth;
  const M_MAX = 20_000 + 10_000 * depth;

  const spf = smallestPrimeFactor(M_MAX);
  const best = new Int32Array(N_TARGET + 1);

  for (let m = 1; m <= M_MAX; m += 1) {
    const divs = divisorsSorted(m, spf);
    let pref = 0;
    for (const d of divs) {
      pref += d;
      if (pref > N_TARGET) break;
      if (best[pref] === 0 || m < best[pref]) best[pref] = m;
    }
  }

  const unresolved = [];
  for (let n = 1; n <= N_TARGET; n += 1) if (best[n] === 0) unresolved.push(n);
  const probes = [6, 10, 20, 50, 100, 200, 400, 700, N_TARGET].filter((v, i, a) => a.indexOf(v) === i);
  const probeRows = probes.map((n) => ({
    n,
    best_m_found: best[n] || null,
    ratio_m_over_n: best[n] ? Number((best[n] / n).toFixed(8)) : null,
  }));

  let maxRatio = 0;
  let argN = -1;
  for (let n = 6; n <= N_TARGET; n += 1) {
    if (!best[n]) continue;
    const r = best[n] / n;
    if (r > maxRatio) {
      maxRatio = r;
      argN = n;
    }
  }

  const payload = {
    problem: 'EP-1054',
    script: 'ep1054.mjs',
    method: 'deep_bounded_prefix_divisor_sum_minimal_witness_search',
    warning: 'Bounded search only; does not prove asymptotic growth laws.',
    params: { depth, N_TARGET, M_MAX },
    rows: [
      {
        N_TARGET,
        M_MAX,
        unresolved_n_up_to_target_under_MMAX: unresolved,
        probe_rows: probeRows,
        max_ratio_m_over_n_found: Number(maxRatio.toFixed(8)),
        n_attaining_max_ratio: argN,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
