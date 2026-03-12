#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePhi(n) {
  const phi = new Int32Array(n + 1);
  const spf = new Int32Array(n + 1);
  phi[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      phi[i] = i - 1;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
    if (!phi[i]) {
      const p = spf[i];
      const m = Math.floor(i / p);
      phi[i] = m % p === 0 ? phi[m] * p : phi[m] * (p - 1);
    }
  }
  return phi;
}

function perms(arr) {
  const out = [];
  const a = arr.slice();
  function rec(i) {
    if (i === a.length) { out.push(a.slice()); return; }
    for (let j = i; j < a.length; j += 1) {
      [a[i], a[j]] = [a[j], a[i]];
      rec(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  rec(0);
  return out;
}

const N = Number(process.env.N || 1000000);
const KMAX = Number(process.env.KMAX || 7);
const OUT = process.env.OUT || '';

const phi = sievePhi(N + KMAX + 5);

const allPerms = new Map();
for (let k = 2; k <= KMAX; k += 1) {
  const base = Array.from({ length: k }, (_, i) => i);
  allPerms.set(k, perms(base).map((p) => p.join(',')));
}

const seen = new Map();
for (let k = 2; k <= KMAX; k += 1) seen.set(k, new Set());

for (let m = 1; m + KMAX <= N; m += 1) {
  for (let k = 2; k <= KMAX; k += 1) {
    const vals = [];
    for (let t = 1; t <= k; t += 1) vals.push(phi[m + t]);
    const uniq = new Set(vals);
    if (uniq.size !== k) continue;
    const idx = vals.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    seen.get(k).add(idx.join(','));
  }
}

const rows = [];
for (let k = 2; k <= KMAX; k += 1) {
  const s = seen.get(k);
  const all = allPerms.get(k);
  const missing = all.filter((p) => !s.has(p));
  rows.push({
    k,
    total_patterns: all.length,
    realized_patterns: s.size,
    missing_patterns: missing.length,
    first_missing_lex: missing.length ? missing[0] : null,
    full_coverage: missing.length === 0,
  });
}

const out = {
  problem: 'EP-415',
  script: path.basename(process.argv[1]),
  method: 'finite_coverage_of_totient_ordering_patterns',
  params: { N, KMAX },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
