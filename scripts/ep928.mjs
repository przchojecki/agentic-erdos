#!/usr/bin/env node
const meta={problem:'EP-928',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-928 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | empirical joint smoothness density profile. ----
// // EP-928: empirical joint smoothness density profile.
// {
//   const N = 1_000_000;
//   const lpf = new Uint32Array(N + 2);
// 
//   for (let p = 2; p <= N + 1; p += 1) {
//     if (lpf[p] !== 0) continue;
//     for (let m = p; m <= N + 1; m += p) lpf[m] = p;
//   }
//   lpf[1] = 1;
// 
//   const rows = [];
//   for (const [a, b] of [[0.5, 0.5], [0.5, 0.7], [0.7, 0.7], [0.8, 0.8]]) {
//     let ca = 0;
//     let cb = 0;
//     let cab = 0;
// 
//     for (let n = 2; n <= N; n += 1) {
//       const ea = lpf[n] < n ** a;
//       const eb = lpf[n + 1] < (n + 1) ** b;
//       if (ea) ca += 1;
//       if (eb) cb += 1;
//       if (ea && eb) cab += 1;
//     }
// 
//     const dn = N - 1;
//     const da = ca / dn;
//     const db = cb / dn;
//     const dj = cab / dn;
// 
//     rows.push({
//       alpha: a,
//       beta: b,
//       N,
//       density_event_a: Number(da.toPrecision(7)),
//       density_event_b: Number(db.toPrecision(7)),
//       density_joint: Number(dj.toPrecision(7)),
//       product_density: Number((da * db).toPrecision(7)),
//       joint_over_product: Number((dj / (da * db)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep928 = {
//     description: 'Finite empirical joint density profile for smooth n and n+1 events.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
