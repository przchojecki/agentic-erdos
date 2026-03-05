#!/usr/bin/env node
// Canonical per-problem script for EP-983.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-983',
  source_count: 1,
  source_files: ["ep983_exact_small_n.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-983 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep983_exact_small_n.mjs
// Kind: current_script_file
// Label: From ep983_exact_small_n.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sievePrimes(n) {
//   const isPrime = Array(n + 1).fill(true);
//   isPrime[0] = false;
//   isPrime[1] = false;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = false;
//   }
//   const out = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function popcount(x) {
//   let v = x;
//   let c = 0;
//   while (v) {
//     v &= v - 1;
//     c += 1;
//   }
//   return c;
// }
// 
// function combinations(arr, k) {
//   const out = [];
//   const n = arr.length;
//   function rec(start, cur) {
//     if (cur.length === k) {
//       out.push(cur.slice());
//       return;
//     }
//     for (let i = start; i < n; i += 1) {
//       cur.push(arr[i]);
//       rec(i + 1, cur);
//       cur.pop();
//     }
//   }
//   rec(0, []);
//   return out;
// }
// 
// function primeMaskOf(x, primes) {
//   let t = x;
//   let mask = 0;
//   for (let i = 0; i < primes.length; i += 1) {
//     const p = primes[i];
//     if (p * p > t) break;
//     if (t % p === 0) {
//       mask |= (1 << i);
//       while (t % p === 0) t = Math.floor(t / p);
//     }
//   }
//   if (t > 1) {
//     const idx = primes.indexOf(t);
//     if (idx >= 0) mask |= (1 << idx);
//   }
//   return mask;
// }
// 
// function minRForSubset(subset, primes, numMasks, masksByR) {
//   const p = primes.length;
// 
//   // count smooth elements for each prime-mask
//   const smoothCount = Array(1 << p).fill(0);
//   for (const a of subset) {
//     const m = numMasks[a];
//     // a is smooth over P iff m subset P
//     for (let P = m; P < (1 << p); P = (P + 1) | m) {
//       smoothCount[P] += 1;
//       if (P === (1 << p) - 1) break;
//     }
//   }
// 
//   for (let r = 0; r <= p; r += 1) {
//     for (const mask of masksByR[r]) {
//       if (smoothCount[mask] > r) return r;
//     }
//   }
// 
//   return p + 1;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep983_exact_small_n.json');
// 
// const rows = [];
// 
// for (let n = 8; n <= 24; n += 1) {
//   const primes = sievePrimes(n);
//   const p = primes.length;
//   const k = p + 1;
// 
//   const universe = [];
//   for (let x = 1; x <= n; x += 1) universe.push(x);
// 
//   const numMasks = Array(n + 1).fill(0);
//   for (let x = 1; x <= n; x += 1) numMasks[x] = primeMaskOf(x, primes);
// 
//   const masksByR = Array.from({ length: p + 1 }, () => []);
//   for (let mask = 0; mask < (1 << p); mask += 1) masksByR[popcount(mask)].push(mask);
// 
//   const subs = combinations(universe, k);
//   let f = -1;
//   let worstSubset = null;
//   let totalChecked = 0;
// 
//   for (const A of subs) {
//     const rA = minRForSubset(A, primes, numMasks, masksByR);
//     totalChecked += 1;
//     if (rA > f) {
//       f = rA;
//       worstSubset = A.slice();
//     }
//   }
// 
//   const piSqrt = sievePrimes(Math.floor(Math.sqrt(n))).length;
//   const expression = 2 * piSqrt - f;
// 
//   rows.push({
//     n,
//     pi_n: p,
//     k,
//     total_subsets_checked: totalChecked,
//     exact_f_pi_plus_1_n: f,
//     two_pi_sqrt_n_minus_f: expression,
//     worst_subset_witness: worstSubset,
//   });
// 
//   process.stderr.write(`n=${n} done, subsets=${totalChecked}, f=${f}, 2pi(sqrt n)-f=${expression}\n`);
// }
// 
// const out = {
//   problem: 'EP-983',
//   method: 'exact_enumeration_over_all_A_of_size_pi(n)+1_for_small_n',
//   n_range: [8, 24],
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

