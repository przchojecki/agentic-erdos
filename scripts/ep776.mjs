#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'8,9,10,11,12').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const R_LIST=(process.env.R_LIST||'2,3').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const STEPS=Number(process.env.STEPS||40000);

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}
const rng=makeRng(20260313 ^ 776);

function allSubsets(n){
  const arr=[];
  for(let mask=1;mask<(1<<n);mask+=1){
    const bits=[]; let sz=0;
    for(let i=0;i<n;i+=1) if(mask&(1<<i)){bits.push(i); sz+=1;}
    arr.push({mask,sz,bits});
  }
  return arr;
}

function isAntichain(F){
  for(let i=0;i<F.length;i+=1) for(let j=i+1;j<F.length;j+=1){
    const a=F[i], b=F[j];
    if((a.mask & b.mask)===a.mask) return false;
    if((a.mask & b.mask)===b.mask) return false;
  }
  return true;
}

function stats(F,r){
  const mp=new Map();
  for(const s of F) mp.set(s.sz,(mp.get(s.sz)||0)+1);
  const realized=[...mp.entries()].filter(([,c])=>c>=r).map(([k])=>k).sort((a,b)=>a-b);
  return {realizedCount:realized.length, multBySize:Object.fromEntries([...mp.entries()].sort((a,b)=>a[0]-b[0]))};
}

function optimize(n,r,steps){
  const subs=allSubsets(n);
  let F=[];
  let best=stats(F,r);
  let bestMult=best.multBySize;

  for(let t=0;t<steps;t+=1){
    const add = rng()<0.55 || F.length===0;
    if(add){
      const cand=subs[Math.floor(rng()*subs.length)];
      if(!F.some(x=>x.mask===cand.mask)){
        const F2=F.concat([cand]);
        if(isAntichain(F2)){
          const st=stats(F2,r);
          if(st.realizedCount>=best.realizedCount || rng()<0.15){
            F=F2;
            if(st.realizedCount>best.realizedCount){
              best=st;
              bestMult=st.multBySize;
            }
          }
        }
      }
    } else {
      const idx=Math.floor(rng()*F.length);
      const removed=F[idx];
      F=F.filter((_,i)=>i!==idx);
      const st=stats(F,r);
      if(st.realizedCount+1<best.realizedCount && rng()>0.2){
        F=F.concat([removed]);
      }
    }
  }

  const final=stats(F,r);
  if(final.realizedCount>best.realizedCount){
    best=final;
    bestMult=final.multBySize;
  }
  return {best_realized_sizes_found:best.realizedCount, family_size:F.length, multiplicities:bestMult};
}

const t0=Date.now();
const rows=[];
for(const r of R_LIST){
  for(const n of N_LIST){
    const res=optimize(n,r,STEPS);
    rows.push({n,r,steps:STEPS,...res,target_n_minus_3:n-3,gap_to_n_minus_3:(n-3)-res.best_realized_sizes_found});
  }
}

const out={
  problem:'EP-776',
  script:path.basename(process.argv[1]),
  method:'finite_antichain_size_spectrum_search_under_multiplicity_constraint',
  warning:'Heuristic local search on small n only; not threshold n(r) proof.',
  params:{N_LIST,R_LIST,STEPS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
