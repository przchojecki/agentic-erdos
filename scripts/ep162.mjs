#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomColoring(n, rng) {
  const mat = Array.from({ length: n }, () => new Uint8Array(n)); // 0/1
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const c = rng() < 0.5 ? 0 : 1;
      mat[i][j] = mat[j][i] = c;
    }
  }
  return mat;
}

function FofColoring(mat, alpha) {
  const n = mat.length;
  const total = 1 << n;
  const badBySize = Array(n + 1).fill(false);

  for (let mask = 0; mask < total; mask += 1) {
    const k = mask.toString(2).replace(/0/g, '').length;
    if (k < 2) continue;
    let edges1 = 0;
    let edges = 0;
    for (let i = 0; i < n; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (!((mask >>> j) & 1)) continue;
        edges += 1;
        edges1 += mat[i][j];
      }
    }
    const need = alpha * edges;
    const edges0 = edges - edges1;
    if (edges0 <= need || edges1 <= need) badBySize[k] = true;
  }

  for (let K = n; K >= 2; K -= 1) {
    let ok = true;
    for (let s = K; s <= n; s += 1) if (badBySize[s]) {
      ok = false;
      break;
    }
    if (ok) return K;
  }
  return 1;
}

const N_LIST = (process.env.N_LIST || '10,12,14,16').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const ALPHAS = (process.env.ALPHAS || '0.2,0.25,0.3').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 260);
const SEED = Number(process.env.SEED || 16202026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const n of N_LIST) {
  for (const alpha of ALPHAS) {
    let best = 1;
    let avg = 0;
    for (let s = 0; s < SAMPLES; s += 1) {
      const mat = randomColoring(n, rng);
      const f = FofColoring(mat, alpha);
      avg += f;
      if (f > best) best = f;
    }
    rows.push({ n, alpha, samples: SAMPLES, best_F_found: best, avg_F: Number((avg / SAMPLES).toFixed(4)), best_over_log_n: Number((best / Math.log(n)).toFixed(4)) });
  }
}

const out = {
  problem: 'EP-162',
  script: path.basename(process.argv[1]),
  method: 'random_coloring_exact_subset_check_for_F_n_alpha',
  params: { N_LIST, ALPHAS, SAMPLES, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
