#!/usr/bin/env node
const meta={problem:'EP-338',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-338 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | restricted-order proxy with distinct summands for Bateman-type examples. ----
// // EP-338: restricted-order proxy with distinct summands for Bateman-type examples.
// {
//   function setBateman(h, limit) {
//     const A = [1];
//     for (let x = h; x <= limit; x += h) A.push(x);
//     return A;
//   }
// 
//   function distinctSubsetCoverage(A, Nmax) {
//     const can = new Uint8Array(Nmax + 1);
//     can[0] = 1;
//     for (const a of A) {
//       for (let s = Nmax - a; s >= 0; s -= 1) {
//         if (can[s]) can[s + a] = 1;
//       }
//     }
//     let covered = 0;
//     for (let n = 1; n <= Nmax; n += 1) if (can[n]) covered += 1;
//     return { can, covered };
//   }
// 
//   function unrestrictedCoverage(A, Nmax, tMax) {
//     const can = Array.from({ length: tMax + 1 }, () => new Uint8Array(Nmax + 1));
//     can[0][0] = 1;
//     for (let t = 1; t <= tMax; t += 1) {
//       const cur = can[t];
//       const prev = can[t - 1];
//       for (let s = 0; s <= Nmax; s += 1) {
//         if (!prev[s]) continue;
//         for (const a of A) {
//           const u = s + a;
//           if (u > Nmax) break;
//           cur[u] = 1;
//         }
//       }
//     }
//     return can;
//   }
// 
//   const rows = [];
//   for (const h of [3, 4, 5]) {
//     const A = setBateman(h, 600);
//     const Nmax = 1200;
//     const { can: distCan, covered } = distinctSubsetCoverage(A, Nmax);
//     let missingResidue = null;
//     for (let r = 0; r < h; r += 1) {
//       let allMissing = true;
//       for (let n = r; n <= Nmax; n += h) {
//         if (n > 0 && distCan[n]) {
//           allMissing = false;
//           break;
//         }
//       }
//       if (allMissing) {
//         missingResidue = r;
//         break;
//       }
//     }
// 
//     const un = unrestrictedCoverage(A, Nmax, h + 2);
//     let unrestrictedOrderProxy = null;
//     for (let t = 1; t <= h + 2; t += 1) {
//       let ok = true;
//       for (let n = 400; n <= Nmax; n += 1) {
//         let hit = false;
//         for (let j = 1; j <= t; j += 1) {
//           if (un[j][n]) {
//             hit = true;
//             break;
//           }
//         }
//         if (!hit) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         unrestrictedOrderProxy = t;
//         break;
//       }
//     }
// 
//     rows.push({
//       h,
//       A_size_up_to_600: A.length,
//       distinct_coverage_density_up_to_1200: Number((covered / Nmax).toPrecision(6)),
//       residue_class_fully_missing_distinct: missingResidue,
//       unrestricted_order_proxy_window_400_1200: unrestrictedOrderProxy,
//     });
//   }
// 
//   out.results.ep338 = {
//     description: 'Finite distinct-vs-unrestricted summand behavior for Bateman-style bases.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
