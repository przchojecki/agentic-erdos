#!/usr/bin/env node

// EP-1083 deep standalone computation:
// Distinct-distance counts for large lattice boxes in R^3,
// with repeated exact passes for stability at heavier compute depth.

function distinctSquaredDistances(ax, ay, az) {
  const maxS = (ax - 1) * (ax - 1) + (ay - 1) * (ay - 1) + (az - 1) * (az - 1);
  const seen = new Uint8Array(maxS + 1);
  let cnt = 0;

  for (let dx = 0; dx < ax; dx += 1) {
    const dx2 = dx * dx;
    for (let dy = 0; dy < ay; dy += 1) {
      const dxy2 = dx2 + dy * dy;
      for (let dz = 0; dz < az; dz += 1) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        const s = dxy2 + dz * dz;
        if (!seen[s]) {
          seen[s] = 1;
          cnt += 1;
        }
      }
    }
  }

  return cnt;
}

function round10(x) {
  return Number(x.toFixed(10));
}

function runFamily(name, boxes, passesPerBox) {
  const rows = [];
  for (const [ax, ay, az] of boxes) {
    const n = ax * ay * az;
    let m = -1;
    let stable = true;
    let totalBoxMs = 0;

    for (let pass = 0; pass < passesPerBox; pass += 1) {
      const t0 = Date.now();
      const cur = distinctSquaredDistances(ax, ay, az);
      totalBoxMs += Date.now() - t0;
      if (m < 0) m = cur;
      else if (cur !== m) stable = false;
    }

    const n23 = Math.pow(n, 2 / 3);
    rows.push({
      family: name,
      ax,
      ay,
      az,
      n,
      distinct_distances_count: m,
      n_to_2_over_3: round10(n23),
      ratio_m_over_n_2_over_3: round10(m / n23),
      passes_per_box: passesPerBox,
      stable_across_passes: stable,
      elapsed_ms_for_box_all_passes: totalBoxMs,
      avg_ms_per_pass: round10(totalBoxMs / passesPerBox),
    });
  }
  return rows;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const tList =
    depth >= 4
      ? [100, 150, 200, 250, 300, 350, 400, 450, 500]
      : depth >= 2
        ? [60, 80, 100, 120, 140, 160, 180, 200]
        : [30, 40, 50, 60, 80, 100, 120];

  const passesPerBox = depth >= 4 ? 10 : depth >= 2 ? 4 : 2;

  const cubeBoxes = tList.map((t) => [t, t, t]);
  const slabBoxes = tList.map((t) => [t, t, 2 * t]);

  const rows = [
    ...runFamily('cube_t_t_t', cubeBoxes, passesPerBox),
    ...runFamily('slab_t_t_2t', slabBoxes, passesPerBox),
  ];

  const payload = {
    problem: 'EP-1083',
    script: 'ep1083.mjs',
    method: 'deep_large_lattice_box_distinct_distance_profiles_with_repeated_exact_passes',
    warning: 'Finite construction-side evidence only; does not prove lower/upper asymptotics.',
    params: {
      depth,
      tList,
      families: ['cube_t_t_t', 'slab_t_t_2t'],
      passesPerBox,
    },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
