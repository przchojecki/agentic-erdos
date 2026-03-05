#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function reduceFrac(num, den) {
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function ceilDivBig(a, b) {
  return (a + b - 1n) / b;
}

function collectDenominatorsForK(k, maxDen) {
  const usedDenoms = new Set();
  let solutionCount = 0;

  function dfs(num, den, start, termsLeft, chosen) {
    if (termsLeft === 1) {
      if (num <= 0n || den % num !== 0n) return;
      const d = Number(den / num);
      if (!Number.isFinite(d) || d < start || d > maxDen) return;
      solutionCount += 1;
      for (const x of chosen) usedDenoms.add(x);
      usedDenoms.add(d);
      return;
    }

    if (num * BigInt(start) > den * BigInt(termsLeft)) return;
    let dMin = Number(ceilDivBig(den, num));
    if (dMin < start) dMin = start;

    for (let d = dMin; d <= maxDen; d += 1) {
      const bd = BigInt(d);
      const newNumRaw = num * bd - den;
      if (newNumRaw <= 0n) continue;
      const newDenRaw = den * bd;
      const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
      const t = termsLeft - 1;
      if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;
      chosen.push(d);
      dfs(newNum, newDen, d + 1, t, chosen);
      chosen.pop();
    }
  }

  dfs(1n, 1n, 2, k, []);
  let vProxy = 2;
  while (usedDenoms.has(vProxy)) vProxy += 1;

  return {
    k,
    max_denom_searched: maxDen,
    solution_count: solutionCount,
    distinct_denominators_seen: usedDenoms.size,
    v_proxy_min_missing_from_2: vProxy,
  };
}

const deepPasses = 80;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  rows = [
    collectDenominatorsForK(3, 1000),
    collectDenominatorsForK(4, 1800),
    collectDenominatorsForK(5, 2600),
    collectDenominatorsForK(6, 3200),
  ];
}

const out = {
  problem: 'EP-293',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep exact finite-k denominator-appearance scan for 1=sum 1/n_i.',
    deep_passes: deepPasses,
    rows,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-293', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
