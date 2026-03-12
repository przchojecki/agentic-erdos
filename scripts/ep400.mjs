#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i]) continue;
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
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
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function feasible2(vpFact, a, b, n) {
  const va = vpFact[a];
  const vb = vpFact[b];
  const vn = vpFact[n];
  for (let i = 0; i < vn.length; i += 1) if (va[i] + vb[i] > vn[i]) return false;
  return true;
}

function feasible3(vpFact, a, b, c, n) {
  const va = vpFact[a];
  const vb = vpFact[b];
  const vc = vpFact[c];
  const vn = vpFact[n];
  for (let i = 0; i < vn.length; i += 1) if (va[i] + vb[i] + vc[i] > vn[i]) return false;
  return true;
}

const N2 = Number(process.env.N2 || 220);
const N3 = Number(process.env.N3 || 90);
const OUT = process.env.OUT || '';

const N = Math.max(N2, N3);
const spf = sieveSpf(N + 5);
const primes = [];
for (let i = 2; i <= N; i += 1) if (spf[i] === i) primes.push(i);
const pIndex = new Map(primes.map((p, i) => [p, i]));

const vpFact = Array.from({ length: N + 1 }, () => new Int16Array(primes.length));
for (let n = 1; n <= N; n += 1) {
  vpFact[n].set(vpFact[n - 1]);
  for (const [p, e] of factorize(n, spf)) vpFact[n][pIndex.get(p)] += e;
}

const rows2 = [];
let sum2 = 0;
for (let n = 2; n <= N2; n += 1) {
  let best = -1e9;
  let witness = null;
  for (let a = 1; a <= n; a += 1) {
    for (let b = a; b <= n; b += 1) {
      if (!feasible2(vpFact, a, b, n)) continue;
      const g = a + b - n;
      if (g > best) {
        best = g;
        witness = { a1: a, a2: b };
      }
    }
  }
  sum2 += best;
  if ([20, 40, 60, 80, 100, 140, 180, 220].includes(n)) {
    rows2.push({ n, g2: best, witness, avg_g2_up_to_n: Number((sum2 / (n - 1)).toPrecision(6)), ratio_g2_over_log_n: Number((best / Math.log(n)).toPrecision(6)) });
  }
}

const rows3 = [];
let sum3 = 0;
for (let n = 2; n <= N3; n += 1) {
  let best = -1e9;
  let witness = null;
  for (let a = 1; a <= n; a += 1) {
    for (let b = a; b <= n; b += 1) {
      for (let c = b; c <= n; c += 1) {
        if (!feasible3(vpFact, a, b, c, n)) continue;
        const g = a + b + c - n;
        if (g > best) {
          best = g;
          witness = { a1: a, a2: b, a3: c };
        }
      }
    }
  }
  sum3 += best;
  if ([20, 30, 40, 50, 60, 75, 90].includes(n)) {
    rows3.push({ n, g3: best, witness, avg_g3_up_to_n: Number((sum3 / (n - 1)).toPrecision(6)), ratio_g3_over_log_n: Number((best / Math.log(n)).toPrecision(6)) });
  }
}

const out = {
  problem: 'EP-400',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_profiles_for_g2_and_g3',
  params: { N2, N3 },
  rows_g2: rows2,
  rows_g3: rows3,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
