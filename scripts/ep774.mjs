#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const M_LIST = (process.env.M_LIST || '12,14,16,18').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 20);
const MAX_T = Number(process.env.MAX_T || 6);
const MAX_V = Number(process.env.MAX_V || 500);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 774);

function subsetSums(arr){const sums=[0]; for(const x of arr){const len=sums.length; for(let i=0;i<len;i+=1) sums.push(sums[i]+x);} return sums;}
function isDissociated(arr){const s=subsetSums(arr).sort((a,b)=>a-b); for(let i=1;i<s.length;i+=1) if(s[i]===s[i-1]) return false; return true;}

function maxDissociatedSize(A){
  const n=A.length; let best=0;
  for(let mask=1;mask<(1<<n);mask+=1){
    const bits=mask.toString(2).replace(/0/g,'').length;
    if(bits<=best) continue;
    const S=[]; for(let i=0;i<n;i+=1) if((mask>>i)&1) S.push(A[i]);
    if(isDissociated(S)) best=bits;
  }
  return best;
}

function minPartitionDissociated(A,maxT){
  const n=A.length;
  const ord=[...A].sort((a,b)=>b-a);
  for(let t=1;t<=maxT;t+=1){
    const bins=Array.from({length:t},()=>[]);
    function dfs(i){
      if(i===n) return true;
      const x=ord[i];
      for(let b=0;b<t;b+=1){
        bins[b].push(x);
        if(isDissociated(bins[b]) && dfs(i+1)) return true;
        bins[b].pop();
      }
      return false;
    }
    if(dfs(0)) return t;
  }
  return null;
}

function randomSet(m,maxV){const S=new Set(); while(S.size<m) S.add(1+Math.floor(rng()*maxV)); return [...S].sort((a,b)=>a-b);}

const t0=Date.now();
const rows=[];
for(const m of M_LIST){
  let bestRatio=0, worstNeed=1, avgRatio=0, avgNeed=0;
  for(let t=0;t<TRIALS;t+=1){
    const A=randomSet(m,MAX_V);
    const d=maxDissociatedSize(A);
    const need=minPartitionDissociated(A,MAX_T);
    const ratio=d/m;
    avgRatio += ratio;
    if(need!=null) avgNeed += need;
    if(ratio>bestRatio) bestRatio=ratio;
    if(need!=null && need>worstNeed) worstNeed=need;
  }
  rows.push({
    m,
    trials:TRIALS,
    best_dissociated_dimension_ratio_found:Number(bestRatio.toPrecision(8)),
    avg_dissociated_dimension_ratio:Number((avgRatio/TRIALS).toPrecision(8)),
    worst_min_partition_count_into_dissociated_classes_found:worstNeed,
    avg_min_partition_count_proxy:Number((avgNeed/TRIALS).toPrecision(8)),
  });
}

const out={
  problem:'EP-774',
  script:path.basename(process.argv[1]),
  method:'exact_finite_dissociation_dimension_and_partition_profile_scan',
  params:{M_LIST,TRIALS,MAX_T,MAX_V},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
