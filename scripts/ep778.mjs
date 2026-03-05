#!/usr/bin/env node
const meta={problem:'EP-778',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-778 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | simulated play for clique-building game. ----
// // EP-778: simulated play for clique-building game.
// {
//   const rng = makeRng(20260304 ^ 1801);
// 
//   function allEdges(n) {
//     const e = [];
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) e.push([i, j]);
//     }
//     return e;
//   }
// 
//   function cliquePotentialScore(adj, u, v) {
//     let common = 0;
//     for (let w = 0; w < adj.length; w += 1) {
//       if (adj[u][w] && adj[v][w]) common += 1;
//     }
//     return common;
//   }
// 
//   function play(n, strategyA, strategyB) {
//     const edges = allEdges(n);
//     const rem = new Set(edges.map(([u, v]) => `${u},${v}`));
//     const red = Array.from({ length: n }, () => Array(n).fill(0));
//     const blue = Array.from({ length: n }, () => Array(n).fill(0));
// 
//     function chooseEdge(strategy, colorAdj) {
//       const list = [...rem];
//       if (strategy === 'random') {
//         const k = list[Math.floor(rng() * list.length)];
//         const [u, v] = k.split(',').map(Number);
//         return [u, v];
//       }
// 
//       // greedy_triangle: maximize current common-neighbor gain.
//       let best = null;
//       let bestScore = -1;
//       const inspect = list.length > 110 ? 110 : list.length;
//       for (let t = 0; t < inspect; t += 1) {
//         const k = list[Math.floor(rng() * list.length)];
//         const [u, v] = k.split(',').map(Number);
//         const s = cliquePotentialScore(colorAdj, u, v);
//         if (s > bestScore) {
//           bestScore = s;
//           best = [u, v];
//         }
//       }
//       return best;
//     }
// 
//     let aliceTurn = true;
//     while (rem.size) {
//       if (aliceTurn) {
//         const [u, v] = chooseEdge(strategyA, red);
//         red[u][v] = red[v][u] = 1;
//         rem.delete(`${Math.min(u, v)},${Math.max(u, v)}`);
//       } else {
//         const [u, v] = chooseEdge(strategyB, blue);
//         blue[u][v] = blue[v][u] = 1;
//         rem.delete(`${Math.min(u, v)},${Math.max(u, v)}`);
//       }
//       aliceTurn = !aliceTurn;
//     }
// 
//     function masksFromAdj(adj) {
//       const masks = Array(n).fill(0n);
//       for (let i = 0; i < n; i += 1) {
//         let m = 0n;
//         for (let j = 0; j < n; j += 1) if (adj[i][j]) m |= 1n << BigInt(j);
//         masks[i] = m;
//       }
//       return masks;
//     }
// 
//     const redClique = maxCliqueSizeFromAdjMasks(masksFromAdj(red), n);
//     const blueClique = maxCliqueSizeFromAdjMasks(masksFromAdj(blue), n);
//     return { redClique, blueClique };
//   }
// 
//   const rows = [];
//   for (const n of [8, 10, 12, 14]) {
//     for (const [sa, sb, trials] of [
//       ['random', 'random', 180],
//       ['greedy_triangle', 'greedy_triangle', 160],
//       ['greedy_triangle', 'random', 160],
//       ['random', 'greedy_triangle', 160],
//     ]) {
//       let aliceWins = 0;
//       let bobWins = 0;
//       let ties = 0;
//       let sumGap = 0;
//       for (let t = 0; t < trials; t += 1) {
//         const { redClique, blueClique } = play(n, sa, sb);
//         const gap = redClique - blueClique;
//         sumGap += gap;
//         if (redClique > blueClique) aliceWins += 1;
//         else if (blueClique > redClique) bobWins += 1;
//         else ties += 1;
//       }
//       rows.push({
//         n,
//         alice_strategy: sa,
//         bob_strategy: sb,
//         trials,
//         alice_win_rate: Number((aliceWins / trials).toPrecision(6)),
//         bob_win_rate: Number((bobWins / trials).toPrecision(6)),
//         tie_rate: Number((ties / trials).toPrecision(6)),
//         avg_red_minus_blue_clique: Number((sumGap / trials).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep778 = {
//     description: 'Finite simulated outcomes for clique-building game under random/greedy policies.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
