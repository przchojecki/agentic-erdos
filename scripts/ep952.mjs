#!/usr/bin/env node
// Canonical per-problem script for EP-952.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-952',
  source_count: 1,
  source_files: ["ep952_gaussian_moat_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-952 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep952_gaussian_moat_scan.mjs
// Kind: current_script_file
// Label: From ep952_gaussian_moat_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sieve(n) {
//   const prime = new Uint8Array(n + 1);
//   prime.fill(1);
//   prime[0] = 0;
//   prime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!prime[p]) continue;
//     for (let q = p * p; q <= n; q += p) prime[q] = 0;
//   }
//   return prime;
// }
// 
// function isGaussianPrime(a, b, isPrime) {
//   const aa = Math.abs(a);
//   const bb = Math.abs(b);
//   if (aa === 0 && bb === 0) return false;
//   if (aa === 0 || bb === 0) {
//     const p = aa + bb;
//     return p < isPrime.length && isPrime[p] && p % 4 === 3;
//   }
//   const n = aa * aa + bb * bb;
//   return n < isPrime.length && isPrime[n] === 1;
// }
// 
// function buildPoints(R, isPrime) {
//   const pts = [];
//   for (let a = -R; a <= R; a += 1) {
//     for (let b = -R; b <= R; b += 1) {
//       if (isGaussianPrime(a, b, isPrime)) pts.push([a, b]);
//     }
//   }
//   return pts;
// }
// 
// function runForD(points, R, D) {
//   const cellSize = D;
//   const cells = new Map();
//   for (let i = 0; i < points.length; i += 1) {
//     const [x, y] = points[i];
//     const cx = Math.floor((x + R) / cellSize);
//     const cy = Math.floor((y + R) / cellSize);
//     const key = `${cx},${cy}`;
//     if (!cells.has(key)) cells.set(key, []);
//     cells.get(key).push(i);
//   }
// 
//   let start = -1;
//   let bestNorm = Infinity;
//   for (let i = 0; i < points.length; i += 1) {
//     const [x, y] = points[i];
//     const nm = x * x + y * y;
//     if (nm < bestNorm) {
//       bestNorm = nm;
//       start = i;
//     }
//   }
// 
//   const D2 = D * D;
//   const vis = new Uint8Array(points.length);
//   const q = [start];
//   vis[start] = 1;
// 
//   let head = 0;
//   let visited = 1;
//   let maxNormReached = points[start][0] * points[start][0] + points[start][1] * points[start][1];
//   let reachesBoundary = false;
// 
//   while (head < q.length) {
//     const u = q[head++];
//     const [x, y] = points[u];
// 
//     const nm = x * x + y * y;
//     if (nm > maxNormReached) maxNormReached = nm;
//     if (Math.abs(x) === R || Math.abs(y) === R) reachesBoundary = true;
// 
//     const cx = Math.floor((x + R) / cellSize);
//     const cy = Math.floor((y + R) / cellSize);
// 
//     for (let dx = -1; dx <= 1; dx += 1) {
//       for (let dy = -1; dy <= 1; dy += 1) {
//         const key = `${cx + dx},${cy + dy}`;
//         const arr = cells.get(key);
//         if (!arr) continue;
//         for (const v of arr) {
//           if (vis[v]) continue;
//           const [xx, yy] = points[v];
//           const d2 = (xx - x) * (xx - x) + (yy - y) * (yy - y);
//           if (d2 <= D2 && d2 > 0) {
//             vis[v] = 1;
//             visited += 1;
//             q.push(v);
//           }
//         }
//       }
//     }
//   }
// 
//   return {
//     D,
//     start_prime: points[start],
//     visited_component_size: visited,
//     max_radius_reached: Math.sqrt(maxNormReached),
//     reaches_box_boundary: reachesBoundary,
//   };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep952_gaussian_moat_scan.json');
// 
// const R = Number(process.argv[2] || 220);
// const dList = (process.argv[3] || '3,4,5,6,7,8,10').split(',').map((x) => Number(x));
// 
// const maxNorm = 2 * R * R + 10;
// const isPrime = sieve(maxNorm);
// const points = buildPoints(R, isPrime);
// 
// const rows = [];
// for (const D of dList) {
//   const r = runForD(points, R, D);
//   rows.push(r);
//   process.stderr.write(`D=${D}, visited=${r.visited_component_size}, max_r=${r.max_radius_reached.toFixed(2)}, boundary=${r.reaches_box_boundary}\n`);
// }
// 
// const out = {
//   problem: 'EP-952',
//   method: 'finite_window_connectivity_of_gaussian_primes_under_step_bound_D',
//   params: { R, d_list: dList, point_count: points.length },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

