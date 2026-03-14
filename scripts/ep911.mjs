#!/usr/bin/env node

// EP-911 standalone computation:
// family test on G = K_t using known clique size-Ramsey identity and
// lower bounds for R(t,t).

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function knownRamseyLower(t) {
  // Exact values / lower bounds currently standard for small t.
  if (t === 3) return 6; // exact
  if (t === 4) return 18; // exact
  if (t === 5) return 43; // exact lower endpoint (R(5,5) in [43,48])
  // Erdos lower bound: R(t,t) > 2^(t/2). Use ceil to keep integer lower bound.
  return Math.ceil(2 ** (t / 2));
}

function knownRamseyUpper(t) {
  if (t === 3) return 6;
  if (t === 4) return 18;
  if (t === 5) return 48;
  // Classical upper bound R(t,t) <= binom(2t-2, t-1).
  // Keep as Number (sufficient for our range).
  let num = 1;
  for (let i = 1; i <= t - 1; i += 1) {
    num *= (t - 1 + i) / i;
  }
  return Math.round(num);
}

function main() {
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const tMax = Number(process.env.TMAX || (depth >= 4 ? 60 : 30));

  const rows = [];
  for (let t = 3; t <= tMax; t += 1) {
    const n = t;
    const e = choose2(t);
    const C = e / n;
    const rLo = knownRamseyLower(t);
    const rHi = knownRamseyUpper(t);
    const sizeRamseyLo = choose2(rLo);
    const sizeRamseyHi = choose2(rHi);
    const ratioLo = sizeRamseyLo / e;
    const ratioHi = sizeRamseyHi / e;
    rows.push({
      t,
      n,
      e,
      C: Number(C.toFixed(10)),
      ramsey_lower: rLo,
      ramsey_upper: rHi,
      size_ramsey_lower_for_Kt: sizeRamseyLo,
      size_ramsey_upper_for_Kt: sizeRamseyHi,
      ratio_lower_size_ramsey_over_e: Number(ratioLo.toFixed(10)),
      ratio_upper_size_ramsey_over_e: Number(ratioHi.toFixed(10)),
      ratio_lower_over_C: Number((ratioLo / C).toFixed(10)),
      ratio_upper_over_C: Number((ratioHi / C).toFixed(10)),
    });
  }

  // Monotonicity check for the lower envelope from some threshold.
  let minRatioOverC = Infinity;
  for (const r of rows) {
    if (r.t < 8) continue;
    if (r.ratio_lower_over_C < minRatioOverC) minRatioOverC = r.ratio_lower_over_C;
  }

  const payload = {
    problem: 'EP-911',
    script: 'ep911.mjs',
    method: 'family_probe_complete_graphs_using_size_ramsey_identity_and_classical_ramsey_bounds',
    warning: 'This only studies one dense family (cliques), not all dense graphs in the EP-911 quantifier.',
    params: { depth, tMax },
    summary: {
      claim_checked:
        'For G=K_t, lower bounds imply hatR(G)/e(G) grows much faster than C=(t-1)/2.',
      min_ratio_lower_over_C_for_t_ge_8: Number(minRatioOverC.toFixed(10)),
    },
    rows,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
