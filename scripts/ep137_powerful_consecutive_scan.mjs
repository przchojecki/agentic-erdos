#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const M_MAX = Number(process.env.M_MAX || 300000);
const K_MAX = Number(process.env.K_MAX || 12);

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i * i <= n) {
        for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function factorExponents(x, spf) {
  const out = [];
  let n = x;
  while (n > 1) {
    const p = spf[n];
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
      e++;
    }
    out.push([p, e]);
  }
  return out;
}

const spf = sieveSpf(M_MAX + K_MAX + 5);
const witnesses = [];
const perK = [];

for (let k = 3; k <= K_MAX; k++) {
  const exp = new Map();

  function addNum(v, sgn) {
    for (const [p, e] of factorExponents(v, spf)) {
      const nv = (exp.get(p) || 0) + sgn * e;
      if (nv === 0) exp.delete(p);
      else exp.set(p, nv);
    }
  }

  for (let t = 1; t <= k; t++) addNum(t, +1);

  let found = false;
  let minSingleExponent = Infinity;
  for (let m = 1; m <= M_MAX; m++) {
    let localMin = Infinity;
    for (const e of exp.values()) if (e < localMin) localMin = e;
    if (localMin < minSingleExponent) minSingleExponent = localMin;

    if (localMin >= 2) {
      witnesses.push({ k, m });
      found = true;
      break;
    }

    // slide window m..m+k-1 -> (m+1)..(m+k)
    addNum(m, -1);
    addNum(m + k, +1);
  }

  perK.push({
    k,
    scanned_m_max: M_MAX,
    found_powerful_product: found,
    min_prime_exponent_seen: Number.isFinite(minSingleExponent) ? minSingleExponent : null,
  });
}

const out = {
  script: path.basename(process.argv[1]),
  m_max: M_MAX,
  k_max: K_MAX,
  witnesses,
  per_k: perK,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep137_powerful_consecutive_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, witnesses: witnesses.length, checked_k: K_MAX - 2 }, null, 2));
