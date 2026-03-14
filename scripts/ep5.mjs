#!/usr/bin/env node

// EP-5 deep standalone computation:
// empirical profile of normalized prime gaps over large prime-index ranges.

function nthPrimeUpper(n) {
  if (n < 6) return 20;
  const nn = n;
  return Math.ceil(nn * (Math.log(nn) + Math.log(Math.log(nn)) + 1.2));
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function quantileFromSorted(sortedVals, q) {
  if (sortedVals.length === 0) return null;
  const idx = Math.min(sortedVals.length - 1, Math.max(0, Math.floor(q * (sortedVals.length - 1))));
  return sortedVals[idx];
}

function summarize(values, binLo, binHi, binW) {
  const bins = new Uint32Array(Math.floor((binHi - binLo) / binW));
  let minV = Infinity;
  let maxV = -Infinity;
  let argMax = -1;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v < minV) minV = v;
    if (v > maxV) {
      maxV = v;
      argMax = i + 2; // prime-gap index n in p_{n+1}-p_n
    }
    if (v >= binLo && v < binHi) bins[Math.floor((v - binLo) / binW)] += 1;
  }
  const sorted = values.slice().sort((a, b) => a - b);
  let occupied = 0;
  for (const c of bins) if (c > 0) occupied += 1;
  return {
    min_value: Number(minV.toFixed(10)),
    max_value: Number(maxV.toFixed(10)),
    argmax_n: argMax,
    q01: Number(quantileFromSorted(sorted, 0.01).toFixed(10)),
    q05: Number(quantileFromSorted(sorted, 0.05).toFixed(10)),
    q50: Number(quantileFromSorted(sorted, 0.5).toFixed(10)),
    q95: Number(quantileFromSorted(sorted, 0.95).toFixed(10)),
    q99: Number(quantileFromSorted(sorted, 0.99).toFixed(10)),
    occupied_bins: occupied,
    total_bins: bins.length,
    fraction_lt_0_2: Number((sorted.filter((x) => x < 0.2).length / sorted.length).toFixed(10)),
    fraction_gt_6: Number((sorted.filter((x) => x > 6).length / sorted.length).toFixed(10)),
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const nPrimeTarget = Number(process.env.N_PRIMES || (depth >= 4 ? 2000000 : 700000));

  let lim = nthPrimeUpper(nPrimeTarget + 2);
  let primes = sieve(lim);
  while (primes.length < nPrimeTarget + 2) {
    lim = Math.ceil(lim * 1.2);
    primes = sieve(lim);
  }
  primes.length = nPrimeTarget + 2;

  const gLogN = [];
  const gLogP = [];
  for (let n = 2; n <= nPrimeTarget; n += 1) {
    const gap = primes[n] - primes[n - 1];
    gLogN.push(gap / Math.log(n));
    gLogP.push(gap / Math.log(primes[n - 1]));
  }

  const payload = {
    problem: 'EP-5',
    script: 'ep5.mjs',
    method: 'deep_empirical_profile_of_normalized_prime_gap_limit_points',
    warning:
      'Finite computations cannot prove full limit-point set equality; they only provide large-range distribution evidence.',
    params: {
      depth,
      nPrimeTarget,
      largest_prime_used: primes[primes.length - 1],
      sieve_limit: lim,
    },
    normalized_by_log_n: summarize(gLogN, 0, 20, 0.1),
    normalized_by_log_pn: summarize(gLogP, 0, 20, 0.1),
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
