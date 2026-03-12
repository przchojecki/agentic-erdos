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

function hasC4(adj, n) {
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      let common = 0;
      for (let x = 0; x < n; x += 1) {
        if (x === a || x === b) continue;
        if (adj[a][x] && adj[b][x]) {
          common += 1;
          if (common >= 2) return true;
        }
      }
    }
  }
  return false;
}

function hasC6WithEdges(n, edgeSet) {
  const adj = Array.from({ length: n }, () => new Set());
  for (const e of edgeSet) {
    const [u, v] = e.split(',').map(Number);
    adj[u].add(v);
    adj[v].add(u);
  }
  const vis = new Uint8Array(n);
  function dfs(start, v, depth, parent) {
    if (depth === 6) return v === start;
    vis[v] = 1;
    for (const u of adj[v]) {
      if (u === parent) continue;
      if (depth + 1 < 6 && vis[u]) continue;
      if (dfs(start, u, depth + 1, v)) return true;
    }
    vis[v] = 0;
    return false;
  }
  for (let s = 0; s < n; s += 1) {
    vis.fill(0);
    if (dfs(s, s, 0, -1)) return true;
  }
  return false;
}

function greedyDenseC4Free(n, restarts, rng) {
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
      if (hasC4(adj, n)) {
        adj[u][v] = 0; adj[v][u] = 0;
      } else {
        kept.push([u, v]);
      }
    }
    if (!best || kept.length > best.edges.length) best = { n, edges: kept };
  }
  return best;
}

function twoColorAvoidMonoC6Heuristic(G, attempts, steps, rng) {
  const edges = G.edges;
  let found = 0;
  let bestMax = Infinity;
  for (let a = 0; a < attempts; a += 1) {
    const color = new Uint8Array(edges.length);
    for (let i = 0; i < edges.length; i += 1) color[i] = Math.floor(rng() * 2);

    function evalBad() {
      const red = new Set();
      const blue = new Set();
      for (let i = 0; i < edges.length; i += 1) {
        const [u, v] = edges[i];
        const key = `${u},${v}`;
        if (color[i] === 0) red.add(key); else blue.add(key);
      }
      const r = hasC6WithEdges(G.n, red) ? 1 : 0;
      const b = hasC6WithEdges(G.n, blue) ? 1 : 0;
      return r + b;
    }

    let bad = evalBad();
    if (bad < bestMax) bestMax = bad;
    if (bad === 0) { found += 1; continue; }

    for (let s = 0; s < steps; s += 1) {
      const e = Math.floor(rng() * edges.length);
      color[e] ^= 1;
      const bad2 = evalBad();
      if (bad2 <= bad || rng() < 0.01) {
        bad = bad2;
      } else {
        color[e] ^= 1;
      }
      if (bad < bestMax) bestMax = bad;
      if (bad === 0) { found += 1; break; }
    }
  }
  return { found, bestMax };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 596);
const rows = [];

for (const [n, restarts, attempts, steps] of [[14, 80, 140, 150], [16, 65, 120, 170], [18, 50, 100, 190]]) {
  const G = greedyDenseC4Free(n, restarts, rng);
  const res = twoColorAvoidMonoC6Heuristic(G, attempts, steps, rng);
  rows.push({
    n,
    restarts,
    attempts,
    local_steps_per_attempt: steps,
    edges_in_best_C4_free_sample: G.edges.length,
    two_colorings_with_no_monochromatic_C6_found: res.found,
    found_probability: Number((res.found / attempts).toPrecision(8)),
    best_mono_C6_count_seen: res.bestMax,
  });
}

const out = {
  problem: 'EP-596',
  script: path.basename(process.argv[1]),
  method: 'finite_C4_free_vs_monochromatic_C6_two_color_proxy',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
