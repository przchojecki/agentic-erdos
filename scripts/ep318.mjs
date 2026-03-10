#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function lcmRangeSquared(mMax) {
  let l = 1n;
  for (let i = 2; i <= mMax; i += 1) l = lcm(l, BigInt(i));
  return l * l;
}

function toScaledWeights(signs, d2) {
  const w = [];
  for (let i = 0; i < signs.length; i += 1) {
    const m = i + 2;
    const v = d2 / BigInt(m * m);
    w.push(signs[i] > 0 ? v : -v);
  }
  return w;
}

// Flags per sum key: 1 = empty subset exists, 2 = nonempty subset exists.
function buildLeftFlags(weights) {
  const n = weights.length;
  const flags = new Map();
  const total = 1 << n;
  for (let mask = 0; mask < total; mask += 1) {
    let s = 0n;
    for (let i = 0; i < n; i += 1) {
      if ((mask >> i) & 1) s += weights[i];
    }
    const key = s.toString();
    const f = flags.get(key) || 0;
    flags.set(key, f | (mask === 0 ? 1 : 2));
  }
  return flags;
}

function hasZeroSubset(weights) {
  const n = weights.length;
  const mid = Math.floor(n / 2);
  const left = weights.slice(0, mid);
  const right = weights.slice(mid);
  const leftFlags = buildLeftFlags(left);

  const totalRight = 1 << right.length;
  for (let mask = 0; mask < totalRight; mask += 1) {
    let s = 0n;
    for (let i = 0; i < right.length; i += 1) {
      if ((mask >> i) & 1) s += right[i];
    }
    const want = (-s).toString();
    const f = leftFlags.get(want);
    if (!f) continue;
    if (mask !== 0) return true;
    if ((f & 2) !== 0) return true;
  }
  return false;
}

function xorshift32(seed0) {
  let seed = seed0 >>> 0;
  return function rand() {
    seed ^= (seed << 13) >>> 0;
    seed ^= seed >>> 17;
    seed ^= (seed << 5) >>> 0;
    return (seed >>> 0) / 2 ** 32;
  };
}

function randomSigns(len, rand) {
  const s = Array.from({ length: len }, () => (rand() < 0.5 ? -1 : 1));
  let hasPos = false;
  let hasNeg = false;
  for (const v of s) {
    if (v > 0) hasPos = true;
    if (v < 0) hasNeg = true;
  }
  if (!hasPos || !hasNeg) s[0] *= -1;
  return s;
}

function parseListInt(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= 2);
  return out.length ? out : fallback;
}

function parseIntEnv(name, fallback) {
  const v = Number(process.env[name] || fallback);
  return Number.isInteger(v) ? v : fallback;
}

const EXH_M_MAX = parseIntEnv('EXH_M_MAX', 12);
const RANDOM_M_LIST = parseListInt(process.env.RANDOM_M_LIST, [18, 24, 30, 36, 40]);
const RANDOM_SAMPLES = parseIntEnv('RANDOM_SAMPLES', 100);
const SEARCH_M_LIST = parseListInt(process.env.SEARCH_M_LIST, [24, 30, 36, 40]);
const SEARCH_TRIALS = parseIntEnv('SEARCH_TRIALS', 120);
const RNG_SEED = parseIntEnv('RNG_SEED', 31820260310);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const maxM = Math.max(EXH_M_MAX, ...RANDOM_M_LIST, ...SEARCH_M_LIST);
const d2ByM = new Map();
for (let m = 2; m <= maxM; m += 1) d2ByM.set(m, lcmRangeSquared(m + 1));

const exhaustive = [];
for (let m = 2; m <= EXH_M_MAX; m += 1) {
  const n = m;
  const total = 1 << n;
  let nonconstant = 0;
  let withZero = 0;
  const d2 = d2ByM.get(m);
  for (let mask = 0; mask < total; mask += 1) {
    const signs = [];
    let pos = 0;
    let neg = 0;
    for (let i = 0; i < n; i += 1) {
      const v = ((mask >> i) & 1) ? 1 : -1;
      signs.push(v);
      if (v > 0) pos += 1;
      else neg += 1;
    }
    if (pos === 0 || neg === 0) continue;
    nonconstant += 1;
    const weights = toScaledWeights(signs, d2);
    if (hasZeroSubset(weights)) withZero += 1;
  }
  exhaustive.push({
    m_terms: m,
    nonconstant_signings: nonconstant,
    signings_with_zero_subset: withZero,
    proportion_with_zero_subset: Number((withZero / nonconstant).toFixed(8)),
  });
}

const rand = xorshift32(RNG_SEED);
const random_profiles = [];
for (const m of RANDOM_M_LIST) {
  const d2 = d2ByM.get(m);
  let withZero = 0;
  for (let s = 0; s < RANDOM_SAMPLES; s += 1) {
    const signs = randomSigns(m, rand);
    const weights = toScaledWeights(signs, d2);
    if (hasZeroSubset(weights)) withZero += 1;
  }
  random_profiles.push({
    m_terms: m,
    samples: RANDOM_SAMPLES,
    sampled_with_zero_subset: withZero,
    sampled_proportion_with_zero_subset: Number((withZero / RANDOM_SAMPLES).toFixed(8)),
  });
}

const witness_search = [];
for (const m of SEARCH_M_LIST) {
  const d2 = d2ByM.get(m);
  let found = false;
  let foundSigns = null;
  let firstZeroAt = -1;
  for (let t = 0; t < SEARCH_TRIALS; t += 1) {
    const signs = randomSigns(m, rand);
    const weights = toScaledWeights(signs, d2);
    const hasZero = hasZeroSubset(weights);
    if (!hasZero) {
      found = true;
      foundSigns = signs.map((x) => (x > 0 ? '+' : '-')).join('');
      break;
    }
    if (firstZeroAt < 0) firstZeroAt = t + 1;
  }
  witness_search.push({
    m_terms: m,
    trials: SEARCH_TRIALS,
    found_zero_free_signing: found,
    first_zero_detected_trial: firstZeroAt,
    zero_free_signing_pm_string: foundSigns,
  });
}

const out = {
  problem: 'EP-318',
  script: path.basename(process.argv[1]),
  method: 'exact_meet_in_middle_zero_subset_on_signed_inverse_squares_prefixes',
  params: {
    EXH_M_MAX,
    RANDOM_M_LIST,
    RANDOM_SAMPLES,
    SEARCH_M_LIST,
    SEARCH_TRIALS,
    RNG_SEED,
  },
  exhaustive,
  random_profiles,
  witness_search,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
