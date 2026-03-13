#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function cycleGraph(n) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    adj[i][j] = 1;
    adj[j][i] = 1;
  }
  return adj;
}

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const out = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      out[i][j] = 1;
      out[j][i] = 1;
      out[i][n + j] = 1;
      out[n + j][i] = 1;
      out[j][n + i] = 1;
      out[n + i][j] = 1;
    }
  }
  const z = 2 * n;
  for (let i = 0; i < n; i += 1) {
    out[n + i][z] = 1;
    out[z][n + i] = 1;
  }
  return out;
}

function dsaturUpper(adj) {
  const n = adj.length;
  const col = new Int16Array(n).fill(-1);
  let used = 0;
  for (let step = 0; step < n; step += 1) {
    let best = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (col[v] >= 0) continue;
      const seen = new Uint8Array(n);
      let sat = 0;
      let deg = 0;
      for (let u = 0; u < n; u += 1) {
        if (!adj[v][u]) continue;
        deg += 1;
        const cu = col[u];
        if (cu >= 0 && !seen[cu]) {
          seen[cu] = 1;
          sat += 1;
        }
      }
      if (sat > bestSat || (sat === bestSat && deg > bestDeg)) {
        best = v;
        bestSat = sat;
        bestDeg = deg;
      }
    }
    const usedC = new Uint8Array(n);
    for (let u = 0; u < n; u += 1) if (adj[best][u] && col[u] >= 0) usedC[col[u]] = 1;
    let c = 0;
    while (usedC[c]) c += 1;
    col[best] = c;
    if (c + 1 > used) used = c + 1;
  }
  return used;
}

function oneOddCycleVertices(adj) {
  const n = adj.length;
  const parent = new Int16Array(n);
  const depth = new Int16Array(n);
  const color = new Int8Array(n);
  const seen = new Uint8Array(n);

  for (let s = 0; s < n; s += 1) {
    if (seen[s]) continue;
    const q = [s];
    seen[s] = 1;
    parent[s] = -1;
    depth[s] = 0;
    color[s] = 0;

    for (let qi = 0; qi < q.length; qi += 1) {
      const v = q[qi];
      for (let u = 0; u < n; u += 1) {
        if (!adj[v][u]) continue;
        if (!seen[u]) {
          seen[u] = 1;
          parent[u] = v;
          depth[u] = depth[v] + 1;
          color[u] = color[v] ^ 1;
          q.push(u);
          continue;
        }
        if (parent[v] === u) continue;
        if (color[u] === color[v]) {
          const mark = new Uint8Array(n);
          let x = v;
          while (x >= 0) {
            mark[x] = 1;
            x = parent[x];
          }
          const cyc = [];
          x = u;
          while (!mark[x]) {
            cyc.push(x);
            x = parent[x];
          }
          const lca = x;
          cyc.push(lca);
          x = v;
          const tail = [];
          while (x !== lca) {
            tail.push(x);
            x = parent[x];
          }
          for (let i = 0; i < tail.length; i += 1) cyc.push(tail[i]);
          return Array.from(new Set(cyc));
        }
      }
    }
  }
  return [];
}

function inducedSubgraph(adj, verts) {
  const m = verts.length;
  const out = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      if (adj[verts[i]][verts[j]]) {
        out[i][j] = 1;
        out[j][i] = 1;
      }
    }
  }
  return out;
}

const t0 = Date.now();
const rows = [];
let A = cycleGraph(5);

for (let t = 0; t <= 5; t += 1) {
  const n = A.length;
  const chiUpper = dsaturUpper(A);
  const oddCycleVerts = oneOddCycleVertices(A);
  const induced = oddCycleVerts.length ? inducedSubgraph(A, oddCycleVerts) : [];
  const inducedChiUpper = induced.length ? dsaturUpper(induced) : 0;
  rows.push({
    construction: t === 0 ? 'C5' : `M^${t}(C5)`,
    n,
    known_chi_for_mycielski: 3 + t,
    chi_upper_computed: chiUpper,
    odd_cycle_vertex_count_found: oddCycleVerts.length,
    induced_chromatic_upper_on_found_odd_cycle_vertices: inducedChiUpper,
  });
  A = mycielski(A);
}

const out = {
  problem: 'EP-640',
  script: path.basename(process.argv[1]),
  method: 'mycielski_family_probe_for_odd_cycle_induced_chromatic_behavior',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
