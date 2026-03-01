#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const K_LIST = (process.env.K_LIST || '2,3,4,5').split(',').map((x) => Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 200);

function buildEdges(m) {
  const edges = [];
  for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) edges.push([i, j]);
  return edges;
}

function idx(m, i, j) {
  if (i > j) [i, j] = [j, i];
  return i * m + j;
}

function monoC4Count(m, k, color) {
  let total = 0;
  for (let c = 0; c < k; c++) {
    for (let u = 0; u < m; u++) {
      for (let v = u + 1; v < m; v++) {
        let common = 0;
        for (let w = 0; w < m; w++) {
          if (w === u || w === v) continue;
          if (color[idx(m, u, w)] === c && color[idx(m, v, w)] === c) common++;
        }
        total += (common * (common - 1)) / 2;
      }
    }
  }
  return total / 2; // each C4 counted twice (diagonals)
}

const rows = [];

for (const k of K_LIST) {
  let bestM = 0;
  const checked = [];
  const mStart = Math.max(4, k * k - k - 1);
  const mEnd = k * k + k + 3;

  for (let m = mStart; m <= mEnd; m++) {
    const edges = buildEdges(m);
    let foundNoC4 = false;
    let bestObj = Infinity;

    for (let t = 0; t < TRIALS; t++) {
      const color = new Int16Array(m * m);
      for (const [u, v] of edges) color[idx(m, u, v)] = Math.floor(Math.random() * k);
      const obj = monoC4Count(m, k, color);
      if (obj < bestObj) bestObj = obj;
      if (obj === 0) {
        foundNoC4 = true;
        break;
      }
    }

    checked.push({ m, found_no_mono_c4: foundNoC4, best_objective_seen: bestObj });
    if (foundNoC4) bestM = Math.max(bestM, m);
  }

  rows.push({ k, trials_per_m: TRIALS, best_random_lower_bound_m_plus1: bestM + 1, checked });
}

const out = {
  script: path.basename(process.argv[1]),
  k_list: K_LIST,
  trials_per_m: TRIALS,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep555_c4_multicolor_random_lb.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, ks: K_LIST, trials: TRIALS }, null, 2));
