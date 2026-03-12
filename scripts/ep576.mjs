#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const neigh = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        neigh[i].push(j);
        neigh[j].push(i);
      }
    }
  }
  return { n, adj, neigh };
}

// A concrete cube-like witness search for Q3 (8-vertex 3-regular cube structure).
function containsQ3CubeLike(G) {
  const { n, adj, neigh } = G;
  for (let r = 0; r < n; r += 1) {
    const nr = neigh[r];
    if (nr.length < 3) continue;
    for (let i = 0; i < nr.length; i += 1) {
      const u = nr[i];
      for (let j = i + 1; j < nr.length; j += 1) {
        const v = nr[j];
        for (let k = j + 1; k < nr.length; k += 1) {
          const w = nr[k];
          const xs = [];
          for (const x of neigh[u]) {
            if (x === r || x === u || x === v || x === w) continue;
            if (adj[v][x]) xs.push(x);
          }
          if (!xs.length) continue;
          const ys = [];
          for (const y of neigh[u]) {
            if (y === r || y === u || y === v || y === w) continue;
            if (adj[w][y]) ys.push(y);
          }
          if (!ys.length) continue;
          const zs = [];
          for (const z of neigh[v]) {
            if (z === r || z === u || z === v || z === w) continue;
            if (adj[w][z]) zs.push(z);
          }
          if (!zs.length) continue;
          for (const x of xs) {
            for (const y of ys) {
              if (y === x) continue;
              for (const z of zs) {
                if (z === x || z === y) continue;
                for (const t of neigh[x]) {
                  if (t === r || t === u || t === v || t === w || t === x || t === y || t === z) continue;
                  if (adj[y][t] && adj[z][t]) return true;
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 576);
const rows = [];

for (const [n, pList, trials] of [
  [32, [0.09, 0.11, 0.13, 0.15, 0.17], 500],
  [44, [0.07, 0.09, 0.11, 0.13, 0.15], 420],
  [56, [0.06, 0.08, 0.1, 0.12, 0.14], 340],
]) {
  let threshold = null;
  for (const p of pList) {
    let hit = 0;
    for (let t = 0; t < trials; t += 1) {
      const G = randomGraph(n, p, rng);
      if (containsQ3CubeLike(G)) hit += 1;
    }
    const prob = hit / trials;
    if (threshold === null && prob >= 0.5) threshold = p;
    rows.push({
      n,
      p,
      trials,
      contains_Q3_proxy_probability: Number(prob.toPrecision(8)),
    });
  }
  if (threshold !== null) {
    const e = threshold * choose2(n);
    rows.push({
      n,
      heuristic_threshold_p: threshold,
      heuristic_threshold_edges: Number(e.toPrecision(8)),
      threshold_edges_over_n_pow_1_5: Number((e / (n ** 1.5)).toPrecision(8)),
    });
  } else {
    rows.push({ n, heuristic_threshold_p: null });
  }
}

const out = {
  problem: 'EP-576',
  script: path.basename(process.argv[1]),
  method: 'deeper_random_graph_threshold_proxy_for_cube_Q3_detection',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
