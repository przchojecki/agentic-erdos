#!/usr/bin/env node
const meta={problem:'EP-342',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-342 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | Ulam sequence (1,2) finite structural diagnostics. ----
// // EP-342: Ulam sequence (1,2) finite structural diagnostics.
// {
//   function ulam12(terms) {
//     const a = [1, 2];
//     while (a.length < terms) {
//       const n = a[a.length - 1];
//       let x = n + 1;
//       while (true) {
//         let cnt = 0;
//         let i = 0;
//         let j = a.length - 1;
//         while (i < j) {
//           const s = a[i] + a[j];
//           if (s < x) i += 1;
//           else if (s > x) j -= 1;
//           else {
//             cnt += 1;
//             if (cnt > 1) break;
//             i += 1;
//             j -= 1;
//           }
//         }
//         if (cnt === 1) {
//           a.push(x);
//           break;
//         }
//         x += 1;
//       }
//     }
//     return a;
//   }
// 
//   const A = ulam12(3500);
//   const rows = [];
//   for (const X of [1000, 2000, 5000, 10000, 20000, 40000]) {
//     let c = 0;
//     for (const v of A) if (v <= X) c += 1;
//     rows.push({
//       X,
//       count_terms_le_X: c,
//       density: Number((c / X).toPrecision(6)),
//     });
//   }
// 
//   let twinPairs = 0;
//   const setA = new Set(A);
//   for (const x of A) if (setA.has(x + 2)) twinPairs += 1;
// 
//   const diffs = [];
//   for (let i = 1; i < A.length; i += 1) diffs.push(A[i] - A[i - 1]);
//   const tail = diffs.slice(-1200);
//   const periodRows = [];
//   for (const p of [2, 4, 6, 8, 10, 12, 16, 20]) {
//     let eq = 0;
//     let tot = 0;
//     for (let i = p; i < tail.length; i += 1) {
//       if (tail[i] === tail[i - p]) eq += 1;
//       tot += 1;
//     }
//     periodRows.push({
//       period: p,
//       tail_match_ratio: Number((eq / Math.max(1, tot)).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep342 = {
//     description: 'Finite density and gap-structure diagnostics for the Ulam (1,2) sequence.',
//     terms_generated: A.length,
//     last_term: A[A.length - 1],
//     twin_pair_count_in_prefix: twinPairs,
//     density_rows: rows,
//     periodicity_tail_rows: periodRows,
//   };
// }
// ==== End Batch Split Integrations ====
