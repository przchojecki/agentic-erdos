#!/usr/bin/env node

// EP-929
// Let S(k) be minimal x such that there is positive density of n with
// n+1,...,n+k all x-smooth (all prime factors <= x).
// Deep finite proxy via sliding-window maxima of largest-prime-factor values.

function largestPrimeFactorSieve(N) {
  const lpf = new Uint32Array(N + 1);
  for (let p = 2; p <= N; p += 1) {
    if (lpf[p] !== 0) continue;
    for (let m = p; m <= N; m += p) lpf[m] = p;
  }
  lpf[1] = 1;
  return lpf;
}

function profileForK(lpf, N, k, XMAX, epsList) {
  const endMax = N + k;
  const hist = new Uint32Array(XMAX + 1);

  const deq = new Int32Array(endMax + 5);
  let head = 0;
  let tail = 0;

  for (let end = 2; end <= endMax; end += 1) {
    while (tail > head && lpf[deq[tail - 1]] <= lpf[end]) tail -= 1;
    deq[tail] = end;
    tail += 1;

    const minIdx = end - k + 1;
    while (tail > head && deq[head] < minIdx) head += 1;

    if (end >= k + 1) {
      const m = lpf[deq[head]];
      if (m <= XMAX) hist[m] += 1;
    }
  }

  const goodByX = new Uint32Array(XMAX + 1);
  let run = 0;
  for (let x = 1; x <= XMAX; x += 1) {
    run += hist[x];
    goodByX[x] = run;
  }

  const total = N;
  const xAny = (() => {
    for (let x = 2; x <= XMAX; x += 1) if (goodByX[x] > 0) return x;
    return null;
  })();

  const xEps = {};
  for (const eps of epsList) {
    let ans = null;
    for (let x = 2; x <= XMAX; x += 1) {
      if (goodByX[x] / total >= eps) {
        ans = x;
        break;
      }
    }
    xEps[String(eps)] = ans;
  }

  const profile = [];
  for (let x = 2; x <= XMAX; x += 1) {
    profile.push({
      x,
      good_starts: goodByX[x],
      density: Number((goodByX[x] / total).toFixed(8)),
    });
  }

  return {
    k,
    N,
    XMAX,
    finite_min_x_with_any_occurrence: xAny,
    finite_min_x_by_density_threshold: xEps,
    profile,
  };
}

function main() {
  const t0 = Date.now();

  const N = 20_000_000;
  const KLIST = [6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];
  const XMAX = 120;
  const epsList = [1e-5, 5e-5, 1e-4, 2e-4];

  const L = N + KLIST[KLIST.length - 1] + 5;
  const lpf = largestPrimeFactorSieve(L);

  const rows = KLIST.map((k) => profileForK(lpf, N, k, XMAX, epsList));

  const trend = rows.map((r) => ({
    k: r.k,
    x_any: r.finite_min_x_with_any_occurrence,
    x_eps_1e_4: r.finite_min_x_by_density_threshold['0.0001'],
    x_eps_2e_4: r.finite_min_x_by_density_threshold['0.0002'],
  }));

  const payload = {
    problem: 'EP-929',
    script: 'ep929.mjs',
    method: 'deep_sliding_window_max_lpf_profile_for_finite_density_proxy_Sk',
    warning: 'Finite-N density proxy only; does not prove asymptotic S(k) bounds.',
    params: { N, KLIST, XMAX, epsList },
    rows,
    monotonicity_trend_summary: trend,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
