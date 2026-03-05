#!/usr/bin/env node
const meta={problem:'EP-929',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-929 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | finite-density proxy for S(k). ----
// // EP-929: finite-density proxy for S(k).
// {
//   const N = 250000;
//   const LIM = N + 80;
//   const lpf = new Uint32Array(LIM + 1);
//   for (let p = 2; p <= LIM; p += 1) {
//     if (lpf[p] !== 0) continue;
//     for (let m = p; m <= LIM; m += p) lpf[m] = p;
//   }
//   lpf[1] = 1;
// 
//   function blockDensity(k, x) {
//     const M = N + k + 2;
//     const bad = new Uint8Array(M + 1);
//     for (let i = 1; i <= M; i += 1) bad[i] = lpf[i] <= x ? 0 : 1;
// 
//     let curBad = 0;
//     for (let i = 2; i <= 1 + k; i += 1) curBad += bad[i];
// 
//     let good = 0;
//     const total = N;
//     for (let n = 1; n <= N; n += 1) {
//       if (curBad === 0) good += 1;
//       curBad -= bad[n + 1];
//       curBad += bad[n + k + 1];
//     }
// 
//     return { good, density: good / total };
//   }
// 
//   const rows = [];
//   for (const k of [6, 8, 10, 12, 16]) {
//     const maxX = k + 8;
//     let xPos = null;
//     let xDense = null;
//     const eps = 1e-4;
//     const profile = [];
// 
//     for (let x = 2; x <= maxX; x += 1) {
//       const d = blockDensity(k, x);
//       profile.push({ x, good_starts: d.good, density: Number(d.density.toPrecision(7)) });
//       if (xPos === null && d.good > 0) xPos = x;
//       if (xDense === null && d.density >= eps) xDense = x;
//     }
// 
//     rows.push({
//       k,
//       N,
//       eps_density_threshold: eps,
//       finite_min_x_with_any_occurrence: xPos,
//       finite_min_x_with_density_at_least_eps: xDense,
//       profile,
//     });
//   }
// 
//   out.results.ep929 = {
//     description: 'Finite positive-density proxy profile for S(k) using bounded-window smooth blocks.',
//     rows,
//     note: 'Finite-N proxy depends on chosen epsilon threshold and search range for x.',
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch20_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
