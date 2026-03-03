#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-200 finite scan:
// exact longest arithmetic progression length among primes <= N.

const N_LIST = (process.env.N_LIST || '10000,20000,50000,100000,200000')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isInteger(x) && x >= 1000)
  .sort((a, b) => a - b);

function sieve(n) {
  const isPrime = new Uint8Array(n + 1);
  if (n >= 2) isPrime.fill(1, 2);
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let x = 2; x <= n; x += 1) if (isPrime[x]) primes.push(x);
  return { isPrime, primes };
}

function longestPrimeAP(N) {
  const { isPrime, primes } = sieve(N);
  const m = primes.length;

  let bestLen = 1;
  let best = null;

  for (let i = 0; i < m; i += 1) {
    const a = primes[i];
    const maxSpan = N - a;
    if (maxSpan <= 0) continue;

    // Need at least bestLen+1 terms to improve.
    const maxDiff = Math.floor(maxSpan / bestLen);
    for (let j = i + 1; j < m; j += 1) {
      const b = primes[j];
      const d = b - a;
      if (d > maxDiff) break;

      let t = a;
      let len = 0;
      while (t <= N && isPrime[t]) {
        len += 1;
        t += d;
      }

      if (len > bestLen) {
        bestLen = len;
        best = { start: a, diff: d, len };
      }
    }
  }

  return {
    N,
    prime_count: m,
    longest_ap_len: bestLen,
    best_progression: best,
    ratio_len_over_logN: Number((bestLen / Math.log(N)).toFixed(6)),
  };
}

const rows = [];
for (const N of N_LIST) {
  const t0 = Date.now();
  const row = longestPrimeAP(N);
  row.runtime_ms = Date.now() - t0;
  rows.push(row);
}

const out = {
  problem: 'EP-200',
  script: path.basename(process.argv[1]),
  method: 'exact_prime_AP_length_scan_with_primality_sieve',
  n_list: N_LIST,
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep200_prime_ap_maxlen_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
