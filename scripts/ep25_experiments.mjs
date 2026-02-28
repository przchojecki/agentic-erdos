#!/usr/bin/env node

// Numerical experiments for EP-25 truncated systems.

const Xs = [10_000, 100_000, 1_000_000];

function harmonicDensityApprox(constraints, X) {
  const allowed = new Uint8Array(X + 1);
  allowed.fill(1);
  allowed[0] = 0;

  for (const c of constraints) {
    const n = c.n;
    const a = ((c.a % n) + n) % n;
    if (n > X) continue;

    let start = a;
    if (start < c.n_min) {
      const k = Math.ceil((c.n_min - start) / n);
      start += k * n;
    }
    if (start <= 0) start += Math.ceil((1 - start) / n) * n;

    for (let m = start; m <= X; m += n) {
      allowed[m] = 0;
    }
  }

  let s = 0;
  for (let n = 1; n <= X; n++) {
    if (allowed[n]) s += 1 / n;
  }
  return s / Math.log(X);
}

function firstPrimes(k) {
  const res = [];
  let x = 2;
  while (res.length < k) {
    let prime = true;
    for (let p = 2; p * p <= x; p++) {
      if (x % p === 0) {
        prime = false;
        break;
      }
    }
    if (prime) res.push(x);
    x++;
  }
  return res;
}

function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function makeConstraintsFromSequence(ns, residueFn) {
  return ns.map((n, i) => ({ n, a: residueFn(n, i), n_min: n }));
}

function runSystem(name, ns, residueFn) {
  const constraints = makeConstraintsFromSequence(ns, residueFn);
  const reciprocalSum = ns.reduce((acc, n) => acc + 1 / n, 0);
  const out = {
    name,
    num_constraints: ns.length,
    max_modulus: Math.max(...ns),
    reciprocal_sum_prefix: reciprocalSum,
    approx_mu_X: {},
  };
  for (const X of Xs) {
    out.approx_mu_X[String(X)] = harmonicDensityApprox(constraints, X);
  }
  return out;
}

const rng = lcg(20260228);

// Convergent reciprocal series example
const nsConv = Array.from({ length: 220 }, (_, i) => (i + 2) * (i + 2) + 1);

// Pairwise coprime divergent example
const nsPrime = firstPrimes(220);

// Divergent, highly non-coprime style example
const nsDense = Array.from({ length: 300 }, (_, i) => i + 2);

const systems = [
  runSystem('convergent_reciprocals_n=i^2+1_a=0', nsConv, () => 0),
  runSystem('pairwise_coprime_primes_a=0', nsPrime, () => 0),
  runSystem('dense_moduli_n=i+1_random_a', nsDense, (n) => Math.floor(rng() * n)),
];

console.log(JSON.stringify({ Xs, systems }, null, 2));
