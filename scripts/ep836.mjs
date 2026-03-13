#!/usr/bin/env node
import fs from 'fs';

// EP-836: finite verification of the Alon-type construction profile.
const OUT = process.env.OUT || 'data/ep836_standalone_deeper.json';
const R_LIST = [3, 4, 5, 6];

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function dfs(i, left) {
    if (left === 0) {
      out.push(cur.slice());
      return;
    }
    for (let j = i; j <= arr.length - left; j += 1) {
      cur.push(arr[j]);
      dfs(j + 1, left - 1);
      cur.pop();
    }
  }
  dfs(0, k);
  return out;
}

function buildAlonLike(r) {
  const X = Array.from({ length: 2 * r - 2 }, (_, i) => `x${i}`);
  const allRinX = combinations(X, r);

  const half = r - 1;
  const halfSubs = combinations(X, half);
  const idx = new Map(halfSubs.map((s, i) => [s.join(','), i]));
  const used = new Set();
  const Y = [];
  const partitions = [];
  for (const A of halfSubs) {
    const setA = new Set(A);
    const B = X.filter((v) => !setA.has(v));
    const ka = A.join(',');
    const kb = B.join(',');
    if (used.has(ka) || used.has(kb)) continue;
    used.add(ka);
    used.add(kb);
    const y = `y${Y.length}`;
    Y.push(y);
    partitions.push({ y, A, B });
  }

  const edges = [];
  for (const e of allRinX) edges.push(e);
  for (const p of partitions) {
    edges.push([p.y, ...p.A]);
    edges.push([p.y, ...p.B]);
  }

  return { X, Y, V: X.concat(Y), edges };
}

function pairwiseIntersecting(edges) {
  for (let i = 0; i < edges.length; i += 1) {
    const si = new Set(edges[i]);
    for (let j = i + 1; j < edges.length; j += 1) {
      let ok = false;
      for (const v of edges[j]) if (si.has(v)) {
        ok = true;
        break;
      }
      if (!ok) return false;
    }
  }
  return true;
}

function hasProperColoringK(V, edges, k) {
  const n = V.length;
  const col = new Int8Array(n).fill(-1);
  const pos = new Map(V.map((v, i) => [v, i]));
  const eidx = edges.map((e) => e.map((v) => pos.get(v)));

  function badEdge(e) {
    const c0 = col[e[0]];
    if (c0 < 0) return false;
    for (let i = 1; i < e.length; i += 1) if (col[e[i]] !== c0) return false;
    return true;
  }
  function dfs(i) {
    if (i === n) return true;
    for (let c = 0; c < k; c += 1) {
      col[i] = c;
      let good = true;
      for (const e of eidx) {
        if (e.includes(i) && badEdge(e)) {
          good = false;
          break;
        }
      }
      if (good && dfs(i + 1)) return true;
    }
    col[i] = -1;
    return false;
  }
  return dfs(0);
}

const t0 = Date.now();
const rows = [];
for (const r of R_LIST) {
  const H = buildAlonLike(r);
  const Vn = H.V.length;
  const En = H.edges.length;
  const intersecting = pairwiseIntersecting(H.edges);
  let twoColorable = null;
  let threeColorable = null;
  if (Vn <= 24) {
    twoColorable = hasProperColoringK(H.V, H.edges, 2);
    threeColorable = hasProperColoringK(H.V, H.edges, 3);
  }
  rows.push({
    r,
    vertex_count: Vn,
    edge_count: En,
    pairwise_intersecting_verified: intersecting,
    two_colorable_checked: twoColorable,
    three_colorable_checked: threeColorable,
    y_size: H.Y.length,
    x_size: H.X.length,
  });
}

const out = {
  problem: 'EP-836',
  script: 'ep836.mjs',
  method: 'finite_verification_of_alon_style_counterexample_family',
  params: { R_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
