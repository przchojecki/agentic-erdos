#!/usr/bin/env node
const meta={problem:'EP-365',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-365 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | consecutive powerful pairs. ----
// // EP-365: consecutive powerful pairs.
// {
//   const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
//   const mset = new Set(milestones);
//   const rows = [];
// 
//   let countPairs = 0;
//   let countBothNonSquare = 0;
//   const firstPairs = [];
//   const firstBothNonSquare = [];
// 
//   for (let n = 1; n <= LIMIT; n += 1) {
//     if (powerful[n] && powerful[n + 1]) {
//       countPairs += 1;
//       const nonSquare = !isSquareInt(n) && !isSquareInt(n + 1);
//       if (nonSquare) {
//         countBothNonSquare += 1;
//         if (firstBothNonSquare.length < 12) firstBothNonSquare.push(n);
//       }
//       if (firstPairs.length < 20) firstPairs.push(n);
//     }
// 
//     if (mset.has(n)) {
//       const ln = Math.log(n);
//       rows.push({
//         X: n,
//         pair_count_up_to_X: countPairs,
//         both_non_square_count_up_to_X: countBothNonSquare,
//         pair_count_over_log2: Number((countPairs / (ln * ln)).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep365 = {
//     description: 'Finite profile of consecutive powerful numbers n,n+1.',
//     first_pair_starts: firstPairs,
//     first_both_non_square_pair_starts: firstBothNonSquare,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
