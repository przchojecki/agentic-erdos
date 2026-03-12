#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function choose(arr, k, start, cur, out) {
  if (k === 0) {
    out.push(cur.slice());
    return;
  }
  for (let i = start; i <= arr.length - k; i += 1) {
    cur.push(arr[i]);
    choose(arr, k - 1, i + 1, cur, out);
    cur.pop();
  }
}

function hasMonoKss(M, s, mat) {
  const left = Array.from({ length: M }, (_, i) => i);
  const right = Array.from({ length: M }, (_, i) => i);
  const Ls = [];
  const Rs = [];
  choose(left, s, 0, [], Ls);
  choose(right, s, 0, [], Rs);

  for (const L of Ls) {
    for (const R of Rs) {
      let allRed = true;
      let allBlue = true;
      for (const i of L) {
        for (const j of R) {
          const red = mat[i][j] === 1;
          if (!red) allRed = false;
          if (red) allBlue = false;
          if (!allRed && !allBlue) break;
        }
        if (!allRed && !allBlue) break;
      }
      if (allRed || allBlue) return true;
    }
  }
  return false;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomProb(M, s, trials, rng) {
  let hit = 0;
  for (let t = 0; t < trials; t += 1) {
    const mat = Array.from({ length: M }, () => Array(M).fill(0));
    for (let i = 0; i < M; i += 1) {
      for (let j = 0; j < M; j += 1) mat[i][j] = rng() < 0.5 ? 0 : 1;
    }
    if (hasMonoKss(M, s, mat)) hit += 1;
  }
  return hit / trials;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 560);
const rows = [];

for (const [s, Mvals, trials] of [[2, [3,4,5,6,7], 1500], [3, [5,6,7,8,9,10], 1200]]) {
  for (const M of Mvals) {
    const p = randomProb(M, s, trials, rng);
    rows.push({
      s,
      M,
      host_edges: M * M,
      trials,
      monochromatic_Kss_probability: Number(p.toPrecision(8)),
      expected_threshold_reference_M_around: s * s,
    });
  }
}

const out = {
  problem: 'EP-560',
  script: path.basename(process.argv[1]),
  method: 'deep_random_coloring_threshold_profile_for_Kss_on_complete_bipartite_hosts',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
