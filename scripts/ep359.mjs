#!/usr/bin/env node
// Canonical per-problem script for EP-359.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-359',
  source_count: 1,
  source_files: ["ep359_macmahon_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-359 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep359_macmahon_scan.mjs
// Kind: current_script_file
// Label: From ep359_macmahon_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep359_macmahon_scan.json');
// 
// const K = Number(process.argv[2] || 2400);
// 
// const a = [1];
// 
// // representable[s] = whether s is a sum of consecutive terms in current sequence
// let cap = 1024;
// let representable = new Uint8Array(cap);
// 
// function ensureCap(x) {
//   if (x < cap) return;
//   let ncap = cap;
//   while (ncap <= x) ncap *= 2;
//   const next = new Uint8Array(ncap);
//   next.set(representable);
//   representable = next;
//   cap = ncap;
// }
// 
// // Initialize with sequence [1]: only sum 1
// ensureCap(2);
// representable[1] = 1;
// 
// for (let k = 2; k <= K; k += 1) {
//   const prev = a[a.length - 1];
//   let x = prev + 1;
//   while (x < cap && representable[x]) x += 1;
//   if (x >= cap) {
//     ensureCap(x + 1);
//     while (representable[x]) x += 1;
//   }
// 
//   a.push(x);
// 
//   // Add new consecutive sums ending at newest term.
//   let s = 0;
//   for (let i = a.length - 1; i >= 0; i -= 1) {
//     s += a[i];
//     ensureCap(s + 1);
//     representable[s] = 1;
//   }
// 
//   if (k % 300 === 0) process.stderr.write(`k=${k}, a_k=${x}\n`);
// }
// 
// const checkpoints = [50, 100, 200, 400, 800, 1200, 1600, 2000, 2400]
//   .filter((x) => x <= K)
//   .map((k) => {
//     const ak = a[k - 1];
//     const logk = Math.log(k);
//     const llk = Math.log(logk);
//     const model = (k * logk) / llk;
//     return {
//       k,
//       a_k: ak,
//       a_over_k: ak / k,
//       a_over_k_logk_over_loglogk: ak / model,
//       a_over_k_pow_1p02: ak / (k ** 1.02),
//       a_over_k_pow_1p05: ak / (k ** 1.05),
//     };
//   });
// 
// const tail = a.slice(Math.max(0, a.length - 40));
// 
// const out = {
//   problem: 'EP-359',
//   method: 'exact_generation_via_incremental_consecutive-sum_representability',
//   params: { K },
//   first_terms: a.slice(0, 40),
//   checkpoints,
//   tail_terms: tail,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

