#!/usr/bin/env node
// Canonical per-problem script for EP-691.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-691',
  source_count: 1,
  source_files: ["ep691_block_behrend_density_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-691 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep691_block_behrend_density_scan.mjs
// Kind: current_script_file
// Label: From ep691_block_behrend_density_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-691 finite block-sequence probe.
// // A = union_k (n_k, (1+eta_k)n_k] with eta_k = k^{-beta}.
// // Estimate density of multiples M_A in [1, X].
// 
// const X = Number(process.env.X || 500000);
// const RATIOS = (process.env.RATIOS || '2,3,5')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x > 1);
// const BETAS = (process.env.BETAS || '0.4,0.6,0.7,0.8,1.0,1.2')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x > 0);
// 
// function buildNk(ratio, x) {
//   const out = [];
//   let v = 2;
//   while (v <= x) {
//     out.push(v);
//     v = Math.floor(v * ratio);
//     if (v <= out[out.length - 1]) v = out[out.length - 1] + 1;
//   }
//   return out;
// }
// 
// function blockA(nk, beta, x) {
//   const set = new Set();
//   for (let i = 0; i < nk.length; i++) {
//     const k = i + 1;
//     const n = nk[i];
//     const eta = Math.pow(k, -beta);
//     const L = n + 1;
//     const R = Math.min(x, Math.floor((1 + eta) * n));
//     for (let a = L; a <= R; a++) set.add(a);
//   }
//   return [...set].sort((a, b) => a - b);
// }
// 
// function multiplesDensity(A, x) {
//   const mark = new Uint8Array(x + 1);
//   for (const a of A) {
//     for (let m = a; m <= x; m += a) mark[m] = 1;
//   }
//   let c = 0;
//   for (let i = 1; i <= x; i++) c += mark[i];
//   return c / x;
// }
// 
// const rows = [];
// for (const ratio of RATIOS) {
//   const nk = buildNk(ratio, X);
//   for (const beta of BETAS) {
//     const A = blockA(nk, beta, X);
//     const density = multiplesDensity(A, X);
//     rows.push({
//       ratio,
//       beta,
//       x: X,
//       nk_len: nk.length,
//       A_size: A.length,
//       multiples_density_up_to_x: Number(density.toFixed(6)),
//     });
//   }
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   x: X,
//   ratios: RATIOS,
//   betas: BETAS,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep691_block_behrend_density_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length, x: X }, null, 2));
// 
// ==== End Snippet ====

