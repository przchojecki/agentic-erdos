#!/usr/bin/env node

// EP-1084 deep standalone computation:
// Construction-side lower bounds for f_3(n) via finite FCC parity blocks.
// We count unit-distance contacts exactly in induced boxes and track
// deficit 6n - E against n^(2/3), with repeated passes for stability.

function buildFCCBox(L) {
  const pts = [];
  const id = new Map();
  for (let x = 0; x < L; x += 1) {
    for (let y = 0; y < L; y += 1) {
      for (let z = 0; z < L; z += 1) {
        if (((x + y + z) & 1) !== 0) continue;
        const idx = pts.length;
        pts.push([x, y, z]);
        id.set(`${x},${y},${z}`, idx);
      }
    }
  }
  return { pts, id };
}

function fccNeighbors() {
  const out = [];
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      out.push([a, b, 0]);
      out.push([a, 0, b]);
      out.push([0, a, b]);
    }
  }
  return out;
}

function countContactsFCC(L, neigh) {
  const { pts, id } = buildFCCBox(L);
  let edges2 = 0;
  for (const [x, y, z] of pts) {
    for (const [dx, dy, dz] of neigh) {
      const key = `${x + dx},${y + dy},${z + dz}`;
      if (id.has(key)) edges2 += 1;
    }
  }
  return { n: pts.length, contacts: Math.floor(edges2 / 2) };
}

function round10(x) {
  return Number(x.toFixed(10));
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const LList =
    depth >= 4
      ? [20, 30, 40, 50, 60, 80, 100, 120, 140, 160, 180, 200, 220]
      : depth >= 2
        ? [12, 16, 20, 24, 30, 36, 44, 52, 60, 72, 84, 96, 108]
        : [8, 10, 12, 16, 20, 24, 30, 36, 42];

  const passes = depth >= 4 ? 8 : depth >= 2 ? 4 : 2;
  const neigh = fccNeighbors();

  const rows = [];
  for (const L of LList) {
    let n = -1;
    let c = -1;
    let stable = true;
    let ms = 0;

    for (let pass = 0; pass < passes; pass += 1) {
      const tPass = Date.now();
      const cur = countContactsFCC(L, neigh);
      ms += Date.now() - tPass;
      if (n < 0) {
        n = cur.n;
        c = cur.contacts;
      } else if (n !== cur.n || c !== cur.contacts) {
        stable = false;
      }
    }

    const deficit = 6 * n - c;
    const n23 = Math.pow(n, 2 / 3);

    rows.push({
      L,
      n_points: n,
      unit_distance_pairs: c,
      pairs_over_n: round10(c / n),
      deficit_from_6n: deficit,
      deficit_over_n_2_over_3: round10(deficit / n23),
      passes,
      stable_across_passes: stable,
      elapsed_ms_all_passes: ms,
      avg_ms_per_pass: round10(ms / passes),
    });
  }

  const payload = {
    problem: 'EP-1084',
    script: 'ep1084.mjs',
    method: 'deep_fcc_box_contact_count_profiles_with_repeated_exact_passes',
    warning: 'Construction-side finite evidence only; does not prove optimality or matching upper constants.',
    params: { depth, LList, passes },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
