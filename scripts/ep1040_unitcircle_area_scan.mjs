#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep1040_unitcircle_area_scan.json');

const samples = Number(process.argv[2] || 250000);
const mList = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30, 40, 60, 80, 100, 150, 200, 300];
const boxR = 2;
const boxArea = (2 * boxR) * (2 * boxR);

const xs = new Float64Array(samples);
const ys = new Float64Array(samples);
for (let i = 0; i < samples; i += 1) {
  xs[i] = (Math.random() * 2 - 1) * boxR;
  ys[i] = (Math.random() * 2 - 1) * boxR;
}

const rows = [];

for (const m of mList) {
  let hit = 0;
  for (let i = 0; i < samples; i += 1) {
    const x = xs[i];
    const y = ys[i];

    const r = Math.hypot(x, y);
    let re;
    let im;
    if (r === 0) {
      re = 0;
      im = 0;
    } else {
      const theta = Math.atan2(y, x);
      const rm = r ** m;
      const ang = m * theta;
      re = rm * Math.cos(ang);
      im = rm * Math.sin(ang);
    }

    const v = Math.hypot(re - 1, im);
    if (v < 1) hit += 1;
  }

  const areaEst = (hit / samples) * boxArea;
  rows.push({
    m,
    samples,
    hit_count: hit,
    area_estimate: areaEst,
    area_times_m: areaEst * m,
  });

  process.stderr.write(`m=${m}, area~${areaEst.toFixed(6)}\n`);
}

const out = {
  problem: 'EP-1040',
  model: 'F = unit circle approximated via f_m(z)=z^m-1',
  method: 'monte_carlo_area_estimate_of_{|f_m(z)|<1}',
  box: [-boxR, boxR, -boxR, boxR],
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
