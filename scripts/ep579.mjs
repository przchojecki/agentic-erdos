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

function hasK222(adj, n) {
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = 0; c < n; c += 1) {
        if (c === a || c === b) continue;
        for (let d = c + 1; d < n; d += 1) {
          if (d === a || d === b) continue;
          if (!adj[a][c] || !adj[a][d] || !adj[b][c] || !adj[b][d]) continue;
          for (let e = 0; e < n; e += 1) {
            if (e === a || e === b || e === c || e === d) continue;
            for (let f = e + 1; f < n; f += 1) {
              if (f === a || f === b || f === c || f === d) continue;
              if (adj[a][e] && adj[a][f] && adj[b][e] && adj[b][f]
                && adj[c][e] && adj[c][f] && adj[d][e] && adj[d][f]) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function greedyMaxK222Free(n, restarts, rng) {
  const E0 = allEdges(n);
  let best = { m: 0, alpha: n };
  for (let r = 0; r < restarts; r += 1) {
    const edges = E0.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = edges[i]; edges[i] = edges[j]; edges[j] = tmp;
    }
    const adj = Array.from({ length: n }, () => new Uint8Array(n));
    let m = 0;
    for (const [u, v] of edges) {
      adj[u][v] = 1; adj[v][u] = 1;
      if (hasK222(adj, n)) {
        adj[u][v] = 0; adj[v][u] = 0;
      } else {
        m += 1;
      }
    }
    const alpha = approxIndependenceByGreedy(adj, n, rng, 120);
    if (m > best.m || (m === best.m && alpha > best.alpha)) best = { m, alpha };
  }
  return best;
}

function approxIndependenceByGreedy(adj, n, rng, trials) {
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const V = Array.from({ length: n }, (_, i) => i);
    for (let i = V.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = V[i]; V[i] = V[j]; V[j] = tmp;
    }
    const indep = [];
    for (const v of V) {
      let ok = true;
      for (const u of indep) if (adj[u][v]) { ok = false; break; }
      if (ok) indep.push(v);
    }
    if (indep.length > best) best = indep.length;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 579);
const rows = [];

for (const [n, deltaTargets, restarts] of [
  [12, [0.18, 0.22, 0.26], 36],
  [14, [0.16, 0.2, 0.24], 28],
  [16, [0.14, 0.18, 0.22], 20],
]) {
  const maxEdges = (n * (n - 1)) / 2;
  const best = greedyMaxK222Free(n, restarts, rng);
  const deltaAchieved = best.m / (n * n);
  for (const delta of deltaTargets) {
    rows.push({
      n,
      delta_target: delta,
      restarts,
      best_k222_free_edges_found: best.m,
      achieved_density_m_over_n2: Number(deltaAchieved.toPrecision(8)),
      approx_alpha_best_graph: best.alpha,
      alpha_over_n: Number((best.alpha / n).toPrecision(8)),
      target_edges_delta_n2: Math.floor(delta * n * n),
      target_met: best.m >= Math.floor(delta * n * n),
    });
  }
}

const out = {
  problem: 'EP-579',
  script: path.basename(process.argv[1]),
  method: 'greedy_dense_K222_free_profile_with_independence_estimates',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
