#!/usr/bin/env node

// EP-971
// For modulus d and reduced residue class a (mod d), p(a,d) is least prime in class.
// Finite deep scan of classwise least-prime distribution and proportion above
// (1+c) phi(d) log d.

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function phiOf(d) {
  let n = d;
  let res = d;
  for (let p = 2; p * p <= n; p += 1) {
    if (n % p !== 0) continue;
    while (n % p === 0) n = Math.floor(n / p);
    res -= Math.floor(res / p);
  }
  if (n > 1) res -= Math.floor(res / n);
  return res;
}

function sievePrimes(N) {
  const isPrime = new Uint8Array(N + 1);
  if (N >= 2) {
    isPrime.fill(1, 2);
    for (let p = 2; p * p <= N; p += 1) {
      if (!isPrime[p]) continue;
      for (let m = p * p; m <= N; m += p) isPrime[m] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= N; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function leastPrimeByReducedClass(d, searchFactor, minCap) {
  const phi = phiOf(d);
  const base = phi * Math.log(d);
  const B = Math.max(minCap, Math.ceil(searchFactor * base));
  const primes = sievePrimes(B);

  const reduced = [];
  for (let a = 1; a <= d; a += 1) if (gcd(a, d) === 1) reduced.push(a % d);

  const pos = new Int32Array(d);
  pos.fill(-1);
  for (let i = 0; i < reduced.length; i += 1) pos[reduced[i]] = i;

  const least = new Int32Array(reduced.length);
  least.fill(0);
  let unresolved = reduced.length;

  for (const p of primes) {
    const r = p % d;
    const i = pos[r];
    if (i >= 0 && least[i] === 0) {
      least[i] = p;
      unresolved -= 1;
      if (unresolved === 0) break;
    }
  }

  return { d, phi, base, B, least, unresolved };
}

function summarizeRow(row, cList) {
  const vals = [];
  for (let i = 0; i < row.least.length; i += 1) if (row.least[i] > 0) vals.push(row.least[i]);
  vals.sort((a, b) => a - b);

  const frac = {};
  for (const c of cList) {
    const th = (1 + c) * row.base;
    let cnt = 0;
    for (const v of vals) if (v > th) cnt += 1;
    frac[String(c)] = Number((cnt / vals.length).toFixed(8));
  }

  const med = vals[Math.floor(vals.length / 2)];
  const q90 = vals[Math.floor(0.9 * (vals.length - 1))];
  const maxv = vals[vals.length - 1];

  return {
    d: row.d,
    phi_d: row.phi,
    classes_count: row.least.length,
    unresolved_classes: row.unresolved,
    search_bound_B: row.B,
    phi_log_d: Number(row.base.toFixed(8)),
    median_p_a_d: med,
    q90_p_a_d: q90,
    max_p_a_d: maxv,
    median_over_phi_log_d: Number((med / row.base).toFixed(8)),
    q90_over_phi_log_d: Number((q90 / row.base).toFixed(8)),
    max_over_phi_log_d: Number((maxv / row.base).toFixed(8)),
    fraction_above_1_plus_c_phi_log_d: frac,
  };
}

function main() {
  const t0 = Date.now();

  const dList = [];
  for (let d = 30; d <= 30000; d += 30) dList.push(d);
  dList.push(2310, 2730, 30030);
  const cList = [0, 0.1, 0.25, 0.5, 1.0];
  const searchFactor = 28;
  const minCap = 1000000;

  const rows = [];
  for (const d of dList) {
    const raw = leastPrimeByReducedClass(d, searchFactor, minCap);
    rows.push(summarizeRow(raw, cList));
  }

  const payload = {
    problem: 'EP-971',
    script: 'ep971.mjs',
    method: 'deep_least_prime_in_AP_distribution_scan_by_modulus',
    warning: 'Finite-modulus empirical scan only; does not prove all-large-d statement.',
    params: { dList, cList, searchFactor, minCap },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
