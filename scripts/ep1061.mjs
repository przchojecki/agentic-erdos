#!/usr/bin/env node

// EP-1061 deep standalone computation:
// count unordered pairs (a,b), a<b, a+b<=X with sigma(a)+sigma(b)=sigma(a+b).

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
  const X = 12_000 + 4_000 * depth;

  const sigma = sigmaSieve(X);
  const probes = new Set([4000, 8000, 12000, 16000, 20000, X]);

  let total = 0;
  const probeRows = [];

  for (let c = 2; c <= X; c += 1) {
    const target = sigma[c];
    const half = Math.floor((c - 1) / 2);
    for (let a = 1; a <= half; a += 1) {
      const b = c - a;
      if (sigma[a] + sigma[b] === target) total += 1;
    }
    if (probes.has(c)) {
      probeRows.push({
        x: c,
        unordered_solution_count_up_to_x: total,
        count_over_x: Number((total / c).toFixed(8)),
      });
    }
  }

  const payload = {
    problem: 'EP-1061',
    script: 'ep1061.mjs',
    method: 'deep_count_profile_for_sigma_additivity_equation_over_unordered_pairs',
    warning: 'Finite X profile only; not asymptotic proof of c*x law.',
    params: { depth, X },
    rows: [
      {
        X,
        probe_rows: probeRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
