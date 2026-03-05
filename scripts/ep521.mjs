#!/usr/bin/env node
const meta={problem:'EP-521',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-521 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | approximate real-root counts in [-1,1] for random +/-1 polynomials. ----
// // EP-521: approximate real-root counts in [-1,1] for random +/-1 polynomials.
// {
//   const rng = makeRng(20260303 ^ 1307);
// 
//   function evalPoly(coeff, x) {
//     let v = 0;
//     for (let i = coeff.length - 1; i >= 0; i -= 1) v = v * x + coeff[i];
//     return v;
//   }
// 
//   function approxRootsInInterval(coeff, L, R, grid = 700) {
//     const eps = 1e-10;
//     let roots = 0;
//     let prev = evalPoly(coeff, L);
//     if (Math.abs(prev) < eps) prev = 0;
// 
//     for (let i = 1; i <= grid; i += 1) {
//       const x = L + ((R - L) * i) / grid;
//       let cur = evalPoly(coeff, x);
//       if (Math.abs(cur) < eps) cur = 0;
// 
//       if (prev === 0 && cur === 0) {
//         // skip flat near-zero numerics
//       } else if (prev === 0 || cur === 0) {
//         roots += 1;
//       } else if (prev * cur < 0) {
//         roots += 1;
//       }
// 
//       prev = cur;
//     }
//     return roots;
//   }
// 
//   const rows = [];
//   for (const [n, trials] of [[150, 80], [300, 70], [600, 60], [900, 50]]) {
//     let sumRoots = 0;
//     let maxRoots = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const coeff = Array.from({ length: n + 1 }, () => (rng() < 0.5 ? -1 : 1));
//       const r = approxRootsInInterval(coeff, -1, 1, 700);
//       sumRoots += r;
//       if (r > maxRoots) maxRoots = r;
//     }
// 
//     const avg = sumRoots / trials;
//     rows.push({
//       n,
//       trials,
//       approx_avg_roots_in_minus1_1: Number(avg.toPrecision(7)),
//       approx_avg_over_log_n: Number((avg / Math.log(n)).toPrecision(7)),
//       approx_max_roots_in_minus1_1: maxRoots,
//     });
//   }
// 
//   out.results.ep521 = {
//     description: 'Approximate root-count profile in [-1,1] for random ±1-coefficient polynomials.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch13_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
