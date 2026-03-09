#!/usr/bin/env node

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

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
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e < minE) minE = e;
  }
  return minE === (1 << 30) ? 0 : minE;
}

function pairwiseCoprime3(a, b, c) {
  return gcd(a, b) === 1 && gcd(a, c) === 1 && gcd(b, c) === 1;
}

function main() {
  const B = Number(process.env.B || process.argv[2] || 15000000);
  const spf = buildSpf(B);

  const list3 = [];
  const list4 = [];
  const list5 = [];

  for (let n = 2; n <= B; n += 1) {
    const m = minExponent(n, spf);
    if (m >= 3) list3.push(n);
    if (m >= 4) list4.push(n);
    if (m >= 5) list5.push(n);
    if (n % 5000000 === 0) process.stderr.write(`classified n=${n}\n`);
  }

  const set3 = new Set(list3);
  const set4 = new Set(list4);
  const set5 = new Set(list5);

  const triples3 = [];
  for (let i = 0; i < list3.length; i += 1) {
    const a = list3[i];
    for (let j = i + 1; j < list3.length; j += 1) {
      const b = list3[j];
      const c = a + b;
      if (c > B) break;
      if (!set3.has(c)) continue;
      if (!pairwiseCoprime3(a, b, c)) continue;
      triples3.push({ a, b, c });
      if (triples3.length >= 25) break;
    }
    if (triples3.length >= 25) break;
  }

  const triples4 = [];
  for (let i = 0; i < list4.length; i += 1) {
    const a = list4[i];
    for (let j = i + 1; j < list4.length; j += 1) {
      const b = list4[j];
      const c = a + b;
      if (c > B) break;
      if (!set4.has(c)) continue;
      if (!pairwiseCoprime3(a, b, c)) continue;
      triples4.push({ a, b, c });
      if (triples4.length >= 25) break;
    }
    if (triples4.length >= 25) break;
  }

  const quads5 = [];
  for (let i = 0; i < list5.length; i += 1) {
    const a = list5[i];
    for (let j = i + 1; j < list5.length; j += 1) {
      const b = list5[j];
      for (let k = j + 1; k < list5.length; k += 1) {
        const c = list5[k];
        const d = a + b + c;
        if (d > B) break;
        if (!set5.has(d)) continue;
        if (
          gcd(a, b) !== 1 || gcd(a, c) !== 1 || gcd(a, d) !== 1 ||
          gcd(b, c) !== 1 || gcd(b, d) !== 1 || gcd(c, d) !== 1
        ) continue;
        quads5.push({ a, b, c, d });
        if (quads5.length >= 16) break;
      }
      if (quads5.length >= 16) break;
    }
    if (quads5.length >= 16) break;
  }

  const out = {
    problem: 'EP-939',
    method: 'standalone_exact_scan_r_powerful_additive_coprime_patterns',
    params: { B },
    counts_r_powerful_up_to_B: {
      r3: list3.length,
      r4: list4.length,
      r5: list5.length,
    },
    found_counts: {
      coprime_r3_a_plus_b_eq_c: triples3.length,
      coprime_r4_a_plus_b_eq_c: triples4.length,
      coprime_r5_a_plus_b_plus_c_eq_d: quads5.length,
    },
    sample_r3: triples3,
    sample_r4: triples4,
    sample_r5: quads5,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
