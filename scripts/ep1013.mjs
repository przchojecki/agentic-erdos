#!/usr/bin/env node

// EP-1013 deep finite profile:
// smallest n found with triangle-free chi>=k via random constructive search.

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

function toAdjList(mat) {
  const n = mat.length;
  const g = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) if (mat[i][j]) g[i].push(j);
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
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const kTargets = [4, 5, 6, 7, 8];
  const nRange = [];
  for (let n = 11; n <= 38; n += 1) nRange.push(n);

  const found = Object.fromEntries(kTargets.map((k) => [k, null]));
  const witness = Object.fromEntries(kTargets.map((k) => [k, null]));

  for (const n of nRange) {
    const trials = Math.max(80, Math.floor((1400 * depth) / Math.max(1, n - 8)));
    for (let t = 0; t < trials; t += 1) {
      const rng = makeRng((20260314 ^ (1013 * 2654435761) ^ (n * 524287) ^ (t * 12289)) >>> 0);
      const mat = triangleFreeProcess(n, rng);
      const chi = chromaticNumberDSATUR(toAdjList(mat));
      for (const k of kTargets) {
        if (chi >= k && found[k] === null) {
          found[k] = n;
          witness[k] = { n, trial: t, chi };
        }
      }
      if (kTargets.every((k) => found[k] !== null)) break;
    }
    if (kTargets.every((k) => found[k] !== null)) break;
  }

  const rows = kTargets.map((k) => ({
    k,
    smallest_n_found_with_triangle_free_chi_ge_k: found[k],
    witness: witness[k],
    mycielski_constructive_upper_bound_2powk: (3 * (2 ** (k - 2)) - 1),
  }));

  const payload = {
    problem: 'EP-1013',
    script: 'ep1013.mjs',
    method: 'deep_triangle_free_chromatic_threshold_search_for_h3k_profile',
    warning: 'Finite random search gives upper-bound witnesses for h_3(k) only.',
    params: { kTargets, n_min: nRange[0], n_max: nRange[nRange.length - 1] },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
