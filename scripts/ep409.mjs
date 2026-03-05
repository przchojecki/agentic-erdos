#!/usr/bin/env node
const meta={problem:'EP-409',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-409 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | iterations of T(n)=phi(n)+1 to prime. ----
// // EP-409: iterations of T(n)=phi(n)+1 to prime.
// {
//   const N = 300000;
//   const memoSteps = new Int32Array(N + 1);
//   const memoPrime = new Int32Array(N + 1);
//   memoSteps.fill(-1);
// 
//   function solve(n) {
//     if (memoSteps[n] >= 0) return [memoSteps[n], memoPrime[n]];
// 
//     const path = [];
//     let x = n;
//     while (true) {
//       if (memoSteps[x] >= 0) break;
//       path.push(x);
//       if (isPrimeBySPF(x, spf)) {
//         memoSteps[x] = 0;
//         memoPrime[x] = x;
//         break;
//       }
//       x = phi[x] + 1;
//     }
// 
//     let steps = memoSteps[x];
//     let p = memoPrime[x];
//     for (let i = path.length - 1; i >= 0; i -= 1) {
//       steps += 1;
//       memoSteps[path[i]] = steps;
//       memoPrime[path[i]] = p;
//     }
//     return [memoSteps[n], memoPrime[n]];
//   }
// 
//   const milestones = [10000, 50000, 100000, 200000, 300000];
//   const mset = new Set(milestones);
// 
//   let sumF = 0;
//   let maxF = 0;
//   let argMax = 1;
//   const primeBasin = new Map();
//   const rows = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     const [steps, p] = solve(n);
//     const f = isPrimeBySPF(n, spf) ? 0 : steps;
//     sumF += f;
//     if (f > maxF) {
//       maxF = f;
//       argMax = n;
//     }
//     primeBasin.set(p, (primeBasin.get(p) || 0) + 1);
// 
//     if (mset.has(n)) {
//       const c2 = primeBasin.get(2) || 0;
//       const c3 = primeBasin.get(3) || 0;
//       const c5 = primeBasin.get(5) || 0;
//       rows.push({
//         X: n,
//         mean_iterations_to_prime: Number((sumF / n).toPrecision(7)),
//         max_iterations_up_to_X: maxF,
//         argmax_n: argMax,
//         density_reaching_prime_2: Number((c2 / n).toPrecision(6)),
//         density_reaching_prime_3: Number((c3 / n).toPrecision(6)),
//         density_reaching_prime_5: Number((c5 / n).toPrecision(6)),
//       });
//     }
//   }
// 
//   const topBasins = [...primeBasin.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
//     .map(([p, c]) => ({ prime: p, count: c, density: Number((c / N).toPrecision(6)) }));
// 
//   out.results.ep409 = {
//     description: 'Finite iteration profile for T(n)=phi(n)+1 and terminal-prime basins.',
//     rows,
//     top_terminal_prime_basins: topBasins,
//   };
// }
// ==== End Batch Split Integrations ====
