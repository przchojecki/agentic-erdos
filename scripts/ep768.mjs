#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '1e3,1e4,1e5,1e6,1e8,1e10,1e12').split(',').map((s)=>Number(s));
const C_LIST = (process.env.C_LIST || '0.5,1,2').split(',').map((x)=>Number(x.trim())).filter(Boolean);

function fLower(N,c){
  return Math.exp(-c*Math.sqrt(Math.log(N))*Math.log(Math.log(N)));
}
function fUpper(N){
  return Math.exp(-Math.sqrt(Math.log(N)*Math.log(Math.log(N))));
}

const t0=Date.now();
const rows=[];
for(const N of N_LIST){
  const up=fUpper(N);
  const row={ N, upper_model_exp_neg_sqrt_logN_loglogN: Number(up.toExponential(8)) };
  for(const c of C_LIST){
    const lo=fLower(N,c);
    row[`lower_model_c_${String(c).replace('.','p')}`]=Number(lo.toExponential(8));
    row[`ratio_upper_over_lower_c_${String(c).replace('.','p')}`]=Number((up/lo).toExponential(8));
  }
  rows.push(row);
}

const out={
  problem:'EP-768',
  script:path.basename(process.argv[1]),
  method:'density_bound_gap_profile_from_reported_two_sided_asymptotic_scales',
  warning:'This quantifies separation between known model bounds; it does not compute the target set directly.',
  params:{N_LIST,C_LIST},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
