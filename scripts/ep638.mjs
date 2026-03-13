#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function randomColoringHasMonoTriangle(n, colors, rng) {
  const col = Array.from({ length: n }, () => new Int16Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const c = Math.floor(rng() * colors);
      col[i][j] = c;
      col[j][i] = c;
    }
  }
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      const c1 = col[a][b];
      for (let c = b + 1; c < n; c += 1) {
        if (col[a][c] === c1 && col[b][c] === c1) return true;
      }
    }
  }
  return false;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 638);
const rows = [];

for (const [q, nVals, trials] of [
  [2, [5, 6, 7], 400],
  [3, [16, 20, 24, 28, 32], 260],
  [4, [36, 44, 52, 60], 200],
  [5, [58, 70, 82, 94], 160],
]) {
  for (const n of nVals) {
    let hit = 0;
    for (let t = 0; t < trials; t += 1) if (randomColoringHasMonoTriangle(n, q, rng)) hit += 1;
    rows.push({
      colors_q: q,
      n,
      trials,
      mono_triangle_frequency: Number((hit / trials).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-638',
  script: path.basename(process.argv[1]),
  method: 'finite_color_ramsey_profile_sampling_for_triangle_forcing',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
