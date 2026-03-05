#!/usr/bin/env node
const meta={problem:'EP-571',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-571 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | finite coverage map of known Turan-exponent families. ----
// // EP-571: finite coverage map of known Turan-exponent families.
// {
//   const known = new Set();
// 
//   function addRat(num, den) {
//     const g = gcd(num, den);
//     known.add(`${num / g}/${den / g}`);
//   }
// 
//   // Families from background, parameter-limited map.
//   for (let s = 2; s <= 40; s += 1) {
//     addRat(3 * s - 1, 2 * s); // 3/2 - 1/(2s)
//     addRat(4 * s - 1, 3 * s); // 4/3 - 1/(3s)
//     addRat(5 * s - 1, 4 * s); // 5/4 - 1/(4s)
//   }
//   for (let b = 2; b <= 60; b += 1) addRat(2 * b, 2 * b + 1); // 2 - 2/(2b+1)
// 
//   // 1 + a/b with b > a^2
//   for (let a = 1; a <= 12; a += 1) {
//     for (let b = a * a + 1; b <= 80; b += 1) addRat(a + b, b);
//   }
// 
//   // 2 - a/b with b >= (a-1)^2
//   for (let a = 1; a <= 20; a += 1) {
//     for (let b = Math.max(a + 1, (a - 1) * (a - 1)); b <= 80; b += 1) addRat(2 * b - a, b);
//   }
// 
//   // 2 - a/b with b ≡ ±1 mod a
//   for (let a = 1; a <= 20; a += 1) {
//     for (let b = a + 1; b <= 120; b += 1) {
//       if (b % a === 1 || b % a === a - 1) addRat(2 * b - a, b);
//     }
//   }
// 
//   const all = [];
//   const hit = [];
//   const miss = [];
// 
//   for (let den = 2; den <= 60; den += 1) {
//     for (let num = den; num < 2 * den; num += 1) {
//       if (gcd(num, den) !== 1) continue;
//       const key = `${num}/${den}`;
//       all.push(key);
//       if (known.has(key)) hit.push(key);
//       else miss.push(key);
//     }
//   }
// 
//   out.results.ep571 = {
//     description: 'Finite denominator-bounded coverage map of known Turan-exponent families in [1,2).',
//     denominator_bound: 60,
//     total_reduced_rationals_in_1_2: all.length,
//     covered_count: hit.length,
//     covered_ratio: Number((hit.length / all.length).toPrecision(7)),
//     sample_uncovered_first_40: miss.slice(0, 40),
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch14_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
