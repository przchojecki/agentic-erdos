#!/usr/bin/env node

// EP-1091 deep standalone computation:
// Explore K4-free 4-chromatic graphs and measure odd-cycle diagonal structure.

function emptyGraph(n) {
  return { n, adj: Array.from({ length: n }, () => new Uint8Array(n)) };
}

function cloneGraph(g) {
  const h = emptyGraph(g.n);
  for (let i = 0; i < g.n; i += 1) h.adj[i].set(g.adj[i]);
  return h;
}

function addEdge(g, u, v) {
  if (u === v) return;
  g.adj[u][v] = 1;
  g.adj[v][u] = 1;
}

function remEdge(g, u, v) {
  g.adj[u][v] = 0;
  g.adj[v][u] = 0;
}

function hasEdge(g, u, v) {
  return g.adj[u][v] === 1;
}

function edgeCount(g) {
  let m = 0;
  for (let i = 0; i < g.n; i += 1) for (let j = i + 1; j < g.n; j += 1) if (g.adj[i][j]) m += 1;
  return m;
}

function cycle5Wheel() {
  const g = emptyGraph(6);
  for (let i = 0; i < 5; i += 1) addEdge(g, i, (i + 1) % 5);
  for (let i = 0; i < 5; i += 1) addEdge(g, 5, i);
  return g;
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

function isK4Free(g) {
  const n = g.n;
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) if (g.adj[a][b]) {
      for (let c = b + 1; c < n; c += 1) if (g.adj[a][c] && g.adj[b][c]) {
        for (let d = c + 1; d < n; d += 1) {
          if (g.adj[a][d] && g.adj[b][d] && g.adj[c][d]) return false;
        }
      }
    }
  }
  return true;
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

function chromaticAtLeast4(g) {
  return !canColorWithK(g, 3);
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

function allSubsetsOfSize(n, k, cb) {
  const arr = [];
  function rec(start, need) {
    if (need === 0) {
      cb(arr.slice());
      return;
    }
    for (let v = start; v <= n - need; v += 1) {
      arr.push(v);
      rec(v + 1, need - 1);
      arr.pop();
    }
  }
  rec(0, k);
}

function localConditionAtMost3(g, r) {
  const n = g.n;
  for (let k = 1; k <= Math.min(r, n); k += 1) {
    let ok = true;
    allSubsetsOfSize(n, k, (verts) => {
      if (!ok) return;
      const h = inducedSubgraph(g, verts);
      if (!canColorWithK(h, 3)) ok = false;
    });
    if (!ok) return false;
  }
  return true;
}

function maxOddCycleDiagonals(g, maxCycleLen = 13) {
  const n = g.n;
  let best = -1;

  // DFS cycles with canonical start=min vertex and next constraint to reduce duplicates.
  function dfs(start, cur, used) {
    const last = cur[cur.length - 1];
    if (cur.length >= 3 && hasEdge(g, last, start)) {
      const len = cur.length;
      if (len % 2 === 1) {
        const inCycle = new Uint8Array(n);
        for (const v of cur) inCycle[v] = 1;
        let edgesInside = 0;
        for (let i = 0; i < len; i += 1) {
          for (let j = i + 1; j < len; j += 1) {
            if (hasEdge(g, cur[i], cur[j])) edgesInside += 1;
          }
        }
        const diagonals = edgesInside - len;
        if (diagonals > best) best = diagonals;
      }
    }
    if (cur.length === maxCycleLen) return;

    for (let v = 0; v < n; v += 1) {
      if (!hasEdge(g, last, v)) continue;
      if (v < start) continue;
      if (used[v]) continue;
      // canonical: second vertex > start
      if (cur.length === 1 && v <= start) continue;
      used[v] = 1;
      cur.push(v);
      dfs(start, cur, used);
      cur.pop();
      used[v] = 0;
    }
  }

  for (let s = 0; s < n; s += 1) {
    const used = new Uint8Array(n);
    used[s] = 1;
    dfs(s, [s], used);
  }

  return Math.max(0, best);
}

function randomInt(rng, n) {
  return Math.floor(rng() * n);
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

function mutatePreserving(g, rng, tries = 12) {
  const n = g.n;
  for (let it = 0; it < tries; it += 1) {
    const u = randomInt(rng, n);
    let v = randomInt(rng, n - 1);
    if (v >= u) v += 1;
    const h = cloneGraph(g);
    if (hasEdge(h, u, v)) remEdge(h, u, v);
    else addEdge(h, u, v);

    if (!isK4Free(h)) continue;
    if (!chromaticAtLeast4(h)) continue;
    return h;
  }
  return g;
}

function summarizeGraph(name, g, rList) {
  const chi4 = chromaticAtLeast4(g);
  const k4free = isK4Free(g);
  const maxDiag = maxOddCycleDiagonals(g, 13);
  const local = {};
  for (const r of rList) local[`r_${r}`] = localConditionAtMost3(g, r);
  return {
    graph: name,
    n: g.n,
    m: edgeCount(g),
    k4_free: k4free,
    chi_at_least_4: chi4,
    max_odd_cycle_diagonals_len_le_13: maxDiag,
    local_chi_le_3_checks: local,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rList = depth >= 4 ? [5, 6, 7] : [5, 6];

  const rows = [];

  const wheel = cycle5Wheel();
  rows.push(summarizeGraph('pentagonal_wheel_W5', wheel, rList));

  const mC5 = mycielski(c5Graph());
  rows.push(summarizeGraph('mycielski_C5', mC5, rList));

  // Deep randomized mutation search near mycielski_C5.
  const rng = mulberry32(0x1091 ^ (depth * 1337));
  const budgetMs = depth >= 4 ? 90000 : 25000;
  const start = Date.now();

  let cur = cloneGraph(mC5);
  let curScore = maxOddCycleDiagonals(cur, 13);

  let best = cloneGraph(cur);
  let bestScore = curScore;
  let accepted = 0;
  let iterations = 0;

  while (Date.now() - start < budgetMs) {
    iterations += 1;
    const cand = mutatePreserving(cur, rng, 14);
    const candScore = maxOddCycleDiagonals(cand, 13);

    // accept if improves or small SA-like chance
    if (candScore < curScore || rng() < 0.03) {
      cur = cand;
      curScore = candScore;
      accepted += 1;
    }
    if (candScore < bestScore) {
      best = cloneGraph(cand);
      bestScore = candScore;
    }
  }

  rows.push({
    ...summarizeGraph('mutated_best_from_mycielski_C5', best, rList),
    search_stats: {
      budget_ms: budgetMs,
      iterations,
      accepted,
      start_score_mycielski: rows[1].max_odd_cycle_diagonals_len_le_13,
      best_score_found: bestScore,
    },
  });

  const payload = {
    problem: 'EP-1091',
    script: 'ep1091.mjs',
    method: 'deep_k4_free_4_chromatic_graph_construction_and_mutation_search_with_odd_cycle_diagonal_measurements',
    warning: 'Finite construction/search evidence only; does not resolve the asymptotic f(r) question.',
    params: { depth, rList },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
