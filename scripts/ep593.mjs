#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function random3Graph(n, p, rng) {
  const edges = [];
  const has = new Set();
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        if (rng() < p) {
          const key = `${a},${b},${c}`;
          has.add(key);
          edges.push([a, b, c]);
        }
      }
    }
  }
  return { n, edges, has };
}

function hasEdge(has, a, b, c) {
  const x = [a, b, c].sort((u, v) => u - v);
  return has.has(`${x[0]},${x[1]},${x[2]}`);
}

function hasK4_3(H) {
  const { n, has } = H;
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        for (let d = c + 1; d < n; d += 1) {
          if (hasEdge(has, a, b, c) && hasEdge(has, a, b, d) && hasEdge(has, a, c, d) && hasEdge(has, b, c, d)) return true;
        }
      }
    }
  }
  return false;
}

function approxWeakChromatic(H) {
  const { n, edges } = H;
  const order = Array.from({ length: n }, (_, i) => i).sort((u, v) => v - u);
  const color = Array(n).fill(-1);
  let maxColor = -1;

  for (const v of order) {
    let c = 0;
    while (true) {
      let bad = false;
      for (const [a, b, d] of edges) {
        if (a !== v && b !== v && d !== v) continue;
        const ca = a === v ? c : color[a];
        const cb = b === v ? c : color[b];
        const cd = d === v ? c : color[d];
        if (ca >= 0 && cb >= 0 && cd >= 0 && ca === cb && cb === cd) { bad = true; break; }
      }
      if (!bad) break;
      c += 1;
    }
    color[v] = c;
    if (c > maxColor) maxColor = c;
  }
  return maxColor + 1;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 593);
const rows = [];

for (const [n, p, trials] of [[16, 0.12, 120], [18, 0.1, 100], [20, 0.09, 90]]) {
  let sumChi = 0;
  let k4Hits = 0;
  let hiChiCount = 0;
  for (let t = 0; t < trials; t += 1) {
    const H = random3Graph(n, p, rng);
    const chi = approxWeakChromatic(H);
    sumChi += chi;
    if (chi >= 4) hiChiCount += 1;
    if (hasK4_3(H)) k4Hits += 1;
  }
  rows.push({
    n,
    p,
    trials,
    avg_weak_chromatic_number_estimate: Number((sumChi / trials).toPrecision(8)),
    fraction_with_weak_chromatic_at_least_4: Number((hiChiCount / trials).toPrecision(8)),
    fraction_containing_K4_3: Number((k4Hits / trials).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-593',
  script: path.basename(process.argv[1]),
  method: 'finite_3_uniform_proxy_high_chromatic_vs_forced_small_pattern',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
