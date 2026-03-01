#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function frac(x) {
  return x - Math.floor(x);
}

function vanDerCorput(i, base = 2) {
  let n = i;
  let denom = 1;
  let v = 0;
  while (n > 0) {
    denom *= base;
    v += (n % base) / denom;
    n = Math.floor(n / base);
  }
  return v;
}

function buildSequence(name, N) {
  const x = new Float64Array(N + 1);
  if (name === 'arithmetic_alpha_sqrt2') {
    const alpha = Math.sqrt(2) - 1;
    for (let j = 1; j <= N; j += 1) x[j] = frac(j * alpha);
    return x;
  }
  if (name === 'van_der_corput_base2') {
    for (let j = 1; j <= N; j += 1) x[j] = vanDerCorput(j, 2);
    return x;
  }
  if (name === 'quadratic_mod1') {
    const alpha = Math.sqrt(3) - 1;
    for (let j = 1; j <= N; j += 1) x[j] = frac(alpha * j * j);
    return x;
  }
  throw new Error(`unknown sequence ${name}`);
}

function scanAk(sequenceName, N, K) {
  const x = buildSequence(sequenceName, N);
  const rows = [];

  for (let k = 1; k <= K; k += 1) {
    let re = 0;
    let im = 0;
    let maxAbs = 0;
    let argMaxN = 0;

    for (let n = 1; n <= N; n += 1) {
      const theta = 2 * Math.PI * k * x[n];
      re += Math.cos(theta);
      im += Math.sin(theta);
      const a = Math.hypot(re, im);
      if (a > maxAbs) {
        maxAbs = a;
        argMaxN = n;
      }
    }

    rows.push({
      k,
      A_k_N_proxy: maxAbs,
      n_of_max: argMaxN,
      A_over_sqrtk: maxAbs / Math.sqrt(k),
      A_over_k: maxAbs / k,
      A_over_logk: k > 1 ? maxAbs / Math.log(k) : null,
    });
  }

  return rows;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep987_exponential_sum_models.json');

const N = Number(process.argv[2] || 30000);
const K = Number(process.argv[3] || 600);

const seqNames = ['arithmetic_alpha_sqrt2', 'van_der_corput_base2', 'quadratic_mod1'];

const models = [];
for (const name of seqNames) {
  process.stderr.write(`scanning ${name}\n`);
  const rows = scanAk(name, N, K);
  const tail = rows.slice(Math.floor(0.8 * rows.length));
  const avgAoverK = tail.reduce((s, r) => s + r.A_over_k, 0) / tail.length;
  const avgAoverSqrtK = tail.reduce((s, r) => s + r.A_over_sqrtk, 0) / tail.length;
  models.push({
    sequence: name,
    rows,
    tail_summary: {
      k_from: tail[0].k,
      avg_A_over_k: avgAoverK,
      avg_A_over_sqrtk: avgAoverSqrtK,
    },
  });
}

const out = {
  problem: 'EP-987',
  method: 'finite_N_proxies_for_A_k_on_concrete_deterministic_sequences',
  params: { N, K },
  models,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
