#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const SAMPLES = Number(process.env.SAMPLES || 400);
const MAX_N = Number(process.env.MAX_N || 9);
const MAX_FAMILY_SIZE = Number(process.env.MAX_FAMILY_SIZE || 30);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}

const rng = makeRng(20260312 ^ 701);

function randomDownset(n, maxFamilySize) {
  const tops = [];
  const topCount = 1 + Math.floor(rng() * (n + 3));
  for (let t = 0; t < topCount; t += 1) {
    let m = 0;
    for (let b = 0; b < n; b += 1) if (rng() < 0.33) m |= (1 << b);
    tops.push(m);
  }

  const F = new Set([0]);
  for (const m of tops) {
    let s = m;
    while (true) {
      F.add(s);
      if (s === 0) break;
      s = (s - 1) & m;
      if (F.size > maxFamilySize * 3) break;
    }
    if (F.size > maxFamilySize * 3) break;
  }

  const arr = [...F];
  if (arr.length <= maxFamilySize) return arr;

  // fallback: keep random top and close below it
  const keep = tops.length ? tops[Math.floor(rng() * tops.length)] : 0;
  const G = [0];
  let s = keep;
  while (true) {
    G.push(s);
    if (s === 0) break;
    s = (s - 1) & keep;
    if (G.length > maxFamilySize) break;
  }
  return [...new Set(G)];
}

function maxIntersectingExact(family) {
  const verts = family.filter((x) => x !== 0);
  const m = verts.length;
  if (m === 0) return 0;

  // Build compatibility matrix for intersection graph.
  const comp = Array.from({ length: m }, () => Array(m).fill(false));
  for (let i = 0; i < m; i += 1) {
    comp[i][i] = true;
    for (let j = i + 1; j < m; j += 1) {
      const ok = (verts[i] & verts[j]) !== 0;
      comp[i][j] = ok;
      comp[j][i] = ok;
    }
  }

  let best = 0;
  function dfs(cands, size) {
    if (size + cands.length <= best) return;
    if (cands.length === 0) {
      if (size > best) best = size;
      return;
    }

    while (cands.length > 0) {
      if (size + cands.length <= best) return;
      const v = cands.pop();
      const next = [];
      for (const u of cands) if (comp[v][u]) next.push(u);
      dfs(next, size + 1);
    }
  }

  dfs(Array.from({ length: m }, (_, i) => i), 0);
  return best;
}

function bestStar(family, n) {
  let best = 0;
  for (let x = 0; x < n; x += 1) {
    const b = 1 << x;
    let c = 0;
    for (const s of family) if ((s & b) !== 0) c += 1;
    if (c > best) best = c;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
let worst = null;

for (let n = 5; n <= MAX_N; n += 1) {
  let violations = 0;
  let avgGap = 0;
  let maxViolation = null;

  for (let t = 0; t < SAMPLES; t += 1) {
    const F = randomDownset(n, MAX_FAMILY_SIZE);
    const mInt = maxIntersectingExact(F);
    const star = bestStar(F, n);
    const gap = star - mInt;
    avgGap += gap;

    if (gap < 0) {
      violations += 1;
      const rec = { n, family_size: F.length, star, max_intersecting: mInt, gap };
      if (!maxViolation || gap < maxViolation.gap) maxViolation = rec;
      if (!worst || gap < worst.gap) worst = rec;
    }
  }

  rows.push({
    n,
    samples: SAMPLES,
    max_family_size: MAX_FAMILY_SIZE,
    violations_of_star_bound: violations,
    violation_rate: Number((violations / SAMPLES).toPrecision(8)),
    avg_star_minus_max_intersecting: Number((avgGap / SAMPLES).toPrecision(8)),
    worst_violation_for_n: maxViolation,
  });
}

const out = {
  problem: 'EP-701',
  script: path.basename(process.argv[1]),
  method: 'exact_max_intersecting_vs_best_star_on_random_downsets',
  params: { SAMPLES, MAX_N, MAX_FAMILY_SIZE },
  rows,
  worst_overall_violation: worst,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
