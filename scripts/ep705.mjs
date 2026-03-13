#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeGraph(n) {
  return { n, m: 0, neigh: Array.from({ length: n }, () => []) };
}

function addEdge(G, u, v) {
  G.neigh[u].push(v);
  G.neigh[v].push(u);
  G.m += 1;
}

function chromaticNumberExact(G) {
  const n = G.n;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => G.neigh[b].length - G.neigh[a].length);
  const col = Array(n).fill(-1);

  function canK(k, idx = 0) {
    if (idx === n) return true;
    const v = order[idx];
    const used = new Set();
    for (const u of G.neigh[v]) if (col[u] >= 0) used.add(col[u]);
    for (let c = 0; c < k; c += 1) {
      if (used.has(c)) continue;
      col[v] = c;
      if (canK(k, idx + 1)) return true;
      col[v] = -1;
    }
    return false;
  }

  for (let k = 1; k <= n; k += 1) if (canK(k)) return k;
  return n;
}

function girth(G) {
  let best = Infinity;
  for (let s = 0; s < G.n; s += 1) {
    const dist = Array(G.n).fill(-1);
    const par = Array(G.n).fill(-1);
    const q = [s];
    dist[s] = 0;
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (const v of G.neigh[u]) {
        if (dist[v] < 0) {
          dist[v] = dist[u] + 1;
          par[v] = u;
          q.push(v);
        } else if (par[u] !== v) {
          best = Math.min(best, dist[u] + dist[v] + 1);
        }
      }
    }
  }
  return Number.isFinite(best) ? best : null;
}

const t0 = Date.now();

// Standard 7-vertex Moser spindle graph (unit-distance, chi=4).
const G = makeGraph(7);
for (const [u, v] of [
  [0, 1], [0, 4], [0, 6],
  [1, 2], [1, 5],
  [2, 3], [2, 5],
  [3, 4], [3, 5], [3, 6],
  [4, 6],
]) addEdge(G, u, v);

const out = {
  problem: 'EP-705',
  script: path.basename(process.argv[1]),
  method: 'exact_coloring_and_girth_on_classical_unit_distance_witness',
  witness_name: 'Moser spindle',
  witness_vertices: G.n,
  witness_edges: G.m,
  chromatic_number_exact: chromaticNumberExact(G),
  girth: girth(G),
  literature_status: 'disproved',
  note: 'Modern results give arbitrarily large-girth unit-distance graphs with chromatic number at least 4.',
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
