#!/usr/bin/env node
const meta={problem:'EP-774',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-774 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch17_quick_compute.mjs | finite surrogates for dissociated dimension and partition count. ----
// // EP-774: finite surrogates for dissociated dimension and partition count.
// {
//   const rng = makeRng(20260304 ^ 1710);
// 
//   function subsetSums(arr) {
//     const sums = [0];
//     for (const x of arr) {
//       const len = sums.length;
//       for (let i = 0; i < len; i += 1) sums.push(sums[i] + x);
//     }
//     return sums;
//   }
// 
//   function isDissociated(arr) {
//     const sums = subsetSums(arr);
//     sums.sort((a, b) => a - b);
//     for (let i = 1; i < sums.length; i += 1) if (sums[i] === sums[i - 1]) return false;
//     return true;
//   }
// 
//   function maxDissociatedSize(A) {
//     const n = A.length;
//     let best = 0;
//     for (let mask = 1; mask < (1 << n); mask += 1) {
//       const bits = mask.toString(2).split('0').join('').length;
//       if (bits <= best) continue;
//       const S = [];
//       for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) S.push(A[i]);
//       if (isDissociated(S)) best = bits;
//     }
//     return best;
//   }
// 
//   function canPartitionIntoTDissociated(A, t) {
//     const n = A.length;
//     const bins = Array.from({ length: t }, () => []);
//     const order = [...A].sort((a, b) => b - a);
// 
//     function dfs(i) {
//       if (i === n) return true;
//       const x = order[i];
//       for (let b = 0; b < t; b += 1) {
//         bins[b].push(x);
//         if (isDissociated(bins[b]) && dfs(i + 1)) return true;
//         bins[b].pop();
//       }
//       return false;
//     }
// 
//     return dfs(0);
//   }
// 
//   function randomSet(m, maxV) {
//     const S = new Set();
//     while (S.size < m) S.add(1 + Math.floor(rng() * maxV));
//     return [...S].sort((a, b) => a - b);
//   }
// 
//   const rows = [];
//   for (const [m, trials] of [[12, 8], [14, 7], [16, 6]]) {
//     let bestRatio = 0;
//     let worstT = 1;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const A = randomSet(m, 300);
//       const d = maxDissociatedSize(A);
//       const ratio = d / m;
//       if (ratio > bestRatio) bestRatio = ratio;
// 
//       let tNeed = m;
//       for (let k = 1; k <= 5; k += 1) {
//         if (canPartitionIntoTDissociated(A, k)) {
//           tNeed = k;
//           break;
//         }
//       }
//       if (tNeed > worstT) worstT = tNeed;
//     }
// 
//     rows.push({
//       m,
//       trials,
//       best_dissociated_dimension_ratio_found: Number(bestRatio.toPrecision(7)),
//       worst_min_partition_count_into_dissociated_classes_found: worstT,
//     });
//   }
// 
//   out.results.ep774 = {
//     description: 'Finite surrogate profile for dissociated dimension and minimal partition into dissociated classes.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch17_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
