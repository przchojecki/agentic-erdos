#!/usr/bin/env node
const meta={problem:'EP-1059',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1059 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | finite prime scan for p-k! all composite. ----
// // EP-1059: finite prime scan for p-k! all composite.
// {
//   const P_MAX = 1_000_000;
//   const facts = [];
//   let f = 1;
//   for (let k = 1; k <= 12; k += 1) {
//     f *= k;
//     if (f >= P_MAX) break;
//     facts.push({ k, value: f });
//   }
// 
//   const hits = [];
//   const probeRows = [];
//   let cnt = 0;
//   const probes = new Set([100_000, 300_000, 600_000, 1_000_000]);
// 
//   for (let p = 2; p <= P_MAX; p += 1) {
//     if (spf[p] !== p) {
//       if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
//       continue;
//     }
// 
//     let good = true;
//     for (const { value } of facts) {
//       if (value >= p) break;
//       const q = p - value;
//       if (q <= 3 || spf[q] === q) {
//         good = false;
//         break;
//       }
//     }
//     if (good) {
//       cnt += 1;
//       if (hits.length < 40) hits.push(p);
//     }
//     if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
//   }
// 
//   out.results.ep1059 = {
//     description: 'Finite prime search for p where p-k! is composite for every factorial below p.',
//     P_MAX,
//     factorials_used: facts,
//     first_hits: hits,
//     probe_rows: probeRows,
//   };
// }
// ==== End Batch Split Integrations ====
