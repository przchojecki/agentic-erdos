#!/usr/bin/env node
// Canonical per-problem script for EP-1004.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1004',
  source_count: 1,
  source_files: ["ep1004_phi_distinct_run_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1004 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep1004_phi_distinct_run_scan.mjs
// Kind: current_script_file
// Label: From ep1004_phi_distinct_run_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const X_MAX = Number(process.env.X_MAX || 4000000);
// 
// const phi = new Int32Array(X_MAX + 5000);
// for (let i = 0; i < phi.length; i++) phi[i] = i;
// for (let i = 2; i < phi.length; i++) {
//   if (phi[i] === i) {
//     for (let j = i; j < phi.length; j += i) phi[j] -= Math.floor(phi[j] / i);
//   }
// }
// 
// const cList = [0.5, 1.0, 1.5, 2.0];
// const checkpoints = [200000, 500000, 1000000, 2000000, X_MAX].filter((x, i, a) => x <= X_MAX && a.indexOf(x) === i);
// 
// const rows = [];
// 
// for (const x of checkpoints) {
//   let best = 0;
//   let bestN = -1;
//   for (let n = 1; n <= x; n++) {
//     const seen = new Set();
//     let L = 0;
//     while (n + L + 1 < phi.length) {
//       const v = phi[n + L + 1];
//       if (seen.has(v)) break;
//       seen.add(v);
//       L++;
//       if (L > best) {
//         best = L;
//         bestN = n;
//       }
//     }
//   }
// 
//   const targets = cList.map((c) => {
//     const t = Math.floor(Math.pow(Math.log(x), c));
//     return { c, target: t, achieved: best >= t };
//   });
// 
//   rows.push({ x, best_run_length_distinct_phi: best, witness_n: bestN, targets });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   x_max: X_MAX,
//   checkpoints: rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep1004_phi_distinct_run_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, x_max: X_MAX, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

