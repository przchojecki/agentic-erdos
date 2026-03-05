#!/usr/bin/env node
// Canonical per-problem script for EP-445.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-445',
  source_count: 1,
  source_files: ["ep445_inverse_interval_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-445 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep445_inverse_interval_scan.mjs
// Kind: current_script_file
// Label: From ep445_inverse_interval_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-445 finite probe:
// // For prime p and c, test whether for every residue shift n (mod p)
// // there exist a,b in (n, n+p^c) with ab ≡ 1 (mod p).
// 
// const P_MAX = Number(process.env.P_MAX || 20000);
// const C_LIST = (process.env.C_LIST || '0.55,0.60,0.65,0.70,0.75,0.80')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x > 0.5 && x < 1);
// const SHIFT_SAMPLES = Number(process.env.SHIFT_SAMPLES || 160);
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1, 2);
//   for (let i = 2; i * i <= n; i++) {
//     if (!isPrime[i]) continue;
//     for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
//   }
//   const ps = [];
//   for (let i = 2; i <= n; i++) if (isPrime[i]) ps.push(i);
//   return ps;
// }
// 
// function invTable(p) {
//   const inv = new Int32Array(p);
//   inv[1] = 1;
//   for (let a = 2; a < p; a++) {
//     inv[a] = (p - Math.floor(p / a) * inv[p % a]) % p;
//   }
//   return inv;
// }
// 
// function sampledShiftsWork(p, c) {
//   const L = Math.floor(Math.pow(p, c)); // integer points in open interval are modeled by this length
//   if (L <= 0) return false;
//   const inv = invTable(p);
//   const inWindow = new Uint8Array(p);
// 
//   const checks = p <= SHIFT_SAMPLES ? p : SHIFT_SAMPLES;
//   for (let t0 = 0; t0 < checks; t0++) {
//     const r = p <= SHIFT_SAMPLES ? t0 : Math.floor((t0 * p) / checks);
//     inWindow.fill(0);
//     for (let t = 1; t <= L; t++) inWindow[(r + t) % p] = 1;
//     let ok = false;
//     for (let x = 1; x < p; x++) {
//       if (!inWindow[x]) continue;
//       if (inWindow[inv[x]]) {
//         ok = true;
//         break;
//       }
//     }
//     if (!ok) return false;
//   }
//   return true;
// }
// 
// const primes = sievePrimes(P_MAX).filter((p) => p >= 101); // skip tiny p where asymptotic behavior is noisy
// const rows = [];
// 
// for (const c of C_LIST) {
//   let good = 0;
//   let bad = 0;
//   let largestBad = null;
//   for (const p of primes) {
//     if (sampledShiftsWork(p, c)) good++;
//     else {
//       bad++;
//       largestBad = p;
//     }
//   }
//   rows.push({
//     c,
//     p_max: P_MAX,
//     primes_tested: primes.length,
//     primes_good: good,
//     primes_bad: bad,
//     largest_bad_prime: largestBad,
//     good_ratio: Number((good / Math.max(1, primes.length)).toFixed(6)),
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   p_max: P_MAX,
//   shift_samples: SHIFT_SAMPLES,
//   c_list: C_LIST,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep445_inverse_interval_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length, p_max: P_MAX }, null, 2));
// 
// ==== End Snippet ====

