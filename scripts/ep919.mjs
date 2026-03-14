#!/usr/bin/env node

// EP-919
// Finite analogue of the lexicographic-square construction.
// Vertices: (a,b) with 1<=a,b<=m in lex order.
// Edge between (a1,b1),(a2,b2) iff a1<a2 and b1<b2 (undirected).
// We analyze chromatic number of initial segments.

function buildGraph(m) {
  const n = m * m;
  const adj = Array.from({ length: n }, () => []);

  function idx(a, b) {
    return (a - 1) * m + (b - 1);
  }

  for (let a1 = 1; a1 <= m; a1 += 1) {
    for (let b1 = 1; b1 <= m; b1 += 1) {
      const u = idx(a1, b1);
      for (let a2 = a1 + 1; a2 <= m; a2 += 1) {
        for (let b2 = b1 + 1; b2 <= m; b2 += 1) {
          const v = idx(a2, b2);
          adj[u].push(v);
          adj[v].push(u);
        }
      }
    }
  }

  return adj;
}

function inducedPrefix(adj, t) {
  const out = Array.from({ length: t }, () => []);
  for (let u = 0; u < t; u += 1) {
    for (const v of adj[u]) {
      if (v < t && u < v) {
        out[u].push(v);
        out[v].push(u);
      }
    }
  }
  return out;
}

function chromaticExact(adj) {
  const n = adj.length;
  if (n === 0) return 0;
  const deg = adj.map((x) => x.length);

  const greedyOrder = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]);
  const gc = new Int16Array(n);
  gc.fill(-1);
  let ub = 0;
  for (const v of greedyOrder) {
    const used = new Uint8Array(n + 1);
    for (const w of adj[v]) {
      const c = gc[w];
      if (c >= 0) used[c] = 1;
    }
    let c = 0;
    while (used[c]) c += 1;
    gc[v] = c;
    if (c + 1 > ub) ub = c + 1;
  }

  const colors = new Int16Array(n);
  colors.fill(-1);
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

function formulaPrefixChi(m, t) {
  if (t <= 0) return 0;
  const q = Math.floor((t - 1) / m);
  const r = ((t - 1) % m) + 1;
  return q + (r >= q + 1 ? 1 : 0);
}

function main() {
  const t0 = Date.now();

  const verifyMs = [4, 5, 6, 7, 8, 9, 10];
  const exactVerification = [];

  for (const m of verifyMs) {
    const G = buildGraph(m);
    const n = m * m;
    let allOk = true;
    let firstMismatch = null;

    for (let t = 1; t <= n; t += 1) {
      const H = inducedPrefix(G, t);
      const chiExact = chromaticExact(H);
      const chiFormula = formulaPrefixChi(m, t);
      if (chiExact !== chiFormula) {
        allOk = false;
        firstMismatch = { t, chi_exact: chiExact, chi_formula: chiFormula };
        break;
      }
    }

    exactVerification.push({ m, n, all_prefixes_match_formula: allOk, first_mismatch: firstMismatch });
  }

  const profileMs = [20, 50, 100, 200, 400];
  const fractions = [0.1, 0.2, 0.35, 0.5, 0.7, 0.85, 0.95, 0.99, 0.999];
  const profileRows = [];

  for (const m of profileMs) {
    const n = m * m;
    for (const f of fractions) {
      const t = Math.max(1, Math.min(n, Math.floor(f * n)));
      const chi = formulaPrefixChi(m, t);
      profileRows.push({
        m,
        total_vertices: n,
        prefix_fraction: f,
        prefix_size_t: t,
        prefix_chromatic_formula: chi,
        global_chromatic: m,
        ratio_prefix_over_global: Number((chi / m).toFixed(8)),
      });
    }

    const tMaxProper = n - 1;
    profileRows.push({
      m,
      total_vertices: n,
      prefix_fraction: Number(((n - 1) / n).toFixed(8)),
      prefix_size_t: tMaxProper,
      prefix_chromatic_formula: formulaPrefixChi(m, tMaxProper),
      global_chromatic: m,
      ratio_prefix_over_global: Number((formulaPrefixChi(m, tMaxProper) / m).toFixed(8)),
      note: 'largest proper initial segment',
    });
  }

  const payload = {
    problem: 'EP-919',
    script: 'ep919.mjs',
    method: 'finite_lex_square_construction_profile_with_exact_small_m_verification',
    warning: 'Finite analogue only; does not resolve the infinite-cardinal question.',
    exact_prefix_formula_verification: exactVerification,
    large_scale_profile: profileRows,
    key_observation: 'In this finite model, proper initial segments have chromatic number at most m-1 while full graph has m.',
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
