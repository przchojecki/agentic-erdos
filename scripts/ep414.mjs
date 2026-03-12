#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpfTau(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  const tau = new Int32Array(n + 1);
  tau[1] = 1;
  for (let x = 2; x <= n; x += 1) {
    let n0 = x;
    let ans = 1;
    while (n0 > 1) {
      const p = spf[n0];
      let e = 0;
      while (n0 % p === 0) {
        n0 = Math.floor(n0 / p);
        e += 1;
      }
      ans *= (e + 1);
    }
    tau[x] = ans;
  }
  return { spf, tau };
}

const N = Number(process.env.N || 120000);
const STEPS = Number(process.env.STEPS || 120);
const OUT = process.env.OUT || '';

const { tau } = sieveSpfTau(N + STEPS * 300);

function h(x) {
  return x + tau[x];
}

const parent = Array(N + 1).fill(0).map((_, i) => i);
function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
function uni(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent[rb] = ra; }

const firstHit = new Map();
const paths = [];
for (let n = 1; n <= N; n += 1) {
  let x = n;
  const pathVals = [x];
  for (let i = 0; i < STEPS; i += 1) {
    x = h(x);
    pathVals.push(x);
    const owner = firstHit.get(x);
    if (owner !== undefined) uni(n, owner);
    else firstHit.set(x, n);
  }
  paths.push({ n, tail: pathVals.slice(-8) });
}

const comp = new Map();
for (let n = 1; n <= N; n += 1) {
  const r = find(n);
  comp.set(r, (comp.get(r) || 0) + 1);
}
const componentSizes = [...comp.values()].sort((a, b) => b - a);

const out = {
  problem: 'EP-414',
  script: path.basename(process.argv[1]),
  method: 'finite_merging_component_scan_for_h_n_eq_n_plus_tau_n',
  params: { N, STEPS },
  distinct_components_after_window: componentSizes.length,
  largest_components: componentSizes.slice(0, 15),
  first_hit_table_size: firstHit.size,
  sample_tails_first_20: paths.slice(0, 20),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
