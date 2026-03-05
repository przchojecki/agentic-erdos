#!/usr/bin/env node
// Canonical per-problem script for EP-1088.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1088',
  source_count: 1,
  source_files: ["ep1088_ep1089_construction_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1088 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep1088_ep1089_construction_scan.mjs
// Kind: current_script_file
// Label: From ep1088_ep1089_construction_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function crossPolytopePoints(d) {
//   const pts = [];
//   for (let i = 0; i < d; i += 1) {
//     const e = Array(d).fill(0);
//     e[i] = 1;
//     pts.push(e.slice());
//     e[i] = -1;
//     pts.push(e.slice());
//   }
//   return pts;
// }
// 
// function d2(a, b) {
//   let s = 0;
//   for (let i = 0; i < a.length; i += 1) {
//     const t = a[i] - b[i];
//     s += t * t;
//   }
//   return s;
// }
// 
// function distanceSpectrum(points) {
//   const vals = [];
//   for (let i = 0; i < points.length; i += 1) {
//     for (let j = i + 1; j < points.length; j += 1) vals.push(d2(points[i], points[j]));
//   }
//   vals.sort((a, b) => a - b);
//   const uniq = [];
//   for (const v of vals) if (uniq.length === 0 || uniq[uniq.length - 1] !== v) uniq.push(v);
//   return uniq;
// }
// 
// function hasScaleneTriple(points) {
//   const n = points.length;
//   for (let i = 0; i < n; i += 1) {
//     for (let j = i + 1; j < n; j += 1) {
//       for (let k = j + 1; k < n; k += 1) {
//         const a = d2(points[i], points[j]);
//         const b = d2(points[i], points[k]);
//         const c = d2(points[j], points[k]);
//         if (a !== b && a !== c && b !== c) return true;
//       }
//     }
//   }
//   return false;
// }
// 
// function randomPoints(d, m) {
//   const pts = [];
//   for (let i = 0; i < m; i += 1) {
//     const v = [];
//     for (let t = 0; t < d; t += 1) v.push(Math.random() * 2 - 1);
//     pts.push(v);
//   }
//   return pts;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep1088_ep1089_construction_scan.json');
// 
// const dList = [2, 3, 4, 5, 8, 10, 20, 30, 40];
// const trials = Number(process.argv[2] || 100);
// 
// const rows = [];
// for (const d of dList) {
//   const pts = crossPolytopePoints(d);
//   const spec = distanceSpectrum(pts);
//   const noScalene = !hasScaleneTriple(pts);
// 
//   // Random calibration: fraction of random sets of size 2d+1 that already contain a scalene triple.
//   let scaleneHits = 0;
//   const mRand = 2 * d + 1;
//   for (let t = 0; t < trials; t += 1) {
//     const rp = randomPoints(d, mRand);
//     if (hasScaleneTriple(rp)) scaleneHits += 1;
//   }
// 
//   rows.push({
//     d,
//     cross_polytope_size: pts.length,
//     cross_polytope_distinct_distance_count: spec.length,
//     cross_polytope_distance_values: spec,
//     cross_polytope_has_scalene_triple: !noScalene,
//     implied_lower_bound_f_d_3: pts.length + 1,
//     implied_lower_bound_g_d_3: pts.length + 1,
//     random_size_2d_plus_1_scalene_fraction: scaleneHits / trials,
//   });
// 
//   process.stderr.write(`d=${d}, two-distances=${spec.length}, random_scalene_frac=${(scaleneHits / trials).toFixed(2)}\n`);
// }
// 
// const out = {
//   problems: ['EP-1088', 'EP-1089'],
//   method: 'explicit_cross_polytope_construction_plus_random_calibration',
//   interpretation:
//     'Cross polytope gives a 2-distance set of size 2d, implying lower bounds for both f_d(3) and g_d(3).',
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

