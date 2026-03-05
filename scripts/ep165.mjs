#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-165
// Finite proxy for off-diagonal Ramsey scale R(3,k) via triangle-free process + greedy alpha estimate.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
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

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function parseFloatList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);
  return out.length ? out : fallback;
}

function triangleFreeProcess(n, rng) {
  const edges = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  shuffle(edges, rng);

  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  let m = 0;
  for (const [u, v] of edges) {
    let createsTri = false;
    for (let w = 0; w < n; w += 1) {
      if (adj[u][w] && adj[v][w]) {
        createsTri = true;
        break;
      }
    }
    if (createsTri) continue;
    adj[u][v] = 1;
    adj[v][u] = 1;
    m += 1;
  }
  return { adj, edges: m };
}

function greedyIndependentSize(adj, trials, rng) {
  const n = adj.length;
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    shuffle(ord, rng);
    const dead = new Uint8Array(n);
    let sz = 0;
    for (const v of ord) {
      if (dead[v]) continue;
      sz += 1;
      dead[v] = 1;
      for (let u = 0; u < n; u += 1) if (adj[v][u]) dead[u] = 1;
    }
    if (sz > best) best = sz;
  }
  return best;
}

const K_LIST = parseIntList(process.env.K_LIST, [30, 40, 50, 60]);
const RATIOS = parseFloatList(process.env.RATIOS, [0.55, 0.65, 0.75, 0.85]);
const PROCESS_RUNS = Number(process.env.PROCESS_RUNS || 12);
const ALPHA_TRIALS = Number(process.env.ALPHA_TRIALS || 30);
const SEED = Number(process.env.SEED || 1652026);
const OUT = process.env.OUT || '';

if (!Number.isInteger(PROCESS_RUNS) || PROCESS_RUNS < 1) throw new Error('PROCESS_RUNS must be positive integer');
if (!Number.isInteger(ALPHA_TRIALS) || ALPHA_TRIALS < 1) throw new Error('ALPHA_TRIALS must be positive integer');

const rng = makeRng(SEED);
const rows = [];
for (const k of K_LIST) {
  const cand = RATIOS.map((c) => Math.max(12, Math.floor((c * k * k) / Math.log(k))));
  let bestN = null;
  for (const n of cand) {
    let found = false;
    let minAlpha = Infinity;
    for (let t = 0; t < PROCESS_RUNS; t += 1) {
      const g = triangleFreeProcess(n, rng);
      const alphaEst = greedyIndependentSize(g.adj, ALPHA_TRIALS, rng);
      if (alphaEst < minAlpha) minAlpha = alphaEst;
      if (alphaEst < k) found = true;
    }
    rows.push({
      k,
      n_tested: n,
      process_runs: PROCESS_RUNS,
      greedy_alpha_trials: ALPHA_TRIALS,
      min_greedy_independent_size: minAlpha,
      witness_alpha_less_than_k_found: found,
    });
    if (found) bestN = n;
  }
  rows.push({
    k,
    empirical_lower_bound_n_with_alpha_less_k: bestN,
    k2_over_logn: Number((k * k / Math.log(k)).toFixed(3)),
    empirical_ratio_n_over_k2_over_logn: bestN ? Number((bestN / (k * k / Math.log(k))).toFixed(6)) : null,
  });
}

const out = {
  problem: 'EP-165',
  script: path.basename(process.argv[1]),
  method: 'triangle_free_process_proxy_for_R3k_scale',
  params: { K_LIST, RATIOS, PROCESS_RUNS, ALPHA_TRIALS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite triangle-free process proxy for off-diagonal Ramsey scale. ----
// // EP-165: finite triangle-free process proxy for off-diagonal Ramsey scale.
// {
//   function triangleFreeProcess(n) {
//     const edges = [];
//     for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
//     shuffle(edges, rng);
// 
//     const adj = Array.from({ length: n }, () => new Uint8Array(n));
//     let m = 0;
//     for (const [u, v] of edges) {
//       let createsTri = false;
//       for (let w = 0; w < n; w += 1) {
//         if (adj[u][w] && adj[v][w]) {
//           createsTri = true;
//           break;
//         }
//       }
//       if (createsTri) continue;
//       adj[u][v] = 1;
//       adj[v][u] = 1;
//       m += 1;
//     }
//     return { adj, edges: m };
//   }
// 
//   function greedyIndependentSize(adj, trials = 24) {
//     const n = adj.length;
//     let best = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const ord = Array.from({ length: n }, (_, i) => i);
//       shuffle(ord, rng);
//       const dead = new Uint8Array(n);
//       let sz = 0;
//       for (const v of ord) {
//         if (dead[v]) continue;
//         sz += 1;
//         dead[v] = 1;
//         for (let u = 0; u < n; u += 1) if (adj[v][u]) dead[u] = 1;
//       }
//       if (sz > best) best = sz;
//     }
//     return best;
//   }
// 
//   const rows = [];
//   for (const k of [20, 30, 40, 50]) {
//     const cand = [0.45, 0.55, 0.65, 0.75].map((c) => Math.max(12, Math.floor((c * k * k) / Math.log(k))));
//     let bestN = null;
//     for (const n of cand) {
//       let found = false;
//       let bestAlpha = Infinity;
//       for (let t = 0; t < 6; t += 1) {
//         const g = triangleFreeProcess(n);
//         const alphaEst = greedyIndependentSize(g.adj, 20);
//         if (alphaEst < bestAlpha) bestAlpha = alphaEst;
//         if (alphaEst < k) found = true;
//       }
//       rows.push({
//         k,
//         n_tested: n,
//         six_runs_min_greedy_independent_size: bestAlpha,
//         witness_alpha_less_than_k_found: found,
//       });
//       if (found) bestN = n;
//     }
//     rows.push({
//       k,
//       empirical_lower_bound_n_with_alpha_less_k: bestN,
//       k2_over_logn: Number((k * k / Math.log(k)).toFixed(3)),
//       empirical_ratio_n_over_k2_over_logn: bestN ? Number((bestN / (k * k / Math.log(k))).toFixed(6)) : null,
//     });
//   }
// 
//   out.results.ep165 = {
//     description: 'Triangle-free process finite proxy for R(3,k) lower-scale constants.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
