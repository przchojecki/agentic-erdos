#!/usr/bin/env node
const meta={problem:'EP-483',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-483 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | Schur-number finite profiles. ----
// // EP-483: Schur-number finite profiles.
// {
//   function colorableSchur(N, k) {
//     const col = new Int8Array(N + 1);
//     col.fill(-1);
// 
//     function dfs(x) {
//       if (x > N) return true;
//       for (let c = 0; c < k; c += 1) {
//         let ok = true;
//         for (let a = 1; a < x; a += 1) {
//           const b = x - a;
//           if (b < 1) continue;
//           if (col[a] === c && col[b] === c) {
//             ok = false;
//             break;
//           }
//         }
//         if (!ok) continue;
//         col[x] = c;
//         if (dfs(x + 1)) return true;
//         col[x] = -1;
//       }
//       return false;
//     }
// 
//     return dfs(1);
//   }
// 
//   function exactMaxForK(k, cap) {
//     let best = 0;
//     for (let N = 1; N <= cap; N += 1) {
//       if (colorableSchur(N, k)) best = N;
//       else return best;
//     }
//     return best;
//   }
// 
//   const exactRows = [];
//   for (const [k, cap] of [[1, 6], [2, 12], [3, 20]]) {
//     const m = exactMaxForK(k, cap);
//     exactRows.push({ k, exact_max_sum_free_coloring_length: m });
//   }
//   exactRows.push({ k: 4, exact_max_sum_free_coloring_length: 45, source: 'known_value_background' });
// 
//   const rng = makeRng(20260303 ^ 1301);
// 
//   function greedyRun(k, Nmax) {
//     const col = new Int8Array(Nmax + 1);
//     col.fill(-1);
//     for (let x = 1; x <= Nmax; x += 1) {
//       const valid = [];
//       for (let c = 0; c < k; c += 1) {
//         let ok = true;
//         for (let a = 1; a < x; a += 1) {
//           const b = x - a;
//           if (b < 1) continue;
//           if (col[a] === c && col[b] === c) {
//             ok = false;
//             break;
//           }
//         }
//         if (ok) valid.push(c);
//       }
//       if (!valid.length) return x - 1;
//       const c = valid[Math.floor(rng() * valid.length)];
//       col[x] = c;
//     }
//     return Nmax;
//   }
// 
//   const heuristicRows = [];
//   for (const [k, trials, Nmax] of [[5, 180, 350], [6, 180, 500], [7, 180, 700]]) {
//     let best = 0;
//     let avg = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const len = greedyRun(k, Nmax);
//       avg += len;
//       if (len > best) best = len;
//     }
//     heuristicRows.push({
//       k,
//       trials,
//       search_cap: Nmax,
//       best_greedy_length: best,
//       avg_greedy_length: Number((avg / trials).toPrecision(7)),
//       best_over_3p2806_pow_k: Number((best / (3.2806 ** k)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep483 = {
//     description: 'Exact small-k and heuristic larger-k profiles for Schur-number growth.',
//     exact_rows: exactRows,
//     heuristic_rows: heuristicRows,
//   };
// }
// ==== End Batch Split Integrations ====
