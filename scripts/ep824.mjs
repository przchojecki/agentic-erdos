#!/usr/bin/env node
const meta={problem:'EP-824',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-824 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | coprime pairs with equal sigma. ----
// // EP-824: coprime pairs with equal sigma.
// {
//   const MAXX = 30_000;
//   const sigma = new Uint32Array(MAXX + 1);
//   for (let d = 1; d <= MAXX; d += 1) {
//     for (let m = d; m <= MAXX; m += d) sigma[m] += d;
//   }
// 
//   function hOfX(x) {
//     const mp = new Map();
//     for (let a = 1; a < x; a += 1) {
//       const s = sigma[a];
//       if (!mp.has(s)) mp.set(s, []);
//       mp.get(s).push(a);
//     }
// 
//     let h = 0;
//     for (const arr of mp.values()) {
//       if (arr.length < 2) continue;
//       for (let i = 0; i < arr.length; i += 1) {
//         for (let j = i + 1; j < arr.length; j += 1) {
//           if (gcd(arr[i], arr[j]) === 1) h += 1;
//         }
//       }
//     }
//     return h;
//   }
// 
//   const rows = [];
//   for (const x of [5_000, 10_000, 20_000, 30_000]) {
//     const h = hOfX(x);
//     rows.push({
//       x,
//       h_x: h,
//       h_over_x: Number((h / x).toPrecision(7)),
//       h_over_x_pow_1p5: Number((h / (x ** 1.5)).toPrecision(7)),
//       log_h_over_log_x: h > 0 ? Number((Math.log(h) / Math.log(x)).toPrecision(7)) : null,
//     });
//   }
// 
//   out.results.ep824 = {
//     description: 'Finite coprime-equal-sigma pair counts for increasing x.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch18_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
