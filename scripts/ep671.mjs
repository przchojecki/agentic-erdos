#!/usr/bin/env node
// Canonical per-problem script for EP-671.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-671',
  source_count: 1,
  source_files: ["ep671_lagrange_lebesgue_demo.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-671 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep671_lagrange_lebesgue_demo.mjs
// Kind: current_script_file
// Label: From ep671_lagrange_lebesgue_demo.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_LIST = (process.env.N_LIST || '8,12,16,24,32,48').split(',').map(Number);
// const GRID = Number(process.env.GRID || 2001);
// 
// function chebyshevNodes(n) {
//   const a = [];
//   for (let i = 1; i <= n; i++) a.push(Math.cos(((2 * i - 1) * Math.PI) / (2 * n)));
//   return a.sort((x, y) => x - y);
// }
// 
// function equallySpacedNodes(n) {
//   const a = [];
//   for (let i = 0; i < n; i++) a.push(-1 + (2 * i) / (n - 1));
//   return a;
// }
// 
// function barycentricWeights(nodes) {
//   const n = nodes.length;
//   const w = new Array(n).fill(1);
//   for (let i = 0; i < n; i++) {
//     let wi = 1;
//     const xi = nodes[i];
//     for (let j = 0; j < n; j++) if (j !== i) wi *= (xi - nodes[j]);
//     w[i] = 1 / wi;
//   }
//   return w;
// }
// 
// function basisAbsSumAt(x, nodes, w) {
//   const n = nodes.length;
//   for (let i = 0; i < n; i++) if (Math.abs(x - nodes[i]) < 1e-14) return 1;
//   let denom = 0;
//   const num = new Array(n);
//   for (let i = 0; i < n; i++) {
//     const v = w[i] / (x - nodes[i]);
//     num[i] = v;
//     denom += v;
//   }
//   let s = 0;
//   for (let i = 0; i < n; i++) s += Math.abs(num[i] / denom);
//   return s;
// }
// 
// function interpAt(x, nodes, values, w) {
//   const n = nodes.length;
//   for (let i = 0; i < n; i++) if (Math.abs(x - nodes[i]) < 1e-14) return values[i];
//   let num = 0;
//   let den = 0;
//   for (let i = 0; i < n; i++) {
//     const v = w[i] / (x - nodes[i]);
//     num += v * values[i];
//     den += v;
//   }
//   return num / den;
// }
// 
// function runOne(name, makeNodes) {
//   const rows = [];
//   for (const n of N_LIST) {
//     const nodes = makeNodes(n);
//     const w = barycentricWeights(nodes);
// 
//     let lebMax = 0;
//     let errAbsAt0 = 0;
//     let errRungeAt0 = 0;
//     let errAbsSup = 0;
//     let errRungeSup = 0;
//     const f1vals = nodes.map((x) => Math.abs(x));
//     const f2vals = nodes.map((x) => 1 / (1 + 25 * x * x));
// 
//     for (let t = 0; t < GRID; t++) {
//       const x = -1 + (2 * t) / (GRID - 1);
//       const leb = basisAbsSumAt(x, nodes, w);
//       if (leb > lebMax) lebMax = leb;
// 
//       const f1 = Math.abs(x);
//       const p1 = interpAt(x, nodes, f1vals, w);
//       const e1 = Math.abs(p1 - f1);
//       if (e1 > errAbsSup) errAbsSup = e1;
// 
//       const f2 = 1 / (1 + 25 * x * x);
//       const p2 = interpAt(x, nodes, f2vals, w);
//       const e2 = Math.abs(p2 - f2);
//       if (e2 > errRungeSup) errRungeSup = e2;
//     }
// 
//     errAbsAt0 = Math.abs(interpAt(0, nodes, f1vals, w) - 0);
//     errRungeAt0 = Math.abs(interpAt(0, nodes, f2vals, w) - 1);
// 
//     rows.push({
//       n,
//       lebesgue_max_grid: Number(lebMax.toFixed(6)),
//       abs_function_error_at_0: Number(errAbsAt0.toExponential(6)),
//       abs_function_sup_error_grid: Number(errAbsSup.toExponential(6)),
//       runge_error_at_0: Number(errRungeAt0.toExponential(6)),
//       runge_sup_error_grid: Number(errRungeSup.toExponential(6)),
//     });
//   }
//   return { node_family: name, rows };
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_list: N_LIST,
//   grid_points: GRID,
//   runs: [runOne('chebyshev', chebyshevNodes), runOne('equally_spaced', equallySpacedNodes)],
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep671_lagrange_lebesgue_demo.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_list: N_LIST, grid: GRID }, null, 2));
// 
// ==== End Snippet ====

