#!/usr/bin/env node

// EP-1021 finite consistency study (resolved problem):
// k=3 proxy via C6-free graphs, scanning edge growth profile.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function pathLen5Exists(adj, src, dst) {
  const n = adj.length;
  const used = new Uint8Array(n);
  used[src] = 1;

  function dfs(u, depth) {
    if (depth === 5) return u === dst;
    for (let v = 0; v < n; v += 1) {
      if (!adj[u][v]) continue;
      if (used[v]) continue;
      used[v] = 1;
      const ok = dfs(v, depth + 1);
      used[v] = 0;
      if (ok) return true;
    }
    return false;
  }

  return dfs(src, 0);
}

function c6FreeGreedyGraph(n, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }

  let m = 0;
  for (const [u, v] of edges) {
    if (pathLen5Exists(adj, u, v)) continue;
    adj[u][v] = 1;
    adj[v][u] = 1;
    m += 1;
  }

  return { m };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const rows = [];
  for (const n of [16, 20, 24, 28, 32, 36, 40, 48, 56]) {
    const trials = 20 * depth;
    let best = -1;
    let avg = 0;
    for (let t = 0; t < trials; t += 1) {
      const rng = makeRng((20260314 ^ (1021 * 104729) ^ (n * 12289) ^ t) >>> 0);
      const g = c6FreeGreedyGraph(n, rng);
      avg += g.m;
      if (g.m > best) best = g.m;
    }
    avg /= trials;
    rows.push({
      n,
      trials,
      best_c6_free_edge_count_found: best,
      mean_c6_free_edge_count_found: Number(avg.toFixed(6)),
      n_to_7_over_6: Number((n ** (7 / 6)).toFixed(8)),
      ratio_best_over_n_7_over_6: Number((best / (n ** (7 / 6))).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1021',
    script: 'ep1021.mjs',
    method: 'deeper_C6_free_greedy_growth_profile_for_k3_proxy',
    warning: 'Finite C6-free consistency check only; theorem-level resolution comes from literature.',
    params: { depth },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
