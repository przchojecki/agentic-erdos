#!/usr/bin/env node

// EP-1039 deep finite proxy:
// estimate rho = radius of largest disc contained in {|P(z)|<1}
// for P(z)=prod (z-r_j), r_j in unit disk.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function cMul(a, b) {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

function polyAbs(roots, z) {
  let w = { re: 1, im: 0 };
  for (const r of roots) {
    w = cMul(w, { re: z.re - r.re, im: z.im - r.im });
  }
  return Math.hypot(w.re, w.im);
}

function rootsOnUnitCircle(n) {
  const roots = [];
  for (let j = 0; j < n; j += 1) {
    const ang = (2 * Math.PI * j) / n;
    roots.push({ re: Math.cos(ang), im: Math.sin(ang) });
  }
  return roots;
}

function randomRootsInUnitDisk(n, rng) {
  const roots = [];
  for (let i = 0; i < n; i += 1) {
    const ang = 2 * Math.PI * rng();
    const rad = Math.sqrt(rng());
    roots.push({ re: rad * Math.cos(ang), im: rad * Math.sin(ang) });
  }
  return roots;
}

function estimateRhoByGrid(roots, boxR, step, dirCount) {
  const pts = [];
  for (let x = -boxR; x <= boxR; x += step) {
    for (let y = -boxR; y <= boxR; y += step) {
      if (polyAbs(roots, { re: x, im: y }) < 1) pts.push({ x, y });
    }
  }
  if (pts.length === 0) return { rho: 0, points: 0 };

  let best = 0;
  for (const p of pts) {
    let rMin = Infinity;
    for (let t = 0; t < dirCount; t += 1) {
      const ang = (2 * Math.PI * t) / dirCount;
      let lo = 0;
      let hi = boxR * 2;
      for (let it = 0; it < 22; it += 1) {
        const mid = 0.5 * (lo + hi);
        const z = { re: p.x + mid * Math.cos(ang), im: p.y + mid * Math.sin(ang) };
        if (polyAbs(roots, z) < 1) lo = mid; else hi = mid;
      }
      if (lo < rMin) rMin = lo;
    }
    if (rMin > best) best = rMin;
  }
  return { rho: best, points: pts.length };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1039 ^ (depth * 65537));

  const rows = [];
  for (const n of [8, 12, 16, 20]) {
    const circ = rootsOnUnitCircle(n);
    const circEst = estimateRhoByGrid(circ, 1.6, 0.05, 48);

    let bestRandom = 0;
    let worstRandom = Infinity;
    const randomTrials = 60 * depth;
    for (let t = 0; t < randomTrials; t += 1) {
      const rr = randomRootsInUnitDisk(n, rng);
      const est = estimateRhoByGrid(rr, 1.6, 0.06, 36);
      if (est.rho > bestRandom) bestRandom = est.rho;
      if (est.rho < worstRandom) worstRandom = est.rho;
    }

    rows.push({
      n,
      circle_roots_rho_est: Number(circEst.rho.toFixed(8)),
      circle_roots_n_times_rho_est: Number((n * circEst.rho).toFixed(8)),
      random_trials: randomTrials,
      best_random_rho_est: Number(bestRandom.toFixed(8)),
      worst_random_rho_est: Number(worstRandom.toFixed(8)),
      best_random_n_times_rho_est: Number((n * bestRandom).toFixed(8)),
      worst_random_n_times_rho_est: Number((n * worstRandom).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1039',
    script: 'ep1039.mjs',
    method: 'deeper_grid_directional_inscribed_disc_radius_estimation_for_lemniscates',
    warning: 'Numerical radius estimates only; not certified exact extremal values.',
    params: { depth },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
