#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const INSTANCE_SCALE = Number(process.env.INSTANCE_SCALE || 1);
const RESTART_SCALE = Number(process.env.RESTART_SCALE || 1);

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

function samplePartition(total, k, rng) {
  const cuts = [0, total];
  for (let i = 0; i < k - 1; i += 1) cuts.push(rng() * total);
  cuts.sort((a, b) => a - b);
  const out = [];
  for (let i = 1; i < cuts.length; i += 1) out.push(cuts[i] - cuts[i - 1]);
  return out;
}

function buildClosedIntervalFamily(m, maxMeasure, components, rng) {
  const fam = [];
  for (let i = 0; i < m; i += 1) {
    const total = maxMeasure * (0.65 + 0.35 * rng());
    const lens = samplePartition(total, components, rng);
    const intervals = [];
    for (const len of lens) {
      const a = rng();
      let b = a + len;
      if (b <= 1) intervals.push([a, b]);
      else {
        b -= 1;
        intervals.push([a, 1]);
        intervals.push([0, b]);
      }
    }
    fam.push(intervals);
  }
  return fam;
}

function inClosedIntervals(x, intervals) {
  for (const [a, b] of intervals) {
    if (x >= a && x <= b) return true;
  }
  return false;
}

function buildConflictAdj(m, family) {
  const pts = Array.from({ length: m }, (_, i) => (i + 0.5) / m);
  const adj = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      const ij = inClosedIntervals(pts[j], family[i]);
      const ji = inClosedIntervals(pts[i], family[j]);
      if (ij || ji) {
        adj[i][j] = 1;
        adj[j][i] = 1;
      }
    }
  }
  return adj;
}

function greedyIndependentLowerBound(adj, restarts, rng) {
  const n = adj.length;
  let best = 0;
  for (let t = 0; t < restarts; t += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    shuffle(ord, rng);
    const chosen = [];
    for (const v of ord) {
      let ok = true;
      for (const u of chosen) {
        if (adj[v][u]) {
          ok = false;
          break;
        }
      }
      if (ok) chosen.push(v);
    }
    if (chosen.length > best) best = chosen.length;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 501);
const tasks = [
  { m: 80, maxMeasure: 0.75, components: 3, instances: 120, restarts: 70 },
  { m: 120, maxMeasure: 0.8, components: 3, instances: 90, restarts: 70 },
  { m: 160, maxMeasure: 0.85, components: 4, instances: 70, restarts: 80 },
];

const rows = [];
for (const task of tasks) {
  const instances = Math.max(1, Math.floor(task.instances * INSTANCE_SCALE));
  const restarts = Math.max(1, Math.floor(task.restarts * RESTART_SCALE));
  let sumBest = 0;
  let minBest = Infinity;
  let maxBest = 0;
  let countAtLeast3 = 0;

  for (let it = 0; it < instances; it += 1) {
    const fam = buildClosedIntervalFamily(task.m, task.maxMeasure, task.components, rng);
    const adj = buildConflictAdj(task.m, fam);
    const best = greedyIndependentLowerBound(adj, restarts, rng);

    sumBest += best;
    if (best < minBest) minBest = best;
    if (best > maxBest) maxBest = best;
    if (best >= 3) countAtLeast3 += 1;
  }

  rows.push({
    m: task.m,
    max_measure_per_set: task.maxMeasure,
    components: task.components,
    instances,
    greedy_restarts: restarts,
    min_independent_set_found: minBest,
    mean_independent_set_found: Number((sumBest / instances).toPrecision(8)),
    max_independent_set_found: maxBest,
    fraction_instances_with_independent_set_at_least_3: Number((countAtLeast3 / instances).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-501',
  script: path.basename(process.argv[1]),
  method: 'finite_closed_case_proxy_random_interval_families_with_independence_search',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
