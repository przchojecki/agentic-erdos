#!/usr/bin/env node

// EP-1002 deep finite proxy:
// Empirical distribution of f(alpha,n) over random alpha in (0,1),
// where f(alpha,n)=(1/log n) * sum_{k<=n} (1/2-{alpha k}).

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function frac(x) {
  const y = x - Math.floor(x);
  return y < 0 ? y + 1 : y;
}

function quantile(sorted, q) {
  const idx = Math.floor(q * (sorted.length - 1));
  return sorted[idx];
}

function mean(a) {
  return a.reduce((s, x) => s + x, 0) / a.length;
}

function variance(a) {
  const m = mean(a);
  return a.reduce((s, x) => s + (x - m) * (x - m), 0) / a.length;
}

function cdfDistance(a, b) {
  const x = a.slice().sort((u, v) => u - v);
  const y = b.slice().sort((u, v) => u - v);
  let i = 0;
  let j = 0;
  let best = 0;
  while (i < x.length || j < y.length) {
    const vx = i < x.length ? x[i] : Infinity;
    const vy = j < y.length ? y[j] : Infinity;
    const v = Math.min(vx, vy);
    while (i < x.length && x[i] <= v) i += 1;
    while (j < y.length && y[j] <= v) j += 1;
    const d = Math.abs(i / x.length - j / y.length);
    if (d > best) best = d;
  }
  return best;
}

function main() {
  const t0 = Date.now();
  const rng = makeRng(20260314 ^ 1002);

  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const alphaSamples = 2400 * depth;
  const nList = [2000, 5000, 10000, 20000, 40000, 80000, 120000].map((n) => n * depth);

  const alpha = Array.from({ length: alphaSamples }, () => frac(rng() + Math.SQRT2 * rng()));

  const valuesByN = [];
  for (const n of nList) {
    const invLog = 1 / Math.log(n);
    const vals = new Float64Array(alphaSamples);

    for (let i = 0; i < alphaSamples; i += 1) {
      const a = alpha[i];
      let s = 0;
      for (let k = 1; k <= n; k += 1) s += 0.5 - frac(a * k);
      vals[i] = s * invLog;
    }
    valuesByN.push(Array.from(vals));
  }

  const rows = [];
  for (let i = 0; i < nList.length; i += 1) {
    const n = nList[i];
    const s = valuesByN[i].slice().sort((u, v) => u - v);
    rows.push({
      n,
      mean: Number(mean(s).toFixed(8)),
      variance: Number(variance(s).toFixed(8)),
      q05: Number(quantile(s, 0.05).toFixed(8)),
      q25: Number(quantile(s, 0.25).toFixed(8)),
      q50: Number(quantile(s, 0.50).toFixed(8)),
      q75: Number(quantile(s, 0.75).toFixed(8)),
      q95: Number(quantile(s, 0.95).toFixed(8)),
    });
  }

  const cdf_stability = [];
  for (let i = 1; i < nList.length; i += 1) {
    cdf_stability.push({
      n_prev: nList[i - 1],
      n_curr: nList[i],
      empirical_kolmogorov_distance: Number(cdfDistance(valuesByN[i - 1], valuesByN[i]).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1002',
    script: 'ep1002.mjs',
    method: 'deep_empirical_distribution_scan_for_kesten_special_case_beta0',
    warning: 'Finite Monte Carlo distribution proxy only; does not replace the theorem-level proof.',
    params: { alphaSamples, nList },
    rows,
    cdf_stability,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
