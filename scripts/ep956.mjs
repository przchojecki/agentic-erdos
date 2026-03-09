#!/usr/bin/env node

function hexDistance(q, s) {
  const t = -q - s;
  return Math.max(Math.abs(q), Math.abs(s), Math.abs(t));
}

function hexBallOrdered(limitR) {
  const out = [];
  for (let q = -limitR; q <= limitR; q += 1) {
    const sMin = Math.max(-limitR, -q - limitR);
    const sMax = Math.min(limitR, -q + limitR);
    for (let s = sMin; s <= sMax; s += 1) {
      out.push([q, s]);
    }
  }

  out.sort((a, b) => {
    const da = hexDistance(a[0], a[1]);
    const db = hexDistance(b[0], b[1]);
    if (da !== db) return da - db;
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  return out;
}

function requiredRadiusForN(n) {
  let r = 0;
  let cnt = 1;
  while (cnt < n) {
    r += 1;
    cnt += 6 * r;
  }
  return r;
}

function countDistance2Pairs(points) {
  const set = new Set(points.map(([q, s]) => `${q},${s}`));
  const vecs = [
    [2, 0], [0, 2], [-2, 2], [-2, 0], [0, -2], [2, -2],
    [1, 1], [-1, 2], [-2, 1], [-1, -1], [1, -2], [2, -1],
  ];

  let cnt = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [q, s] = points[i];
    for (let j = 0; j < vecs.length; j += 1) {
      const [dq, ds] = vecs[j];
      if (set.has(`${q + dq},${s + ds}`)) cnt += 1;
    }
  }
  return Math.floor(cnt / 2);
}

function toEuclidean(q, s) {
  const x = q + 0.5 * s;
  const y = (Math.sqrt(3) / 2) * s;
  return [x, y];
}

function minPairDistance(points) {
  const n = points.length;
  let best = Infinity;
  for (let i = 0; i < n; i += 1) {
    const [x1, y1] = toEuclidean(points[i][0], points[i][1]);
    for (let j = i + 1; j < n; j += 1) {
      const [x2, y2] = toEuclidean(points[j][0], points[j][1]);
      const dx = x1 - x2;
      const dy = y1 - y2;
      const d2 = dx * dx + dy * dy;
      if (d2 < best) best = d2;
    }
  }
  return Math.sqrt(best);
}

function main() {
  const nList = (process.env.N_LIST || process.argv[2] || '500,1000,2000,4000,8000,16000')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 3)
    .sort((a, b) => a - b);

  const maxN = Math.max(...nList);
  const R = requiredRadiusForN(maxN);
  const ordered = hexBallOrdered(R);

  const rows = [];
  for (const n of nList) {
    const pts = ordered.slice(0, n);
    const m = countDistance2Pairs(pts);
    const mind = minPairDistance(pts);
    rows.push({
      n,
      pairs_distance_2: m,
      ratio_over_n: Number((m / n).toPrecision(8)),
      min_pair_distance: Number(mind.toPrecision(8)),
    });
    process.stderr.write(`n=${n}, pairs@dist2=${m}, ratio=${(m / n).toFixed(4)}\n`);
  }

  const out = {
    problem: 'EP-956',
    method: 'standalone_hex_lattice_translate_pair_count_distance_2',
    params: {
      n_list: nList,
      construction: 'spiral_prefix_of_triangular_lattice',
    },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
