#!/usr/bin/env node
const meta={problem:'EP-792',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-792 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | sampled worst-case max sum-free subset size. ----
// // EP-792: sampled worst-case max sum-free subset size.
// {
//   const rng = makeRng(20260304 ^ 1804);
// 
//   function maxSumFreeExact(A) {
//     const n = A.length;
//     const idx = new Map();
//     for (let i = 0; i < n; i += 1) idx.set(A[i], i);
// 
//     const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => A[j] - A[i]);
//     const chosenVals = new Set();
//     let best = 0;
// 
//     function canAdd(v) {
//       if (chosenVals.has(2 * v)) return false;
//       for (const y of chosenVals) {
//         if (chosenVals.has(v + y)) return false;
//         if (chosenVals.has(v - y)) return false;
//         if (chosenVals.has(y - v)) return false;
//       }
//       return true;
//     }
// 
//     function dfs(pos, cur) {
//       if (cur + (n - pos) <= best) return;
//       if (pos === n) {
//         if (cur > best) best = cur;
//         return;
//       }
// 
//       const i = order[pos];
//       const v = A[i];
// 
//       if (canAdd(v)) {
//         chosenVals.add(v);
//         dfs(pos + 1, cur + 1);
//         chosenVals.delete(v);
//       }
// 
//       dfs(pos + 1, cur);
//     }
// 
//     dfs(0, 0);
//     return best;
//   }
// 
//   function randomSet(size, maxVal) {
//     const S = new Set();
//     while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
//     return [...S].sort((a, b) => a - b);
//   }
// 
//   const rows = [];
//   for (const n of [16, 20, 24]) {
//     const samples = [];
//     samples.push(Array.from({ length: n }, (_, i) => i + 1));
//     samples.push(Array.from({ length: n }, (_, i) => i + 2));
//     for (let t = 0; t < 6; t += 1) samples.push(randomSet(n, 5 * n));
// 
//     let worst = n;
//     let avg = 0;
//     for (const A of samples) {
//       const v = maxSumFreeExact(A);
//       avg += v;
//       if (v < worst) worst = v;
//     }
// 
//     rows.push({
//       n,
//       sampled_A_count: samples.length,
//       worst_max_sum_free_size_found: worst,
//       avg_max_sum_free_size: Number((avg / samples.length).toPrecision(7)),
//       worst_minus_n_over_3: Number((worst - n / 3).toPrecision(7)),
//       worst_over_n: Number((worst / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep792 = {
//     description: 'Sampled finite profile for largest guaranteed sum-free subset size.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
