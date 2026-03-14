#!/usr/bin/env node

// EP-1014 deep finite proxy for k=3:
// Constructive lower-bound profile for R(3,t) via triangle-free graphs
// with bounded independence number, then inspect successive ratios.

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
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }
  for (const [u, v] of edges) {
    let bad = false;
    for (let w = 0; w < n; w += 1) {
      if (adj[u][w] && adj[v][w]) { bad = true; break; }
    }
    if (!bad) {
      adj[u][v] = 1;
      adj[v][u] = 1;
    }
  }
  return adj;
}

function maxCliqueSizeFromMasks(masks, n) {
  let best = 0;
  const all = (1n << BigInt(n)) - 1n;

  function popcnt(x) { let c = 0; while (x) { x &= x - 1n; c += 1; } return c; }
  function firstBitIndex(x) { let i = 0; while ((x & 1n) === 0n) { x >>= 1n; i += 1; } return i; }

  function bronk(rSize, P, X) {
    if (P === 0n && X === 0n) { if (rSize > best) best = rSize; return; }
    if (rSize + popcnt(P) <= best) return;

    const U = P | X;
    let cand = P;
    if (U) {
      const u = firstBitIndex(U & -U);
      cand = P & ~masks[u];
    }

    let C = cand;
    while (C) {
      const vBit = C & -C;
      const v = firstBitIndex(vBit);
      bronk(rSize + 1, P & masks[v], X & masks[v]);
      P &= ~vBit;
      X |= vBit;
      C &= ~vBit;
      if (rSize + popcnt(P) <= best) return;
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
      if (i !== j && !adj[i][j]) m |= (1n << BigInt(j));
    }
    compMasks[i] = m;
  }
  return maxCliqueSizeFromMasks(compMasks, n);
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const nList = [];
  for (let n = 26; n <= 62; n += 2) nList.push(n);

  const bestNByT = new Map();
  for (let t = 8; t <= 20; t += 1) bestNByT.set(t, null);

  for (const n of nList) {
    const trials = Math.max(20, Math.floor((220 * depth) / Math.sqrt(n)));
    for (let tr = 0; tr < trials; tr += 1) {
      const rng = makeRng((20260314 ^ (1014 * 65537) ^ (n * 12289) ^ (tr * 104729)) >>> 0);
      const g = triangleFreeProcess(n, rng);
      const alpha = independenceNumber(g);
      for (let t = 8; t <= 20; t += 1) {
        if (alpha <= t) {
          const prev = bestNByT.get(t);
          if (prev === null || n > prev) bestNByT.set(t, n);
        }
      }
    }
  }

  const rows = [];
  for (let t = 8; t <= 20; t += 1) {
    const n = bestNByT.get(t);
    rows.push({
      t,
      best_witness_n_with_alpha_le_t: n,
      implied_constructive_lower_bound_for_R3_tplus1: n === null ? null : n + 1,
    });
  }

  const ratios = [];
  for (let t = 8; t < 20; t += 1) {
    const a = bestNByT.get(t);
    const b = bestNByT.get(t + 1);
    ratios.push({
      t_to_tplus1: `${t}->${t + 1}`,
      witness_ratio_n_tplus1_over_n_t: (a && b) ? Number((b / a).toFixed(8)) : null,
    });
  }

  const payload = {
    problem: 'EP-1014',
    script: 'ep1014.mjs',
    method: 'deep_constructive_ratio_proxy_for_R3t_via_triangle_free_independence_witnesses',
    warning: 'Constructive finite lower-bound proxy only; does not resolve asymptotic ratio limit.',
    params: { n_min: nList[0], n_max: nList[nList.length - 1], depth },
    rows,
    ratios,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
