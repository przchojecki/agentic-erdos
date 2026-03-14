#!/usr/bin/env node

// EP-1051 deep finite proxy:
// series with doubly-exponential growth scale a_n^{1/2^n}>1
// and rational-approximation diagnostics for sum 1/a_n.

function contFracApprox(x, maxDen) {
  let a = Math.floor(x);
  let h0 = 0; let h1 = 1;
  let k0 = 1; let k1 = 0;
  let y = x;
  let best = { p: a, q: 1, err: Math.abs(x - a) };
  for (let it = 0; it < 64; it += 1) {
    a = Math.floor(y);
    const h2 = a * h1 + h0;
    const k2 = a * k1 + k0;
    if (k2 > maxDen) break;
    const err = Math.abs(x - h2 / k2);
    if (err < best.err) best = { p: h2, q: k2, err };
    h0 = h1; h1 = h2;
    k0 = k1; k1 = k2;
    const frac = y - a;
    if (Math.abs(frac) < 1e-18) break;
    y = 1 / frac;
  }
  return best;
}

function bruteNearestRational(x, maxDen) {
  let bestErr = Infinity;
  let bestP = 0;
  let bestQ = 1;
  for (let q = 1; q <= maxDen; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < bestErr) {
      bestErr = err;
      bestP = p;
      bestQ = q;
    }
  }
  return { p: bestP, q: bestQ, err: bestErr };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const maxDen = 1_000_000 * depth;
  const bruteMaxDen = Math.min(maxDen, 250_000);

  const cList = [1.02, 1.05, 1.1, 1.2, 1.35];
  const rows = [];

  for (const c of cList) {
    let s = 0;
    let N = 0;
    let tailProxy = 0;
    for (let n = 0; n <= 22 + 2 * depth; n += 1) {
      const a = Math.max(2, Math.floor(c ** (2 ** n)));
      const term = 1 / a;
      s += term;
      N = n;
      tailProxy = term;
      if (term < 1e-16) break;
    }

    const best = contFracApprox(s, maxDen);
    const brute = bruteNearestRational(s, bruteMaxDen);
    rows.push({
      c_growth_base: c,
      terms_used: N + 1,
      sum_numeric: Number(s.toPrecision(16)),
      last_term_as_tail_proxy: Number(tailProxy.toExponential(6)),
      best_rational_p_over_q_up_to_maxDen: `${best.p}/${best.q}`,
      best_rational_error: Number(best.err.toExponential(6)),
      best_bruteforce_p_over_q_up_to_bruteMaxDen: `${brute.p}/${brute.q}`,
      best_bruteforce_error: Number(brute.err.toExponential(6)),
      error_minus_tail_proxy: Number((best.err - tailProxy).toExponential(6)),
      max_denominator_checked: maxDen,
      brute_max_denominator_checked: bruteMaxDen,
    });
  }

  const payload = {
    problem: 'EP-1051',
    script: 'ep1051.mjs',
    method: 'deep_growth_condition_series_rational_approximation_scan',
    warning: 'Numerical small-denominator exclusion only; not a theorem-level irrationality proof.',
    params: { depth, maxDen },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };
  console.log(JSON.stringify(payload, null, 2));
}

main();
