#!/usr/bin/env node
const meta={problem:'EP-406',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-406 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | powers of 2 with ternary digits constraints. ----
// // EP-406: powers of 2 with ternary digits constraints.
// {
//   const NEXP = 20000;
//   const rows = [];
// 
//   const allow01 = new Set(['0', '1']);
//   const allow12 = new Set(['1', '2']);
// 
//   let v = 1n;
//   const hits01 = [];
//   const hits12 = [];
// 
//   let missing0After16 = 0;
//   let missing1After16 = 0;
//   let missing2After16 = 0;
// 
//   for (let n = 0; n <= NEXP; n += 1) {
//     const s = v.toString(3);
// 
//     if (hasOnlyDigitsSetBase(v, 3, allow01)) hits01.push(n);
//     if (hasOnlyDigitsSetBase(v, 3, allow12)) hits12.push(n);
// 
//     if (n >= 16) {
//       if (!s.includes('0')) missing0After16 += 1;
//       if (!s.includes('1')) missing1After16 += 1;
//       if (!s.includes('2')) missing2After16 += 1;
//     }
// 
//     if ([100, 1000, 5000, 10000, 20000].includes(n)) {
//       rows.push({
//         n,
//         count_hits_01_up_to_n: hits01.length,
//         count_hits_12_up_to_n: hits12.length,
//       });
//     }
// 
//     v <<= 1n;
//   }
// 
//   out.results.ep406 = {
//     description: 'Finite ternary-digit profile for powers of two.',
//     exponent_limit: NEXP,
//     exponents_with_only_digits_0_1: hits01,
//     exponents_with_only_digits_1_2: hits12,
//     counts_missing_digit_after_n_ge_16: {
//       missing_0: missing0After16,
//       missing_1: missing1After16,
//       missing_2: missing2After16,
//     },
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
