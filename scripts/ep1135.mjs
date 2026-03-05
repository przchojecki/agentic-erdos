#!/usr/bin/env node
const meta={problem:'EP-1135',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1135 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite verification of accelerated Collatz map f(n). ----
// // EP-1135: finite verification of accelerated Collatz map f(n).
// {
//   const N = 2_000_000;
//   const memo = new Uint32Array(N + 1); // store steps+1, 0 means unknown.
//   memo[1] = 1;
// 
//   function nextCollatz(x) {
//     return x % 2n === 0n ? x / 2n : (3n * x + 1n) / 2n;
//   }
// 
//   let maxSteps = 0;
//   let argMax = 1;
//   const probes = [100_000, 300_000, 600_000, 1_000_000, 1_500_000, 2_000_000];
//   let ptr = 0;
//   const rows = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     let x = BigInt(n);
//     const path = [];
// 
//     while (true) {
//       if (x <= BigInt(N) && memo[Number(x)] > 0) break;
//       path.push(x);
//       x = nextCollatz(x);
//     }
// 
//     let s = x <= BigInt(N) ? memo[Number(x)] - 1 : 0;
//     for (let i = path.length - 1; i >= 0; i -= 1) {
//       s += 1;
//       const v = path[i];
//       if (v <= BigInt(N) && memo[Number(v)] === 0) memo[Number(v)] = s + 1;
//     }
//     const steps = memo[n] > 0 ? memo[n] - 1 : s;
// 
//     if (steps > maxSteps) {
//       maxSteps = steps;
//       argMax = n;
//     }
// 
//     if (ptr < probes.length && n === probes[ptr]) {
//       rows.push({
//         x: n,
//         max_steps_up_to_x: maxSteps,
//         n_attaining_max_steps: argMax,
//       });
//       ptr += 1;
//     }
//   }
// 
//   out.results.ep1135 = {
//     description: 'Finite accelerated-Collatz stopping-time verification for all starts n<=2,000,000.',
//     N,
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch26_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
