#!/usr/bin/env node

// EP-1075 deep standalone computation (finite heuristic evidence):
// Random r-uniform hypergraphs near edge threshold (1+eps)(n/r)^r,
// then greedy peeling to estimate best induced density e(U)/C(|U|,r).

function choose(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let kk = Math.min(k, n - k);
  let num = 1;
  for (let i = 1; i <= kk; i += 1) num = (num * (n - kk + i)) / i;
  return Math.round(num);
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

function sampleEdge(n, r, rand) {
  const used = new Set();
  while (used.size < r) {
    used.add(Math.floor(rand() * n));
  }
  return [...used].sort((a, b) => a - b);
}

function edgeKey(edge) {
  return edge.join(',');
}

function buildRandomHypergraph(n, r, m, rand) {
  const maxEdges = choose(n, r);
  const target = Math.min(m, maxEdges);

  const edges = [];
  const seen = new Set();

  while (edges.length < target) {
    const e = sampleEdge(n, r, rand);
    const k = edgeKey(e);
    if (seen.has(k)) continue;
    seen.add(k);
    edges.push(e);
  }

  const inc = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i += 1) {
    for (const v of edges[i]) inc[v].push(i);
  }

  return { edges, inc };
}

function peelBestDensity(n, r, edges, inc, minSize) {
  const aliveV = new Uint8Array(n);
  aliveV.fill(1);

  const aliveEdge = new Uint8Array(edges.length);
  aliveEdge.fill(1);

  const aliveCount = new Uint8Array(edges.length);
  for (let i = 0; i < edges.length; i += 1) aliveCount[i] = r;

  const deg = new Int32Array(n);
  for (let i = 0; i < edges.length; i += 1) {
    for (const v of edges[i]) deg[v] += 1;
  }

  let curN = n;
  let curE = edges.length;

  let bestDensity = 0;
  let bestSize = n;
  if (curN >= minSize && choose(curN, r) > 0) {
    bestDensity = curE / choose(curN, r);
  }

  while (curN > minSize) {
    let rem = -1;
    let bestDeg = Infinity;
    for (let v = 0; v < n; v += 1) {
      if (!aliveV[v]) continue;
      if (deg[v] < bestDeg) {
        bestDeg = deg[v];
        rem = v;
      }
    }
    if (rem < 0) break;

    aliveV[rem] = 0;
    curN -= 1;

    for (const ei of inc[rem]) {
      if (!aliveEdge[ei]) continue;
      aliveCount[ei] -= 1;
      if (aliveCount[ei] === r - 1) {
        aliveEdge[ei] = 0;
        curE -= 1;
        for (const u of edges[ei]) {
          if (aliveV[u]) deg[u] -= 1;
        }
      }
    }

    if (curN >= minSize) {
      const denom = choose(curN, r);
      if (denom > 0) {
        const d = curE / denom;
        if (d > bestDensity) {
          bestDensity = d;
          bestSize = curN;
        }
      }
    }
  }

  return { bestDensity, bestSize, finalN: curN, finalE: curE };
}

function runScenario({ n, r, eps, trials, seed }) {
  const rand = mulberry32(seed);
  const threshold = Math.floor((1 + eps) * Math.pow(n / r, r));
  const minSize = Math.max(r + 1, Math.floor(2 * Math.log2(n)));
  const baseline = Math.pow(r, -r);

  let bestOverall = { bestDensity: 0, bestSize: 0 };
  let countAboveBaseline = 0;
  let countAboveBaselineAndGrowing = 0;

  for (let t = 0; t < trials; t += 1) {
    const { edges, inc } = buildRandomHypergraph(n, r, threshold, rand);
    const res = peelBestDensity(n, r, edges, inc, minSize);

    if (res.bestDensity > bestOverall.bestDensity) bestOverall = res;
    if (res.bestDensity > baseline) countAboveBaseline += 1;
    if (res.bestDensity > baseline && res.bestSize >= minSize) {
      countAboveBaselineAndGrowing += 1;
    }
  }

  return {
    n,
    r,
    eps,
    trials,
    threshold_edges: threshold,
    min_size_proxy: minSize,
    baseline_c_r: Number(baseline.toFixed(12)),
    hit_rate_above_baseline: Number((countAboveBaseline / trials).toFixed(10)),
    hit_rate_above_baseline_with_growing_size: Number((countAboveBaselineAndGrowing / trials).toFixed(10)),
    best_trial_density: Number(bestOverall.bestDensity.toFixed(10)),
    best_trial_size: bestOverall.bestSize,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const scenarios = [
    { n: 72, r: 3, eps: 0.15, trials: 30 * depth, seed: 1075001 },
    { n: 96, r: 3, eps: 0.15, trials: 30 * depth, seed: 1075002 },
    { n: 120, r: 3, eps: 0.15, trials: 24 * depth, seed: 1075003 },
    { n: 48, r: 4, eps: 0.15, trials: 24 * depth, seed: 1075004 },
    { n: 60, r: 4, eps: 0.15, trials: 18 * depth, seed: 1075005 },
    { n: 72, r: 4, eps: 0.15, trials: 14 * depth, seed: 1075006 },
  ];

  const rows = scenarios.map(runScenario);

  const payload = {
    problem: 'EP-1075',
    script: 'ep1075.mjs',
    method: 'deep_random_hypergraph_threshold_sampling_with_greedy_peeling_density_search',
    warning: 'Heuristic finite random evidence only; no theorem is proved by this computation.',
    params: { depth, scenario_count: scenarios.length },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
