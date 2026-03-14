#!/usr/bin/env node

// EP-1106 deep standalone computation:
// Lower-bound profile for F(n) using modular detection of primes q dividing p(k)
// for some 1<=k<=n.

function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let p = 2; p <= limit; p += 1) if (isPrime[p]) primes.push(p);
  return primes;
}

function generalizedPentagonalData(maxN) {
  const idx = [];
  const sgn = [];
  for (let m = 1; ; m += 1) {
    const g1 = (m * (3 * m - 1)) >> 1;
    const g2 = (m * (3 * m + 1)) >> 1;
    if (g1 > maxN && g2 > maxN) break;
    if (g1 <= maxN) {
      idx.push(g1);
      sgn.push(m % 2 === 1 ? 1 : -1);
    }
    if (g2 <= maxN) {
      idx.push(g2);
      sgn.push(m % 2 === 1 ? 1 : -1);
    }
  }
  return { idx, sgn };
}

function firstPartitionZeroModQ(maxN, q, gpIdx, gpSgn) {
  const p = new Int32Array(maxN + 1);
  p[0] = 1 % q;

  for (let n = 1; n <= maxN; n += 1) {
    let acc = 0;
    for (let t = 0; t < gpIdx.length; t += 1) {
      const g = gpIdx[t];
      if (g > n) break;
      const term = p[n - g];
      acc += gpSgn[t] * term;
      if (acc > 1e9 || acc < -1e9) acc %= q;
    }
    acc %= q;
    if (acc < 0) acc += q;
    p[n] = acc;
    if (acc === 0) return n;
  }

  return null;
}

function residueProfileUpToN(maxN, q, gpIdx, gpSgn) {
  const p = new Int32Array(maxN + 1);
  p[0] = 1 % q;
  let first = null;
  let last = null;
  let count = 0;
  let prev = 0;
  let maxGap = 0;

  for (let n = 1; n <= maxN; n += 1) {
    let acc = 0;
    for (let t = 0; t < gpIdx.length; t += 1) {
      const g = gpIdx[t];
      if (g > n) break;
      const term = p[n - g];
      acc += gpSgn[t] * term;
      if (acc > 1e9 || acc < -1e9) acc %= q;
    }
    acc %= q;
    if (acc < 0) acc += q;
    p[n] = acc;
    if (acc === 0) {
      count += 1;
      if (first === null) first = n;
      if (last !== null) {
        const gap = n - last;
        if (gap > maxGap) maxGap = gap;
      } else {
        maxGap = n;
      }
      last = n;
      prev = n;
    }
  }

  return { q, first_zero: first, last_zero: last, zero_count: count, max_gap_between_zeros: maxGap, maxN };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const maxN = Number(process.env.MAX_N || (depth >= 4 ? 18000 : 5000));
  const primeLimit = Number(process.env.PRIME_LIMIT || (depth >= 4 ? 5000 : 1200));

  const primes = sievePrimes(primeLimit);
  const { idx: gpIdx, sgn: gpSgn } = generalizedPentagonalData(maxN);

  const hitRows = [];
  let hitCount = 0;

  for (const q of primes) {
    const firstK = firstPartitionZeroModQ(maxN, q, gpIdx, gpSgn);
    if (firstK !== null && firstK >= 1) hitCount += 1;
    hitRows.push({ q, first_k_with_q_divides_p_k_up_to_maxN: firstK });
  }

  const probes = [100, 200, 400, 800, 1200, 2000, 3000, 5000, 8000, 10000, 12000, 14000, maxN]
    .filter((v, i, arr) => v <= maxN && arr.indexOf(v) === i);

  const probeRows = probes.map((n) => {
    let c = 0;
    for (const r of hitRows) {
      if (r.first_k_with_q_divides_p_k_up_to_maxN !== null && r.first_k_with_q_divides_p_k_up_to_maxN <= n) c += 1;
    }
    return {
      n,
      lower_bound_F_n_from_primes_le_primeLimit: c,
      lower_over_log_n: Number((c / Math.log(n)).toFixed(10)),
      lower_minus_n: c - n,
    };
  });

  const uncovered = hitRows.filter((r) => r.first_k_with_q_divides_p_k_up_to_maxN === null).map((r) => r.q);

  // Deep phase: full residue scans on a mixed subset of small/large primes.
  const fullScanCount = Math.min(primes.length, depth >= 4 ? 260 : 80);
  const head = primes.slice(0, Math.floor(fullScanCount / 2));
  const tail = primes.slice(Math.max(0, primes.length - (fullScanCount - head.length)));
  const fullScanPrimes = [...new Set([...head, ...tail])];
  const fullProfiles = fullScanPrimes.map((q) => residueProfileUpToN(maxN, q, gpIdx, gpSgn));

  const payload = {
    problem: 'EP-1106',
    script: 'ep1106.mjs',
    method: 'deep_modular_partition_recurrence_scan_for_prime_divisors_of_partition_values',
    warning: 'This gives rigorous lower bounds for F(n) from tested primes only, not exact F(n).',
    params: { depth, maxN, primeLimit, primesCount: primes.length },
    rows: [
      {
        maxN,
        primeLimit,
        primes_tested: primes.length,
        primes_hit_by_some_p_k_up_to_maxN: hitCount,
        uncovered_primes_with_no_hit_up_to_maxN: uncovered,
        probe_rows: probeRows,
        full_residue_profiles_count: fullProfiles.length,
        full_residue_profiles_first_80: fullProfiles.slice(0, 80),
        full_residue_profiles_last_80: fullProfiles.slice(Math.max(0, fullProfiles.length - 80)),
        hit_rows_first_80: hitRows.slice(0, 80),
        hit_rows_last_50: hitRows.slice(Math.max(0, hitRows.length - 50)),
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
