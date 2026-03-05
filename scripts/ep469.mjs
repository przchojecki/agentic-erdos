#!/usr/bin/env node
// Canonical per-problem script for EP-469.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-469',
  source_count: 1,
  source_files: ["ep469_primitive_pseudoperfect_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-469 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep469_primitive_pseudoperfect_scan.mjs
// Kind: current_script_file
// Label: From ep469_primitive_pseudoperfect_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
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
// function factorize(n, spf) {
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
// function sigmaFromFactorization(fac) {
//   let s = 1;
//   for (const [p, e] of fac) {
//     let term = 1;
//     let cur = 1;
//     for (let i = 0; i < e; i += 1) {
//       cur *= p;
//       term += cur;
//     }
//     s *= term;
//   }
//   return s;
// }
// 
// function divisorsFromFactorization(fac) {
//   let divs = [1];
//   for (const [p, e] of fac) {
//     const next = [];
//     let mult = 1;
//     for (let i = 0; i <= e; i += 1) {
//       for (const d of divs) next.push(d * mult);
//       mult *= p;
//     }
//     divs = next;
//   }
//   return divs;
// }
// 
// function subsetSumHitsTarget(values, target) {
//   let mask = 1n;
//   const lim = (1n << BigInt(target + 1)) - 1n;
//   for (const v of values) {
//     mask |= mask << BigInt(v);
//     mask &= lim;
//     if (((mask >> BigInt(target)) & 1n) === 1n) return true;
//   }
//   return false;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep469_primitive_pseudoperfect_scan.json');
// 
// const N = Number(process.argv[2] || 100000);
// const spf = buildSpf(N);
// 
// const isPseudoperfect = new Uint8Array(N + 1);
// const isPrimitive = new Uint8Array(N + 1);
// const primitiveList = [];
// 
// let testedSubsetSum = 0;
// 
// for (let n = 2; n <= N; n += 1) {
//   const fac = factorize(n, spf);
//   const sigma = sigmaFromFactorization(fac);
//   const properDivisorSum = sigma - n;
// 
//   if (properDivisorSum < n) continue;
// 
//   const divs = divisorsFromFactorization(fac).filter((d) => d < n).sort((a, b) => b - a);
//   testedSubsetSum += 1;
//   if (!subsetSumHitsTarget(divs, n)) continue;
// 
//   isPseudoperfect[n] = 1;
// 
//   let primitive = true;
//   for (const d of divs) {
//     if (isPseudoperfect[d]) {
//       primitive = false;
//       break;
//     }
//   }
// 
//   if (primitive) {
//     isPrimitive[n] = 1;
//     primitiveList.push(n);
//   }
// 
//   if (n % 10000 === 0) process.stderr.write(`n=${n}/${N}, primitive_count=${primitiveList.length}\n`);
// }
// 
// let recip = 0;
// const partialRows = [];
// let idx = 0;
// for (const n of primitiveList) {
//   recip += 1 / n;
//   idx += 1;
//   if (idx <= 30 || idx % 25 === 0) {
//     partialRows.push({ index: idx, n, partial_sum: recip });
//   }
// }
// 
// const out = {
//   problem: 'EP-469',
//   method: 'exact_subset_sum_test_for_pseudoperfect_plus_primitive_filter',
//   scan_limit_N: N,
//   subset_sum_instances_tested: testedSubsetSum,
//   primitive_count: primitiveList.length,
//   primitive_values: primitiveList,
//   reciprocal_partial_sum: recip,
//   reciprocal_partial_rows: partialRows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

