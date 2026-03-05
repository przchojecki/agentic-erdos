#!/usr/bin/env node
// Canonical per-problem script for EP-1100.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-1100',
  source_count: 1,
  source_files: ["ep1100_tau_perp_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-1100 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep1100_tau_perp_scan.mjs
// Kind: current_script_file
// Label: From ep1100_tau_perp_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_MAX = Number(process.env.N_MAX || 120000);
// 
// function sieveSpf(n) {
//   const spf = new Int32Array(n + 1);
//   for (let i = 2; i <= n; i++) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i * i <= n) {
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorize(n, spf) {
//   const fac = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e++;
//     }
//     fac.push([p, e]);
//   }
//   return fac;
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
//   return x;
// }
// 
// function divisorsSorted(fac) {
//   const divs = [1];
//   for (const [p, e] of fac) {
//     const base = divs.slice();
//     let mult = 1;
//     for (let j = 1; j <= e; j++) {
//       mult *= p;
//       for (const d of base) divs.push(d * mult);
//     }
//   }
//   divs.sort((a, b) => a - b);
//   return divs;
// }
// 
// const spf = sieveSpf(N_MAX + 5);
// const g = new Map(); // k -> {tau, n}
// let ratioSumTail = 0;
// let ratioCountTail = 0;
// const sampleRows = [];
// let maxTau = 0;
// let maxTauN = 1;
// 
// for (let n = 2; n <= N_MAX; n++) {
//   const fac = factorize(n, spf);
//   const omega = fac.length;
//   const squarefree = fac.every(([, e]) => e === 1);
//   const divs = divisorsSorted(fac);
//   let tauPerp = 0;
//   for (let i = 0; i + 1 < divs.length; i++) {
//     if (gcd(divs[i], divs[i + 1]) === 1) tauPerp++;
//   }
// 
//   if (tauPerp > maxTau) {
//     maxTau = tauPerp;
//     maxTauN = n;
//   }
// 
//   if (squarefree) {
//     const cur = g.get(omega);
//     if (!cur || tauPerp > cur.tau) g.set(omega, { tau: tauPerp, n });
//   }
// 
//   if (n > Math.floor((3 * N_MAX) / 4) && omega > 0) {
//     ratioSumTail += tauPerp / omega;
//     ratioCountTail++;
//   }
// 
//   if (n <= 200 || n % 5000 === 0) {
//     sampleRows.push({ n, omega, tau_perp: tauPerp, ratio_tau_perp_over_omega: omega ? Number((tauPerp / omega).toFixed(6)) : null });
//   }
// }
// 
// const gRows = [...g.entries()]
//   .sort((a, b) => a[0] - b[0])
//   .map(([k, v]) => ({ k, gk_lower_bound_from_scan: v.tau, witness_n: v.n }));
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_max: N_MAX,
//   tail_interval: [Math.floor((3 * N_MAX) / 4) + 1, N_MAX],
//   tail_mean_ratio_tau_perp_over_omega: ratioCountTail ? ratioSumTail / ratioCountTail : null,
//   max_tau_perp_observed: maxTau,
//   max_tau_perp_witness_n: maxTauN,
//   gk_scan: gRows,
//   sample_rows: sampleRows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep1100_tau_perp_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_max: N_MAX, gk_rows: gRows.length }, null, 2));
// 
// ==== End Snippet ====

