#!/usr/bin/env node
const meta={problem:'EP-1122',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1122 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite density profile of A={n: f(n+1)<f(n)} for sample additive functions. ----
// // EP-1122: finite density profile of A={n: f(n+1)<f(n)} for sample additive functions.
// {
//   const N = 200_000;
//   const spf = sieveSPF(N + 5);
// 
//   const omega = new Uint16Array(N + 1);
//   const Omega = new Uint16Array(N + 1);
// 
//   for (let n = 2; n <= N; n += 1) {
//     const p = spf[n] || n;
//     const m = Math.floor(n / p);
//     Omega[n] = Omega[m] + 1;
//     omega[n] = omega[m] + (m % p === 0 ? 0 : 1);
//   }
// 
//   const rng = makeRng(20260304 ^ 1122);
//   const w = new Float64Array(N + 1);
//   for (let p = 2; p <= N; p += 1) if ((spf[p] || p) === p) w[p] = 2 * rng() - 1;
//   const fRand = new Float64Array(N + 1);
//   for (let n = 2; n <= N; n += 1) {
//     const p = spf[n] || n;
//     fRand[n] = fRand[Math.floor(n / p)] + w[p];
//   }
// 
//   const probes = [10_000, 30_000, 60_000, 100_000, 150_000, 200_000];
//   let cLog = 0;
//   let cOmega = 0;
//   let comega = 0;
//   let cRand = 0;
//   const rows = [];
// 
//   for (let n = 1; n < N; n += 1) {
//     if (Math.log(n + 1) < Math.log(n)) cLog += 1;
//     if (Omega[n + 1] < Omega[n]) cOmega += 1;
//     if (omega[n + 1] < omega[n]) comega += 1;
//     if (fRand[n + 1] < fRand[n]) cRand += 1;
// 
//     if (probes.includes(n + 1)) {
//       rows.push({
//         x: n + 1,
//         density_A_for_log_n: Number((cLog / (n + 1)).toPrecision(7)),
//         density_A_for_Omega: Number((cOmega / (n + 1)).toPrecision(7)),
//         density_A_for_omega: Number((comega / (n + 1)).toPrecision(7)),
//         density_A_for_random_additive: Number((cRand / (n + 1)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep1122 = {
//     description: 'Finite density comparison of descent set A for sample additive functions.',
//     N,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
