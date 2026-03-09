#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function buildOddCycleBlowup(t, d) {
  const L = 2 * t + 1;
  const q = Math.floor(d / 2);
  const sizes = Array.from({ length: L }, () => q);
  const offsets = [0];
  for (let i = 1; i < L; i += 1) offsets[i] = offsets[i - 1] + sizes[i - 1];
  const n = offsets[L - 1] + sizes[L - 1];
  const adj = Array.from({ length: n }, () => []);

  function v(part, idx) {
    return offsets[part] + idx;
  }

  for (let p = 0; p < L; p += 1) {
    const np = (p + 1) % L;
    for (let i = 0; i < sizes[p]; i += 1) {
      const a = v(p, i);
      for (let j = 0; j < sizes[np]; j += 1) {
        const b = v(np, j);
        adj[a].push(b);
        adj[b].push(a);
      }
    }
  }
  return adj;
}

function edgesOfGraph(adj) {
  const edges = [];
  for (let u = 0; u < adj.length; u += 1) {
    for (const v of adj[u]) if (u < v) edges.push([u, v]);
  }
  return edges;
}

function lineGraphDiameter(adj) {
  const edges = edgesOfGraph(adj);
  const m = edges.length;
  if (m <= 1) return 0;

  const inc = Array.from({ length: adj.length }, () => []);
  for (let i = 0; i < m; i += 1) {
    const [u, v] = edges[i];
    inc[u].push(i);
    inc[v].push(i);
  }

  const lg = Array.from({ length: m }, () => []);
  for (let v = 0; v < adj.length; v += 1) {
    const list = inc[v];
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        const a = list[i];
        const b = list[j];
        lg[a].push(b);
        lg[b].push(a);
      }
    }
  }

  let diam = 0;
  const dist = new Int32Array(m);
  const queue = new Int32Array(m);
  for (let s = 0; s < m; s += 1) {
    dist.fill(-1);
    let head = 0;
    let tail = 0;
    queue[tail++] = s;
    dist[s] = 0;
    while (head < tail) {
      const x = queue[head++];
      for (const y of lg[x]) {
        if (dist[y] !== -1) continue;
        dist[y] = dist[x] + 1;
        queue[tail++] = y;
      }
    }
    for (let i = 0; i < m; i += 1) if (dist[i] > diam) diam = dist[i];
  }
  return { diam, edgeCount: m };
}

const T_LIST = parseIntList(process.env.T_LIST, [2, 3, 4, 5]);
const D_LIST = parseIntList(
  process.env.D_LIST,
  [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];

for (const t of T_LIST) {
  for (const d of D_LIST) {
    if (d % 2 !== 0) continue;
    const G = buildOddCycleBlowup(t, d);
    const degMax = Math.max(...G.map((x) => x.length));
    const { diam, edgeCount } = lineGraphDiameter(G);
    rows.push({
      t,
      d,
      n_vertices: G.length,
      edge_count: edgeCount,
      formula_cycle_blowup_even_d: Number((((2 * t + 1) * d * d) / 4).toFixed(6)),
      max_degree: degMax,
      line_graph_diameter: diam,
    });
  }
}

const out = {
  problem: 'EP-934',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_line-graph_diameter_scan_for_odd-cycle_blowups',
  params: { T_LIST, D_LIST },
  rows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
