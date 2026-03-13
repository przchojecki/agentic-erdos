#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '20,30,40,50,60').split(',').map((x) => Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 28);
const R_LIST = (process.env.R_LIST || '2,3').split(',').map((x) => Number(x.trim())).filter(Boolean);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 0x100000000;
  };
}
const rng = makeRng(20260313 ^ 714);

function combos(arr, k) {
  const out = [];
  const cur = [];
  function rec(i) {
    if (cur.length === k) {
      out.push(cur.slice());
      return;
    }
    for (let j = i; j <= arr.length - (k - cur.length); j += 1) {
      cur.push(arr[j]);
      rec(j + 1);
      cur.pop();
    }
  }
  rec(0);
  return out;
}

function hasNewKrr(u, v, r, AtoB, BtoA) {
  if (r === 2) {
    for (const a2 of BtoA[v]) {
      if (a2 === u) continue;
      for (const b2 of AtoB[u]) {
        if (b2 === v) continue;
        if (AtoB[a2].has(b2)) return true;
      }
    }
    return false;
  }

  if (r === 3) {
    const NA = [...BtoA[v]].filter((x) => x !== u);
    const NB = [...AtoB[u]].filter((x) => x !== v);
    if (NA.length < 2 || NB.length < 2) return false;
    for (const As of combos(NA, 2)) {
      for (const Bs of combos(NB, 2)) {
        let ok = true;
        for (const a of As) for (const b of Bs) if (!AtoB[a].has(b)) { ok = false; break; }
        if (ok) return true;
      }
    }
    return false;
  }

  throw new Error('r>3 not implemented in this finite checker');
}

function randomGreedyKrrFree(n, r, trials) {
  const nA = Math.floor(n / 2);
  const nB = n - nA;
  const edges = [];
  for (let a = 0; a < nA; a += 1) for (let b = 0; b < nB; b += 1) edges.push([a, b]);

  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const perm = edges.slice();
    for (let i = perm.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }

    const AtoB = Array.from({ length: nA }, () => new Set());
    const BtoA = Array.from({ length: nB }, () => new Set());
    let m = 0;

    for (const [a, b] of perm) {
      AtoB[a].add(b);
      BtoA[b].add(a);
      if (hasNewKrr(a, b, r, AtoB, BtoA)) {
        AtoB[a].delete(b);
        BtoA[b].delete(a);
      } else {
        m += 1;
      }
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
for (const r of R_LIST) {
  for (const n of N_LIST) {
    const e = randomGreedyKrrFree(n, r, TRIALS);
    rows.push({
      r,
      n,
      trials: TRIALS,
      best_edges_found: e,
      scale_n_2_minus_1_over_r: Number((n ** (2 - 1 / r)).toPrecision(8)),
      ratio_edges_over_scale: Number((e / (n ** (2 - 1 / r))).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-714',
  script: path.basename(process.argv[1]),
  method: 'finite_random_greedy_bipartite_Krr_free_construction_scan',
  warning: 'Finite lower-bound construction only, for r=2,3 in this implementation.',
  params: { R_LIST, N_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
