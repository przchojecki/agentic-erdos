#!/usr/bin/env node

// EP-1104 deep standalone computation:
// Search high-chromatic triangle-free graphs via random triangle-free process,
// then attempt exact chromatic verification on best-found instances.

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let z = t;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function emptyGraph(n) {
  return { n, adj: Array.from({ length: n }, () => new Uint8Array(n)) };
}

function addEdge(g, u, v) {
  if (u === v) return;
  g.adj[u][v] = 1;
  g.adj[v][u] = 1;
}

function edgeCount(g) {
  let m = 0;
  for (let i = 0; i < g.n; i += 1) for (let j = i + 1; j < g.n; j += 1) if (g.adj[i][j]) m += 1;
  return m;
}

function copyGraph(g) {
  const h = emptyGraph(g.n);
  for (let i = 0; i < g.n; i += 1) h.adj[i].set(g.adj[i]);
  return h;
}

function triangleFreeProcess(n, rand) {
  const g = emptyGraph(n);
  const edges = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  }
  for (let i = 0; i < edges.length; i += 1) {
    const j = i + Math.floor(rand() * (edges.length - i));
    const tmp = edges[i];
    edges[i] = edges[j];
    edges[j] = tmp;
  }

  for (const [u, v] of edges) {
    let common = false;
    for (let w = 0; w < n; w += 1) {
      if (g.adj[u][w] && g.adj[v][w]) {
        common = true;
        break;
      }
    }
    if (!common) addEdge(g, u, v);
  }

  return g;
}

function dsaturHeuristicChi(g) {
  const n = g.n;
  const color = new Int32Array(n).fill(-1);
  const sat = Array.from({ length: n }, () => new Set());
  const deg = new Int32Array(n);
  for (let v = 0; v < n; v += 1) {
    let d = 0;
    for (let u = 0; u < n; u += 1) d += g.adj[v][u];
    deg[v] = d;
  }

  let usedColors = 0;
  for (let step = 0; step < n; step += 1) {
    let vBest = -1;
    for (let v = 0; v < n; v += 1) {
      if (color[v] !== -1) continue;
      if (vBest === -1) {
        vBest = v;
        continue;
      }
      const s1 = sat[v].size;
      const s2 = sat[vBest].size;
      if (s1 > s2 || (s1 === s2 && deg[v] > deg[vBest])) vBest = v;
    }

    const forbidden = new Uint8Array(n + 1);
    for (let u = 0; u < n; u += 1) {
      if (g.adj[vBest][u] && color[u] >= 0) forbidden[color[u]] = 1;
    }
    let c = 0;
    while (forbidden[c]) c += 1;
    color[vBest] = c;
    if (c + 1 > usedColors) usedColors = c + 1;

    for (let u = 0; u < n; u += 1) {
      if (g.adj[vBest][u] && color[u] === -1) sat[u].add(c);
    }
  }

  return usedColors;
}

function canColorWithK(g, k, timeoutMs) {
  const t0 = Date.now();
  const n = g.n;

  const order = [...Array(n).keys()].sort((a, b) => {
    let da = 0;
    let db = 0;
    for (let i = 0; i < n; i += 1) {
      da += g.adj[a][i];
      db += g.adj[b][i];
    }
    return db - da;
  });

  const col = new Int8Array(n).fill(-1);
  let timedOut = false;
  let nodes = 0;

  function dfs(pos) {
    if (Date.now() - t0 > timeoutMs) {
      timedOut = true;
      return false;
    }
    nodes += 1;
    if (pos === n) return true;

    const v = order[pos];
    const used = new Uint8Array(k);
    for (let u = 0; u < n; u += 1) if (g.adj[v][u] && col[u] >= 0) used[col[u]] = 1;

    for (let c = 0; c < k; c += 1) {
      if (used[c]) continue;
      col[v] = c;
      if (dfs(pos + 1)) return true;
      col[v] = -1;
      if (timedOut) return false;
    }
    return false;
  }

  const ok = dfs(0);
  return { ok, timedOut, nodes, elapsedMs: Date.now() - t0 };
}

function exactOrBoundChi(g, heuristicChi, timeoutPerKMs) {
  // We know chi <= heuristicChi.
  // Try proving k-colorability for k=2..heuristicChi-1.
  let lower = 2;
  let upper = heuristicChi;
  const attempts = [];

  for (let k = 2; k < heuristicChi; k += 1) {
    const r = canColorWithK(g, k, timeoutPerKMs);
    attempts.push({ k, ...r });
    if (r.timedOut) {
      return { exact: false, lower_bound: lower, upper_bound: upper, attempts };
    }
    if (r.ok) {
      upper = Math.min(upper, k);
      return { exact: true, chi: upper, attempts };
    }
    lower = Math.max(lower, k + 1);
  }

  return { exact: true, chi: heuristicChi, attempts };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const nList = depth >= 4 ? [30, 40, 50, 60] : [24, 30, 36, 42];
  const perNBudgetMs = depth >= 4 ? 25000 : 8000;
  const timeoutPerKMs = depth >= 4 ? 1800 : 500;

  const rand = mulberry32(0x1104 ^ (depth * 123));

  const rows = [];
  for (const n of nList) {
    const tN0 = Date.now();
    let samples = 0;
    let bestChiHeu = 0;
    let bestGraph = null;
    let bestEdges = 0;

    while (Date.now() - tN0 < perNBudgetMs) {
      const g = triangleFreeProcess(n, rand);
      samples += 1;
      const chiHeu = dsaturHeuristicChi(g);
      if (chiHeu > bestChiHeu) {
        bestChiHeu = chiHeu;
        bestGraph = copyGraph(g);
        bestEdges = edgeCount(g);
      }
    }

    const cert = exactOrBoundChi(bestGraph, bestChiHeu, timeoutPerKMs);
    rows.push({
      n,
      time_budget_ms: perNBudgetMs,
      samples,
      best_chi_heuristic_found: bestChiHeu,
      best_graph_edges: bestEdges,
      exact_certification: cert,
      proxy_sqrt_n_over_log_n: Number(Math.sqrt(n / Math.log(n)).toFixed(10)),
      ratio_best_heuristic_over_proxy: Number((bestChiHeu / Math.sqrt(n / Math.log(n))).toFixed(10)),
      elapsed_ms_for_n: Date.now() - tN0,
    });
  }

  const payload = {
    problem: 'EP-1104',
    script: 'ep1104.mjs',
    method: 'deep_random_triangle_free_process_search_with_dsatur_and_partial_exact_chromatic_certification',
    warning: 'Finite random-search evidence only; asymptotic constants remain open.',
    params: { depth, nList, perNBudgetMs, timeoutPerKMs },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
