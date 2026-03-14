#!/usr/bin/env node

// EP-1060 deep standalone computation:
// multiplicity profile for map k -> k*sigma(k).

function sigmaSieve(N) {
  const sigma = new Float64Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) sigma[m] += d;
  }
  return sigma;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const K = 300_000 + 200_000 * depth;

  const sigma = sigmaSieve(K);
  const cnt = new Map();
  let maxMult = 0;
  let argAtMax = null;

  for (let k = 1; k <= K; k += 1) {
    const n = Math.round(k * sigma[k]);
    const c = (cnt.get(n) || 0) + 1;
    cnt.set(n, c);
    if (c > maxMult) {
      maxMult = c;
      argAtMax = n;
    }
  }

  const topRows = [...cnt.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 20)
    .map(([n, c]) => ({ n, multiplicity: c }));

  let maxSmall = 0;
  for (const [n, c] of cnt.entries()) if (n <= 65536 && c > maxSmall) maxSmall = c;

  const payload = {
    problem: 'EP-1060',
    script: 'ep1060.mjs',
    method: 'deep_multiplicity_profile_of_k_times_sigma_k_map',
    warning: 'Finite K-window only; not asymptotic proof.',
    params: { depth, K },
    rows: [
      {
        K,
        max_multiplicity_found: maxMult,
        first_n_at_max_multiplicity: argAtMax,
        max_multiplicity_for_n_le_2_pow_16: maxSmall,
        top_rows: topRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
