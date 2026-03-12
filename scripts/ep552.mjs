#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function idxMat(N) {
  const idx = Array.from({ length: N }, () => Array(N).fill(-1));
  let e = 0;
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) idx[i][j] = idx[j][i] = e++;
  return idx;
}

function c4Exists(mask, N, red, idx) {
  for (let u = 0; u < N; u += 1) {
    for (let v = u + 1; v < N; v += 1) {
      let common = 0;
      for (let w = 0; w < N; w += 1) {
        if (w === u || w === v) continue;
        const b1 = ((mask >> BigInt(idx[u][w])) & 1n) === 1n;
        const b2 = ((mask >> BigInt(idx[v][w])) & 1n) === 1n;
        const c1 = red ? b1 : !b1;
        const c2 = red ? b2 : !b2;
        if (c1 && c2) {
          common += 1;
          if (common >= 2) return true;
        }
      }
    }
  }
  return false;
}

function blueStar(mask, N, leaves) {
  const deg = Array(N).fill(0);
  let e = 0;
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const red = ((mask >> BigInt(e)) & 1n) === 1n;
      if (!red) {
        deg[i] += 1;
        deg[j] += 1;
      }
      e += 1;
    }
  }
  return deg.some((d) => d >= leaves);
}

function exactR(nLeaves, capN) {
  for (let N = Math.max(4, nLeaves + 1); N <= capN; N += 1) {
    const E = (N * (N - 1)) / 2;
    const idx = idxMat(N);
    const total = 1n << BigInt(E);
    let avoid = false;
    for (let m = 0n; m < total; m += 1n) {
      if (!c4Exists(m, N, true, idx) && !blueStar(m, N, nLeaves)) {
        avoid = true;
        break;
      }
    }
    if (!avoid) return N;
  }
  return null;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomMask(E, rng) {
  let m = 0n;
  for (let e = 0; e < E; e += 1) if (rng() < 0.5) m |= 1n << BigInt(e);
  return m;
}

function randomHits(nLeaves, N, trials, rng) {
  const E = (N * (N - 1)) / 2;
  const idx = idxMat(N);
  let hits = 0;
  for (let t = 0; t < trials; t += 1) {
    const m = randomMask(E, rng);
    if (!c4Exists(m, N, true, idx) && !blueStar(m, N, nLeaves)) hits += 1;
  }
  return hits;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 552);

const exact_rows = [
  { n: 2, R_exact_cap7: exactR(2, 7), n_plus_ceil_sqrt_n: 4 },
  { n: 3, R_exact_cap7: exactR(3, 7), n_plus_ceil_sqrt_n: 5 },
  { n: 4, R_exact_cap7: exactR(4, 7), n_plus_ceil_sqrt_n: 6 },
];

const random_rows = [];
for (const [n, Ns, trials] of [[4, [7,8], 1200], [5, [8,9,10], 1000], [6, [10,11], 800]]) {
  for (const N of Ns) random_rows.push({ n, N, trials, random_avoiding_hits: randomHits(n, N, trials, rng) });
}

const out = {
  problem: 'EP-552',
  script: path.basename(process.argv[1]),
  method: 'exact_tiny_plus_deep_random_profile_for_R_C4_Sn',
  params: {},
  exact_rows,
  random_rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
