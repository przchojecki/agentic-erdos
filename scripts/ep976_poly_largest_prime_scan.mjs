#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX=Number(process.env.N_MAX||5000);

function sieveSpf(n){
  const spf=new Int32Array(n+1);
  for(let i=2;i<=n;i++){
    if(spf[i]===0){spf[i]=i; if(i*i<=n){for(let j=i*i;j<=n;j+=i) if(spf[j]===0) spf[j]=i;}}
  }
  return spf;
}

function largestPrimeFactor(x,spf){
  let n=Math.abs(x);
  let mx=1;
  while(n>1){const p=spf[n]; if(p>mx) mx=p; while(n%p===0) n=Math.floor(n/p);} 
  return mx;
}

const polys=[
  {name:'x2_plus_1', f:(m)=>m*m+1, deg:2},
  {name:'x2_plus_x_plus_1', f:(m)=>m*m+m+1, deg:2},
];

let maxVal=0;
for(let m=1;m<=N_MAX;m++){
  for(const P of polys){const v=Math.abs(P.f(m)); if(v>maxVal) maxVal=v;}
}
const spf=sieveSpf(maxVal+5);

const rows=[];
for(const P of polys){
  let F=1;
  const checkpoints=[2000,5000,10000,20000,50000,100000,N_MAX].filter((x,i,a)=>x<=N_MAX&&a.indexOf(x)===i);
  let cp=0;
  const pts=[];
  for(let n=1;n<=N_MAX;n++){
    const lpf=largestPrimeFactor(P.f(n),spf);
    if(lpf>F) F=lpf;
    while(cp<checkpoints.length && n>=checkpoints[cp]){
      const x=checkpoints[cp];
      pts.push({
        n:x,
        F_f_n:F,
        ratio_over_n:Number((F/x).toFixed(6)),
        ratio_over_n_pow_d:Number((F/Math.pow(x,P.deg)).toExponential(6)),
      });
      cp++;
    }
  }
  rows.push({poly:P.name,deg:P.deg,checkpoints:pts});
}

const out={script:path.basename(process.argv[1]),n_max:N_MAX,rows,timestamp_utc:new Date().toISOString()};
const outPath=path.join('data','ep976_poly_largest_prime_scan.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log(JSON.stringify({outPath,n_max:N_MAX,rows:rows.length},null,2));
