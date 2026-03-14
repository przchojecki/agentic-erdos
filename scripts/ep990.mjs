#!/usr/bin/env node

// EP-990
// Finite sparse-polynomial root-argument discrepancy study.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function cAdd(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
function cSub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
function cMul(a, b) { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
function cDiv(a, b) {
  const den = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / den, im: (a.im * b.re - a.re * b.im) / den };
}
function cAbs(a) { return Math.hypot(a.re, a.im); }

function polyEval(coeffAsc, z) {
  let w = { re: coeffAsc[coeffAsc.length - 1], im: 0 };
  for (let i = coeffAsc.length - 2; i >= 0; i -= 1) {
    w = cAdd(cMul(w, z), { re: coeffAsc[i], im: 0 });
  }
  return w;
}

function durandKernerMonic(coeffAsc, maxIter = 3000, tol = 1e-12) {
  const d = coeffAsc.length - 1;
  const roots = [];
  const radius = 0.5;
  for (let j = 0; j < d; j += 1) {
    const ang = (2 * Math.PI * j) / d;
    roots.push({ re: radius * Math.cos(ang), im: radius * Math.sin(ang) });
  }

  for (let it = 0; it < maxIter; it += 1) {
    let maxDelta = 0;
    for (let i = 0; i < d; i += 1) {
      let denom = { re: 1, im: 0 };
      for (let j = 0; j < d; j += 1) {
        if (j === i) continue;
        denom = cMul(denom, cSub(roots[i], roots[j]));
      }
      const fz = polyEval(coeffAsc, roots[i]);
      const delta = cDiv(fz, denom);
      roots[i] = cSub(roots[i], delta);
      const ad = cAbs(delta);
      if (ad > maxDelta) maxDelta = ad;
    }
    if (maxDelta < tol) break;
  }

  return roots;
}

function angleFrac(z) {
  let a = Math.atan2(z.im, z.re) / (2 * Math.PI);
  if (a < 0) a += 1;
  return a;
}

function maxIntervalDiscrepancy(theta, bins = 720) {
  const d = theta.length;
  const arr = theta.slice().sort((a, b) => a - b);
  const arr2 = arr.concat(arr.map((x) => x + 1));

  let best = 0;
  for (let bi = 0; bi < bins; bi += 1) {
    const L = bi / bins;
    for (let bj = bi + 1; bj <= bi + bins; bj += 1) {
      const R = bj / bins;
      const len = R - L;

      // count in [L,R)
      let lo = 0;
      while (lo < arr2.length && arr2[lo] < L) lo += 1;
      let hi = lo;
      while (hi < arr2.length && arr2[hi] < R) hi += 1;
      const c = hi - lo;

      const dev = Math.abs(c - len * d);
      if (dev > best) best = dev;
    }
  }
  return best;
}

function sparsePoly(deg, sparsity, rng) {
  const coeff = new Float64Array(deg + 1);
  const idx = new Set([0, deg]);
  while (idx.size < sparsity) idx.add(Math.floor(rng() * (deg + 1)));
  for (const i of idx) {
    let v = 0;
    while (v === 0) v = Math.floor(rng() * 5) - 2; // {-2,-1,0,1,2}\{0}
    coeff[i] = v;
  }
  if (coeff[deg] === 0) coeff[deg] = 1;
  if (coeff[0] === 0) coeff[0] = 1;

  const sumAbs = Array.from(coeff).reduce((s, x) => s + Math.abs(x), 0);
  const M = sumAbs / Math.sqrt(Math.abs(coeff[0] * coeff[deg]));

  return { coeff: Array.from(coeff), M, nonzero: idx.size };
}

function main() {
  const t0 = Date.now();
  const rng = makeRng(20260314 ^ 990);

  const configs = [
    { deg: 40, sparsity: 6, trials: 20 },
    { deg: 60, sparsity: 8, trials: 18 },
    { deg: 80, sparsity: 10, trials: 14 },
    { deg: 100, sparsity: 12, trials: 10 },
  ];

  const rows = [];

  for (const cfg of configs) {
    let ratioSum = 0;
    let ratioMax = 0;
    let discMax = 0;

    for (let t = 0; t < cfg.trials; t += 1) {
      const P = sparsePoly(cfg.deg, cfg.sparsity, rng);
      const lead = P.coeff[cfg.deg];
      const monic = P.coeff.map((x) => x / lead);
      const roots = durandKernerMonic(monic);
      const theta = roots.map(angleFrac);
      const disc = maxIntervalDiscrepancy(theta, 180);
      const bnd = Math.sqrt(P.nonzero * Math.log(Math.max(P.M, 1.000001)));
      const ratio = disc / Math.max(1e-9, bnd);

      ratioSum += ratio;
      if (ratio > ratioMax) ratioMax = ratio;
      if (disc > discMax) discMax = disc;
    }

    rows.push({
      degree: cfg.deg,
      sparsity_target: cfg.sparsity,
      trials: cfg.trials,
      mean_discrepancy_over_sqrt_nlogM: Number((ratioSum / cfg.trials).toFixed(8)),
      max_discrepancy_over_sqrt_nlogM: Number(ratioMax.toFixed(8)),
      max_interval_discrepancy_observed: Number(discMax.toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-990',
    script: 'ep990.mjs',
    method: 'deep_sparse_polynomial_root_argument_discrepancy_scan',
    warning: 'Finite random model only; does not prove universal bound.',
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
