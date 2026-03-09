#!/usr/bin/env node

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  if (n >= 0) isPrime[0] = 0;
  if (n >= 1) isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  return isPrime;
}

function main() {
  const N = Number(process.env.N || process.argv[2] || 5000000);

  const sigma = new Float64Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) sigma[m] += d;
    if (d % 1000000 === 0) process.stderr.write(`sigma divisor loop d=${d}\n`);
  }

  const svals = new Uint32Array(N + 1);
  let maxS = 0;
  for (let n = 1; n <= N; n += 1) {
    const s = Math.floor(sigma[n] - n);
    svals[n] = s;
    if (s > maxS) maxS = s;
  }

  const isPrime = sievePrimes(maxS + 5);

  const isPow2 = new Uint8Array(maxS + 1);
  for (let x = 1; x <= maxS; x <<= 1) isPow2[x] = 1;

  const isSquare = new Uint8Array(maxS + 1);
  for (let a = 0; a * a <= maxS; a += 1) isSquare[a * a] = 1;

  const isSum2Sq = new Uint8Array(maxS + 1);
  const lim = Math.floor(Math.sqrt(maxS));
  for (let a = 0; a <= lim; a += 1) {
    const a2 = a * a;
    for (let b = 0; a2 + b * b <= maxS; b += 1) {
      isSum2Sq[a2 + b * b] = 1;
    }
  }

  const scales = [
    100000,
    200000,
    500000,
    1000000,
    2000000,
    3000000,
    4000000,
    5000000,
    7000000,
    10000000,
  ].filter((x) => x <= N);
  const scaleSet = new Set(scales);

  let cPrime = 0;
  let cPow2 = 0;
  let cSquare = 0;
  let cSum2Sq = 0;
  const rows = [];

  for (let n = 1; n <= N; n += 1) {
    const s = svals[n];
    if (isPrime[s]) cPrime += 1;
    if (isPow2[s]) cPow2 += 1;
    if (isSquare[s]) cSquare += 1;
    if (isSum2Sq[s]) cSum2Sq += 1;

    if (scaleSet.has(n)) {
      rows.push({
        x: n,
        preimage_density_primes: Number((cPrime / n).toPrecision(8)),
        preimage_density_powers_of_2: Number((cPow2 / n).toPrecision(8)),
        preimage_density_squares: Number((cSquare / n).toPrecision(8)),
        preimage_density_sums_of_two_squares: Number((cSum2Sq / n).toPrecision(8)),
      });
      process.stderr.write(`x=${n} densities: prime=${(cPrime / n).toFixed(5)} pow2=${(cPow2 / n).toFixed(5)}\n`);
    }
  }

  const out = {
    problem: 'EP-955',
    method: 'standalone_preimage_density_profiles_for_sparse_target_sets_under_s_of_n',
    params: { N },
    max_s_n_over_range: maxS,
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
