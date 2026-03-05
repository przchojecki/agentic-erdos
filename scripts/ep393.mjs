#!/usr/bin/env node
const meta={problem:'EP-393',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-393 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | finite search for f(n)=1 proxy via n!=x(x+1); and 3-consecutive-product proxy. ----
// // EP-393: finite search for f(n)=1 proxy via n!=x(x+1); and 3-consecutive-product proxy.
// {
//   const N1 = 1000;
//   const N3 = 200;
// 
//   const twoConsecutive = [];
//   for (let n = 2; n <= N1; n += 1) {
//     const fn = fact[n];
//     const D = 1n + 4n * fn;
//     if (!isSquareBigInt(D)) continue;
//     const r = isqrtBigInt(D);
//     if ((r - 1n) % 2n !== 0n) continue;
//     const x = (r - 1n) / 2n;
//     if (x * (x + 1n) === fn) twoConsecutive.push({ n, x: x.toString() });
//   }
// 
//   const threeConsecutive = [];
//   for (let n = 3; n <= N3; n += 1) {
//     const fn = fact[n];
//     const x = exactConsecutiveTripleRoot(fn);
//     if (x !== null) threeConsecutive.push({ n, x: x.toString() });
//   }
// 
//   out.results.ep393 = {
//     description: 'Finite proxies for small-width interval factorizations of n! using exact consecutive products.',
//     search_limits: { N1, N3 },
//     two_consecutive_solutions: twoConsecutive,
//     three_consecutive_solutions: threeConsecutive,
//   };
// }
// ==== End Batch Split Integrations ====
