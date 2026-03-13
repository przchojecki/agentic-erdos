#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const neigh = Array.from({ length: n }, () => []);
  let edges = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        neigh[i].push(j);
        neigh[j].push(i);
        edges += 1;
      }
    }
  }
  return { n, adj, neigh, edges };
}

function greedyChiUpper(G, restarts, rng) {
  const n = G.n;
  let best = n;
  for (let r = 0; r < restarts; r += 1) {
    const order = Array.from({ length: n }, (_, i) => i);
    shuffle(order, rng);
    const col = new Int32Array(n).fill(-1);
    let usedMax = -1;
    for (const v of order) {
      const used = new Uint8Array(n);
      for (const u of G.neigh[v]) {
        const c = col[u];
        if (c >= 0) used[c] = 1;
      }
      let c = 0;
      while (used[c]) c += 1;
      col[v] = c;
      if (c > usedMax) usedMax = c;
    }
    const val = usedMax + 1;
    if (val < best) best = val;
  }
  return best;
}

function greedyZetaUpper(G, restarts, rng) {
  const n = G.n;
  let best = n;
  for (let r = 0; r < restarts; r += 1) {
    const order = Array.from({ length: n }, (_, i) => i);
    shuffle(order, rng);
    const classes = [];

    for (const v of order) {
      let placed = false;
      const idx = Array.from({ length: classes.length }, (_, i) => i);
      idx.sort((a, b) => classes[b].verts.length - classes[a].verts.length);

      for (const ci of idx) {
        const C = classes[ci];
        if (C.type === 1) {
          let ok = true;
          for (const u of C.verts) {
            if (!G.adj[u][v]) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;
          C.verts.push(v);
          placed = true;
          break;
        }
        if (C.type === 2) {
          let ok = true;
          for (const u of C.verts) {
            if (G.adj[u][v]) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;
          C.verts.push(v);
          placed = true;
          break;
        }
        const u = C.verts[0];
        C.verts.push(v);
        C.type = G.adj[u][v] ? 1 : 2;
        placed = true;
        break;
      }

      if (!placed) classes.push({ type: 0, verts: [v] });
    }
    if (classes.length < best) best = classes.length;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 625);
const rows = [];

for (const [n, trials, p] of [[120, 28, 0.5], [180, 20, 0.5], [240, 14, 0.5], [320, 10, 0.5]]) {
  let sumChi = 0;
  let sumZeta = 0;
  let sumEdges = 0;
  let minGap = Infinity;
  let maxGap = -Infinity;
  let positiveGapCount = 0;

  for (let t = 0; t < trials; t += 1) {
    const G = randomGraph(n, p, rng);
    const chiU = greedyChiUpper(G, 40, rng);
    const zetaU = greedyZetaUpper(G, 56, rng);
    const gap = chiU - zetaU;
    sumChi += chiU;
    sumZeta += zetaU;
    sumEdges += G.edges;
    if (gap > 0) positiveGapCount += 1;
    if (gap < minGap) minGap = gap;
    if (gap > maxGap) maxGap = gap;
  }

  rows.push({
    n,
    trials,
    p,
    avg_edges: Number((sumEdges / trials).toPrecision(8)),
    avg_chi_upper: Number((sumChi / trials).toPrecision(8)),
    avg_zeta_upper: Number((sumZeta / trials).toPrecision(8)),
    avg_gap_chi_minus_zeta: Number(((sumChi - sumZeta) / trials).toPrecision(8)),
    min_gap_observed: minGap,
    max_gap_observed: maxGap,
    positive_gap_frequency: Number((positiveGapCount / trials).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-625',
  script: path.basename(process.argv[1]),
  method: 'deeper_random_graph_profile_for_chi_minus_cochromatic_gap',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
