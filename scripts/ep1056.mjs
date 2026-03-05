#!/usr/bin/env node
const meta={problem:'EP-1056',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1056 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | search for consecutive-interval product == 1 (mod p). ----
// // EP-1056: search for consecutive-interval product == 1 (mod p).
// {
//   const PRIMES_MAX = 400;
//   const primes = [];
//   for (let p = 2; p <= PRIMES_MAX; p += 1) if (spf[p] === p) primes.push(p);
// 
//   const rows = [];
//   const kMaxByPrime = [];
// 
//   for (const p of primes) {
//     if (p < 5) continue;
//     const pref = new Int32Array(p);
//     pref[0] = 1 % p;
//     for (let i = 1; i < p; i += 1) pref[i] = (pref[i - 1] * i) % p;
// 
//     const pos = new Map();
//     for (let i = 0; i < p; i += 1) {
//       const v = pref[i];
//       if (!pos.has(v)) pos.set(v, []);
//       pos.get(v).push(i);
//     }
// 
//     let bestList = [];
//     for (const lst of pos.values()) if (lst.length > bestList.length) bestList = lst;
//     const kMax = Math.max(0, bestList.length - 1);
//     kMaxByPrime.push({ p, kMax });
// 
//     if (kMax >= 2 && rows.length < 10) {
//       const intervals = [];
//       for (let i = 1; i <= Math.min(kMax, 4); i += 1) {
//         intervals.push([bestList[i - 1] + 1, bestList[i]]);
//       }
//       rows.push({
//         p,
//         max_k_found_from_prefix_collisions: kMax,
//         sample_intervals_first_four: intervals,
//       });
//     }
//   }
// 
//   const firstRows = [];
//   for (let k = 2; k <= 7; k += 1) {
//     const hit = kMaxByPrime.find((r) => r.kMax >= k);
//     if (hit) firstRows.push({ k, first_prime_with_detected_solution_of_size_at_least_k: hit.p });
//   }
// 
//   out.results.ep1056 = {
//     description: 'Finite prefix-factorial collision search for consecutive-interval product congruent to 1 mod p.',
//     PRIMES_MAX,
//     sample_rows: rows,
//     first_prime_by_detected_k: firstRows,
//   };
// }
// ==== End Batch Split Integrations ====
