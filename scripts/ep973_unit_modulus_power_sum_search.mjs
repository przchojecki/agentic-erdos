#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const NS=(process.env.NS||'8,12,16,20').split(',').map(x=>Number(x.trim())).filter(Boolean);
const RESTARTS=Number(process.env.RESTARTS||1200);

function runN(n){
  let best=1e99;
  let bestC=1;
  for(let r=0;r<RESTARTS;r++){
    const th=[];
    for(let i=0;i<n;i++) th.push(2*Math.PI*Math.random());
    th[0]=0; // z1=1

    let cur=1e99;
    for(let it=0;it<500;it++){
      // evaluate
      let m=0;
      for(let k=2;k<=n+1;k++){
        let re=0, im=0;
        for(let i=0;i<n;i++){
          const a=k*th[i];
          re += Math.cos(a);
          im += Math.sin(a);
        }
        const v=Math.hypot(re,im);
        if(v>m) m=v;
      }
      cur=m;

      // random tweak
      const j=1+Math.floor(Math.random()*(n-1));
      const old=th[j];
      th[j]+= (Math.random()-0.5)*0.4;

      // quick re-eval accept/reject
      let m2=0;
      for(let k=2;k<=n+1;k++){
        let re=0, im=0;
        for(let i=0;i<n;i++){
          const a=k*th[i]; re+=Math.cos(a); im+=Math.sin(a);
        }
        const v=Math.hypot(re,im); if(v>m2) m2=v;
      }
      if(m2<=cur || Math.random()<0.02) cur=m2; else th[j]=old;
    }

    if(cur<best){
      best=cur;
      if(cur>0) bestC=Math.pow(1/cur,1/n);
    }
  }
  return {n,restarts:RESTARTS,best_max_power_sum:Number(best.toExponential(6)),implied_C_from_best:Number(bestC.toFixed(6))};
}

const rows=NS.map(runN);
const out={script:path.basename(process.argv[1]),ns:NS,restarts:RESTARTS,rows,timestamp_utc:new Date().toISOString()};
const outPath=path.join('data','ep973_unit_modulus_power_sum_search.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log(JSON.stringify({outPath,rows:rows.length,restarts:RESTARTS},null,2));
