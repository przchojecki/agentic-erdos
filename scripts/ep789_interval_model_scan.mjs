#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function popcount(x) {
  let v = x;
  let c = 0;
  while (v) {
    v &= v - 1;
    c += 1;
  }
  return c;
}

function sumOfMask(arr, mask) {
  let s = 0;
  let i = 0;
  let m = mask;
  while (m) {
    if (m & 1) s += arr[i];
    m >>= 1;
    i += 1;
  }
  return s;
}

function goodSet(arr) {
  const seen = new Map();
  const m = arr.length;
  const total = 1 << m;
  for (let mask = 1; mask < total; mask += 1) {
    const s = sumOfMask(arr, mask);
    const r = popcount(mask);
    const prev = seen.get(s);
    if (prev == null) {
      seen.set(s, r);
    } else if (prev !== r) {
      return false;
    }
  }
  return true;
}

function* combinations(arr, k) {
  const n = arr.length;
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

function maxGoodSubsetSize(A) {
  const n = A.length;
  const total = 1 << n;
  const bySize = Array.from({ length: n + 1 }, () => []);
  for (let mask = 1; mask < total; mask += 1) {
    bySize[popcount(mask)].push(mask);
  }

  for (let s = n; s >= 1; s -= 1) {
    for (const mask of bySize[s]) {
      const B = [];
      for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) B.push(A[i]);
      if (goodSet(B)) return { size: s, witness: B };
    }
  }
  return { size: 0, witness: [] };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep789_interval_model_scan.json');

const configs = [
  { n: 5, M: 14 },
  { n: 6, M: 16 },
  { n: 7, M: 18 },
  { n: 8, M: 20 },
];

const rows = [];

for (const { n, M } of configs) {
  const universe = Array.from({ length: M + 1 }, (_, i) => i);
  let bestUpper = n;
  let hardA = null;
  let hardWitness = null;
  let totalA = 0;

  for (const A of combinations(universe, n)) {
    totalA += 1;
    const r = maxGoodSubsetSize(A);
    if (r.size < bestUpper) {
      bestUpper = r.size;
      hardA = A.slice();
      hardWitness = r.witness.slice();
    }
  }

  rows.push({
    n,
    M,
    total_A_checked: totalA,
    interval_model_upper_bound_on_h_n: bestUpper,
    hardest_A_found: hardA,
    witness_B_in_hardest_A: hardWitness,
  });

  process.stderr.write(`n=${n}, M=${M}, checked=${totalA}, bound<=${bestUpper}\n`);
}

const out = {
  problem: 'EP-789',
  method: 'exact_interval_model_exhaustive_search',
  note: 'This gives upper bounds on h(n) from restricted model A subset [0,M].',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
