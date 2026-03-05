#!/usr/bin/env node
const meta={problem:'EP-609',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-609 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | odd-girth lower-bound search in n-colorings of K_{2^n+1}. ----
// // EP-609: odd-girth lower-bound search in n-colorings of K_{2^n+1}.
// {
//   function buildEdges(N) {
//     const e = [];
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) e.push([i, j]);
//     }
//     return e;
//   }
// 
//   function firstDiffBit(a, b, bits) {
//     for (let k = 0; k < bits; k += 1) {
//       const ba = (a >> k) & 1;
//       const bb = (b >> k) & 1;
//       if (ba !== bb) return k;
//     }
//     return 0;
//   }
// 
//   function initColoring(bits, rng) {
//     const base = 1 << bits;
//     const N = base + 1;
//     const edges = buildEdges(N);
//     const colors = new Int16Array(edges.length);
// 
//     for (let ei = 0; ei < edges.length; ei += 1) {
//       const [u, v] = edges[ei];
//       if (u < base && v < base) {
//         colors[ei] = firstDiffBit(u, v, bits);
//       } else {
//         colors[ei] = Math.floor(rng() * bits);
//       }
//     }
// 
//     return { N, edges, colors };
//   }
// 
//   function oddGirthOfColor(N, edges, colors, targetColor) {
//     const neigh = Array.from({ length: N }, () => []);
//     for (let i = 0; i < edges.length; i += 1) {
//       if (colors[i] !== targetColor) continue;
//       const [u, v] = edges[i];
//       neigh[u].push(v);
//       neigh[v].push(u);
//     }
// 
//     let best = Infinity;
// 
//     for (let s = 0; s < N; s += 1) {
//       const dist = Array(N).fill(-1);
//       dist[s] = 0;
//       const q = [s];
//       let qi = 0;
// 
//       while (qi < q.length) {
//         const u = q[qi++];
//         for (const v of neigh[u]) {
//           if (dist[v] < 0) {
//             dist[v] = dist[u] + 1;
//             q.push(v);
//           } else if ((dist[v] & 1) === (dist[u] & 1)) {
//             const cand = dist[v] + dist[u] + 1;
//             if (cand < best) best = cand;
//           }
//         }
//       }
//     }
// 
//     return best;
//   }
// 
//   function evaluate(bits, conf) {
//     let minOdd = Infinity;
//     let numBipartiteColors = 0;
// 
//     for (let c = 0; c < bits; c += 1) {
//       const og = oddGirthOfColor(conf.N, conf.edges, conf.colors, c);
//       if (!Number.isFinite(og)) {
//         numBipartiteColors += 1;
//       } else if (og < minOdd) {
//         minOdd = og;
//       }
//     }
// 
//     return {
//       minMonochromaticOddCycleLength: Number.isFinite(minOdd) ? minOdd : null,
//       bipartiteColorClasses: numBipartiteColors,
//     };
//   }
// 
//   const rng = makeRng(20260303 ^ 1507);
//   const rows = [];
// 
//   for (const [bits, restarts, iters] of [[3, 8, 800], [4, 6, 700]]) {
//     let best = { minMonochromaticOddCycleLength: -1, bipartiteColorClasses: -1 };
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const conf = initColoring(bits, rng);
//       let cur = evaluate(bits, conf);
// 
//       function better(a, b) {
//         const aa = a.minMonochromaticOddCycleLength ?? 10_000;
//         const bb = b.minMonochromaticOddCycleLength ?? 10_000;
//         if (aa !== bb) return aa > bb;
//         return a.bipartiteColorClasses > b.bipartiteColorClasses;
//       }
// 
//       if (better(cur, best)) best = { ...cur };
// 
//       for (let it = 0; it < iters; it += 1) {
//         const ei = Math.floor(rng() * conf.edges.length);
//         const old = conf.colors[ei];
//         let neu = old;
//         while (neu === old) neu = Math.floor(rng() * bits);
//         conf.colors[ei] = neu;
// 
//         const nxt = evaluate(bits, conf);
//         if (better(nxt, cur)) {
//           cur = nxt;
//           if (better(cur, best)) best = { ...cur };
//         } else {
//           conf.colors[ei] = old;
//         }
//       }
//     }
// 
//     rows.push({
//       n_colors: bits,
//       complete_graph_vertices: (1 << bits) + 1,
//       best_min_monochromatic_odd_cycle_length_found: best.minMonochromaticOddCycleLength,
//       best_bipartite_color_classes: best.bipartiteColorClasses,
//     });
//   }
// 
//   out.results.ep609 = {
//     description: 'Heuristic search for large monochromatic odd girth in n-colorings of K_{2^n+1}.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
