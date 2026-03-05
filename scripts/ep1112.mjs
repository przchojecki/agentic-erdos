#!/usr/bin/env node
const meta={problem:'EP-1112',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1112 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite greedy construction profile for bounded-gap A avoiding kA ∩ B. ----
// // EP-1112: finite greedy construction profile for bounded-gap A avoiding kA ∩ B.
// {
//   function buildLacunaryPowers(base, N) {
//     const outB = [];
//     let x = base;
//     while (x <= N) {
//       outB.push(x);
//       x *= base;
//     }
//     return outB;
//   }
// 
//   function buildLacunaryRandom(r, N, rng) {
//     const outB = [5];
//     while (true) {
//       const prev = outB[outB.length - 1];
//       const next = Math.floor(r * prev + 1 + rng() * prev * 0.25);
//       if (next > N) break;
//       outB.push(next);
//     }
//     return outB;
//   }
// 
//   function greedyGapSequenceAvoidingB({ d1, d2, k, N, B }) {
//     const isB = new Uint8Array(N + 1);
//     for (const b of B) if (b <= N) isB[b] = 1;
// 
//     const A = [1];
//     const inS1 = new Uint8Array(N + 1);
//     const inS2 = new Uint8Array(N + 1);
//     const inS3 = new Uint8Array(N + 1);
//     inS1[1] = 1;
//     if (k === 2) inS2[2] = 1;
//     if (k === 3) {
//       inS2[2] = 1;
//       inS3[3] = 1;
//     }
// 
//     function tryAdd(a) {
//       if (a > N) return false;
//       if (k === 2) {
//         const new2 = [];
//         for (let x = 1; x <= N; x += 1) {
//           if (!inS1[x]) continue;
//           const s = a + x;
//           if (s <= N && !inS2[s]) {
//             if (isB[s]) return false;
//             new2.push(s);
//           }
//         }
//         if (2 * a <= N && !inS2[2 * a]) {
//           if (isB[2 * a]) return false;
//           new2.push(2 * a);
//         }
//         A.push(a);
//         inS1[a] = 1;
//         for (const s of new2) inS2[s] = 1;
//         return true;
//       }
// 
//       // k=3
//       const mark2 = new Uint8Array(N + 1);
//       const new2 = [];
//       for (let x = 1; x <= N; x += 1) {
//         if (!inS1[x]) continue;
//         const s = a + x;
//         if (s <= N && !inS2[s] && !mark2[s]) {
//           mark2[s] = 1;
//           new2.push(s);
//         }
//       }
//       if (2 * a <= N && !inS2[2 * a] && !mark2[2 * a]) {
//         mark2[2 * a] = 1;
//         new2.push(2 * a);
//       }
// 
//       const mark3 = new Uint8Array(N + 1);
//       const new3 = [];
//       for (let t = 1; t <= N; t += 1) {
//         if (!inS2[t] && !mark2[t]) continue;
//         const s = a + t;
//         if (s <= N && !inS3[s] && !mark3[s]) {
//           if (isB[s]) return false;
//           mark3[s] = 1;
//           new3.push(s);
//         }
//       }
// 
//       A.push(a);
//       inS1[a] = 1;
//       for (const s of new2) inS2[s] = 1;
//       for (const s of new3) inS3[s] = 1;
//       return true;
//     }
// 
//     while (true) {
//       const cur = A[A.length - 1];
//       let moved = false;
//       for (let gap = d1; gap <= d2; gap += 1) {
//         if (tryAdd(cur + gap)) {
//           moved = true;
//           break;
//         }
//       }
//       if (!moved) break;
//     }
//     return { length: A.length, last: A[A.length - 1], first_terms: A.slice(0, 30) };
//   }
// 
//   const N = 1200;
//   const rng = makeRng(20260304 ^ 1112);
//   const scenarios = [
//     { name: 'k3_gaps2_3_B=2^i', d1: 2, d2: 3, k: 3, B: buildLacunaryPowers(2, N) },
//     { name: 'k3_gaps2_3_B=3^i', d1: 2, d2: 3, k: 3, B: buildLacunaryPowers(3, N) },
//     { name: 'k3_gaps2_3_random_lacunary_r2', d1: 2, d2: 3, k: 3, B: buildLacunaryRandom(2, N, rng) },
//     { name: 'k2_gaps2_3_B=2^i_control', d1: 2, d2: 3, k: 2, B: buildLacunaryPowers(2, N) },
//   ];
// 
//   const rows = scenarios.map((s) => ({
//     scenario: s.name,
//     B_size: s.B.length,
//     ...greedyGapSequenceAvoidingB({ d1: s.d1, d2: s.d2, k: s.k, N, B: s.B }),
//   }));
// 
//   out.results.ep1112 = {
//     description: 'Finite greedy bounded-gap construction tests for avoiding k-fold sumsets against lacunary B.',
//     N,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
