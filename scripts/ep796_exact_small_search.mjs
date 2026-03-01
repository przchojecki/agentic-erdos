#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function solveExactG3(N) {
  const prodCount = new Int16Array(N * N + 1);
  const selected = [];

  let best = 0;
  let bestSet = [];
  let nodes = 0;

  function dfs(x) {
    nodes += 1;

    if (x === 0) {
      if (selected.length > best) {
        best = selected.length;
        bestSet = selected.slice().sort((a, b) => a - b);
      }
      return;
    }

    if (selected.length + x <= best) return;

    // Include branch.
    let ok = true;
    const touched = [];
    for (let i = 0; i < selected.length; i += 1) {
      const y = selected[i];
      const p = x * y;
      if (prodCount[p] >= 2) {
        ok = false;
        break;
      }
      touched.push(p);
    }

    if (ok) {
      for (const p of touched) prodCount[p] += 1;
      selected.push(x);
      dfs(x - 1);
      selected.pop();
      for (const p of touched) prodCount[p] -= 1;
    }

    // Exclude branch.
    dfs(x - 1);
  }

  dfs(N);

  return { N, exact_g3: best, witness: bestSet, search_nodes: nodes };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep796_exact_small_search.json');

const rows = [];
for (let N = 8; N <= 40; N += 1) {
  const t0 = Date.now();
  const r = solveExactG3(N);
  const ms = Date.now() - t0;
  rows.push({ ...r, runtime_ms: ms });
  process.stderr.write(`N=${N}, g3=${r.exact_g3}, nodes=${r.search_nodes}, ms=${ms}\n`);
}

const out = {
  problem: 'EP-796 (k=3 finite exact scan)',
  method: 'exact_branch_and_bound_over_subsets_with_product_representation_cap_2',
  interpretation: 'g3(n): max |A| with each m having <3 representations m=a1*a2, a1<a2 in A',
  n_range: [8, 40],
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
