#!/usr/bin/env node
const meta={problem:'EP-1055',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1055 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | finite class recursion profile for primes. ----
// // EP-1055: finite class recursion profile for primes.
// {
//   const LIMIT = 1_000_000;
//   const primes = [];
//   for (let p = 2; p <= LIMIT; p += 1) if (spf[p] === p) primes.push(p);
// 
//   const cls = new Map();
//   const firstPrime = new Map();
//   const counts = new Map();
// 
//   for (const p of primes) {
//     const facts = distinctPrimeFactors(p + 1, spf);
//     let c;
//     if (facts.every((q) => q === 2 || q === 3)) {
//       c = 1;
//     } else {
//       let mx = 0;
//       for (const q of facts) {
//         if (q === 2 || q === 3) continue;
//         const cq = cls.get(q) || 0;
//         if (cq > mx) mx = cq;
//       }
//       c = mx + 1;
//     }
//     cls.set(p, c);
//     if (!firstPrime.has(c)) firstPrime.set(c, p);
//     counts.set(c, (counts.get(c) || 0) + 1);
//   }
// 
//   const classes = [...firstPrime.entries()]
//     .sort((a, b) => a[0] - b[0])
//     .slice(0, 12)
//     .map(([c, p]) => ({ class: c, first_prime: p, p_to_1_over_class: Number((p ** (1 / c)).toPrecision(7)) }));
// 
//   const countRows = [...counts.entries()]
//     .sort((a, b) => a[0] - b[0])
//     .map(([c, cnt]) => ({ class: c, prime_count_up_to_limit: cnt }))
//     .slice(0, 12);
// 
//   out.results.ep1055 = {
//     description: 'Finite recursive prime-class computation based on prime factors of p+1.',
//     LIMIT,
//     first_primes_by_class: classes,
//     class_population_rows: countRows,
//     max_class_seen: Math.max(...counts.keys()),
//   };
// }
// ==== End Batch Split Integrations ====
