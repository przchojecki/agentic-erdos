#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePhiSpf(n) {
  const spf = new Int32Array(n + 1);
  const phi = new Int32Array(n + 1);
  phi[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      phi[i] = i - 1;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
    if (!phi[i]) {
      const p = spf[i];
      const m = Math.floor(i / p);
      phi[i] = m % p === 0 ? phi[m] * p : phi[m] * (p - 1);
    }
  }
  return { phi, spf };
}

const N = Number(process.env.N || 1000000);
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,300000,600000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const { phi, spf } = sievePhiSpf(N);

function isPrime(n) {
  return n >= 2 && spf[n] === n;
}

const memoSteps = new Int32Array(N + 1);
const memoPrime = new Int32Array(N + 1);
memoSteps.fill(-1);

function solve(n) {
  if (memoSteps[n] >= 0) return [memoSteps[n], memoPrime[n]];
  const path = [];
  let x = n;
  while (true) {
    if (memoSteps[x] >= 0) break;
    path.push(x);
    if (isPrime(x)) {
      memoSteps[x] = 0;
      memoPrime[x] = x;
      break;
    }
    x = phi[x] + 1;
  }
  let st = memoSteps[x];
  const p = memoPrime[x];
  for (let i = path.length - 1; i >= 0; i -= 1) {
    st += 1;
    memoSteps[path[i]] = st;
    memoPrime[path[i]] = p;
  }
  return [memoSteps[n], memoPrime[n]];
}

const rows = [];
const mset = new Set(MILESTONES);
const basin = new Map();
let sumF = 0;
let maxF = 0;
let argMax = 1;

for (let n = 1; n <= N; n += 1) {
  const [steps, p] = solve(n);
  const f = isPrime(n) ? 0 : steps;
  sumF += f;
  if (f > maxF) {
    maxF = f;
    argMax = n;
  }
  basin.set(p, (basin.get(p) || 0) + 1);

  if (mset.has(n)) {
    const c2 = basin.get(2) || 0;
    const c3 = basin.get(3) || 0;
    const c5 = basin.get(5) || 0;
    const c7 = basin.get(7) || 0;
    rows.push({
      X: n,
      mean_iterations_to_prime: Number((sumF / n).toPrecision(8)),
      max_iterations_up_to_X: maxF,
      argmax_n: argMax,
      density_reaching_2: Number((c2 / n).toPrecision(7)),
      density_reaching_3: Number((c3 / n).toPrecision(7)),
      density_reaching_5: Number((c5 / n).toPrecision(7)),
      density_reaching_7: Number((c7 / n).toPrecision(7)),
    });
  }
}

const topBasins = [...basin.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([prime, count]) => ({ prime, count, density: Number((count / N).toPrecision(7)) }));

const out = {
  problem: 'EP-409',
  script: path.basename(process.argv[1]),
  method: 'deep_iteration_profile_for_T_n_eq_phi_n_plus_1',
  params: { N, MILESTONES },
  rows,
  top_terminal_prime_basins: topBasins,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
