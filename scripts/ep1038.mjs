#!/usr/bin/env node

// EP-1038 deep finite proxy:
// measure of {x: |f(x)| < 1} for monic real-root polynomials with roots in [-1,1].

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function polyValFromRoots(roots, x) {
  let v = 1;
  for (const r of roots) v *= (x - r);
  return v;
}

function estimateMeasure(roots, xMin, xMax, step) {
  let inside = 0;
  let total = 0;
  for (let x = xMin; x <= xMax; x += step) {
    const v = Math.abs(polyValFromRoots(roots, x));
    if (v < 1) inside += 1;
    total += 1;
  }
  return (inside / total) * (xMax - xMin);
}

function randomRoots(n, rng) {
  const roots = [];
  for (let i = 0; i < n; i += 1) roots.push(2 * rng() - 1);
  roots.sort((a, b) => a - b);
  return roots;
}

function chebyshevRoots(n) {
  const out = [];
  for (let j = 1; j <= n; j += 1) out.push(Math.cos(((2 * j - 1) * Math.PI) / (2 * n)));
  out.sort((a, b) => a - b);
  return out;
}

function equallySpacedRoots(n) {
  const out = [];
  for (let i = 0; i < n; i += 1) out.push(-1 + (2 * i) / Math.max(1, n - 1));
  return out;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1038 ^ (depth * 65537));

  const nList = [6, 8, 10, 12, 14];
  const rows = [];

  for (const n of nList) {
    const xMin = -2.5;
    const xMax = 2.5;
    const step = 0.0008;

    const mCheb = estimateMeasure(chebyshevRoots(n), xMin, xMax, step);
    const mEq = estimateMeasure(equallySpacedRoots(n), xMin, xMax, step);

    let bestSmall = Infinity;
    let bestLarge = 0;
    const trials = 250 * depth;
    for (let t = 0; t < trials; t += 1) {
      const r = randomRoots(n, rng);
      const m = estimateMeasure(r, xMin, xMax, step);
      if (m < bestSmall) bestSmall = m;
      if (m > bestLarge) bestLarge = m;
    }

    rows.push({
      n,
      random_trials: trials,
      chebyshev_root_measure_est: Number(mCheb.toFixed(8)),
      equally_spaced_root_measure_est: Number(mEq.toFixed(8)),
      smallest_measure_seen_random_search: Number(bestSmall.toFixed(8)),
      largest_measure_seen_random_search: Number(bestLarge.toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1038',
    script: 'ep1038.mjs',
    method: 'deep_real_root_polynomial_sublevel_measure_scan',
    warning: 'Grid-based numerical estimates only; not rigorous extremal proofs.',
    params: { depth, nList },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
