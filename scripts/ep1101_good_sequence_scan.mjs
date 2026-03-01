#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const X_MAX = Number(process.env.X_MAX || 400000);

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i <= n; i++) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
  return primes;
}

const primes = sievePrimes(2000);

function makeSeq(kind, m) {
  const out = [];
  for (let i = 0; i < m; i++) {
    const p = primes[i];
    if (kind === 'prime_squares') out.push(p * p);
    else if (kind === 'prime_cubes') out.push(p * p * p);
    else out.push(p ** (i % 2 === 0 ? 2 : 3));
  }
  return out;
}

function prefixProductsBigInt(u) {
  const pref = [1n];
  let cur = 1n;
  for (const x of u) {
    cur *= BigInt(x);
    pref.push(cur);
  }
  return pref;
}

function txAt(x, pref) {
  const xb = BigInt(x);
  let t = 0;
  while (t + 1 < pref.length && pref[t + 1] <= xb) t++;
  return t;
}

function cApprox(u) {
  let c = 1;
  for (const x of u) c *= 1 / (1 - 1 / x);
  return c;
}

function runOne(label, u) {
  const forbidden = new Uint8Array(X_MAX + 1);
  for (const ui of u) {
    for (let j = ui; j <= X_MAX; j += ui) forbidden[j] = 1;
  }

  // max gap among allowed numbers below x
  let prev = 0;
  let maxGap = 0;
  const q = [];
  const queries = [];
  for (let x = 2000; x <= X_MAX; x = Math.floor(x * 1.4)) queries.push(x);
  if (queries[queries.length - 1] !== X_MAX) queries.push(X_MAX);
  let qi = 0;

  for (let v = 1; v <= X_MAX; v++) {
    if (!forbidden[v]) {
      if (prev > 0) {
        const gap = v - prev;
        if (gap > maxGap) maxGap = gap;
      }
      prev = v;
    }

    if (qi < queries.length && v === queries[qi]) {
      q.push({ x: v, max_gap_below_x: maxGap });
      qi++;
    }
  }

  const pref = prefixProductsBigInt(u);
  const capprox = cApprox(u);
  let worst = -Infinity;
  let worstRow = null;

  for (const row of q) {
    const t = txAt(row.x, pref);
    const denom = t > 0 ? t * capprox : null;
    const ratio = denom ? row.max_gap_below_x / denom : null;
    const enriched = {
      ...row,
      t_x: t,
      c_approx: Number(capprox.toFixed(8)),
      ratio_gap_over_tx_c: ratio == null ? null : Number(ratio.toFixed(6)),
    };
    if (ratio != null && ratio > worst) {
      worst = ratio;
      worstRow = enriched;
    }
    row.t_x = t;
    row.ratio_gap_over_tx_c = ratio == null ? null : Number(ratio.toFixed(6));
  }

  return {
    sequence: label,
    u_prefix: u,
    c_approx: capprox,
    worst_ratio_observed: worstRow,
    query_rows: q,
  };
}

const seqs = [
  ['prime_squares', makeSeq('prime_squares', 10)],
  ['prime_cubes', makeSeq('prime_cubes', 10)],
  ['alternating_square_cube', makeSeq('alternating_square_cube', 10)],
];

const runs = seqs.map(([label, u]) => runOne(label, u));

const out = {
  script: path.basename(process.argv[1]),
  x_max: X_MAX,
  runs,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1101_good_sequence_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, runs: runs.length, x_max: X_MAX }, null, 2));
