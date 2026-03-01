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

function graphIsRamseyForStars(edgeList, n, a, b) {
  const m = edgeList.length;
  const total = 1 << m;

  // color bit 1 = red, 0 = blue
  for (let mask = 0; mask < total; mask += 1) {
    const degR = new Int16Array(n);
    const degB = new Int16Array(n);

    for (let t = 0; t < m; t += 1) {
      const [u, v] = edgeList[t];
      if ((mask >> t) & 1) {
        degR[u] += 1;
        degR[v] += 1;
      } else {
        degB[u] += 1;
        degB[v] += 1;
      }
    }

    let maxR = 0;
    let maxB = 0;
    for (let i = 0; i < n; i += 1) {
      if (degR[i] > maxR) maxR = degR[i];
      if (degB[i] > maxB) maxB = degB[i];
    }

    // bad coloring if avoids both
    if (maxR <= a - 1 && maxB <= b - 1) return false;
  }

  return true;
}

function exactForCase(a, b, nMax = 7) {
  for (let m = 0; m <= a + b + 2; m += 1) {
    let found = null;
    for (let n = 1; n <= nMax; n += 1) {
      const all = edgesOfKn(n);
      if (all.length < m) continue;
      for (const subset of combinations(all, m)) {
        if (graphIsRamseyForStars(subset, n, a, b)) {
          found = { n, edge_list: subset };
          break;
        }
      }
      if (found) break;
    }
    if (found) return { a, b, exact_m_found: m, witness_n: found.n, witness_edges: found.edge_list };
  }
  return { a, b, exact_m_found: null, witness_n: null, witness_edges: [] };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep561_star_size_ramsey_small_exact.json');

const cases = [
  [2, 2],
  [2, 3],
  [3, 3],
  [3, 4],
  [4, 4],
];

const rows = [];
for (const [a, b] of cases) {
  const t0 = Date.now();
  const r = exactForCase(a, b, 7);
  r.predicted_a_plus_b_minus_1 = a + b - 1;
  r.matches_prediction = r.exact_m_found === a + b - 1;
  r.runtime_ms = Date.now() - t0;
  rows.push(r);
  process.stderr.write(`a=${a}, b=${b}, exact=${r.exact_m_found}, pred=${a + b - 1}, match=${r.matches_prediction}\n`);
}

const out = {
  problem: 'EP-561',
  method: 'exact_exhaustive_small_cases_for_single-star_vs_single-star_size_ramsey',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
