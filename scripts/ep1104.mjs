#!/usr/bin/env node
const meta={problem:'EP-1104',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1104 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite triangle-free chromatic profile (Mycielski + random process). ----
// // EP-1104: finite triangle-free chromatic profile (Mycielski + random process).
// {
//   function mycielski(masks) {
//     const n = masks.length;
//     const outMasks = Array(2 * n + 1).fill(0n);
//     for (let u = 0; u < n; u += 1) {
//       let m = masks[u];
//       while (m) {
//         const b = m & -m;
//         const v = bitIndexBigInt(b);
//         m ^= b;
//         if (u < v) {
//           outMasks[u] |= 1n << BigInt(v);
//           outMasks[v] |= 1n << BigInt(u);
//           outMasks[u] |= 1n << BigInt(n + v);
//           outMasks[n + v] |= 1n << BigInt(u);
//           outMasks[v] |= 1n << BigInt(n + u);
//           outMasks[n + u] |= 1n << BigInt(v);
//         }
//       }
//     }
//     const w = 2 * n;
//     for (let u = 0; u < n; u += 1) {
//       outMasks[n + u] |= 1n << BigInt(w);
//       outMasks[w] |= 1n << BigInt(n + u);
//     }
//     return outMasks;
//   }
// 
//   const c5 = adjacencyMasksFromEdgeList(5, [
//     [0, 1],
//     [1, 2],
//     [2, 3],
//     [3, 4],
//     [4, 0],
//   ]);
//   const m1 = mycielski(c5);
//   const m2 = mycielski(m1);
//   const family = [c5, m1, m2];
//   const familyRows = family.map((masks, i) => ({
//     graph: i === 0 ? 'C5' : `Mycielski^${i}(C5)`,
//     n: masks.length,
//     chi_exact: chromaticNumberDSATUR(adjacencyListFromMasks(masks)),
//   }));
// 
//   const rng = makeRng(20260304 ^ 1104);
//   function triangleFreeProcess(n) {
//     const edges = [];
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
//     }
//     shuffle(edges, rng);
//     const masks = Array(n).fill(0n);
//     for (const [u, v] of edges) {
//       if ((masks[u] & masks[v]) !== 0n) continue;
//       masks[u] |= 1n << BigInt(v);
//       masks[v] |= 1n << BigInt(u);
//     }
//     return masks;
//   }
// 
//   const randomRows = [];
//   for (const n of [18, 22, 26, 30]) {
//     let bestChi = 0;
//     for (let t = 0; t < 20; t += 1) {
//       const masks = triangleFreeProcess(n);
//       const chi = chromaticNumberDSATUR(adjacencyListFromMasks(masks));
//       if (chi > bestChi) bestChi = chi;
//     }
//     randomRows.push({
//       n,
//       best_chi_found_in_samples: bestChi,
//       proxy_sqrt_n_over_log_n: Number(Math.sqrt(n / Math.log(n)).toPrecision(7)),
//       ratio_best_over_sqrt_n_over_log_n: Number((bestChi / Math.sqrt(n / Math.log(n))).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1104 = {
//     description: 'Finite triangle-free chromatic profile from Mycielski constructions and random triangle-free process samples.',
//     mycielski_rows: familyRows,
//     random_rows: randomRows,
//   };
// }
// ==== End Batch Split Integrations ====
