#!/usr/bin/env node
const meta={problem:'EP-358',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-358 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | interval-sum representation count profiles f(n) for candidate sequences. ----
// // EP-358: interval-sum representation count profiles f(n) for candidate sequences.
// {
//   function makeSequence(kind, M) {
//     const a = [];
//     if (kind === 'integers') {
//       for (let n = 1; n <= M; n += 1) a.push(n);
//     } else if (kind === 'primes') {
//       let x = 2;
//       while (a.length < M) {
//         if (isPrimeInt(x)) a.push(x);
//         x += 1;
//       }
//     } else if (kind === 'squares') {
//       for (let n = 1; n <= M; n += 1) a.push(n * n);
//     } else {
//       for (let n = 1; n <= M; n += 1) a.push(n + Math.floor(Math.sqrt(n)));
//     }
//     return a;
//   }
// 
//   function intervalSumCounts(a, Xmax) {
//     const pref = [0];
//     for (const x of a) pref.push(pref[pref.length - 1] + x);
//     const cnt = new Uint32Array(Xmax + 1);
//     for (let i = 0; i < a.length; i += 1) {
//       for (let j = i + 1; j <= a.length; j += 1) {
//         const s = pref[j] - pref[i];
//         if (s > Xmax) break;
//         cnt[s] += 1;
//       }
//     }
//     return cnt;
//   }
// 
//   const rows = [];
//   const cases = [
//     { kind: 'integers', M: 1800, Xmax: 200000 },
//     { kind: 'primes', M: 700, Xmax: 200000 },
//     { kind: 'squares', M: 350, Xmax: 200000 },
//     { kind: 'n_plus_sqrt_n', M: 1200, Xmax: 200000 },
//   ];
// 
//   for (const c of cases) {
//     const a = makeSequence(c.kind, c.M);
//     const cnt = intervalSumCounts(a, c.Xmax);
//     let maxF = 0;
//     let maxN = 0;
//     let tailMin = Number.POSITIVE_INFINITY;
//     let tailMinN = -1;
//     let tailCovered = 0;
//     for (let n = 1; n <= c.Xmax; n += 1) {
//       if (cnt[n] > maxF) {
//         maxF = cnt[n];
//         maxN = n;
//       }
//       if (n > c.Xmax / 2) {
//         if (cnt[n] < tailMin) {
//           tailMin = cnt[n];
//           tailMinN = n;
//         }
//         if (cnt[n] > 0) tailCovered += 1;
//       }
//     }
//     const tailLen = c.Xmax / 2;
//     rows.push({
//       kind: c.kind,
//       terms_used: c.M,
//       Xmax: c.Xmax,
//       max_f_n: maxF,
//       argmax_n: maxN,
//       min_f_on_tail_X_over_2_to_X: tailMin,
//       argmin_tail_n: tailMinN,
//       tail_positive_density: Number((tailCovered / tailLen).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep358 = {
//     description: 'Finite interval-sum multiplicity profile f(n) for representative increasing sequences A.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch10_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
