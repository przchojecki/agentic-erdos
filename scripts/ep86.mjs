#!/usr/bin/env node
const meta={problem:'EP-86',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-86 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | greedy C4-free subgraphs in Q_d. ----
// // EP-86: greedy C4-free subgraphs in Q_d.
// {
//   const rows = [];
//   for (let d = 4; d <= 9; d += 1) {
//     const { edges, c4ByEdge } = hypercubeData(d);
//     let best = 0;
//     const trials = 100;
//     for (let t = 0; t < trials; t += 1) {
//       const order = Array.from({ length: edges.length }, (_, i) => i);
//       shuffle(order, rng);
//       const inG = new Uint8Array(edges.length);
//       let m = 0;
//       for (const e of order) {
//         let ok = true;
//         for (const tri of c4ByEdge[e]) {
//           if (inG[tri[0]] && inG[tri[1]] && inG[tri[2]]) {
//             ok = false;
//             break;
//           }
//         }
//         if (!ok) continue;
//         inG[e] = 1;
//         m += 1;
//       }
//       if (m > best) best = m;
//     }
//     rows.push({
//       d,
//       vertices: 2 ** d,
//       total_edges: edges.length,
//       best_C4_free_edges_found: best,
//       density_over_total_edges: Number((best / edges.length).toFixed(6)),
//       half_density_benchmark_edges: edges.length / 2,
//     });
//   }
//   out.results.ep86 = {
//     description: 'Random greedy lower profile for C4-free subgraphs of hypercubes.',
//     rows,
//   };
// }
// 
// // EP-89 and EP-90: distance profiles on grid/random/triangular models.
// {
//   const nList = [256, 400, 625, 900];
//   const rows89 = [];
//   const rows90 = [];
//   for (const n of nList) {
//     const grid = sqrtNGridPoints(n);
//     const tri = triPatchPoints(n);
//     const rnd = randomPoints(n, rng);
// 
//     const dGrid = distinctSquaredDistances(grid);
//     const dTri = distinctSquaredDistances(tri);
//     const dRnd = distinctSquaredDistances(rnd);
// 
//     rows89.push({
//       n,
//       distinct_distances_grid: dGrid,
//       distinct_distances_tri_patch: dTri,
//       distinct_distances_random: dRnd,
//       grid_ratio_over_n_over_sqrt_log_n: Number((dGrid / (n / Math.sqrt(Math.log(n)))).toFixed(6)),
//     });
// 
//     const uGrid = countUnitPairsLattice(grid, 'square');
//     const uTri = countUnitPairsLattice(tri, 'tri');
//     rows90.push({
//       n,
//       unit_pairs_grid: uGrid,
//       unit_pairs_tri_patch: uTri,
//       grid_ratio_over_n_1_plus_1_over_loglog_n: Number((uGrid / n ** (1 + 1 / Math.log(Math.log(n)))).toFixed(6)),
//       tri_ratio_over_n_1_plus_1_over_loglog_n: Number((uTri / n ** (1 + 1 / Math.log(Math.log(n)))).toFixed(6)),
//     });
//   }
//   out.results.ep89 = {
//     description: 'Distinct-distance finite profiles for grid/triangular/random point sets.',
//     rows: rows89,
//   };
//   out.results.ep90 = {
//     description: 'Unit-distance finite profiles for square-grid and triangular-lattice patches.',
//     rows: rows90,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch3_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
