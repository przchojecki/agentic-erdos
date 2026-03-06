#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(limit) {
  const spf = new Int32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function factorParityIndices(x, spf, pToIdx) {
  const out = [];
  let v = x;
  while (v > 1) {
    const p = spf[v];
    let e = 0;
    while (v % p === 0) {
      v = Math.floor(v / p);
      e += 1;
    }
    if (e % 2 === 1) out.push(pToIdx.get(p));
  }
  return out;
}

function toggleWordBit(words, idx) {
  const w = idx >>> 5;
  const b = idx & 31;
  words[w] ^= 1 << b;
}

function wordsKey(words) {
  const bytes = new Uint8Array(words.buffer, words.byteOffset, words.byteLength);
  return Buffer.from(bytes).toString('base64');
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

const NMAX = Number(process.env.NMAX || 70000);
const K_LIST = parseIntList(process.env.K_LIST, [4, 5, 6, 7, 8, 9, 10, 11, 12]);
const LEN_EXTRA = Number(process.env.LEN_EXTRA || 20);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const spf = sieveSpf(NMAX + LEN_EXTRA + 10);
const primes = [];
for (let p = 2; p <= NMAX + LEN_EXTRA + 5; p += 1) if (spf[p] === p) primes.push(p);
const pToIdx = new Map(primes.map((p, i) => [p, i]));
const nWords = Math.ceil(primes.length / 32);

const oddParityByN = Array(NMAX + LEN_EXTRA + 10);
oddParityByN[0] = [];
for (let n = 1; n < oddParityByN.length; n += 1) oddParityByN[n] = factorParityIndices(n, spf, pToIdx);

const rows = [];

for (const k of K_LIST) {
  const lenMin = k;
  const lenMax = k + LEN_EXTRA;
  const buckets = new Map();
  let intervalCount = 0;

  for (let L = lenMin; L <= lenMax; L += 1) {
    if (L > NMAX) break;
    const words = new Uint32Array(nWords);

    for (let n = 1; n <= L; n += 1) {
      for (const idx of oddParityByN[n]) toggleWordBit(words, idx);
    }

    const lastStart = NMAX - L + 1;
    for (let a = 1; a <= lastStart; a += 1) {
      if (a > 1) {
        for (const idx of oddParityByN[a - 1]) toggleWordBit(words, idx);
        for (const idx of oddParityByN[a + L - 1]) toggleWordBit(words, idx);
      }

      const key = wordsKey(words);
      const list = buckets.get(key) || [];
      list.push([a, a + L - 1, L]);
      buckets.set(key, list);
      intervalCount += 1;
    }
  }

  let witness = null;
  let witnessBucketSize = 0;
  for (const list of buckets.values()) {
    if (list.length < 2) continue;
    list.sort((x, y) => x[0] - y[0]);
    let bestR = list[0][1];
    let bestI = 0;
    for (let i = 1; i < list.length; i += 1) {
      if (list[i][0] > bestR) {
        witness = {
          I1: [list[bestI][0], list[bestI][1]],
          len1: list[bestI][2],
          I2: [list[i][0], list[i][1]],
          len2: list[i][2],
        };
        witnessBucketSize = list.length;
        break;
      }
      if (list[i][1] < bestR) {
        bestR = list[i][1];
        bestI = i;
      }
    }
    if (witness) break;
  }

  rows.push({
    k,
    len_range: [lenMin, lenMax],
    interval_count: intervalCount,
    distinct_parity_buckets: buckets.size,
    square_counterexample_found: witness,
    witness_bucket_size: witness ? witnessBucketSize : 0,
  });
}

const out = {
  problem: 'EP-930',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_square_counterexample_search_for_r2_interval_products',
  params: { NMAX, K_LIST, LEN_EXTRA },
  rows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
