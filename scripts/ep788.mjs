#!/usr/bin/env node
// Canonical per-problem script for EP-788.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-788',
  source_count: 1,
  source_files: ["ep788_exact_small_n.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-788 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep788_exact_small_n.mjs
// Kind: current_script_file
// Label: From ep788_exact_small_n.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-788 exact small-n:
// // f(n)=min_B (|B| + alpha_B), where alpha_B is max size of C subset (n,2n)
// // such that c1+c2 notin B for distinct c1,c2 in C.
// 
// const N_LIST = (process.env.N_LIST || '5,6,7,8,9,10')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x >= 3 && x <= 15);
// 
// function popcount(x) {
//   let v = x;
//   let c = 0;
//   while (v) {
//     v &= v - 1;
//     c++;
//   }
//   return c;
// }
// 
// function exactFn(n) {
//   const cVals = Array.from({ length: n - 1 }, (_, i) => n + 1 + i); // (n,2n)
//   const bVals = Array.from({ length: 2 * n - 1 }, (_, i) => 2 * n + 1 + i); // (2n,4n)
//   const bIndex = new Map(bVals.map((v, i) => [v, i]));
// 
//   // Precompute all C subsets with pair-sum mask and size.
//   const cMasks = [];
//   for (let mask = 0; mask < (1 << cVals.length); mask++) {
//     let sumMask = 0;
//     let ok = true;
//     for (let i = 0; i < cVals.length; i++) {
//       if (!((mask >> i) & 1)) continue;
//       for (let j = i + 1; j < cVals.length; j++) {
//         if (!((mask >> j) & 1)) continue;
//         const s = cVals[i] + cVals[j];
//         if (!bIndex.has(s)) continue;
//         sumMask |= 1 << bIndex.get(s);
//       }
//     }
//     if (ok) cMasks.push({ cMask: mask, sumMask, size: popcount(mask) });
//   }
//   cMasks.sort((a, b) => b.size - a.size); // for fast alpha_B
// 
//   const B_LIMIT = 1 << bVals.length;
//   let best = Infinity;
//   let witnessB = null;
//   let witnessAlpha = null;
// 
//   for (let B = 0; B < B_LIMIT; B++) {
//     const bSize = popcount(B);
//     if (bSize >= best) continue; // alpha>=0
// 
//     let alpha = 0;
//     for (const item of cMasks) {
//       if ((item.sumMask & B) === 0) {
//         alpha = item.size;
//         break;
//       }
//     }
//     const val = bSize + alpha;
//     if (val < best) {
//       best = val;
//       witnessB = B;
//       witnessAlpha = alpha;
//     }
//   }
// 
//   const witnessBList = [];
//   for (let i = 0; i < bVals.length; i++) if ((witnessB >> i) & 1) witnessBList.push(bVals[i]);
// 
//   return {
//     n,
//     f_n_exact_small: best,
//     witness_B_size: witnessBList.length,
//     witness_alpha_B: witnessAlpha,
//     witness_B: witnessBList.slice(0, 30),
//   };
// }
// 
// const rows = [];
// for (const n of N_LIST) rows.push(exactFn(n));
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_list: N_LIST,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep788_exact_small_n.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

