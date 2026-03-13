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

function makeGraph(n) {
  return {
    n,
    adj: Array.from({ length: n }, () => new Uint8Array(n)),
    deg: new Int32Array(n),
    m: 0,
  };
}

function addEdge(G, u, v) {
  if (G.adj[u][v]) return;
  G.adj[u][v] = 1;
  G.adj[v][u] = 1;
  G.deg[u] += 1;
  G.deg[v] += 1;
  G.m += 1;
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function distAtMost(G, src, dst, lim) {
  if (src === dst) return true;
  const n = G.n;
  const q = new Int32Array(n);
  const d = new Int32Array(n).fill(-1);
  let head = 0;
  let tail = 0;
  q[tail++] = src;
  d[src] = 0;
  while (head < tail) {
    const v = q[head++];
    const dv = d[v];
    if (dv >= lim) continue;
    for (let u = 0; u < n; u += 1) {
      if (!G.adj[v][u] || d[u] >= 0) continue;
      d[u] = dv + 1;
      if (u === dst) return true;
      q[tail++] = u;
    }
  }
  return false;
}

function randomMaximalCycleFree(n, maxCycleLen, rng) {
  const G = makeGraph(n);
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  shuffle(edges, rng);
  for (const [u, v] of edges) {
    if (distAtMost(G, u, v, maxCycleLen - 1)) continue;
    addEdge(G, u, v);
  }
  return G;
}

function graphGirth(G) {
  const n = G.n;
  let best = Infinity;
  const q = new Int32Array(n);
  const dist = new Int32Array(n);
  const par = new Int32Array(n);
  for (let s = 0; s < n; s += 1) {
    dist.fill(-1);
    par.fill(-1);
    let head = 0;
    let tail = 0;
    q[tail++] = s;
    dist[s] = 0;
    while (head < tail) {
      const v = q[head++];
      if (2 * dist[v] + 1 >= best) continue;
      for (let u = 0; u < n; u += 1) {
        if (!G.adj[v][u]) continue;
        if (dist[u] < 0) {
          dist[u] = dist[v] + 1;
          par[u] = v;
          q[tail++] = u;
        } else if (par[v] !== u) {
          const cyc = dist[u] + dist[v] + 1;
          if (cyc < best) best = cyc;
        }
      }
    }
  }
  return Number.isFinite(best) ? best : 0;
}

function dsaturUpper(G) {
  const n = G.n;
  const col = new Int32Array(n).fill(-1);
  let used = 0;

  for (let step = 0; step < n; step += 1) {
    let bestV = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (col[v] >= 0) continue;
      const seen = new Uint8Array(n);
      let sat = 0;
      for (let u = 0; u < n; u += 1) {
        if (!G.adj[v][u] || col[u] < 0) continue;
        if (!seen[col[u]]) {
          seen[col[u]] = 1;
          sat += 1;
        }
      }
      if (sat > bestSat || (sat === bestSat && G.deg[v] > bestDeg)) {
        bestSat = sat;
        bestDeg = G.deg[v];
        bestV = v;
      }
    }
    const forbidden = new Uint8Array(n);
    for (let u = 0; u < n; u += 1) if (G.adj[bestV][u] && col[u] >= 0) forbidden[col[u]] = 1;
    let c = 0;
    while (forbidden[c]) c += 1;
    col[bestV] = c;
    if (c + 1 > used) used = c + 1;
  }

  return used;
}

function canColorWithC(G, c, nodeCap = 250000) {
  const n = G.n;
  const col = new Int32Array(n).fill(-1);
  let nodes = 0;
  let aborted = false;

  function chooseVertex() {
    let bestV = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (col[v] >= 0) continue;
      const seen = new Uint8Array(c);
      let sat = 0;
      for (let u = 0; u < n; u += 1) {
        if (!G.adj[v][u]) continue;
        const cu = col[u];
        if (cu >= 0 && !seen[cu]) {
          seen[cu] = 1;
          sat += 1;
        }
      }
      if (sat > bestSat || (sat === bestSat && G.deg[v] > bestDeg)) {
        bestSat = sat;
        bestDeg = G.deg[v];
        bestV = v;
      }
    }
    return bestV;
  }

  function dfs(colored) {
    if (aborted) return false;
    nodes += 1;
    if (nodes > nodeCap) {
      aborted = true;
      return false;
    }
    if (colored === n) return true;
    const v = chooseVertex();
    const forbidden = new Uint8Array(c);
    for (let u = 0; u < n; u += 1) if (G.adj[v][u] && col[u] >= 0) forbidden[col[u]] = 1;
    for (let color = 0; color < c; color += 1) {
      if (forbidden[color]) continue;
      col[v] = color;
      if (dfs(colored + 1)) return true;
      col[v] = -1;
    }
    return false;
  }

  const colorable = dfs(0);
  return { colorable, complete: !aborted, nodes };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 626);
const rows = [];
const g4LowerRows = [];

for (const [m, n, trials] of [[4, 42, 18], [4, 54, 14], [5, 50, 16], [5, 62, 12], [6, 60, 10]]) {
  let sumEdges = 0;
  let sumGirth = 0;
  let bestChiLB = 0;
  let bestChiUB = 1e9;
  let exact4Count = 0;
  let bestGirthWithExact4 = 0;

  for (let t = 0; t < trials; t += 1) {
    const G = randomMaximalCycleFree(n, m, rng);
    const girth = graphGirth(G);
    const chiUB = dsaturUpper(G);
    let chiLB = 1;
    for (let c = 2; c <= Math.min(4, chiUB - 1); c += 1) {
      const q = canColorWithC(G, c, 220000);
      if (!q.complete) break;
      if (!q.colorable) chiLB = c + 1;
      else break;
    }

    sumEdges += G.m;
    sumGirth += girth;
    if (chiLB > bestChiLB) bestChiLB = chiLB;
    if (chiUB < bestChiUB) bestChiUB = chiUB;
    if (chiLB >= 4 && chiUB === 4) {
      exact4Count += 1;
      if (girth > bestGirthWithExact4) bestGirthWithExact4 = girth;
    }
  }

  rows.push({
    m_forbidden_cycle_threshold: m,
    n,
    trials,
    avg_edges: Number((sumEdges / trials).toPrecision(8)),
    avg_girth: Number((sumGirth / trials).toPrecision(8)),
    best_chromatic_lower_bound_found: bestChiLB,
    strongest_chromatic_upper_bound_found: bestChiUB,
    exact_chi_eq_4_instances: exact4Count,
    best_girth_among_exact_chi_eq_4_instances: bestGirthWithExact4,
  });

  g4LowerRows.push({
    n,
    m_source: m,
    exact_chi_eq_4_instances: exact4Count,
    g4_n_lower_bound_from_samples: bestGirthWithExact4 > 0 ? bestGirthWithExact4 - 1 : 0,
    g4_over_log_n_lower_proxy:
      bestGirthWithExact4 > 0 ? Number(((bestGirthWithExact4 - 1) / Math.log(n)).toPrecision(8)) : 0,
  });
}

const out = {
  problem: 'EP-626',
  script: path.basename(process.argv[1]),
  method: 'deep_random_maximal_short_cycle_free_graphs_with_partial_exact_coloring_checks',
  params: {},
  rows,
  g4_lower_bound_proxy_rows: g4LowerRows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
