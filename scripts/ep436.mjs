#!/usr/bin/env node
// Canonical per-problem script for EP-436.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-436',
  source_count: 1,
  source_files: ["ep436_lambda_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-436 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep436_lambda_scan.mjs
// Kind: current_script_file
// Label: From ep436_lambda_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const P_MAX = Number(process.env.P_MAX || 20000);
// const K_LIST = (process.env.K_LIST || '3,5,7,9').split(',').map((x) => Number(x.trim())).filter((x) => x >= 2);
// const M = Number(process.env.M || 3);
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1, 2);
//   for (let i = 2; i * i <= n; i++) {
//     if (!isPrime[i]) continue;
//     for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
//   }
//   const out = [];
//   for (let i = 2; i <= n; i++) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function modPow(base, exp, mod) {
//   let b = BigInt(base % mod);
//   let e = BigInt(exp);
//   const m = BigInt(mod);
//   let r = 1n;
//   while (e > 0n) {
//     if (e & 1n) r = (r * b) % m;
//     b = (b * b) % m;
//     e >>= 1n;
//   }
//   return Number(r);
// }
// 
// // Uses the convention in this project that 0 is a k-th power residue mod p.
// function rKmp(k, m, p) {
//   const isResidue = new Uint8Array(p);
//   for (let x = 0; x < p; x++) isResidue[modPow(x, k, p)] = 1;
//   for (let r = 1; r <= p; r++) {
//     let ok = true;
//     for (let t = 0; t < m; t++) {
//       const cls = (r + t) % p;
//       if (!isResidue[cls]) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) return r;
//   }
//   return null;
// }
// 
// const primes = sievePrimes(P_MAX).filter((p) => p > 3);
// const rows = [];
// 
// for (const k of K_LIST) {
//   let maxR = -1;
//   let argmaxP = null;
//   let missing = 0;
//   for (const p of primes) {
//     const r = rKmp(k, M, p);
//     if (r == null) {
//       missing++;
//       continue;
//     }
//     if (r > maxR) {
//       maxR = r;
//       argmaxP = p;
//     }
//   }
//   rows.push({ k, m: M, p_max: P_MAX, max_r_observed: maxR, prime_at_max: argmaxP, missing });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   convention: '0_included_as_kth_power_residue',
//   p_max: P_MAX,
//   k_list: K_LIST,
//   m: M,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep436_lambda_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length, p_max: P_MAX }, null, 2));
// 
// ==== End Snippet ====

