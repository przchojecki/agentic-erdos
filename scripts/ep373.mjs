#!/usr/bin/env node
const meta={problem:'EP-373',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-373 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | finite search of low-factor-count factorial-product identities. ----
// // EP-373: finite search of low-factor-count factorial-product identities.
// {
//   const N2 = 400;
//   const N3 = 150;
// 
//   const k2 = [];
//   for (let n = 3; n <= N2; n += 1) {
//     const fn = fact[n];
//     for (let a = 2; a <= n - 2; a += 1) {
//       const fa = fact[a];
//       if (fn % fa !== 0n) continue;
//       const q = fn / fa;
//       const b = factIndex.get(q);
//       if (b === undefined) continue;
//       if (b < 2 || b > a || b > n - 2) continue;
//       k2.push({ n, a, b });
//     }
//   }
// 
//   const k3 = [];
//   for (let n = 4; n <= N3; n += 1) {
//     const fn = fact[n];
//     for (let a = 2; a <= n - 2; a += 1) {
//       const fa = fact[a];
//       for (let b = 2; b <= a; b += 1) {
//         const prod = fa * fact[b];
//         if (fn % prod !== 0n) continue;
//         const q = fn / prod;
//         const c = factIndex.get(q);
//         if (c === undefined) continue;
//         if (c < 2 || c > b || c > n - 2) continue;
//         k3.push({ n, a, b, c });
//       }
//     }
//   }
// 
//   out.results.ep373 = {
//     description: 'Finite search for n! = product of 2 or 3 factorials with top index <= n-2.',
//     search_limits: { N2, N3 },
//     k2_solution_count: k2.length,
//     k2_solutions: k2,
//     k3_solution_count: k3.length,
//     k3_solutions_first_40: k3.slice(0, 40),
//   };
// }
// ==== End Batch Split Integrations ====
