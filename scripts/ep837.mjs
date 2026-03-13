#!/usr/bin/env node
import fs from 'fs';

// EP-837 heuristic finite probe for jump-like behavior in 3-uniform setting.
// Not a proof of A_3 characterization.
const OUT = process.env.OUT || 'data/ep837_standalone_deeper.json';
const N = 80;
const SAMPLES = 140;
const M = 18;
const LOCAL_SAMPLES = 1000;
const P_LIST = [0.05, 0.08, 0.12, 0.16, 0.2, 0.25, 0.3];

function makeRng(seed = 837_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function buildRandom3Graph(n, p) {
  const E = [];
  let m = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        const on = rng() < p;
        E.push(on);
        if (on) m += 1;
      }
    }
  }
  return { n, E, m };
}

function index3(n, a, b, c) {
  let idx = 0;
  for (let i = 0; i < a; i += 1) {
    const rem = n - i - 1;
    idx += (rem * (rem - 1)) / 2;
  }
  for (let j = a + 1; j < b; j += 1) idx += n - j - 1;
  idx += c - b - 1;
  return idx;
}

function sampledLocalDensity(G, m, samples) {
  const n = G.n;
  const totalTriples = (m * (m - 1) * (m - 2)) / 6;
  const base = Array.from({ length: n }, (_, i) => i);
  let best = 1;
  for (let s = 0; s < samples; s += 1) {
    shuffle(base);
    const A = base.slice(0, m).sort((x, y) => x - y);
    let hit = 0;
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        for (let k = j + 1; k < m; k += 1) {
          if (G.E[index3(n, A[i], A[j], A[k])]) hit += 1;
        }
      }
    }
    const d = hit / totalTriples;
    if (d < best) best = d;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
for (const p of P_LIST) {
  let sumGlobal = 0;
  let sumMinLocal = 0;
  let bestGap = -1;
  for (let t = 0; t < SAMPLES; t += 1) {
    const G = buildRandom3Graph(N, p);
    const total = (N * (N - 1) * (N - 2)) / 6;
    const global = G.m / total;
    const minLocal = sampledLocalDensity(G, M, LOCAL_SAMPLES);
    const gap = global - minLocal;
    sumGlobal += global;
    sumMinLocal += minLocal;
    if (gap > bestGap) bestGap = gap;
  }
  rows.push({
    p_target: p,
    avg_global_density: Number((sumGlobal / SAMPLES).toPrecision(7)),
    avg_sampled_min_local_density_m18: Number((sumMinLocal / SAMPLES).toPrecision(7)),
    avg_gap_global_minus_local: Number(((sumGlobal - sumMinLocal) / SAMPLES).toPrecision(7)),
    max_gap_seen: Number(bestGap.toPrecision(7)),
  });
}

const out = {
  problem: 'EP-837',
  script: 'ep837.mjs',
  method: 'heuristic_random_3graph_local_density_gap_probe',
  warning: 'Heuristic random-model evidence only; not a characterization of A_3.',
  params: { N, SAMPLES, M, LOCAL_SAMPLES, P_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
