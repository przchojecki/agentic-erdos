#!/usr/bin/env node
const meta={problem:'EP-500',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-500 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | K4^3-free 3-graph random-greedy lower-bound profile. ----
// // EP-500: K4^3-free 3-graph random-greedy lower-bound profile.
// {
//   function turanConstructionDensity(n) {
//     const s = [Math.floor(n / 3), Math.floor((n + 1) / 3), Math.floor((n + 2) / 3)];
//     s.sort((a, b) => b - a);
//     const [a, b, c] = s;
// 
//     let e = a * b * c; // one from each class
//     // two in Xi, one in Xi+1 cyclic
//     e += choose2(a) * b;
//     e += choose2(b) * c;
//     e += choose2(c) * a;
// 
//     return e / choose3(n);
//   }
// 
//   function greedyLower(n, trials, rng) {
//     const triples = [];
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         for (let k = j + 1; k < n; k += 1) triples.push([i, j, k]);
//       }
//     }
//     const E = triples.length;
// 
//     const foursets = [];
//     for (let a = 0; a < n; a += 1) {
//       for (let b = a + 1; b < n; b += 1) {
//         for (let c = b + 1; c < n; c += 1) {
//           for (let d = c + 1; d < n; d += 1) {
//             foursets.push([a, b, c, d]);
//           }
//         }
//       }
//     }
// 
//     const keyToEdge = new Map();
//     for (let i = 0; i < E; i += 1) {
//       const [a, b, c] = triples[i];
//       keyToEdge.set(`${a},${b},${c}`, i);
//     }
// 
//     const contain = Array.from({ length: E }, () => []);
//     for (let fi = 0; fi < foursets.length; fi += 1) {
//       const [a, b, c, d] = foursets[fi];
//       const edgeIds = [
//         keyToEdge.get(`${a},${b},${c}`),
//         keyToEdge.get(`${a},${b},${d}`),
//         keyToEdge.get(`${a},${c},${d}`),
//         keyToEdge.get(`${b},${c},${d}`),
//       ];
//       for (const e of edgeIds) contain[e].push(fi);
//     }
// 
//     let best = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const ord = Array.from({ length: E }, (_, i) => i);
//       shuffle(ord, rng);
//       const cnt4 = new Uint8Array(foursets.length);
//       let kept = 0;
// 
//       for (const e of ord) {
//         let ok = true;
//         for (const fi of contain[e]) {
//           if (cnt4[fi] >= 3) {
//             ok = false;
//             break;
//           }
//         }
//         if (!ok) continue;
//         kept += 1;
//         for (const fi of contain[e]) cnt4[fi] += 1;
//       }
//       if (kept > best) best = kept;
//     }
// 
//     return best / E;
//   }
// 
//   const rng = makeRng(20260303 ^ 1303);
//   const rows = [];
//   for (const [n, trials] of [[12, 120], [16, 100], [20, 90]]) {
//     const g = greedyLower(n, trials, rng);
//     rows.push({
//       n,
//       random_greedy_best_density: Number(g.toPrecision(7)),
//       turan_construction_density: Number(turanConstructionDensity(n).toPrecision(7)),
//       razborov_upper_density: 0.5611666,
//     });
//   }
// 
//   out.results.ep500 = {
//     description: 'Finite random-greedy lower-bound densities for K4^3-free 3-graphs.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
