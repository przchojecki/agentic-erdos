#!/usr/bin/env node

// EP-1035 deep finite proxy:
// random dense graph experiments for spanning Q_d embeddings via local-search bijection.

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
  let m = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        m += 1;
      }
    }
  }
  return { adj, m };
}

function cubeEdges(d) {
  const n = 1 << d;
  const e = [];
  for (let v = 0; v < n; v += 1) {
    for (let b = 0; b < d; b += 1) {
      const w = v ^ (1 << b);
      if (v < w) e.push([v, w]);
    }
  }
  return e;
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
}

function missingCount(adj, perm, cEdges) {
  let miss = 0;
  for (const [u, v] of cEdges) if (!adj[perm[u]][perm[v]]) miss += 1;
  return miss;
}

function findEmbeddingHeuristic(adj, d, rng, tries, localSteps) {
  const n = 1 << d;
  const cEdges = cubeEdges(d);
  const base = Array.from({ length: n }, (_, i) => i);
  let best = Infinity;
  let success = false;

  for (let t = 0; t < tries; t += 1) {
    const perm = base.slice();
    shuffle(perm, rng);
    let cur = missingCount(adj, perm, cEdges);
    if (cur < best) best = cur;
    if (cur === 0) { success = true; break; }

    for (let s = 0; s < localSteps; s += 1) {
      const i = Math.floor(rng() * n);
      const j = Math.floor(rng() * n);
      if (i === j) continue;
      const a = perm[i]; perm[i] = perm[j]; perm[j] = a;
      const nxt = missingCount(adj, perm, cEdges);
      if (nxt <= cur || rng() < 0.001) {
        cur = nxt;
        if (cur < best) best = cur;
        if (cur === 0) { success = true; break; }
      } else {
        const b = perm[i]; perm[i] = perm[j]; perm[j] = b;
      }
    }
    if (success) break;
  }

  return { success, bestMissing: best };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1035 ^ (depth * 524287));

  const rows = [];
  for (const d of [4, 5]) {
    const n = 1 << d;
    const pList = [0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90];
    for (const p of pList) {
      const graphTrials = 24 * depth;
      let hit = 0;
      let avgBestMissing = 0;
      let avgEdges = 0;
      for (let t = 0; t < graphTrials; t += 1) {
        const G = randomGraph(n, p, rng);
        avgEdges += G.m;
        const h = findEmbeddingHeuristic(G.adj, d, rng, 20 * depth, 200 * depth);
        if (h.success) hit += 1;
        avgBestMissing += h.bestMissing;
      }
      rows.push({
        d,
        n,
        density_p: p,
        graph_trials: graphTrials,
        success_rate_spanning_Qd_embedding: Number((hit / graphTrials).toFixed(8)),
        mean_best_missing_cube_edges: Number((avgBestMissing / graphTrials).toFixed(8)),
        mean_edge_count: Number((avgEdges / graphTrials).toFixed(4)),
        edge_count_ratio_to_complete: Number(((avgEdges / graphTrials) / (n * (n - 1) / 2)).toFixed(8)),
      });
    }
  }

  const payload = {
    problem: 'EP-1035',
    script: 'ep1035.mjs',
    method: 'deep_dense_random_graph_spanning_hypercube_embedding_local_search_proxy',
    warning: 'Heuristic embedding search only; non-detection is not a proof of non-existence.',
    params: { depth, dimensions: [4, 5] },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };
  console.log(JSON.stringify(payload, null, 2));
}

main();
