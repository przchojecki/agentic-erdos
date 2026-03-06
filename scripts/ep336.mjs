#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseProfiles(value) {
  if (!value) {
    const out = [];
    for (let limit = 3000; limit <= 38000; limit += 1000) {
      out.push({
        limit,
        N0: Math.max(500, Math.floor(limit * 0.32)),
        Nmax: limit + 9000,
      });
    }
    return out;
  }
  const out = [];
  for (const part of value.split(',')) {
    const [limit, N0, Nmax] = part.split(':').map((x) => Number(x.trim()));
    if (
      Number.isInteger(limit) &&
      Number.isInteger(N0) &&
      Number.isInteger(Nmax) &&
      limit >= 100 &&
      N0 >= 1 &&
      Nmax >= N0
    ) {
      out.push({ limit, N0, Nmax });
    }
  }
  return out;
}

function buildHalfBlockSet(limit) {
  const A = [];
  for (let x = 1; x <= limit; x += 1) {
    let ok = false;
    for (let k = 0; ; k += 1) {
      const lo = 2 ** (2 * k);
      const hi = 2 ** (2 * k + 1);
      if (lo > limit) break;
      if (x > lo && x <= hi) {
        ok = true;
        break;
      }
    }
    if (ok) A.push(x);
  }
  return A;
}

function profileForConstruction(A, N0, Nmax) {
  const can1 = new Uint8Array(Nmax + 1);
  const can2 = new Uint8Array(Nmax + 1);
  const can3 = new Uint8Array(Nmax + 1);
  for (let i = 0; i < A.length; i += 1) {
    const a = A[i];
    if (a <= Nmax) can1[a] = 1;
  }

  for (let i = 0; i < A.length; i += 1) {
    const ai = A[i];
    for (let j = i; j < A.length; j += 1) {
      const s = ai + A[j];
      if (s > Nmax) break;
      can2[s] = 1;
    }
  }

  const twoList = [];
  for (let n = 0; n <= Nmax; n += 1) if (can2[n]) twoList.push(n);
  for (let i = 0; i < A.length; i += 1) {
    const a = A[i];
    for (let j = 0; j < twoList.length; j += 1) {
      const s = a + twoList[j];
      if (s > Nmax) break;
      can3[s] = 1;
    }
  }

  let orderProxy = null;
  let exactProxy = null;
  for (let r = 1; r <= 3; r += 1) {
    let okOrder = true;
    let okExact = true;
    for (let n = N0; n <= Nmax; n += 1) {
      const c1 = can1[n];
      const c2 = can2[n];
      const c3 = can3[n];
      const hitOrder = r === 1 ? c1 : r === 2 ? c1 || c2 : c1 || c2 || c3;
      const hitExact = r === 1 ? c1 : r === 2 ? c2 : c3;
      if (!hitOrder) okOrder = false;
      if (!hitExact) okExact = false;
      if (!okOrder && !okExact) break;
    }
    if (orderProxy === null && okOrder) orderProxy = r;
    if (exactProxy === null && okExact) exactProxy = r;
  }

  return {
    order_proxy: orderProxy,
    exact_order_proxy: exactProxy,
    witness_missing_for_order_2: (() => {
      for (let n = N0; n <= Nmax; n += 1) if (!(can1[n] || can2[n])) return n;
      return null;
    })(),
    witness_missing_for_exact_3: (() => {
      for (let n = N0; n <= Nmax; n += 1) if (!can3[n]) return n;
      return null;
    })(),
  };
}

const PROFILES = parseProfiles(process.env.PROFILES);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const cfg of PROFILES) {
  const t1 = Date.now();
  const A = buildHalfBlockSet(cfg.limit);
  const prox = profileForConstruction(A, cfg.N0, cfg.Nmax);
  rows.push({
    ...cfg,
    set_size: A.length,
    density_up_to_limit: Number((A.length / cfg.limit).toFixed(8)),
    ...prox,
    sample_terms: A.slice(0, 40),
    runtime_ms: Date.now() - t1,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-336',
  script: path.basename(process.argv[1]),
  method: 'standalone_multiscale_exact_order_vs_exact_order_proxy_for_half_block_basis',
  params: { PROFILES },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
