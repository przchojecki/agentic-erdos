#!/usr/bin/env node
// Canonical per-problem script for EP-935.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-935',
  source_count: 1,
  source_files: ["ep935_q2_product_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-935 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep935_q2_product_scan.mjs
// Kind: current_script_file
// Label: From ep935_q2_product_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function buildSpf(n) {
//   const spf = new Uint32Array(n + 1);
//   for (let i = 2; i <= n; i += 1) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i <= Math.floor(n / i)) {
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorWithSpf(x, spf, out) {
//   let v = x;
//   while (v > 1) {
//     const p = spf[v];
//     let e = 0;
//     while (v % p === 0) {
//       v = Math.floor(v / p);
//       e += 1;
//     }
//     out.set(p, (out.get(p) || 0) + e);
//   }
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep935_q2_product_scan.json');
// 
// const N = Number(process.argv[2] || 300000);
// const ellList = (process.argv[3] || '1,2,3,4').split(',').map((x) => Number(x));
// 
// const maxX = N + Math.max(...ellList) + 5;
// const spf = buildSpf(maxX);
// 
// const rows = [];
// for (const ell of ellList) {
//   let bestRatio = -1;
//   let bestRatioAt = null;
//   let bestOverN2p01 = -1;
//   let bestOverN2p01At = null;
//   let bestOverN2p10 = -1;
//   let bestOverN2p10At = null;
// 
//   const samples = [];
// 
//   for (let n = 2; n <= N; n += 1) {
//     const expo = new Map();
//     for (let t = 0; t <= ell; t += 1) factorWithSpf(n + t, spf, expo);
// 
//     let logQ2 = 0;
//     for (const [p, e] of expo.entries()) {
//       if (e >= 2) logQ2 += e * Math.log(p);
//     }
// 
//     const logn = Math.log(n);
//     const ratioN2 = Math.exp(logQ2 - 2 * logn);
//     const ratioN2p01 = Math.exp(logQ2 - 2.01 * logn);
//     const ratioN2p10 = Math.exp(logQ2 - 2.10 * logn);
// 
//     if (ratioN2 > bestRatio) {
//       bestRatio = ratioN2;
//       bestRatioAt = { n, ratio_over_n2: ratioN2 };
//     }
//     if (ratioN2p01 > bestOverN2p01) {
//       bestOverN2p01 = ratioN2p01;
//       bestOverN2p01At = { n, ratio_over_n2p01: ratioN2p01 };
//     }
//     if (ratioN2p10 > bestOverN2p10) {
//       bestOverN2p10 = ratioN2p10;
//       bestOverN2p10At = { n, ratio_over_n2p10: ratioN2p10 };
//     }
// 
//     if (n <= 40 || n % Math.floor(N / 12) === 0) {
//       samples.push({ n, ratio_over_n2: ratioN2 });
//     }
//   }
// 
//   rows.push({
//     ell,
//     N,
//     best_ratio_over_n2: bestRatioAt,
//     best_ratio_over_n2p01: bestOverN2p01At,
//     best_ratio_over_n2p10: bestOverN2p10At,
//     samples,
//   });
// 
//   process.stderr.write(`ell=${ell}, best_n2=${bestRatio.toFixed(4)}, best_n2.01=${bestOverN2p01.toFixed(4)}, best_n2.10=${bestOverN2p10.toFixed(4)}\n`);
// }
// 
// const out = {
//   problem: 'EP-935',
//   method: 'exact_prime_factor_scan_for_Q2_of_consecutive_product',
//   params: { N, ell_list: ellList },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

