#!/usr/bin/env node
const meta={problem:'EP-856',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-856 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | greedy harmonic-sum maximization under no-k-equal-pairwise-lcm constraint. ----
// // EP-856: greedy harmonic-sum maximization under no-k-equal-pairwise-lcm constraint.
// {
//   function greedyFk(N, k) {
//     const A = [];
// 
//     for (let x = 1; x <= N; x += 1) {
//       let ok = true;
// 
//       if (k === 3) {
//         for (let i = 0; i < A.length && ok; i += 1) {
//           for (let j = i + 1; j < A.length; j += 1) {
//             const l1 = lcm(A[i], A[j]);
//             const l2 = lcm(A[i], x);
//             const l3 = lcm(A[j], x);
//             if (l1 === l2 && l2 === l3) {
//               ok = false;
//               break;
//             }
//           }
//         }
//       } else if (k === 4) {
//         for (let i = 0; i < A.length && ok; i += 1) {
//           for (let j = i + 1; j < A.length && ok; j += 1) {
//             for (let t = j + 1; t < A.length; t += 1) {
//               const vals = [A[i], A[j], A[t], x];
//               let target = null;
//               let allSame = true;
//               for (let u = 0; u < 4 && allSame; u += 1) {
//                 for (let v = u + 1; v < 4; v += 1) {
//                   const ll = lcm(vals[u], vals[v]);
//                   if (target === null) target = ll;
//                   else if (ll !== target) {
//                     allSame = false;
//                     break;
//                   }
//                 }
//               }
//               if (allSame) {
//                 ok = false;
//                 break;
//               }
//             }
//           }
//         }
//       }
// 
//       if (ok) A.push(x);
//     }
// 
//     let h = 0;
//     for (const a of A) h += 1 / a;
//     return { size: A.length, harmonic: h };
//   }
// 
//   const rows = [];
//   for (const N of [120, 200, 320, 500]) {
//     for (const k of [3, 4]) {
//       const g = greedyFk(N, k);
//       rows.push({
//         k,
//         N,
//         greedy_set_size: g.size,
//         greedy_harmonic_sum: Number(g.harmonic.toPrecision(7)),
//         over_logN: Number((g.harmonic / Math.log(N)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep856 = {
//     description: 'Finite greedy harmonic-sum profile under no-k-subset equal pairwise-lcm constraint.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
