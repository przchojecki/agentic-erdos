#!/usr/bin/env node

function buildSpf(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i <= Math.floor(limit / i)) {
      for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

function main() {
  const N = Number(process.env.N || process.argv[2] || 2000000);
  const X = (N + 1) * (N + 1);

  const B = Math.floor(Math.cbrt(X));
  const spf = buildSpf(B + 5);

  const squarefree = new Uint8Array(B + 1);
  squarefree.fill(1);
  squarefree[0] = 0;

  for (let b = 2; b <= B; b += 1) {
    let x = b;
    let ok = true;
    while (x > 1) {
      const p = spf[x] || x;
      x = Math.floor(x / p);
      if (x % p === 0) {
        ok = false;
        break;
      }
      while (x % p === 0) x = Math.floor(x / p);
    }
    squarefree[b] = ok ? 1 : 0;
  }

  const vals = [];
  for (let b = 1; b <= B; b += 1) {
    if (!squarefree[b]) continue;
    const b3 = b * b * b;
    const maxA = Math.floor(Math.sqrt(X / b3));
    for (let a = 1; a <= maxA; a += 1) vals.push(a * a * b3);
  }

  vals.sort((u, v) => u - v);
  const powerful = [];
  for (let i = 0; i < vals.length; i += 1) {
    if (i === 0 || vals[i] !== vals[i - 1]) powerful.push(vals[i]);
  }

  let l = 0;
  let r = 0;
  const freq = new Map();
  let maxH = 0;
  let argN = -1;

  const checkpoints = [
    50000,
    100000,
    250000,
    500000,
    1000000,
    2000000,
    5000000,
    10000000,
    20000000,
    50000000,
  ].filter((x) => x <= N);
  const checkpointSet = new Set(checkpoints);
  const checkpointRows = [];

  for (let n = 1; n <= N; n += 1) {
    const lo = n * n;
    const hi = (n + 1) * (n + 1);
    while (l < powerful.length && powerful[l] < lo) l += 1;
    if (r < l) r = l;
    while (r < powerful.length && powerful[r] < hi) r += 1;

    const h = r - l;
    freq.set(h, (freq.get(h) || 0) + 1);
    if (h > maxH) {
      maxH = h;
      argN = n;
    }

    if (checkpointSet.has(n)) {
      checkpointRows.push({
        n,
        h_n: h,
        running_max_h: maxH,
        density_h_eq_1: Number((((freq.get(1) || 0) / n)).toPrecision(7)),
      });
      process.stderr.write(`n=${n}, running_max_h=${maxH}\n`);
    }
  }

  const topFrequency = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 15)
    .map(([h, count]) => ({ h, count, density: Number((count / N).toPrecision(7)) }));

  const out = {
    problem: 'EP-942',
    method: 'standalone_exact_powerful_interval_profile',
    params: { N },
    X,
    counts: { powerful_up_to_X: powerful.length },
    max_h_found: maxH,
    first_n_attaining_max_h: argN,
    top_frequency_table: topFrequency,
    checkpoint_rows: checkpointRows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
