#!/usr/bin/env node
const meta={problem:'EP-860',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-860 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | finite matching proxy for h(n). ----
// // EP-860: finite matching proxy for h(n).
// {
//   const { primes } = sievePrimes(300);
// 
//   function firstPrimesUpTo(n) {
//     return primes.filter((p) => p <= n);
//   }
// 
//   function canMatch(primeList, m, h) {
//     const r = primeList.length;
//     const matchPos = new Int32Array(h + 1);
//     matchPos.fill(-1);
// 
//     const adj = Array.from({ length: r }, () => []);
//     for (let i = 0; i < r; i += 1) {
//       const p = primeList[i];
//       let j = (p - (m % p)) % p;
//       if (j === 0) j = p;
//       for (; j <= h; j += p) adj[i].push(j);
//       if (adj[i].length === 0) return false;
//     }
// 
//     function aug(i, seen) {
//       for (const pos of adj[i]) {
//         if (seen[pos]) continue;
//         seen[pos] = 1;
//         if (matchPos[pos] === -1 || aug(matchPos[pos], seen)) {
//           matchPos[pos] = i;
//           return true;
//         }
//       }
//       return false;
//     }
// 
//     let got = 0;
//     for (let i = 0; i < r; i += 1) {
//       const seen = new Uint8Array(h + 1);
//       if (aug(i, seen)) got += 1;
//       else return false;
//     }
//     return got === r;
//   }
// 
//   function finiteHn(n, mMax, hCap) {
//     const ps = firstPrimesUpTo(n);
//     const r = ps.length;
// 
//     let worst = 0;
//     let argm = 1;
// 
//     for (let m = 1; m <= mMax; m += 1) {
//       let lo = Math.max(r, 1);
//       let hi = lo;
// 
//       while (hi <= hCap && !canMatch(ps, m, hi)) hi *= 2;
//       if (hi > hCap) {
//         worst = Math.max(worst, hCap + 1);
//         argm = m;
//         continue;
//       }
// 
//       while (lo < hi) {
//         const mid = Math.floor((lo + hi) / 2);
//         if (canMatch(ps, m, mid)) hi = mid;
//         else lo = mid + 1;
//       }
// 
//       if (lo > worst) {
//         worst = lo;
//         argm = m;
//       }
//     }
// 
//     return { n, pi_n: ps.length, mMax, hCap, finite_worst_required_h: worst, witness_m: argm };
//   }
// 
//   const rows = [];
//   for (const [n, mMax, hCap] of [[30, 800, 600], [50, 800, 900], [80, 800, 1500]]) {
//     rows.push(finiteHn(n, mMax, hCap));
//   }
// 
//   out.results.ep860 = {
//     description: 'Finite Hall-matching proxy for h(n) over initial m range.',
//     rows,
//     note: 'These are finite lower-bound style profiles; true h(n) quantifies over all m>=1.',
//   };
// }
// ==== End Batch Split Integrations ====
