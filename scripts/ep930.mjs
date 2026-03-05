#!/usr/bin/env node
// Canonical per-problem script for EP-930.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-930',
  source_count: 2,
  source_files: ["ep930_interval_product_power_scan.mjs","ep930_variable_interval_counterexample_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-930 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep930_interval_product_power_scan.mjs
// Kind: current_script_file
// Label: From ep930_interval_product_power_scan.mjs
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
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorVec(x, spf) {
//   const m = new Map();
//   let v = x;
//   while (v > 1) {
//     const p = spf[v];
//     let e = 0;
//     while (v % p === 0) {
//       v = Math.floor(v / p);
//       e += 1;
//     }
//     m.set(p, (m.get(p) || 0) + e);
//   }
//   return m;
// }
// 
// function gcdInt(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return Math.abs(x);
// }
// 
// function addMap(dst, src) {
//   for (const [p, e] of src.entries()) dst.set(p, (dst.get(p) || 0) + e);
// }
// 
// function isPerfectPowerFromExpMap(m) {
//   let g = 0;
//   for (const e of m.values()) {
//     g = g === 0 ? e : gcdInt(g, e);
//     if (g === 1) return false;
//   }
//   return g >= 2;
// }
// 
// function runScan(Nmax, kMax) {
//   const spf = buildSpf(Nmax + 10);
// 
//   const fact = Array(Nmax + 1);
//   fact[0] = new Map();
//   fact[1] = new Map();
//   for (let i = 2; i <= Nmax; i += 1) fact[i] = factorVec(i, spf);
// 
//   // Prefix exponent maps (sparse) per prime using arrays would be better, but Nmax is modest.
//   const prefix = Array(Nmax + 1);
//   prefix[0] = new Map();
//   for (let i = 1; i <= Nmax; i += 1) {
//     const m = new Map(prefix[i - 1]);
//     addMap(m, fact[i]);
//     prefix[i] = m;
//   }
// 
//   function intervalExp(l, r) {
//     const out = new Map();
//     const mr = prefix[r];
//     const ml = prefix[l - 1];
//     for (const [p, e] of mr.entries()) {
//       const v = e - (ml.get(p) || 0);
//       if (v) out.set(p, v);
//     }
//     return out;
//   }
// 
//   function pairExp(I1, I2) {
//     const m = intervalExp(I1[0], I1[1]);
//     addMap(m, intervalExp(I2[0], I2[1]));
//     return m;
//   }
// 
//   function tripleExp(I1, I2, I3) {
//     const m = intervalExp(I1[0], I1[1]);
//     addMap(m, intervalExp(I2[0], I2[1]));
//     addMap(m, intervalExp(I3[0], I3[1]));
//     return m;
//   }
// 
//   const rows = [];
// 
//   for (let k = 1; k <= kMax; k += 1) {
//     let found2 = null;
//     for (let a = 1; a + k - 1 <= Nmax; a += 1) {
//       const I1 = [a, a + k - 1];
//       for (let b = I1[1] + 1; b + k - 1 <= Nmax; b += 1) {
//         const I2 = [b, b + k - 1];
//         const exp = pairExp(I1, I2);
//         if (isPerfectPowerFromExpMap(exp)) {
//           found2 = { I1, I2 };
//           break;
//         }
//       }
//       if (found2) break;
//     }
// 
//     let found3 = null;
//     if (k <= Math.min(6, kMax)) {
//       for (let a = 1; a + k - 1 <= Nmax; a += 1) {
//         const I1 = [a, a + k - 1];
//         for (let b = I1[1] + 1; b + k - 1 <= Nmax; b += 1) {
//           const I2 = [b, b + k - 1];
//           for (let c = I2[1] + 1; c + k - 1 <= Nmax; c += 1) {
//             const I3 = [c, c + k - 1];
//             const exp = tripleExp(I1, I2, I3);
//             if (isPerfectPowerFromExpMap(exp)) {
//               found3 = { I1, I2, I3 };
//               break;
//             }
//           }
//           if (found3) break;
//         }
//         if (found3) break;
//       }
//     }
// 
//     rows.push({
//       k,
//       r2_equal_length_counterexample_within_scan: found2,
//       r3_equal_length_counterexample_within_scan: found3,
//     });
// 
//     process.stderr.write(`k=${k}, r2=${found2 ? 'yes' : 'no'}, r3=${found3 ? 'yes' : 'no'}\n`);
//   }
// 
//   return rows;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep930_interval_product_power_scan.json');
// const Nmax = Number(process.argv[2] || 220);
// const kMax = Number(process.argv[3] || 12);
// 
// const rows = runScan(Nmax, kMax);
// const out = {
//   problem: 'EP-930',
//   method: 'exact_prime-exponent_test_for_equal-length_disjoint_interval_products',
//   params: { Nmax, kMax },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: ep930_variable_interval_counterexample_search.mjs
// Kind: current_script_file
// Label: From ep930_variable_interval_counterexample_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-930 targeted search for r=2:
// // For each k, search disjoint intervals I1, I2 with lengths in [k, k+lenExtra]
// // and endpoints <= Nmax such that product(I1)*product(I2) is a perfect power.
// 
// const NMAX = Number(process.env.NMAX || 1200);
// const KMIN = Number(process.env.KMIN || 4);
// const KMAX = Number(process.env.KMAX || 8);
// const LEN_EXTRA = Number(process.env.LEN_EXTRA || 4);
// 
// function buildSpf(limit) {
//   const spf = new Uint32Array(limit + 1);
//   for (let i = 2; i <= limit; i += 1) {
//     if (spf[i] !== 0) continue;
//     spf[i] = i;
//     if (i <= Math.floor(limit / i)) {
//       for (let j = i * i; j <= limit; j += i) {
//         if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function gcd(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return Math.abs(x);
// }
// 
// function addMap(dst, src) {
//   for (const [p, e] of src.entries()) dst.set(p, (dst.get(p) || 0) + e);
// }
// 
// function subMap(dst, src) {
//   for (const [p, e] of src.entries()) {
//     const v = (dst.get(p) || 0) - e;
//     if (v === 0) dst.delete(p);
//     else dst.set(p, v);
//   }
// }
// 
// function isPerfectPowerFromExpMap(m) {
//   let g = 0;
//   for (const e of m.values()) {
//     g = g === 0 ? e : gcd(g, e);
//     if (g === 1) return false;
//   }
//   return g >= 2;
// }
// 
// function factorMap(x, spf) {
//   const m = new Map();
//   let v = x;
//   while (v > 1) {
//     const p = spf[v];
//     let e = 0;
//     while (v % p === 0) {
//       v = Math.floor(v / p);
//       e += 1;
//     }
//     m.set(p, (m.get(p) || 0) + e);
//   }
//   return m;
// }
// 
// const spf = buildSpf(NMAX + 5);
// const numberFactor = Array(NMAX + 1);
// numberFactor[0] = new Map();
// numberFactor[1] = new Map();
// for (let i = 2; i <= NMAX; i += 1) numberFactor[i] = factorMap(i, spf);
// 
// const prefix = Array(NMAX + 1);
// prefix[0] = new Map();
// for (let i = 1; i <= NMAX; i += 1) {
//   const m = new Map(prefix[i - 1]);
//   addMap(m, numberFactor[i]);
//   prefix[i] = m;
// }
// 
// function intervalExp(l, r) {
//   const out = new Map(prefix[r]);
//   subMap(out, prefix[l - 1]);
//   return out;
// }
// 
// const rows = [];
// for (let k = KMIN; k <= KMAX; k += 1) {
//   const intervals = [];
//   const lmax = k + LEN_EXTRA;
// 
//   for (let len = k; len <= lmax; len += 1) {
//     for (let a = 1; a + len - 1 <= NMAX; a += 1) {
//       const b = a + len - 1;
//       intervals.push({ a, b, len, exp: intervalExp(a, b) });
//     }
//   }
//   intervals.sort((x, y) => (x.a - y.a) || (x.b - y.b));
// 
//   let found = null;
//   let checks = 0;
//   for (let i = 0; i < intervals.length && !found; i += 1) {
//     const I1 = intervals[i];
//     for (let j = i + 1; j < intervals.length; j += 1) {
//       const I2 = intervals[j];
//       if (I2.a <= I1.b) continue; // not disjoint
//       checks += 1;
//       const merged = new Map(I1.exp);
//       addMap(merged, I2.exp);
//       if (isPerfectPowerFromExpMap(merged)) {
//         found = {
//           I1: [I1.a, I1.b],
//           I2: [I2.a, I2.b],
//           lengths: [I1.len, I2.len],
//         };
//         break;
//       }
//     }
//   }
// 
//   rows.push({
//     k,
//     search_params: { nmax: NMAX, len_min: k, len_max: lmax },
//     checks,
//     r2_counterexample_found: found,
//   });
// 
//   process.stderr.write(`k=${k}: ${found ? 'found' : 'none'} after ${checks} checks\n`);
// }
// 
// const out = {
//   problem: 'EP-930',
//   script: path.basename(process.argv[1]),
//   method: 'exact_exponent_gcd_search_for_r2_with_variable_interval_lengths',
//   params: { nmax: NMAX, kmin: KMIN, kmax: KMAX, len_extra: LEN_EXTRA },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep930_variable_interval_counterexample_search.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, nmax: NMAX, kmin: KMIN, kmax: KMAX }, null, 2));
// 
// ==== End Snippet ====

