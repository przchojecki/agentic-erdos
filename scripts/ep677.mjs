#!/usr/bin/env node
const meta={problem:'EP-677',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-677 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | collision search for M(n,k)=lcm(n+1,...,n+k). ----
// // EP-677: collision search for M(n,k)=lcm(n+1,...,n+k).
// {
//   function M(n, k) {
//     let v = 1n;
//     for (let i = 1; i <= k; i += 1) {
//       v = lcmBig(v, BigInt(n + i));
//     }
//     return v;
//   }
// 
//   const NMAX = 500;
//   const KMAX = 8;
// 
//   const collisionsSameK = [];
//   const crossKCollisions = [];
// 
//   for (let k = 2; k <= KMAX; k += 1) {
//     const seen = new Map();
//     for (let n = 1; n <= NMAX; n += 1) {
//       const v = M(n, k).toString();
//       if (!seen.has(v)) seen.set(v, []);
//       const prev = seen.get(v);
// 
//       for (const m0 of prev) {
//         const a = Math.min(m0, n);
//         const b = Math.max(m0, n);
//         if (b >= a + k) {
//           collisionsSameK.push({ k, n: a, m: b, lcm_value_digits: v.length });
//         }
//       }
// 
//       prev.push(n);
//     }
//   }
// 
//   // Search M(n,k)=M(m,l) with l<k, m>=n+k, small ranges.
//   const vals = [];
//   for (let k = 2; k <= 6; k += 1) {
//     for (let n = 1; n <= 200; n += 1) {
//       vals.push({ n, k, v: M(n, k).toString() });
//     }
//   }
// 
//   const byValue = new Map();
//   for (const r of vals) {
//     if (!byValue.has(r.v)) byValue.set(r.v, []);
//     byValue.get(r.v).push(r);
//   }
// 
//   for (const arr of byValue.values()) {
//     if (arr.length < 2) continue;
//     for (let i = 0; i < arr.length; i += 1) {
//       for (let j = i + 1; j < arr.length; j += 1) {
//         const a = arr[i];
//         const b = arr[j];
//         let x = a;
//         let y = b;
//         if (x.k < y.k) {
//           const t = x;
//           x = y;
//           y = t;
//         }
//         if (y.k >= x.k) continue;
//         if (y.n >= x.n + x.k) {
//           crossKCollisions.push({ n: x.n, k: x.k, m: y.n, l: y.k });
//         }
//       }
//     }
//   }
// 
//   out.results.ep677 = {
//     description: 'Finite collision scan for equal interval-LCM values.',
//     search_limits: {
//       n_up_to_same_k: NMAX,
//       k_up_to_same_k: KMAX,
//       n_up_to_cross_k: 200,
//       k_up_to_cross_k: 6,
//     },
//     same_k_collisions_count: collisionsSameK.length,
//     first_40_same_k_collisions: collisionsSameK.slice(0, 40),
//     cross_k_collisions_count: crossKCollisions.length,
//     first_40_cross_k_collisions: crossKCollisions.slice(0, 40),
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch16_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
