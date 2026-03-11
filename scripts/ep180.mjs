#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function allEdges(n) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  return e;
}

function hasStar2(edges, n) {
  const deg = Array(n).fill(0);
  for (const [u, v] of edges) {
    deg[u] += 1;
    deg[v] += 1;
    if (deg[u] >= 2 || deg[v] >= 2) return true;
  }
  return false;
}

function has2K2(edges) {
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      const [a, b] = edges[i];
      const [c, d] = edges[j];
      const verts = new Set([a, b, c, d]);
      if (verts.size === 4) return true;
    }
  }
  return false;
}

function exByBruteforce(n, forbidStar, forbid2K2) {
  const E = allEdges(n);
  const m = E.length;
  let best = 0;
  const total = 1 << m;
  for (let mask = 0; mask < total; mask += 1) {
    const edges = [];
    for (let b = 0; b < m; b += 1) if ((mask >>> b) & 1) edges.push(E[b]);
    if (forbidStar && hasStar2(edges, n)) continue;
    if (forbid2K2 && has2K2(edges)) continue;
    if (edges.length > best) best = edges.length;
  }
  return best;
}

const N_LIST = (process.env.N_LIST || '4,5,6,7,8').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const n of N_LIST) {
  const exF = exByBruteforce(n, true, true);
  const exStar = exByBruteforce(n, true, false);
  const exMatch = exByBruteforce(n, false, true);
  rows.push({ n, ex_n_F_star_and_2K2: exF, ex_n_star_K1_2: exStar, ex_n_2K2: exMatch });
}

const out = {
  problem: 'EP-180',
  script: path.basename(process.argv[1]),
  method: 'exact_bruteforce_counterexample_family_verification',
  params: { N_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
