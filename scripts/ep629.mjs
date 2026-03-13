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

function allKSubsetsMasks(v, k) {
  const out = [];
  const lim = 1 << v;
  for (let m = 0; m < lim; m += 1) {
    if (popcount(m) === k) out.push(m);
  }
  return out;
}

function countProper2Colorings(v, edgeMasks) {
  let good = 0;
  const lim = 1 << v;
  for (let col = 0; col < lim; col += 1) {
    let ok = true;
    for (const e of edgeMasks) {
      const c = e & col;
      if (c === 0 || c === e) {
        ok = false;
        break;
      }
    }
    if (ok) good += 1;
  }
  return good;
}

function randomFamily(pool, s, rng) {
  const idx = Array.from({ length: pool.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j];
    idx[j] = t;
  }
  return idx.slice(0, s).map((i) => pool[i]);
}

function localSearchNonPropertyB(v, k, s, restarts, steps, rng) {
  const pool = allKSubsetsMasks(v, k);
  let bestGood = Number.POSITIVE_INFINITY;
  let found = false;

  for (let r = 0; r < restarts; r += 1) {
    let fam = randomFamily(pool, s, rng);
    let curGood = countProper2Colorings(v, fam);
    if (curGood < bestGood) bestGood = curGood;
    if (curGood === 0) {
      found = true;
      break;
    }
    for (let it = 0; it < steps; it += 1) {
      const pos = Math.floor(rng() * s);
      const old = fam[pos];
      const neu = pool[Math.floor(rng() * pool.length)];
      if (neu === old) continue;
      fam[pos] = neu;
      const nxt = countProper2Colorings(v, fam);
      const accept = nxt <= curGood || rng() < 0.0015;
      if (accept) {
        curGood = nxt;
        if (curGood < bestGood) bestGood = curGood;
        if (curGood === 0) {
          found = true;
          break;
        }
      } else {
        fam[pos] = old;
      }
    }
    if (found) break;
  }
  return { found, bestGood };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 629);
const rows = [];

for (const [k, v, sMin, sMax, restarts, steps] of [
  [4, 11, 16, 24, 12, 700],
  [5, 12, 30, 40, 4, 250],
]) {
  let firstNonPropertyB = null;
  for (let s = sMin; s <= sMax; s += 1) {
    const res = localSearchNonPropertyB(v, k, s, restarts, steps, rng);
    if (res.found && firstNonPropertyB === null) firstNonPropertyB = s;
    rows.push({
      k,
      universe_size_v: v,
      family_size_s: s,
      restarts,
      steps_per_restart: steps,
      found_non_property_B_family: res.found,
      best_number_of_proper_2_colorings_seen: res.bestGood,
    });
  }
  rows.push({
    k,
    summary: true,
    smallest_s_found_with_non_property_B: firstNonPropertyB || 0,
    implied_upper_bound_on_n_of_k_minus_1:
      firstNonPropertyB ? `n(${k - 1}) <= ${firstNonPropertyB}` : 'not found in tested range',
  });
}

const out = {
  problem: 'EP-629',
  script: path.basename(process.argv[1]),
  method: 'local_search_for_small_non_property_B_hypergraph_families_to_induce_n_k_upper_bounds',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
