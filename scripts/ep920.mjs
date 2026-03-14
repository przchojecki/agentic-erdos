#!/usr/bin/env node

// EP-920
// f_k(n): maximum chromatic number of K_k-free n-vertex graphs.
// This standalone run focuses on k=4 finite evidence via:
// 1) deeper Mycielski chain profile,
// 2) randomized maximal K4-free graph search with exact chromatic computations.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function makeGraph(n) {
  return Array.from({ length: n }, () => []);
}

function addUndirectedEdge(adj, u, v) {
  adj[u].push(v);
  adj[v].push(u);
}

function edgeCount(adj) {
  let s = 0;
  for (const row of adj) s += row.length;
  return s / 2;
}

function makeC5() {
  const g = makeGraph(5);
  for (let i = 0; i < 5; i += 1) addUndirectedEdge(g, i, (i + 1) % 5);
  return g;
}

function mycielskian(adj) {
  const n = adj.length;
  const g = makeGraph(2 * n + 1);
  for (let u = 0; u < n; u += 1) {
    for (const v of adj[u]) if (u < v) addUndirectedEdge(g, u, v);
  }
  for (let i = 0; i < n; i += 1) {
    for (const nb of adj[i]) addUndirectedEdge(g, n + i, nb);
  }
  const w = 2 * n;
  for (let i = 0; i < n; i += 1) addUndirectedEdge(g, w, n + i);
  return g;
}

function toBitNeighbors(adj) {
  const n = adj.length;
  const bits = Array(n).fill(0n);
  for (let u = 0; u < n; u += 1) {
    let b = 0n;
    for (const v of adj[u]) b |= (1n << BigInt(v));
    bits[u] = b;
  }
  return bits;
}

function hasK4Bit(adj) {
  const n = adj.length;
  const bits = toBitNeighbors(adj);
  for (let a = 0; a < n; a += 1) {
    for (const b of adj[a]) {
      if (b <= a) continue;
      let common = bits[a] & bits[b];
      while (common) {
        const lsb = common & -common;
        const w = Number(lsb.toString(2).length - 1);
        common ^= lsb;
        if ((bits[w] & common) !== 0n) return true;
      }
    }
  }
  return false;
}

function chromaticNumberDSATUR(adj) {
  const n = adj.length;
  if (n === 0) return 0;

  const deg = adj.map((x) => x.length);
  const colors = new Int16Array(n);
  colors.fill(-1);

  // Greedy upper bound
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
      if (c >= 0 && c < k && !seen[c]) {
        seen[c] = 1;
        s += 1;
      }
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
      if (s > bestS || (s === bestS && deg[v] > bestD)) {
        bestV = v;
        bestS = s;
        bestD = deg[v];
      }
    }
    return bestV;
  }

  function dfs(colored, usedColors) {
    if (usedColors >= best) return;
    if (colored === n) {
      if (usedColors < best) best = usedColors;
      return;
    }

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

function randomMaximalK4Free(n, rng) {
  const adj = makeGraph(n);
  const bits = Array(n).fill(0n);

  const edges = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  }
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = edges[i];
    edges[i] = edges[j];
    edges[j] = tmp;
  }

  function canAdd(u, v) {
    const common = bits[u] & bits[v];
    let c = common;
    while (c) {
      const lsb = c & -c;
      const w = Number(lsb.toString(2).length - 1);
      c ^= lsb;
      if ((bits[w] & c) !== 0n) return false;
    }
    return true;
  }

  for (const [u, v] of edges) {
    if (!canAdd(u, v)) continue;
    addUndirectedEdge(adj, u, v);
    bits[u] |= (1n << BigInt(v));
    bits[v] |= (1n << BigInt(u));
  }

  return adj;
}

function main() {
  const t0 = Date.now();
  const seedBias = Number(process.env.SEED_BIAS || 0);

  // Part 1: Mycielski chain deeper than batch fragments.
  const mycRows = [];
  let G = makeC5();
  for (let it = 0; it <= 6; it += 1) {
    const n = G.length;
    const e = edgeCount(G);
    const chiExact = n <= 47 ? chromaticNumberDSATUR(G) : null;

    mycRows.push({
      iteration_from_C5: it,
      n,
      edge_count: e,
      k4_free_check: !hasK4Bit(G),
      chromatic_exact_if_computed: chiExact,
      chromatic_from_mycielski_theory: 3 + it,
      chi_over_n_to_2over3: Number(((3 + it) / (n ** (2 / 3))).toFixed(8)),
    });

    G = mycielskian(G);
  }

  // Part 2: randomized constructive lower profile for f_4(n).
  const searchNs = [20, 24, 28, 32, 36];
  const trialsPerN = 320;
  const randRows = [];

  for (const n of searchNs) {
    let bestChi = -1;
    let bestEdges = 0;
    let k4Passes = 0;

    for (let t = 0; t < trialsPerN; t += 1) {
      const rng = makeRng((20260314 ^ (n * 8191) ^ (t * 65537) ^ (seedBias * 104729)) >>> 0);
      const H = randomMaximalK4Free(n, rng);
      const k4Free = !hasK4Bit(H);
      if (k4Free) k4Passes += 1;

      const chi = chromaticNumberDSATUR(H);
      if (chi > bestChi || (chi === bestChi && edgeCount(H) > bestEdges)) {
        bestChi = chi;
        bestEdges = edgeCount(H);
      }
    }

    randRows.push({
      n,
      trials: trialsPerN,
      k4_free_verified_trials: k4Passes,
      best_chromatic_found: bestChi,
      best_edge_count_found: bestEdges,
      best_chi_over_n_to_2over3: Number((bestChi / (n ** (2 / 3))).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-920',
    script: 'ep920.mjs',
    method: 'deeper_mycielski_profile_plus_random_maximal_k4free_exact_chromatic_search',
    warning: 'Finite constructive evidence only; does not establish asymptotic lower bound exponents.',
    params: {
      mycielski_iterations: 7,
      searchNs,
      trialsPerN,
      seedBias,
    },
    mycielski_rows: mycRows,
    random_search_rows: randRows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
