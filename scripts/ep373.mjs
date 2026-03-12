#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function factorials(N) {
  const f = [1n];
  for (let i = 1; i <= N; i += 1) f[i] = f[i - 1] * BigInt(i);
  return f;
}

const N2 = Number(process.env.N2 || 700);
const N3 = Number(process.env.N3 || 260);
const N4 = Number(process.env.N4 || 120);
const OUT = process.env.OUT || '';

const N = Math.max(N2, N3, N4);
const fact = factorials(N);
const factIndex = new Map();
for (let i = 0; i <= N; i += 1) factIndex.set(fact[i].toString(), i);

const k2 = [];
for (let n = 3; n <= N2; n += 1) {
  const fn = fact[n];
  for (let a = 2; a <= n - 2; a += 1) {
    const fa = fact[a];
    if (fn % fa !== 0n) continue;
    const b = factIndex.get((fn / fa).toString());
    if (b === undefined || b < 2 || b > a || b > n - 2) continue;
    k2.push({ n, a, b });
  }
}

const k3 = [];
for (let n = 4; n <= N3; n += 1) {
  const fn = fact[n];
  for (let a = 2; a <= n - 2; a += 1) {
    for (let b = 2; b <= a; b += 1) {
      const prod = fact[a] * fact[b];
      if (fn % prod !== 0n) continue;
      const c = factIndex.get((fn / prod).toString());
      if (c === undefined || c < 2 || c > b || c > n - 2) continue;
      k3.push({ n, a, b, c });
    }
  }
}

const k4 = [];
for (let n = 5; n <= N4; n += 1) {
  const fn = fact[n];
  for (let a = 2; a <= n - 2; a += 1) {
    for (let b = 2; b <= a; b += 1) {
      for (let c = 2; c <= b; c += 1) {
        const prod = fact[a] * fact[b] * fact[c];
        if (fn % prod !== 0n) continue;
        const d = factIndex.get((fn / prod).toString());
        if (d === undefined || d < 2 || d > c || d > n - 2) continue;
        k4.push({ n, a, b, c, d });
      }
    }
  }
}

const out = {
  problem: 'EP-373',
  script: path.basename(process.argv[1]),
  method: 'extended_factorial_product_identity_search',
  params: { N2, N3, N4 },
  k2_solution_count: k2.length,
  k2_solutions: k2,
  k3_solution_count: k3.length,
  k3_solutions: k3,
  k4_solution_count: k4.length,
  k4_solutions_first_50: k4.slice(0, 50),
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
