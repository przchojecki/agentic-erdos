#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const TRIAL_SCALE = Number(process.env.TRIAL_SCALE || 1);

function choose3(n) {
  return (n * (n - 1) * (n - 2)) / 6;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

function triplesOfN(n) {
  const triples = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) triples.push([i, j, k]);
    }
  }
  return triples;
}

function containList(n, triples) {
  const keyToEdge = new Map();
  for (let i = 0; i < triples.length; i += 1) {
    const [a, b, c] = triples[i];
    keyToEdge.set(`${a},${b},${c}`, i);
  }

  const contain = Array.from({ length: triples.length }, () => []);
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        for (let d = c + 1; d < n; d += 1) {
          const edges = [
            keyToEdge.get(`${a},${b},${c}`),
            keyToEdge.get(`${a},${b},${d}`),
            keyToEdge.get(`${a},${c},${d}`),
            keyToEdge.get(`${b},${c},${d}`),
          ];
          for (const e of edges) contain[e].push([a, b, c, d]);
        }
      }
    }
  }
  return contain;
}

function greedyK4freeBest(n, trials, rng) {
  const triples = triplesOfN(n);
  const E = triples.length;
  const contain = containList(n, triples);

  const mapKey = new Map();
  for (let i = 0; i < triples.length; i += 1) mapKey.set(triples[i].join(','), i);

  const fours = [];
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        for (let d = c + 1; d < n; d += 1) fours.push([a, b, c, d]);
      }
    }
  }

  const foursIndex = new Map();
  for (let i = 0; i < fours.length; i += 1) foursIndex.set(fours[i].join(','), i);

  const containIdx = contain.map((arr) => arr.map((x) => foursIndex.get(x.join(','))));

  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const ord = Array.from({ length: E }, (_, i) => i);
    shuffle(ord, rng);

    const cnt4 = new Uint8Array(fours.length);
    let kept = 0;
    for (const e of ord) {
      let ok = true;
      for (const fi of containIdx[e]) {
        if (cnt4[fi] >= 3) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      kept += 1;
      for (const fi of containIdx[e]) cnt4[fi] += 1;
    }
    if (kept > best) best = kept;
  }

  return { edges_total: E, best_edges_found: best, best_density: best / E };
}

function turanConstructionDensity(n) {
  const s = [Math.floor(n / 3), Math.floor((n + 1) / 3), Math.floor((n + 2) / 3)];
  s.sort((a, b) => b - a);
  const [a, b, c] = s;
  let e = a * b * c;
  e += choose2(a) * b;
  e += choose2(b) * c;
  e += choose2(c) * a;
  return e / choose3(n);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 500);
const tasks = [
  { n: 20, trials: 1200 },
  { n: 24, trials: 900 },
  { n: 28, trials: 700 },
  { n: 32, trials: 500 },
];

const rows = [];
for (const task of tasks) {
  const effectiveTrials = Math.max(1, Math.floor(task.trials * TRIAL_SCALE));
  const g = greedyK4freeBest(task.n, effectiveTrials, rng);
  const td = turanConstructionDensity(task.n);
  rows.push({
    n: task.n,
    trials: effectiveTrials,
    best_random_greedy_edges: g.best_edges_found,
    total_edges: g.edges_total,
    best_random_greedy_density: Number(g.best_density.toPrecision(8)),
    turan_construction_density: Number(td.toPrecision(8)),
    density_gap_turan_minus_greedy: Number((td - g.best_density).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-500',
  script: path.basename(process.argv[1]),
  method: 'deep_randomized_greedy_profile_for_ex3_n_K4_3',
  params: {
    tasks,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
