#!/usr/bin/env node
const meta={problem:'EP-901',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-901 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | constructive upper bounds for m(n) via non-2-colorable n-uniform hypergraphs. ----
// // EP-901: constructive upper bounds for m(n) via non-2-colorable n-uniform hypergraphs.
// {
//   const rng = makeRng(20260304 ^ 2201);
// 
//   function combinationsMasks(v, r) {
//     const outMasks = [];
//     const cur = [];
// 
//     function rec(start, need) {
//       if (need === 0) {
//         let mask = 0;
//         for (const x of cur) mask |= (1 << x);
//         outMasks.push(mask);
//         return;
//       }
//       for (let x = start; x <= v - need; x += 1) {
//         cur.push(x);
//         rec(x + 1, need - 1);
//         cur.pop();
//       }
//     }
// 
//     rec(0, r);
//     return outMasks;
//   }
// 
//   function nonMonochromaticColorings(v, edges) {
//     const full = (1 << v) - 1;
//     const ok = [];
//     for (let c = 0; c < (1 << v); c += 1) {
//       let good = true;
//       const comp = full ^ c;
//       for (const e of edges) {
//         if ((e & c) === e || (e & comp) === e) {
//           good = false;
//           break;
//         }
//       }
//       if (good) ok.push(c);
//     }
//     return ok;
//   }
// 
//   function greedyConstruct(v, n, stepsCap, sampleCand) {
//     const edgesAll = combinationsMasks(v, n);
//     const used = new Set();
//     const edges = [];
//     let validColorings = nonMonochromaticColorings(v, edges);
// 
//     for (let step = 0; step < stepsCap && validColorings.length > 0; step += 1) {
//       let bestEdge = -1;
//       let bestKill = -1;
// 
//       for (let t = 0; t < sampleCand; t += 1) {
//         const idx = Math.floor(rng() * edgesAll.length);
//         if (used.has(idx)) continue;
//         const e = edgesAll[idx];
// 
//         let kill = 0;
//         const full = (1 << v) - 1;
//         for (const c of validColorings) {
//           const comp = full ^ c;
//           if ((e & c) === e || (e & comp) === e) kill += 1;
//         }
// 
//         if (kill > bestKill) {
//           bestKill = kill;
//           bestEdge = idx;
//         }
//       }
// 
//       if (bestEdge < 0) break;
//       used.add(bestEdge);
//       const e = edgesAll[bestEdge];
//       edges.push(e);
// 
//       const full = (1 << v) - 1;
//       validColorings = validColorings.filter((c) => {
//         const comp = full ^ c;
//         return !((e & c) === e || (e & comp) === e);
//       });
//     }
// 
//     return { edge_count: edges.length, remaining_colorings: validColorings.length };
//   }
// 
//   const rows = [];
//   for (const n of [4, 5, 6]) {
//     const vCands = [2 * n, 2 * n + 1, 2 * n + 2];
//     let globalBest = 1e9;
//     let globalBestV = null;
//     let bestRem = 1e9;
// 
//     for (const v of vCands) {
//       for (let r = 0; r < 6; r += 1) {
//         const g = greedyConstruct(v, n, 500, 140);
//         if (g.remaining_colorings === 0 && g.edge_count < globalBest) {
//           globalBest = g.edge_count;
//           globalBestV = v;
//         }
//         if (g.remaining_colorings < bestRem) bestRem = g.remaining_colorings;
//       }
//     }
// 
//     rows.push({
//       n,
//       searched_v_values: vCands,
//       best_v_found: globalBestV,
//       finite_constructive_upper_bound_edges: Number.isFinite(globalBest) ? globalBest : null,
//       smallest_remaining_coloring_count_seen: bestRem,
//       trivial_probabilistic_lower_bound_2_pow_n_minus_1: 2 ** (n - 1),
//       upper_over_2_pow_n: Number.isFinite(globalBest) ? Number((globalBest / (2 ** n)).toPrecision(7)) : null,
//     });
//   }
// 
//   out.results.ep901 = {
//     description: 'Greedy constructive finite upper bounds for non-2-colorable n-uniform hypergraphs.',
//     rows,
//     note: 'Upper bounds depend on construction heuristic and do not certify exact m(n).',
//   };
// }
// ==== End Batch Split Integrations ====
