#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-741 finite heuristic:
// random A with dense A+A, then random bipartitions A=A1 U A2 and check
// whether both A1+A1 and A2+A2 keep positive finite-window density.

const N = Number(process.env.N || 1200);
const DENSITIES = (process.env.DENSITIES || '0.10,0.15,0.20,0.30')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x > 0 && x < 1);
const INSTANCES = Number(process.env.INSTANCES || 30);
const PARTITIONS = Number(process.env.PARTITIONS || 500);
const SEED0 = Number(process.env.SEED || 741777);

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomSubset(n, p, rng) {
  const out = [];
  for (let i = 1; i <= n; i++) if (rng() < p) out.push(i);
  return out;
}

function sumDensity(A, n) {
  const hit = new Uint8Array(2 * n + 1);
  for (let i = 0; i < A.length; i++) {
    const ai = A[i];
    for (let j = i; j < A.length; j++) hit[ai + A[j]] = 1;
  }
  let cnt = 0;
  for (let s = 2; s <= 2 * n; s++) cnt += hit[s];
  return cnt / (2 * n - 1);
}

function partitionDensity(A, n, rng) {
  const A1 = [];
  const A2 = [];
  for (const x of A) {
    if (rng() < 0.5) A1.push(x);
    else A2.push(x);
  }
  if (A1.length === 0 || A2.length === 0) return { d1: 0, d2: 0 };
  return { d1: sumDensity(A1, n), d2: sumDensity(A2, n) };
}

const rows = [];
for (let di = 0; di < DENSITIES.length; di++) {
  const p = DENSITIES[di];
  const rng = makeRng(SEED0 + 104729 * (di + 1));
  let accepted = 0;
  let bothPositiveFound = 0;
  let avgBestMin = 0;
  let avgBaseDensity = 0;

  for (let t = 0; t < INSTANCES; t++) {
    const A = randomSubset(N, p, rng);
    if (A.length < 5) continue;
    const base = sumDensity(A, N);
    if (base <= 0) continue;

    accepted++;
    avgBaseDensity += base;

    let bestMin = 0;
    for (let r = 0; r < PARTITIONS; r++) {
      const { d1, d2 } = partitionDensity(A, N, rng);
      const m = Math.min(d1, d2);
      if (m > bestMin) bestMin = m;
    }
    avgBestMin += bestMin;
    if (bestMin > 0) bothPositiveFound++;
  }

  rows.push({
    p,
    n: N,
    instances: INSTANCES,
    partitions_per_instance: PARTITIONS,
    accepted_instances: accepted,
    both_positive_found_count: bothPositiveFound,
    avg_base_sumset_density: accepted ? Number((avgBaseDensity / accepted).toFixed(6)) : 0,
    avg_best_min_partition_density: accepted ? Number((avgBestMin / accepted).toFixed(6)) : 0,
  });
}

const out = {
  script: path.basename(process.argv[1]),
  n: N,
  densities: DENSITIES,
  instances: INSTANCES,
  partitions: PARTITIONS,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep741_partition_density_random.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
