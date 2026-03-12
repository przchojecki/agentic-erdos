#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function omegaSieve(n) {
  const omega = new Uint8Array(n + 1);
  for (let p = 2; p <= n; p += 1) {
    if (omega[p] !== 0) continue;
    for (let j = p; j <= n; j += p) omega[j] += 1;
  }
  return omega;
}

function OmegaSieve(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  const out = new Uint8Array(n + 1);
  for (let x = 2; x <= n; x += 1) {
    out[x] = out[Math.floor(x / spf[x])] + 1;
  }
  return out;
}

const N = Number(process.env.N || 1000000);
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,300000,600000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const omega = omegaSieve(N + 5);
const Omega = OmegaSieve(N + 5);
const mset = new Set(MILESTONES);

function profile(arr, eps) {
  let mx = 1;
  const barriers = [];
  const rows = [];
  for (let n = 1; n <= N; n += 1) {
    if (n >= mx) barriers.push(n);
    const val = n + eps * arr[n];
    if (val > mx) mx = val;
    if (mset.has(n)) rows.push({ X: n, barrier_count_up_to_X: barriers.length, density: Number((barriers.length / n).toPrecision(7)) });
  }
  return { eps, first_40_barriers: barriers.slice(0, 40), rows };
}

const out = {
  problem: 'EP-413',
  script: path.basename(process.argv[1]),
  method: 'deep_barrier_profiles_for_omega_and_Omega_variants',
  params: { N, MILESTONES },
  profiles_omega: [profile(omega, 1), profile(omega, 0.5), profile(omega, 0.25)],
  profiles_Omega: [profile(Omega, 1), profile(Omega, 0.5), profile(Omega, 0.25)],
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
