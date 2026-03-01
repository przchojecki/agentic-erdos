#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_LIST = (process.env.N_LIST || '24,30,36,42,48').split(',').map((x) => Number(x.trim())).filter(Boolean);
const RESTARTS = Number(process.env.RESTARTS || 25);
const STEPS = Number(process.env.STEPS || 1200);

function pairIndex(n, i, j) {
  if (i > j) [i, j] = [j, i];
  return i * n + j;
}

function allPairs(n) {
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}

function objective(n, adj) {
  const deg = new Int32Array(n);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (adj[pairIndex(n, i, j)]) { deg[i]++; deg[j]++; }

  let maxTri = -1;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!adj[pairIndex(n, i, j)]) continue;
      for (let k = j + 1; k < n; k++) {
        if (adj[pairIndex(n, i, k)] && adj[pairIndex(n, j, k)]) {
          const s = deg[i] + deg[j] + deg[k];
          if (s > maxTri) maxTri = s;
        }
      }
    }
  }
  if (maxTri < 0) return { score: 1e9, hasTriangle: false, maxTriangleDegreeSum: null };
  return { score: maxTri, hasTriangle: true, maxTriangleDegreeSum: maxTri };
}

function randInt(m) {
  return Math.floor(Math.random() * m);
}

function randomGraphWithM(n, m, pairs) {
  const adj = new Uint8Array(n * n);
  const idxs = Array.from({ length: pairs.length }, (_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    const t = idxs[i]; idxs[i] = idxs[j]; idxs[j] = t;
  }
  for (let t = 0; t < m; t++) {
    const [u, v] = pairs[idxs[t]];
    adj[pairIndex(n, u, v)] = 1;
  }
  return adj;
}

const rows = [];

for (const n of N_LIST) {
  const m = Math.floor((n * n) / 4) + 1;
  const pairs = allPairs(n);

  let globalBest = { score: 1e9, adj: null };

  for (let r = 0; r < RESTARTS; r++) {
    let adj = randomGraphWithM(n, m, pairs);
    let cur = objective(n, adj);
    let bestLocal = { ...cur, adj: adj.slice() };

    for (let step = 0; step < STEPS; step++) {
      // choose one present edge and one absent edge and swap
      let eOn = null;
      let eOff = null;
      for (let tries = 0; tries < 200; tries++) {
        const p = pairs[randInt(pairs.length)];
        if (adj[pairIndex(n, p[0], p[1])]) { eOn = p; break; }
      }
      for (let tries = 0; tries < 200; tries++) {
        const p = pairs[randInt(pairs.length)];
        if (!adj[pairIndex(n, p[0], p[1])]) { eOff = p; break; }
      }
      if (!eOn || !eOff) continue;

      const idxOn = pairIndex(n, eOn[0], eOn[1]);
      const idxOff = pairIndex(n, eOff[0], eOff[1]);
      adj[idxOn] = 0;
      adj[idxOff] = 1;

      const nxt = objective(n, adj);
      const accept = nxt.score <= cur.score || Math.random() < 0.03;
      if (accept) {
        cur = nxt;
        if (nxt.score < bestLocal.score) bestLocal = { ...nxt, adj: adj.slice() };
      } else {
        adj[idxOn] = 1;
        adj[idxOff] = 0;
      }
    }

    if (bestLocal.score < globalBest.score) globalBest = bestLocal;
  }

  rows.push({
    n,
    edge_count: m,
    best_found_max_triangle_degree_sum: globalBest.score,
    best_found_ratio_over_n: Number((globalBest.score / n).toFixed(6)),
    asymptotic_constant_target: Number((2 * (Math.sqrt(3) - 1)).toFixed(6)),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  n_list: N_LIST,
  restarts: RESTARTS,
  steps_per_restart: STEPS,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1033_triangle_degree_sum_search.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, restarts: RESTARTS, steps: STEPS }, null, 2));
