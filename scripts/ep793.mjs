#!/usr/bin/env node
// Canonical per-problem script for EP-793.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-793',
  source_count: 1,
  source_files: ["ep793_ep535_ep536_exact_small.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-793 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep793_ep535_ep536_exact_small.mjs
// Kind: current_script_file
// Label: From ep793_ep535_ep536_exact_small.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcd(a, b) {
//   while (b !== 0) {
//     const t = a % b;
//     a = b;
//     b = t;
//   }
//   return a;
// }
// 
// function lcm(a, b) {
//   return (a / gcd(a, b)) * b;
// }
// 
// function popcountBigInt(x) {
//   let c = 0;
//   let v = x;
//   while (v !== 0n) {
//     v &= v - 1n;
//     c += 1;
//   }
//   return c;
// }
// 
// function bitsOf(mask, n) {
//   const out = [];
//   for (let i = 0; i < n; i += 1) {
//     if ((mask >> BigInt(i)) & 1n) out.push(i);
//   }
//   return out;
// }
// 
// function buildPairForbid(n, edgePredicate) {
//   const pairForbid = Array.from({ length: n }, () => Array.from({ length: n }, () => 0n));
//   let edgeCount = 0;
// 
//   for (let i = 0; i < n; i += 1) {
//     const a = i + 1;
//     for (let j = i + 1; j < n; j += 1) {
//       const b = j + 1;
//       for (let k = j + 1; k < n; k += 1) {
//         const c = k + 1;
//         if (!edgePredicate(a, b, c)) continue;
//         edgeCount += 1;
//         pairForbid[i][j] |= 1n << BigInt(k);
//         pairForbid[i][k] |= 1n << BigInt(j);
//         pairForbid[j][k] |= 1n << BigInt(i);
//       }
//     }
//   }
// 
//   return { pairForbid, edgeCount };
// }
// 
// function maxIndependentSet3Uniform(n, pairForbid) {
//   const allMask = n >= 63 ? ((1n << BigInt(n)) - 1n) : ((1n << BigInt(n)) - 1n);
//   let bestSize = 0;
//   let bestMask = 0n;
// 
//   function pairMask(u, v) {
//     const a = u < v ? u : v;
//     const b = u < v ? v : u;
//     return pairForbid[a][b];
//   }
// 
//   function chooseBranchVertex(selList, candMask) {
//     const candList = bitsOf(candMask, n);
//     if (candList.length === 0) return -1;
// 
//     let bestV = candList[0];
//     let bestScore = -1;
// 
//     for (const v of candList) {
//       let forbidBySel = 0n;
//       for (const s of selList) {
//         forbidBySel |= pairMask(v, s);
//       }
//       const direct = popcountBigInt(forbidBySel & candMask);
// 
//       // Lightweight estimate of internal restriction pressure around v.
//       let local = 0;
//       for (const w of candList) {
//         if (w === v) continue;
//         if ((pairMask(v, w) & candMask) !== 0n) local += 1;
//       }
// 
//       const score = direct * 8 + local;
//       if (score > bestScore) {
//         bestScore = score;
//         bestV = v;
//       }
//     }
// 
//     return bestV;
//   }
// 
//   function dfs(selMask, selList, candMask) {
//     const ub = selList.length + popcountBigInt(candMask);
//     if (ub <= bestSize) return;
// 
//     if (candMask === 0n) {
//       if (selList.length > bestSize) {
//         bestSize = selList.length;
//         bestMask = selMask;
//       }
//       return;
//     }
// 
//     const v = chooseBranchVertex(selList, candMask);
//     const bitV = 1n << BigInt(v);
// 
//     // Include branch.
//     {
//       let invalid = false;
//       let remMask = 0n;
//       for (const s of selList) {
//         const pm = pairMask(v, s);
//         if ((pm & selMask) !== 0n) {
//           invalid = true;
//           break;
//         }
//         remMask |= pm;
//       }
// 
//       if (!invalid) {
//         const newSelMask = selMask | bitV;
//         const newSelList = selList.concat([v]);
//         const newCandMask = (candMask & ~bitV) & ~remMask;
//         dfs(newSelMask, newSelList, newCandMask);
//       }
//     }
// 
//     // Exclude branch.
//     dfs(selMask, selList, candMask & ~bitV);
//   }
// 
//   dfs(0n, [], allMask);
// 
//   const witness = bitsOf(bestMask, n).map((x) => x + 1);
//   return { bestSize, witness };
// }
// 
// function runProblem(problemKey, cfg) {
//   const rows = [];
// 
//   for (let n = cfg.nMin; n <= cfg.nMax; n += 1) {
//     const { pairForbid, edgeCount } = buildPairForbid(n, cfg.edgePredicate);
//     const t0 = Date.now();
//     const { bestSize, witness } = maxIndependentSet3Uniform(n, pairForbid);
//     const ms = Date.now() - t0;
// 
//     rows.push({
//       n,
//       edge_count: edgeCount,
//       exact_max_size: bestSize,
//       density: Number((bestSize / n).toFixed(6)),
//       witness,
//       runtime_ms: ms,
//     });
// 
//     process.stderr.write(`[${problemKey}] n=${n} done, max=${bestSize}, ms=${ms}\n`);
//   }
// 
//   return rows;
// }
// 
// const root = process.cwd();
// const outDir = path.join(root, 'data');
// 
// const ep793Rows = runProblem('EP-793', {
//   nMin: 6,
//   nMax: 50,
//   edgePredicate: (a, b, c) => {
//     const ab = a * b;
//     const ac = a * c;
//     const bc = b * c;
//     return (bc % a === 0) || (ac % b === 0) || (ab % c === 0);
//   },
// });
// 
// const ep535Rows = runProblem('EP-535-r3', {
//   nMin: 6,
//   nMax: 50,
//   edgePredicate: (a, b, c) => {
//     const g1 = gcd(a, b);
//     const g2 = gcd(a, c);
//     const g3 = gcd(b, c);
//     return g1 === g2 && g2 === g3;
//   },
// });
// 
// const ep536Rows = runProblem('EP-536', {
//   nMin: 6,
//   nMax: 50,
//   edgePredicate: (a, b, c) => {
//     const l1 = lcm(a, b);
//     const l2 = lcm(a, c);
//     const l3 = lcm(b, c);
//     return l1 === l2 && l2 === l3;
//   },
// });
// 
// const ep793Out = {
//   problem: 'EP-793',
//   method: 'exact_max_independent_set_in_3_uniform_hypergraph',
//   property: 'No element divides the product of two other distinct selected elements.',
//   n_range: [6, 50],
//   rows: ep793Rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const ep535Out = {
//   problem: 'EP-535 (r=3 finite proxy)',
//   method: 'exact_max_independent_set_in_3_uniform_hypergraph',
//   property: 'No selected triple has equal pairwise gcd.',
//   n_range: [6, 50],
//   rows: ep535Rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const ep536Out = {
//   problem: 'EP-536 finite exact scan',
//   method: 'exact_max_independent_set_in_3_uniform_hypergraph',
//   property: 'No selected triple has equal pairwise lcm.',
//   n_range: [6, 50],
//   rows: ep536Rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(path.join(outDir, 'ep793_exact_small_hypergraph_scan.json'), `${JSON.stringify(ep793Out, null, 2)}\n`);
// fs.writeFileSync(path.join(outDir, 'ep535_r3_exact_small_hypergraph_scan.json'), `${JSON.stringify(ep535Out, null, 2)}\n`);
// fs.writeFileSync(path.join(outDir, 'ep536_exact_small_hypergraph_scan.json'), `${JSON.stringify(ep536Out, null, 2)}\n`);
// 
// process.stderr.write('Wrote data/ep793_exact_small_hypergraph_scan.json\n');
// process.stderr.write('Wrote data/ep535_r3_exact_small_hypergraph_scan.json\n');
// process.stderr.write('Wrote data/ep536_exact_small_hypergraph_scan.json\n');
// 
// ==== End Snippet ====

