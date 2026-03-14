#!/usr/bin/env node

// EP-1130 deep standalone verification computation:
// Numerical maximization of Upsilon over interpolation nodes in [-1,1],
// and check of local-max equalization pattern lambda_i.

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
  for (let k = 1; k <= n; k += 1) {
    out.push(Math.cos(((2 * k - 1) * Math.PI) / (2 * n)));
  }
  out.sort((a, b) => a - b);
  return out;
}

function barycentricWeights(nodes) {
  const n = nodes.length;
  const w = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    let prod = 1.0;
    const xi = nodes[i];
    for (let j = 0; j < n; j += 1) {
      if (j === i) continue;
      prod *= (xi - nodes[j]);
    }
    w[i] = 1.0 / prod;
  }
  return w;
}

function lebesgueAtX(nodes, w, x) {
  const n = nodes.length;
  for (let i = 0; i < n; i += 1) {
    if (Math.abs(x - nodes[i]) < 1e-14) return 1.0;
  }

  let denom = 0.0;
  let numer = 0.0;
  for (let i = 0; i < n; i += 1) {
    const t = w[i] / (x - nodes[i]);
    denom += t;
    numer += Math.abs(t);
  }
  return Math.abs(numer / denom);
}

function evalUpsilon(nodes, gridPerInterval) {
  const sorted = nodes.slice().sort((a, b) => a - b);
  const ext = [-1, ...sorted, 1];
  const w = barycentricWeights(sorted);

  const lambdas = [];
  for (let i = 0; i < ext.length - 1; i += 1) {
    const L = ext[i];
    const R = ext[i + 1];
    let mx = 0;
    for (let g = 0; g <= gridPerInterval; g += 1) {
      const x = L + ((R - L) * g) / gridPerInterval;
      const val = lebesgueAtX(sorted, w, x);
      if (val > mx) mx = val;
    }
    lambdas.push(mx);
  }

  let ups = Infinity;
  for (const v of lambdas) if (v < ups) ups = v;
  let lamMin = Infinity;
  let lamMax = -Infinity;
  for (const v of lambdas) {
    if (v < lamMin) lamMin = v;
    if (v > lamMax) lamMax = v;
  }

  return {
    upsilon: ups,
    lambdas,
    lambda_min: lamMin,
    lambda_max: lamMax,
    lambda_spread: lamMax - lamMin,
  };
}

function randomStrictlyIncreasingNodes(n, rand) {
  const arr = [];
  for (let i = 0; i < n; i += 1) arr.push(rand() * 2 - 1);
  arr.sort((a, b) => a - b);
  // enforce spacing
  const eps = 1e-6;
  for (let i = 1; i < n; i += 1) {
    if (arr[i] <= arr[i - 1] + eps) arr[i] = Math.min(1 - eps * (n - i), arr[i - 1] + eps);
  }
  return arr;
}

function clampMonotone(arr) {
  const n = arr.length;
  const eps = 1e-6;
  arr[0] = Math.max(-1 + eps, Math.min(1 - eps * n, arr[0]));
  for (let i = 1; i < n; i += 1) {
    arr[i] = Math.max(arr[i], arr[i - 1] + eps);
  }
  for (let i = n - 2; i >= 0; i -= 1) {
    arr[i] = Math.min(arr[i], arr[i + 1] - eps);
  }
  arr[n - 1] = Math.min(arr[n - 1], 1 - eps);
}

function optimizeForN(n, budgetMs, rand, gridPerInterval) {
  const t0 = Date.now();

  let bestNodes = chebyshevNodes(n);
  let best = evalUpsilon(bestNodes, gridPerInterval);

  let evals = 1;
  let accepted = 0;
  let restarts = 0;

  while (Date.now() - t0 < budgetMs) {
    restarts += 1;
    let curNodes = randomStrictlyIncreasingNodes(n, rand);
    let cur = evalUpsilon(curNodes, gridPerInterval);
    evals += 1;

    if (cur.upsilon > best.upsilon) {
      best = cur;
      bestNodes = curNodes.slice();
    }

    let step = 0.18;
    for (let it = 0; it < 3000; it += 1) {
      if (Date.now() - t0 >= budgetMs) break;

      const cand = curNodes.slice();
      const idx = Math.floor(rand() * n);
      const delta = (rand() * 2 - 1) * step;
      cand[idx] += delta;
      clampMonotone(cand);

      const v = evalUpsilon(cand, gridPerInterval);
      evals += 1;

      const improve = v.upsilon > cur.upsilon;
      const accept = improve || rand() < 0.025;
      if (accept) {
        curNodes = cand;
        cur = v;
        accepted += 1;
        if (v.upsilon > best.upsilon) {
          best = v;
          bestNodes = cand.slice();
        }
      }
      step *= 0.9992;
      if (step < 0.0025) step = 0.0025;
    }
  }

  return {
    n,
    budget_ms: budgetMs,
    evals,
    accepted_moves: accepted,
    restarts,
    best_upsilon_found: Number(best.upsilon.toFixed(10)),
    best_over_log_n: Number((best.upsilon / Math.log(n)).toFixed(10)),
    lambda_min: Number(best.lambda_min.toFixed(10)),
    lambda_max: Number(best.lambda_max.toFixed(10)),
    lambda_spread: Number(best.lambda_spread.toFixed(10)),
    relative_lambda_spread: Number((best.lambda_spread / Math.max(1e-12, best.lambda_max)).toFixed(10)),
    best_nodes: bestNodes.map((x) => Number(x.toFixed(8))),
    elapsed_ms_for_n: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const nList = depth >= 4 ? [8, 10, 12, 14, 16, 18] : [6, 8, 10, 12, 14];
  const perNBudgetMs = depth >= 4 ? 18000 : 6000;
  const gridPerInterval = depth >= 4 ? 80 : 40;

  const rand = mulberry32(0x1130 ^ (depth * 1777));
  const rows = nList.map((n) => optimizeForN(n, perNBudgetMs, rand, gridPerInterval));

  const payload = {
    problem: 'EP-1130',
    script: 'ep1130.mjs',
    method: 'deep_numeric_node_optimization_for_upsilon_with_barycentric_lebesgue_evaluation',
    warning: 'Finite numeric optimization only; not a proof of global maximizers.',
    params: { depth, nList, perNBudgetMs, gridPerInterval },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
