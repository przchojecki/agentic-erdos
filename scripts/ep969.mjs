#!/usr/bin/env node
const meta={problem:'EP-969',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-969 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | squarefree counting error profile Q(x)-6/pi^2*x. ----
// // EP-969: squarefree counting error profile Q(x)-6/pi^2*x.
// {
//   const X = 2_000_000;
// 
//   const primes = [];
//   const lp = new Int32Array(X + 1);
//   const mu = new Int8Array(X + 1);
//   mu[1] = 1;
// 
//   for (let i = 2; i <= X; i += 1) {
//     if (lp[i] === 0) {
//       lp[i] = i;
//       primes.push(i);
//       mu[i] = -1;
//     }
//     for (const p of primes) {
//       const v = i * p;
//       if (v > X) break;
//       lp[v] = p;
//       if (p === lp[i]) {
//         mu[v] = 0;
//         break;
//       }
//       mu[v] = -mu[i];
//     }
//   }
// 
//   const c = 6 / (Math.PI * Math.PI);
//   let Q = 0;
//   let maxAbsE = 0;
// 
//   const scales = new Set([10_000, 100_000, 500_000, 1_000_000, 2_000_000]);
//   const rows = [];
// 
//   for (let x = 1; x <= X; x += 1) {
//     if (mu[x] !== 0) Q += 1;
//     const E = Q - c * x;
//     const aE = Math.abs(E);
//     if (aE > maxAbsE) maxAbsE = aE;
// 
//     if (scales.has(x)) {
//       rows.push({
//         x,
//         Q_x: Q,
//         E_x: Number(E.toPrecision(8)),
//         abs_E_x: Number(aE.toPrecision(8)),
//         max_abs_E_up_to_x: Number(maxAbsE.toPrecision(8)),
//         log_max_abs_E_over_log_x: Number((Math.log(maxAbsE) / Math.log(x)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep969 = {
//     description: 'Finite error-term profile for squarefree counting function Q(x).',
//     X,
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch21_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
