#!/usr/bin/env node
const meta={problem:'EP-65',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-65 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | cycle-length reciprocal sums for complete bipartite profile. ----
// // EP-65: cycle-length reciprocal sums for complete bipartite profile.
// {
//   const n = 400;
//   const kList = [2, 4, 8, 16, 24, 32, 40];
//   const rows = [];
//   for (const k of kList) {
//     const m = k * n;
//     let a = Math.max(2, Math.floor(m / n));
//     while (a < n && a * (n - a) < m) a += 1;
//     if (a >= n) a = n - 1;
//     const b = n - a;
//     const minPart = Math.min(a, b);
//     const recip = 0.5 * (harmonic(minPart) - 1);
//     rows.push({
//       n,
//       k,
//       target_edges_kn: m,
//       bipartition: [a, b],
//       edges_in_Kab: a * b,
//       reciprocal_cycle_length_sum_even_cycles_only: Number(recip.toFixed(6)),
//       reciprocal_sum_over_logk: Number((recip / Math.log(k)).toFixed(6)),
//     });
//   }
//   out.results.ep65 = {
//     description: 'Complete-bipartite cycle-length reciprocal profile at edge scale kn.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
