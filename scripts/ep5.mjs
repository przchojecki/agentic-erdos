#!/usr/bin/env node
// Canonical per-problem script for EP-5.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-5',
  source_count: 1,
  source_files: ["harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-5 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: normalized prime gap finite profile.
// // EP-5: normalized prime gap finite profile.
// {
//   const N_PRIMES = 400000;
//   const vals = [];
//   const binW = 0.25;
//   const bins = new Uint8Array(Math.floor(10 / binW));
//   let minVal = Infinity;
//   let maxVal = -Infinity;
//   let argMax = null;
//   for (let n = 2; n <= N_PRIMES; n += 1) {
//     const g = (sieveData.primes[n] - sieveData.primes[n - 1]) / Math.log(n);
//     if (g < minVal) minVal = g;
//     if (g > maxVal) {
//       maxVal = g;
//       argMax = n;
//     }
//     vals.push(g);
//     if (g >= 0 && g < 10) bins[Math.floor(g / binW)] = 1;
//   }
//   vals.sort((a, b) => a - b);
//   out.results.ep5 = {
//     description: 'Normalized prime-gap empirical distribution for first 4e5 prime indices.',
//     n_primes_used: N_PRIMES,
//     min_value: Number(minVal.toFixed(6)),
//     max_value: Number(maxVal.toFixed(6)),
//     argmax_index_n: argMax,
//     q05: Number(quantile(vals, 0.05).toFixed(6)),
//     q50: Number(quantile(vals, 0.5).toFixed(6)),
//     q95: Number(quantile(vals, 0.95).toFixed(6)),
//     occupied_bins_in_0_10_step_0_25: bins.reduce((s, x) => s + x, 0),
//     total_bins_in_0_10_step_0_25: bins.length,
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | normalized prime gap finite profile. ----
// // EP-5: normalized prime gap finite profile.
// {
//   const N_PRIMES = 400000;
//   const vals = [];
//   const binW = 0.25;
//   const bins = new Uint8Array(Math.floor(10 / binW));
//   let minVal = Infinity;
//   let maxVal = -Infinity;
//   let argMax = null;
//   for (let n = 2; n <= N_PRIMES; n += 1) {
//     const g = (sieveData.primes[n] - sieveData.primes[n - 1]) / Math.log(n);
//     if (g < minVal) minVal = g;
//     if (g > maxVal) {
//       maxVal = g;
//       argMax = n;
//     }
//     vals.push(g);
//     if (g >= 0 && g < 10) bins[Math.floor(g / binW)] = 1;
//   }
//   vals.sort((a, b) => a - b);
//   out.results.ep5 = {
//     description: 'Normalized prime-gap empirical distribution for first 4e5 prime indices.',
//     n_primes_used: N_PRIMES,
//     min_value: Number(minVal.toFixed(6)),
//     max_value: Number(maxVal.toFixed(6)),
//     argmax_index_n: argMax,
//     q05: Number(quantile(vals, 0.05).toFixed(6)),
//     q50: Number(quantile(vals, 0.5).toFixed(6)),
//     q95: Number(quantile(vals, 0.95).toFixed(6)),
//     occupied_bins_in_0_10_step_0_25: bins.reduce((s, x) => s + x, 0),
//     total_bins_in_0_10_step_0_25: bins.length,
//   };
// }
// ==== End Batch Split Integrations ====
