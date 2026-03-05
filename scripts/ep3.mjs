#!/usr/bin/env node
// Canonical per-problem script for EP-3.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-3',
  source_count: 1,
  source_files: ["harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-3 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: simple greedy 3-AP-free sequence growth and harmonic sum.
// // EP-3: simple greedy 3-AP-free sequence growth and harmonic sum.
// {
//   const NList = [1000, 3000, 10000, 30000, 100000];
//   const rows = [];
//   for (const N of NList) {
//     const inSet = new Uint8Array(N + 1);
//     const A = [];
//     let harmonic = 0;
//     for (let n = 1; n <= N; n += 1) {
//       let ok = true;
//       for (let i = 0; i < A.length; i += 1) {
//         const y = A[i];
//         const x = 2 * y - n;
//         if (x > 0 && inSet[x]) {
//           ok = false;
//           break;
//         }
//       }
//       if (!ok) continue;
//       inSet[n] = 1;
//       A.push(n);
//       harmonic += 1 / n;
//     }
//     rows.push({
//       N,
//       greedy_3ap_free_size: A.length,
//       size_over_sqrtN: Number((A.length / Math.sqrt(N)).toFixed(6)),
//       harmonic_sum_over_set: Number(harmonic.toFixed(6)),
//     });
//   }
//   out.results.ep3 = {
//     description: 'Ascending greedy 3-AP-free set profile (finite proxy only).',
//     rows,
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | simple greedy 3-AP-free sequence growth and harmonic sum. ----
// // EP-3: simple greedy 3-AP-free sequence growth and harmonic sum.
// {
//   const NList = [1000, 3000, 10000, 30000, 100000];
//   const rows = [];
//   for (const N of NList) {
//     const inSet = new Uint8Array(N + 1);
//     const A = [];
//     let harmonic = 0;
//     for (let n = 1; n <= N; n += 1) {
//       let ok = true;
//       for (let i = 0; i < A.length; i += 1) {
//         const y = A[i];
//         const x = 2 * y - n;
//         if (x > 0 && inSet[x]) {
//           ok = false;
//           break;
//         }
//       }
//       if (!ok) continue;
//       inSet[n] = 1;
//       A.push(n);
//       harmonic += 1 / n;
//     }
//     rows.push({
//       N,
//       greedy_3ap_free_size: A.length,
//       size_over_sqrtN: Number((A.length / Math.sqrt(N)).toFixed(6)),
//       harmonic_sum_over_set: Number(harmonic.toFixed(6)),
//     });
//   }
//   out.results.ep3 = {
//     description: 'Ascending greedy 3-AP-free set profile (finite proxy only).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
