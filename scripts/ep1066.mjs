#!/usr/bin/env node
const meta={problem:'EP-1066',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1066 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite proxy via induced subgraphs of triangular-lattice contact graphs. ----
// // EP-1066: finite proxy via induced subgraphs of triangular-lattice contact graphs.
// {
//   const rng = makeRng(20260304 ^ 1066);
//   const W = 9;
//   const H = 9;
//   const coords = [];
//   const pos = new Map();
//   for (let x = 0; x < W; x += 1) {
//     for (let y = 0; y < H; y += 1) {
//       const id = coords.length;
//       coords.push([x, y]);
//       pos.set(`${x},${y}`, id);
//     }
//   }
// 
//   const dirs = [
//     [1, 0],
//     [0, 1],
//     [1, -1],
//     [-1, 0],
//     [0, -1],
//     [-1, 1],
//   ];
// 
//   const baseEdges = [];
//   for (let i = 0; i < coords.length; i += 1) {
//     const [x, y] = coords[i];
//     for (const [dx, dy] of dirs) {
//       const j = pos.get(`${x + dx},${y + dy}`);
//       if (j !== undefined && i < j) baseEdges.push([i, j]);
//     }
//   }
//   const baseMasks = adjacencyMasksFromEdgeList(coords.length, baseEdges);
// 
//   function alphaOfInduced(n) {
//     const verts = [...Array(coords.length).keys()];
//     shuffle(verts, rng);
//     const picked = verts.slice(0, n);
//     const masks = inducedMasks(baseMasks, picked);
//     const comp = Array(n).fill(0n);
//     for (let i = 0; i < n; i += 1) {
//       let m = 0n;
//       for (let j = 0; j < n; j += 1) {
//         if (i === j) continue;
//         if (((masks[i] >> BigInt(j)) & 1n) === 0n) m |= 1n << BigInt(j);
//       }
//       comp[i] = m;
//     }
//     return maxCliqueSizeFromAdjMasks(comp, n);
//   }
// 
//   const rows = [];
//   for (const n of [18, 24, 30, 36]) {
//     let bestAlpha = n;
//     const samples = [];
//     for (let t = 0; t < 10; t += 1) {
//       const a = alphaOfInduced(n);
//       samples.push(a);
//       if (a < bestAlpha) bestAlpha = a;
//     }
//     rows.push({
//       n,
//       min_alpha_found_in_samples: bestAlpha,
//       min_alpha_over_n: Number((bestAlpha / n).toPrecision(7)),
//       sampled_alpha_values: samples,
//     });
//   }
// 
//   out.results.ep1066 = {
//     description: 'Finite contact-graph proxy using induced subgraphs of a triangular-lattice unit-distance graph.',
//     base_patch_size: [W, H],
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
