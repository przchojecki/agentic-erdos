#!/usr/bin/env node
const meta={problem:'EP-531',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-531 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | Folkman-number finite profiles. ----
// // EP-531: Folkman-number finite profiles.
// {
//   function tuplesK2(N) {
//     const t = [];
//     for (let a = 1; a <= N; a += 1) {
//       for (let b = a + 1; b <= N; b += 1) {
//         const s = a + b;
//         if (s <= N) t.push([a, b, s]);
//       }
//     }
//     return t;
//   }
// 
//   function tuplesK3(N) {
//     const t = [];
//     for (let a = 1; a <= N; a += 1) {
//       for (let b = a + 1; b <= N; b += 1) {
//         for (let c = b + 1; c <= N; c += 1) {
//           const sums = [a, b, c, a + b, a + c, b + c, a + b + c];
//           if (Math.max(...sums) <= N) t.push(sums);
//         }
//       }
//     }
//     return t;
//   }
// 
//   function hasMono(tupleList, col) {
//     for (const tp of tupleList) {
//       const c = col[tp[0]];
//       let ok = true;
//       for (let i = 1; i < tp.length; i += 1) {
//         if (col[tp[i]] !== c) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) return true;
//     }
//     return false;
//   }
// 
//   // Exact F(2) via full search.
//   function avoidableK2(N) {
//     const tuples = tuplesK2(N);
//     const col = new Int8Array(N + 1);
//     col.fill(-1);
// 
//     function dfs(x) {
//       if (x > N) return true;
//       for (let c = 0; c <= 1; c += 1) {
//         col[x] = c;
//         if (!hasMono(tuples.filter((tp) => tp.includes(x)), col)) {
//           if (dfs(x + 1)) return true;
//         }
//       }
//       col[x] = -1;
//       return false;
//     }
// 
//     return dfs(1);
//   }
// 
//   let maxAvoid2 = 0;
//   for (let N = 1; N <= 10; N += 1) {
//     if (avoidableK2(N)) maxAvoid2 = N;
//     else break;
//   }
// 
//   // Heuristic lower bounds for k=3 by randomized greedy colorings.
//   const rng = makeRng(20260303 ^ 1404);
// 
//   function greedyAvoidK3(N) {
//     const tuples = tuplesK3(N);
//     const touched = Array.from({ length: N + 1 }, () => []);
//     for (let i = 0; i < tuples.length; i += 1) {
//       for (const x of tuples[i]) touched[x].push(i);
//     }
// 
//     const col = new Int8Array(N + 1);
//     col.fill(-1);
// 
//     function monoTuple(i) {
//       const tp = tuples[i];
//       const c0 = col[tp[0]];
//       if (c0 < 0) return false;
//       for (let j = 1; j < tp.length; j += 1) if (col[tp[j]] !== c0) return false;
//       return true;
//     }
// 
//     for (let x = 1; x <= N; x += 1) {
//       const options = [];
//       for (let c = 0; c <= 1; c += 1) {
//         col[x] = c;
//         let bad = false;
//         for (const ti of touched[x]) {
//           if (monoTuple(ti)) {
//             bad = true;
//             break;
//           }
//         }
//         if (!bad) options.push(c);
//       }
//       if (!options.length) return x - 1;
//       col[x] = options[Math.floor(rng() * options.length)];
//     }
//     return N;
//   }
// 
//   const rows = [];
//   for (const [N, trials] of [[20, 80], [30, 80], [40, 70]]) {
//     let best = 0;
//     let avg = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const len = greedyAvoidK3(N);
//       avg += len;
//       if (len > best) best = len;
//     }
//     rows.push({
//       N,
//       trials,
//       best_avoidable_prefix_length_for_k3: best,
//       avg_avoidable_prefix_length_for_k3: Number((avg / trials).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep531 = {
//     description: 'Exact small-k and randomized lower-bound profiles for Folkman-type finite-sums monochromatic sets.',
//     exact: {
//       F_2_exact: maxAvoid2 + 1,
//       max_2color_avoidable_prefix_for_k2: maxAvoid2,
//     },
//     heuristic_k3_rows: rows,
//   };
// }
// ==== End Batch Split Integrations ====
