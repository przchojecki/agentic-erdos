#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(count) {
  // conservative bound for nth prime
  const n = Math.max(20, count);
  const bound = Math.ceil(n * (Math.log(n) + Math.log(Math.log(n)) + 3));
  const isPrime = new Uint8Array(bound + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= bound; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= bound; q += p) isPrime[q] = 0;
  }
  const out = [];
  for (let x = 2; x <= bound && out.length < count; x += 1) if (isPrime[x]) out.push(x);
  return out;
}

function makeSequence(kind, M) {
  const a = [];
  if (kind === 'integers') {
    for (let n = 1; n <= M; n += 1) a.push(n);
  } else if (kind === 'primes') {
    return sievePrimes(M);
  } else if (kind === 'squares') {
    for (let n = 1; n <= M; n += 1) a.push(n * n);
  } else if (kind === 'n_plus_sqrt_n') {
    for (let n = 1; n <= M; n += 1) a.push(n + Math.floor(Math.sqrt(n)));
  } else {
    for (let n = 1; n <= M; n += 1) a.push(n + Math.floor(n ** 0.65));
  }
  return a;
}

function intervalSumCounts(a, Xmax) {
  const pref = new Int32Array(a.length + 1);
  for (let i = 0; i < a.length; i += 1) pref[i + 1] = pref[i] + a[i];
  const cnt = new Uint32Array(Xmax + 1);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = i + 1; j <= a.length; j += 1) {
      const s = pref[j] - pref[i];
      if (s > Xmax) break;
      cnt[s] += 1;
    }
  }
  return cnt;
}

const BASE_CASES = [
  { kind: 'integers', M: 12000, Xmax: 4000000 },
  { kind: 'primes', M: 6500, Xmax: 4000000 },
  { kind: 'squares', M: 2400, Xmax: 4000000 },
  { kind: 'n_plus_sqrt_n', M: 9000, Xmax: 4000000 },
  { kind: 'n_plus_n_pow_0_65', M: 9000, Xmax: 4000000 },
];
const SCALE_STEPS = Number(process.env.SCALE_STEPS || 70);
const CASES = [];
for (let step = 0; step < SCALE_STEPS; step += 1) {
  const scale = 0.62 + (0.78 * step) / Math.max(1, SCALE_STEPS - 1);
  for (const c of BASE_CASES) {
    CASES.push({
      kind: c.kind,
      M: Math.max(200, Math.floor(c.M * scale)),
      Xmax: c.Xmax,
      scale: Number(scale.toFixed(4)),
    });
  }
}
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const c of CASES) {
  const t1 = Date.now();
  const a = makeSequence(c.kind, c.M);
  const cnt = intervalSumCounts(a, c.Xmax);
  let maxF = 0;
  let maxN = 0;
  let tailMin = Number.POSITIVE_INFINITY;
  let tailMinN = -1;
  let tailCovered = 0;
  for (let n = 1; n <= c.Xmax; n += 1) {
    if (cnt[n] > maxF) {
      maxF = cnt[n];
      maxN = n;
    }
    if (n > c.Xmax / 2) {
      if (cnt[n] < tailMin) {
        tailMin = cnt[n];
        tailMinN = n;
      }
      if (cnt[n] > 0) tailCovered += 1;
    }
  }
  const tailLen = c.Xmax / 2;
  rows.push({
    kind: c.kind,
    scale: c.scale,
    terms_used: c.M,
    Xmax: c.Xmax,
    max_f_n: maxF,
    argmax_n: maxN,
    min_f_on_tail_X_over_2_to_X: tailMin,
    argmin_tail_n: tailMinN,
    tail_positive_density: Number((tailCovered / tailLen).toFixed(6)),
    runtime_ms: Date.now() - t1,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-358',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_interval_sum_multiplicity_profiles_for_candidate_sequences',
  params: { CASES },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
