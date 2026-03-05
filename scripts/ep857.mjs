#!/usr/bin/env node
const meta={problem:'EP-857',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-857 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | 3-sunflower-free family size via greedy random construction. ----
// // EP-857: 3-sunflower-free family size via greedy random construction.
// {
//   const rng = makeRng(20260304 ^ 1904);
// 
//   function isSunflower3(a, b, c) {
//     const core = a & b & c;
//     return (a & b) === core && (a & c) === core && (b & c) === core;
//   }
// 
//   function greedyFamily(n, restarts) {
//     const total = 1 << n;
//     const all = Array.from({ length: total }, (_, i) => i);
//     let best = 0;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const order = [...all];
//       shuffle(order, rng);
//       const F = [];
// 
//       for (const s of order) {
//         let ok = true;
//         for (let i = 0; i < F.length && ok; i += 1) {
//           for (let j = i + 1; j < F.length; j += 1) {
//             if (isSunflower3(F[i], F[j], s)) {
//               ok = false;
//               break;
//             }
//           }
//         }
//         if (ok) F.push(s);
//       }
// 
//       if (F.length > best) best = F.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   const base = 3 / (2 ** (2 / 3));
//   for (const [n, restarts] of [[7, 60], [8, 50], [9, 40], [10, 30]]) {
//     const best = greedyFamily(n, restarts);
//     rows.push({
//       n,
//       restarts,
//       best_3sunflower_free_family_size_found: best,
//       ratio_over_base_pow_n: Number((best / (base ** n)).toPrecision(7)),
//       ratio_over_2_pow_n: Number((best / (2 ** n)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep857 = {
//     description: 'Greedy random lower-bound profile for weak-sunflower-free families (k=3).',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch19_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
