#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildSpf(n) {
  const spf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i <= Math.floor(n / i)) {
        for (let j = i * i; j <= n; j += i) {
          if (spf[j] === 0) spf[j] = i;
        }
      }
    }
  }
  return spf;
}

function addFactor(x, sign, spf, exp, touch) {
  let v = x;
  while (v > 1) {
    const p = spf[v];
    let e = 0;
    while (v % p === 0) {
      v = Math.floor(v / p);
      e += 1;
    }

    const before = exp[p];
    const after = before + sign * e;
    if (after < 0) {
      throw new Error(`negative exponent at prime ${p}`);
    }
    exp[p] = after;

    if (before === 0 && after > 0) touch.changed = true;
    if (before > 0 && after === 0) touch.changed = true;
  }
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep730_large_consecutive_scan.json');

const N = Number(process.argv[2] || 2000000);
const limit = 2 * N + 5;
const spf = buildSpf(limit);

const exp = new Int32Array(limit + 1);
// n=1: C(2,1)=2
exp[2] = 1;

const hits = [];
const sampleRows = [];

for (let n = 1; n < N; n += 1) {
  const touch = { changed: false };

  // C(2(n+1),n+1) = C(2n,n) * 2*(2n+1)/(n+1)
  addFactor(2, +1, spf, exp, touch);
  addFactor(2 * n + 1, +1, spf, exp, touch);
  addFactor(n + 1, -1, spf, exp, touch);

  if (!touch.changed) {
    hits.push(n);
    if (hits.length <= 200) sampleRows.push({ n, pair: [n, n + 1] });
  }

  if (n % 200000 === 0) process.stderr.write(`n=${n}/${N}, hits=${hits.length}\n`);
}

const buckets = [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 1500000, 2000000]
  .filter((x) => x <= N)
  .map((x) => ({ upto: x, count: 0 }));
for (const b of buckets) {
  let c = 0;
  for (const n of hits) if (n <= b.upto) c += 1;
  b.count = c;
  b.density = c / b.upto;
}

const out = {
  problem: 'EP-730',
  method: 'exact_support_tracking_via_central_binomial_recurrence',
  max_n_scanned: N,
  total_consecutive_equal_support_pairs: hits.length,
  first_hits: hits.slice(0, 200),
  last_hits: hits.slice(Math.max(0, hits.length - 50)),
  growth_buckets: buckets,
  sample_rows: sampleRows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
