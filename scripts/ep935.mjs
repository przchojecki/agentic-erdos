#!/usr/bin/env node

function buildSpf(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i <= Math.floor(limit / i)) {
      for (let j = i * i; j <= limit; j += i) {
        if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function factorInto(x, spf, delta, expo, logState) {
  let v = x;
  while (v > 1) {
    const p = spf[v];
    let e = 0;
    while (v % p === 0) {
      v = Math.floor(v / p);
      e += 1;
    }
    const old = expo.get(p) || 0;
    const next = old + delta * e;

    if (old >= 2 && next < 2) logState.logQ2 -= old * Math.log(p);
    if (old < 2 && next >= 2) logState.logQ2 += next * Math.log(p);
    if (old >= 2 && next >= 2) logState.logQ2 += (next - old) * Math.log(p);

    if (next === 0) expo.delete(p);
    else expo.set(p, next);
  }
}

function analyzeEll(N, ell, spf) {
  const expo = new Map();
  const logState = { logQ2: 0 };

  for (let t = 0; t <= ell; t += 1) factorInto(2 + t, spf, +1, expo, logState);

  let best2 = { n: 2, value: Math.exp(logState.logQ2 - 2 * Math.log(2)) };
  let best201 = { n: 2, value: Math.exp(logState.logQ2 - 2.01 * Math.log(2)) };
  let best210 = { n: 2, value: Math.exp(logState.logQ2 - 2.1 * Math.log(2)) };

  const milestoneRows = [];
  const milestones = [
    1000,
    5000,
    10000,
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000,
    3000000,
  ].filter((m) => m <= N);
  const milestoneSet = new Set(milestones);

  for (let n = 2; n <= N; n += 1) {
    if (n > 2) {
      factorInto(n - 1, spf, -1, expo, logState);
      factorInto(n + ell, spf, +1, expo, logState);
    }

    const ln = Math.log(n);
    const r2 = Math.exp(logState.logQ2 - 2 * ln);
    const r201 = Math.exp(logState.logQ2 - 2.01 * ln);
    const r210 = Math.exp(logState.logQ2 - 2.1 * ln);

    if (r2 > best2.value) best2 = { n, value: r2 };
    if (r201 > best201.value) best201 = { n, value: r201 };
    if (r210 > best210.value) best210 = { n, value: r210 };

    if (milestoneSet.has(n)) {
      milestoneRows.push({ n, best_over_n2: best2.value, at_n: best2.n });
    }
  }

  return {
    ell,
    N,
    best_ratio_over_n2: best2,
    best_ratio_over_n2p01: best201,
    best_ratio_over_n2p10: best210,
    milestones: milestoneRows,
  };
}

function main() {
  const N = Number(process.env.NMAX || process.argv[2] || 3000000);
  const ellList = (process.env.ELL_LIST || process.argv[3] || '1,2,3,4,5,6')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 1);

  const maxEll = Math.max(...ellList);
  const spf = buildSpf(N + maxEll + 10);

  const rows = [];
  const t0 = Date.now();
  for (const ell of ellList) {
    const s0 = Date.now();
    const row = analyzeEll(N, ell, spf);
    const elapsed = ((Date.now() - s0) / 1000).toFixed(2);
    process.stderr.write(`ell=${ell} done in ${elapsed}s; best_n2=${row.best_ratio_over_n2.value.toExponential(6)} at n=${row.best_ratio_over_n2.n}\n`);
    rows.push(row);
  }

  const out = {
    problem: 'EP-935',
    method: 'standalone_sliding_window_exact_factor_exponents_for_Q2',
    params: { N, ell_list: ellList },
    runtime_sec: (Date.now() - t0) / 1000,
    rows,
    generated_utc: new Date().toISOString(),
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
