#!/usr/bin/env node

// EP-986 finite k=3 proxy:
// Build triangle-free graphs via random triangle-free process, compute exact alpha(G),
// and extract Ramsey lower-bound witnesses R(3,alpha+1)>n.

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
    let makesTriangle = false;
    for (let w = 0; w < n; w += 1) {
      if (adj[u][w] && adj[v][w]) { makesTriangle = true; break; }
    }
    if (!makesTriangle) {
      adj[u][v] = 1;
      adj[v][u] = 1;
      m += 1;
    }
  }
  return { n, adj, m };
}

function maxCliqueSizeFromMasks(masks, n) {
  let best = 0;
  const all = (1n << BigInt(n)) - 1n;

  function popcnt(x) {
    let c = 0;
    let v = x;
    while (v) { v &= v - 1n; c += 1; }
    return c;
  }

  function firstBitIndex(x) {
    let idx = 0;
    let v = x;
    while ((v & 1n) === 0n) { v >>= 1n; idx += 1; }
    return idx;
  }

  function bronk(Rsz, P, X) {
    if (P === 0n && X === 0n) {
      if (Rsz > best) best = Rsz;
      return;
    }
    if (Rsz + popcnt(P) <= best) return;

    // pivot heuristic: choose from P|X
    const U = P | X;
    let u = -1;
    if (U) u = firstBitIndex(U & -U);
    const cand = u >= 0 ? (P & ~masks[u]) : P;

    let C = cand;
    while (C) {
      const vbit = C & -C;
      const v = firstBitIndex(vbit);
      bronk(Rsz + 1, P & masks[v], X & masks[v]);
      P &= ~vbit;
      X |= vbit;
      C &= ~vbit;
      if (Rsz + popcnt(P) <= best) return;
    }
  }

  bronk(0, all, 0n);
  return best;
}

function independenceNumber(adj) {
  const n = adj.length;
  const compMasks = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    let m = 0n;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      if (!adj[i][j]) m |= (1n << BigInt(j));
    }
    compMasks[i] = m;
  }
  return maxCliqueSizeFromMasks(compMasks, n);
}

function main() {
  const t0 = Date.now();

  const ns = [24, 28, 32, 36, 40, 44, 48, 56, 64];
  const trials = [260, 240, 220, 200, 180, 160, 140, 100, 80];
  const rows = [];

  for (let i = 0; i < ns.length; i += 1) {
    const n = ns[i];
    const T = trials[i];

    let best = null;
    for (let t = 0; t < T; t += 1) {
      const rng = makeRng((20260314 ^ (n * 1009) ^ (t * 65537)) >>> 0);
      const G = triangleFreeProcess(n, rng);
      const alpha = independenceNumber(G.adj);

      const cand = {
        n,
        trial: t,
        edges: G.m,
        alpha,
        edge_density: Number((G.m / (n * n)).toFixed(8)),
        implied_lower_bound: `R(3,${alpha + 1}) > ${n}`,
      };

      if (!best || alpha < best.alpha || (alpha === best.alpha && G.m > best.edges)) best = cand;
    }

    rows.push({
      n,
      trials: T,
      best_alpha_found: best.alpha,
      best_edges_among_best_alpha: best.edges,
      best_edge_density: best.edge_density,
      implied_lower_bound: best.implied_lower_bound,
    });
  }

  const payload = {
    problem: 'EP-986',
    script: 'ep986.mjs',
    method: 'deeper_triangle_free_process_with_exact_independence_search',
    warning: 'Finite constructive witnesses only; does not resolve general fixed-k conjecture.',
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
