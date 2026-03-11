#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function isAP(vals) {
  if (vals.length === 0) return false;
  if (vals.length <= 2) return true;
  const a = vals.slice().sort((x, y) => x - y);
  const d = a[1] - a[0];
  for (let i = 2; i < a.length; i += 1) if (a[i] - a[i - 1] !== d) return false;
  return true;
}

function subsets(N) {
  const out = [];
  const total = 1 << N;
  for (let m = 1; m < total; m += 1) {
    const vals = [];
    for (let i = 0; i < N; i += 1) if ((m >>> i) & 1) vals.push(i + 1);
    out.push({ vals });
  }
  return out;
}

function buildCompatGraph(subs) {
  const n = subs.length;
  const neigh = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < n; i += 1) {
    const si = new Set(subs[i].vals);
    for (let j = i + 1; j < n; j += 1) {
      const inter = [];
      for (const x of subs[j].vals) if (si.has(x)) inter.push(x);
      if (isAP(inter)) {
        neigh[i].add(j);
        neigh[j].add(i);
      }
    }
  }
  return neigh;
}

function maxCliqueSize(neigh) {
  let best = 0;
  function bronk(R, P, X) {
    if (P.size === 0 && X.size === 0) {
      if (R.length > best) best = R.length;
      return;
    }
    if (R.length + P.size <= best) return;

    let pivot = null;
    let pivotDeg = -1;
    for (const u of new Set([...P, ...X])) {
      const deg = neigh[u].size;
      if (deg > pivotDeg) {
        pivotDeg = deg;
        pivot = u;
      }
    }

    const candidates = [];
    for (const v of P) if (!neigh[pivot]?.has(v)) candidates.push(v);
    for (const v of candidates) {
      const newR = R.concat([v]);
      const newP = new Set([...P].filter((u) => neigh[v].has(u)));
      const newX = new Set([...X].filter((u) => neigh[v].has(u)));
      bronk(newR, newP, newX);
      P.delete(v);
      X.add(v);
    }
  }
  const P0 = new Set(Array.from({ length: neigh.length }, (_, i) => i));
  bronk([], P0, new Set());
  return best;
}

function constructionLower(N) {
  const fam = [];
  for (let a = 1; a <= N; a += 1) fam.push([1, a]);
  for (let a = 2; a <= N; a += 1) for (let b = a + 1; b <= N; b += 1) fam.push([1, a, b]);
  fam.push([1]);
  return fam.length;
}

const N_LIST = (process.env.N_LIST || '5,6,7,8').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const N of N_LIST) {
  const subs = subsets(N);
  const neigh = buildCompatGraph(subs);
  const exactT = maxCliqueSize(neigh);
  rows.push({ N, exact_t_N_small: exactT, lower_construction_size: constructionLower(N), N2_over_2: Number((N * N / 2).toFixed(3)) });
}

const out = {
  problem: 'EP-272',
  script: path.basename(process.argv[1]),
  method: 'exact_small_N_extremal_family_via_max_clique',
  params: { N_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
