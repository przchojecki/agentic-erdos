#!/usr/bin/env node
const meta={problem:'EP-643',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-643 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | 3-uniform hypergraph avoiding A∪B=C∪D with disjoint pairs. ----
// // EP-643: 3-uniform hypergraph avoiding A∪B=C∪D with disjoint pairs.
// {
//   const rng = makeRng(20260304 ^ 1605);
// 
//   function disjoint3(a, b) {
//     return !(
//       a[0] === b[0] || a[0] === b[1] || a[0] === b[2] ||
//       a[1] === b[0] || a[1] === b[1] || a[1] === b[2] ||
//       a[2] === b[0] || a[2] === b[1] || a[2] === b[2]
//     );
//   }
// 
//   function union6Key(a, b) {
//     const U = [a[0], a[1], a[2], b[0], b[1], b[2]].sort((x, y) => x - y);
//     return `${U[0]},${U[1]},${U[2]},${U[3]},${U[4]},${U[5]}`;
//   }
// 
//   function greedyMax(n, restarts) {
//     const verts = Array.from({ length: n }, (_, i) => i);
//     const triples = combinations(verts, 3);
//     let best = 0;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const order = [...triples];
//       shuffle(order, rng);
// 
//       const chosen = [];
//       const pairCount = new Map();
// 
//       for (const e of order) {
//         const touched = [];
//         let bad = false;
// 
//         for (const f of chosen) {
//           if (!disjoint3(e, f)) continue;
//           const key = union6Key(e, f);
//           const c = pairCount.get(key) || 0;
//           if (c >= 1) {
//             bad = true;
//             break;
//           }
//           touched.push(key);
//         }
// 
//         if (bad) continue;
//         chosen.push(e);
//         for (const key of touched) {
//           pairCount.set(key, (pairCount.get(key) || 0) + 1);
//         }
//       }
// 
//       if (chosen.length > best) best = chosen.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, restarts] of [[12, 24], [15, 18], [18, 14]]) {
//     const best = greedyMax(n, restarts);
//     rows.push({
//       n,
//       restarts,
//       best_edges_found_t3: best,
//       binom_n_2: choose2(n),
//       best_over_binom_n_2: Number((best / choose2(n)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep643 = {
//     description: 'Greedy lower-bound search for f(n;3)-type extremal size under union-equality obstruction.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
