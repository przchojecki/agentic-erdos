#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeGraph(n) {
  return { n, neigh: Array.from({ length: n }, () => []) };
}

function addEdge(G, u, v) {
  G.neigh[u].push(v);
  G.neigh[v].push(u);
}

function blowupCycleGraph(L, s) {
  const n = L * s;
  const G = makeGraph(n);
  const id = (b, i) => b * s + i;
  for (let b = 0; b < L; b += 1) {
    const nb = (b + 1) % L;
    for (let i = 0; i < s; i += 1) for (let j = 0; j < s; j += 1) addEdge(G, id(b, i), id(nb, j));
  }
  return G;
}

function diameter(G) {
  const { n, neigh } = G;
  let D = 0;
  for (let s = 0; s < n; s += 1) {
    const dist = Array(n).fill(-1);
    dist[s] = 0;
    const q = [s];
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (const v of neigh[u]) if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
    }
    for (const x of dist) if (x > D) D = x;
  }
  return D;
}

function minDegree(G) {
  let d = Infinity;
  for (const arr of G.neigh) if (arr.length < d) d = arr.length;
  return d;
}

const t0 = Date.now();
const rows = [];
const origCoeff = 16 / 7;
const amendCoeff = 7 / 3;

for (const [L, s] of [[9, 8], [13, 8], [17, 8], [21, 8], [13, 12], [17, 12], [21, 12]]) {
  const G = blowupCycleGraph(L, s);
  const n = G.n;
  const d = minDegree(G);
  const D = diameter(G);
  const coeff = (D * d) / n;
  rows.push({
    family: 'blowup_of_odd_cycle_triangle_free',
    L,
    s,
    n,
    min_degree: d,
    diameter: D,
    coeff_D_over_n_over_d: Number(coeff.toPrecision(8)),
    ratio_to_original_k4_free_coeff_16_over_7: Number((coeff / origCoeff).toPrecision(8)),
    ratio_to_amended_k4_free_coeff_7_over_3: Number((coeff / amendCoeff).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-612',
  script: path.basename(process.argv[1]),
  method: 'deeper_explicit_triangle_free_blowup_family_diameter_profiles',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
