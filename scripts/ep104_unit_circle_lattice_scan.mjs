#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-104 finite construction signal:
// triangular-lattice hex patches where many lattice-centered unit circles
// contain >=3 selected points.

const RADII = (process.env.RADII || '5,8,12,16,20,24,28').split(',').map((x) => Number(x.trim())).filter((x) => x >= 1);

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
];

function key(a, b) {
  return `${a},${b}`;
}

function hexPatch(R) {
  const pts = [];
  for (let a = -R; a <= R; a++) {
    for (let b = -R; b <= R; b++) {
      const c = -a - b;
      if (Math.max(Math.abs(a), Math.abs(b), Math.abs(c)) <= R) pts.push([a, b]);
    }
  }
  return pts;
}

const rows = [];
for (const R of RADII) {
  const pts = hexPatch(R);
  const set = new Set(pts.map(([a, b]) => key(a, b)));

  let circlesAtLeast3 = 0;
  let circlesAtLeast4 = 0;
  let circlesExactly6 = 0;

  for (const [a, b] of pts) {
    let cnt = 0;
    for (const [da, db] of DIRS) {
      if (set.has(key(a + da, b + db))) cnt++;
    }
    if (cnt >= 3) circlesAtLeast3++;
    if (cnt >= 4) circlesAtLeast4++;
    if (cnt === 6) circlesExactly6++;
  }

  const n = pts.length;
  rows.push({
    R,
    n_points: n,
    lattice_centered_unit_circles_with_at_least_3_points: circlesAtLeast3,
    lattice_centered_unit_circles_with_at_least_4_points: circlesAtLeast4,
    lattice_centered_unit_circles_with_exactly_6_points: circlesExactly6,
    ratio_circles3_over_n: Number((circlesAtLeast3 / n).toFixed(6)),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  model: 'triangular_lattice_hex_patch_lattice_centered_unit_circles',
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep104_unit_circle_lattice_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
