#!/usr/bin/env node
// Canonical per-problem script for EP-1107.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1107',
  source_count: 2,
  source_files: ["ep1107_r_powerful_bitset_scan.mjs","ep1107_r_powerful_sum_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1107 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep1107_r_powerful_bitset_scan.mjs
// Kind: current_script_file
// Label: From ep1107_r_powerful_bitset_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const R_LIST = (process.env.R_LIST || '3,4').split(',').map((x) => Number(x.trim())).filter(Boolean);
// const N_MAX = Number(process.env.N_MAX || 1000000);
// 
// function sieveSpf(n) {
//   const spf = new Int32Array(n + 1);
//   for (let i = 2; i <= n; i++) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i * i <= n) {
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function isRPowerful(n, r, spf) {
//   if (n === 1) return true;
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e++;
//     }
//     if (e < r) return false;
//   }
//   return true;
// }
// 
// function setBit(bs, pos) {
//   bs[pos >>> 5] |= 1 << (pos & 31);
// }
// 
// function getBit(bs, pos) {
//   return ((bs[pos >>> 5] >>> (pos & 31)) & 1) !== 0;
// }
// 
// function orInto(a, b) {
//   for (let i = 0; i < a.length; i++) a[i] |= b[i];
// }
// 
// function shiftedOrFrom(prev, shift, out, nMax) {
//   const words = out.length;
//   const wShift = shift >>> 5;
//   const bShift = shift & 31;
// 
//   if (bShift === 0) {
//     for (let i = 0; i + wShift < words; i++) {
//       const v = prev[i];
//       if (v !== 0) out[i + wShift] |= v;
//     }
//   } else {
//     const rShift = 32 - bShift;
//     for (let i = 0; i < words; i++) {
//       const v = prev[i];
//       if (v === 0) continue;
//       const j = i + wShift;
//       if (j < words) out[j] |= (v << bShift) >>> 0;
//       if (j + 1 < words) out[j + 1] |= (v >>> rShift) >>> 0;
//     }
//   }
// 
//   // Mask out bits beyond nMax in the final word.
//   const finalBits = (nMax & 31) + 1;
//   const mask = finalBits === 32 ? 0xffffffff : ((1 << finalBits) - 1) >>> 0;
//   out[words - 1] &= mask;
// }
// 
// function scanOne(r, nMax, spf) {
//   const S = [];
//   for (let n = 1; n <= nMax; n++) if (isRPowerful(n, r, spf)) S.push(n);
// 
//   const words = (nMax >>> 5) + 1;
//   let exact = new Uint32Array(words); // exact sums with exactly t terms (starts with t=0)
//   let upto = new Uint32Array(words);  // sums with <= t terms
//   setBit(exact, 0);
//   setBit(upto, 0);
// 
//   const maxTerms = r + 1;
//   for (let t = 1; t <= maxTerms; t++) {
//     const next = new Uint32Array(words);
//     for (const a of S) shiftedOrFrom(exact, a, next, nMax);
//     exact = next;
//     orInto(upto, exact);
//   }
// 
//   const missing = [];
//   for (let n = 1; n <= nMax; n++) if (!getBit(upto, n)) missing.push(n);
// 
//   const tailStart = Math.max(1, nMax - 100000 + 1);
//   let tailMissing = 0;
//   for (let n = tailStart; n <= nMax; n++) if (!getBit(upto, n)) tailMissing++;
// 
//   return {
//     r,
//     n_max: nMax,
//     max_terms_allowed: maxTerms,
//     r_powerful_count_up_to_n_max: S.length,
//     missing_count_up_to_n_max: missing.length,
//     largest_missing_up_to_n_max: missing.length ? missing[missing.length - 1] : 0,
//     first_missing: missing.slice(0, 50),
//     last_missing: missing.slice(-50),
//     tail_interval: [tailStart, nMax],
//     tail_missing_count: tailMissing,
//   };
// }
// 
// const spf = sieveSpf(N_MAX + 5);
// const results = R_LIST.map((r) => scanOne(r, N_MAX, spf));
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_max: N_MAX,
//   r_list: R_LIST,
//   results,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep1107_r_powerful_bitset_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_max: N_MAX, r_list: R_LIST, results: results.length }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: ep1107_r_powerful_sum_scan.mjs
// Kind: current_script_file
// Label: From ep1107_r_powerful_sum_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const R_LIST = (process.env.R_LIST || '2,3,4').split(',').map((x) => Number(x.trim())).filter(Boolean);
// const N_MAX = Number(process.env.N_MAX || 120000);
// 
// function sieveSpf(n) {
//   const spf = new Int32Array(n + 1);
//   for (let i = 2; i <= n; i++) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i * i <= n) {
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function isRPowerful(n, r, spf) {
//   if (n === 1) return true;
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e++;
//     }
//     if (e < r) return false;
//   }
//   return true;
// }
// 
// const spf = sieveSpf(N_MAX + 5);
// const results = [];
// 
// for (const r of R_LIST) {
//   const maxTerms = r + 1;
//   const nums = [];
//   for (let n = 1; n <= N_MAX; n++) if (isRPowerful(n, r, spf)) nums.push(n);
// 
//   const minTerms = new Int16Array(N_MAX + 1);
//   minTerms.fill(-1);
//   minTerms[0] = 0;
// 
//   let frontier = [0];
//   for (let t = 1; t <= maxTerms; t++) {
//     const seen = new Uint8Array(N_MAX + 1);
//     const next = [];
//     for (const s of frontier) {
//       for (const a of nums) {
//         const v = s + a;
//         if (v > N_MAX) break;
//         if (seen[v]) continue;
//         seen[v] = 1;
//         if (minTerms[v] === -1 || t < minTerms[v]) minTerms[v] = t;
//         next.push(v);
//       }
//     }
//     frontier = next;
//   }
// 
//   const missing = [];
//   for (let n = 1; n <= N_MAX; n++) if (minTerms[n] === -1) missing.push(n);
// 
//   let largestMissing = missing.length ? missing[missing.length - 1] : 0;
//   const tailStart = Math.max(1, N_MAX - 10000 + 1);
//   let tailMissing = 0;
//   for (let n = tailStart; n <= N_MAX; n++) if (minTerms[n] === -1) tailMissing++;
// 
//   results.push({
//     r,
//     n_max: N_MAX,
//     max_terms_allowed: maxTerms,
//     r_powerful_count_up_to_n_max: nums.length,
//     largest_missing_up_to_n_max: largestMissing,
//     missing_count_up_to_n_max: missing.length,
//     tail_interval: [tailStart, N_MAX],
//     tail_missing_count: tailMissing,
//     first_missing: missing.slice(0, 30),
//     last_missing: missing.slice(-30),
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_max: N_MAX,
//   r_list: R_LIST,
//   results,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep1107_r_powerful_sum_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_max: N_MAX, r_list: R_LIST, results: results.length }, null, 2));
// 
// ==== End Snippet ====

