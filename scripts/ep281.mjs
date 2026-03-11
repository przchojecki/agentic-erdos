#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function uncoveredDensity(moduli, residues) {
  let L = 1;
  for (const n of moduli) L = lcm(L, n);
  let uncovered = 0;
  for (let x = 0; x < L; x += 1) {
    let hit = false;
    for (let i = 0; i < moduli.length; i += 1) {
      if (x % moduli[i] === residues[i]) {
        hit = true;
        break;
      }
    }
    if (!hit) uncovered += 1;
  }
  return { L, dens: uncovered / L };
}

function allResidueTuples(moduli) {
  const out = [];
  const cur = [];
  function rec(i) {
    if (i === moduli.length) {
      out.push(cur.slice());
      return;
    }
    for (let r = 0; r < moduli[i]; r += 1) {
      cur.push(r);
      rec(i + 1);
      cur.pop();
    }
  }
  rec(0);
  return out;
}

const MOD_CASES = (process.env.MOD_CASES || '2,3,4,5;2,3,5,7;3,4,6,8').split(';').map((s) => s.split(',').map((x) => Number(x.trim())).filter(Number.isFinite));
const OUT = process.env.OUT || '';

const rows = [];
for (const mods of MOD_CASES) {
  const tuples = allResidueTuples(mods);
  let maxD = -1;
  let maxR = null;
  let L = 1;
  for (const rs of tuples) {
    const v = uncoveredDensity(mods, rs);
    L = v.L;
    if (v.dens > maxD) {
      maxD = v.dens;
      maxR = rs.slice();
    }
  }
  const zero = uncoveredDensity(mods, mods.map(() => 0)).dens;
  rows.push({ moduli: mods, lcm_period: L, tuples_checked: tuples.length, max_uncovered_density: Number(maxD.toFixed(6)), maximizing_residues_example: maxR, zero_residue_uncovered_density: Number(zero.toFixed(6)) });
}

const out = {
  problem: 'EP-281',
  script: path.basename(process.argv[1]),
  method: 'finite_truncation_uncovered_density_maximization_over_residues',
  params: { MOD_CASES },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
