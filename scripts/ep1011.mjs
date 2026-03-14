#!/usr/bin/env node

// EP-1011 deep finite search:
// maximize edges among triangle-free graphs with chi >= 4.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function triangleFreeProcess(n, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const edges = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  }
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }
  let m = 0;
  for (const [u, v] of edges) {
    let bad = false;
    for (let w = 0; w < n; w += 1) {
      if (adj[u][w] && adj[v][w]) { bad = true; break; }
    }
    if (!bad) {
      adj[u][v] = 1;
      adj[v][u] = 1;
      m += 1;
    }
  }
  return { adj, m };
}

function adjacencyListFromMatrix(mat) {
  const n = mat.length;
  const g = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) if (mat[i][j]) g[i].push(j);
  }
  return g;
}

function chromaticNumberDSATUR(adj) {
  const n = adj.length;
  if (n === 0) return 0;

  const deg = adj.map((x) => x.length);
  const colors = new Int16Array(n);
  colors.fill(-1);

  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]);
  const gcol = new Int16Array(n);
  gcol.fill(-1);
  let ub = 0;
  for (const v of order) {
    const used = new Uint8Array(n + 1);
    for (const w of adj[v]) {
      const c = gcol[w];
      if (c >= 0) used[c] = 1;
    }
    let c = 0;
    while (used[c]) c += 1;
    gcol[v] = c;
    if (c + 1 > ub) ub = c + 1;
  }

  let best = ub;

  function satDeg(v, k) {
    const seen = new Uint8Array(k);
    let s = 0;
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0 && c < k && !seen[c]) { seen[c] = 1; s += 1; }
    }
    return s;
  }

  function chooseVertex(k) {
    let bestV = -1;
    let bestS = -1;
    let bestD = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const s = satDeg(v, k);
      if (s > bestS || (s === bestS && deg[v] > bestD)) { bestV = v; bestS = s; bestD = deg[v]; }
    }
    return bestV;
  }

  function dfs(colored, usedColors) {
    if (usedColors >= best) return;
    if (colored === n) { if (usedColors < best) best = usedColors; return; }

    const v = chooseVertex(best);
    const forbidden = new Uint8Array(best);
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0) forbidden[c] = 1;
    }

    for (let c = 0; c < usedColors; c += 1) {
      if (forbidden[c]) continue;
      colors[v] = c;
      dfs(colored + 1, usedColors);
      colors[v] = -1;
    }

    if (usedColors + 1 < best) {
      colors[v] = usedColors;
      dfs(colored + 1, usedColors + 1);
      colors[v] = -1;
    }
  }

  dfs(0, 0);
  return best;
}

function main() {
  const t0 = Date.now();
  const rows = [];
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const ns = [11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28];
  const trialsByN = {
    11: 800 * depth,
    12: 800 * depth,
    13: 700 * depth,
    14: 700 * depth,
    15: 600 * depth,
    16: 600 * depth,
    18: 500 * depth,
    20: 450 * depth,
    22: 380 * depth,
    24: 320 * depth,
    26: 260 * depth,
    28: 220 * depth,
  };

  for (const n of ns) {
    const T = trialsByN[n];
    let bestEdges = -1;
    let bestChi = -1;
    let feasibleCount = 0;

    for (let t = 0; t < T; t += 1) {
      const rng = makeRng((20260314 ^ (1011 * 1315423911) ^ (n * 104729) ^ (t * 8191)) >>> 0);
      const G = triangleFreeProcess(n, rng);
      const chi = chromaticNumberDSATUR(adjacencyListFromMatrix(G.adj));
      if (chi >= 4) {
        feasibleCount += 1;
        if (G.m > bestEdges) {
          bestEdges = G.m;
          bestChi = chi;
        }
      }
    }

    rows.push({
      n,
      trials: T,
      feasible_chi_ge_4_trials: feasibleCount,
      best_edges_seen_with_chi_ge_4: bestEdges,
      chromatic_of_best_edge_witness: bestChi,
      mantel_cap_floor_n2_over_4: Math.floor((n * n) / 4),
      rwwy24_comparator_floor_n_minus_3_sq_over_4_plus_6: Math.floor(((n - 3) * (n - 3)) / 4) + 6,
    });
  }

  const payload = {
    problem: 'EP-1011',
    script: 'ep1011.mjs',
    method: 'deeper_triangle_free_chromatic4_extremal_edge_search',
    warning: 'Finite witness search only; non-detection is not a lower bound.',
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
