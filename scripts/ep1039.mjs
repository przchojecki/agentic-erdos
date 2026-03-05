#!/usr/bin/env node
const meta={problem:'EP-1039',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1039 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | grid-based radius estimates for largest discs in {|f|<1}. ----
// // EP-1039: grid-based radius estimates for largest discs in {|f|<1}.
// {
//   const rng = makeRng(20260304 ^ 1039);
//   const rows = [];
// 
//   function rootsOnUnitCircle(n) {
//     const r = [];
//     for (let j = 0; j < n; j += 1) {
//       const ang = (2 * Math.PI * j) / n;
//       r.push([Math.cos(ang), Math.sin(ang)]);
//     }
//     return r;
//   }
// 
//   function randomRootsInUnitDisk(n) {
//     const roots = [];
//     for (let i = 0; i < n; i += 1) {
//       const ang = 2 * Math.PI * rng();
//       const rad = Math.sqrt(rng());
//       roots.push([rad * Math.cos(ang), rad * Math.sin(ang)]);
//     }
//     return roots;
//   }
// 
//   for (const n of [8, 12, 16]) {
//     const circ = rootsOnUnitCircle(n);
//     const rand = randomRootsInUnitDisk(n);
//     const e1 = estimateRhoByGrid(circ);
//     const e2 = estimateRhoByGrid(rand);
// 
//     rows.push({
//       n,
//       circle_roots_rho_est: Number(e1.rho_est.toPrecision(7)),
//       circle_roots_n_times_rho_est: Number((n * e1.rho_est).toPrecision(7)),
//       random_roots_rho_est: Number(e2.rho_est.toPrecision(7)),
//       random_roots_n_times_rho_est: Number((n * e2.rho_est).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1039 = {
//     description: 'Finite grid-based geometric estimates for largest inscribed discs in polynomial lemniscate sublevel sets.',
//     rows,
//     caveat: 'These are coarse numerical estimates (grid + boundary sampling), not certified exact radii.',
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch22_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
