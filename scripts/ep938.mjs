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

function isPowerful(n, spf) {
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e < 2) return false;
  }
  return n > 1;
}

function main() {
  const B = Number(process.env.B || process.argv[2] || 30000000);
  const spf = buildSpf(B);

  const powerful = [];
  for (let n = 2; n <= B; n += 1) {
    if (isPowerful(n, spf)) powerful.push(n);
    if (n % 5000000 === 0) process.stderr.write(`scan n=${n}\n`);
  }

  const apTriples = [];
  for (let i = 0; i + 2 < powerful.length; i += 1) {
    const a = powerful[i];
    const b = powerful[i + 1];
    const c = powerful[i + 2];
    if (a + c === 2 * b) apTriples.push({ idx: i + 1, a, b, c, gap: b - a });
  }

  const out = {
    problem: 'EP-938',
    method: 'exact_scan_powerful_numbers_and_consecutive_index_AP_test',
    params: { B },
    counts: {
      powerful_up_to_B: powerful.length,
      consecutive_three_term_AP_count: apTriples.length,
    },
    first_powerful_terms: powerful.slice(0, 40),
    sample_ap_triples: apTriples.slice(0, 30),
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
