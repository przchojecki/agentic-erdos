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

function hasCycleLen(adj, n, len) {
  const vis = new Uint8Array(n);
  function dfs(start, v, depth, parent) {
    if (depth === len) return v === start;
    if (depth > len) return false;
    vis[v] = 1;
    for (const u of adj[v]) {
      if (u === parent) continue;
      if (depth + 1 < len && vis[u]) continue;
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

function greedyAvoidCycles(n, forbiddenLens, trials, rng) {
  const edges0 = allEdges(n);
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const edges = edges0.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = edges[i]; edges[i] = edges[j]; edges[j] = tmp;
    }
    const adj = Array.from({ length: n }, () => new Set());
    let m = 0;
    for (const [u, v] of edges) {
      adj[u].add(v); adj[v].add(u);
      let bad = false;
      for (const len of forbiddenLens) {
        if (hasCycleLen(adj, n, len)) { bad = true; break; }
      }
      if (bad) {
        adj[u].delete(v); adj[v].delete(u);
      } else {
        m += 1;
      }
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 575);
const rows = [];

for (const [k, nVals, trials] of [[2, [38, 50, 62], 28], [3, [44, 56, 68], 14]]) {
  const oddLen = 2 * k - 1;
  const evenLen = 2 * k;
  for (const n of nVals) {
    const exFamily = greedyAvoidCycles(n, [oddLen, evenLen], trials, rng);
    const exBip = greedyAvoidCycles(n, [evenLen], trials, rng);
    rows.push({
      k,
      n,
      trials,
      family_forbidden: [`C${oddLen}`, `C${evenLen}`],
      chosen_bipartite_member: `C${evenLen}`,
      best_edges_family: exFamily,
      best_edges_bip_member: exBip,
      ratio_bip_over_family: Number((exBip / Math.max(1, exFamily)).toPrecision(8)),
      gap_bip_minus_family: exBip - exFamily,
    });
  }
}

const out = {
  problem: 'EP-575',
  script: path.basename(process.argv[1]),
  method: 'finite_proxy_for_family_to_bip_member_extremal_comparison',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
