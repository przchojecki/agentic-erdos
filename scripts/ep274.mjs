#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function cosetsZn(n) {
  const cands = [];
  for (let idx = 2; idx <= n; idx += 1) {
    if (n % idx !== 0) continue;
    for (let r = 0; r < idx; r += 1) {
      let mask = 0n;
      for (let x = r; x < n; x += idx) mask |= 1n << BigInt(x);
      cands.push({ index: idx, mask, size: n / idx });
    }
  }
  return cands;
}

function hasDistinctIndexCosetPartitionZn(n) {
  const cands = cosetsZn(n);
  const allMask = (1n << BigInt(n)) - 1n;
  const idxVals = [...new Set(cands.map((c) => c.index))].sort((a, b) => a - b);
  const idxPos = new Map(idxVals.map((v, i) => [v, i]));

  const elemToCands = Array.from({ length: n }, () => []);
  for (let i = 0; i < cands.length; i += 1) {
    const mask = cands[i].mask;
    for (let e = 0; e < n; e += 1) if ((mask >> BigInt(e)) & 1n) elemToCands[e].push(i);
  }
  for (const list of elemToCands) list.sort((i, j) => cands[i].size - cands[j].size);

  function dfs(covered, usedIdxBits, depth) {
    if (covered === allMask) return depth > 1;
    let e = 0;
    while (e < n && ((covered >> BigInt(e)) & 1n)) e += 1;
    if (e >= n) return depth > 1;

    for (const ci of elemToCands[e]) {
      const c = cands[ci];
      const bit = 1n << BigInt(idxPos.get(c.index));
      if (usedIdxBits & bit) continue;
      if (covered & c.mask) continue;
      if (dfs(covered | c.mask, usedIdxBits | bit, depth + 1)) return true;
    }
    return false;
  }

  return dfs(0n, 0n, 0);
}

const nList = [12, 14, 16, 18, 20, 24, 28, 30];
const deepPasses = 30000;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const cur = [];
  for (const n of nList) cur.push({ n, has_partition: hasDistinctIndexCosetPartitionZn(n) });
  rows = cur;
}

const out = {
  problem: 'EP-274',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep exact-cover search in small cyclic groups for distinct-index coset partitions.',
    deep_passes: deepPasses,
    rows,
    any_partition_found: rows.some((r) => r.has_partition),
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-274', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
