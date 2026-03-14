#!/usr/bin/env node

// EP-970
// Jacobsthal profile for squarefree moduli with exactly k prime factors.
// Compute j(n) exactly via periodic blocked residues modulo n.

function jacobsthalFromFactors(factors) {
  let n = 1;
  for (const p of factors) n *= p;

  const blocked = new Uint8Array(n);
  for (const p of factors) {
    for (let r = 0; r < n; r += p) blocked[r] = 1;
  }

  let maxRun = 0;
  let cur = 0;
  for (let i = 0; i < n; i += 1) {
    if (blocked[i]) {
      cur += 1;
      if (cur > maxRun) maxRun = cur;
    } else cur = 0;
  }

  // cyclic wrap
  let pref = 0;
  while (pref < n && blocked[pref]) pref += 1;
  let suff = 0;
  while (suff < n && blocked[n - 1 - suff]) suff += 1;
  if (pref + suff > maxRun) maxRun = pref + suff;

  return { n, j_of_n: maxRun + 1 };
}

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function rec(start, need) {
    if (need === 0) {
      out.push(cur.slice());
      return;
    }
    for (let i = start; i <= arr.length - need; i += 1) {
      cur.push(arr[i]);
      rec(i + 1, need - 1);
      cur.pop();
    }
  }
  rec(0, k);
  return out;
}

function main() {
  const t0 = Date.now();

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const nCap = 2_000_000;

  const primorialRows = [];
  let prod = 1;
  for (let k = 1; k <= 8; k += 1) {
    prod *= primes[k - 1];
    const factors = primes.slice(0, k);
    const out = jacobsthalFromFactors(factors);
    primorialRows.push({
      k,
      n: out.n,
      j_of_n: out.j_of_n,
      j_over_k2: Number((out.j_of_n / (k * k)).toFixed(8)),
      lower_witness_p_kplus1_minus_1: primes[k] ? primes[k] - 1 : null,
    });
  }

  const exhaustiveRows = [];
  for (let k = 2; k <= 7; k += 1) {
    const comb = combinations(primes, k);
    let best = { j: -1, n: -1, factors: [] };
    let tested = 0;

    for (const fac of comb) {
      let n = 1;
      for (const p of fac) n *= p;
      if (n > nCap) continue;
      const out = jacobsthalFromFactors(fac);
      tested += 1;
      if (out.j_of_n > best.j || (out.j_of_n === best.j && out.n < best.n)) {
        best = { j: out.j_of_n, n: out.n, factors: fac.slice() };
      }
    }

    exhaustiveRows.push({
      k,
      tested_squarefree_moduli: tested,
      n_cap: nCap,
      best_n: best.n,
      best_j_n: best.j,
      best_factorization: best.factors.join(' * '),
      best_j_over_k2: Number((best.j / (k * k)).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-970',
    script: 'ep970.mjs',
    method: 'deep_exact_jacobsthal_scan_for_squarefree_moduli_by_factor_count',
    warning: 'Finite squarefree-modulus profile only; full h(k) asymptotic remains open.',
    params: { primes, nCap },
    primorial_rows: primorialRows,
    exhaustive_rows: exhaustiveRows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
