#!/usr/bin/env node
// Canonical per-problem script for EP-731.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-731',
  source_count: 1,
  source_files: ["ep726_ep730_ep731_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-731 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep726_ep730_ep731_scan.mjs
// Kind: current_script_file
// Label: From ep726_ep730_ep731_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
//   }
//   const primes = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
//   return primes;
// }
// 
// function buildSpf(n) {
//   const spf = new Uint32Array(n + 1);
//   for (let i = 2; i <= n; i += 1) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i <= Math.floor(n / i)) {
//         for (let j = i * i; j <= n; j += i) {
//           if (spf[j] === 0) spf[j] = i;
//         }
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorizeSmall(n, spf) {
//   const out = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e += 1;
//     }
//     out.push([p, e]);
//   }
//   return out;
// }
// 
// function vFact(n, p) {
//   let x = n;
//   let s = 0;
//   while (x > 0) {
//     x = Math.floor(x / p);
//     s += x;
//   }
//   return s;
// }
// 
// function centralPrimeValuations(n, primes) {
//   const out = new Map();
//   for (const p of primes) {
//     if (p > 2 * n) break;
//     const v = vFact(2 * n, p) - 2 * vFact(n, p);
//     if (v > 0) out.set(p, v);
//   }
//   return out;
// }
// 
// function signatureFromMap(map) {
//   return [...map.keys()].join(',');
// }
// 
// function leastNonDivisor(valMap, spf, mMax) {
//   for (let m = 2; m <= mMax; m += 1) {
//     const fac = factorizeSmall(m, spf);
//     let divides = true;
//     for (const [p, e] of fac) {
//       const v = valMap.get(p) || 0;
//       if (v < e) {
//         divides = false;
//         break;
//       }
//     }
//     if (!divides) return m;
//   }
//   return null;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep726_ep730_ep731_scan.json');
// 
// const nMax = Number(process.argv[2] || 4000);
// const mMax = Number(process.argv[3] || 4000);
// const primes = sievePrimes(2 * nMax + 10);
// const spf = buildSpf(mMax + 50);
// 
// // EP726: test asymptotic relation on a grid of n values.
// const ep726Rows = [];
// for (let n = 500; n <= nMax; n += 250) {
//   let s = 0;
//   for (const p of primes) {
//     if (p > n) break;
//     const r = n % p;
//     if (2 * r > p) s += 1 / p;
//   }
//   const target = 0.5 * Math.log(Math.log(n));
//   ep726Rows.push({
//     n,
//     sum_value: s,
//     target_half_loglog_n: target,
//     ratio_to_target: target > 0 ? s / target : null,
//     diff_minus_target: s - target,
//   });
// }
// 
// // EP730 and EP731: prime-divisor signatures and least non-divisor.
// const sigMap = new Map();
// const ep731Rows = [];
// for (let n = 1; n <= nMax; n += 1) {
//   const valMap = centralPrimeValuations(n, primes);
//   const sig = signatureFromMap(valMap);
//   if (!sigMap.has(sig)) sigMap.set(sig, []);
//   sigMap.get(sig).push(n);
// 
//   const m = leastNonDivisor(valMap, spf, mMax);
//   ep731Rows.push({
//     n,
//     least_m_not_dividing_central_binomial_within_scan: m,
//     log_m: m ? Math.log(m) : null,
//     sqrt_log_n: n > 1 ? Math.sqrt(Math.log(n)) : null,
//     ratio_logm_over_sqrtlogn: m && n > 1 ? Math.log(m) / Math.sqrt(Math.log(n)) : null,
//   });
// 
//   if (n % 500 === 0) process.stderr.write(`n=${n}/${nMax}\n`);
// }
// 
// const repeatedSignatures = [];
// for (const [sig, arr] of sigMap.entries()) {
//   if (arr.length >= 2) {
//     repeatedSignatures.push({
//       count: arr.length,
//       n_values: arr,
//       min_n: arr[0],
//       max_n: arr[arr.length - 1],
//       signature_prefix: sig.slice(0, 220),
//     });
//   }
// }
// repeatedSignatures.sort((a, b) => b.count - a.count || a.min_n - b.min_n);
// 
// const ep730Pairs = [];
// for (const g of repeatedSignatures) {
//   const arr = g.n_values;
//   for (let i = 0; i + 1 < arr.length; i += 1) {
//     ep730Pairs.push([arr[i], arr[i + 1]]);
//   }
// }
// 
// const out = {
//   problems: ['EP-726', 'EP-730', 'EP-731'],
//   params: { nMax, mMax },
//   ep726: {
//     method: 'direct_prime_sum_evaluation_on_n_grid',
//     rows: ep726Rows,
//   },
//   ep730: {
//     method: 'prime-divisor-signature_matching_for_binomial_2n_n',
//     repeated_signature_groups: repeatedSignatures.slice(0, 80),
//     total_repeated_groups: repeatedSignatures.length,
//     sample_pairs: ep730Pairs.slice(0, 200),
//   },
//   ep731: {
//     method: 'least_nondivisor_scan_using_prime_valuations',
//     rows: ep731Rows,
//     unresolved_count_due_to_mMax: ep731Rows.filter((r) => r.least_m_not_dividing_central_binomial_within_scan == null).length,
//   },
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

