#!/usr/bin/env node
const meta={problem:'EP-942',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-942 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | h(n) profile for powerful numbers in [n^2, (n+1)^2). ----
// // EP-942: h(n) profile for powerful numbers in [n^2, (n+1)^2).
// {
//   const N = 50_000;
//   const X = (N + 1) * (N + 1);
// 
//   const B = Math.floor(Math.cbrt(X));
//   const spfB = sieveSPF(B + 5);
//   const squarefree = new Uint8Array(B + 1);
//   squarefree.fill(1);
//   squarefree[0] = 0;
// 
//   for (let b = 2; b <= B; b += 1) {
//     let x = b;
//     let ok = true;
//     while (x > 1) {
//       const p = spfB[x] || x;
//       x = Math.floor(x / p);
//       if (x % p === 0) {
//         ok = false;
//         break;
//       }
//       while (x % p === 0) x = Math.floor(x / p);
//     }
//     squarefree[b] = ok ? 1 : 0;
//   }
// 
//   const vals = [];
//   for (let b = 1; b <= B; b += 1) {
//     if (!squarefree[b]) continue;
//     const b3 = b * b * b;
//     const maxA = Math.floor(Math.sqrt(X / b3));
//     for (let a = 1; a <= maxA; a += 1) {
//       vals.push(a * a * b3);
//     }
//   }
// 
//   vals.sort((u, v) => u - v);
//   const powerful = [];
//   for (let i = 0; i < vals.length; i += 1) {
//     if (i === 0 || vals[i] !== vals[i - 1]) powerful.push(vals[i]);
//   }
// 
//   let l = 0;
//   let r = 0;
//   const freq = new Map();
//   let maxH = 0;
//   let argN = -1;
// 
//   const rows = [];
//   const probes = new Set([1_000, 5_000, 10_000, 20_000, 35_000, 50_000]);
// 
//   for (let n = 1; n <= N; n += 1) {
//     const lo = n * n;
//     const hi = (n + 1) * (n + 1);
//     while (l < powerful.length && powerful[l] < lo) l += 1;
//     if (r < l) r = l;
//     while (r < powerful.length && powerful[r] < hi) r += 1;
//     const h = r - l;
//     freq.set(h, (freq.get(h) || 0) + 1);
//     if (h > maxH) {
//       maxH = h;
//       argN = n;
//     }
//     if (probes.has(n)) {
//       rows.push({
//         n,
//         h_n: h,
//         running_max_h_up_to_n: maxH,
//         density_h_eq_1_up_to_n: Number(((freq.get(1) || 0) / n).toPrecision(7)),
//       });
//     }
//   }
// 
//   const topFreq = [...freq.entries()]
//     .sort((a, b) => b[1] - a[1] || a[0] - b[0])
//     .slice(0, 12)
//     .map(([h, c]) => ({ h, count: c, density: Number((c / N).toPrecision(7)) }));
// 
//   out.results.ep942 = {
//     description: 'Finite profile of powerful-number counts in quadratic intervals [n^2,(n+1)^2).',
//     N,
//     max_h_found: maxH,
//     first_n_attaining_max_h: argN,
//     top_frequency_table: topFreq,
//     probe_rows: rows,
//   };
// }
// ==== End Batch Split Integrations ====
