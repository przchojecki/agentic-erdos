#!/usr/bin/env node
// Canonical per-problem script for EP-865.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-865',
  source_count: 1,
  source_files: ["ep865_exact_small_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-865 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep865_exact_small_scan.mjs
// Kind: current_script_file
// Label: From ep865_exact_small_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function buildForbiddenEdges(N) {
//   const edges = [];
//   const byVertex = Array.from({ length: N + 1 }, () => []);
// 
//   for (let a = 1; a <= N; a += 1) {
//     for (let b = a + 1; b <= N; b += 1) {
//       for (let c = b + 1; c <= N; c += 1) {
//         const s1 = a + b;
//         const s2 = a + c;
//         const s3 = b + c;
//         if (s1 > N || s2 > N || s3 > N) continue;
// 
//         const req = new Set([a, b, c, s1, s2, s3]);
//         const arr = [...req];
//         let mask = 0n;
//         for (const x of arr) mask |= 1n << BigInt(x - 1);
// 
//         const edgeId = edges.length;
//         edges.push({ req: arr, mask });
//         for (const x of arr) {
//           const others = mask & ~(1n << BigInt(x - 1));
//           byVertex[x].push(others);
//         }
//       }
//     }
//   }
// 
//   return { edges, byVertex };
// }
// 
// function popcountBig(x) {
//   let v = x;
//   let c = 0;
//   while (v !== 0n) {
//     v &= v - 1n;
//     c += 1;
//   }
//   return c;
// }
// 
// function bits(mask, N) {
//   const out = [];
//   for (let i = 1; i <= N; i += 1) {
//     if ((mask >> BigInt(i - 1)) & 1n) out.push(i);
//   }
//   return out;
// }
// 
// function solveMaxAvoiding(N) {
//   const { byVertex } = buildForbiddenEdges(N);
//   let bestMask = 0n;
//   let best = 0;
// 
//   function canInclude(x, selMask) {
//     for (const others of byVertex[x]) {
//       if ((selMask & others) === others) return false;
//     }
//     return true;
//   }
// 
//   function dfs(x, selMask, selCount) {
//     if (selCount + x <= best) return;
// 
//     if (x === 0) {
//       if (selCount > best) {
//         best = selCount;
//         bestMask = selMask;
//       }
//       return;
//     }
// 
//     // Include x if safe.
//     if (canInclude(x, selMask)) {
//       dfs(x - 1, selMask | (1n << BigInt(x - 1)), selCount + 1);
//     }
// 
//     // Exclude x.
//     dfs(x - 1, selMask, selCount);
//   }
// 
//   dfs(N, 0n, 0);
// 
//   return {
//     N,
//     exact_max_avoiding_size: best,
//     witness_set: bits(bestMask, N),
//     threshold_gap_vs_5_over_8N: best - (5 * N) / 8,
//   };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep865_exact_small_scan.json');
// 
// const Nmax = Number(process.argv[2] || 40);
// const rows = [];
// 
// for (let N = 8; N <= Nmax; N += 1) {
//   const t0 = Date.now();
//   const r = solveMaxAvoiding(N);
//   const ms = Date.now() - t0;
//   rows.push({ ...r, runtime_ms: ms });
//   process.stderr.write(`N=${N}, max=${r.exact_max_avoiding_size}, gap=${r.threshold_gap_vs_5_over_8N.toFixed(3)}, ms=${ms}\n`);
// }
// 
// let maxGap = -1e9;
// let minGap = 1e9;
// for (const r of rows) {
//   if (r.threshold_gap_vs_5_over_8N > maxGap) maxGap = r.threshold_gap_vs_5_over_8N;
//   if (r.threshold_gap_vs_5_over_8N < minGap) minGap = r.threshold_gap_vs_5_over_8N;
// }
// 
// const out = {
//   problem: 'EP-865',
//   method: 'exact_branch_and_bound_on_forbidden_3-sum-pattern_hypergraph',
//   Nmax,
//   rows,
//   gap_summary: {
//     max_exact_avoiding_minus_5N_over_8: maxGap,
//     min_exact_avoiding_minus_5N_over_8: minGap,
//   },
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

