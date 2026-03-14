#!/usr/bin/env node

// EP-969
// Deep finite profile of squarefree counting error E(x)=Q(x)-6/pi^2*x.

function mobiusLinearSieve(N) {
  const lp = new Int32Array(N + 1);
  const mu = new Int8Array(N + 1);
  const primes = [];
  mu[1] = 1;
  for (let i = 2; i <= N; i += 1) {
    if (lp[i] === 0) {
      lp[i] = i;
      primes.push(i);
      mu[i] = -1;
    }
    for (let j = 0; j < primes.length; j += 1) {
      const p = primes[j];
      const v = i * p;
      if (v > N) break;
      lp[v] = p;
      if (p === lp[i]) {
        mu[v] = 0;
        break;
      }
      mu[v] = -mu[i];
    }
  }
  return mu;
}

function main() {
  const t0 = Date.now();

  const X = 30_000_000;
  const scales = [1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000];

  const mu = mobiusLinearSieve(X);
  const c = 6 / (Math.PI * Math.PI);

  let Q = 0;
  let maxAbsE = 0;
  let argmax = 1;
  const rows = [];
  const peakUpdates = [];
  let scaleIdx = 0;

  for (let x = 1; x <= X; x += 1) {
    if (x === 1 || mu[x] !== 0) Q += 1;
    const E = Q - c * x;
    const aE = Math.abs(E);

    if (aE > maxAbsE) {
      maxAbsE = aE;
      argmax = x;
      if (peakUpdates.length < 60) {
        peakUpdates.push({ x, E_x: Number(E.toFixed(8)), abs_E_x: Number(aE.toFixed(8)) });
      }
    }

    if (scaleIdx < scales.length && x === scales[scaleIdx]) {
      rows.push({
        x,
        Q_x: Q,
        E_x: Number(E.toFixed(8)),
        abs_E_x: Number(aE.toFixed(8)),
        max_abs_E_up_to_x: Number(maxAbsE.toFixed(8)),
        argmax_up_to_x: argmax,
        log_max_abs_E_over_log_x: Number((Math.log(maxAbsE) / Math.log(x)).toFixed(8)),
        max_abs_over_x_quarter: Number((maxAbsE / (x ** 0.25)).toFixed(8)),
      });
      scaleIdx += 1;
    }
  }

  const payload = {
    problem: 'EP-969',
    script: 'ep969.mjs',
    method: 'deep_squarefree_error_scan_with_linear_mobius_sieve',
    warning: 'Finite-range data only; asymptotic order remains open.',
    params: { X, scales },
    rows,
    first_peak_updates: peakUpdates,
    final_max_abs_error: Number(maxAbsE.toFixed(8)),
    final_argmax: argmax,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
