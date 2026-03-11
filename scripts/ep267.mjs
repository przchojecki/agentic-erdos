#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const PHI = (1 + Math.sqrt(5)) / 2;
const SQRT5 = Math.sqrt(5);

function nSeq(c, K) {
  const out = [];
  let cur = 2;
  for (let k = 0; k < K; k += 1) {
    cur = Math.max(cur + 1, Math.floor((k === 0 ? 2 : out[k - 1]) * c));
    out.push(cur);
  }
  return out;
}

function fibRecipTable(maxN) {
  const cap = Math.min(maxN, 1475);
  const rec = new Float64Array(cap + 1);
  rec[0] = 0;
  rec[1] = 1;
  if (cap >= 2) rec[2] = 1;
  for (let i = 3; i <= cap; i += 1) rec[i] = rec[i - 1] + rec[i - 2];
  const inv = new Float64Array(cap + 1);
  for (let i = 1; i <= cap; i += 1) inv[i] = 1 / rec[i];
  return inv;
}

function recipFib(n, invTable) {
  if (n < invTable.length) return invTable[n];
  // Binet approximation; terms for n beyond ~1500 are numerically ~0 in double.
  const x = SQRT5 * Math.exp(-n * Math.log(PHI));
  return Number.isFinite(x) ? x : 0;
}

function sumReciprocalFib(idxs, invTable) {
  let s = 0;
  for (const n of idxs) s += recipFib(n, invTable);
  return s;
}

function bestApprox(x, qmax) {
  let best = { q: 1, err: Math.abs(x - Math.round(x)) };
  for (let q = 1; q <= qmax; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < best.err) best = { q, err };
  }
  return best;
}

const C_LIST = (process.env.C_LIST || '1.2,1.35,1.5,1.8,2.0').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const K = Number(process.env.K || 20);
const QMAX = Number(process.env.QMAX || 35000);
const OUT = process.env.OUT || '';

const seqs = C_LIST.map((c) => ({ c, idxs: nSeq(c, K) }));
const maxN = Math.max(...seqs.map((s) => s.idxs[s.idxs.length - 1]));
const invTable = fibRecipTable(maxN);

const rows = [];
for (const { c, idxs } of seqs) {
  const x = sumReciprocalFib(idxs, invTable);
  const best = bestApprox(x, QMAX);
  rows.push({
    c,
    K,
    n1: idxs[0],
    nK: idxs[idxs.length - 1],
    best_q: best.q,
    best_err: Number(best.err.toExponential(6)),
    q2_err: Number((best.err * best.q * best.q).toExponential(6)),
    seq_prefix: idxs.slice(0, 10),
  });
}

const out = {
  problem: 'EP-267',
  script: path.basename(process.argv[1]),
  method: 'lacunary_fibonacci_reciprocal_series_rational_approx_scan',
  params: { C_LIST, K, QMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
