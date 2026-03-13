#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '120,180,240,320').split(',').map((x) => Number(x.trim())).filter(Boolean);
const R_LIST = (process.env.R_LIST || '3,4,5').split(',').map((x) => Number(x.trim())).filter(Boolean);
const STEPS = Number(process.env.STEPS || 50000);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}
const rng = makeRng(20260313 ^ 749);

function evalSet(A, N, Rcap) {
  const arr = [...A].sort((a, b) => a - b);
  const rep = Array(2 * N + 1).fill(0);
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i; j < arr.length; j += 1) {
      const s = arr[i] + arr[j];
      rep[s] += 1;
      if (rep[s] > Rcap) return null;
    }
  }
  let covered = 0;
  for (let s = 0; s <= 2 * N; s += 1) if (rep[s] > 0) covered += 1;
  return { density: covered / (2 * N + 1), maxRep: Math.max(...rep), sizeA: arr.length };
}

function optimize(N, Rcap, steps) {
  const A = new Set([0]);
  let best = evalSet(A, N, Rcap);
  let bestA = new Set(A);

  for (let t = 0; t < steps; t += 1) {
    const add = rng() < 0.6 || A.size <= 2;
    let x = Math.floor(rng() * (N + 1));
    if (add) A.add(x);
    else if (A.size > 1) {
      const v = [...A][Math.floor(rng() * A.size)];
      if (v !== 0) A.delete(v);
    }

    const cur = evalSet(A, N, Rcap);
    if (cur == null || cur.density + 1e-12 < best.density - 0.0005) {
      // revert probabilistically to avoid strict hill-climb traps
      if (add) A.delete(x);
      else A.add(x);
    } else {
      if (cur.density > best.density || (Math.abs(cur.density - best.density) < 1e-12 && cur.sizeA < best.sizeA)) {
        best = cur;
        bestA = new Set(A);
      }
    }
  }

  const final = evalSet(bestA, N, Rcap);
  return { ...final, A_size: bestA.size };
}

const t0 = Date.now();
const rows = [];
for (const Rcap of R_LIST) {
  for (const N of N_LIST) {
    const res = optimize(N, Rcap, STEPS);
    rows.push({
      N,
      representation_cap_R: Rcap,
      steps: STEPS,
      best_sumset_density_over_0_to_2N: Number(res.density.toPrecision(8)),
      max_representation_seen: res.maxRep,
      A_size: res.A_size,
    });
  }
}

const out = {
  problem: 'EP-749',
  script: path.basename(process.argv[1]),
  method: 'local_search_for_dense_sumset_under_bounded_representation_cap',
  warning: 'Finite heuristic optimization only; not an asymptotic existence proof.',
  params: { N_LIST, R_LIST, STEPS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
