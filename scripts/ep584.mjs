#!/usr/bin/env node
const meta={problem:'EP-584',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-584 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | short-cycle pair connectivity sampling in dense graphs. ----
// // EP-584: short-cycle pair connectivity sampling in dense graphs.
// {
//   function bfsDistAvoidEdge(G, src, banU, banV) {
//     const { n, neigh } = G;
//     const dist = Array(n).fill(-1);
//     const q = [src];
//     dist[src] = 0;
//     let qi = 0;
//     while (qi < q.length) {
//       const u = q[qi++];
//       const du = dist[u];
//       for (const v of neigh[u]) {
//         if ((u === banU && v === banV) || (u === banV && v === banU)) continue;
//         if (dist[v] >= 0) continue;
//         dist[v] = du + 1;
//         q.push(v);
//       }
//     }
//     return dist;
//   }
// 
//   function approxPairOnCycleAtMostL(G, e1, e2, L) {
//     const [a, b] = e1;
//     const [c, d] = e2;
//     if ((a === c && b === d) || (a === d && b === c)) return true;
// 
//     const da = bfsDistAvoidEdge(G, a, a, b);
//     const db = bfsDistAvoidEdge(G, b, a, b);
// 
//     const cand1 = da[c] >= 0 && db[d] >= 0 ? da[c] + 1 + db[d] : 1e9;
//     const cand2 = da[d] >= 0 && db[c] >= 0 ? da[d] + 1 + db[c] : 1e9;
//     const bestPath = Math.min(cand1, cand2);
// 
//     return bestPath <= L - 1;
//   }
// 
//   function adjacentPairInC4(G, e1, e2) {
//     const [a, b] = e1;
//     const [c, d] = e2;
// 
//     let u = -1;
//     let v = -1;
//     let w = -1;
// 
//     if (a === c) {
//       u = a;
//       v = b;
//       w = d;
//     } else if (a === d) {
//       u = a;
//       v = b;
//       w = c;
//     } else if (b === c) {
//       u = b;
//       v = a;
//       w = d;
//     } else if (b === d) {
//       u = b;
//       v = a;
//       w = c;
//     } else {
//       return false;
//     }
// 
//     for (const x of G.neigh[v]) {
//       if (x === u || x === w) continue;
//       if (G.adj[w][x]) return true;
//     }
//     return false;
//   }
// 
//   const rng = makeRng(20260303 ^ 1502);
//   const rows = [];
// 
//   for (const [delta, trials] of [[0.08, 4], [0.12, 4], [0.16, 4]]) {
//     const n = 72;
//     const p = Math.min(0.95, 2 * delta);
// 
//     let avgM = 0;
//     let frac6 = 0;
//     let frac8 = 0;
//     let fracAdjC4 = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const G = randomGraph(n, p, rng);
//       avgM += G.m;
// 
//       const edges = [];
//       for (let u = 0; u < n; u += 1) {
//         for (const v of G.neigh[u]) {
//           if (u < v) edges.push([u, v]);
//         }
//       }
// 
//       let hit6 = 0;
//       let hit8 = 0;
//       const pairSamples = Math.min(120, Math.floor(edges.length / 2));
//       for (let s = 0; s < pairSamples; s += 1) {
//         const e1 = edges[Math.floor(rng() * edges.length)];
//         const e2 = edges[Math.floor(rng() * edges.length)];
//         if (approxPairOnCycleAtMostL(G, e1, e2, 6)) hit6 += 1;
//         if (approxPairOnCycleAtMostL(G, e1, e2, 8)) hit8 += 1;
//       }
// 
//       let adjHit = 0;
//       let adjCnt = 0;
//       for (let s = 0; s < 160; s += 1) {
//         const u = Math.floor(rng() * n);
//         if (G.neigh[u].length < 2) continue;
//         const a = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
//         const b = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
//         if (a === b) continue;
//         adjCnt += 1;
//         if (adjacentPairInC4(G, [u, a], [u, b])) adjHit += 1;
//       }
// 
//       frac6 += pairSamples ? hit6 / pairSamples : 0;
//       frac8 += pairSamples ? hit8 / pairSamples : 0;
//       fracAdjC4 += adjCnt ? adjHit / adjCnt : 0;
//     }
// 
//     avgM /= trials;
//     frac6 /= trials;
//     frac8 /= trials;
//     fracAdjC4 /= trials;
// 
//     rows.push({
//       n,
//       delta,
//       trials,
//       avg_edges: Number(avgM.toPrecision(7)),
//       delta_sq_n_sq: Number((delta * delta * n * n).toPrecision(7)),
//       delta_cu_n_sq: Number((delta * delta * delta * n * n).toPrecision(7)),
//       sampled_pair_fraction_cycle_len_le_6_approx: Number(frac6.toPrecision(6)),
//       sampled_pair_fraction_cycle_len_le_8_approx: Number(frac8.toPrecision(6)),
//       sampled_adjacent_pair_fraction_on_C4: Number(fracAdjC4.toPrecision(6)),
//     });
//   }
// 
//   out.results.ep584 = {
//     description: 'Short-cycle connectivity proxy on dense random graphs at edge-density delta.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
