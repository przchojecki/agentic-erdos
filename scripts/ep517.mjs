#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function evalLacunary(zRe, zIm, exps, coeffs) {
  let sr = 0;
  let si = 0;
  for (let k = 0; k < exps.length; k += 1) {
    const n = exps[k];
    const a = coeffs[k];
    let pr = 1;
    let pi = 0;
    for (let j = 0; j < n; j += 1) {
      const nr = pr * zRe - pi * zIm;
      const ni = pr * zIm + pi * zRe;
      pr = nr;
      pi = ni;
    }
    sr += a * pr;
    si += a * pi;
  }
  return [sr, si];
}

function familyData(name) {
  if (name === 'square_gaps') {
    const exps = [];
    const coeffs = [];
    for (let k = 1; k <= 18; k += 1) {
      exps.push(k * k);
      coeffs.push(1 / k);
    }
    return { exps, coeffs };
  }
  if (name === 'doubling_gaps') {
    const exps = [];
    const coeffs = [];
    for (let k = 1; k <= 14; k += 1) {
      exps.push(2 ** k);
      coeffs.push(1 / (k + 1));
    }
    return { exps, coeffs };
  }
  const exps = [];
  const coeffs = [];
  for (let k = 1; k <= 16; k += 1) {
    exps.push(Math.floor(k * k * 1.3));
    coeffs.push(1 / Math.sqrt(k + 1));
  }
  return { exps, coeffs };
}

const t0 = Date.now();
const families = ['square_gaps', 'doubling_gaps', 'superlinear_gaps'];
const radii = [0.8, 1.0, 1.2, 1.5, 2.0];
const ang = 1800;
const targets = [0, 1, -1];

const rows = [];
for (const fam of families) {
  const { exps, coeffs } = familyData(fam);
  const profile = [];
  for (const r of radii) {
    const hits = Object.fromEntries(targets.map((w) => [String(w), 0]));
    for (let i = 0; i < ang; i += 1) {
      const t = (2 * Math.PI * i) / ang;
      const [re, im] = evalLacunary(r * Math.cos(t), r * Math.sin(t), exps, coeffs);
      for (const w of targets) {
        const d = Math.hypot(re - w, im);
        if (d < 0.08) hits[String(w)] += 1;
      }
    }
    profile.push({
      r,
      near_hit_fraction_w0: Number((hits['0'] / ang).toPrecision(8)),
      near_hit_fraction_w1: Number((hits['1'] / ang).toPrecision(8)),
      near_hit_fraction_wm1: Number((hits['-1'] / ang).toPrecision(8)),
    });
  }
  rows.push({ function_family: fam, exponent_list_prefix: exps.slice(0, 12), profile });
}

const out = {
  problem: 'EP-517',
  script: path.basename(process.argv[1]),
  method: 'lacunary_circle_image_coverage_proxy_for_multiple_target_values',
  params: { radii, ang, targets },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
