#!/usr/bin/env node
const meta={problem:'EP-376',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-376 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | n such that C(2n,n) is coprime to 105. ----
// // EP-376: n such that C(2n,n) is coprime to 105.
// {
//   const N = 2_000_000;
//   const milestones = [10_000, 50_000, 100_000, 500_000, 1_000_000, 2_000_000];
//   const mset = new Set(milestones);
// 
//   let cnt = 0;
//   let lastHit = 0;
//   let maxGap = 0;
//   const first = [];
//   const rows = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     const ok = noCarryDoubleInBase(n, 3) && noCarryDoubleInBase(n, 5) && noCarryDoubleInBase(n, 7);
//     if (ok) {
//       cnt += 1;
//       if (first.length < 30) first.push(n);
//       if (lastHit !== 0) {
//         const gap = n - lastHit;
//         if (gap > maxGap) maxGap = gap;
//       }
//       lastHit = n;
//     }
//     if (mset.has(n)) {
//       rows.push({
//         X: n,
//         count_up_to_X: cnt,
//         density: Number((cnt / n).toPrecision(8)),
//         max_gap_so_far: maxGap,
//       });
//     }
//   }
// 
//   out.results.ep376 = {
//     description: 'Finite count of n with C(2n,n) coprime to 3*5*7 (digit/no-carry criterion).',
//     first_terms: first,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
