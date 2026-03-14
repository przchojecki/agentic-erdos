#!/usr/bin/env node

// EP-917
// Deeper verification for Dirac-type k=6 critical constructions:
// G_t = C_{2t+1} + C_{2t+1} (join of two odd cycles).

function makeGraph(n) {
  return Array.from({ length: n }, () => []);
}

function addEdge(adj, u, v) {
  adj[u].push(v);
  adj[v].push(u);
}

function cloneAdj(adj) {
  return adj.map((x) => x.slice());
}

function removeEdge(adj, u, v) {
  adj[u] = adj[u].filter((x) => x !== v);
  adj[v] = adj[v].filter((x) => x !== u);
}

function edgeList(adj) {
  const out = [];
  for (let u = 0; u < adj.length; u += 1) {
    for (const v of adj[u]) if (u < v) out.push([u, v]);
  }
  return out;
}

function diracJoinTwoOddCycles(t) {
  const m = 2 * t + 1;
  const n = 2 * m;
  const adj = makeGraph(n);

  for (let i = 0; i < m; i += 1) {
    addEdge(adj, i, (i + 1) % m);
    addEdge(adj, m + i, m + ((i + 1) % m));
  }

  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < m; j += 1) addEdge(adj, i, m + j);
  }

  return adj;
}

function isKColorable(adj, k) {
  const n = adj.length;
  const colors = new Int8Array(n);
  colors.fill(-1);

  const deg = adj.map((x) => x.length);

  function satDeg(v) {
    const seen = new Uint8Array(k);
    let c = 0;
    for (const w of adj[v]) {
      const col = colors[w];
      if (col >= 0 && !seen[col]) {
        seen[col] = 1;
        c += 1;
      }
    }
    return c;
  }

  function chooseVertex() {
    let best = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const s = satDeg(v);
      if (s > bestSat || (s === bestSat && deg[v] > bestDeg)) {
        best = v;
        bestSat = s;
        bestDeg = deg[v];
      }
    }
    return best;
  }

  function dfs(coloredCount) {
    if (coloredCount === n) return true;
    const v = chooseVertex();

    const banned = new Uint8Array(k);
    for (const w of adj[v]) {
      const cw = colors[w];
      if (cw >= 0) banned[cw] = 1;
    }

    for (let c = 0; c < k; c += 1) {
      if (banned[c]) continue;
      colors[v] = c;
      if (dfs(coloredCount + 1)) return true;
      colors[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

function main() {
  const t0 = Date.now();

  const tValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const rows = [];

  for (const t of tValues) {
    const G = diracJoinTwoOddCycles(t);
    const n = G.length;
    const E = edgeList(G);

    const colorable5_original = isKColorable(G, 5);
    const colorable6_original = isKColorable(G, 6);

    let allEdgeCritical = true;
    let tested = 0;
    let failingEdge = null;

    for (const [u, v] of E) {
      const H = cloneAdj(G);
      removeEdge(H, u, v);
      const colorable5 = isKColorable(H, 5);
      tested += 1;
      if (!colorable5) {
        allEdgeCritical = false;
        failingEdge = [u, v];
        break;
      }
    }

    rows.push({
      t,
      n,
      edge_count: E.length,
      edge_density_over_n2: Number((E.length / (n * n)).toFixed(8)),
      dirac_formula_4t2_plus8t_plus3: 4 * t * t + 8 * t + 3,
      original_5_colorable: colorable5_original,
      original_6_colorable: colorable6_original,
      all_edges_checked_5_colorable_after_deletion: allEdgeCritical,
      checked_edges: tested,
      failing_edge_if_any: failingEdge,
    });
  }

  const payload = {
    problem: 'EP-917',
    script: 'ep917.mjs',
    method: 'exact_k_colorability_based_full_edge_criticality_check_for_dirac_join_family',
    warning: 'Finite family verification only; does not prove global asymptotics for f_k(n).',
    params: { tValues },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
