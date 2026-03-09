#!/usr/bin/env node

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function popcount32(x) {
  let v = x >>> 0;
  let c = 0;
  while (v) {
    v &= v - 1;
    c += 1;
  }
  return c;
}

function randomGraphMasks(n, p, rng) {
  const g = new Int32Array(n);
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (rng() < p) {
        g[u] |= 1 << v;
        g[v] |= 1 << u;
      }
    }
  }
  return g;
}

function edgeList(g) {
  const n = g.length;
  const out = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if ((g[u] >>> v) & 1) out.push([u, v]);
    }
  }
  return out;
}

function removeEdge(g, u, v) {
  const h = Int32Array.from(g);
  h[u] &= ~(1 << v);
  h[v] &= ~(1 << u);
  return h;
}

function inducedDeleteVertex(g, delV) {
  const n = g.length;
  const map = [];
  for (let i = 0; i < n; i += 1) if (i !== delV) map.push(i);
  const m = n - 1;
  const h = new Int32Array(m);
  for (let i = 0; i < m; i += 1) {
    const oldI = map[i];
    let mask = 0;
    for (let j = 0; j < m; j += 1) {
      const oldJ = map[j];
      if ((g[oldI] >>> oldJ) & 1) mask |= 1 << j;
    }
    h[i] = mask;
  }
  return h;
}

function colorableWithK(g, k) {
  const n = g.length;
  const colors = new Int8Array(n);
  colors.fill(-1);

  function saturation(v) {
    let used = 0;
    let m = g[v];
    for (let u = 0; u < n; u += 1) {
      if (((m >>> u) & 1) && colors[u] >= 0) used |= 1 << colors[u];
    }
    return popcount32(used);
  }

  function chooseVertex() {
    let best = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const sat = saturation(v);
      const deg = popcount32(g[v]);
      if (sat > bestSat || (sat === bestSat && deg > bestDeg)) {
        best = v;
        bestSat = sat;
        bestDeg = deg;
      }
    }
    return best;
  }

  function dfs(colored) {
    if (colored === n) return true;
    const v = chooseVertex();

    let forbidden = 0;
    let m = g[v];
    for (let u = 0; u < n; u += 1) {
      if (((m >>> u) & 1) && colors[u] >= 0) forbidden |= 1 << colors[u];
    }

    for (let c = 0; c < k; c += 1) {
      if ((forbidden >>> c) & 1) continue;
      colors[v] = c;
      if (dfs(colored + 1)) return true;
      colors[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

function chromaticNumberAtMost5(g) {
  for (let k = 1; k <= 5; k += 1) {
    if (colorableWithK(g, k)) return k;
  }
  return 6;
}

function analyzeGraph(g) {
  const chi = chromaticNumberAtMost5(g);
  if (chi !== 4) return { chi, isVertexCritical4: false, criticalEdgeCount: null };

  for (let v = 0; v < g.length; v += 1) {
    const h = inducedDeleteVertex(g, v);
    if (!colorableWithK(h, 3)) {
      return { chi, isVertexCritical4: false, criticalEdgeCount: null };
    }
  }

  const edges = edgeList(g);
  let criticalEdgeCount = 0;
  for (const [u, v] of edges) {
    const h = removeEdge(g, u, v);
    if (colorableWithK(h, 3)) criticalEdgeCount += 1;
  }

  return { chi, isVertexCritical4: true, criticalEdgeCount, edgeCount: edges.length };
}

function main() {
  const seed = Number(process.env.SEED || process.argv[2] || 20260307);
  const trialsPerN = Number(process.env.TRIALS || process.argv[3] || 12000);
  const nList = (process.env.N_LIST || process.argv[4] || '10,11,12,13,14')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 6 && x <= 20);

  const rng = makeRng(seed >>> 0);
  const rows = [];
  const candidateGraphs = [];

  for (const n of nList) {
    let sampled = 0;
    let chi4 = 0;
    let vertexCritical4 = 0;
    let noSingleCriticalEdge = 0;

    let bestMinCriticalEdges = Infinity;
    let bestNearMiss = null;

    for (let t = 0; t < trialsPerN; t += 1) {
      const p = 0.2 + 0.6 * rng();
      const g = randomGraphMasks(n, p, rng);
      sampled += 1;

      const result = analyzeGraph(g);
      if (result.chi !== 4) continue;
      chi4 += 1;
      if (!result.isVertexCritical4) continue;
      vertexCritical4 += 1;

      if (result.criticalEdgeCount < bestMinCriticalEdges) {
        bestMinCriticalEdges = result.criticalEdgeCount;
        bestNearMiss = {
          n,
          edge_count: result.edgeCount,
          critical_edge_count: result.criticalEdgeCount,
          adjacency_bitmasks: Array.from(g, (mask, i) => ({ v: i, mask: mask >>> 0 })),
        };
      }

      if (result.criticalEdgeCount === 0) {
        noSingleCriticalEdge += 1;
        if (candidateGraphs.length < 5) {
          candidateGraphs.push({
            n,
            edge_count: result.edgeCount,
            adjacency_bitmasks: Array.from(g, (mask, i) => ({ v: i, mask: mask >>> 0 })),
          });
        }
      }
    }

    rows.push({
      n,
      sampled_graphs: sampled,
      chi4_graphs: chi4,
      vertex_critical_chi4_graphs: vertexCritical4,
      vertex_critical_chi4_without_single_critical_edge: noSingleCriticalEdge,
      min_critical_edges_among_vertex_critical_chi4:
        Number.isFinite(bestMinCriticalEdges) ? bestMinCriticalEdges : null,
      near_miss_example: bestNearMiss,
    });

    process.stderr.write(`n=${n} done: sampled=${sampled}, vc4=${vertexCritical4}, no-single-critical=${noSingleCriticalEdge}\n`);
  }

  const out = {
    problem: 'EP-944',
    method: 'standalone_deep_random_search_vertex_critical_chi4_graphs',
    params: { seed, trials_per_n: trialsPerN, n_list: nList },
    rows,
    candidate_graphs_if_any: candidateGraphs,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
