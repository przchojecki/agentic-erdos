#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

// State per unordered pair: 0 = no edge, 1 = i->j, 2 = j->i
function randomDigraph(n, rng, probs = [0.34, 0.33, 0.33]) {
  const a = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const r = rng();
      if (r < probs[0]) continue;
      if (r < probs[0] + probs[1]) a[i][j] = 1;
      else a[j][i] = 1;
    }
  }
  return a;
}

function maxIndependentSetSize(a) {
  const n = a.length;
  const total = 1 << n;
  let best = 0;
  for (let mask = 1; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz <= best) continue;
    let ok = true;
    for (let i = 0; i < n && ok; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (!((mask >>> j) & 1)) continue;
        if (a[i][j] || a[j][i]) {
          ok = false;
          break;
        }
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function isTransitiveTournamentOnSubset(a, verts) {
  const m = verts.length;
  let edges = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      const u = verts[i], v = verts[j];
      if ((a[u][v] ? 1 : 0) + (a[v][u] ? 1 : 0) !== 1) return false;
      edges += 1;
    }
  }
  if (edges !== (m * (m - 1)) / 2) return false;

  // acyclic tournament check via indegree set == {0..m-1}
  const indeg = Array(m).fill(0);
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < m; j += 1) if (i !== j && a[verts[j]][verts[i]]) indeg[i] += 1;
  }
  indeg.sort((x, y) => x - y);
  for (let i = 0; i < m; i += 1) if (indeg[i] !== i) return false;
  return true;
}

function hasTransitiveTournament(a, m) {
  const n = a.length;
  const cur = [];
  let found = false;
  function rec(start, need) {
    if (found) return;
    if (need === 0) {
      if (isTransitiveTournamentOnSubset(a, cur)) found = true;
      return;
    }
    for (let v = start; v <= n - need; v += 1) {
      cur.push(v);
      rec(v + 1, need - 1);
      cur.pop();
      if (found) return;
    }
  }
  rec(0, m);
  return found;
}

function avoidsProperty(a, nTarget, mTarget) {
  const alpha = maxIndependentSetSize(a);
  if (alpha >= nTarget) return false;
  if (hasTransitiveTournament(a, mTarget)) return false;
  return true;
}

const TASKS = (process.env.TASKS || '3,3;4,3;4,4').split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
  const [n, m] = s.split(',').map((x) => Number(x.trim()));
  return { nTarget: n, mTarget: m };
});
const K_SCAN = (process.env.K_SCAN || '4,5,6,7,8,9').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 1600);
const SEED = Number(process.env.SEED || 11202026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const task of TASKS) {
  let maxCounterexampleK = null;
  for (const k of K_SCAN) {
    let found = false;
    for (let s = 0; s < SAMPLES; s += 1) {
      const a = randomDigraph(k, rng);
      if (avoidsProperty(a, task.nTarget, task.mTarget)) {
        found = true;
        break;
      }
    }
    if (found) maxCounterexampleK = k;
  }

  rows.push({
    n_target: task.nTarget,
    m_target: task.mTarget,
    max_k_with_found_counterexample_in_samples: maxCounterexampleK,
    empirical_lower_bound_for_k_n_m: maxCounterexampleK === null ? null : maxCounterexampleK + 1,
    samples_per_k: SAMPLES,
  });
}

const out = {
  problem: 'EP-112',
  script: path.basename(process.argv[1]),
  method: 'empirical_extremal_digraph_search_for_k_n_m',
  params: { TASKS, K_SCAN, SAMPLES, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
