#!/usr/bin/env node
const meta={problem:'EP-377',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-377 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | f(n)=sum_{p<=n, p not | C(2n,n)} 1/p. ----
// // EP-377: f(n)=sum_{p<=n, p not | C(2n,n)} 1/p.
// {
//   const N = 20_000;
//   const primes = primesAll.filter((p) => p <= N);
//   const milestones = [1000, 5000, 10000, 15000, 20000];
//   const mset = new Set(milestones);
//   const rows = [];
// 
//   let sumAll = 0;
//   let maxF = -1;
//   let argMax = -1;
// 
//   for (let n = 1; n <= N; n += 1) {
//     let f = 0;
//     for (const p of primes) {
//       if (p > n) break;
//       if (noCarryDoubleInBase(n, p)) f += 1 / p;
//     }
// 
//     sumAll += f;
//     if (f > maxF) {
//       maxF = f;
//       argMax = n;
//     }
// 
//     if (mset.has(n)) {
//       rows.push({
//         X: n,
//         average_f_up_to_X: Number((sumAll / n).toPrecision(8)),
//         max_f_up_to_X: Number(maxF.toPrecision(8)),
//         argmax_n_up_to_X: argMax,
//       });
//     }
//   }
// 
//   out.results.ep377 = {
//     description: 'Finite profile of harmonic sum over primes not dividing C(2n,n).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
