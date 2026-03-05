#!/usr/bin/env node
// Canonical per-problem script for EP-933.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-933',
  source_count: 1,
  source_files: ["ep933_smoothpart_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-933 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep933_smoothpart_scan.mjs
// Kind: current_script_file
// Label: From ep933_smoothpart_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function v2(x) {
//   let n = x;
//   let c = 0;
//   while ((n & 1) === 0) {
//     n >>= 1;
//     c += 1;
//   }
//   return c;
// }
// 
// function v3(x) {
//   let n = x;
//   let c = 0;
//   while (n % 3 === 0) {
//     n = Math.floor(n / 3);
//     c += 1;
//   }
//   return c;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep933_smoothpart_scan.json');
// 
// const Nmax = Number(process.argv[2] || 5000000);
// const checkpoint = Number(process.argv[3] || 500000);
// 
// let bestRatio = -1;
// let bestN = 2;
// let bestRec = null;
// const tailThresholds = [10, 100, 1000, 10000];
// const tailBest = Object.fromEntries(tailThresholds.map((t) => [t, { n: null, ratio: -1 }]));
// const checkpoints = [];
// const top = [];
// 
// function pushTop(rec, keep = 40) {
//   top.push(rec);
//   top.sort((a, b) => b.ratio_over_nlogn - a.ratio_over_nlogn);
//   if (top.length > keep) top.length = keep;
// }
// 
// for (let n = 2; n <= Nmax; n += 1) {
//   const k = v2(n) + v2(n + 1);
//   const l = v3(n) + v3(n + 1);
// 
//   const logSmooth = k * Math.log(2) + l * Math.log(3);
//   const ratio = Math.exp(logSmooth - Math.log(n) - Math.log(Math.log(n)));
// 
//   const rec = {
//     n,
//     k,
//     l,
//     ratio_over_nlogn: ratio,
//     log_smoothpart: logSmooth,
//   };
// 
//   if (ratio > bestRatio) {
//     bestRatio = ratio;
//     bestN = n;
//     bestRec = rec;
//   }
//   for (const t of tailThresholds) {
//     if (n >= t && ratio > tailBest[t].ratio) tailBest[t] = { n, ratio };
//   }
// 
//   if (ratio > 6) pushTop(rec);
// 
//   if (n % checkpoint === 0) {
//     checkpoints.push({
//       n,
//       best_n_up_to_here: bestN,
//       best_ratio_up_to_here: bestRatio,
//     });
//     process.stderr.write(`n=${n}, best_n=${bestN}, best_ratio=${bestRatio.toFixed(4)}\n`);
//   }
// }
// 
// const family = [];
// for (let r = 1; r <= 10; r += 1) {
//   const n = 2 ** (3 ** r);
//   if (!Number.isFinite(n) || n > Nmax) break;
//   const k = 3 ** r;
//   const l = r + 1;
//   const ratio = (2 ** k * 3 ** l) / (n * Math.log(n));
//   family.push({ r, n, k, l, ratio_over_nlogn: ratio });
// }
// 
// const out = {
//   problem: 'EP-933',
//   method: 'direct_scan_of_6-smooth_part_2^k3^l_of_n(n+1)',
//   params: { Nmax, checkpoint },
//   best_record: bestRec,
//   best_records_for_n_ge: tailBest,
//   checkpoints,
//   top_large_ratio_records: top,
//   explicit_family_n_eq_2_pow_3_pow_r: family,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

