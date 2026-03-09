#!/usr/bin/env node

function buildSpf(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i <= Math.floor(limit / i)) {
      for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

function minExponent(n, spf) {
  let x = n;
  let minE = 1 << 30;
  while (x > 1) {
    const p = spf[x] || x;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e < minE) minE = e;
  }
  return minE === (1 << 30) ? 0 : minE;
}

function coverageAtMostR(maxN, r, terms) {
  let prev = new Uint8Array(maxN + 1);
  prev[0] = 1;

  const reachedByAtMost = new Uint8Array(maxN + 1);
  reachedByAtMost[0] = 1;

  const exactCounts = [];
  for (let t = 1; t <= r; t += 1) {
    const next = new Uint8Array(maxN + 1);
    for (let s = 0; s <= maxN; s += 1) {
      if (prev[s] === 0) continue;
      for (let i = 0; i < terms.length; i += 1) {
        const v = s + terms[i];
        if (v > maxN) break;
        next[v] = 1;
      }
    }

    let cnt = 0;
    for (let n = 1; n <= maxN; n += 1) {
      if (next[n]) cnt += 1;
      if (next[n]) reachedByAtMost[n] = 1;
    }
    exactCounts.push({ terms_used: t, represented_count: cnt, density: Number((cnt / maxN).toPrecision(7)) });
    prev = next;
  }

  let covered = 0;
  const firstMissing = [];
  for (let n = 1; n <= maxN; n += 1) {
    if (reachedByAtMost[n]) covered += 1;
    else if (firstMissing.length < 40) firstMissing.push(n);
  }

  return {
    represented_up_to_maxN: covered,
    density: Number((covered / maxN).toPrecision(7)),
    exact_counts: exactCounts,
    first_missing_values: firstMissing,
  };
}

function main() {
  const maxN = Number(process.env.MAX_N || process.argv[2] || 300000);
  const maxR = Number(process.env.MAX_R || process.argv[3] || 5);
  const spf = buildSpf(maxN);

  const results = [];
  for (let r = 3; r <= maxR; r += 1) {
    const terms = [];
    for (let n = 2; n <= maxN; n += 1) {
      if (minExponent(n, spf) >= r) terms.push(n);
    }
    process.stderr.write(`r=${r}, r-powerful count=${terms.length}\n`);

    const cov = coverageAtMostR(maxN, r, terms);
    results.push({ r, count_r_powerful_terms: terms.length, first_terms: terms.slice(0, 30), coverage: cov });
  }

  const out = {
    problem: 'EP-940',
    method: 'standalone_finite_additive_basis_coverage_for_r_powerful_numbers',
    params: { maxN, r_range: [3, maxR] },
    results,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
