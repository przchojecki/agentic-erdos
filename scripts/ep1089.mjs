#!/usr/bin/env node

// EP-1089 deep standalone computation:
// For n=3, g_d(3)-1 is the maximum size of a set with at most 2 distinct pairwise distances.
// We compute lower bounds by searching a rich finite candidate universe in R^d
// (shell points with squared norms 1 or 2 in {-1,0,1}^d) and solving max-clique
// over compatibility graphs for each allowed distance pair.

function generateShellPoints(d) {
  const pts = [];

  // Norm-1 points: +/- e_i
  for (let i = 0; i < d; i += 1) {
    const p = Array(d).fill(0);
    p[i] = 1;
    pts.push(p.slice());
    p[i] = -1;
    pts.push(p.slice());
  }

  // Norm-2 points: +/- e_i +/- e_j, i<j
  for (let i = 0; i < d; i += 1) {
    for (let j = i + 1; j < d; j += 1) {
      for (const si of [-1, 1]) {
        for (const sj of [-1, 1]) {
          const p = Array(d).fill(0);
          p[i] = si;
          p[j] = sj;
          pts.push(p);
        }
      }
    }
  }

  return pts;
}

function d2(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) {
    const t = a[i] - b[i];
    s += t * t;
  }
  return s;
}

function buildDistanceMatrix(points) {
  const n = points.length;
  const mat = Array.from({ length: n }, () => new Uint16Array(n));
  const distSet = new Set();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const v = d2(points[i], points[j]);
      mat[i][j] = v;
      mat[j][i] = v;
      distSet.add(v);
    }
  }
  return { mat, distVals: [...distSet].sort((a, b) => a - b) };
}

function makeAdjForAllowed(mat, allowed) {
  const n = mat.length;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const ok = allowed.has(mat[i][j]);
      if (ok) {
        adj[i][j] = 1;
        adj[j][i] = 1;
      }
    }
  }
  return adj;
}

function greedyColorOrder(cand, adj) {
  const order = [];
  const colors = [];
  const used = [];

  const verts = cand.slice();
  while (verts.length > 0) {
    const colorSets = [];
    const remain = [];
    for (const v of verts) {
      let placed = false;
      for (let c = 0; c < colorSets.length; c += 1) {
        let ok = true;
        for (const u of colorSets[c]) {
          if (adj[v][u]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          colorSets[c].push(v);
          placed = true;
          break;
        }
      }
      if (!placed) {
        colorSets.push([v]);
      }
      remain.push(v);
    }

    verts.length = 0;
    for (let c = 0; c < colorSets.length; c += 1) {
      for (const v of colorSets[c]) {
        order.push(v);
        colors.push(c + 1);
      }
    }

    // terminate one pass
    if (remain.length === 0) break;
  }

  return { order, colors };
}

function maxCliqueBounded(adj, budgetMs, nodeCap) {
  const t0 = Date.now();
  const n = adj.length;
  let best = [];
  let nodes = 0;
  let timedOut = false;

  function expand(cand, cur) {
    if (timedOut) return;
    if (Date.now() - t0 > budgetMs || nodes > nodeCap) {
      timedOut = true;
      return;
    }
    nodes += 1;

    if (cand.length === 0) {
      if (cur.length > best.length) best = cur.slice();
      return;
    }

    const { order, colors } = greedyColorOrder(cand, adj);

    for (let idx = order.length - 1; idx >= 0; idx -= 1) {
      if (cur.length + colors[idx] <= best.length) return;

      const v = order[idx];
      const next = [];
      for (let j = 0; j < idx; j += 1) {
        const u = order[j];
        if (adj[v][u]) next.push(u);
      }
      cur.push(v);
      expand(next, cur);
      cur.pop();

      if (timedOut) return;
    }
  }

  const all = [];
  for (let i = 0; i < n; i += 1) all.push(i);
  expand(all, []);

  return {
    cliqueSize: best.length,
    cliqueSample: best.slice(0, 24),
    timedOut,
    nodes,
    elapsedMs: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const dList = depth >= 4 ? [3, 4, 5, 6, 7, 8, 9, 10] : [3, 4, 5, 6, 7, 8];
  const perPairBudgetMs = depth >= 4 ? 1200 : 450;
  const nodeCap = depth >= 4 ? 900000 : 250000;

  const rows = [];
  for (const d of dList) {
    const pts = generateShellPoints(d);
    const { mat, distVals } = buildDistanceMatrix(pts);

    const allowedSets = [];
    for (let i = 0; i < distVals.length; i += 1) {
      allowedSets.push([distVals[i]]); // 1-distance sets
      for (let j = i + 1; j < distVals.length; j += 1) {
        allowedSets.push([distVals[i], distVals[j]]); // 2-distance sets
      }
    }

    let best = null;
    let tested = 0;
    let timedOutCases = 0;

    for (const ds of allowedSets) {
      const allowed = new Set(ds);
      const adj = makeAdjForAllowed(mat, allowed);
      const r = maxCliqueBounded(adj, perPairBudgetMs, nodeCap);
      tested += 1;
      if (r.timedOut) timedOutCases += 1;

      if (best === null || r.cliqueSize > best.cliqueSize) {
        best = {
          allowed_distances_squared: ds,
          cliqueSize: r.cliqueSize,
          timedOut: r.timedOut,
          nodes: r.nodes,
          elapsedMs: r.elapsedMs,
        };
      }
    }

    rows.push({
      d,
      candidate_points_count: pts.length,
      candidate_distance_values_squared: distVals,
      tested_allowed_distance_sets: tested,
      timed_out_cases: timedOutCases,
      best_two_distance_set_size_in_candidate_universe: best.cliqueSize,
      best_allowed_distances_squared: best.allowed_distances_squared,
      implied_lower_bound_g_d_3: best.cliqueSize + 1,
      cross_polytope_baseline_2d: 2 * d,
      improvement_over_cross_polytope: best.cliqueSize - 2 * d,
      best_solver_stats: {
        timedOut: best.timedOut,
        nodes: best.nodes,
        elapsedMs: best.elapsedMs,
      },
    });
  }

  const payload = {
    problem: 'EP-1089',
    script: 'ep1089.mjs',
    method: 'deep_max_clique_search_for_large_two_distance_subsets_in_lattice_shell_candidate_universes',
    warning: 'Finite candidate-universe lower bounds only; not a global optimum over all point configurations.',
    params: { depth, dList, perPairBudgetMs, nodeCap },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
