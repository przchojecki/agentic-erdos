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

function isAPFree3(arr) {
  const s = new Set(arr);
  const n = arr.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const a = arr[i];
      const b = arr[j];
      const c = 2 * b - a;
      if (s.has(c)) return false;
    }
  }
  return true;
}

function maxAPFreeSubsetSize(A) {
  const n = A.length;
  const total = 1 << n;
  const bySize = Array.from({ length: n + 1 }, () => []);
  for (let mask = 1; mask < total; mask += 1) bySize[popcount(mask)].push(mask);

  for (let s = n; s >= 1; s -= 1) {
    for (const mask of bySize[s]) {
      const B = [];
      for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) B.push(A[i]);
      if (isAPFree3(B)) return s;
    }
  }
  return 0;
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

function R3(N) {
  // exact for [1..N]
  const arr = Array.from({ length: N }, (_, i) => i + 1);
  return maxAPFreeSubsetSize(arr);
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep201_interval_model_scan.json');

const configs = [
  { N: 6, M: 14 },
  { N: 7, M: 16 },
  { N: 8, M: 18 },
  { N: 9, M: 20 },
];

const rows = [];
for (const { N, M } of configs) {
  const U = Array.from({ length: M }, (_, i) => i + 1);
  let GModel = N;
  let hardA = null;
  let checked = 0;

  for (const A of combinations(U, N)) {
    checked += 1;
    const g = maxAPFreeSubsetSize(A);
    if (g < GModel) {
      GModel = g;
      hardA = A.slice();
    }
  }

  const r = R3(N);

  rows.push({
    N,
    M,
    total_A_checked: checked,
    G3_interval_model_upper_bound: GModel,
    R3_exact_on_1_to_N: r,
    ratio_R3_over_G3_model: GModel > 0 ? r / GModel : null,
    hardest_A_found: hardA,
  });

  process.stderr.write(`N=${N}, M=${M}, checked=${checked}, Gmodel=${GModel}, R3=${r}\n`);
}

const out = {
  problem: 'EP-201',
  method: 'exact_small_interval_model_for_G3_and_exact_R3_on_[1..N]',
  note: 'G3 interval model is a restricted finite surrogate, not full unrestricted G3(N).',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
