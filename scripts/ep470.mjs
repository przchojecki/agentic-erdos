#!/usr/bin/env node
const meta={problem:'EP-470',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-470 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | weird numbers (finite) and odd weird search proxy. ----
// // EP-470: weird numbers (finite) and odd weird search proxy.
// {
//   const N_WEIRD = 30000;
//   const N_ODD = 300000;
// 
//   const spfBig = sieveSPF(N_ODD + 5);
//   const sigmaAll = sigmaSieve(N_ODD + 5);
//   const omegaAll = omegaSieve(N_ODD + 5);
// 
//   function isSemiperfect(n) {
//     const divs = properDivisors(n, spfBig);
//     let bits = 1n;
//     const mask = (1n << BigInt(n + 1)) - 1n;
//     const targetBit = 1n << BigInt(n);
// 
//     for (const d of divs) {
//       bits |= bits << BigInt(d);
//       bits &= mask;
//       if (bits & targetBit) return true;
//     }
//     return false;
//   }
// 
//   const weird = [];
//   for (let n = 2; n <= N_WEIRD; n += 1) {
//     if (sigmaAll[n] < 2 * n) continue;
//     if (!isSemiperfect(n)) weird.push(n);
//   }
// 
//   const weirdSet = new Set(weird);
//   const primitive = [];
//   for (const n of weird) {
//     let prim = true;
//     const divs = properDivisors(n, spfBig);
//     for (const d of divs) {
//       if (weirdSet.has(d)) {
//         prim = false;
//         break;
//       }
//     }
//     if (prim) primitive.push(n);
//   }
// 
//   const oddWeird = [];
//   const oddCandidatesChecked = [];
//   for (let n = 3; n <= N_ODD; n += 2) {
//     if (sigmaAll[n] < 2 * n) continue;
//     if (omegaAll[n] < 6) continue; // known necessary condition for odd weird numbers.
//     oddCandidatesChecked.push(n);
//     if (!isSemiperfect(n)) oddWeird.push(n);
//   }
// 
//   out.results.ep470 = {
//     description: 'Finite weird-number and odd-weird search proxies.',
//     weird_search_limit: N_WEIRD,
//     odd_search_limit: N_ODD,
//     weird_count: weird.length,
//     first_25_weird: weird.slice(0, 25),
//     primitive_weird_count: primitive.length,
//     first_25_primitive_weird: primitive.slice(0, 25),
//     odd_candidates_checked_count: oddCandidatesChecked.length,
//     odd_candidates_checked_first_20: oddCandidatesChecked.slice(0, 20),
//     odd_weird_found: oddWeird,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch12_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
