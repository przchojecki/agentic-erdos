#!/usr/bin/env node
// Canonical per-problem script for EP-278.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-278',
  source_count: 1,
  source_files: ["ep278_family_partition_reduction_check.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-278 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep278_family_partition_reduction_check.mjs
// Kind: current_script_file
// Label: From ep278_family_partition_reduction_check.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // Verify, on small examples, the reduction for A={3} U {3p : p in P}:
// // max covered density = 1 - (1/3) * min_{P=P1 sqcup P2} [prod_{p in P1}(1-1/p)+prod_{p in P2}(1-1/p)].
// 
// const primeSets = [
//   [5, 7],
//   [5, 7, 11],
//   [5, 7, 11, 13],
// ];
// 
// function gcd(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x;
// }
// 
// function lcm(a, b) {
//   return (a / gcd(a, b)) * b;
// }
// 
// function lcmArray(arr) {
//   let v = 1;
//   for (const x of arr) v = lcm(v, x);
//   return v;
// }
// 
// function formulaBestDensity(P) {
//   const k = P.length;
//   let best = Infinity;
//   let bestMask = 0;
//   for (let mask = 0; mask < (1 << k); mask++) {
//     let prod1 = 1;
//     let prod2 = 1;
//     for (let i = 0; i < k; i++) {
//       const term = 1 - 1 / P[i];
//       if ((mask >> i) & 1) prod1 *= term;
//       else prod2 *= term;
//     }
//     const val = prod1 + prod2;
//     if (val < best) {
//       best = val;
//       bestMask = mask;
//     }
//   }
//   return {
//     bestDensity: 1 - best / 3,
//     objective: best,
//     mask: bestMask,
//   };
// }
// 
// function bruteFamilyBestDensity(P) {
//   const moduli = [3, ...P.map((p) => 3 * p)];
//   const L = lcmArray(moduli);
// 
//   // WLOG fix a_3 = 0 (translation symmetry).
//   const residuesPer = [
//     [0],
//     ...P.map((p) => {
//       const arr = [];
//       for (let a = 0; a < 3 * p; a++) arr.push(a);
//       return arr;
//     }),
//   ];
// 
//   let best = -1;
//   let bestChoice = null;
// 
//   function rec(i, choice) {
//     if (i === residuesPer.length) {
//       const covered = new Uint8Array(L);
//       for (let t = 0; t < choice.length; t++) {
//         const n = moduli[t];
//         const a = choice[t];
//         for (let x = a; x < L; x += n) covered[x] = 1;
//       }
//       let cnt = 0;
//       for (let x = 0; x < L; x++) cnt += covered[x];
//       const dens = cnt / L;
//       if (dens > best) {
//         best = dens;
//         bestChoice = choice.slice();
//       }
//       return;
//     }
// 
//     for (const a of residuesPer[i]) {
//       choice.push(a);
//       rec(i + 1, choice);
//       choice.pop();
//     }
//   }
// 
//   rec(0, []);
//   return { bestDensity: best, bestChoice, lcm: L };
// }
// 
// const rows = [];
// for (const P of primeSets) {
//   const f = formulaBestDensity(P);
//   const b = bruteFamilyBestDensity(P);
//   rows.push({
//     P,
//     formula_best_density: Number(f.bestDensity.toFixed(12)),
//     brute_best_density: Number(b.bestDensity.toFixed(12)),
//     absolute_diff: Number(Math.abs(f.bestDensity - b.bestDensity).toExponential(3)),
//     formula_partition_mask: f.mask,
//     brute_best_choice: b.bestChoice,
//     lcm: b.lcm,
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep278_family_partition_reduction_check.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

