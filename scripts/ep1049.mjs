#!/usr/bin/env node

// EP-1049 deep finite proxy:
// numerical evidence for irrationality of S(t)=sum_{n>=1} 1/(t^n-1), t>1 rational.

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

function seriesValue(t, N) {
  let s = 0;
  for (let n = 1; n <= N; n += 1) s += 1 / (t ** n - 1);
  return s;
}

function tailBound(t, N) {
  // crude bound from n>=N+1: 1/(t^n-1) <= 2/t^n for t^n>=2
  const n0 = N + 1;
  return 2 * (t ** (-n0)) / (1 - 1 / t);
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const maxDen = 1_000_000 * depth;
  const bruteMaxDen = Math.min(maxDen, 250_000);
  const N = 80 + 20 * depth;

  const tList = [
    { label: '2', t: 2 },
    { label: '3', t: 3 },
    { label: '3/2', t: 1.5 },
    { label: '5/3', t: 5 / 3 },
    { label: '7/5', t: 7 / 5 },
    { label: '9/7', t: 9 / 7 },
  ];

  const rows = [];
  for (const T of tList) {
    const s = seriesValue(T.t, N);
    const rem = tailBound(T.t, N);
    const best = contFracApprox(s, maxDen);
    const brute = bruteNearestRational(s, bruteMaxDen);
    rows.push({
      t: T.label,
      partial_sum_N: N,
      S_N_numeric: Number(s.toPrecision(15)),
      tail_bound_after_N: Number(rem.toExponential(6)),
      best_rational_p_over_q_up_to_maxDen: `${best.p}/${best.q}`,
      best_rational_error: Number(best.err.toExponential(6)),
      best_bruteforce_p_over_q_up_to_bruteMaxDen: `${brute.p}/${brute.q}`,
      best_bruteforce_error: Number(brute.err.toExponential(6)),
      guaranteed_gap_minus_tail: Number((best.err - rem).toExponential(6)),
      max_denominator_checked: maxDen,
      brute_max_denominator_checked: bruteMaxDen,
    });
  }

  const payload = {
    problem: 'EP-1049',
    script: 'ep1049.mjs',
    method: 'deep_partial_sum_plus_tail_and_continued_fraction_search_for_small_denominator_rationals',
    warning: 'Numerical exclusion of small denominators only; not a proof of irrationality for rational non-integer t.',
    params: { depth, N, maxDen },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
