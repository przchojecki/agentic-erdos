#!/usr/bin/env node
const meta={problem:'EP-261',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-261 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | structured subset-offset representations. ----
// // EP-261: structured subset-offset representations.
// {
//   function generatedNByOffsetSubsets(L, Nmax) {
//     const denBase = 1 << L;
//     const hit = new Uint8Array(Nmax + 1);
//     const totalMasks = 1 << L;
//     for (let mask = 1; mask < totalMasks; mask += 1) {
//       let bits = 0;
//       let C1 = 0;
//       let C0 = 0;
//       for (let i = 1; i <= L; i += 1) {
//         if (((mask >>> (i - 1)) & 1) === 0) continue;
//         bits += 1;
//         const w = 1 << (L - i);
//         C1 += w;
//         C0 += i * w;
//       }
//       if (bits < 2) continue;
//       const den = denBase - C1;
//       if (den <= 0) continue;
//       if (C0 % den !== 0) continue;
//       const n = C0 / den;
//       if (n >= 1 && n <= Nmax) hit[n] = 1;
//     }
//     return hit;
//   }
// 
//   const Nmax = 5000;
//   const rows = [];
//   const union = new Uint8Array(Nmax + 1);
//   for (const L of [8, 10, 12, 15, 20]) {
//     const h = generatedNByOffsetSubsets(L, Nmax);
//     let c = 0;
//     let mx = 0;
//     for (let n = 1; n <= Nmax; n += 1) {
//       if (h[n]) {
//         c += 1;
//         mx = n;
//         union[n] = 1;
//       }
//     }
//     rows.push({
//       offset_window_L: L,
//       represented_n_count_up_to_Nmax: c,
//       density_up_to_Nmax: Number((c / Nmax).toFixed(6)),
//       largest_represented_n_up_to_Nmax: mx,
//     });
//   }
// 
//   let unionCount = 0;
//   let unionMx = 0;
//   for (let n = 1; n <= Nmax; n += 1) {
//     if (union[n]) {
//       unionCount += 1;
//       unionMx = n;
//     }
//   }
// 
//   out.results.ep261 = {
//     description: 'Finite coverage profile from subset-offset representation ansatz a_i = n + i.',
//     Nmax,
//     rows,
//     union_over_L_up_to_20: {
//       represented_count: unionCount,
//       represented_density: Number((unionCount / Nmax).toFixed(6)),
//       largest_represented_n: unionMx,
//     },
//   };
// }
// 
// // EP-263 + EP-264: growth/criterion metrics.
// {
//   function logA(type, n) {
//     if (type === 'pow2pow2') return 2 ** n * Math.log(2); // a_n = 2^(2^n)
//     if (type === 'pow2n') return n * Math.log(2); // a_n = 2^n
//     if (type === 'factorial') {
//       let s = 0;
//       for (let i = 2; i <= n; i += 1) s += Math.log(i);
//       return s;
//     }
//     if (type === 'exp_exp_0.6') return Math.exp(0.6 * n);
//     if (type === 'exp_exp_0.8') return Math.exp(0.8 * n);
//     throw new Error('bad type');
//   }
// 
//   function criterionApprox(type, n) {
//     if (type === 'pow2n') {
//       // exact: a_n^2 * sum_{k>n} 1/a_k^2 = sum_{j>=1} 4^{-j} = 1/3
//       return 1 / 3;
//     }
//     const ln = logA(type, n);
//     let s = 0;
//     for (let k = n + 1; k <= n + 60; k += 1) {
//       const tk = 2 * (ln - logA(type, k));
//       const term = Math.exp(tk);
//       s += term;
//       if (term < 1e-16 && k > n + 6) break;
//     }
//     return s;
//   }
// 
//   const types = ['pow2pow2', 'pow2n', 'factorial', 'exp_exp_0.6', 'exp_exp_0.8'];
// 
//   const rows263 = [];
//   for (const type of types) {
//     for (const n of [4, 6, 8, 10, 12]) {
//       const ln = logA(type, n);
//       const lnNext = logA(type, n + 1);
//       rows263.push({
//         sequence: type,
//         n,
//         log_a_n: Number(ln.toExponential(6)),
//         log_ratio_a_next_over_a_n_sq: Number((lnNext - 2 * ln).toExponential(6)),
//         log_a_n_over_2_pow_n: Number((ln / 2 ** n).toExponential(6)),
//       });
//     }
//   }
// 
//   const rows264 = [];
//   for (const type of types) {
//     for (const n of [4, 6, 8, 10, 12]) {
//       const v = criterionApprox(type, n);
//       rows264.push({
//         sequence: type,
//         n,
//         approx_a_n_sq_times_tail_sum_reciprocal_sq: Number(v.toExponential(6)),
//       });
//     }
//   }
// 
//   out.results.ep263 = {
//     description: 'Growth-diagnostic metrics relevant to irrationality-sequence criteria (type [263]).',
//     rows: rows263,
//   };
// 
//   out.results.ep264 = {
//     description: 'Criterion-profile values a_n^2 * sum_{k>n} 1/a_k^2 for representative sequences (type [264]).',
//     rows: rows264,
//   };
// }
// ==== End Batch Split Integrations ====
