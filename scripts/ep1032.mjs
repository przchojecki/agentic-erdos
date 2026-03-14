#!/usr/bin/env node

// EP-1032 deep finite proxy:
// search for 4-critical graphs and profile minimum degree growth.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const edges = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        edges.push([i, j]);
      }
    }
  }
  return { adj, edges };
}

function oddWheel(rimLen) {
  const n = rimLen + 1;
  const hub = rimLen;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < rimLen; i += 1) {
    const j = (i + 1) % rimLen;
    adj[i][j] = 1; adj[j][i] = 1;
    adj[i][hub] = 1; adj[hub][i] = 1;
  }
  return adj;
}

function adjacencyList(mat) {
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

  let best = n + 1;

  function satDeg(v, k) {
    const seen = new Uint8Array(k + 1);
    let s = 0;
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0 && !seen[c]) { seen[c] = 1; s += 1; }
    }
    return s;
  }

  function chooseVertex() {
    let bestV = -1;
    let bestS = -1;
    let bestD = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const s = satDeg(v, best);
      if (s > bestS || (s === bestS && deg[v] > bestD)) { bestV = v; bestS = s; bestD = deg[v]; }
    }
    return bestV;
  }

  function dfs(colored, usedColors) {
    if (usedColors >= best) return;
    if (colored === n) { best = usedColors; return; }
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
    }
    colors[v] = usedColors;
    dfs(colored + 1, usedColors + 1);
    colors[v] = -1;
  }

  dfs(0, 0);
  return best;
}

function removeEdge(mat, u, v) {
  mat[u][v] = 0;
  mat[v][u] = 0;
}

function isFourCritical(mat) {
  const n = mat.length;
  const baseChi = chromaticNumberDSATUR(adjacencyList(mat));
  if (baseChi !== 4) return false;

  // Vertex-critical check.
  for (let rem = 0; rem < n; rem += 1) {
    const small = [];
    for (let i = 0; i < n; i += 1) {
      if (i === rem) continue;
      const row = new Uint8Array(n - 1);
      let c = 0;
      for (let j = 0; j < n; j += 1) {
        if (j === rem) continue;
        row[c] = mat[i][j];
        c += 1;
      }
      small.push(row);
    }
    if (chromaticNumberDSATUR(adjacencyList(small)) >= 4) return false;
  }

  // Edge-critical check.
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (!mat[u][v]) continue;
      removeEdge(mat, u, v);
      const chi = chromaticNumberDSATUR(adjacencyList(mat));
      mat[u][v] = 1;
      mat[v][u] = 1;
      if (chi >= 4) return false;
    }
  }

  return true;
}

function minDegree(mat) {
  const n = mat.length;
  let d = n;
  for (let i = 0; i < n; i += 1) {
    let c = 0;
    for (let j = 0; j < n; j += 1) c += mat[i][j];
    if (c < d) d = c;
  }
  return d;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1032 ^ (depth * 12289));

  const rows = [];
  const deterministicRows = [];
  const rimLens = [5, 7, 9, 11, 13, 15, 17];
  for (const r of rimLens) {
    const w = oddWheel(r);
    const critical = isFourCritical(w);
    const d = minDegree(w);
    deterministicRows.push({
      construction: `odd_wheel_W_${r}`,
      n: r + 1,
      is_four_critical_verified: critical,
      min_degree: d,
      min_degree_over_n: Number((d / (r + 1)).toFixed(8)),
    });
  }

  const ns = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  for (const n of ns) {
    const trials = 300 * depth;
    let bestMinDeg = -1;
    let found = 0;
    for (let t = 0; t < trials; t += 1) {
      const p = 0.22 + 0.02 * ((t + n) % 10);
      const g = randomGraph(n, p, rng);
      if (!isFourCritical(g.adj)) continue;
      found += 1;
      const d = minDegree(g.adj);
      if (d > bestMinDeg) bestMinDeg = d;
    }
    rows.push({
      n,
      trials,
      four_critical_found: found,
      best_min_degree_found: bestMinDeg < 0 ? null : bestMinDeg,
      ratio_best_min_degree_over_n: bestMinDeg < 0 ? null : Number((bestMinDeg / n).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1032',
    script: 'ep1032.mjs',
    method: 'deep_exact_search_for_small_four_critical_graphs_and_min_degree_profile',
    warning: 'Small-n exact search only; does not determine asymptotic minimum-degree behavior.',
    params: { depth, n_range: [ns[0], ns[ns.length - 1]] },
    deterministic_family_checks: deterministicRows,
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
