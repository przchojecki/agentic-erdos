#!/usr/bin/env node
const meta={problem:'EP-612',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-612 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | diameter/n-over-d ratios for explicit K4-free (triangle-free) blow-up families. ----
// // EP-612: diameter/n-over-d ratios for explicit K4-free (triangle-free) blow-up families.
// {
//   function blowupCycleGraph(L, s) {
//     const n = L * s;
//     const G = makeGraph(n);
// 
//     function id(block, idx) {
//       return block * s + idx;
//     }
// 
//     for (let b = 0; b < L; b += 1) {
//       const nb = (b + 1) % L;
//       for (let i = 0; i < s; i += 1) {
//         for (let j = 0; j < s; j += 1) {
//           addEdge(G, id(b, i), id(nb, j));
//         }
//       }
//     }
// 
//     return G;
//   }
// 
//   function diameter(G) {
//     const { n, neigh } = G;
//     let D = 0;
//     for (let s = 0; s < n; s += 1) {
//       const dist = Array(n).fill(-1);
//       dist[s] = 0;
//       const q = [s];
//       let qi = 0;
//       while (qi < q.length) {
//         const u = q[qi++];
//         for (const v of neigh[u]) {
//           if (dist[v] >= 0) continue;
//           dist[v] = dist[u] + 1;
//           q.push(v);
//         }
//       }
//       for (const x of dist) if (x > D) D = x;
//     }
//     return D;
//   }
// 
//   function minDegree(G) {
//     let d = Infinity;
//     for (const arr of G.neigh) if (arr.length < d) d = arr.length;
//     return d;
//   }
// 
//   const rows = [];
//   const originalK4FreeCoeff = 16 / 7; // first formula in statement at r=2
//   const amendedK4FreeCoeff = 3 - 2 / 3; // (3 - 2/k) with k=3 (K4-free)
// 
//   for (const [L, s] of [
//     [9, 8],
//     [13, 8],
//     [17, 8],
//     [13, 12],
//     [17, 12],
//   ]) {
//     const G = blowupCycleGraph(L, s);
//     const n = G.n;
//     const d = minDegree(G);
//     const D = diameter(G);
//     const coeff = (D * d) / n;
// 
//     rows.push({
//       family: 'blowup_of_odd_cycle_triangle_free',
//       L,
//       s,
//       n,
//       min_degree: d,
//       diameter: D,
//       coeff_D_over_n_over_d: Number(coeff.toPrecision(7)),
//       ratio_to_original_k4_free_coeff_16_over_7: Number((coeff / originalK4FreeCoeff).toPrecision(7)),
//       ratio_to_amended_k4_free_coeff_7_over_3: Number((coeff / amendedK4FreeCoeff).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep612 = {
//     description: 'Explicit K4-free family diameter profile versus n/d scaling constants.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch15_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
