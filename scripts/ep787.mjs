#!/usr/bin/env node
const meta={problem:'EP-787',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-787 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | maximal B in sampled A with no distinct b1+b2 in A. ----
// // EP-787: maximal B in sampled A with no distinct b1+b2 in A.
// {
//   function maxIndependentSizeFromAdj(adjMasks, n) {
//     const comp = Array(n).fill(0n);
//     for (let i = 0; i < n; i += 1) {
//       let m = 0n;
//       for (let j = 0; j < n; j += 1) {
//         if (i === j) continue;
//         if (((adjMasks[i] >> BigInt(j)) & 1n) === 0n) m |= 1n << BigInt(j);
//       }
//       comp[i] = m;
//     }
//     return maxCliqueSizeFromAdjMasks(comp, n);
//   }
// 
//   function alphaForA(A) {
//     const n = A.length;
//     const S = new Set(A);
//     const adj = Array(n).fill(0n);
// 
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         if (S.has(A[i] + A[j])) {
//           adj[i] |= 1n << BigInt(j);
//           adj[j] |= 1n << BigInt(i);
//         }
//       }
//     }
//     return maxIndependentSizeFromAdj(adj, n);
//   }
// 
//   const rng = makeRng(20260304 ^ 1803);
// 
//   function randomSet(size, maxVal) {
//     const S = new Set();
//     while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
//     return [...S].sort((a, b) => a - b);
//   }
// 
//   const rows = [];
//   for (const n of [20, 28, 36]) {
//     const candidates = [];
//     candidates.push(Array.from({ length: n }, (_, i) => i + 1));
//     candidates.push(Array.from({ length: n }, (_, i) => 2 * i + 1));
//     for (let t = 0; t < 8; t += 1) candidates.push(randomSet(n, 5 * n));
// 
//     let worst = n;
//     let worstType = 'unknown';
//     let avg = 0;
//     for (let i = 0; i < candidates.length; i += 1) {
//       const A = candidates[i];
//       const a = alphaForA(A);
//       avg += a;
//       if (a < worst) {
//         worst = a;
//         worstType = i === 0 ? 'interval' : i === 1 ? 'odd_interval' : 'random';
//       }
//     }
// 
//     rows.push({
//       n,
//       sampled_A_count: candidates.length,
//       worst_max_B_size_found: worst,
//       worst_case_family_sampled: worstType,
//       avg_max_B_size_over_samples: Number((avg / candidates.length).toPrecision(7)),
//       worst_over_n: Number((worst / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep787 = {
//     description: 'Sampled worst-case search for largest B with pairwise distinct sums avoiding A.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
