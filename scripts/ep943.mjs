#!/usr/bin/env node

// EP-943
// A = set of powerful numbers (every prime exponent >=2).
// Compute additive convolution r(n) = (1_A * 1_A)(n) on finite range and profile growth.

function buildSpf(N) {
  const spf = new Int32Array(N + 1);
  for (let i = 2; i <= N; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i <= N) {
      for (let j = i * i; j <= N; j += i) {
        if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function isPowerful(n, spf) {
  if (n === 1) return true;
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e === 1) return false;
  }
  return true;
}

function main() {
  const t0 = Date.now();

  const N = 50_000_000;
  const checkpoints = [1_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000];

  const spf = buildSpf(N);
  const powerful = [];
  for (let n = 1; n <= N; n += 1) {
    if (isPowerful(n, spf)) powerful.push(n);
  }

  const cnt = new Uint32Array(N + 1);
  for (let i = 0; i < powerful.length; i += 1) {
    const a = powerful[i];
    for (let j = 0; j < powerful.length; j += 1) {
      const s = a + powerful[j];
      if (s > N) break;
      cnt[s] += 1;
    }
  }

  const rows = [];
  let globalMax = 0;
  let argmax = 0;

  let ckIdx = 0;
  let prefixMax = 0;
  let prefixArgmax = 0;

  for (let n = 2; n <= N; n += 1) {
    if (cnt[n] > globalMax) {
      globalMax = cnt[n];
      argmax = n;
    }
    if (cnt[n] > prefixMax) {
      prefixMax = cnt[n];
      prefixArgmax = n;
    }

    if (ckIdx < checkpoints.length && n === checkpoints[ckIdx]) {
      const logn = Math.log(n);
      const ratio = prefixMax / Math.exp(Math.sqrt(logn));
      rows.push({
        N_prefix: n,
        max_r_n_up_to_prefix: prefixMax,
        argmax_n_up_to_prefix: prefixArgmax,
        max_over_logN2: Number((prefixMax / (logn * logn)).toFixed(8)),
        max_over_exp_sqrt_logN: Number(ratio.toFixed(8)),
      });
      ckIdx += 1;
    }
  }

  const top = [];
  for (let n = 2; n <= N; n += 1) {
    if (top.length < 30 || cnt[n] > top[top.length - 1].r_n) {
      top.push({ n, r_n: cnt[n] });
      top.sort((a, b) => b.r_n - a.r_n || a.n - b.n);
      if (top.length > 30) top.pop();
    }
  }

  const payload = {
    problem: 'EP-943',
    script: 'ep943.mjs',
    method: 'deep_finite_additive_convolution_profile_for_powerful_numbers',
    warning: 'Finite-range evidence only; does not prove n^{o(1)} bound.',
    params: { N, checkpoints },
    powerful_count_up_to_N: powerful.length,
    checkpoint_growth_profile: rows,
    global_max: {
      n: argmax,
      r_n: globalMax,
      r_over_logN2: Number((globalMax / (Math.log(argmax) ** 2)).toFixed(8)),
    },
    top_values: top,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
