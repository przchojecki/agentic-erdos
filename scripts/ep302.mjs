#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseListInt(value, fallback, minVal = 6) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= minVal)
    .sort((a, b) => a - b);
  return out.length ? [...new Set(out)] : fallback;
}

function keyEdge(a, b, c) {
  const arr = [a, b, c].sort((x, y) => x - y);
  return `${arr[0]},${arr[1]},${arr[2]}`;
}

function buildForbiddenTriples(N) {
  const set = new Set();
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      const den = b - a;
      const num = a * b;
      if (num % den !== 0) continue;
      const c = num / den;
      if (c <= b || c > N) continue;
      if (c === a || c === b) continue;
      set.add(keyEdge(a, b, c));
    }
  }
  return [...set].map((s) => s.split(',').map(Number));
}

function exactMaxTripleFree(N, triples) {
  const incident = Array.from({ length: N + 1 }, () => []);
  for (let i = 0; i < triples.length; i += 1) {
    for (const v of triples[i]) incident[v].push(i);
  }

  const status = new Int8Array(N + 1); // 0 undecided, 1 in, -1 out
  let included = 0;
  let undecided = N;
  let best = 0;
  let bestSet = [];

  function canInclude(v) {
    for (const ti of incident[v]) {
      let allOtherIn = true;
      for (const u of triples[ti]) {
        if (u === v) continue;
        if (status[u] !== 1) {
          allOtherIn = false;
          break;
        }
      }
      if (allOtherIn) return false;
    }
    return true;
  }

  function pickVertex() {
    let bestV = -1;
    let bestDeg = -1;
    for (let v = 1; v <= N; v += 1) {
      if (status[v] !== 0) continue;
      const d = incident[v].length;
      if (d > bestDeg) {
        bestDeg = d;
        bestV = v;
      }
    }
    return bestV;
  }

  function dfs() {
    if (included + undecided <= best) return;
    if (undecided === 0) {
      if (included > best) {
        best = included;
        bestSet = [];
        for (let v = 1; v <= N; v += 1) if (status[v] === 1) bestSet.push(v);
      }
      return;
    }
    const v = pickVertex();
    if (v < 0) {
      if (included > best) {
        best = included;
        bestSet = [];
        for (let vv = 1; vv <= N; vv += 1) if (status[vv] === 1) bestSet.push(vv);
      }
      return;
    }

    if (canInclude(v)) {
      status[v] = 1;
      included += 1;
      undecided -= 1;
      dfs();
      undecided += 1;
      included -= 1;
      status[v] = 0;
    }

    status[v] = -1;
    undecided -= 1;
    dfs();
    undecided += 1;
    status[v] = 0;
  }

  dfs();
  return { best, bestSet };
}

function intervalConstructionSize(N) {
  const lo = Math.floor((N + 1) / 2);
  return N - lo + 1;
}

const N_LIST = parseListInt(process.env.N_LIST, [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  const triples = buildForbiddenTriples(N);
  const solved = exactMaxTripleFree(N, triples);
  const fN = solved.best;
  const intervalLB = intervalConstructionSize(N);
  rows.push({
    N,
    forbidden_triples: triples.length,
    f_N_exact: fN,
    density_exact: Number((fN / N).toFixed(8)),
    interval_lower_bound_size: intervalLB,
    interval_lower_bound_density: Number((intervalLB / N).toFixed(8)),
    exact_minus_interval_lb: fN - intervalLB,
    witness_set_size: solved.bestSet.length,
    witness_set_head: solved.bestSet.slice(0, 24),
  });
}

const out = {
  problem: 'EP-302',
  script: path.basename(process.argv[1]),
  method: 'exact_branch_and_bound_max_subset_avoiding_1_over_a_equals_1_over_b_plus_1_over_c',
  params: { N_LIST },
  rows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
