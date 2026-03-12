#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomColoring(n, rng) {
  const red = Array.from({ length: n }, () => new Uint8Array(n));
  const blue = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < 0.5) { red[i][j] = red[j][i] = 1; }
      else { blue[i][j] = blue[j][i] = 1; }
    }
  }
  return { n, red, blue };
}

function hasRedKsT(C, s, t) {
  const { n, red } = C;
  const verts = Array.from({ length: n }, (_, i) => i);
  function rec(start, chosen) {
    if (chosen.length === s) {
      let common = 0;
      for (const v of verts) {
        if (chosen.includes(v)) continue;
        let ok = true;
        for (const u of chosen) if (!red[u][v]) { ok = false; break; }
        if (ok) common += 1;
      }
      return common >= t;
    }
    for (let i = start; i < n; i += 1) {
      chosen.push(i);
      if (rec(i + 1, chosen)) return true;
      chosen.pop();
    }
    return false;
  }
  return rec(0, []);
}

function hasBlueC5(C) {
  const { n, blue } = C;
  const vis = new Uint8Array(n);
  function dfs(start, v, depth, parent) {
    if (depth === 5) return v === start;
    vis[v] = 1;
    for (let u = 0; u < n; u += 1) {
      if (!blue[v][u] || u === parent) continue;
      if (depth + 1 < 5 && vis[u]) continue;
      if (dfs(start, u, depth + 1, v)) return true;
    }
    vis[v] = 0;
    return false;
  }
  for (let s = 0; s < n; s += 1) {
    vis.fill(0);
    if (dfs(s, s, 0, -1)) return true;
  }
  return false;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 597);
const rows = [];

for (const [n, trials, s, t] of [[18, 260, 3, 5], [22, 220, 3, 6], [26, 180, 4, 6]]) {
  let redHits = 0;
  let blueHits = 0;
  let either = 0;
  for (let r = 0; r < trials; r += 1) {
    const C = randomColoring(n, rng);
    const r1 = hasRedKsT(C, s, t);
    const b1 = hasBlueC5(C);
    if (r1) redHits += 1;
    if (b1) blueHits += 1;
    if (r1 || b1) either += 1;
  }
  rows.push({
    n,
    trials,
    red_target: `K_${s},${t}`,
    blue_target: 'C5',
    red_hit_probability: Number((redHits / trials).toPrecision(8)),
    blue_hit_probability: Number((blueHits / trials).toPrecision(8)),
    either_hit_probability: Number((either / trials).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-597',
  script: path.basename(process.argv[1]),
  method: 'finite_ordered_partition_proxy_red_biclique_or_blue_C5',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
