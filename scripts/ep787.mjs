#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'20,28,36,44').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const RANDOM_TRIALS=Number(process.env.RANDOM_TRIALS||14);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 787);

function maxIndependentSizeFromAdj(adjMasks,n){
  let best=0;
  function dfs(cands,size){
    if(size + cands.length <= best) return;
    if(cands.length===0){ if(size>best) best=size; return; }
    while(cands.length){
      if(size + cands.length <= best) return;
      const v=cands.pop();
      const next=[];
      for(const u of cands) if(((adjMasks[v]>>BigInt(u))&1n)===0n) next.push(u);
      dfs(next,size+1);
    }
  }
  dfs(Array.from({length:n},(_,i)=>i),0);
  return best;
}

function alphaForA(A){
  const n=A.length;
  const S=new Set(A);
  const adj=Array(n).fill(0n);
  for(let i=0;i<n;i+=1){
    for(let j=i+1;j<n;j+=1){
      if(S.has(A[i]+A[j])){ adj[i]|=1n<<BigInt(j); adj[j]|=1n<<BigInt(i); }
    }
  }
  return maxIndependentSizeFromAdj(adj,n);
}

function randomSet(size,maxVal){const S=new Set(); while(S.size<size) S.add(1+Math.floor(rng()*maxVal)); return [...S].sort((a,b)=>a-b);}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  const candidates=[];
  candidates.push({type:'interval',A:Array.from({length:n},(_,i)=>i+1)});
  candidates.push({type:'odd_interval',A:Array.from({length:n},(_,i)=>2*i+1)});
  candidates.push({type:'geometric_like',A:Array.from({length:n},(_,i)=>Math.floor(1.35**(i+4)))});
  for(let t=0;t<RANDOM_TRIALS;t+=1) candidates.push({type:'random',A:randomSet(n,7*n)});

  let worst=n, worstType='none', avg=0;
  for(const c of candidates){
    const a=alphaForA(c.A);
    avg += a;
    if(a<worst){ worst=a; worstType=c.type; }
  }

  rows.push({
    n,
    sampled_A_count:candidates.length,
    worst_max_B_size_found:worst,
    worst_case_family_sampled:worstType,
    avg_max_B_size_over_samples:Number((avg/candidates.length).toPrecision(8)),
    worst_over_n:Number((worst/n).toPrecision(8)),
  });
}

const out={
  problem:'EP-787',
  script:path.basename(process.argv[1]),
  method:'deeper_exact_independence_scan_for_sum-avoiding_subset_size_g_n_proxy',
  params:{N_LIST,RANDOM_TRIALS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
