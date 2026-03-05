#!/usr/bin/env node
const meta={problem:'EP-657',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-657 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | 1D AP-free surrogate search minimizing distinct differences. ----
// // EP-657: 1D AP-free surrogate search minimizing distinct differences.
// {
//   const rng = makeRng(20260304 ^ 1607);
// 
//   function isAPFree(setArr) {
//     const S = new Set(setArr);
//     const arr = [...setArr].sort((a, b) => a - b);
//     for (let i = 0; i < arr.length; i += 1) {
//       for (let j = i + 1; j < arr.length; j += 1) {
//         const a = arr[i];
//         const b = arr[j];
//         const c = 2 * b - a;
//         if (S.has(c)) return false;
//       }
//     }
//     return true;
//   }
// 
//   function canAddWithout3AP(S, x) {
//     for (const a of S) {
//       if (S.has(2 * a - x)) return false;
//       if ((a + x) % 2 === 0 && S.has((a + x) / 2)) return false;
//       if (S.has(2 * x - a)) return false;
//     }
//     return true;
//   }
// 
//   function diffCount(S) {
//     const arr = [...S].sort((a, b) => a - b);
//     const D = new Set();
//     for (let i = 0; i < arr.length; i += 1) {
//       for (let j = i + 1; j < arr.length; j += 1) D.add(arr[j] - arr[i]);
//     }
//     return D.size;
//   }
// 
//   function randomAPFreeSet(n, M) {
//     for (let attempt = 0; attempt < 200; attempt += 1) {
//       const perm = Array.from({ length: M }, (_, i) => i + 1);
//       shuffle(perm, rng);
//       const S = new Set();
//       for (const x of perm) {
//         if (S.size >= n) break;
//         if (canAddWithout3AP(S, x)) S.add(x);
//       }
//       if (S.size === n) return S;
//     }
//     return null;
//   }
// 
//   function improveSet(S, M, iters) {
//     let best = diffCount(S);
// 
//     for (let it = 0; it < iters; it += 1) {
//       const arr = [...S];
//       const rem = arr[Math.floor(rng() * arr.length)];
//       S.delete(rem);
// 
//       let added = null;
//       for (let tr = 0; tr < 35; tr += 1) {
//         const x = 1 + Math.floor(rng() * M);
//         if (S.has(x)) continue;
//         if (!canAddWithout3AP(S, x)) continue;
//         added = x;
//         break;
//       }
// 
//       if (added === null) {
//         S.add(rem);
//         continue;
//       }
// 
//       S.add(added);
//       const cur = diffCount(S);
//       if (cur <= best) {
//         best = cur;
//       } else {
//         S.delete(added);
//         S.add(rem);
//       }
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const n of [10, 12, 14]) {
//     const M = 6 * n;
//     const restarts = 36;
//     let best = Infinity;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const S = randomAPFreeSet(n, M);
//       if (!S) continue;
//       const cur = improveSet(S, M, 1500);
//       if (cur < best) best = cur;
//     }
// 
//     rows.push({
//       n,
//       ambient_interval_size_M: M,
//       restarts,
//       best_distinct_differences_found: best,
//       best_over_n: Number((best / n).toPrecision(7)),
//       best_over_n_log_n: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep657 = {
//     description: '1D AP-free difference-minimization surrogate for no-isosceles-distance growth behavior.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
