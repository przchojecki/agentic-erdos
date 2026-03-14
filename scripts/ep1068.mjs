#!/usr/bin/env node

// EP-1068 deep standalone computation:
// finite high-chromatic / connectivity tension on Mycielski-family proxies.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function bitIndexBigInt(b) {
  let i = 0;
  let x = b;
  while ((x & 1n) === 0n) {
    x >>= 1n;
    i += 1;
  }
  return i;
}

function adjacencyMasksFromEdgeList(n, edges) {
  const masks = Array(n).fill(0n);
  for (const [u, v] of edges) {
    masks[u] |= 1n << BigInt(v);
    masks[v] |= 1n << BigInt(u);
  }
  return masks;
}

function adjacencyListFromMasks(masks) {
  const n = masks.length;
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    let m = masks[i];
    while (m) {
      const b = m & -m;
      const j = bitIndexBigInt(b);
      m ^= b;
      adj[i].push(j);
    }
  }
  return adj;
}

function cycle5Masks() {
  return adjacencyMasksFromEdgeList(5, [[0,1],[1,2],[2,3],[3,4],[4,0]]);
}

function mycielski(masks) {
  const n = masks.length;
  const out = Array(2 * n + 1).fill(0n);

  for (let u = 0; u < n; u += 1) {
    let mu = masks[u];
    while (mu) {
      const b = mu & -mu;
      const v = bitIndexBigInt(b);
      mu ^= b;
      if (u < v) {
        out[u] |= 1n << BigInt(v);
        out[v] |= 1n << BigInt(u);
        out[u] |= 1n << BigInt(n + v);
        out[n + v] |= 1n << BigInt(u);
        out[v] |= 1n << BigInt(n + u);
        out[n + u] |= 1n << BigInt(v);
      }
    }
  }

  const w = 2 * n;
  for (let u = 0; u < n; u += 1) {
    out[n + u] |= 1n << BigInt(w);
    out[w] |= 1n << BigInt(n + u);
  }
  return out;
}

function kCoreNumber(masks) {
  const n = masks.length;
  const deg0 = Array(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    let d = 0;
    let m = masks[i];
    while (m) { m &= m - 1n; d += 1; }
    deg0[i] = d;
  }

  let best = 0;
  for (let k = 1; k <= n; k += 1) {
    const alive = new Uint8Array(n);
    alive.fill(1);
    const deg = deg0.slice();
    let changed = true;
    while (changed) {
      changed = false;
      for (let v = 0; v < n; v += 1) {
        if (!alive[v] || deg[v] >= k) continue;
        alive[v] = 0;
        changed = true;
        let m = masks[v];
        while (m) {
          const b = m & -m;
          const u = bitIndexBigInt(b);
          m ^= b;
          if (alive[u]) deg[u] -= 1;
        }
      }
    }
    let any = false;
    for (let i = 0; i < n; i += 1) if (alive[i]) { any = true; break; }
    if (any) best = k;
  }
  return best;
}

function isConnectedWithBan(masks, banned) {
  const n = masks.length;
  let s = -1;
  for (let i = 0; i < n; i += 1) if (!banned[i]) { s = i; break; }
  if (s < 0) return true;

  const seen = new Uint8Array(n);
  const q = [s];
  seen[s] = 1;
  for (let head = 0; head < q.length; head += 1) {
    const v = q[head];
    let m = masks[v];
    while (m) {
      const b = m & -m;
      const u = bitIndexBigInt(b);
      m ^= b;
      if (banned[u] || seen[u]) continue;
      seen[u] = 1;
      q.push(u);
    }
  }

  for (let i = 0; i < n; i += 1) if (!banned[i] && !seen[i]) return false;
  return true;
}

function randomConnectivityProbe(masks, rng, cutMax, trialsPerCut) {
  const n = masks.length;
  const verts = [...Array(n).keys()];
  let lower = 0;

  for (let t = 1; t <= Math.min(cutMax, n - 1); t += 1) {
    let disconnectedWitness = false;
    for (let tr = 0; tr < trialsPerCut; tr += 1) {
      for (let i = verts.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = verts[i]; verts[i] = verts[j]; verts[j] = tmp;
      }
      const banned = new Uint8Array(n);
      for (let i = 0; i < t; i += 1) banned[verts[i]] = 1;
      if (!isConnectedWithBan(masks, banned)) {
        disconnectedWitness = true;
        break;
      }
    }
    if (disconnectedWitness) return lower;
    lower = t;
  }
  return lower;
}

function inducedMasks(base, picked) {
  const n = picked.length;
  const out = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    const oi = picked[i];
    let m = 0n;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const oj = picked[j];
      if (((base[oi] >> BigInt(oj)) & 1n) !== 0n) m |= 1n << BigInt(j);
    }
    out[i] = m;
  }
  return out;
}

