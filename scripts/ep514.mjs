#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function cAbs(re, im) { return Math.hypot(re, im); }

function cExp(re, im) {
  const er = Math.exp(re);
  return [er * Math.cos(im), er * Math.sin(im)];
}

function evalF(name, zRe, zIm) {
  if (name === 'exp_z') return cExp(zRe, zIm);
  if (name === 'exp_z2') {
    const r = zRe * zRe - zIm * zIm;
    const i = 2 * zRe * zIm;
    return cExp(r, i);
  }
  if (name === 'exp_z_plus_exp_minus_z') {
    const [a1, b1] = cExp(zRe, zIm);
    const [a2, b2] = cExp(-zRe, -zIm);
    return [a1 + a2, b1 + b2];
  }
  return [0, 0];
}

function safeLogAbs(re, im) {
  const a = cAbs(re, im);
  if (!Number.isFinite(a)) return 740;
  return Math.log(Math.max(1e-300, a));
}

const funcs = ['exp_z', 'exp_z2', 'exp_z_plus_exp_minus_z'];
const rays = 2160;
const radii = [10, 20, 40, 80, 120, 160, 220, 300];
const nList = [0, 1, 2, 3, 4, 5];

const t0 = Date.now();
const rows = [];
for (const fn of funcs) {
  let bestTheta = 0;
  let bestMinMargin = -Infinity;
  for (let j = 0; j < rays; j += 1) {
    const th = (2 * Math.PI * j) / rays;
    let minMargin = Infinity;
    for (const r of radii) {
      const [re, im] = evalF(fn, r * Math.cos(th), r * Math.sin(th));
      const logAbs = safeLogAbs(re, im);
      for (const n of nList) {
        const margin = logAbs - n * Math.log(r);
        if (margin < minMargin) minMargin = margin;
      }
    }
    if (minMargin > bestMinMargin) {
      bestMinMargin = minMargin;
      bestTheta = th;
    }
  }

  const pathProfile = [];
  for (const r of radii) {
    const [re, im] = evalF(fn, r * Math.cos(bestTheta), r * Math.sin(bestTheta));
    const logAbs = safeLogAbs(re, im);
    const minOverN = Math.min(...nList.map((n) => logAbs - n * Math.log(r)));
    pathProfile.push({ r, min_margin_over_n0_to_5: Number(minOverN.toPrecision(10)) });
  }

  rows.push({
    function_family: fn,
    best_ray_theta: Number(bestTheta.toPrecision(10)),
    best_ray_min_margin_proxy: Number(bestMinMargin.toPrecision(10)),
    path_profile: pathProfile,
  });
}

const out = {
  problem: 'EP-514',
  script: path.basename(process.argv[1]),
  method: 'ray_search_proxy_for_growth_f_over_z_power_n',
  params: { rays, radii, nList },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
