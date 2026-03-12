#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function edgeList(n) {
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  return edges;
}

function hasMonoTriangle3Color(n, edgeColors) {
  const idx = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let e = 0; e < edgeColors.edges.length; e += 1) {
    const [u, v] = edgeColors.edges[e];
    idx[u][v] = e;
    idx[v][u] = e;
  }
  const c = edgeColors.colors;
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let d = b + 1; d < n; d += 1) {
        const c1 = c[idx[a][b]];
        const c2 = c[idx[a][d]];
        const c3 = c[idx[b][d]];
        if (c1 === c2 && c2 === c3) return true;
      }
    }
  }
  return false;
}

function monoTriCount(n, edgeColors) {
  const idx = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let e = 0; e < edgeColors.edges.length; e += 1) {
    const [u, v] = edgeColors.edges[e];
    idx[u][v] = e;
    idx[v][u] = e;
  }
  let bad = 0;
  const c = edgeColors.colors;
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let d = b + 1; d < n; d += 1) {
        const c1 = c[idx[a][b]];
        const c2 = c[idx[a][d]];
        const c3 = c[idx[b][d]];
        if (c1 === c2 && c2 === c3) bad += 1;
      }
    }
  }
  return bad;
}

function localSearchNoMonoTri(n, attempts, steps, rng) {
  const edges = edgeList(n);
  let found = 0;
  let bestBad = Infinity;
  for (let a = 0; a < attempts; a += 1) {
    const colors = new Uint8Array(edges.length);
    for (let e = 0; e < edges.length; e += 1) colors[e] = Math.floor(rng() * 3);
    let bad = monoTriCount(n, { edges, colors });
    if (bad < bestBad) bestBad = bad;
    if (bad === 0) { found += 1; continue; }
    for (let s = 0; s < steps; s += 1) {
      const e = Math.floor(rng() * edges.length);
      const old = colors[e];
      const c1 = (old + 1 + Math.floor(rng() * 2)) % 3;
      colors[e] = c1;
      const bad2 = monoTriCount(n, { edges, colors });
      if (bad2 <= bad || rng() < 0.002) {
        bad = bad2;
      } else {
        colors[e] = old;
      }
      if (bad < bestBad) bestBad = bad;
      if (bad === 0) { found += 1; break; }
    }
  }
  return { found, bestBad };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 592);
const rows = [];
for (const [n, attempts, steps] of [[12, 800, 150], [14, 900, 220], [16, 1200, 420], [17, 1400, 520]]) {
  const res = localSearchNoMonoTri(n, attempts, steps, rng);
  rows.push({
    n,
    attempts,
    local_steps_per_attempt: steps,
    colorings_without_monochromatic_triangle_found: res.found,
    found_probability: Number((res.found / attempts).toPrecision(8)),
    best_mono_triangle_count_seen: res.bestBad,
  });
}

const out = {
  problem: 'EP-592',
  script: path.basename(process.argv[1]),
  method: 'deeper_three_color_triangle_ramsey_proxy_random_search',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
