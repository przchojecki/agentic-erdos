#!/usr/bin/env node
const meta={problem:'EP-530',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-530 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | maximum Sidon subset size in finite sets. ----
// // EP-530: maximum Sidon subset size in finite sets.
// {
//   function maxSidonSubset(A) {
//     const n = A.length;
//     let best = 0;
// 
//     function dfs(i, chosen, sums) {
//       if (i === n) {
//         if (chosen.length > best) best = chosen.length;
//         return;
//       }
//       if (chosen.length + (n - i) <= best) return;
// 
//       // skip
//       dfs(i + 1, chosen, sums);
// 
//       // include if possible
//       const x = A[i];
//       const newSums = [];
//       let ok = true;
// 
//       const s2 = 2 * x;
//       if (sums.has(s2)) ok = false;
//       else newSums.push(s2);
// 
//       if (ok) {
//         for (const a of chosen) {
//           const s = a + x;
//           if (sums.has(s)) {
//             ok = false;
//             break;
//           }
//           newSums.push(s);
//         }
//       }
// 
//       if (ok) {
//         for (const s of newSums) sums.add(s);
//         chosen.push(x);
//         dfs(i + 1, chosen, sums);
//         chosen.pop();
//         for (const s of newSums) sums.delete(s);
//       }
//     }
// 
//     dfs(0, [], new Set());
//     return best;
//   }
// 
//   const rng = makeRng(20260303 ^ 1403);
// 
//   function randSet(size, maxVal) {
//     const S = new Set();
//     while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
//     return [...S].sort((a, b) => a - b);
//   }
// 
//   const rows = [];
//   for (const N of [16, 20, 24]) {
//     const A = Array.from({ length: N }, (_, i) => i + 1);
//     const m = maxSidonSubset(A);
//     rows.push({
//       family: 'interval',
//       N,
//       max_sidon_size: m,
//       ratio_over_sqrtN: Number((m / Math.sqrt(N)).toPrecision(7)),
//     });
//   }
// 
//   for (const N of [16, 20, 24]) {
//     let best = 0;
//     let avg = 0;
//     const trials = N === 24 ? 15 : 20;
//     for (let t = 0; t < trials; t += 1) {
//       const A = randSet(N, 8 * N);
//       const m = maxSidonSubset(A);
//       avg += m;
//       if (m > best) best = m;
//     }
//     rows.push({
//       family: 'random_realized_as_distinct_integers',
//       N,
//       trials,
//       best_max_sidon_size: best,
//       avg_max_sidon_size: Number((avg / trials).toPrecision(7)),
//       best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep530 = {
//     description: 'Exact small-N Sidon-subset maxima for interval and random sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
