#!/usr/bin/env node

// EP-1071 deep standalone computation:
// finite maximal families of pairwise-disjoint unit segments in [0,1]^2.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function bitIndex(b) {
  let i = 0;
  let x = b;
  while ((x & 1n) === 0n) { x >>= 1n; i += 1; }
  return i;
}

function popcnt(x) {
  let c = 0;
  let v = x;
  while (v) { v &= v - 1n; c += 1; }
  return c;
}

function randomUnitSegmentInSquare(rng) {
  const theta = Math.PI * rng();
  const dx = Math.cos(theta);
  const dy = Math.sin(theta);
  const hx = Math.abs(dx) * 0.5;
  const hy = Math.abs(dy) * 0.5;
  if (hx > 0.5 || hy > 0.5) return null;
  const mx = hx + (1 - 2 * hx) * rng();
  const my = hy + (1 - 2 * hy) * rng();
  return {
    x1: mx - dx * 0.5,
    y1: my - dy * 0.5,
    x2: mx + dx * 0.5,
    y2: my + dy * 0.5,
  };
}

function orient(ax, ay, bx, by, cx, cy) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

function onSegment(ax, ay, bx, by, cx, cy, eps) {
  return Math.min(ax, bx) - eps <= cx && cx <= Math.max(ax, bx) + eps
    && Math.min(ay, by) - eps <= cy && cy <= Math.max(ay, by) + eps;
}

function segmentsIntersect(s, t, eps = 1e-12) {
  const o1 = orient(s.x1, s.y1, s.x2, s.y2, t.x1, t.y1);
  const o2 = orient(s.x1, s.y1, s.x2, s.y2, t.x2, t.y2);
  const o3 = orient(t.x1, t.y1, t.x2, t.y2, s.x1, s.y1);
  const o4 = orient(t.x1, t.y1, t.x2, t.y2, s.x2, s.y2);

  if ((o1 > eps && o2 < -eps || o1 < -eps && o2 > eps)
    && (o3 > eps && o4 < -eps || o3 < -eps && o4 > eps)) return true;

  if (Math.abs(o1) <= eps && onSegment(s.x1, s.y1, s.x2, s.y2, t.x1, t.y1, eps)) return true;
  if (Math.abs(o2) <= eps && onSegment(s.x1, s.y1, s.x2, s.y2, t.x2, t.y2, eps)) return true;
  if (Math.abs(o3) <= eps && onSegment(t.x1, t.y1, t.x2, t.y2, s.x1, s.y1, eps)) return true;
  if (Math.abs(o4) <= eps && onSegment(t.x1, t.y1, t.x2, t.y2, s.x2, s.y2, eps)) return true;
  return false;
}

function buildConflictMasks(segments) {
  const n = segments.length;
  const masks = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (segmentsIntersect(segments[i], segments[j])) {
        masks[i] |= 1n << BigInt(j);
        masks[j] |= 1n << BigInt(i);
      }
    }
  }
  return masks;
}

function complementMasks(masks) {
  const n = masks.length;
  const all = (1n << BigInt(n)) - 1n;
  const comp = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) comp[i] = (all ^ masks[i]) & ~(1n << BigInt(i));
  return comp;
}

function greedyColorOrder(P, adj) {
  const order = [];
  const colors = [];
  let U = P;
  let color = 0;
  while (U) {
    color += 1;
    let Q = U;
    while (Q) {
      const b = Q & -Q;
      const v = bitIndex(b);
      order.push(v);
      colors.push(color);
      U &= ~b;
      Q &= ~b;
      Q &= ~adj[v];
    }
  }
  return { order, colors };
}

function maxCliqueWithSet(adj, msBudget, nodeCap) {
  const n = adj.length;
  const all = n ? ((1n << BigInt(n)) - 1n) : 0n;
  const t0 = Date.now();

  let best = 0;
  let bestSet = 0n;
  let nodes = 0;
  let timedOut = false;

  function expand(P, curSet, size) {
    nodes += 1;
    if (nodes >= nodeCap || Date.now() - t0 > msBudget) { timedOut = true; return; }
    if (!P) {
      if (size > best) {
        best = size;
        bestSet = curSet;
      }
      return;
    }

    const { order, colors } = greedyColorOrder(P, adj);
    for (let i = order.length - 1; i >= 0; i -= 1) {
      if (size + colors[i] <= best) return;
      const v = order[i];
      const b = 1n << BigInt(v);
      if ((P & b) === 0n) continue;
      expand(P & adj[v], curSet | b, size + 1);
      if (timedOut) return;
      P &= ~b;
    }
  }

  expand(all, 0n, 0);
  return { omega: best, setMask: bestSet, timedOut, nodes, elapsed_ms: Date.now() - t0 };
}

function isCompatibleWithSet(seg, setMask, pool) {
  let m = setMask;
  while (m) {
    const b = m & -m;
    const i = bitIndex(b);
    m ^= b;
    if (segmentsIntersect(seg, pool[i])) return false;
  }
  return true;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1071 ^ (depth * 12289));

  const trials = 500 * depth;
  const candidateCount = 220 + 16 * depth;
  const cliqueBudgetMs = 700 + 40 * depth;
  const cliqueNodeCap = 1_200_000 + 80_000 * depth;

  let best = null;
  const probeRows = [];

  for (let t = 0; t < trials; t += 1) {
    const segs = [];
    while (segs.length < candidateCount) {
      const s = randomUnitSegmentInSquare(rng);
      if (s) segs.push(s);
    }

    const conflict = buildConflictMasks(segs);
    const comp = complementMasks(conflict);
    const cl = maxCliqueWithSet(comp, cliqueBudgetMs, cliqueNodeCap);
    const alpha = cl.omega;

    // sampled maximality stress check against extra random segments
    let extensionFound = false;
    for (let j = 0; j < 1200; j += 1) {
      const s = randomUnitSegmentInSquare(rng);
      if (s && isCompatibleWithSet(s, cl.setMask, segs)) {
        extensionFound = true;
        break;
      }
    }

    const row = {
      trial: t,
      candidate_count: candidateCount,
      best_disjoint_family_size_found: alpha,
      ratio_alpha_over_candidates: Number((alpha / candidateCount).toFixed(8)),
      clique_timed_out: cl.timedOut,
      clique_nodes: cl.nodes,
      extension_found_in_1200_random_attempts: extensionFound,
    };
    if (probeRows.length < 20) probeRows.push(row);

    if (!best || alpha > best.best_disjoint_family_size_found) best = row;
  }

  const payload = {
    problem: 'EP-1071',
    script: 'ep1071.mjs',
    method: 'deep_random_geometric_unit_segment_packing_with_bounded_exact_mis_on_conflict_graphs',
    warning: 'Finite random-candidate proxy only; not a proof for the infinite maximal-family question.',
    params: { depth, trials, candidateCount, cliqueBudgetMs, cliqueNodeCap },
    rows: [
      {
        best_trial_summary: best,
        probe_rows_first20: probeRows,
      },
    ],
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
