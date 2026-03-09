#!/usr/bin/env node

function absBig(x) {
  return x < 0n ? -x : x;
}

function gcd(a, b) {
  let x = absBig(a);
  let y = absBig(b);
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function modPow(base, exp, mod) {
  let b = base % mod;
  let e = exp;
  let out = 1n;
  while (e > 0n) {
    if (e & 1n) out = (out * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return out;
}

function isProbablePrime(n) {
  if (n < 2n) return false;
  const small = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const p of small) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1;
  }

  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const a of bases) {
    if (a >= n - 1n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let witness = true;
    for (let r = 1; r < s; r += 1) {
      x = (x * x) % n;
      if (x === n - 1n) {
        witness = false;
        break;
      }
    }
    if (witness) return false;
  }
  return true;
}

function pollardRho(n, seedStart) {
  if (n % 2n === 0n) return 2n;
  if (n % 3n === 0n) return 3n;

  let seed = seedStart;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const c = (BigInt(2 + ((seed + attempt) % 1000)) % (n - 1n)) + 1n;
    let x = (BigInt(2 + ((seed + 7 * attempt) % 1000)) % (n - 2n)) + 2n;
    let y = x;
    let d = 1n;

    for (let iter = 0; iter < 200000; iter += 1) {
      x = (x * x + c) % n;
      y = (y * y + c) % n;
      y = (y * y + c) % n;
      d = gcd(absBig(x - y), n);
      if (d === 1n) continue;
      if (d !== n) return d;
      break;
    }
    seed += 17;
  }
  return n;
}

function addFactor(map, p) {
  const k = p.toString();
  map.set(k, (map.get(k) || 0) + 1);
}

function factorRec(n, out, seedState) {
  if (n === 1n) return;
  if (isProbablePrime(n)) {
    addFactor(out, n);
    return;
  }
  const d = pollardRho(n, seedState.value);
  seedState.value += 31;
  if (d === n) {
    addFactor(out, n);
    return;
  }
  factorRec(d, out, seedState);
  factorRec(n / d, out, seedState);
}

function factorBigInt(n) {
  const out = new Map();
  const seedState = { value: 1 };
  factorRec(n, out, seedState);
  return out;
}

function isPowerfulFromFactorMap(factors) {
  if (factors.size === 0) return false;
  for (const e of factors.values()) {
    if (e < 2) return false;
  }
  return true;
}

function sortedFactorList(factors) {
  return Array.from(factors.entries())
    .map(([p, e]) => ({ p, e }))
    .sort((a, b) => (BigInt(a.p) < BigInt(b.p) ? -1 : 1));
}

function main() {
  const nPow = Number(process.env.N_POW_MAX || process.argv[2] || 96);
  const nFact = Number(process.env.N_FACT_MAX || process.argv[3] || 32);

  const hitsPow2 = [];
  const unresolvedPow2 = [];

  for (let n = 2; n <= nPow; n += 1) {
    const values = [
      { sign: '-', v: (1n << BigInt(n)) - 1n },
      { sign: '+', v: (1n << BigInt(n)) + 1n },
    ];
    for (const item of values) {
      try {
        const f = factorBigInt(item.v);
        if (isPowerfulFromFactorMap(f)) {
          hitsPow2.push({ n, sign: item.sign, value: item.v.toString(), factors: sortedFactorList(f) });
        }
      } catch (err) {
        unresolvedPow2.push({ n, sign: item.sign, value: item.v.toString(), error: String(err) });
      }
    }
    if (n % 10 === 0) process.stderr.write(`pow2 n=${n}/${nPow}\n`);
  }

  const hitsFact = [];
  const unresolvedFact = [];
  let fact = 1n;
  for (let n = 1; n <= nFact; n += 1) {
    fact *= BigInt(n);
    if (n < 3) continue;
    const values = [
      { sign: '-', v: fact - 1n },
      { sign: '+', v: fact + 1n },
    ];
    for (const item of values) {
      try {
        const f = factorBigInt(item.v);
        if (isPowerfulFromFactorMap(f)) {
          hitsFact.push({ n, sign: item.sign, value: item.v.toString(), factors: sortedFactorList(f) });
        }
      } catch (err) {
        unresolvedFact.push({ n, sign: item.sign, value: item.v.toString(), error: String(err) });
      }
    }
    if (n % 5 === 0) process.stderr.write(`fact n=${n}/${nFact}\n`);
  }

  const out = {
    problem: 'EP-936',
    method: 'standalone_bigint_factorization_scan_for_powerful_values',
    params: {
      n_pow2_range: [2, nPow],
      n_factorial_range: [3, nFact],
    },
    hits: {
      pow2_pm1: hitsPow2,
      factorial_pm1: hitsFact,
    },
    unresolved: {
      pow2_pm1: unresolvedPow2,
      factorial_pm1: unresolvedFact,
    },
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
