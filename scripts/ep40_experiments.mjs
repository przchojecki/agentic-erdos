#!/usr/bin/env node

// EP-40 quick experiments on the lacunary counterexample A={2^k}.

const Ns = [1e4, 1e5, 1e6, 1e7].map((x) => Math.floor(x));

function buildPowersOfTwoUpTo(N) {
  const arr = [];
  let x = 1;
  while (x <= N) {
    arr.push(x);
    x *= 2;
  }
  return arr;
}

function maxConvolutionOrdered(A) {
  const cnt = new Map();
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      const s = A[i] + A[j];
      cnt.set(s, (cnt.get(s) || 0) + 1);
    }
  }
  let mx = 0;
  for (const v of cnt.values()) if (v > mx) mx = v;
  return mx;
}

function g1(N) {
  return Math.sqrt(N) / Math.log(N);
}
function g2(N) {
  return Math.sqrt(N) / Math.sqrt(Math.log(N));
}
function g3(N) {
  return Math.sqrt(N) / (Math.log(N) ** 2);
}

const rows = [];
for (const N of Ns) {
  const A = buildPowersOfTwoUpTo(N);
  const m = A.length;
  const rmax = maxConvolutionOrdered(A);

  const rhs1 = Math.sqrt(N) / g1(N); // log N
  const rhs2 = Math.sqrt(N) / g2(N); // sqrt(log N)
  const rhs3 = Math.sqrt(N) / g3(N); // (log N)^2

  rows.push({
    N,
    m,
    rmax,
    rhs_for_g_sqrtN_over_logN: rhs1,
    ratio_m_over_rhs1: m / rhs1,
    rhs_for_g_sqrtN_over_sqrtlogN: rhs2,
    ratio_m_over_rhs2: m / rhs2,
    rhs_for_g_sqrtN_over_log2N: rhs3,
    ratio_m_over_rhs3: m / rhs3,
  });
}

console.log(JSON.stringify({
  set: 'A={2^k}',
  note: 'rmax is computed on finite truncation A∩[1,N]; for full infinite set, max ordered representations remains <=2.',
  rows,
}, null, 2));
