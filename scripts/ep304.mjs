#!/usr/bin/env node
const meta={problem:'EP-304',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-304 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | finite small-b profile for N(a,b), N(b). ----
// // EP-304: finite small-b profile for N(a,b), N(b).
// {
//   const rows = [];
//   for (const b of [8, 10, 12, 15, 18, 24]) {
//     let solved = 0;
//     let unresolved = 0;
//     let maxMinLen = 0;
//     for (let a = 1; a < b; a += 1) {
//       const k = minEgyptLengthGeneral(a, b, { maxDen: 600, kMax: 8 });
//       if (k === null) {
//         unresolved += 1;
//       } else {
//         solved += 1;
//         if (k > maxMinLen) maxMinLen = k;
//       }
//     }
//     rows.push({
//       b,
//       solved_count: solved,
//       unresolved_count: unresolved,
//       max_min_length_among_solved: maxMinLen,
//       loglog_b: Number(Math.log(Math.log(b)).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep304 = {
//     description: 'Finite search profile for minimal Egyptian lengths N(a,b) on small denominators b.',
//     search_limits: { maxDen: 600, kMax: 8 },
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
