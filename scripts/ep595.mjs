#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function allEdges(n) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  return e;
}

function hasK4(adj, n) {
  for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) {
    if (!adj[a][b]) continue;
    for (let c = b + 1; c < n; c += 1) {
      if (!adj[a][c] || !adj[b][c]) continue;
      for (let d = c + 1; d < n; d += 1) if (adj[a][d] && adj[b][d] && adj[c][d]) return true;
    }
  }
  return false;
}

function greedyDenseK4Free(n, restarts, rng) {
  const E0 = allEdges(n);
  let best = null;
  for (let r = 0; r < restarts; r += 1) {
    const edges = E0.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
    }
    const adj = Array.from({ length: n }, () => new Uint8Array(n));
    const kept = [];
    for (const [u, v] of edges) {
      adj[u][v] = 1; adj[v][u] = 1;
      if (hasK4(adj, n)) {
        adj[u][v] = 0; adj[v][u] = 0;
      } else {
        kept.push([u, v]);
      }
    }
    if (!best || kept.length > best.edges.length) best = { n, edges: kept, adj };
  }
  return best;
}

function triangleConstraints(G) {
  const { n, adj, edges } = G;
  const idx = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let e = 0; e < edges.length; e += 1) {
    const [u, v] = edges[e];
    idx[u][v] = e; idx[v][u] = e;
  }
  const tris = [];
  for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) {
    if (!adj[a][b]) continue;
    for (let c = b + 1; c < n; c += 1) {
      if (adj[a][c] && adj[b][c]) tris.push([idx[a][b], idx[a][c], idx[b][c]]);
    }
  }
  return tris;
}

function canColorNoMonoTriangle(G, k) {
  const m = G.edges.length;
  const tris = triangleConstraints(G);
  const onEdge = Array.from({ length: m }, () => []);
  for (let t = 0; t < tris.length; t += 1) {
    const [e1, e2, e3] = tris[t];
    onEdge[e1].push(t); onEdge[e2].push(t); onEdge[e3].push(t);
  }
  const col = Array(m).fill(-1);

  function okEdge(e, c) {
    for (const t of onEdge[e]) {
      const [a, b, d] = tris[t];
      const ca = a === e ? c : col[a];
      const cb = b === e ? c : col[b];
      const cd = d === e ? c : col[d];
      if (ca >= 0 && cb >= 0 && cd >= 0 && ca === cb && cb === cd) return false;
    }
    return true;
  }

  function chooseEdge() {
    let best = -1;
    let bestDeg = -1;
    for (let e = 0; e < m; e += 1) {
      if (col[e] !== -1) continue;
      const deg = onEdge[e].length;
      if (deg > bestDeg) { bestDeg = deg; best = e; }
    }
    return best;
  }

  function dfs(assigned) {
    if (assigned === m) return true;
    const e = chooseEdge();
    for (let c = 0; c < k; c += 1) {
      if (!okEdge(e, c)) continue;
      col[e] = c;
      if (dfs(assigned + 1)) return true;
      col[e] = -1;
    }
    return false;
  }

  return dfs(0);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 595);
const rows = [];

for (const [n, restarts] of [[10, 120], [11, 100], [12, 85]]) {
  const G = greedyDenseK4Free(n, restarts, rng);
  let minColors = null;
  for (let k = 1; k <= 6; k += 1) {
    if (canColorNoMonoTriangle(G, k)) { minColors = k; break; }
  }
  rows.push({
    n,
    restarts,
    edges_in_best_K4_free_sample: G.edges.length,
    triangles_in_sample: triangleConstraints(G).length,
    min_triangle_free_layers_found: minColors,
    min_layers_over_log_n: Number((minColors / Math.log(n)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-595',
  script: path.basename(process.argv[1]),
  method: 'finite_K4_free_decomposition_into_triangle_free_layers_exact_backtracking',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
