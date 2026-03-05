#!/usr/bin/env node
// Canonical per-problem script for EP-456.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-456',
  source_count: 1,
  source_files: ["ep456_mn_vs_pn_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-456 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep456_mn_vs_pn_scan.mjs
// Kind: current_script_file
// Label: From ep456_mn_vs_pn_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sieveWithPhi(n) {
//   const isPrime = new Uint8Array(n + 1);
//   const phi = new Uint32Array(n + 1);
//   for (let i = 0; i <= n; i += 1) phi[i] = i;
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     phi[p] = p - 1;
//     for (let q = p * 2; q <= n; q += p) {
//       isPrime[q] = 0;
//       phi[q] = Math.floor((phi[q] * (p - 1)) / p);
//     }
//   }
//   return { isPrime, phi };
// }
// 
// function isPrimeTrial(n) {
//   if (n < 2) return false;
//   if (n % 2 === 0) return n === 2;
//   for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
//   return true;
// }
// 
// function pOfN(n) {
//   let k = 1;
//   while (true) {
//     const x = k * n + 1;
//     if (isPrimeTrial(x)) return x;
//     k += 1;
//   }
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep456_mn_vs_pn_scan.json');
// 
// const Nmax = Number(process.argv[2] || 2000);
// let capM = Number(process.argv[3] || 120000);
// 
// let sp = sieveWithPhi(capM);
// 
// function mOfN(n) {
//   while (true) {
//     for (let m = 1; m <= capM; m += 1) {
//       if (sp.phi[m] % n === 0) return m;
//     }
//     capM *= 2;
//     sp = sieveWithPhi(capM);
//   }
// }
// 
// const rows = [];
// let countStrict = 0;
// let countEqual = 0;
// let minRatio = Number.POSITIVE_INFINITY;
// let maxRatio = 0;
// 
// for (let n = 2; n <= Nmax; n += 1) {
//   const m = mOfN(n);
//   const p = pOfN(n);
//   const strict = m < p;
//   const eq = m === p;
//   if (strict) countStrict += 1;
//   if (eq) countEqual += 1;
// 
//   const ratio = p / m;
//   if (ratio < minRatio) minRatio = ratio;
//   if (ratio > maxRatio) maxRatio = ratio;
// 
//   rows.push({ n, m_n: m, p_n: p, strict_m_less_p: strict, equal: eq, ratio_p_over_m: ratio });
// 
//   if (n % 200 === 0) process.stderr.write(`n=${n}, strictFrac=${(countStrict / (n - 1)).toFixed(3)}, maxRatio=${maxRatio.toFixed(3)}\n`);
// }
// 
// const power2Odd = [];
// for (let k = 0; k <= 12; k += 1) {
//   const n = 2 ** (2 * k + 1);
//   if (n > Nmax) break;
//   const rec = rows[n - 2];
//   power2Odd.push({ k, n, m_n: rec.m_n, p_n: rec.p_n, strict: rec.strict_m_less_p, ratio_p_over_m: rec.ratio_p_over_m });
// }
// 
// const out = {
//   problem: 'EP-456',
//   method: 'exact_scan_of_m_n_via_phi_values_and_direct_search_of_smallest_prime_1_mod_n',
//   params: { Nmax, capM_final: capM },
//   summary: {
//     strict_count: countStrict,
//     equal_count: countEqual,
//     strict_fraction: countStrict / (Nmax - 1),
//     equal_fraction: countEqual / (Nmax - 1),
//     min_ratio_p_over_m: minRatio,
//     max_ratio_p_over_m: maxRatio,
//   },
//   power_of_two_odd_exponent_samples: power2Odd,
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

