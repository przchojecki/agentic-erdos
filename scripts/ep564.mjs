#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomColoring3Uniform(N, rng) {
  const col = new Map();
  for (let a = 0; a < N; a += 1) {
    for (let b = a + 1; b < N; b += 1) {
      for (let c = b + 1; c < N; c += 1) {
        col.set(`${a},${b},${c}`, rng() < 0.5 ? 0 : 1);
      }
    }
  }
  return col;
}

function hasMonoKn3(col, N, n, color) {
  const verts = Array.from({ length: N }, (_, i) => i);
  const cur = [];
  function dfs(start, need) {
    if (need === 0) {
      for (let i = 0; i < cur.length; i += 1) {
        for (let j = i + 1; j < cur.length; j += 1) {
          for (let k = j + 1; k < cur.length; k += 1) {
            if (col.get(`${cur[i]},${cur[j]},${cur[k]}`) !== color) return false;
          }
        }
      }
      return true;
    }
    for (let x = start; x <= verts.length - need; x += 1) {
      cur.push(verts[x]);
      if (dfs(x + 1, need - 1)) return true;
      cur.pop();
    }
    return false;
  }
  return dfs(0, n);
}

function randomAvoidHits(N, n, trials, rng) {
  let hits = 0;
  for (let t = 0; t < trials; t += 1) {
    const col = randomColoring3Uniform(N, rng);
    const bad = hasMonoKn3(col, N, n, 0) || hasMonoKn3(col, N, n, 1);
    if (!bad) hits += 1;
  }
  return hits;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 564);
const rows = [];

for (const [n, Ns, trials] of [[4, [9,10,11,12,13], 700], [5, [18,20,22], 160]]) {
  let bestN = 0;
  for (const N of Ns) {
    const hits = randomAvoidHits(N, n, trials, rng);
    if (hits > 0) bestN = Math.max(bestN, N);
    rows.push({ n_uniform_clique: n, N, trials, random_avoiding_hits: hits, avoiding_hit_rate: Number((hits / trials).toPrecision(8)) });
  }
  rows.push({ n_uniform_clique: n, summary_best_N_with_avoiding_hits: bestN });
}

const out = {
  problem: 'EP-564',
  script: path.basename(process.argv[1]),
  method: 'random_2color_3uniform_avoidance_profile_for_R3_n',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
