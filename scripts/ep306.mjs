#!/usr/bin/env node
const meta={problem:'EP-306',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-306 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | restricted Egyptian representations with semiprime (distinct-prime-product) denominators. ----
// // EP-306: restricted Egyptian representations with semiprime (distinct-prime-product) denominators.
// {
//   const maxDen = 700;
//   const { isPrime } = sieve(maxDen + 10);
//   const semiprimes = [];
//   for (let n = 6; n <= maxDen; n += 1) {
//     let cnt = 0;
//     let p1 = -1;
//     let p2 = -1;
//     for (let p = 2; p * p <= n; p += 1) {
//       if (!isPrime[p] || n % p !== 0) continue;
//       const q = n / p;
//       if (q !== p && isPrime[q]) {
//         cnt += 1;
//         p1 = p;
//         p2 = q;
//       }
//     }
//     if (cnt === 1 && p1 !== p2) semiprimes.push(n);
//   }
// 
//   function minEgyptLengthSemiprime(a, b, kMax) {
//     const [num0, den0] = reduceFrac(BigInt(a), BigInt(b));
// 
//     function canAtDepth(num, den, pos, termsLeft, memo) {
//       const key = `${num}/${den}|${pos}|${termsLeft}`;
//       if (memo.has(key)) return memo.get(key);
// 
//       if (termsLeft === 1) {
//         if (num <= 0n || den % num !== 0n) {
//           memo.set(key, false);
//           return false;
//         }
//         const d = Number(den / num);
//         const ok = Number.isFinite(d) && semiprimes.includes(d) && d >= semiprimes[pos];
//         memo.set(key, ok);
//         return ok;
//       }
// 
//       const start = semiprimes[pos] ?? maxDen + 1;
//       if (!Number.isFinite(start)) {
//         memo.set(key, false);
//         return false;
//       }
//       if (num * BigInt(start) > den * BigInt(termsLeft)) {
//         memo.set(key, false);
//         return false;
//       }
// 
//       const dMin0 = Number(ceilDivBig(den, num));
//       for (let i = pos; i < semiprimes.length; i += 1) {
//         const d = semiprimes[i];
//         if (d < dMin0) continue;
//         const bd = BigInt(d);
//         const newNumRaw = num * bd - den;
//         if (newNumRaw <= 0n) continue;
//         const newDenRaw = den * bd;
//         const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
//         const t = termsLeft - 1;
//         const nextStart = semiprimes[i + 1] ?? (maxDen + 1);
//         if (newNum * BigInt(nextStart) > newDen * BigInt(t)) continue;
//         if (canAtDepth(newNum, newDen, i + 1, t, memo)) {
//           memo.set(key, true);
//           return true;
//         }
//       }
// 
//       memo.set(key, false);
//       return false;
//     }
// 
//     for (let k = 1; k <= kMax; k += 1) {
//       const memo = new Map();
//       if (canAtDepth(num0, den0, 0, k, memo)) return k;
//     }
//     return null;
//   }
// 
//   const rows = [];
//   for (const b of [6, 10, 14, 15, 21, 30]) {
//     let solved = 0;
//     let unresolved = 0;
//     let maxLen = 0;
//     for (let a = 1; a < b; a += 1) {
//       if (gcdInt(a, b) !== 1) continue;
//       const k = minEgyptLengthSemiprime(a, b, 8);
//       if (k === null) {
//         unresolved += 1;
//       } else {
//         solved += 1;
//         if (k > maxLen) maxLen = k;
//       }
//     }
//     rows.push({
//       b,
//       represented_coprime_a_count: solved,
//       unresolved_coprime_a_count: unresolved,
//       max_min_length_among_represented: maxLen,
//     });
//   }
// 
//   out.results.ep306 = {
//     description: 'Finite representability profile for a/b using distinct semiprime denominators.',
//     semiprime_count_up_to_maxDen: semiprimes.length,
//     search_limits: { maxDen, kMax: 8 },
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
