#!/usr/bin/env node
const meta={problem:'EP-236',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-236 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch7_quick_compute.mjs | representation counts n = p + 2^k. ----
// // EP-236: representation counts n = p + 2^k.
// {
//   const Xmax = 2000000;
//   const { isPrime } = sieve(Xmax);
//   const powers = [];
//   for (let v = 1; v <= Xmax; v *= 2) powers.push(v);
// 
//   const cnt = new Uint16Array(Xmax + 1);
//   for (const p2 of powers) {
//     for (let p = 2; p + p2 <= Xmax; p += 1) {
//       if (!isPrime[p]) continue;
//       cnt[p + p2] += 1;
//     }
//   }
// 
//   function summarize(X) {
//     let maxF = 0;
//     let arg = 0;
//     let sum = 0;
//     for (let n = 1; n <= X; n += 1) {
//       const v = cnt[n];
//       sum += v;
//       if (v > maxF) {
//         maxF = v;
//         arg = n;
//       }
//     }
// 
//     const hist = new Int32Array(maxF + 1);
//     for (let n = 1; n <= X; n += 1) hist[cnt[n]] += 1;
//     let c = 0;
//     let p99 = 0;
//     const target = Math.ceil(0.99 * X);
//     for (let i = 0; i <= maxF; i += 1) {
//       c += hist[i];
//       if (c >= target) {
//         p99 = i;
//         break;
//       }
//     }
// 
//     return {
//       X,
//       max_f_n: maxF,
//       argmax_n: arg,
//       max_f_over_log_n: Number((maxF / Math.log(Math.max(3, arg))).toFixed(6)),
//       mean_f: Number((sum / X).toFixed(6)),
//       percentile99_f: p99,
//     };
//   }
// 
//   const rows = [200000, 500000, 1000000, 2000000].map(summarize);
// 
//   out.results.ep236 = {
//     description: 'Finite distribution profile of f(n)=#{(p,2^k): n=p+2^k}.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch7_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
