#!/usr/bin/env node

// EP-1070 deep standalone computation:
// heavy finite proxy by gluing many Moser-spindle components,
// then exact MIS on resulting graphs.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function bitIndex(b) {
  let i = 0;
  let x = b;
  while ((x & 1n) === 0n) { x >>= 1n; i += 1; }
  return i;
}

function popcnt(x) {
  let c = 0;
  let v = x;
  while (v) { v &= v - 1n; c += 1; }
  return c;
}

const SPINDLE_EDGES = [
  [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
  [0, 4], [0, 5], [6, 4], [6, 5], [4, 5], [1, 6],
];

function emptyGraph(n) {
  return Array(n).fill(0n);
}

function addEdge(masks, u, v) {
  masks[u] |= (1n << BigInt(v));
  masks[v] |= (1n << BigInt(u));
}

function glueSpindle(masks, attachTo, attachIdx) {
  const n0 = masks.length;
  const map = Array(7).fill(-1);
  map[attachIdx] = attachTo;
  for (let i = 0; i < 7; i += 1) {
    if (i === attachIdx) continue;
    map[i] = masks.length;
    masks.push(0n);
  }

  for (const [a, b] of SPINDLE_EDGES) {
    const u = map[a];
    const v = map[b];
    if (u !== v) addEdge(masks, u, v);
  }

  return masks.length - n0;
}

function randomSpindleGluing(targetN, rng, extraEdgeProb = 0.015) {
  const masks = emptyGraph(7);
  for (const [u, v] of SPINDLE_EDGES) addEdge(masks, u, v);

  while (masks.length + 6 <= targetN) {
    const attachTo = Math.floor(rng() * masks.length);
    const attachIdx = Math.floor(rng() * 7);
    glueSpindle(masks, attachTo, attachIdx);
  }

  // If needed, pad with isolated vertices to exact size.
  while (masks.length < targetN) masks.push(0n);

  // Add sparse random cross edges as a harder finite proxy.
  const n = masks.length;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (((masks[u] >> BigInt(v)) & 1n) !== 0n) continue;
      if (rng() < extraEdgeProb) addEdge(masks, u, v);
    }
  }

  return masks;
}

function complementMasks(masks) {
  const n = masks.length;
  const all = (1n << BigInt(n)) - 1n;
  const comp = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    comp[i] = (all ^ masks[i]) & ~(1n << BigInt(i));
  }
  return comp;
}

function greedyColorOrder(P, adj) {
  const order = [];
  const colors = [];
  let U = P;
  let color = 0;

  while (U) {
    color += 1;
    let Q = U;
    while (Q) {
      const vBit = Q & -Q;
      const v = bitIndex(vBit);
      order.push(v);
      colors.push(color);
      U &= ~vBit;
      Q &= ~vBit;
      Q &= ~adj[v];
    }
  }
  return { order, colors };
}

function maxClique(adj, budgetMs = 5000, nodeCap = 4_000_000) {
  const n = adj.length;
  let best = 0;
  let nodes = 0;
  let timedOut = false;
  const t0 = Date.now();

  function expand(P, size) {
    nodes += 1;
    if (nodes >= nodeCap || Date.now() - t0 > budgetMs) {
      timedOut = true;
      return;
    }
    if (!P) {
      if (size > best) best = size;
      return;
    }

    const { order, colors } = greedyColorOrder(P, adj);
    for (let idx = order.length - 1; idx >= 0; idx -= 1) {
      if (size + colors[idx] <= best) return;
      const v = order[idx];
      const vBit = 1n << BigInt(v);
      if ((P & vBit) === 0n) continue;
      expand(P & adj[v], size + 1);
      if (timedOut) return;
      P &= ~vBit;
    }
  }

  const all = n === 0 ? 0n : ((1n << BigInt(n)) - 1n);
  expand(all, 0);
  return { omega: best, timedOut, nodes, elapsed_ms: Date.now() - t0 };
}

function exactMIS(masks, budgetMs, nodeCap) {
  const comp = complementMasks(masks);
  const cl = maxClique(comp, budgetMs, nodeCap);
  return { alpha: cl.omega, timedOut: cl.timedOut, nodes: cl.nodes, elapsed_ms: cl.elapsed_ms };
}

function edgeCount(masks) {
  let s = 0;
  for (const m of masks) s += popcnt(m);
  return s / 2;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1070 ^ (depth * 65537));

  const nList = [49, 61, 73, 85];
  const trialsPerN = 12 * depth;
  const misBudgetMs = 120 + 25 * depth;
  const misNodeCap = 350_000 + 35_000 * depth;

  const rows = [];
  for (const n of nList) {
    let bestRatio = 1;
    let meanRatio = 0;
    let worstRatio = 0;
    let timeouts = 0;
    let bestAlpha = n;
    let bestM = 0;

    for (let t = 0; t < trialsPerN; t += 1) {
      const g = randomSpindleGluing(n, rng, 0.008 + 0.004 * ((t % 7) / 6));
      const mis = exactMIS(g, misBudgetMs, misNodeCap);
      if (mis.timedOut) timeouts += 1;
      const ratio = mis.alpha / n;
      meanRatio += ratio;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        bestAlpha = mis.alpha;
        bestM = edgeCount(g);
      }
      if (ratio > worstRatio) worstRatio = ratio;
    }

    rows.push({
      n,
      trials: trialsPerN,
      min_alpha_found: bestAlpha,
      min_alpha_over_n_found: Number(bestRatio.toFixed(8)),
      mean_alpha_over_n: Number((meanRatio / trialsPerN).toFixed(8)),
      max_alpha_over_n_found: Number(worstRatio.toFixed(8)),
      edge_count_of_best_instance: bestM,
      mis_timeouts: timeouts,
      mis_budget_ms: misBudgetMs,
      mis_node_cap: misNodeCap,
    });
  }

  const payload = {
    problem: 'EP-1070',
    script: 'ep1070.mjs',
    method: 'deep_spindle_gluing_randomized_family_with_exact_mis_branch_and_bound',
    warning: 'Finite non-geometric proxy family; not a proof for true unit-distance extremal constant.',
    params: { depth, nList, trialsPerN },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
