#!/usr/bin/env node
const meta={problem:'EP-125',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-125 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | density profile for A+B where A uses base-3 digits {0,1}, B base-4 digits {0,1}. ----
// // EP-125: density profile for A+B where A uses base-3 digits {0,1}, B base-4 digits {0,1}.
// {
//   function markAB(N) {
//     const A = digitSet(3, 0, N);
//     const B = digitSet(4, 0, N);
//     const mark = new Uint8Array(N + 1);
//     for (const a of A) {
//       for (const b of B) {
//         const s = a + b;
//         if (s <= N) mark[s] = 1;
//       }
//     }
//     return { A, B, mark };
//   }
// 
//   const rows = [];
//   for (const N of [20000, 50000, 100000, 200000, 500000, 800000]) {
//     const { A, B, mark } = markAB(N);
//     let covered = 0;
//     for (let x = 1; x <= N; x += 1) covered += mark[x];
//     const dens = covered / N;
// 
//     let tail = 0;
//     const L = Math.floor((3 * N) / 4);
//     for (let x = L; x <= N; x += 1) tail += mark[x];
//     const tailD = tail / (N - L + 1);
// 
//     rows.push({
//       N,
//       size_A: A.length,
//       size_B: B.length,
//       covered_1_to_N: covered,
//       density_1_to_N: Number(dens.toFixed(6)),
//       density_tail_3N_over_4_to_N: Number(tailD.toFixed(6)),
//       longest_missing_gap_up_to_N: longestGap(mark, N),
//     });
//   }
// 
//   out.results.ep125 = {
//     description: 'Finite density and gap profile for sums of base-{3,4} binary-digit sets.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch4_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
