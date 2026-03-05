#!/usr/bin/env node
// Canonical per-problem script for EP-317.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-317',
  source_count: 2,
  source_files: ["ep317_signed_harmonic_min_exact.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-317 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep317_signed_harmonic_min_exact.mjs
// Kind: current_script_file
// Label: From ep317_signed_harmonic_min_exact.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-317 exact finite profile:
// // For each n, compute
// //   M(n) = min_{delta_k in {-1,0,1}, not all giving zero} |sum_{k<=n} delta_k/k|
// // exactly via meet-in-the-middle on integer numerators over D=lcm(1..n).
// 
// const N_MAX = Number(process.env.N_MAX || 26);
// if (!Number.isInteger(N_MAX) || N_MAX < 3 || N_MAX > 30) {
//   throw new Error('N_MAX must be integer in [3,30] (script uses exact integer arithmetic in Number range)');
// }
// 
// function gcd(a, b) {
//   let x = Math.abs(a);
//   let y = Math.abs(b);
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x;
// }
// 
// function lcm(a, b) {
//   return Math.floor((a / gcd(a, b)) * b);
// }
// 
// function enumerateSums(coeffs) {
//   const out = [];
//   function dfs(i, s) {
//     if (i === coeffs.length) {
//       out.push(s);
//       return;
//     }
//     const c = coeffs[i];
//     dfs(i + 1, s);
//     dfs(i + 1, s + c);
//     dfs(i + 1, s - c);
//   }
//   dfs(0, 0);
//   return out;
// }
// 
// function lowerBound(arr, x) {
//   let lo = 0;
//   let hi = arr.length;
//   while (lo < hi) {
//     const mid = (lo + hi) >> 1;
//     if (arr[mid] < x) lo = mid + 1;
//     else hi = mid;
//   }
//   return lo;
// }
// 
// function minNonzeroAbsSignedSumNumerator(coeffs) {
//   const mid = Math.floor(coeffs.length / 2);
//   const left = coeffs.slice(0, mid);
//   const right = coeffs.slice(mid);
// 
//   const rightSums = enumerateSums(right).sort((a, b) => a - b);
//   const leftSums = enumerateSums(left);
// 
//   let best = Number.POSITIVE_INFINITY;
//   for (const sL of leftSums) {
//     const target = -sL;
//     const idx = lowerBound(rightSums, target);
// 
//     for (const j of [idx - 1, idx, idx + 1]) {
//       if (j < 0 || j >= rightSums.length) continue;
//       const v = Math.abs(sL + rightSums[j]);
//       if (v !== 0 && v < best) best = v;
//     }
//     if (best === 1) break; // cannot improve
//   }
// 
//   return best;
// }
// 
// const rows = [];
// let D = 1;
// for (let n = 1; n <= N_MAX; n += 1) {
//   D = lcm(D, n);
//   if (n < 3) continue;
// 
//   const coeffs = [];
//   for (let k = 1; k <= n; k += 1) coeffs.push(Math.floor(D / k));
// 
//   const t0 = Date.now();
//   const minNum = minNonzeroAbsSignedSumNumerator(coeffs);
//   const runtimeMs = Date.now() - t0;
// 
//   rows.push({
//     n,
//     lcm_1_to_n: D,
//     min_nonzero_numerator: minNum,
//     min_nonzero_value: `${minNum}/${D}`,
//     strict_gt_1_over_lcm_holds: minNum > 1,
//     equals_1_over_lcm: minNum === 1,
//     scaled_by_2_pow_n: Number(((minNum * (2 ** n)) / D).toFixed(12)),
//     runtime_ms: runtimeMs,
//   });
// }
// 
// const out = {
//   problem: 'EP-317',
//   script: path.basename(process.argv[1]),
//   method: 'exact_meet_in_the_middle_signed_harmonic_minimum',
//   n_max: N_MAX,
//   rows,
//   summary: {
//     first_n_with_strict_gt_1_over_lcm: rows.find((r) => r.strict_gt_1_over_lcm_holds)?.n ?? null,
//     first_n_with_equal_1_over_lcm: rows.find((r) => r.equals_1_over_lcm)?.n ?? null,
//   },
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep317_signed_harmonic_min_exact.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       n_max: N_MAX,
//       summary: out.summary,
//       last_row: rows[rows.length - 1],
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize signed harmonic min.
// // EP-317: summarize signed harmonic min.
// if (fs.existsSync('data/ep317_signed_harmonic_min_exact.json')) {
//   const d = loadJSON('data/ep317_signed_harmonic_min_exact.json');
//   out.results.ep317 = {
//     last_row: d.rows ? d.rows[d.rows.length - 1] : null,
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize signed harmonic min. ----
// // EP-317: summarize signed harmonic min.
// if (fs.existsSync('data/ep317_signed_harmonic_min_exact.json')) {
//   const d = loadJSON('data/ep317_signed_harmonic_min_exact.json');
//   out.results.ep317 = {
//     last_row: d.rows ? d.rows[d.rows.length - 1] : null,
//   };
// }
// ==== End Batch Split Integrations ====
