#!/usr/bin/env node

function sieve(n) {
  const prime = new Uint8Array(n + 1);
  prime.fill(1);
  if (n >= 0) prime[0] = 0;
  if (n >= 1) prime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!prime[p]) continue;
    for (let q = p * p; q <= n; q += p) prime[q] = 0;
  }
  return prime;
}

function isGaussianPrime(a, b, isPrime) {
  const aa = Math.abs(a);
  const bb = Math.abs(b);
  if (aa === 0 && bb === 0) return false;
  if (aa === 0 || bb === 0) {
    const p = aa + bb;
    return p < isPrime.length && isPrime[p] && (p % 4 === 3);
  }
  const n = aa * aa + bb * bb;
  return n < isPrime.length && isPrime[n] === 1;
}

function buildPoints(R, isPrime) {
  const pts = [];
  for (let a = -R; a <= R; a += 1) {
    for (let b = -R; b <= R; b += 1) {
      if (isGaussianPrime(a, b, isPrime)) pts.push([a, b]);
    }
  }
  return pts;
}

function buildCells(points, R, cellSize) {
  const width = Math.floor((2 * R) / cellSize) + 3;
  const cells = new Map();

  for (let i = 0; i < points.length; i += 1) {
    const [x, y] = points[i];
    const cx = Math.floor((x + R) / cellSize);
    const cy = Math.floor((y + R) / cellSize);
    const key = cx * width + cy;
    const arr = cells.get(key);
    if (arr) arr.push(i);
    else cells.set(key, [i]);
  }

  return { cells, width };
}

function runForD(points, R, D) {
  const { cells, width } = buildCells(points, R, D);

  let start = 0;
  let bestNorm = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const [x, y] = points[i];
    const nm = x * x + y * y;
    if (nm < bestNorm) {
      bestNorm = nm;
      start = i;
    }
  }

  const D2 = D * D;
  const vis = new Uint8Array(points.length);
  const q = new Int32Array(points.length);
  let qHead = 0;
  let qTail = 0;

  q[qTail++] = start;
  vis[start] = 1;

  let maxNormReached = bestNorm;
  let reachesBoundary = false;

  while (qHead < qTail) {
    const u = q[qHead++];
    const [x, y] = points[u];

    const nm = x * x + y * y;
    if (nm > maxNormReached) maxNormReached = nm;
    if (Math.abs(x) === R || Math.abs(y) === R) reachesBoundary = true;

    const cx = Math.floor((x + R) / D);
    const cy = Math.floor((y + R) / D);

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const key = (cx + dx) * width + (cy + dy);
        const arr = cells.get(key);
        if (!arr) continue;

        for (let t = 0; t < arr.length; t += 1) {
          const v = arr[t];
          if (vis[v]) continue;
          const [xx, yy] = points[v];
          const d2 = (xx - x) * (xx - x) + (yy - y) * (yy - y);
          if (d2 > 0 && d2 <= D2) {
            vis[v] = 1;
            q[qTail++] = v;
          }
        }
      }
    }
  }

  return {
    D,
    start_prime: points[start],
    visited_component_size: qTail,
    max_radius_reached: Math.sqrt(maxNormReached),
    reaches_box_boundary: reachesBoundary,
  };
}

function main() {
  const R = Number(process.env.R || process.argv[2] || 500);
  const dList = (process.env.D_LIST || process.argv[3] || '3,4,5,6,7,8,10,12')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);

  const maxNorm = 2 * R * R + 5;
  const isPrime = sieve(maxNorm);
  const points = buildPoints(R, isPrime);

  const rows = [];
  for (const D of dList) {
    const row = runForD(points, R, D);
    rows.push(row);
    process.stderr.write(`D=${D}, visited=${row.visited_component_size}, max_r=${row.max_radius_reached.toFixed(2)}, boundary=${row.reaches_box_boundary}\n`);
  }

  const out = {
    problem: 'EP-952',
    method: 'standalone_finite_window_connectivity_of_gaussian_primes_under_step_bound_D',
    params: {
      R,
      d_list: dList,
      point_count: points.length,
    },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
