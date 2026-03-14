#!/usr/bin/env node

// EP-954
// Rosen sequence:
// a1=1, and a_{k+1} is smallest n such that
// #{(i,j): i<=j<=k, a_i+a_j<=n} < n-k.
// We compute finite initial segment and exact R(x) up to x=a_K.

function countPairsLE(a, k, x) {
  let i = 0;
  let j = k - 1;
  let cnt = 0;
  while (i <= j) {
    while (i <= j && a[i] + a[j] > x) j -= 1;
    if (i > j) break;
    cnt += (j - i + 1);
    i += 1;
  }
  return cnt;
}

function upperBound(arr, x) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function main() {
  const t0 = Date.now();

  const K = 3200;
  const a = [1];

  for (let k = 1; k < K; k += 1) {
    let n = a[k - 1] + 1;
    for (;;) {
      const c = countPairsLE(a, k, n);
      if (c < n - k) break;
      n += 1;
    }
    a.push(n);
  }

  const maxX = a[a.length - 1];
  const sums = [];

  for (let i = 0; i < K; i += 1) {
    for (let j = i; j < K; j += 1) {
      const s = a[i] + a[j];
      if (s > maxX) break;
      sums.push(s);
    }
  }
  sums.sort((u, v) => u - v);

  const idxs = [100, 200, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200];
  const rows = [];
  for (const kk of idxs) {
    const x = a[kk - 1];
    const r = upperBound(sums, x);
    const err = r - x;
    rows.push({
      k: kk,
      x: x,
      R_x: r,
      R_minus_x: err,
      abs_err_over_x_quarter: Number((Math.abs(err) / (x ** 0.25)).toFixed(8)),
      abs_err_over_sqrtx: Number((Math.abs(err) / Math.sqrt(x)).toFixed(8)),
    });
  }

  // Dense checkpoint sweep in x-space.
  const checkpoints = [];
  for (let t = 1; t <= 24; t += 1) {
    const x = Math.floor((t * maxX) / 24);
    const r = upperBound(sums, x);
    const err = r - x;
    checkpoints.push({
      x,
      R_x: r,
      R_minus_x: err,
      abs_err_over_x_quarter: Number((Math.abs(err) / (Math.max(1, x) ** 0.25)).toFixed(8)),
    });
  }

  const maxAbsErr = checkpoints.reduce((m, z) => Math.max(m, Math.abs(z.R_minus_x)), 0);

  const payload = {
    problem: 'EP-954',
    script: 'ep954.mjs',
    method: 'deep_direct_rosen_sequence_generation_and_exact_Rx_profile',
    warning: 'Finite initial segment only; asymptotic error term remains open.',
    params: { K },
    sequence_prefix_20: a.slice(0, 20),
    a_K: maxX,
    exact_Rx_at_a_k_checkpoints: rows,
    dense_x_checkpoints: checkpoints,
    max_abs_error_on_dense_checkpoints: maxAbsErr,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
