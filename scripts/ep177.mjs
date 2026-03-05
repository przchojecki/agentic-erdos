#!/usr/bin/env node
const meta={problem:'EP-177',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-177 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite h_N(d) profiles for explicit +/-1 sequences. ----
// // EP-177: finite h_N(d) profiles for explicit +/-1 sequences.
// {
//   function thueMorseValue(i) {
//     let x = i;
//     let p = 0;
//     while (x > 0) {
//       p ^= x & 1;
//       x >>= 1;
//     }
//     return p ? -1 : 1;
//   }
// 
//   function maxProgDiscrepancyForD(seq, d) {
//     let best = 0;
//     const N = seq.length;
//     for (let r = 0; r < d; r += 1) {
//       let pref = 0;
//       let minPref = 0;
//       let maxPref = 0;
//       for (let i = r; i < N; i += d) {
//         pref += seq[i];
//         if (pref < minPref) minPref = pref;
//         if (pref > maxPref) maxPref = pref;
//       }
//       const disc = maxPref - minPref;
//       if (disc > best) best = disc;
//     }
//     return best;
//   }
// 
//   const N = 30000;
//   const dList = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];
// 
//   const thue = new Int8Array(N);
//   for (let i = 0; i < N; i += 1) thue[i] = thueMorseValue(i);
// 
//   const rows = [];
//   for (const d of dList) {
//     const th = maxProgDiscrepancyForD(thue, d);
// 
//     let bestRnd = Infinity;
//     for (let t = 0; t < 10; t += 1) {
//       const rnd = new Int8Array(N);
//       for (let i = 0; i < N; i += 1) rnd[i] = rng() < 0.5 ? -1 : 1;
//       const v = maxProgDiscrepancyForD(rnd, d);
//       if (v < bestRnd) bestRnd = v;
//     }
// 
//     rows.push({
//       d,
//       N_prefix: N,
//       thue_morse_hN_d: th,
//       random_best_of_10_hN_d: bestRnd,
//       thue_over_sqrt_d: Number((th / Math.sqrt(d)).toFixed(6)),
//       random_over_sqrt_d: Number((bestRnd / Math.sqrt(d)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep177 = {
//     description: 'Finite discrepancy profile h_N(d) for Thue-Morse and random +/-1 sequences.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
