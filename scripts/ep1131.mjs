#!/usr/bin/env node

// EP-1131 deep standalone computation:
// Numerical minimization of I(x1..xn)=int_{-1}^1 sum_k |l_k(x)|^2 dx.

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let z = t;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function chebyshevNodes(n) {
  const out = [];
  for (let k = 1; k <= n; k += 1) out.push(Math.cos(((2 * k - 1) * Math.PI) / (2 * n)));
  out.sort((a, b) => a - b);
  return out;
}

function equispacedNodes(n) {
  const out = [];
  for (let i = 1; i <= n; i += 1) out.push(-1 + (2 * i) / (n + 1));
  return out;
}

function randomNodes(n, rand) {
  const arr = [];
  for (let i = 0; i < n; i += 1) arr.push(rand() * 2 - 1);
  arr.sort((a, b) => a - b);
  return arr;
}

function clampMonotone(x) {
  const n = x.length;
  const eps = 1e-6;
  for (let i = 0; i < n; i += 1) {
    if (x[i] < -1 + eps) x[i] = -1 + eps;
    if (x[i] > 1 - eps) x[i] = 1 - eps;
  }
  x[0] = Math.max(-1 + eps, Math.min(x[0], 1 - eps * n));
  for (let i = 1; i < n; i += 1) x[i] = Math.max(x[i], x[i - 1] + eps);
  x[n - 1] = Math.min(x[n - 1], 1 - eps);
  for (let i = n - 2; i >= 0; i -= 1) {
    x[i] = Math.min(x[i], x[i + 1] - eps);
    if (x[i] < -1 + eps) x[i] = -1 + eps;
  }
}

function baryWeights(nodes) {
  const n = nodes.length;
  const w = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    let prod = 1.0;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      prod *= (nodes[i] - nodes[j]);
    }
    w[i] = 1.0 / prod;
  }
  return w;
}

function sumLkSq(nodes, w, x) {
  const n = nodes.length;
  for (let i = 0; i < n; i += 1) {
    if (Math.abs(x - nodes[i]) < 1e-13) return 1.0;
  }

  let denom = 0.0;
  for (let i = 0; i < n; i += 1) denom += w[i] / (x - nodes[i]);

  let s2 = 0.0;
  for (let i = 0; i < n; i += 1) {
    const li = (w[i] / (x - nodes[i])) / denom;
    s2 += li * li;
  }
  return s2;
}

function evalI(nodes, gridN) {
  const sorted = nodes.slice().sort((a, b) => a - b);
  const w = baryWeights(sorted);

  // Simpson over [-1,1] with gridN even.
  const m = gridN % 2 === 0 ? gridN : gridN + 1;
  const h = 2 / m;
  let sum = 0.0;
  for (let i = 0; i <= m; i += 1) {
    const x = -1 + i * h;
    const fx = sumLkSq(sorted, w, x);
    if (i === 0 || i === m) sum += fx;
    else if (i % 2 === 1) sum += 4 * fx;
    else sum += 2 * fx;
  }
  const I = (h / 3) * sum;
  return I;
}

function optimizeN(n, budgetMs, gridN, rand) {
  const t0 = Date.now();

  const starts = [
    chebyshevNodes(n),
    equispacedNodes(n),
    randomNodes(n, rand),
    randomNodes(n, rand),
    randomNodes(n, rand),
  ];

  let bestNodes = starts[0].slice();
  let bestI = evalI(bestNodes, gridN);
  let evals = 1;
  let accepted = 0;

  for (const s of starts) {
    const v = evalI(s, gridN);
    evals += 1;
    if (v < bestI) {
      bestI = v;
      bestNodes = s.slice();
    }
  }

  let curNodes = bestNodes.slice();
  let curI = bestI;
  let step = 0.12;

  while (Date.now() - t0 < budgetMs) {
    const cand = curNodes.slice();
    const idx = Math.floor(rand() * n);
    cand[idx] += (rand() * 2 - 1) * step;
    clampMonotone(cand);

    const v = evalI(cand, gridN);
    evals += 1;

    const delta = v - curI;
    const accept = delta <= 0 || rand() < Math.exp(-delta / Math.max(1e-6, step));
    if (accept) {
      curNodes = cand;
      curI = v;
      accepted += 1;
      if (v < bestI) {
        bestI = v;
        bestNodes = cand.slice();
      }
    }

    step *= 0.9995;
    if (step < 0.0015) step = 0.0015;
  }

  return {
    n,
    budget_ms: budgetMs,
    gridN,
    best_I_found: Number(bestI.toFixed(10)),
    two_minus_I: Number((2 - bestI).toFixed(10)),
    n_times_two_minus_I: Number((n * (2 - bestI)).toFixed(10)),
    n_over_log2_n_times_two_minus_I: Number(((n / Math.max(1e-12, Math.log(n) ** 2)) * (2 - bestI)).toFixed(10)),
    best_over_two_minus_2_over_2n_minus_1: Number((bestI / (2 - 2 / (2 * n - 1))).toFixed(10)),
    best_nodes: bestNodes.map((x) => Number(x.toFixed(8))),
    evals,
    accepted_moves: accepted,
    elapsed_ms_for_n: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const nList = depth >= 4 ? [8, 12, 16, 20, 24, 28, 32] : [6, 8, 10, 12, 14, 16];
  const perNBudgetMs = depth >= 4 ? 14000 : 5000;
  const gridN = depth >= 4 ? 1600 : 600;

  const rand = mulberry32(0x1131 ^ (depth * 919));
  const rows = nList.map((n) => optimizeN(n, perNBudgetMs, gridN, rand));

  const payload = {
    problem: 'EP-1131',
    script: 'ep1131.mjs',
    method: 'deep_numeric_minimization_of_integrated_squared_lagrange_fundamental_function_sum',
    warning: 'Finite numeric optimization only; no proof of global minimizers or exact asymptotic constant.',
    params: { depth, nList, perNBudgetMs, gridN },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
