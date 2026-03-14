#!/usr/bin/env node

// EP-948 finite proxy.
// For random k-colorings on [1..M], search for increasing sequences a_1<...<a_L
// with a_i <= B*i and FS(a_i) missing at least one color.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function randomColoring(M, k, rng) {
  const col = new Int16Array(M + 1);
  for (let i = 1; i <= M; i += 1) col[i] = Math.floor(rng() * k);
  return col;
}

function existsSequenceLength(col, M, B, L, omittedColor) {
  const fsSums = [0];
  const chosen = [];

  function dfs(step, last) {
    if (step > L) return true;
    const maxA = Math.min(M, B * step);
    for (let a = last + 1; a <= maxA; a += 1) {
      if (col[a] === omittedColor) continue;

      let ok = true;
      for (let i = 0; i < fsSums.length; i += 1) {
        const t = fsSums[i] + a;
        if (t > M || col[t] === omittedColor) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      const oldLen = fsSums.length;
      for (let i = 0; i < oldLen; i += 1) fsSums.push(fsSums[i] + a);
      chosen.push(a);

      if (dfs(step + 1, a)) return true;

      chosen.pop();
      fsSums.length = oldLen;
    }
    return false;
  }

  return dfs(1, 0);
}

function maxLengthForColoring(col, M, B, k, Lcap) {
  let best = 0;
  let bestColor = null;
  for (let omitted = 0; omitted < k; omitted += 1) {
    let lo = 0;
    let hi = Lcap;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      if (existsSequenceLength(col, M, B, mid, omitted)) lo = mid;
      else hi = mid - 1;
    }
    if (lo > best) {
      best = lo;
      bestColor = omitted;
    }
  }
  return { bestL: best, omittedColor: bestColor };
}

function main() {
  const t0 = Date.now();

  const configs = [
    { k: 3, M: 240, B: 16, trials: 60, Lcap: 10 },
    { k: 3, M: 320, B: 20, trials: 50, Lcap: 11 },
    { k: 4, M: 280, B: 18, trials: 50, Lcap: 9 },
    { k: 5, M: 320, B: 20, trials: 40, Lcap: 8 },
  ];

  const rows = [];
  const examples = [];

  for (let ci = 0; ci < configs.length; ci += 1) {
    const cfg = configs[ci];
    let best = -1;
    let sum = 0;
    let atLeast6 = 0;

    for (let t = 0; t < cfg.trials; t += 1) {
      const rng = makeRng((20260314 ^ (ci * 4099) ^ (t * 65537) ^ (cfg.k * 131)) >>> 0);
      const col = randomColoring(cfg.M, cfg.k, rng);
      const out = maxLengthForColoring(col, cfg.M, cfg.B, cfg.k, cfg.Lcap);
      sum += out.bestL;
      if (out.bestL >= 6) atLeast6 += 1;
      if (out.bestL > best) {
        best = out.bestL;
        if (examples.length < 12) {
          examples.push({ config: cfg, trial: t, best_length: out.bestL, omitted_color: out.omittedColor });
        }
      }
    }

    rows.push({
      ...cfg,
      max_best_length_found: best,
      mean_best_length: Number((sum / cfg.trials).toFixed(6)),
      fraction_trials_with_best_length_at_least_6: Number((atLeast6 / cfg.trials).toFixed(6)),
    });
  }

  const payload = {
    problem: 'EP-948',
    script: 'ep948.mjs',
    method: 'deep_random_coloring_finite_sums_omitted_color_sequence_search',
    warning: 'Finite proxy only; not a proof/disproof of infinite theorem.',
    rows,
    representative_examples: examples,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
