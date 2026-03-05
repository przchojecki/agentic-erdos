#!/usr/bin/env node
// Canonical per-problem script for EP-289.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-289',
  source_count: 1,
  source_files: ["ep289_interval_egyptian_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-289 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep289_interval_egyptian_search.mjs
// Kind: current_script_file
// Label: From ep289_interval_egyptian_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcd(a, b) {
//   let x = a < 0n ? -a : a;
//   let y = b < 0n ? -b : b;
//   while (y !== 0n) {
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
// function harmonicLcm(N) {
//   let D = 1n;
//   for (let n = 1n; n <= BigInt(N); n += 1n) D = lcm(D, n);
//   return D;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep289_interval_egyptian_search.json');
// 
// const Nmax = Number(process.argv[2] || 90);
// const kMax = Number(process.argv[3] || 10);
// const triesPerK = Number(process.argv[4] || 2200);
// 
// const D = harmonicLcm(Nmax);
// const rec = Array(Nmax + 1).fill(0n);
// for (let n = 1; n <= Nmax; n += 1) rec[n] = D / BigInt(n);
// 
// const pref = Array(Nmax + 1).fill(0n);
// for (let i = 1; i <= Nmax; i += 1) pref[i] = pref[i - 1] + rec[i];
// function intervalSum(a, b) {
//   return pref[b] - pref[a - 1];
// }
// 
// const byStart = Array.from({ length: Nmax + 2 }, () => []);
// const allIntervals = [];
// for (let a = 2; a <= Nmax - 1; a += 1) {
//   for (let b = a + 1; b <= Nmax; b += 1) {
//     const s = intervalSum(a, b);
//     const iv = { a, b, s };
//     byStart[a].push(iv);
//     allIntervals.push(iv);
//   }
// }
// 
// for (let a = 2; a <= Nmax; a += 1) byStart[a].sort((u, v) => Number(v.s - u.s));
// 
// function randomInt(lo, hi) {
//   return lo + Math.floor(Math.random() * (hi - lo + 1));
// }
// 
// function sumIntervals(intervals) {
//   let s = 0n;
//   for (const iv of intervals) s += iv.s;
//   return s;
// }
// 
// const results = [];
// for (let k = 2; k <= kMax; k += 1) {
//   let found = null;
// 
//   for (let t = 0; t < triesPerK && !found; t += 1) {
//     const chosen = [];
//     let prevEnd = 0;
//     let sum = 0n;
// 
//     for (let step = 0; step < k; step += 1) {
//       const minStart = prevEnd + 2;
//       if (minStart > Nmax - 1) break;
// 
//       // sample starts with slight bias to larger starts for finer tuning
//       let s0 = randomInt(minStart, Nmax - 1);
//       if (Math.random() < 0.7) s0 = Math.max(minStart, Nmax - randomInt(2, 20));
// 
//       const candStart = [];
//       for (let d = 0; d <= 10; d += 1) {
//         const s1 = s0 - d;
//         const s2 = s0 + d;
//         if (s1 >= minStart && s1 <= Nmax - 1) candStart.push(s1);
//         if (s2 >= minStart && s2 <= Nmax - 1) candStart.push(s2);
//       }
// 
//       let picked = null;
//       const targetRem = D - sum;
// 
//       for (const st of candStart) {
//         const lst = byStart[st];
//         if (!lst || lst.length === 0) continue;
// 
//         // choose one candidate interval from this start, biased toward target rem/(remaining steps)
//         let best = null;
//         const remSteps = k - step;
//         const ideal = targetRem / BigInt(remSteps);
// 
//         for (let q = 0; q < Math.min(25, lst.length); q += 1) {
//           const iv = lst[randomInt(0, Math.min(lst.length - 1, 35))];
//           if (iv.a <= prevEnd + 1) continue;
//           if (sum + iv.s > D) continue;
//           const dist = iv.s > ideal ? iv.s - ideal : ideal - iv.s;
//           if (!best || dist < best.dist) best = { iv, dist };
//         }
// 
//         if (best) {
//           picked = best.iv;
//           break;
//         }
//       }
// 
//       if (!picked) break;
//       chosen.push(picked);
//       sum += picked.s;
//       prevEnd = picked.b;
//     }
// 
//     if (chosen.length === k && sum === D) {
//       found = chosen
//         .map((iv) => ({ a: iv.a, b: iv.b }))
//         .sort((u, v) => u.a - v.a);
//       break;
//     }
//   }
// 
//   let verified = false;
//   if (found) {
//     // exact verification
//     let s = 0n;
//     let okSep = true;
//     for (let i = 0; i < found.length; i += 1) {
//       const iv = found[i];
//       s += intervalSum(iv.a, iv.b);
//       if (i > 0 && found[i - 1].b + 1 >= iv.a) okSep = false;
//       if (iv.b < iv.a + 1) okSep = false;
//     }
//     verified = okSep && s === D;
//   }
// 
//   results.push({
//     k,
//     found_exact_decomposition: !!found,
//     verified,
//     witness_intervals: found,
//     tries_used: triesPerK,
//   });
// 
//   process.stderr.write(`k=${k}, found=${!!found}, verified=${verified}\n`);
// }
// 
// const out = {
//   problem: 'EP-289',
//   method: 'randomized_exact_search_for_disjoint_nonadjacent_interval_harmonic_decompositions_of_1',
//   params: { Nmax, kMax, triesPerK },
//   denominator_lcm_1_to_Nmax: D.toString(),
//   results,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

