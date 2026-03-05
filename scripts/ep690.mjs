#!/usr/bin/env node
const meta={problem:'EP-690',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-690 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch17_quick_compute.mjs | exact density profile d_k(p_i) via prime-divisibility recursion. ----
// // EP-690: exact density profile d_k(p_i) via prime-divisibility recursion.
// {
//   const P = sieve(500).primes; // first ~95 primes.
// 
//   function densityProfile(k, numPrimes) {
//     const delta = Array(k + 1).fill(0);
//     delta[0] = 1;
//     const vals = [];
// 
//     for (let i = 0; i < numPrimes; i += 1) {
//       const p = P[i];
//       const dkp = delta[k - 1] / p;
//       vals.push({ prime: p, density: dkp });
// 
//       const next = Array(k + 1).fill(0);
//       for (let r = 0; r <= k; r += 1) {
//         next[r] += delta[r] * (1 - 1 / p);
//         if (r >= 1) next[r] += delta[r - 1] * (1 / p);
//       }
//       for (let r = 0; r <= k; r += 1) delta[r] = next[r];
//     }
// 
//     return vals;
//   }
// 
//   const rows = [];
//   for (const k of [1, 2, 3, 4, 5, 6, 8, 10]) {
//     const vals = densityProfile(k, 70);
//     let peaks = 0;
//     for (let i = 1; i + 1 < vals.length; i += 1) {
//       if (vals[i].density > vals[i - 1].density && vals[i].density > vals[i + 1].density) peaks += 1;
//     }
//     let best = vals[0];
//     for (const v of vals) if (v.density > best.density) best = v;
// 
//     rows.push({
//       k,
//       sampled_primes: vals.length,
//       argmax_prime_sampled: best.prime,
//       max_density_sampled: Number(best.density.toPrecision(8)),
//       strict_local_maxima_count_sampled: peaks,
//       appears_unimodal_on_sample: peaks <= 1,
//     });
//   }
// 
//   out.results.ep690 = {
//     description: 'Exact sampled d_k(p) profiles from prime-divisibility density recursion.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
