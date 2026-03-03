#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-155 exact finite profile:
// Build F(N) from exact EP-43 data on N<=60, then extend exactly by backtracking
// for N=61..N_EXT (default 72), and record short-shift increments F(N+k)-F(N).

const N_EXT = Number(process.env.N_EXT || 72);
if (!Number.isInteger(N_EXT) || N_EXT < 60) {
  throw new Error('N_EXT must be an integer >= 60');
}

function maxSidonWithMinOne(N) {
  const arr = [1];
  let mask = 0n;
  let best = 1;

  function rec(next) {
    if (arr.length > best) best = arr.length;

    for (let x = next; x <= N; x += 1) {
      if (arr.length + (N - x + 1) <= best) break;

      let ok = true;
      let add = 0n;
      for (let i = 0; i < arr.length; i += 1) {
        const d = x - arr[i];
        const bit = 1n << BigInt(d - 1);
        if ((mask & bit) !== 0n || (add & bit) !== 0n) {
          ok = false;
          break;
        }
        add |= bit;
      }
      if (!ok) continue;

      arr.push(x);
      mask |= add;
      rec(x + 1);
      mask ^= add;
      arr.pop();
    }
  }

  rec(2);
  return best;
}

const fMap = new Map();

for (const line of fs.readFileSync('data/ep43_exact_N2_50.jsonl', 'utf8').trim().split('\n')) {
  const r = JSON.parse(line);
  fMap.set(r.N, r.fN);
}

const targeted = JSON.parse(fs.readFileSync('data/ep43_targeted_N51_60.json', 'utf8'));
for (const r of targeted.results) {
  const rhs = r.rhs_choose2_fN;
  const f = Math.round((1 + Math.sqrt(1 + 8 * rhs)) / 2);
  fMap.set(r.N, f);
}

const extension = [];
for (let N = 61; N <= N_EXT; N += 1) {
  const t0 = Date.now();
  const fN = maxSidonWithMinOne(N);
  const runtime = Date.now() - t0;
  extension.push({ N, fN, runtime_ms: runtime });
  fMap.set(N, fN);
}

const Ns = [...fMap.keys()].sort((a, b) => a - b);
const rows = [];
for (const N of Ns) {
  const fN = fMap.get(N);
  const row = { N, fN };
  for (const k of [1, 2, 3, 4, 5, 6, 8, 10]) {
    if (fMap.has(N + k)) row[`delta_k${k}`] = fMap.get(N + k) - fN;
  }
  rows.push(row);
}

const summary = {};
for (const k of [1, 2, 3, 4, 5, 6, 8, 10]) {
  let min = Infinity;
  let max = -Infinity;
  let count = 0;
  for (const r of rows) {
    const v = r[`delta_k${k}`];
    if (v == null) continue;
    min = Math.min(min, v);
    max = Math.max(max, v);
    count += 1;
  }
  summary[`k${k}`] = { min, max, count };
}

const out = {
  problem: 'EP-155',
  script: path.basename(process.argv[1]),
  method: 'exact_FN_profile_from_ep43_data_plus_backtracking_extension',
  n_ext: N_EXT,
  source_files: ['data/ep43_exact_N2_50.jsonl', 'data/ep43_targeted_N51_60.json'],
  extension,
  rows,
  summary,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep155_increment_profile_exact_to72.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, n_range: [Ns[0], Ns[Ns.length - 1]], summary }, null, 2));
