#!/usr/bin/env node
const meta={problem:'EP-91',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-91 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | explicit small-n configurations from background and nearby examples. ----
// // EP-91: explicit small-n configurations from background and nearby examples.
// {
//   const rows = [];
// 
//   const square = [
//     [0, 0],
//     [1, 0],
//     [1, 1],
//     [0, 1],
//   ];
//   const triShare = [
//     [0, 0],
//     [1, 0],
//     [0.5, Math.sqrt(3) / 2],
//     [0.5, -Math.sqrt(3) / 2],
//   ];
//   rows.push({ n: 4, model: 'square', distinct_distances: distinctDistanceCount(square) });
//   rows.push({ n: 4, model: 'two_equilateral_triangles_sharing_edge', distinct_distances: distinctDistanceCount(triShare) });
// 
//   const pent = regularPolygon(5, 1, Math.PI / 2);
//   rows.push({ n: 5, model: 'regular_pentagon', distinct_distances: distinctDistanceCount(pent) });
// 
//   const nonagon = regularPolygon(9, 1, Math.PI / 2);
//   const hex = regularPolygon(6, 1, 0);
//   const center = [0, 0];
//   // Two reflections of the center across neighboring sides around one vertex of a regular hexagon.
//   const r1 = reflectPointAcrossLine(center, hex[0], hex[1]);
//   const r2 = reflectPointAcrossLine(center, hex[5], hex[0]);
//   const hegyiLike = [...hex, center, r1, r2];
// 
//   const dNonagon = distinctDistanceCount(nonagon);
//   const dHegyi = distinctDistanceCount(hegyiLike);
//   rows.push({ n: 9, model: 'regular_nonagon', distinct_distances: dNonagon });
//   rows.push({ n: 9, model: 'hexagon_plus_center_plus_two_reflections', distinct_distances: dHegyi });
//   rows.push({ n: 9, model: 'pair_same_distinct_count_in_this_probe', value: dNonagon === dHegyi });
// 
//   out.results.ep91 = {
//     description: 'Explicit finite configuration check for non-similar low-distance candidates.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
