#!/usr/bin/env node
const meta={problem:'EP-411',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-411 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | search for finite-window eventual patterns g_{k+r}(n)=2g_k(n). ----
// // EP-411: search for finite-window eventual patterns g_{k+r}(n)=2g_k(n).
// {
//   function g(n) {
//     if (n <= N_SMALL) return n + phi[n];
//     return n + phiByFactorization(n, primes);
//   }
// 
//   function iterG(n, len, cap) {
//     const arr = [n];
//     let x = n;
//     for (let i = 0; i < len; i += 1) {
//       x = g(x);
//       if (!Number.isFinite(x) || x > cap) return null;
//       arr.push(x);
//     }
//     return arr;
//   }
// 
//   const N = 20000;
//   const RMAX = 6;
//   const LEN = 26;
//   const CAP = 5e8;
//   const hits = [];
// 
//   for (let n = 2; n <= N; n += 1) {
//     const seq = iterG(n, LEN + RMAX, CAP);
//     if (!seq) continue;
//     for (let r = 1; r <= RMAX; r += 1) {
//       let found = false;
//       let bestK = null;
//       for (let K = 2; K <= 12; K += 1) {
//         let ok = true;
//         for (let k = K; k <= K + 7; k += 1) {
//           if (seq[k + r] !== 2 * seq[k]) {
//             ok = false;
//             break;
//           }
//         }
//         if (ok) {
//           found = true;
//           bestK = K;
//           break;
//         }
//       }
//       if (found) hits.push({ n, r, witness_K: bestK });
//     }
//   }
// 
//   function verifyKnown(n, r) {
//     const seq = iterG(n, 40 + r, 5e12);
//     if (!seq) return null;
//     for (let k = 4; k <= 35; k += 1) {
//       if (seq[k + r] !== 2 * seq[k]) return false;
//     }
//     return true;
//   }
// 
//   out.results.ep411 = {
//     description: 'Finite-window search for eventual doubling under iterates of g(n)=n+phi(n).',
//     scan_limit_n: N,
//     scan_limit_r: RMAX,
//     candidate_hits_first_40: hits.slice(0, 40),
//     hit_count_total: hits.length,
//     known_case_checks: [
//       { n: 10, r: 2, holds_on_checked_window: verifyKnown(10, 2) },
//       { n: 94, r: 2, holds_on_checked_window: verifyKnown(94, 2) },
//     ],
//   };
// }
// ==== End Batch Split Integrations ====
