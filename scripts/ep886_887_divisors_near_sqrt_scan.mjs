#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-886/887 finite probe:
// count divisors in intervals just above sqrt(n).

const N_MAX = Number(process.env.N_MAX || 500000);
const C_LIST = (process.env.C_LIST || '0.5,1,2,4')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x > 0);
const EPS_LIST = (process.env.EPS_LIST || '0.1,0.2')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x > 0 && x < 0.5);

function spfTable(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i++) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i <= n) {
      for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

function factorize(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e++;
    }
    out.push([p, e]);
  }
  return out;
}

function generateDivisors(fac, idx = 0, cur = 1, out = []) {
  if (idx === fac.length) {
    out.push(cur);
    return out;
  }
  const [p, e] = fac[idx];
  let v = 1;
  for (let i = 0; i <= e; i++) {
    generateDivisors(fac, idx + 1, cur * v, out);
    v *= p;
  }
  return out;
}

const spf = spfTable(N_MAX);

const bestC = new Map(C_LIST.map((c) => [c, { count: -1, n: -1, divisors: [] }]));
const bestEps = new Map(EPS_LIST.map((e) => [e, { count: -1, n: -1, divisors: [] }]));

for (let n = 2; n <= N_MAX; n++) {
  const fac = factorize(n, spf);
  const divs = generateDivisors(fac);
  const s = Math.sqrt(n);
  const upperC = new Map(C_LIST.map((c) => [c, s + c * Math.pow(n, 0.25)]));
  const upperE = new Map(EPS_LIST.map((eps) => [eps, s + Math.pow(n, 0.5 - eps)]));
  const cntC = new Map(C_LIST.map((c) => [c, 0]));
  const cntE = new Map(EPS_LIST.map((eps) => [eps, 0]));
  const sampleC = new Map(C_LIST.map((c) => [c, []]));
  const sampleE = new Map(EPS_LIST.map((eps) => [eps, []]));

  for (const d of divs) {
    if (d <= s) continue;
    for (const c of C_LIST) {
      if (d <= upperC.get(c)) {
        cntC.set(c, cntC.get(c) + 1);
        if (sampleC.get(c).length < 12) sampleC.get(c).push(d);
      }
    }
    for (const eps of EPS_LIST) {
      if (d <= upperE.get(eps)) {
        cntE.set(eps, cntE.get(eps) + 1);
        if (sampleE.get(eps).length < 12) sampleE.get(eps).push(d);
      }
    }
  }

  for (const c of C_LIST) {
    const count = cntC.get(c);
    if (count > bestC.get(c).count) bestC.set(c, { count, n, divisors: sampleC.get(c) });
  }
  for (const eps of EPS_LIST) {
    const count = cntE.get(eps);
    if (count > bestEps.get(eps).count) bestEps.set(eps, { count, n, divisors: sampleE.get(eps) });
  }
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  C_interval_results: C_LIST.map((c) => ({ C: c, ...bestC.get(c) })),
  epsilon_interval_results: EPS_LIST.map((eps) => ({ epsilon: eps, ...bestEps.get(eps) })),
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep886_887_divisors_near_sqrt_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX }, null, 2));