function chromaticDSATURBounded(adj, msBudget, nodeCap) {
  const n = adj.length;
  if (n === 0) return { best: 0, timedOut: false, nodes: 0 };

  const start = Date.now();
  const colors = new Int16Array(n);
  colors.fill(-1);
  const deg = adj.map((x) => x.length);

  // greedy upper bound
  const order = [...Array(n).keys()].sort((a, b) => deg[b] - deg[a]);
  const gcol = new Int16Array(n);
  gcol.fill(-1);
  let best = 0;
  for (const v of order) {
    const used = new Uint8Array(n + 1);
    for (const w of adj[v]) {
      const c = gcol[w];
      if (c >= 0) used[c] = 1;
    }
    let c = 0;
    while (used[c]) c += 1;
    gcol[v] = c;
    if (c + 1 > best) best = c + 1;
  }

  let nodes = 0;
  let timedOut = false;

  function satDeg(v) {
    const seen = new Uint8Array(best + 1);
    let s = 0;
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0 && !seen[c]) { seen[c] = 1; s += 1; }
    }
    return s;
  }

  function chooseVertex() {
    let bv = -1;
    let bs = -1;
    let bd = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const s = satDeg(v);
      if (s > bs || (s === bs && deg[v] > bd)) { bv = v; bs = s; bd = deg[v]; }
    }
    return bv;
  }

  function dfs(colored, usedColors) {
    nodes += 1;
    if (nodes >= nodeCap || Date.now() - start > msBudget) { timedOut = true; return; }
    if (usedColors >= best) return;
    if (colored === n) {
      best = usedColors;
      return;
    }

    const v = chooseVertex();
    const forbidden = new Uint8Array(best + 1);
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0) forbidden[c] = 1;
    }

    for (let c = 0; c < usedColors; c += 1) {
      if (forbidden[c]) continue;
      colors[v] = c;
      dfs(colored + 1, usedColors);
      colors[v] = -1;
      if (timedOut) return;
    }

    colors[v] = usedColors;
    dfs(colored + 1, usedColors + 1);
    colors[v] = -1;
  }

  dfs(0, 0);
  return { best, timedOut, nodes };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1068 ^ (depth * 65537));

  const g0 = cycle5Masks();
  const g1 = mycielski(g0);
  const g2 = mycielski(g1);
  const g3 = mycielski(g2);
  const fam = [g0, g1, g2, g3];

  const familyRows = fam.map((masks, idx) => {
    const adj = adjacencyListFromMasks(masks);
    const chi = chromaticDSATURBounded(adj, 15000, 20_000_000);
    return {
      graph: idx === 0 ? 'C5' : `Mycielski^${idx}(C5)`,
      n: masks.length,
      chi_exact_or_best: chi.best,
      chi_timed_out: chi.timedOut,
      dsatur_nodes: chi.nodes,
      k_core_max: kCoreNumber(masks),
      connectivity_lower_bound_random_cuts: randomConnectivityProbe(masks, rng, 8, 200 * depth),
    };
  });

  // Deep induced-subgraph profile on M3 (47 vertices).
  const base = g3;
  const universe = [...Array(base.length).keys()];
  const nList = [30, 34, 38, 42, 46];
  const samplesPerN = 70 * depth;
  const inducedRows = [];

  for (const n of nList) {
    let minRatio = 1;
    let meanRatio = 0;
    let maxRatio = 0;
    let timeouts = 0;

    for (let s = 0; s < samplesPerN; s += 1) {
      for (let i = universe.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        const t = universe[i]; universe[i] = universe[j]; universe[j] = t;
      }
      const picked = universe.slice(0, n);
      const masks = inducedMasks(base, picked);
      const adj = adjacencyListFromMasks(masks);
      const chi = chromaticDSATURBounded(adj, 1200, 2_000_000);
      if (chi.timedOut) timeouts += 1;

      // quick lower proxy for alpha: n/chi upper relation is crude, but for reporting keep independence proxy via greedy.
      const ratio = 1 / chi.best;
      if (ratio < minRatio) minRatio = ratio;
      if (ratio > maxRatio) maxRatio = ratio;
      meanRatio += ratio;
    }

    inducedRows.push({
      n,
      samples: samplesPerN,
      min_one_over_chi_found: Number(minRatio.toFixed(8)),
      mean_one_over_chi_found: Number((meanRatio / samplesPerN).toFixed(8)),
      max_one_over_chi_found: Number(maxRatio.toFixed(8)),
      dsatur_timeouts: timeouts,
    });
  }

  const payload = {
    problem: 'EP-1068',
    script: 'ep1068.mjs',
    method: 'deep_mycielski_family_connectivity_chromatic_tension_with_induced_sampling',
    warning: 'Finite proxy only; does not settle infinite countable-subgraph connectivity statement.',
    params: { depth, base_graph_n: g3.length, samplesPerN },
    rows: [
      {
        family_rows: familyRows,
        induced_rows: inducedRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
