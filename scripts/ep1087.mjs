#!/usr/bin/env node
// Canonical per-problem script for EP-1087.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1087',
  source_count: 1,
  source_files: ["ep1087_random_quadruple_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1087 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep1087_random_quadruple_scan.mjs
// Kind: current_script_file
// Label: From ep1087_random_quadruple_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function randInt(lo, hi) {
//   return lo + Math.floor(Math.random() * (hi - lo + 1));
// }
// 
// function sampleUniquePoints(n, coordMax) {
//   const pts = [];
//   const seen = new Set();
//   while (pts.length < n) {
//     const x = randInt(-coordMax, coordMax);
//     const y = randInt(-coordMax, coordMax);
//     const key = `${x},${y}`;
//     if (seen.has(key)) continue;
//     seen.add(key);
//     pts.push([x, y]);
//   }
//   return pts;
// }
// 
// function d2(a, b) {
//   const dx = a[0] - b[0];
//   const dy = a[1] - b[1];
//   return dx * dx + dy * dy;
// }
// 
// function degenerateQuadCount(points) {
//   const n = points.length;
//   let cnt = 0;
//   for (let i = 0; i < n; i += 1) {
//     for (let j = i + 1; j < n; j += 1) {
//       for (let k = j + 1; k < n; k += 1) {
//         for (let l = k + 1; l < n; l += 1) {
//           const ds = [
//             d2(points[i], points[j]),
//             d2(points[i], points[k]),
//             d2(points[i], points[l]),
//             d2(points[j], points[k]),
//             d2(points[j], points[l]),
//             d2(points[k], points[l]),
//           ];
//           let deg = false;
//           for (let a = 0; a < 6 && !deg; a += 1) {
//             for (let b = a + 1; b < 6; b += 1) {
//               if (ds[a] === ds[b]) {
//                 deg = true;
//                 break;
//               }
//             }
//           }
//           if (deg) cnt += 1;
//         }
//       }
//     }
//   }
//   return cnt;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep1087_random_quadruple_scan.json');
// 
// const nList = [12, 16, 20, 24, 28, 32];
// const trials = 80;
// const coordMax = 20000;
// 
// const rows = [];
// 
// for (const n of nList) {
//   let minVal = Number.POSITIVE_INFINITY;
//   let maxVal = -1;
//   let sum = 0;
// 
//   for (let t = 0; t < trials; t += 1) {
//     const pts = sampleUniquePoints(n, coordMax);
//     const v = degenerateQuadCount(pts);
//     if (v < minVal) minVal = v;
//     if (v > maxVal) maxVal = v;
//     sum += v;
//   }
// 
//   rows.push({
//     n,
//     trials,
//     min_degenerate_quadruples_found: minVal,
//     avg_degenerate_quadruples_found: sum / trials,
//     max_degenerate_quadruples_found: maxVal,
//     total_quadruples: (n * (n - 1) * (n - 2) * (n - 3)) / 24,
//   });
// 
//   process.stderr.write(`n=${n} done: min=${minVal}, avg=${(sum / trials).toFixed(2)}, max=${maxVal}\n`);
// }
// 
// const out = {
//   problem: 'EP-1087',
//   method: 'random_integer_point_sets_and_degenerate_quadruple_count',
//   interpretation_note:
//     'Degenerate quadruple here means among the six pairwise distances in the 4-point set, at least two are equal.',
//   coord_box: [-coordMax, coordMax],
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

