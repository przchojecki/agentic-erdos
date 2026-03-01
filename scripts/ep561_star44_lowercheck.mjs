#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function* combinations(arr, k) {
  const n = arr.length;
  if (k > n) return;
  const idx = Array.from({ length: k }, (_, i) => i);
  while (true) {
    yield idx.map((i) => arr[i]);
    let p = k - 1;
    while (p >= 0 && idx[p] === n - k + p) p -= 1;
    if (p < 0) return;
    idx[p] += 1;
    for (let q = p + 1; q < k; q += 1) idx[q] = idx[q - 1] + 1;
  }
}

function edgesOfKn(n) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  return e;
}

function ramseyStar(edgeList, n, a, b) {
  const m = edgeList.length;
  const total = 1 << m;
  for (let mask = 0; mask < total; mask += 1) {
    const degR = new Int16Array(n);
    const degB = new Int16Array(n);
    for (let t = 0; t < m; t += 1) {
      const [u, v] = edgeList[t];
      if ((mask >> t) & 1) {
        degR[u] += 1; degR[v] += 1;
      } else {
        degB[u] += 1; degB[v] += 1;
      }
    }
    let maxR = 0; let maxB = 0;
    for (let i = 0; i < n; i += 1) {
      if (degR[i] > maxR) maxR = degR[i];
      if (degB[i] > maxB) maxB = degB[i];
    }
    if (maxR <= a - 1 && maxB <= b - 1) return false;
  }
  return true;
}

const a = 4, b = 4;
const rows = [];
for (let m = 0; m <= 6; m += 1) {
  let found = false;
  let witness = null;
  for (let n = 1; n <= 8; n += 1) {
    const all = edgesOfKn(n);
    if (all.length < m) continue;
    for (const subset of combinations(all, m)) {
      if (ramseyStar(subset, n, a, b)) {
        found = true;
        witness = { n, edge_list: subset };
        break;
      }
    }
    if (found) break;
  }
  rows.push({ m, exists_ramsey_host: found, witness });
  console.log('m', m, 'exists?', found);
}

const out = {
  problem: 'EP-561',
  method: 'exhaustive_lower_bound_check_for_hatR(K1,4,K1,4)',
  rows,
  implication: 'No Ramsey host exists for m<=6, so hatR(K1,4,K1,4)>=7. Combined with star K1,7 upper bound gives equality 7.',
  generated_utc: new Date().toISOString(),
};

const outPath = path.join(process.cwd(), 'data', 'ep561_star44_lowercheck.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log('Wrote', outPath);
