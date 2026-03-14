#!/usr/bin/env node
import fs from 'fs';

// EP-892 finite probe:
// for candidate b_n growth models, test if we can greedily build primitive a_n <= C*b_n.
const OUT = process.env.OUT || 'data/ep892_standalone_deeper.json';
const M = 800;
const C_LIST = [1.5, 2, 3, 5, 8];

function makeBn(kind, m) {
  const b = new Int32Array(m + 1);
  for (let n = 1; n <= m; n += 1) {
    if (kind === 'linear') b[n] = n;
    else if (kind === 'nlogn') b[n] = Math.max(1, Math.floor(n * Math.log(n + 2)));
    else if (kind === 'n_log2') b[n] = Math.max(1, Math.floor(n * (Math.log(n + 2) ** 2)));
    else if (kind === 'quadratic') b[n] = n * n;
    else b[n] = 1 << Math.min(29, Math.floor(Math.log2(n + 1)));
  }
  return b;
}

function isPrimitiveWith(x, A) {
  for (const y of A) if (x % y === 0 || y % x === 0) return false;
  return true;
}

function greedyPrimitive(b, C) {
  const A = [];
  let ptr = 2;
  for (let n = 1; n < b.length; n += 1) {
    const lim = Math.max(2, Math.floor(C * b[n]));
    if (ptr > lim) return { built: n - 1, fail_at: n };
    let found = false;
    for (let x = ptr; x <= lim; x += 1) {
      if (isPrimitiveWith(x, A)) {
        A.push(x);
        ptr = x + 1;
        found = true;
        break;
      }
    }
    if (!found) return { built: n - 1, fail_at: n };
  }
  return { built: b.length - 1, fail_at: null };
}

const t0 = Date.now();
const kinds = ['linear', 'nlogn', 'n_log2', 'quadratic', 'powers2'];
const rows = [];
for (const kind of kinds) {
  const b = makeBn(kind, M);
  for (const C of C_LIST) {
    const res = greedyPrimitive(b, C);
    rows.push({
      b_model: kind,
      C,
      target_terms: M,
      built_terms: res.built,
      fail_at_index: res.fail_at,
      success_full_prefix: res.built === M,
    });
  }
}

const out = {
  problem: 'EP-892',
  script: 'ep892.mjs',
  method: 'finite_greedy_feasibility_probe_for_primitive_sequences_under_an_bound',
  warning: 'Finite heuristic probe only; not a characterization theorem.',
  params: { M, C_LIST, models: kinds },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
