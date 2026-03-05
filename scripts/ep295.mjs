#!/usr/bin/env node
// Canonical per-problem script for EP-295.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-295',
  source_count: 1,
  source_files: ["ep295_harmonic_lower_bound_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-295 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep295_harmonic_lower_bound_scan.mjs
// Kind: current_script_file
// Label: From ep295_harmonic_lower_bound_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const E_MINUS_1 = Math.E - 1;
// 
// function harmonicPrefix(nMax) {
//   const H = new Float64Array(nMax + 1);
//   H[0] = 0;
//   for (let n = 1; n <= nMax; n += 1) H[n] = H[n - 1] + 1 / n;
//   return H;
// }
// 
// function minKHarm(N, H) {
//   let lo = 1;
//   let hi = H.length - 1 - N + 1;
//   while (lo < hi) {
//     const mid = (lo + hi) >> 1;
//     const s = H[N + mid - 1] - H[N - 1];
//     if (s >= 1) hi = mid;
//     else lo = mid + 1;
//   }
//   return lo;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep295_harmonic_lower_bound_scan.json');
// 
// const nMax = 20000;
// const H = harmonicPrefix(120000);
// 
// const checkpoints = [];
// let maxGap = -1e9;
// let minGap = 1e9;
// for (let N = 10; N <= nMax; N += 1) {
//   const kHarm = minKHarm(N, H);
//   const gap = kHarm - E_MINUS_1 * N;
//   if (gap > maxGap) maxGap = gap;
//   if (gap < minGap) minGap = gap;
// 
//   if (N <= 200 || N % 500 === 0) {
//     checkpoints.push({
//       N,
//       k_harm_lower_bound: kHarm,
//       k_harm_minus_e_minus_1_N: gap,
//     });
//   }
// }
// 
// const out = {
//   problem: 'EP-295',
//   method: 'rigorous_harmonic_lower_bound',
//   lemma:
//     'If 1=sum_{i=1}^k 1/n_i with N<=n_1<...<n_k then H_{N+k-1}-H_{N-1}>=1, hence k(N)>=k_harm(N).',
//   n_max: nMax,
//   gap_summary_over_range: {
//     min_k_harm_minus_e_minus_1_N: minGap,
//     max_k_harm_minus_e_minus_1_N: maxGap,
//   },
//   checkpoints,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

