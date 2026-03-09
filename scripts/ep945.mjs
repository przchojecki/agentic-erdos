#!/usr/bin/env node

function computeTauLinear(X) {
  const lp = new Uint32Array(X + 1);
  const cnt = new Uint16Array(X + 1);
  const rem = new Uint32Array(X + 1);
  const tau = new Uint16Array(X + 1);
  const primes = [];

  tau[1] = 1;
  rem[1] = 1;

  for (let i = 2; i <= X; i += 1) {
    if (lp[i] === 0) {
      lp[i] = i;
      cnt[i] = 1;
      rem[i] = 1;
      tau[i] = 2;
      primes.push(i);
    }

    for (let j = 0; j < primes.length; j += 1) {
      const p = primes[j];
      const v = i * p;
      if (v > X) break;
      lp[v] = p;

      if (p === lp[i]) {
        cnt[v] = cnt[i] + 1;
        rem[v] = rem[i];
        tau[v] = tau[rem[v]] * (cnt[v] + 1);
        break;
      } else {
        cnt[v] = 1;
        rem[v] = i;
        tau[v] = tau[i] * 2;
      }
    }

    if (i % 5000000 === 0) process.stderr.write(`tau built to i=${i}\n`);
  }

  return tau;
}

function main() {
  const X = Number(process.env.X || process.argv[2] || 30000000);
  const tau = computeTauLinear(X);

  let maxTau = 0;
  for (let i = 1; i <= X; i += 1) {
    if (tau[i] > maxTau) maxTau = tau[i];
  }

  const lastPos = new Int32Array(maxTau + 1);
  lastPos.fill(0);

  let left = 1;
  let bestLen = 0;
  let bestRange = [1, 1];

  const checkpoints = [
    100000,
    500000,
    1000000,
    2000000,
    5000000,
    10000000,
    20000000,
    30000000,
  ].filter((v) => v <= X);
  const checkpointSet = new Set(checkpoints);
  const rows = [];

  for (let i = 1; i <= X; i += 1) {
    const t = tau[i];
    if (lastPos[t] >= left) left = lastPos[t] + 1;
    lastPos[t] = i;

    const len = i - left + 1;
    if (len > bestLen) {
      bestLen = len;
      bestRange = [left, i];
    }

    if (checkpointSet.has(i)) {
      rows.push({
        x: i,
        F_x_finite_proxy: bestLen,
        over_log_x: Number((bestLen / Math.log(i)).toPrecision(7)),
        best_range_up_to_x: bestRange,
      });
      process.stderr.write(`x=${i}, F(x)=${bestLen}\n`);
    }
  }

  const witness = [];
  for (let n = bestRange[0]; n <= bestRange[1]; n += 1) {
    witness.push({ n, tau_n: tau[n] });
  }

  const out = {
    problem: 'EP-945',
    method: 'standalone_linear_sieve_tau_and_distinct_window_profile',
    params: { X },
    max_tau_up_to_X: maxTau,
    best_run: {
      length: bestLen,
      range: bestRange,
      witness_tau_values: witness,
    },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
