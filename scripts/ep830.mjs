#!/usr/bin/env node
const meta={problem:'EP-830',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-830 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | amicable pair counting profile. ----
// // EP-830: amicable pair counting profile.
// {
//   const N = 400_000;
//   const sigma = new Uint32Array(N + 1);
//   for (let d = 1; d <= N; d += 1) {
//     for (let m = d; m <= N; m += d) sigma[m] += d;
//   }
// 
//   const amicA = []; // smaller member of pair
//   for (let a = 2; a <= N; a += 1) {
//     const b = sigma[a] - a;
//     if (b <= a || b > N) continue;
//     if (sigma[b] - b === a && sigma[a] === a + b && sigma[b] === a + b) amicA.push(a);
//   }
//   amicA.sort((x, y) => x - y);
// 
//   const rows = [];
//   for (const x of [10_000, 50_000, 100_000, 200_000, 300_000, 400_000]) {
//     let cnt = 0;
//     while (cnt < amicA.length && amicA[cnt] <= x) cnt += 1;
//     rows.push({
//       x,
//       A_x_count_amicable_pairs_with_a_le_x: cnt,
//       A_x_over_x: Number((cnt / x).toPrecision(7)),
//       log_A_over_log_x: cnt > 1 ? Number((Math.log(cnt) / Math.log(x)).toPrecision(7)) : null,
//     });
//   }
// 
//   out.results.ep830 = {
//     description: 'Finite counting profile for amicable pairs via direct sigma-sieve verification.',
//     rows,
//     first_25_amicable_a_values: amicA.slice(0, 25),
//   };
// }
// ==== End Batch Split Integrations ====
