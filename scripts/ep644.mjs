#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function popcount(x) {
  let c = 0;
  while (x) {
    x &= x - 1;
    c += 1;
  }
  return c;
}

function allKSets(v, k) {
  const out = [];
  for (let m = 0; m < (1 << v); m += 1) if (popcount(m) === k) out.push(m);
  return out;
}

function combos(n, r) {
  const out = [];
  const cur = [];
  function dfs(i) {
    if (cur.length === r) {
      out.push(cur.slice());
      return;
    }
    for (let j = i; j < n; j += 1) {
      cur.push(j);
      dfs(j + 1);
      cur.pop();
    }
  }
  dfs(0);
  return out;
}

function localRCondition(fam, r, v) {
  if (fam.length < r) return true;
  const idx = combos(fam.length, r);
  const pairs = [];
  for (let x = 0; x < v; x += 1) for (let y = x + 1; y < v; y += 1) pairs.push((1 << x) | (1 << y));

  for (const I of idx) {
    let good = false;
    for (const p of pairs) {
      let ok = true;
      for (const i of I) {
        if ((fam[i] & p) === 0) {
          ok = false;
          break;
        }
      }
      if (ok) {
        good = true;
        break;
      }
    }
    if (!good) return false;
  }
  return true;
}

function transversalNumber(fam, v) {
  for (let s = 1; s <= v; s += 1) {
    for (let m = 0; m < (1 << v); m += 1) {
      if (popcount(m) !== s) continue;
      let ok = true;
      for (const A of fam) {
        if ((A & m) === 0) {
          ok = false;
          break;
        }
      }
      if (ok) return s;
    }
  }
  return v;
}

function search(v, k, r, famSize, restarts, steps, rng) {
  const pool = allKSets(v, k);
  let bestTau = 0;
  let best = [];

  for (let rr = 0; rr < restarts; rr += 1) {
    const fam = [];
    for (let i = 0; i < famSize; i += 1) fam.push(pool[Math.floor(rng() * pool.length)]);
    if (!localRCondition(fam, r, v)) continue;
    let curTau = transversalNumber(fam, v);
    if (curTau > bestTau) {
      bestTau = curTau;
      best = fam.slice();
    }

    for (let st = 0; st < steps; st += 1) {
      const pos = Math.floor(rng() * famSize);
      const old = fam[pos];
      fam[pos] = pool[Math.floor(rng() * pool.length)];
      if (!localRCondition(fam, r, v)) {
        fam[pos] = old;
        continue;
      }
      const tau = transversalNumber(fam, v);
      if (tau >= curTau || rng() < 0.002) {
        curTau = tau;
        if (tau > bestTau) {
          bestTau = tau;
          best = fam.slice();
        }
      } else {
        fam[pos] = old;
      }
    }
  }

  return { bestTau, bestFamilySize: best.length };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 644);
const rows = [];

for (const [v, k, r, famSize, restarts, steps] of [
  [10, 4, 7, 9, 24, 450],
  [11, 4, 7, 10, 20, 380],
  [12, 5, 7, 10, 14, 260],
]) {
  const ans = search(v, k, r, famSize, restarts, steps, rng);
  rows.push({
    universe_v: v,
    k,
    r,
    target_family_size: famSize,
    restarts,
    steps_per_restart: steps,
    best_transversal_number_found: ans.bestTau,
    best_tau_over_k: Number((ans.bestTau / k).toPrecision(8)),
    witness_family_size: ans.bestFamilySize,
  });
}

const out = {
  problem: 'EP-644',
  script: path.basename(process.argv[1]),
  method: 'local_search_for_large_transversal_families_under_r_tuple_pair_hitting_constraint',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
