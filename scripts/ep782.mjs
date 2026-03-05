#!/usr/bin/env node
const meta={problem:'EP-782',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-782 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | quasi-progressions and additive-cube probes in squares. ----
// // EP-782: quasi-progressions and additive-cube probes in squares.
// {
//   const N = 2_000_000;
//   const squares = [];
//   const isSquare = new Uint8Array(N + 1);
//   for (let k = 1; k * k <= N; k += 1) {
//     const s = k * k;
//     squares.push(s);
//     isSquare[s] = 1;
//   }
// 
//   function bestQuasiLen(C) {
//     const startLimit = Math.min(squares.length, 600);
//     const pairSpan = 80;
// 
//     const memo = new Map();
//     function ext(prev, d) {
//       const key = `${prev}|${d}`;
//       if (memo.has(key)) return memo.get(key);
//       let best = 0;
//       for (let z = 0; z <= C; z += 1) {
//         const nxt = prev + d + z;
//         if (nxt <= N && isSquare[nxt]) {
//           const e = 1 + ext(nxt, d);
//           if (e > best) best = e;
//         }
//       }
//       memo.set(key, best);
//       return best;
//     }
// 
//     let best = 1;
//     for (let i = 0; i < startLimit; i += 1) {
//       for (let j = i + 1; j < Math.min(startLimit, i + pairSpan); j += 1) {
//         const d = squares[j] - squares[i];
//         const len = 2 + ext(squares[j], d);
//         if (len > best) best = len;
//       }
//     }
//     return best;
//   }
// 
//   const quasiRows = [];
//   for (const C of [0, 1, 2, 4, 8, 12]) {
//     quasiRows.push({ C, search_cap_N: N, best_length_found: bestQuasiLen(C) });
//   }
// 
//   // 2D cube search: a, a+b1, a+b2, a+b1+b2 all squares.
//   let count2D = 0;
//   const examples2D = [];
//   const sqSmall = squares.filter((x) => x <= 200_000);
//   const sqSet = new Set(sqSmall);
// 
//   for (let i = 0; i < sqSmall.length; i += 1) {
//     const a = sqSmall[i];
//     for (let j = i + 1; j < sqSmall.length; j += 1) {
//       const b1 = sqSmall[j] - a;
//       if (b1 <= 0) continue;
//       for (let k = j + 1; k < Math.min(sqSmall.length, j + 50); k += 1) {
//         const b2 = sqSmall[k] - a;
//         if (sqSet.has(a + b1 + b2)) {
//           count2D += 1;
//           if (examples2D.length < 8) examples2D.push({ a, b1, b2 });
//         }
//       }
//     }
//   }
// 
//   // Random 3D cube probe.
//   const rng = makeRng(20260304 ^ 1802);
//   let found3D = 0;
//   let ex3D = null;
//   const sqRnd = sqSmall.slice(0, 1200);
//   const sqRndSet = new Set(sqRnd);
// 
//   for (let t = 0; t < 300_000; t += 1) {
//     const a = sqRnd[Math.floor(rng() * sqRnd.length)];
//     const x1 = sqRnd[Math.floor(rng() * sqRnd.length)];
//     const x2 = sqRnd[Math.floor(rng() * sqRnd.length)];
//     const x3 = sqRnd[Math.floor(rng() * sqRnd.length)];
//     const b1 = Math.abs(x1 - a);
//     const b2 = Math.abs(x2 - a);
//     const b3 = Math.abs(x3 - a);
//     if (!b1 || !b2 || !b3) continue;
// 
//     const vals = [
//       a,
//       a + b1,
//       a + b2,
//       a + b3,
//       a + b1 + b2,
//       a + b1 + b3,
//       a + b2 + b3,
//       a + b1 + b2 + b3,
//     ];
//     if (vals.every((v) => sqRndSet.has(v))) {
//       found3D += 1;
//       if (!ex3D) ex3D = { a, b1, b2, b3 };
//       if (found3D >= 3) break;
//     }
//   }
// 
//   out.results.ep782 = {
//     description: 'Finite quasi-progression and additive-cube probes inside square numbers.',
//     quasi_rows: quasiRows,
//     additive_cube_probe: {
//       search_cap_for_square_values: 200_000,
//       two_dimensional_cube_hits: count2D,
//       two_dimensional_examples: examples2D,
//       random_three_dimensional_hits: found3D,
//       first_three_dimensional_example: ex3D,
//     },
//   };
// }
// ==== End Batch Split Integrations ====
