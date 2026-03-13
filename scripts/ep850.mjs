#!/usr/bin/env node
import fs from 'fs';

// EP-850: deeper collision scans for equal prime-support patterns.
const OUT = process.env.OUT || 'data/ep850_standalone_deeper.json';
const X = 2_000_000;

function sieveSPF(n) {
  const spf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function distinctPrimeSig(n, spf) {
  const arr = [];
  let x = n;
  let last = 0;
  while (x > 1) {
    const p = spf[x];
    if (p !== last) arr.push(p);
    last = p;
    while (x % p === 0) x /= p;
  }
  return arr.join('.');
}

const t0 = Date.now();
const spf = sieveSPF(X + 3);
const sig = Array(X + 3).fill('');
for (let n = 2; n <= X + 2; n += 1) sig[n] = distinctPrimeSig(n, spf);

const tripleMap = new Map();
const tripleHits = [];
const pairMap = new Map();
const pairHits = [];

for (let x = 2; x <= X; x += 1) {
  const k3 = `${sig[x]}|${sig[x + 1]}|${sig[x + 2]}`;
  let a3 = tripleMap.get(k3);
  if (!a3) {
    a3 = [];
    tripleMap.set(k3, a3);
  }
  for (const y of a3) {
    if (y !== x) tripleHits.push({ x: y, y: x });
    if (tripleHits.length >= 30) break;
  }
  if (tripleHits.length < 30) a3.push(x);

  const k2 = `${sig[x]}|${sig[x + 1]}`;
  let a2 = pairMap.get(k2);
  if (!a2) {
    a2 = [];
    pairMap.set(k2, a2);
  }
  for (const y of a2) {
    if (y !== x) pairHits.push({ x: y, y: x });
    if (pairHits.length >= 30) break;
  }
  if (pairHits.length < 30) a2.push(x);
}

const out = {
  problem: 'EP-850',
  script: 'ep850.mjs',
  method: 'deep_collision_scan_for_equal_prime_support_patterns',
  params: { X },
  triple_shift012_collision_count_found: tripleHits.length,
  triple_shift012_collisions_sample: tripleHits.slice(0, 30),
  pair_shift01_collision_count_found: pairHits.length,
  pair_shift01_collisions_sample: pairHits.slice(0, 30),
  pair_shift01_contains_known_75_1215: pairHits.some((h) => h.x === 75 && h.y === 1215),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
