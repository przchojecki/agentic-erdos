#!/usr/bin/env node
// Canonical per-problem script for EP-790.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-790',
  source_count: 1,
  source_files: ["ep790_interval_model_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-790 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep790_interval_model_scan.mjs
// Kind: current_script_file
// Label: From ep790_interval_model_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function popcount(x) {
//   let v = x;
//   let c = 0;
//   while (v) {
//     v &= v - 1;
//     c += 1;
//   }
//   return c;
// }
// 
// function* combinations(arr, k) {
//   const n = arr.length;
//   const idx = Array.from({ length: k }, (_, i) => i);
//   while (true) {
//     yield idx.map((i) => arr[i]);
//     let p = k - 1;
//     while (p >= 0 && idx[p] === n - k + p) p -= 1;
//     if (p < 0) return;
//     idx[p] += 1;
//     for (let q = p + 1; q < k; q += 1) idx[q] = idx[q - 1] + 1;
//   }
// }
// 
// function subsetSums(arr) {
//   const sums = new Map();
//   const n = arr.length;
//   const total = 1 << n;
//   for (let mask = 1; mask < total; mask += 1) {
//     let s = 0;
//     for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) s += arr[i];
//     sums.set(mask, s);
//   }
//   return sums;
// }
// 
// function isStrongSumFree(B) {
//   const m = B.length;
//   if (m <= 2) return true;
// 
//   // Check if any x in B is sum of >=2 other distinct elements.
//   for (let i = 0; i < m; i += 1) {
//     const x = B[i];
//     const others = B.filter((_, j) => j !== i);
//     const t = others.length;
//     const total = 1 << t;
//     for (let mask = 1; mask < total; mask += 1) {
//       if (popcount(mask) < 2) continue;
//       let s = 0;
//       for (let j = 0; j < t; j += 1) if ((mask >> j) & 1) s += others[j];
//       if (s === x) return false;
//     }
//   }
// 
//   return true;
// }
// 
// function maxGoodSubsetSize(A) {
//   const n = A.length;
//   const total = 1 << n;
//   const bySize = Array.from({ length: n + 1 }, () => []);
//   for (let mask = 1; mask < total; mask += 1) bySize[popcount(mask)].push(mask);
// 
//   for (let s = n; s >= 1; s -= 1) {
//     for (const mask of bySize[s]) {
//       const B = [];
//       for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) B.push(A[i]);
//       if (isStrongSumFree(B)) return { size: s, witness: B };
//     }
//   }
// 
//   return { size: 0, witness: [] };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep790_interval_model_scan.json');
// 
// const configs = [
//   { n: 5, M: 14 },
//   { n: 6, M: 16 },
//   { n: 7, M: 18 },
//   { n: 8, M: 20 },
// ];
// 
// const rows = [];
// 
// for (const { n, M } of configs) {
//   const universe = Array.from({ length: M + 1 }, (_, i) => i);
//   let bestUpper = n;
//   let hardA = null;
//   let hardWitness = null;
//   let totalA = 0;
// 
//   for (const A of combinations(universe, n)) {
//     totalA += 1;
//     const r = maxGoodSubsetSize(A);
//     if (r.size < bestUpper) {
//       bestUpper = r.size;
//       hardA = A.slice();
//       hardWitness = r.witness.slice();
//     }
//   }
// 
//   rows.push({
//     n,
//     M,
//     total_A_checked: totalA,
//     interval_model_upper_bound_on_l_n: bestUpper,
//     hardest_A_found: hardA,
//     witness_B_in_hardest_A: hardWitness,
//   });
// 
//   process.stderr.write(`n=${n}, M=${M}, checked=${totalA}, bound<=${bestUpper}\n`);
// }
// 
// const out = {
//   problem: 'EP-790',
//   method: 'exact_interval_model_exhaustive_search_for_strong_sum_free_subsets',
//   note: 'Model restricts A to [0,M], so bounds are surrogate and may not equal true l(n).',
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

