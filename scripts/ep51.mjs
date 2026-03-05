#!/usr/bin/env node
const meta={problem:'EP-51',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-51 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | totient preimage minimum ratio profile. ----
// // EP-51: totient preimage minimum ratio profile.
// {
//   const LIM = 500000;
//   const phi = buildPhi(LIM);
//   const minN = new Uint32Array(LIM + 1);
//   const count = new Uint16Array(LIM + 1);
//   for (let n = 1; n <= LIM; n += 1) {
//     const v = phi[n];
//     if (v <= LIM) {
//       if (minN[v] === 0 || n < minN[v]) minN[v] = n;
//       if (count[v] < 65535) count[v] += 1;
//     }
//   }
//   let maxRatio = -1;
//   let argA = 0;
//   const samples = [];
//   for (let a = 1; a <= LIM; a += 1) {
//     if (minN[a] === 0) continue;
//     const r = minN[a] / a;
//     if (r > maxRatio) {
//       maxRatio = r;
//       argA = a;
//     }
//     if (a % 50000 === 0) samples.push({ a, ratio_min_n_over_a: Number(r.toFixed(6)), preimage_count_within_limit: count[a] });
//   }
//   out.results.ep51 = {
//     description: 'Finite profile of minimal preimage ratio n_a/a for Euler totient values up to 5e5.',
//     limit: LIM,
//     max_ratio_found: Number(maxRatio.toFixed(6)),
//     argmax_a: argA,
//     min_n_for_argmax: minN[argA],
//     sampled_points: samples,
//   };
// }
// ==== End Batch Split Integrations ====
