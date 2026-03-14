#!/usr/bin/env node

// EP-918
// Finite proxy search:
// Find graphs where global chromatic threshold is high, while many medium-size induced
// subgraphs stay below a smaller chromatic threshold.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function randomGraphAdj(n, p, rng) {
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }
  return adj;
}

function isKColorable(adj, k) {
  const n = adj.length;
  const colors = new Int8Array(n);
  colors.fill(-1);
  const deg = adj.map((x) => x.length);

  function sat(v) {
    const seen = new Uint8Array(k);
    let c = 0;
    for (const w of adj[v]) {
      const cw = colors[w];
      if (cw >= 0 && !seen[cw]) {
        seen[cw] = 1;
        c += 1;
      }
    }
    return c;
  }

  function chooseVertex() {
    let best = -1;
    let bestSat = -1;
    let bestDeg = -1;
    for (let v = 0; v < n; v += 1) {
      if (colors[v] !== -1) continue;
      const s = sat(v);
      if (s > bestSat || (s === bestSat && deg[v] > bestDeg)) {
        best = v;
        bestSat = s;
        bestDeg = deg[v];
      }
    }
    return best;
  }

  function dfs(colored) {
    if (colored === n) return true;
    const v = chooseVertex();

    const banned = new Uint8Array(k);
    for (const w of adj[v]) {
      const c = colors[w];
      if (c >= 0) banned[c] = 1;
    }

    for (let c = 0; c < k; c += 1) {
      if (banned[c]) continue;
      colors[v] = c;
      if (dfs(colored + 1)) return true;
      colors[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

function chooseSubset(n, m, rng) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < m; i += 1) {
    const j = i + Math.floor(rng() * (n - i));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  arr.length = m;
  arr.sort((a, b) => a - b);
  return arr;
}

function inducedSubgraph(adj, vertices) {
  const pos = new Int32Array(adj.length);
  pos.fill(-1);
  for (let i = 0; i < vertices.length; i += 1) pos[vertices[i]] = i;

  const out = Array.from({ length: vertices.length }, () => []);
  for (let i = 0; i < vertices.length; i += 1) {
    const v = vertices[i];
    for (const w of adj[v]) {
      const j = pos[w];
      if (j > i) {
        out[i].push(j);
        out[j].push(i);
      }
    }
  }
  return out;
}

function checkAllMSubgraphsKColorable(adj, m, k) {
  const n = adj.length;
  const chosen = [];
  let ok = true;
  let checked = 0;

  function rec(start, need) {
    if (!ok) return;
    if (need === 0) {
      const H = inducedSubgraph(adj, chosen);
      checked += 1;
      if (!isKColorable(H, k)) ok = false;
      return;
    }
    for (let i = start; i <= n - need; i += 1) {
      chosen.push(i);
      rec(i + 1, need - 1);
      chosen.pop();
      if (!ok) return;
    }
  }

  rec(0, m);
  return { allColorable: ok, subsetsChecked: checked };
}

function edgeCount(adj) {
  let s = 0;
  for (const row of adj) s += row.length;
  return s / 2;
}

function runConfig(cfg, seedBase) {
  const rng = makeRng(seedBase);
  const rows = [];
  let successes = 0;
  const witnessExamples = [];

  for (const p of cfg.pList) {
    let passCount = 0;
    let globalHardCount = 0;

    for (let t = 0; t < cfg.trialsPerP; t += 1) {
      const G = randomGraphAdj(cfg.n, p, rng);

      let localAllGood = true;
      let subsetsChecked = 0;
      const doLocalCheck = cfg.evaluateLocalOnAll || !isKColorable(G, cfg.globalK);
      if (!doLocalCheck) continue;

      if (cfg.exhaustiveLocalCheck) {
        const ex = checkAllMSubgraphsKColorable(G, cfg.m, cfg.localK);
        localAllGood = ex.allColorable;
        subsetsChecked = ex.subsetsChecked;
      } else {
        for (let s = 0; s < cfg.localSubsetSamples; s += 1) {
          const subset = chooseSubset(cfg.n, cfg.m, rng);
          const H = inducedSubgraph(G, subset);
          subsetsChecked += 1;
          if (!isKColorable(H, cfg.localK)) {
            localAllGood = false;
            break;
          }
        }
      }

      const globalIsKColorable = isKColorable(G, cfg.globalK);
      if (globalIsKColorable) continue;
      globalHardCount += 1;

      if (localAllGood) {
        passCount += 1;
        successes += 1;
        if (witnessExamples.length < 8) {
          witnessExamples.push({
            p,
            trial_index: t,
            n: cfg.n,
            m: cfg.m,
            global_not_colorable_with_k: cfg.globalK,
            local_subgraphs_colorable_with_k: cfg.localK,
            checked_subgraphs: subsetsChecked,
            edges: edgeCount(G),
            edge_density_over_n2: Number((edgeCount(G) / (cfg.n * cfg.n)).toFixed(8)),
          });
        }
      }
    }

    rows.push({
      p,
      trials: cfg.trialsPerP,
      global_not_k_colorable_count: globalHardCount,
      finite_proxy_success_count: passCount,
      success_rate_over_trials: Number((passCount / cfg.trialsPerP).toFixed(8)),
    });
  }

  return { config: cfg, rows, total_successes: successes, witness_examples: witnessExamples };
}

function main() {
  const t0 = Date.now();

  const configs = [
    {
      name: 'proxy_A',
      n: 18,
      m: 9,
      globalK: 4,
      localK: 4,
      pList: [0.26, 0.32],
      trialsPerP: 30,
      localSubsetSamples: 0,
      exhaustiveLocalCheck: true,
      evaluateLocalOnAll: true,
    },
    {
      name: 'proxy_B',
      n: 28,
      m: 16,
      globalK: 5,
      localK: 4,
      pList: [0.18, 0.22, 0.26, 0.3],
      trialsPerP: 180,
      localSubsetSamples: 320,
      exhaustiveLocalCheck: false,
    },
  ];

  const perConfig = configs.map((cfg, i) => runConfig(cfg, 20260313 ^ (i * 9973) ^ (cfg.n * 131)));

  const payload = {
    problem: 'EP-918',
    script: 'ep918.mjs',
    method: 'finite_proxy_random_search_for_global_local_chromatic_separation',
    warning: 'Finite proxy only; infinite-cardinal statement is set-theoretic and not resolved by finite simulation.',
    per_config_results: perConfig,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
