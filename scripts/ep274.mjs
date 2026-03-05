#!/usr/bin/env node
const meta={problem:'EP-274',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-274 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | exact-cover search in cyclic groups Z_n by cosets with distinct indices. ----
// // EP-274: exact-cover search in cyclic groups Z_n by cosets with distinct indices.
// {
//   function cosetsZn(n) {
//     const cands = [];
//     for (let idx = 2; idx <= n; idx += 1) {
//       if (n % idx !== 0) continue;
//       for (let r = 0; r < idx; r += 1) {
//         let mask = 0n;
//         for (let x = r; x < n; x += idx) mask |= 1n << BigInt(x);
//         cands.push({ index: idx, mask });
//       }
//     }
//     return cands;
//   }
// 
//   function hasDistinctIndexCosetPartitionZn(n) {
//     const cands = cosetsZn(n);
//     const allMask = (1n << BigInt(n)) - 1n;
// 
//     const idxVals = [...new Set(cands.map((c) => c.index))].sort((a, b) => a - b);
//     const idxPos = new Map(idxVals.map((v, i) => [v, i]));
// 
//     const elemToCands = Array.from({ length: n }, () => []);
//     for (let i = 0; i < cands.length; i += 1) {
//       const { mask } = cands[i];
//       for (let e = 0; e < n; e += 1) {
//         if ((mask >> BigInt(e)) & 1n) elemToCands[e].push(i);
//       }
//     }
// 
//     for (const list of elemToCands) {
//       list.sort((i, j) => {
//         const ai = cands[i].mask.toString(2).length;
//         const aj = cands[j].mask.toString(2).length;
//         return ai - aj;
//       });
//     }
// 
//     function dfs(covered, usedIdxBits, chosen) {
//       if (covered === allMask) return chosen > 1;
// 
//       let e = 0;
//       while (e < n && ((covered >> BigInt(e)) & 1n)) e += 1;
//       if (e >= n) return chosen > 1;
// 
//       for (const ci of elemToCands[e]) {
//         const c = cands[ci];
//         const bit = 1n << BigInt(idxPos.get(c.index));
//         if (usedIdxBits & bit) continue;
//         if (covered & c.mask) continue;
//         if (dfs(covered | c.mask, usedIdxBits | bit, chosen + 1)) return true;
//       }
//       return false;
//     }
// 
//     return dfs(0n, 0n, 0);
//   }
// 
//   const rows = [];
//   let foundAny = false;
//   for (const n of [6, 8, 10, 12, 14, 16, 18, 20, 24, 30]) {
//     const ok = hasDistinctIndexCosetPartitionZn(n);
//     if (ok) foundAny = true;
//     rows.push({ n, has_partition: ok });
//   }
// 
//   out.results.ep274 = {
//     description: 'Brute-force exact-cover search in small cyclic groups for distinct-index coset partitions.',
//     rows,
//     any_partition_found: foundAny,
//   };
// }
// ==== End Batch Split Integrations ====
