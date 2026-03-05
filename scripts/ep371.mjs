#!/usr/bin/env node
const meta={problem:'EP-371',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-371 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | density of P(n)<P(n+1). ----
// // EP-371: density of P(n)<P(n+1).
// {
//   const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
//   const mset = new Set(milestones);
//   const rows = [];
// 
//   let cnt = 0;
//   for (let n = 1; n <= LIMIT; n += 1) {
//     if (lpf[n] < lpf[n + 1]) cnt += 1;
//     if (mset.has(n)) {
//       const dens = cnt / n;
//       rows.push({
//         X: n,
//         count: cnt,
//         density: Number(dens.toPrecision(8)),
//         signed_error_from_half: Number((dens - 0.5).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep371 = {
//     description: 'Finite density profile of {n: P(n)<P(n+1)}.',
//     rows,
//   };
// }
// 
// // Factorial tables for EP-373/393.
// const FACT_MAX = 1000;
// const fact = [1n];
// for (let n = 1; n <= FACT_MAX; n += 1) fact.push(fact[n - 1] * BigInt(n));
// const factIndex = new Map();
// for (let n = 0; n <= FACT_MAX; n += 1) factIndex.set(fact[n], n);
// ==== End Batch Split Integrations ====
