#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function triangleFreeGraph(n, edgeProb, rng) {
  const adj = Array.from({ length: n }, () => new Set());
  const edges = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (rng() > edgeProb) continue;
      let ok = true;
      for (const x of adj[u]) {
        if (adj[v].has(x)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      adj[u].add(v);
      adj[v].add(u);
      edges.push([u, v]);
    }
  }
  return { adj, m: edges.length };
}

function greedyIndependenceUpper(adj, restarts, rng) {
  const n = adj.length;
  let best = 0;
  for (let t = 0; t < restarts; t += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = ord[i]; ord[i] = ord[j]; ord[j] = tmp;
    }
    const chosen = new Uint8Array(n);
    let size = 0;
    for (const v of ord) {
      let ok = true;
      for (const u of adj[v]) {
        if (chosen[u]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        chosen[v] = 1;
        size += 1;
      }
    }
    if (size > best) best = size;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 544);
const tasks = [
  { k: 8, nTry: [24, 26, 28], graphTrials: 240, restarts: 240 },
  { k: 9, nTry: [30, 32, 34], graphTrials: 220, restarts: 220 },
  { k: 10, nTry: [36, 38, 40], graphTrials: 200, restarts: 200 },
];

const rows = [];
for (const task of tasks) {
  const details = [];
  for (const n of task.nTry) {
    let minAlphaFound = Infinity;
    let meanAlpha = 0;
    for (let t = 0; t < task.graphTrials; t += 1) {
      const p = Math.min(0.6, 0.18 + 8 / n);
      const G = triangleFreeGraph(n, p, rng);
      const alphaProxy = greedyIndependenceUpper(G.adj, task.restarts, rng);
      if (alphaProxy < minAlphaFound) minAlphaFound = alphaProxy;
      meanAlpha += alphaProxy;
    }
    details.push({
      n,
      graph_trials: task.graphTrials,
      min_independent_set_size_found_by_greedy_search: minAlphaFound,
      mean_independent_set_size_found_by_greedy_search: Number((meanAlpha / task.graphTrials).toPrecision(8)),
      certification_note: 'Greedy values are lower bounds for alpha(G), not certificates of alpha(G)<k.',
    });
  }
  rows.push({
    k: task.k,
    details,
  });
}

const out = {
  problem: 'EP-544',
  script: path.basename(process.argv[1]),
  method: 'triangle_free_random_search_proxy_for_adjacent_ramsey_lower_bounds',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
