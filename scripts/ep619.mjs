#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function sparseTriangleFreeConnected(n, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const ord = Array.from({ length: n }, (_, i) => i);
  for (let i = ord.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = ord[i]; ord[i] = ord[j]; ord[j] = t;
  }
  for (let i = 1; i < n; i += 1) {
    const u = ord[i];
    const v = ord[Math.floor(rng() * i)];
    adj[u][v] = 1; adj[v][u] = 1;
  }

  // very sparse extra edges, keep triangle-free
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (adj[u][v]) continue;
      if (rng() > 0.03) continue;
      let tri = false;
      for (let w = 0; w < n; w += 1) if (adj[u][w] && adj[v][w]) { tri = true; break; }
      if (!tri) { adj[u][v] = 1; adj[v][u] = 1; }
    }
  }
  return { n, adj };
}

function diameter(G) {
  const { n, adj } = G;
  let D = 0;
  for (let s = 0; s < n; s += 1) {
    const dist = Array(n).fill(-1);
    dist[s] = 0;
    const q = [s];
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (let v = 0; v < n; v += 1) if (adj[u][v] && dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
    }
    for (const x of dist) if (x > D) D = x;
  }
  return D;
}

function greedyAddToDiameter4TriangleFree(G, budgetFactor, rng) {
  const { n, adj } = G;
  let added = 0;
  let D = diameter(G);
  const maxAdds = Math.floor(budgetFactor * n);

  while (D > 4 && added < maxAdds) {
    const cand = [];
    for (let u = 0; u < n; u += 1) {
      for (let v = u + 1; v < n; v += 1) {
        if (adj[u][v]) continue;
        let tri = false;
        for (let w = 0; w < n; w += 1) if (adj[u][w] && adj[v][w]) { tri = true; break; }
        if (!tri) cand.push([u, v]);
      }
    }
    if (cand.length === 0) break;

    let best = null;
    let bestD = D;
    const sample = Math.min(80, cand.length);
    for (let i = 0; i < sample; i += 1) {
      const [u, v] = cand[Math.floor(rng() * cand.length)];
      adj[u][v] = 1; adj[v][u] = 1;
      const nd = diameter(G);
      adj[u][v] = 0; adj[v][u] = 0;
      if (nd < bestD) { bestD = nd; best = [u, v]; }
    }

    if (!best) {
      const [u, v] = cand[Math.floor(rng() * cand.length)];
      adj[u][v] = 1; adj[v][u] = 1;
      added += 1;
      D = diameter(G);
    } else {
      const [u, v] = best;
      adj[u][v] = 1; adj[v][u] = 1;
      added += 1;
      D = bestD;
    }
  }

  return { added, finalDiameter: D };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 619);
const rows = [];

for (const [n, trials] of [[24, 8], [30, 6], [36, 5]]) {
  let sumStartD = 0;
  let sumAdded = 0;
  let success = 0;
  let worstRatio = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = sparseTriangleFreeConnected(n, rng);
    const d0 = diameter(G);
    const res = greedyAddToDiameter4TriangleFree(G, 1.2, rng);
    sumStartD += d0;
    sumAdded += res.added;
    const ratio = res.added / n;
    if (ratio > worstRatio) worstRatio = ratio;
    if (res.finalDiameter <= 4) success += 1;
  }
  rows.push({
    n,
    trials,
    success_to_diameter_4: success,
    success_ratio: Number((success / trials).toPrecision(8)),
    avg_initial_diameter: Number((sumStartD / trials).toPrecision(8)),
    avg_edges_added_for_target: Number((sumAdded / trials).toPrecision(8)),
    avg_added_over_n: Number(((sumAdded / trials) / n).toPrecision(8)),
    worst_added_over_n: Number(worstRatio.toPrecision(8)),
  });
}

const out = {
  problem: 'EP-619',
  script: path.basename(process.argv[1]),
  method: 'sparse_triangle_free_diameter_4_augmentation_proxy_via_greedy_triangle_preserving_additions',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
