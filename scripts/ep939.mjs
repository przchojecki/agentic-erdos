#!/usr/bin/env node
const meta={problem:'EP-939',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-939 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | finite search for r-powerful additive patterns. ----
// // EP-939: finite search for r-powerful additive patterns.
// {
//   const B = 2_000_000;
//   const spf = sieveSPF(B);
// 
//   function isRPowerful(n, r) {
//     let x = n;
//     while (x > 1) {
//       const p = spf[x] || x;
//       let e = 0;
//       while (x % p === 0) {
//         x = Math.floor(x / p);
//         e += 1;
//       }
//       if (e < r) return false;
//     }
//     return n > 1;
//   }
// 
//   function listRPowerful(r) {
//     const arr = [];
//     for (let n = 2; n <= B; n += 1) if (isRPowerful(n, r)) arr.push(n);
//     return arr;
//   }
// 
//   const list3 = listRPowerful(3);
//   const list4 = listRPowerful(4);
//   const list5 = listRPowerful(5);
// 
//   const set3 = new Set(list3);
//   const set4 = new Set(list4);
//   const set5 = new Set(list5);
// 
//   const triples3 = [];
//   for (let i = 0; i < list3.length; i += 1) {
//     const a = list3[i];
//     for (let j = i + 1; j < list3.length; j += 1) {
//       const b = list3[j];
//       const c = a + b;
//       if (c > B) break;
//       if (!set3.has(c)) continue;
//       if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
//       triples3.push({ a, b, c });
//       if (triples3.length >= 12) break;
//     }
//     if (triples3.length >= 12) break;
//   }
// 
//   const triples4 = [];
//   for (let i = 0; i < list4.length; i += 1) {
//     const a = list4[i];
//     for (let j = i + 1; j < list4.length; j += 1) {
//       const b = list4[j];
//       const c = a + b;
//       if (c > B) break;
//       if (!set4.has(c)) continue;
//       if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
//       triples4.push({ a, b, c });
//       if (triples4.length >= 12) break;
//     }
//     if (triples4.length >= 12) break;
//   }
// 
//   const quads5 = [];
//   for (let i = 0; i < list5.length; i += 1) {
//     const a = list5[i];
//     for (let j = i + 1; j < list5.length; j += 1) {
//       const b = list5[j];
//       for (let k = j + 1; k < list5.length; k += 1) {
//         const c = list5[k];
//         const d = a + b + c;
//         if (d > B) break;
//         if (!set5.has(d)) continue;
//         if (gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(b, c) !== 1) continue;
//         if (gcd(a, d) !== 1 || gcd(b, d) !== 1 || gcd(c, d) !== 1) continue;
//         quads5.push({ a, b, c, d });
//         if (quads5.length >= 8) break;
//       }
//       if (quads5.length >= 8) break;
//     }
//     if (quads5.length >= 8) break;
//   }
// 
//   out.results.ep939 = {
//     description: 'Finite additive search for coprime r-powerful patterns at r=3,4,5.',
//     B,
//     counts_r_powerful_up_to_B: {
//       r3: list3.length,
//       r4: list4.length,
//       r5: list5.length,
//     },
//     sample_coprime_3powerful_triples_a_plus_b_eq_c: triples3,
//     sample_coprime_4powerful_pairs_a_plus_b_eq_c: triples4,
//     sample_coprime_5powerful_triples_a_plus_b_plus_c_eq_d: quads5,
//   };
// }
// ==== End Batch Split Integrations ====
