#!/usr/bin/env node
// Canonical per-problem script for EP-985.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-985',
  source_count: 1,
  source_files: ["ep985_prime_primitive_root_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-985 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep985_prime_primitive_root_scan.mjs
// Kind: current_script_file
// Label: From ep985_prime_primitive_root_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const P_MAX = Number(process.env.P_MAX || 2000000);
// 
// function sieveSpf(n) {
//   const spf = new Int32Array(n + 1);
//   for (let i = 2; i <= n; i++) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i * i <= n) for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//     }
//   }
//   return spf;
// }
// 
// function primesFromSpf(spf) {
//   const out = [];
//   for (let i = 2; i < spf.length; i++) if (spf[i] === i) out.push(i);
//   return out;
// }
// 
// function distinctPrimeFactors(n, spf) {
//   const out = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     out.push(p);
//     while (x % p === 0) x = Math.floor(x / p);
//   }
//   return out;
// }
// 
// function modPow(a, e, mod) {
//   let x = BigInt(a % mod);
//   let p = BigInt(e);
//   let m = BigInt(mod);
//   let r = 1n;
//   while (p > 0n) {
//     if (p & 1n) r = (r * x) % m;
//     x = (x * x) % m;
//     p >>= 1n;
//   }
//   return Number(r);
// }
// 
// const spf = sieveSpf(P_MAX + 5);
// const primes = primesFromSpf(spf);
// 
// const rows = [];
// const failures = [];
// let checked = 0;
// 
// for (const p of primes) {
//   if (p <= 3) continue;
//   if (p > P_MAX) break;
//   const factors = distinctPrimeFactors(p - 1, spf);
//   let found = null;
//   for (const q of primes) {
//     if (q >= p) break;
//     let ok = true;
//     for (const r of factors) {
//       if (modPow(q, (p - 1) / r, p) === 1) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) {
//       found = q;
//       break;
//     }
//   }
//   checked++;
//   if (found == null) failures.push(p);
// 
//   if (p <= 200 || p % 50000 === 1) {
//     rows.push({ p, has_prime_primitive_root_below_p: found != null, smallest_prime_primitive_root: found });
//   }
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   p_max: P_MAX,
//   checked_prime_count: checked,
//   failure_count: failures.length,
//   failures_first: failures.slice(0, 20),
//   sample_rows: rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep985_prime_primitive_root_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, p_max: P_MAX, checked, failures: failures.length }, null, 2));
// 
// ==== End Snippet ====

