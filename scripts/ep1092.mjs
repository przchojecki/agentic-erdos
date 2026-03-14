#!/usr/bin/env node

// EP-1092 deep standalone computation:
// Finite proxy for r=2: for induced subgraphs H on m vertices,
// edge-bipartization number b(H) = e(H) - maxcut(H).
// We evaluate b(H) on high-chromatic Mycielski graphs.

function emptyGraph(n) {
  return { n, adj: Array.from({ length: n }, () => new Uint8Array(n)) };
}

function addEdge(g, u, v) {
  if (u === v) return;
  g.adj[u][v] = 1;
  g.adj[v][u] = 1;
}

function c5Graph() {
  const g = emptyGraph(5);
  for (let i = 0; i < 5; i += 1) addEdge(g, i, (i + 1) % 5);
  return g;
}

function mycielski(g) {
  const n = g.n;
  const h = emptyGraph(2 * n + 1);
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if (g.adj[i][j]) addEdge(h, i, j);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (g.adj[i][j]) addEdge(h, i, n + j);
    }
  }
  const w = 2 * n;
  for (let i = 0; i < n; i += 1) addEdge(h, n + i, w);
  return h;
}

function edgeCount(g) {
  let m = 0;
  for (let i = 0; i < g.n; i += 1) for (let j = i + 1; j < g.n; j += 1) if (g.adj[i][j]) m += 1;
  return m;
}

function canColorWithK(g, k) {
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

  function dfs(pos) {
    if (pos === n) return true;
    const v = order[pos];
    const used = new Uint8Array(k);
    for (let u = 0; u < n; u += 1) if (g.adj[v][u] && col[u] >= 0) used[col[u]] = 1;
    for (let c = 0; c < k; c += 1) {
      if (used[c]) continue;
      col[v] = c;
      if (dfs(pos + 1)) return true;
      col[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

function chromaticLB(g) {
  if (!canColorWithK(g, 2)) {
    if (!canColorWithK(g, 3)) {
      if (!canColorWithK(g, 4)) return 5;
      return 4;
    }
    return 3;
  }
  return 2;
}

function inducedSubgraph(g, verts) {
  const h = emptyGraph(verts.length);
  for (let i = 0; i < verts.length; i += 1) {
    for (let j = i + 1; j < verts.length; j += 1) {
      if (g.adj[verts[i]][verts[j]]) addEdge(h, i, j);
    }
  }
  return h;
}

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

function randomSubset(n, k, rand) {
  const arr = [...Array(n).keys()];
  for (let i = 0; i < k; i += 1) {
    const j = i + Math.floor(rand() * (n - i));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, k);
}

function maxCutExact(g) {
  const n = g.n;
  const neighMask = new BigUint64Array(n);
  for (let i = 0; i < n; i += 1) {
    let mask = 0n;
    for (let j = 0; j < n; j += 1) if (g.adj[i][j]) mask |= 1n << BigInt(j);
    neighMask[i] = mask;
  }

  const lim = 1 << n;
  let best = 0;
  for (let s = 0; s < lim; s += 1) {
    let cut2 = 0;
    const S = BigInt(s);
    for (let i = 0; i < n; i += 1) {
      if (((s >> i) & 1) === 0) continue;
      const outsideMask = (~S) & ((1n << BigInt(n)) - 1n);
      const cross = neighMask[i] & outsideMask;
      cut2 += popcountBigInt(cross);
    }
    if (cut2 > best) best = cut2;
  }
  return best;
}

function popcountBigInt(x) {
  let y = x;
  let c = 0;
  while (y) {
    y &= y - 1n;
    c += 1;
  }
  return c;
}

function bipartizationEdgesExact(g) {
  const m = edgeCount(g);
  const mc = maxCutExact(g);
  return m - mc;
}

function evaluateGraph(name, g, mList, samplesPerM, rand) {
  const rows = [];
  for (const m of mList) {
    let best = -1;
    let sum = 0;
    let bestSample = null;

    for (let t = 0; t < samplesPerM; t += 1) {
      const S = randomSubset(g.n, m, rand);
      const h = inducedSubgraph(g, S);
      const b = bipartizationEdgesExact(h);
      sum += b;
      if (b > best) {
        best = b;
        bestSample = { vertices: S, edges: edgeCount(h) };
      }
    }

    rows.push({
      m,
      samples: samplesPerM,
      best_bipartization_edges_found: best,
      avg_bipartization_edges: Number((sum / samplesPerM).toFixed(10)),
      best_over_m: Number((best / m).toFixed(10)),
      best_over_m_logm: Number((best / (m * Math.log(Math.max(3, m)))).toFixed(10)),
      best_sample: bestSample,
    });
  }

  return {
    graph: name,
    n: g.n,
    edges: edgeCount(g),
    chromatic_lower_bound_exact_up_to_5: chromaticLB(g),
    rows,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const base = c5Graph();
  const g11 = mycielski(base);            // n=11, chi=4
  const g23 = mycielski(g11);             // n=23, chi>=5

  const mList = depth >= 4 ? [6, 7, 8, 9, 10, 11, 12] : [5, 6, 7, 8, 9, 10];
  const samplesPerM = depth >= 4 ? 1200 : 350;

  const rand = mulberry32(0x1092 ^ (depth * 77));

  const rows = [
    evaluateGraph('mycielski_C5_n11', g11, mList.filter((m) => m <= g11.n), samplesPerM, rand),
    evaluateGraph('mycielski2_C5_n23', g23, mList, samplesPerM, rand),
  ];

  const payload = {
    problem: 'EP-1092',
    script: 'ep1092.mjs',
    method: 'deep_sampling_of_induced_subgraph_edge_bipartization_numbers_on_high_chromatic_mycielski_graphs',
    warning: 'Finite sampled upper-envelope evidence only; not an exact extremal determination of f_2(m).',
    params: { depth, mList, samplesPerM },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
