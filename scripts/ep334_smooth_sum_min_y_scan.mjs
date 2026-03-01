#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX = Number(process.env.N_MAX || 12000);
const CHECKPOINTS = [2000,5000,10000,20000,50000,100000,N_MAX].filter((x,i,a)=>x<=N_MAX&&a.indexOf(x)===i);

function sieveSpf(n){
  const spf=new Int32Array(n+1);
  for(let i=2;i<=n;i++){
    if(spf[i]===0){spf[i]=i; if(i*i<=n){for(let j=i*i;j<=n;j+=i) if(spf[j]===0) spf[j]=i;}}
  }
  return spf;
}

const spf=sieveSpf(N_MAX+5);
const P=new Int32Array(N_MAX+1);
P[1]=1;
for(let n=2;n<=N_MAX;n++) P[n]=spf[n]; // largest prime factor via spf recursion below
for(let n=2;n<=N_MAX;n++){
  let x=n, mx=1;
  while(x>1){const p=spf[x]; if(p>mx) mx=p; while(x%p===0) x=Math.floor(x/p);} 
  P[n]=mx;
}

const bestY=new Int32Array(N_MAX+1);
for(let n=2;n<=N_MAX;n++){
  let best=1e9;
  for(let a=1;a<n;a++){
    const y=Math.max(P[a],P[n-a]);
    if(y<best) best=y;
    if(best<=3) break;
  }
  bestY[n]=best;
}

const rows=[];
for(const N of CHECKPOINTS){
  let maxY=0, arg=-1;
  let sumAlpha=0;
  for(let n=2;n<=N;n++){
    const y=bestY[n];
    if(y>maxY){maxY=y; arg=n;}
    sumAlpha += Math.log(y)/Math.log(n);
  }
  rows.push({
    N,
    max_min_smoothness_up_to_N:maxY,
    argmax_n:arg,
    max_log_ratio_logY_over_logN:Number((Math.log(maxY)/Math.log(N)).toFixed(6)),
    mean_log_ratio:Number((sumAlpha/(N-1)).toFixed(6)),
  });
}

const hardInstances=[];
for(let n=2;n<=Math.min(N_MAX,20000);n++){
  if(bestY[n]>=200) hardInstances.push({n,best_y:bestY[n]});
}

const out={
  script:path.basename(process.argv[1]),
  n_max:N_MAX,
  checkpoints:rows,
  hard_instances_sample:hardInstances.slice(0,120),
  timestamp_utc:new Date().toISOString(),
};

const outPath=path.join('data','ep334_smooth_sum_min_y_scan.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log(JSON.stringify({outPath,n_max:N_MAX,rows:rows.length},null,2));
