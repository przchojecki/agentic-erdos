#!/usr/bin/env node
const meta={problem:'EP-478',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-478 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | size of A_p = {k! mod p}. ----
// // EP-478: size of A_p = {k! mod p}.
// {
//   function aPSize(p) {
//     let f = 1;
//     const seen = new Uint8Array(p);
//     for (let k = 1; k < p; k += 1) {
//       f = (f * k) % p;
//       seen[f] = 1;
//     }
//     let c = 0;
//     for (let i = 0; i < p; i += 1) c += seen[i];
//     return c;
//   }
// 
//   const samplePrimes = [101, 503, 1009, 5003, 10007, 20011, 50021, 100003, 200003, 500009];
//   const rows = [];
//   const target = 1 - 1 / Math.E;
// 
//   for (const p of samplePrimes) {
//     // ensure primality for larger sample items
//     if (p >= spf.length || spf[p] !== p) continue;
//     const s = aPSize(p);
//     rows.push({
//       p,
//       size_A_p: s,
//       ratio_A_p_over_p: Number((s / p).toPrecision(8)),
//       ratio_over_target_1_minus_1_over_e: Number((s / (target * p)).toPrecision(8)),
//       deficit_from_p_minus_2: p - 2 - s,
//     });
//   }
// 
//   let countEqualPminus2 = 0;
//   let countPrime = 0;
//   const smallLimit = 20000;
//   for (const p of primes) {
//     if (p > smallLimit) break;
//     countPrime += 1;
//     const s = aPSize(p);
//     if (s === p - 2) countEqualPminus2 += 1;
//   }
// 
//   out.results.ep478 = {
//     description: 'Finite profile of |A_p| for factorial residues modulo p.',
//     sample_rows: rows,
//     exhaustive_small_prime_scan_limit: smallLimit,
//     primes_scanned: countPrime,
//     count_with_A_p_equal_p_minus_2: countEqualPminus2,
//   };
// }
// ==== End Batch Split Integrations ====
