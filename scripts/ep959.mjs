#!/usr/bin/env node

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function distGap(points) {
  const mp = new Map();
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < points.length; j += 1) {
      const [x2, y2] = points[j];
      const dx = x1 - x2;
      const dy = y1 - y2;
      const d2 = dx * dx + dy * dy;
      mp.set(d2, (mp.get(d2) || 0) + 1);
    }
  }

  const vals = Array.from(mp.values()).sort((a, b) => b - a);
  const f1 = vals.length ? vals[0] : 0;
  const f2 = vals.length > 1 ? vals[1] : 0;
  return { f1, f2, gap: f1 - f2, distinct_distances: vals.length };
}

function gridPoints(n) {
  const w = Math.floor(Math.sqrt(n));
  const h = Math.ceil(n / w);
  const pts = [];
  for (let y = 0; y < h && pts.length < n; y += 1) {
    for (let x = 0; x < w && pts.length < n; x += 1) pts.push([x, y]);
  }
  return pts;
}

function twoLines(n) {
  const a = Math.floor(n / 2);
  const b = n - a;
  const pts = [];
  for (let i = 0; i < a; i += 1) pts.push([i, 0]);
  for (let j = 0; j < b; j += 1) pts.push([j, 1]);
  return pts;
}

function parabolaPoints(n) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([i, i * i]);
  return pts;
}

function randomPoints(n, side, rng) {
  const pts = [];
  const seen = new Set();
  while (pts.length < n) {
    const x = Math.floor(rng() * side);
    const y = Math.floor(rng() * side);
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pts.push([x, y]);
  }
  return pts;
}

function main() {
  const seed = Number(process.env.SEED || process.argv[2] || 20260307);
  const trials = Number(process.env.TRIALS || process.argv[3] || 1200);
  const nList = (process.env.N_LIST || process.argv[4] || '120,180,240,300')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 20);

  const rng = makeRng(seed >>> 0);
  const rows = [];

  for (const n of nList) {
    let best = { gap: -1, family: 'none', f1: 0, f2: 0, distinct_distances: 0 };

    const candidates = [
      ['grid', gridPoints(n)],
      ['two_lines', twoLines(n)],
      ['parabola', parabolaPoints(n)],
    ];

    for (const [fam, pts] of candidates) {
      const r = distGap(pts);
      if (r.gap > best.gap) best = { ...r, family: fam };
    }

    for (let t = 0; t < trials; t += 1) {
      const pts = randomPoints(n, 8 * n, rng);
      const r = distGap(pts);
      if (r.gap > best.gap) best = { ...r, family: 'random' };
      if ((t + 1) % Math.max(1, Math.floor(trials / 4)) === 0) {
        process.stderr.write(`n=${n}, random trial ${t + 1}/${trials}, current best gap=${best.gap}\n`);
      }
    }

    rows.push({
      n,
      trials_random: trials,
      best_family_found: best.family,
      best_gap_f1_minus_f2: best.gap,
      f1: best.f1,
      f2: best.f2,
      best_gap_over_n_log_n: Number((best.gap / (n * Math.log(n))).toPrecision(8)),
      distinct_distances_in_best: best.distinct_distances,
    });
  }

  const out = {
    problem: 'EP-959',
    method: 'standalone_deep_search_for_large_distance_multiplicity_gap',
    params: { seed, trials, n_list: nList },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
