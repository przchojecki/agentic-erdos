#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function subsetsOfN(n) {
  const out = [];
  for (let mask = 0; mask < (1 << n); mask += 1) out.push(mask);
  return out;
}

function popcount(x) {
  let c = 0;
  while (x) { x &= x - 1; c += 1; }
  return c;
}

function coversForH(n, h, map) {
  const allY = [];
  for (let mask = 0; mask < (1 << n); mask += 1) if (popcount(mask) >= h) allY.push(mask);
  let bad = 0;
  for (const Y of allY) {
    const hit = new Uint8Array(n);
    for (let A = Y; ; A = (A - 1) & Y) {
      hit[map[A]] = 1;
      if (A === 0) break;
    }
    let cnt = 0;
    for (let i = 0; i < n; i += 1) cnt += hit[i];
    if (cnt < n) bad += 1;
  }
  return { totalY: allY.length, badY: bad };
}

function localSearch(n, h, restarts, steps, rng) {
  const size = 1 << n;
  let bestBad = 1e18;
  let bestMap = null;
  for (let r = 0; r < restarts; r += 1) {
    const map = new Uint8Array(size);
    for (let A = 0; A < size; A += 1) {
      const choices = [];
      for (let v = 0; v < n; v += 1) if (((A >> v) & 1) === 0) choices.push(v);
      map[A] = choices[Math.floor(rng() * choices.length)];
    }
    let cur = coversForH(n, h, map);
    if (cur.badY < bestBad) { bestBad = cur.badY; bestMap = map.slice(); }
    if (cur.badY === 0) return { found: true, bestBad: 0, map };

    for (let it = 0; it < steps; it += 1) {
      const A = Math.floor(rng() * size);
      const choices = [];
      for (let v = 0; v < n; v += 1) if (((A >> v) & 1) === 0) choices.push(v);
      const old = map[A];
      let neu = old;
      while (neu === old && choices.length > 1) neu = choices[Math.floor(rng() * choices.length)];
      map[A] = neu;
      const nxt = coversForH(n, h, map);
      if (nxt.badY <= cur.badY || rng() < 0.002) {
        cur = nxt;
        if (cur.badY < bestBad) { bestBad = cur.badY; bestMap = map.slice(); }
        if (cur.badY === 0) return { found: true, bestBad: 0, map };
      } else {
        map[A] = old;
      }
    }
  }
  return { found: false, bestBad, map: bestMap };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 624);
const rows = [];

for (const [n, h, restarts, steps] of [[8, 3, 20, 18000], [8, 4, 28, 26000], [9, 4, 12, 18000]]) {
  const r = localSearch(n, h, restarts, steps, rng);
  rows.push({
    n,
    h,
    restarts,
    steps,
    found_full_cover_mapping: r.found,
    best_bad_Y_count: r.bestBad,
  });
}

const out = {
  problem: 'EP-624',
  script: path.basename(process.argv[1]),
  method: 'deeper_local_search_for_small_n_H_n_threshold_witness_mappings',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
