#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_MAX=Number(process.env.N_MAX||160);

// Build minimal sequence consistent with known one-step lower bound
// R(n+1)-R(n) >= 4n-8 for n>=2, with seed R(2)=2.
function buildLinearGapLowerSeq(nMax){
  const R=Array(nMax+1).fill(0);
  R[2]=2;
  for(let n=2;n<nMax;n+=1){
    const d=4*n-8;
    R[n+1]=R[n]+d;
  }
  return R;
}

const t0=Date.now();
const R=buildLinearGapLowerSeq(N_MAX);
const rows=[];
for(let n=3;n<=N_MAX;n+=1){
  const d=4*n-8;
  const ratio=R[n]/R[n-1];
  const cNeeded=ratio-1;
  rows.push({
    n,
    linear_gap_lower_bound_diff_Rn_minus_Rn_minus_1:d,
    minimal_sequence_Rn_under_linear_bound:R[n],
    implied_ratio_Rn_over_Rn_minus_1_in_minimal_model:Number(ratio.toPrecision(8)),
    implied_c_in_ratio_model:Number(cNeeded.toPrecision(8)),
    quadratic_gap_scale_n2:n*n,
    linear_over_quadratic:Number((d/(n*n)).toPrecision(8)),
  });
}

const out={
  problem:'EP-812',
  script:path.basename(process.argv[1]),
  method:'quantitative_implication_profile_from_known_linear_ramsey_difference_bound',
  note:'This computes what the known linear difference lower bound implies for ratio and quadratic-gap targets in a minimal consistent model.',
  params:{N_MAX},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
