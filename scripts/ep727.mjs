#!/usr/bin/env node
// Canonical per-problem script for EP-727.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-727',
  source_count: 1,
  source_files: ["ep727_factorial_square_divisibility_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-727 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep727_factorial_square_divisibility_scan.mjs
// Kind: current_script_file
// Label: From ep727_factorial_square_divisibility_scan.mjs
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
// function applyFactors(x, coef, spf, diff, negCountObj) {
//   let v = x;
//   while (v > 1) {
//     const p = spf[v];
//     let e = 0;
//     while (v % p === 0) {
//       v = Math.floor(v / p);
//       e += 1;
//     }
// 
//     const delta = coef * e;
//     const before = diff[p];
//     const after = before + delta;
//     if (before < 0 && after >= 0) negCountObj.value -= 1;
//     if (before >= 0 && after < 0) negCountObj.value += 1;
//     diff[p] = after;
//   }
// }
// 
// function scanFixedK(k, N, spf) {
//   const maxV = 2 * N + k + 5;
//   const diff = new Int32Array(maxV + 1);
//   const negCountObj = { value: 0 };
// 
//   // Initialize at n=1: D_p = v_p((2)!)-2v_p((k+1)!)
//   applyFactors(2, +1, spf, diff, negCountObj);
//   for (let t = 2; t <= k + 1; t += 1) applyFactors(t, -2, spf, diff, negCountObj);
// 
//   const hits = [];
//   const rows = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     const ok = negCountObj.value === 0;
//     if (ok) {
//       hits.push(n);
//       if (hits.length <= 200) rows.push({ n });
//     }
// 
//     // move n -> n+1
//     if (n < N) {
//       applyFactors(2 * n + 1, +1, spf, diff, negCountObj);
//       applyFactors(2 * n + 2, +1, spf, diff, negCountObj);
//       applyFactors(n + k + 1, -2, spf, diff, negCountObj);
//     }
//   }
// 
//   return {
//     k,
//     N,
//     hit_count: hits.length,
//     first_hits: hits.slice(0, 120),
//     last_hits: hits.slice(Math.max(0, hits.length - 120)),
//     sample_rows: rows,
//   };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep727_factorial_square_divisibility_scan.json');
// 
// const N = Number(process.argv[2] || 800000);
// const kList = (process.argv[3] || '2,3,4,5,6,7,8,9,10').split(',').map((x) => Number(x));
// const spf = buildSpf(2 * N + Math.max(...kList) + 10);
// 
// const results = [];
// for (const k of kList) {
//   const t0 = Date.now();
//   const r = scanFixedK(k, N, spf);
//   r.runtime_ms = Date.now() - t0;
//   results.push(r);
//   process.stderr.write(`k=${k}, hits=${r.hit_count}, first=${r.first_hits.slice(0,5).join(',')}, ms=${r.runtime_ms}\n`);
// }
// 
// const out = {
//   problem: 'EP-727',
//   method: 'exact_prime_exponent_difference_recurrence_scan',
//   params: { N, k_list: kList },
//   results,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

