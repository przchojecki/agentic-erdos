#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function chromaticNumber(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const ord = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);

  function colorable(k) {
    const col = new Int16Array(n);
    col.fill(-1);

    function dfs(t) {
      if (t === n) return true;
      const v = ord[t];
      for (let c = 0; c < k; c += 1) {
        let ok = true;
        for (const u of adj[v]) {
          if (col[u] === c) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        col[v] = c;
        if (dfs(t + 1)) return true;
        col[v] = -1;
      }
      return false;
    }

    return dfs(0);
  }

  for (let k = 1; k <= n; k += 1) if (colorable(k)) return k;
  return n;
}

function unitEdges(points, eps = 1e-9) {
  const out = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      if (Math.abs(dx * dx + dy * dy - 1) <= eps) out.push([i, j]);
    }
  }
  return out;
}

function hexPatchPoints(R) {
  const pts = [];
  const s3 = Math.sqrt(3) / 2;
  for (let a = -R; a <= R; a += 1) {
    for (let b = -R; b <= R; b += 1) {
      const x = a + 0.5 * b;
      const y = s3 * b;
      if (Math.abs(a + b) <= R) pts.push([x, y]);
    }
  }
  return pts;
}

function inducedSubgraphByIndices(edges, idxSet, nAll) {
  const mark = new Int8Array(nAll);
  for (const i of idxSet) mark[i] = 1;
  const remap = new Map();
  idxSet.forEach((v, i) => remap.set(v, i));
  const sub = [];
  for (const [u, v] of edges) {
    if (mark[u] && mark[v]) sub.push([remap.get(u), remap.get(v)]);
  }
  return sub;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

const t0 = Date.now();
const rows = [];

const s = Math.sqrt(3) / 2;
const t = 0.5856855434571508;
const moserPts = [
  [0, 0],
  [1, 0],
  [0.5, s],
  [1.5, s],
  [Math.cos(t), Math.sin(t)],
  [Math.cos(t + Math.PI / 3), Math.sin(t + Math.PI / 3)],
  [Math.cos(t) + Math.cos(t + Math.PI / 3), Math.sin(t) + Math.sin(t + Math.PI / 3)],
];
const moserEdges = unitEdges(moserPts);
rows.push({
  graph: 'moser_spindle_7v',
  vertices: moserPts.length,
  edges: moserEdges.length,
  chromatic_number_exact: chromaticNumber(moserPts.length, moserEdges),
});

const rng = makeRng(20260312 ^ 508);
for (const R of [3, 4, 5]) {
  const pts = hexPatchPoints(R);
  const e = unitEdges(pts);
  const nAll = pts.length;

  const k = R === 3 ? 14 : R === 4 ? 20 : 26;
  const samples = R === 5 ? 120 : 180;
  let bestChi = 0;
  let bestEdges = 0;

  for (let sidx = 0; sidx < samples; sidx += 1) {
    const ord = Array.from({ length: nAll }, (_, i) => i);
    shuffle(ord, rng);
    const pick = ord.slice(0, k);
    const sub = inducedSubgraphByIndices(e, pick, nAll);
    const chi = chromaticNumber(k, sub);
    if (chi > bestChi || (chi === bestChi && sub.length > bestEdges)) {
      bestChi = chi;
      bestEdges = sub.length;
    }
  }

  rows.push({
    graph: `hex_patch_R${R}_random_induced_size_${k}`,
    ambient_vertices: nAll,
    ambient_edges: e.length,
    random_samples: samples,
    best_chromatic_number_found: bestChi,
    edge_count_for_best_sample: bestEdges,
  });
}

const out = {
  problem: 'EP-508',
  script: path.basename(process.argv[1]),
  method: 'deep_exact_coloring_on_benchmark_and_hex_patch_induced_unit_distance_graphs',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
