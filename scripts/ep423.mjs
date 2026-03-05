#!/usr/bin/env node
// Canonical per-problem script for EP-423.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-423',
  source_count: 1,
  source_files: ["ep423_hofstadter_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-423 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep423_hofstadter_scan.mjs
// Kind: current_script_file
// Label: From ep423_hofstadter_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep423_hofstadter_scan.json');
// 
// const K = Number(process.argv[2] || 6000);
// 
// const a = [1, 2];
// 
// let cap = 2048;
// let representableLen2plus = new Uint8Array(cap);
// 
// function ensureCap(x) {
//   if (x < cap) return;
//   let ncap = cap;
//   while (ncap <= x) ncap *= 2;
//   const nxt = new Uint8Array(ncap);
//   nxt.set(representableLen2plus);
//   representableLen2plus = nxt;
//   cap = ncap;
// }
// 
// // initialize from [1,2]: only 1+2=3 is length>=2 sum
// representableLen2plus[3] = 1;
// 
// for (let k = 3; k <= K; k += 1) {
//   const prev = a[a.length - 1];
//   let x = prev + 1;
//   while (x < cap && !representableLen2plus[x]) x += 1;
//   if (x >= cap) {
//     ensureCap(x + 1);
//     while (!representableLen2plus[x]) x += 1;
//   }
// 
//   a.push(x);
// 
//   // add new consecutive sums ending at newest term of length >=2
//   let s = x;
//   for (let i = a.length - 2; i >= 0; i -= 1) {
//     s += a[i];
//     ensureCap(s + 1);
//     representableLen2plus[s] = 1;
//   }
// 
//   if (k % 800 === 0) process.stderr.write(`k=${k}, a_k=${x}, gap=a_k-k=${x - k}\n`);
// }
// 
// const checkpoints = [50, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 6000]
//   .filter((x) => x <= K)
//   .map((k) => {
//     const ak = a[k - 1];
//     return {
//       k,
//       a_k: ak,
//       a_k_minus_k: ak - k,
//       a_over_k: ak / k,
//       k_over_a: k / ak,
//     };
//   });
// 
// const out = {
//   problem: 'EP-423',
//   method: 'exact_generation_of_least_new_sum_of_at_least_two_consecutive_terms',
//   params: { K },
//   first_terms: a.slice(0, 40),
//   checkpoints,
//   tail_terms: a.slice(Math.max(0, a.length - 40)),
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

