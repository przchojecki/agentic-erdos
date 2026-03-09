#!/usr/bin/env node

function buildLpf(n) {
  const lpf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (lpf[i] !== 0) continue;
    for (let j = i; j <= n; j += i) lpf[j] = i;
  }
  return lpf;
}

function main() {
  const X = Number(process.env.X || process.argv[2] || 20000000);
  const ks = (process.env.K_LIST || process.argv[3] || '10,15,20,25,30,40,50,60,80,100,120,150,200,300,500,700,1000,1500,2000,3000,4000,5000')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 2)
    .sort((a, b) => a - b);

  const lpf = buildLpf(X);

  const run = new Int32Array(ks.length);
  const best = new Int32Array(ks.length);
  const bestStart = new Int32Array(ks.length);

  for (let n = 2; n <= X; n += 1) {
    const p = lpf[n];
    for (let i = 0; i < ks.length; i += 1) {
      const k = ks[i];
      if (n <= k || p > k) {
        run[i] = 0;
      } else {
        run[i] += 1;
        if (run[i] > best[i]) {
          best[i] = run[i];
          bestStart[i] = n - run[i] + 1;
        }
      }
    }
    if (n % 2000000 === 0) process.stderr.write(`n=${n}/${X}\n`);
  }

  const rows = ks.map((k, i) => {
    const r = best[i];
    const lowerBoundF = r + 1;
    return {
      k,
      scan_limit_X: X,
      max_run_observed: r,
      witness_interval: r > 0 ? [bestStart[i], bestStart[i] + r - 1] : null,
      lower_bound_on_f_k: lowerBoundF,
      known_upper_bound_f_k: k,
      exact_f_k_if_upper_bound_sharp: lowerBoundF === k ? k : null,
      normalized_ratio_r_logk_over_k: k > 1 ? Number(((r * Math.log(k)) / k).toPrecision(8)) : null,
    };
  });

  const out = {
    problem: 'EP-961',
    method: 'standalone_largest_observed_run_of_k_smooth_integers_up_to_X',
    params: { X, k_list: ks },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
