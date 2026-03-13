#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_MAX = Number(process.env.N_MAX || 20);

function powBig(a,b){ let r=1n; let x=BigInt(a); for(let i=0;i<b;i+=1) r*=x; return r; }

const t0=Date.now();
const rows=[];
for(let n=2;n<=N_MAX;n+=1){
  const lowerHad = (1n<<BigInt(n)) + (1n<<BigInt(n-1));
  const lower2018 = n>=3 ? (1n<<BigInt(n+1)) - 1n : null;
  const nPowN = powBig(n,n);
  const upperGeneral = n>=3 ? powBig(2*n,n-1) : null;
  const upperPrimeCase = 1.8 * (n ** (n+1));
  const upperOther = Math.E**2 * (n ** n);
  const bestUpper = n>=3 ? Math.min(Number(upperGeneral), upperPrimeCase, upperOther) : Math.min(upperPrimeCase,upperOther);
  rows.push({
    n,
    lower_hadwiger: lowerHad.toString(),
    lower_2018_if_n_ge_3: lower2018?lower2018.toString():null,
    n_pow_n: nPowN.toString(),
    best_upper_numeric: Number(bestUpper.toExponential(8)),
    lower_had_over_n_pow_n: Number((Number(lowerHad)/Number(nPowN)).toExponential(8)),
    best_upper_over_n_pow_n: Number((bestUpper/Number(nPowN)).toExponential(8)),
    best_upper_over_lower_had: Number((bestUpper/Number(lowerHad)).toExponential(8)),
  });
}

const out={
  problem:'EP-769',
  script:path.basename(process.argv[1]),
  method:'extended_numeric_landscape_for_cube_tiling_threshold_c_n_bounds',
  params:{N_MAX},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
