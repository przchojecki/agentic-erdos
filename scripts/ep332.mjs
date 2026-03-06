#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 100);
  return out.length ? out : fallback;
}

function buildSetBits(name, N, rng) {
  const bits = new Uint8Array(N + 1);
  if (name === 'squares') {
    for (let n = 1; n * n <= N; n += 1) bits[n * n] = 1;
    return bits;
  }
  if (name === 'primes') {
    bits.fill(1, 2);
    for (let p = 2; p * p <= N; p += 1) {
      if (!bits[p]) continue;
      for (let q = p * p; q <= N; q += p) bits[q] = 0;
    }
    bits[0] = 0;
    bits[1] = 0;
    return bits;
  }
  if (name === 'random_04') {
    for (let i = 1; i <= N; i += 1) bits[i] = rng() < 0.04 ? 1 : 0;
    return bits;
  }
  if (name === 'random_10') {
    for (let i = 1; i <= N; i += 1) bits[i] = rng() < 0.1 ? 1 : 0;
    return bits;
  }
  if (name === 'powers_of_2') {
    for (let x = 1; x <= N; x *= 2) bits[x] = 1;
    return bits;
  }
  return bits;
}

function differenceFrequency(bits) {
  const N = bits.length - 1;
  const freq = new Uint32Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    let c = 0;
    for (let x = 1; x + d <= N; x += 1) c += bits[x] & bits[x + d];
    freq[d] = c;
  }
  return freq;
}

function maxGapOfCovered(freq, threshold) {
  let coveredCount = 0;
  let last = 0;
  let maxGap = 0;
  for (let d = 1; d < freq.length; d += 1) {
    if (freq[d] >= threshold) {
      coveredCount += 1;
      const gap = d - last - 1;
      if (gap > maxGap) maxGap = gap;
      last = d;
    }
  }
  const tail = (freq.length - 1) - last;
  if (tail > maxGap) maxGap = tail;
  return { maxGap, coveredCount };
}

function bitCount(bits) {
  let c = 0;
  for (let i = 1; i < bits.length; i += 1) c += bits[i];
  return c;
}

const N_LIST = parseIntList(process.env.N_LIST, [9000, 13000, 17000]);
const THRESHOLDS = parseIntList(process.env.THRESHOLDS, [1, 2, 3, 5, 8, 13, 21]);
const FAMILIES = (process.env.FAMILIES || 'squares,primes,powers_of_2,random_04,random_10')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const SEED = Number(process.env.SEED || 3322026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rng = makeRng(SEED);
const rows = [];
for (const N of N_LIST) {
  for (const family of FAMILIES) {
    const t1 = Date.now();
    const bits = buildSetBits(family, N, rng);
    const sizeA = bitCount(bits);
    const freq = differenceFrequency(bits);
    rows.push({
      N,
      family,
      size_A: sizeA,
      density: Number((sizeA / N).toFixed(8)),
      thresholds: THRESHOLDS.map((t) => ({ threshold: t, ...maxGapOfCovered(freq, t) })),
      runtime_ms: Date.now() - t1,
    });
  }
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-332',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_difference_frequency_gap_scan_via_shift_intersections',
  params: { N_LIST, THRESHOLDS, FAMILIES, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
