#!/usr/bin/env node
const meta={problem:'EP-169',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-169 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | harmonic sums for k-AP-free greedy sets. ----
// // EP-169: harmonic sums for k-AP-free greedy sets.
// {
//   function greedyNo3AP(N) {
//     const inSet = new Uint8Array(N + 1);
//     const elems = [];
//     let h = 0;
//     for (let x = 1; x <= N; x += 1) {
//       let bad = false;
//       for (const y of elems) {
//         const z = 2 * y - x;
//         if (z >= 1 && inSet[z]) {
//           bad = true;
//           break;
//         }
//       }
//       if (!bad) {
//         inSet[x] = 1;
//         elems.push(x);
//         h += 1 / x;
//       }
//     }
//     return { size: elems.length, harmonic: h };
//   }
// 
//   function greedyNo4AP(N) {
//     const inSet = new Uint8Array(N + 1);
//     let size = 0;
//     let h = 0;
//     for (let x = 1; x <= N; x += 1) {
//       let bad = false;
//       for (let d = 1; x - 3 * d >= 1; d += 1) {
//         if (inSet[x - d] && inSet[x - 2 * d] && inSet[x - 3 * d]) {
//           bad = true;
//           break;
//         }
//       }
//       if (!bad) {
//         inSet[x] = 1;
//         size += 1;
//         h += 1 / x;
//       }
//     }
//     return { size, harmonic: h };
//   }
// 
//   const rows = [];
//   for (const N of [20000, 50000, 100000]) {
//     const v = greedyNo3AP(N);
//     rows.push({
//       k: 3,
//       N,
//       greedy_size: v.size,
//       harmonic_sum: Number(v.harmonic.toFixed(6)),
//       harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
//     });
//   }
//   for (const N of [4000, 8000, 12000]) {
//     const v = greedyNo4AP(N);
//     rows.push({
//       k: 4,
//       N,
//       greedy_size: v.size,
//       harmonic_sum: Number(v.harmonic.toFixed(6)),
//       harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep169 = {
//     description: 'Greedy finite harmonic-sum profiles for k-AP-free sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
