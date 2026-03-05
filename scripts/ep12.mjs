#!/usr/bin/env node
// Canonical per-problem script for EP-12.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-12',
  source_count: 1,
  source_files: ["harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-12 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: profile of the classical p^2, p = 3 mod 4 construction.
// // EP-12: profile of the classical p^2, p = 3 mod 4 construction.
// {
//   const NList = [10000, 100000, 1000000, 10000000, 100000000];
//   const pMod4eq3 = sieveData.primes.filter((p) => p <= 10000 && p % 4 === 3);
//   const seq = pMod4eq3.map((p) => p * p).sort((a, b) => a - b);
// 
//   const rows = [];
//   let ptr = 0;
//   let harmonic = 0;
//   for (const N of NList) {
//     while (ptr < seq.length && seq[ptr] <= N) {
//       harmonic += 1 / seq[ptr];
//       ptr += 1;
//     }
//     rows.push({
//       N,
//       count: ptr,
//       count_times_logN_over_sqrtN: Number((ptr * Math.log(N) / Math.sqrt(N)).toFixed(6)),
//       reciprocal_sum_partial: Number(harmonic.toFixed(8)),
//     });
//   }
// 
//   const M = Math.min(120, seq.length);
//   let violation = null;
//   for (let i = 0; i < M && !violation; i += 1) {
//     const a = seq[i];
//     for (let j = i + 1; j < M && !violation; j += 1) {
//       for (let k = j + 1; k < M; k += 1) {
//         if ((seq[j] + seq[k]) % a === 0) {
//           violation = { a, b: seq[j], c: seq[k] };
//           break;
//         }
//       }
//     }
//   }
// 
//   out.results.ep12 = {
//     description: 'Classical p^2 (p = 3 mod 4) construction profile and local property check.',
//     rows,
//     local_property_check_first_terms: {
//       checked_terms: M,
//       found_violation_a_divides_b_plus_c: violation !== null,
//       witness_if_any: violation,
//     },
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | profile of the classical p^2, p = 3 mod 4 construction. ----
// // EP-12: profile of the classical p^2, p = 3 mod 4 construction.
// {
//   const NList = [10000, 100000, 1000000, 10000000, 100000000];
//   const pMod4eq3 = sieveData.primes.filter((p) => p <= 10000 && p % 4 === 3);
//   const seq = pMod4eq3.map((p) => p * p).sort((a, b) => a - b);
// 
//   const rows = [];
//   let ptr = 0;
//   let harmonic = 0;
//   for (const N of NList) {
//     while (ptr < seq.length && seq[ptr] <= N) {
//       harmonic += 1 / seq[ptr];
//       ptr += 1;
//     }
//     rows.push({
//       N,
//       count: ptr,
//       count_times_logN_over_sqrtN: Number((ptr * Math.log(N) / Math.sqrt(N)).toFixed(6)),
//       reciprocal_sum_partial: Number(harmonic.toFixed(8)),
//     });
//   }
// 
//   const M = Math.min(120, seq.length);
//   let violation = null;
//   for (let i = 0; i < M && !violation; i += 1) {
//     const a = seq[i];
//     for (let j = i + 1; j < M && !violation; j += 1) {
//       for (let k = j + 1; k < M; k += 1) {
//         if ((seq[j] + seq[k]) % a === 0) {
//           violation = { a, b: seq[j], c: seq[k] };
//           break;
//         }
//       }
//     }
//   }
// 
//   out.results.ep12 = {
//     description: 'Classical p^2 (p = 3 mod 4) construction profile and local property check.',
//     rows,
//     local_property_check_first_terms: {
//       checked_terms: M,
//       found_violation_a_divides_b_plus_c: violation !== null,
//       witness_if_any: violation,
//     },
//   };
// }
// ==== End Batch Split Integrations ====
