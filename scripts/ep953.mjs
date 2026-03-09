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

function buildPoints(R, q) {
  const L = Math.floor(R * q);
  const pts = [];
  for (let x = -L; x <= L; x += 1) {
    for (let y = -L; y <= L; y += 1) {
      if (x * x + y * y < L * L) pts.push([x, y]);
    }
  }
  return { pts, L };
}

function buildForbiddenVectors(maxK, q) {
  const vectors = [];
  for (let k = 1; k <= maxK; k += 1) {
    const t2 = (k * q) * (k * q);
    const lim = Math.floor(Math.sqrt(t2));
    for (let dx = -lim; dx <= lim; dx += 1) {
      const rem = t2 - dx * dx;
      if (rem < 0) continue;
      const dy = Math.floor(Math.sqrt(rem));
      if (dy * dy !== rem) continue;
      if (dx === 0 && dy === 0) continue;
      vectors.push([dx, dy]);
      if (dy !== 0) vectors.push([dx, -dy]);
    }
  }

  const seen = new Set();
  const uniq = [];
  for (const [dx, dy] of vectors) {
    const key = `${dx},${dy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push([dx, dy]);
  }
  return uniq;
}

function greedyIndependentSet(pts, forbidden, rng) {
  const n = pts.length;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }

  const selected = new Set();
  const selectedPts = [];

  for (let ii = 0; ii < n; ii += 1) {
    const i = order[ii];
    const [x, y] = pts[i];
    let bad = false;
    for (let j = 0; j < forbidden.length; j += 1) {
      const [dx, dy] = forbidden[j];
      if (selected.has(`${x + dx},${y + dy}`)) {
        bad = true;
        break;
      }
    }
    if (!bad) {
      selected.add(`${x},${y}`);
      selectedPts.push([x, y]);
    }
  }

  return selectedPts;
}

function main() {
  const seed = Number(process.env.SEED || process.argv[2] || 20260307);
  const configs = (process.env.CONFIGS || process.argv[3] || '4:8:30,6:8:25,8:8:20')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const [R, q, rounds] = entry.split(':').map((x) => Number(x));
      return { R, q, rounds };
    })
    .filter((c) => Number.isFinite(c.R) && Number.isFinite(c.q) && Number.isFinite(c.rounds));

  const rng = makeRng(seed >>> 0);
  const rows = [];

  for (const cfg of configs) {
    const { pts, L } = buildPoints(cfg.R, cfg.q);
    const maxK = Math.floor((2 * L) / cfg.q);
    const forbidden = buildForbiddenVectors(maxK, cfg.q);

    let best = [];
    let sum = 0;

    for (let r = 0; r < cfg.rounds; r += 1) {
      const cand = greedyIndependentSet(pts, forbidden, rng);
      sum += cand.length;
      if (cand.length > best.length) best = cand;
      if ((r + 1) % Math.max(1, Math.floor(cfg.rounds / 5)) === 0) {
        process.stderr.write(`R=${cfg.R},q=${cfg.q}, round=${r + 1}/${cfg.rounds}, best=${best.length}\n`);
      }
    }

    rows.push({
      R: cfg.R,
      q: cfg.q,
      rounds: cfg.rounds,
      grid_radius: L,
      point_count: pts.length,
      forbidden_vector_count: forbidden.length,
      best_independent_set_size: best.length,
      avg_independent_set_size: Number((sum / cfg.rounds).toPrecision(8)),
      scaled_area_lower_bound_estimate: Number((best.length / (cfg.q * cfg.q)).toPrecision(8)),
      selected_density_in_grid: Number((best.length / pts.length).toPrecision(8)),
    });
  }

  const out = {
    problem: 'EP-953',
    method: 'standalone_lattice_discretization_greedy_lower_bound_search_for_integer_distance_avoiding_sets',
    params: { seed, configs },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
