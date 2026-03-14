#!/usr/bin/env node

// EP-1053 deep standalone computation:
// profile k = sigma(n)/n when integer (multiply-perfect multipliers).

function divisorSumSieve(N) {
  const sigma = new Float64Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) sigma[m] += d;
  }
  return sigma;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const N = 1_000_000 + 500_000 * depth;
  const sigma = divisorSumSieve(N);

  const probes = new Set([200_000, 500_000, 1_000_000, N]);
  const probeRows = [];
  let runningMaxK = 0;
  let argAtMax = 1;
  let countKge3 = 0;
  const byK = new Map();

  for (let n = 2; n <= N; n += 1) {
    const s = sigma[n];
    if (s % n === 0) {
      const k = s / n;
      if (k > runningMaxK) {
        runningMaxK = k;
        argAtMax = n;
      }
      if (k >= 3) countKge3 += 1;
      if (!byK.has(k)) byK.set(k, []);
      const arr = byK.get(k);
      if (arr.length < 5) arr.push(n);
    }
    if (probes.has(n)) {
      probeRows.push({
        n,
        running_max_k: runningMaxK,
        n_attaining_running_max_k: argAtMax,
        count_k_ge_3_up_to_n: countKge3,
      });
    }
  }

  const topKRows = [...byK.keys()]
    .sort((a, b) => b - a)
    .slice(0, 12)
    .map((k) => ({ k, sample_n: byK.get(k) }));

  const payload = {
    problem: 'EP-1053',
    script: 'ep1053.mjs',
    method: 'deep_multiply_perfect_multiplier_profile_via_divisor_sum_sieve',
    warning: 'Finite range statistics only; does not settle asymptotic k-growth claim.',
    params: { depth, N },
    rows: [
      {
        N,
        probe_rows: probeRows,
        top_k_rows: topKRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
