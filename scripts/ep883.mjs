#!/usr/bin/env node
import fs from 'fs';

// EP-883 finite proxy:
// Use inferred model G(A) on vertices [1..n], edge {u,v} iff |u-v| in A.
// Check odd cycle coverage at threshold size.

const OUT = process.env.OUT || 'data/ep883_standalone_deeper.json';
const N_LIST = [60, 90, 120];
const TRIALS = 120;

function makeRng(seed = 883_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function threshold(n) {
  return Math.floor(n / 2) + Math.floor(n / 3) - Math.floor(n / 6) + 1;
}

function sampleA(n, m) {
  const vals = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = vals.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = vals[i];
    vals[i] = vals[j];
    vals[j] = t;
  }
  return new Set(vals.slice(0, m));
}

function buildGraph(n, A) {
  const adj = Array.from({ length: n + 1 }, () => new Uint8Array(n + 1));
  for (let u = 1; u <= n; u += 1) {
    for (let v = u + 1; v <= n; v += 1) {
      if (A.has(Math.abs(u - v))) {
        adj[u][v] = 1;
        adj[v][u] = 1;
      }
    }
  }
  return adj;
}

function hasCycleLenL(adj, n, L) {
  const used = new Uint8Array(n + 1);
  const path = [];
  for (let s = 1; s <= n; s += 1) {
    path.length = 0;
    used.fill(0);
    path.push(s);
    used[s] = 1;
    function dfs(depth) {
      if (depth === L) {
        const a = path[path.length - 1];
        return adj[a][s] === 1;
      }
      const last = path[path.length - 1];
      for (let v = 1; v <= n; v += 1) {
        if (used[v]) continue;
        if (!adj[last][v]) continue;
        used[v] = 1;
        path.push(v);
        if (dfs(depth + 1)) return true;
        path.pop();
        used[v] = 0;
      }
      return false;
    }
    if (dfs(1)) return true;
  }
  return false;
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  const m = threshold(n);
  const oddLens = [];
  for (let l = 3; l <= Math.floor(n / 3) + 1; l += 2) oddLens.push(l);
  let fullCount = 0;
  let avgFoundRatio = 0;
  for (let t = 0; t < TRIALS; t += 1) {
    const A = sampleA(n, m);
    const G = buildGraph(n, A);
    let found = 0;
    for (const L of oddLens) if (hasCycleLenL(G, n, L)) found += 1;
    if (found === oddLens.length) fullCount += 1;
    avgFoundRatio += found / Math.max(1, oddLens.length);
  }
  rows.push({
    n,
    threshold_size: m,
    trials: TRIALS,
    odd_cycle_lengths_tested: oddLens,
    instances_with_all_tested_odd_cycles: fullCount,
    fraction_full: Number((fullCount / TRIALS).toPrecision(8)),
    avg_fraction_of_tested_odd_lengths_present: Number((avgFoundRatio / TRIALS).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-883',
  script: 'ep883.mjs',
  method: 'finite_inferred_graph_model_odd_cycle_coverage_at_threshold',
  warning: 'Uses inferred G(A) model from statement context; finite random evidence only.',
  params: { N_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
