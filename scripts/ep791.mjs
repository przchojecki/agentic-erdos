#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const EXACT_N_LIST=(process.env.EXACT_N_LIST||'10,15,20,24,28').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const GREEDY_N_LIST=(process.env.GREEDY_N_LIST||'40,60,80,120,160,220').split(',').map((x)=>Number(x.trim())).filter(Boolean);

function coverCount(n,arr){
  const cov=new Uint8Array(n+1);
  for(let i=0;i<arr.length;i+=1) for(let j=i;j<arr.length;j+=1){ const s=arr[i]+arr[j]; if(s<=n) cov[s]=1; }
  let c=0; for(let x=0;x<=n;x+=1) c+=cov[x];
  return c;
}

function minBasisExact(n){
  const target=n+1;
  function feasible(k){
    const arr=[0];
    function dfs(nextVal){
      if(arr.length===k) return coverCount(n,arr)===target;
      const curCov=coverCount(n,arr);
      const r=k-arr.length;
      const curSize=arr.length;
      const maxNew=r*curSize + (r*(r+1))/2;
      if(curCov+maxNew<target) return false;
      for(let v=nextVal;v<=n;v+=1){ arr.push(v); if(dfs(v+1)) return true; arr.pop(); }
      return false;
    }
    return dfs(1);
  }
  for(let k=Math.max(2,Math.floor(Math.sqrt(2*n)));k<=n+1;k+=1) if(feasible(k)) return k;
  return null;
}

function greedyBasis(n){
  const A=[0];
  const cov=new Uint8Array(n+1); cov[0]=1;
  function add(v){
    for(const a of A){ const s=a+v; if(s<=n) cov[s]=1; }
    const s2=2*v; if(s2<=n) cov[s2]=1;
    A.push(v);
  }
  while(true){
    let uncovered=-1;
    for(let x=0;x<=n;x+=1){ if(!cov[x]){uncovered=x;break;} }
    if(uncovered<0) break;
    let bestV=1,bestGain=-1;
    for(let v=1;v<=n;v+=1){
      if(A.includes(v)) continue;
      let gain=0;
      for(const a of A){ const s=a+v; if(s<=n && !cov[s]) gain+=1; }
      const s2=2*v; if(s2<=n && !cov[s2]) gain+=1;
      if(gain>bestGain){bestGain=gain;bestV=v;}
    }
    add(bestV);
  }
  return A.length;
}

const t0=Date.now();
const exact_rows=[];
for(const n of EXACT_N_LIST){ const g=minBasisExact(n); exact_rows.push({n,g_n_exact:g,g_n_squared_over_n:Number(((g*g)/n).toPrecision(8))}); }

const greedy_rows=[];
for(const n of GREEDY_N_LIST){ const g=greedyBasis(n); greedy_rows.push({n,g_n_greedy_upper:g,g_n_squared_over_n:Number(((g*g)/n).toPrecision(8))}); }

const out={
  problem:'EP-791',
  script:path.basename(process.argv[1]),
  method:'exact_small_n_and_greedy_larger_n_profile_for_min_additive_2_basis_size',
  params:{EXACT_N_LIST,GREEDY_N_LIST},
  exact_rows,
  greedy_rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
