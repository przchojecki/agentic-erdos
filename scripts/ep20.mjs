#!/usr/bin/env node
const meta={problem:'EP-20',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-20 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | random greedy sunflower-free families (k=3), small n-uniform regimes. ----
// // EP-20: random greedy sunflower-free families (k=3), small n-uniform regimes.
// {
//   const rng = makeRng(20260303);
//   const rows = [];
//   const mList = [3, 4, 5];
//   for (const m of mList) {
//     const U = 2 * m + 6;
//     const all = allSubsetsOfSize(U, m);
//     const trials = 60;
//     let best = 0;
//     let sum = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const order = all.slice();
//       shuffle(order, rng);
//       const fam = [];
//       for (const s of order) {
//         if (!candCreates3Sunflower(s, fam)) fam.push(s);
//       }
//       if (fam.length > best) best = fam.length;
//       sum += fam.length;
//     }
//     rows.push({
//       m,
//       universe_size: U,
//       candidate_sets_total: all.length,
//       trials,
//       best_family_size_found: best,
//       avg_family_size: Number((sum / trials).toFixed(4)),
//       best_size_to_the_1_over_m: Number((best ** (1 / m)).toFixed(6)),
//     });
//   }
//   out.results.ep20 = {
//     description: 'Small-scale random greedy profile for 3-sunflower-free m-uniform families.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
