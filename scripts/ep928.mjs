#!/usr/bin/env node

// EP-928
// Deep finite empirical study of joint smoothness events:
// E_a(n): P(n) < n^a, E_b(n+1): P(n+1) < (n+1)^b.

function largestPrimeFactorSieve(N) {
  const lpf = new Uint32Array(N + 1);
  for (let p = 2; p <= N; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let m = p; m <= N; m += p) lpf[m] = p;
  }
  lpf[1] = 1;
  return lpf;
}

function main() {
  const t0 = Date.now();

  const N = 30_000_000;
  const checkpoints = [5_000_000, 10_000_000, 20_000_000, 30_000_000];
  const grid = [0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85];
  const pairs = [];
  for (const a of grid) for (const b of grid) pairs.push([a, b]);

  const lpf = largestPrimeFactorSieve(N + 1);

  const stats = pairs.map(([a, b]) => ({ a, b, ca: 0, cb: 0, cab: 0 }));
  const checkpointsRows = [];
  let ckIdx = 0;

  for (let n = 2; n <= N; n += 1) {
    const ln = Math.log(n);
    const ln1 = Math.log(n + 1);
    const lpfN = lpf[n];
    const lpfNp1 = lpf[n + 1];

    for (const st of stats) {
      const ea = Math.log(lpfN) < st.a * ln;
      const eb = Math.log(lpfNp1) < st.b * ln1;
      if (ea) st.ca += 1;
      if (eb) st.cb += 1;
      if (ea && eb) st.cab += 1;
    }

    if (ckIdx < checkpoints.length && n === checkpoints[ckIdx]) {
      const denom = n - 1;
      const rows = stats.map((st) => {
        const da = st.ca / denom;
        const db = st.cb / denom;
        const dj = st.cab / denom;
        const prod = da * db;
        const cov = dj - prod;
        return {
          alpha: st.a,
          beta: st.b,
          N: n,
          density_event_a: Number(da.toFixed(8)),
          density_event_b: Number(db.toFixed(8)),
          density_joint: Number(dj.toFixed(8)),
          product_density: Number(prod.toFixed(8)),
          joint_minus_product: Number(cov.toFixed(8)),
          joint_over_product: Number((dj / prod).toFixed(8)),
        };
      });
      checkpointsRows.push({ N: n, rows });
      ckIdx += 1;
    }
  }

  const finalRows = checkpointsRows[checkpointsRows.length - 1].rows;

  const payload = {
    problem: 'EP-928',
    script: 'ep928.mjs',
    method: 'deep_joint_smoothness_density_scan_with_checkpoint_convergence',
    warning: 'Finite empirical evidence only; does not prove existence of natural density for all parameters.',
    params: { N, checkpoints, pairs },
    checkpoints: checkpointsRows,
    final_N_summary: finalRows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
