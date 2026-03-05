#!/usr/bin/env node
// Canonical per-problem script for EP-1.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1',
  source_count: 1,
  source_files: ["harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: central binomial lower bound scale.
// // EP-1: central binomial lower bound scale.
// {
//   const nList = [8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];
//   const rows = [];
//   for (const n of nList) {
//     const c = chooseBigInt(n, Math.floor(n / 2));
//     const cNum = Number(c);
//     const ratioTo2n = cNum / 2 ** n;
//     rows.push({
//       n,
//       lower_bound_binom_central: c.toString(),
//       ratio_binom_over_2pow_n: Number(ratioTo2n.toFixed(8)),
//       scaled_ratio_times_sqrt_n: Number((ratioTo2n * Math.sqrt(n)).toFixed(8)),
//     });
//   }
//   out.results.ep1 = {
//     description: 'Central-binomial lower bound profile against 2^n scale.',
//     rows,
//   };
// }
// 
// // Global sieve for EP-5 / EP-15 and shared primality checks.
// const EP15_N_MAX = 1000000;
// let sieveLimit = nthPrimeUpper(EP15_N_MAX + 2);
// let sieveData = sieve(sieveLimit);
// while (sieveData.primes.length < EP15_N_MAX + 2) {
//   sieveLimit *= 2;
//   sieveData = sieve(sieveLimit);
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | central binomial lower bound scale. ----
// // EP-1: central binomial lower bound scale.
// {
//   const nList = [8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];
//   const rows = [];
//   for (const n of nList) {
//     const c = chooseBigInt(n, Math.floor(n / 2));
//     const cNum = Number(c);
//     const ratioTo2n = cNum / 2 ** n;
//     rows.push({
//       n,
//       lower_bound_binom_central: c.toString(),
//       ratio_binom_over_2pow_n: Number(ratioTo2n.toFixed(8)),
//       scaled_ratio_times_sqrt_n: Number((ratioTo2n * Math.sqrt(n)).toFixed(8)),
//     });
//   }
//   out.results.ep1 = {
//     description: 'Central-binomial lower bound profile against 2^n scale.',
//     rows,
//   };
// }
// 
// // Global sieve for EP-5 / EP-15 and shared primality checks.
// const EP15_N_MAX = 1000000;
// let sieveLimit = nthPrimeUpper(EP15_N_MAX + 2);
// let sieveData = sieve(sieveLimit);
// while (sieveData.primes.length < EP15_N_MAX + 2) {
//   sieveLimit *= 2;
//   sieveData = sieve(sieveLimit);
// }
// ==== End Batch Split Integrations ====
