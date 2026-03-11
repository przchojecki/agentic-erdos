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

function cis(t) {
  return [Math.cos(t), Math.sin(t)];
}

function csub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

function cabs(a) {
  return Math.hypot(a[0], a[1]);
}

function evalMn(zs, grid) {
  let M = 0;
  for (let g = 0; g < grid; g += 1) {
    const z = cis((2 * Math.PI * g) / grid);
    let p = [1, 0];
    for (const zi of zs) p = cmul(p, csub(z, zi));
    const v = cabs(p);
    if (v > M) M = v;
  }
  return M;
}

function sequenceRandom(nMax, rng) {
  const zs = [];
  for (let n = 1; n <= nMax; n += 1) zs.push(cis(2 * Math.PI * rng()));
  return zs;
}

function sequenceRootsOfUnity(nMax) {
  const zs = [];
  for (let n = 1; n <= nMax; n += 1) zs.push(cis((2 * Math.PI * (n - 1)) / nMax));
  return zs;
}

function sequenceGreedyMinCurrentMn(nMax, gridCandidate = 720, gridEval = 720) {
  const zs = [];
  for (let n = 1; n <= nMax; n += 1) {
    let best = null;
    for (let g = 0; g < gridCandidate; g += 1) {
      const cand = cis((2 * Math.PI * g) / gridCandidate);
      const mn = evalMn([...zs, cand], gridEval);
      if (!best || mn < best.mn) best = { cand, mn };
    }
    zs.push(best.cand);
  }
  return zs;
}

function profile(name, zs, nList, grid) {
  let pref = [];
  const rows = [];
  let sum = 0;
  for (let n = 1; n <= Math.max(...nList); n += 1) {
    pref.push(zs[n - 1]);
    const mn = evalMn(pref, grid);
    sum += mn;
    if (nList.includes(n)) {
      rows.push({
        n,
        M_n: Number(mn.toFixed(6)),
        sum_M_up_to_n: Number(sum.toFixed(6)),
      });
    }
  }
  return { sequence: name, rows };
}

const N_LIST = (process.env.N_LIST || '10,20,30,40').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const GRID = Number(process.env.GRID || 720);
const SEED = Number(process.env.SEED || 11902026);
const OUT = process.env.OUT || '';

const nMax = Math.max(...N_LIST);
const rng = makeRng(SEED);
const zsRandom = sequenceRandom(nMax, rng);
const zsRoots = sequenceRootsOfUnity(nMax);
const zsGreedy = sequenceGreedyMinCurrentMn(nMax, 360, GRID);

const rows = [
  profile('random_uniform_angles', zsRandom, N_LIST, GRID),
  profile('equally_spaced_angles_fixed_final_n', zsRoots, N_LIST, GRID),
  profile('greedy_minimize_current_M_n', zsGreedy, N_LIST, GRID),
];

const out = {
  problem: 'EP-119',
  script: path.basename(process.argv[1]),
  method: 'unit_circle_polynomial_max_modulus_growth_profiles',
  params: { N_LIST, GRID, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
