#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const EXACT_N_LIST=(process.env.EXACT_N_LIST||'16,20,24').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const HEUR_N_LIST=(process.env.HEUR_N_LIST||'28,32,40').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const RAND_SAMPLES=Number(process.env.RAND_SAMPLES||12);

function maxSumFreeExact(A){
  const n=A.length;
  const order=Array.from({length:n},(_,i)=>i).sort((i,j)=>A[j]-A[i]);
  const chosen=[];
  let best=0;
  function canAdd(v){
    for(const x of chosen){
      for(const y of chosen){ if(x+y===v) return false; }
      if(x+v===x || x+v===v){} // no-op clarity
    }
    for(const x of chosen){ if(chosen.includes(x+v)) return false; }
    if(chosen.includes(2*v)) return false;
    return true;
  }
  function dfs(pos){
    if(chosen.length + (n-pos) <= best) return;
    if(pos===n){ if(chosen.length>best) best=chosen.length; return; }
    const v=A[order[pos]];
    if(canAdd(v)){
      chosen.push(v);
      dfs(pos+1);
      chosen.pop();
    }
    dfs(pos+1);
  }
  dfs(0);
  return best;
}

function greedySumFree(A){
  const S=[];
  const arr=[...A].sort((a,b)=>b-a);
  function ok(v){
    for(const x of S){ for(const y of S){ if(x+y===v) return false; } }
    for(const x of S){ for(const y of S){ if(x+y===v) return false; } }
    for(const x of S){ if(S.includes(x+v)) return false; }
    if(S.includes(2*v)) return false;
    return true;
  }
  for(const v of arr) if(ok(v)) S.push(v);
  return S.length;
}

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}
const rng=makeRng(20260313 ^ 792);
function randomSet(size,maxVal){ const S=new Set(); while(S.size<size) S.add(1+Math.floor(rng()*maxVal)); return [...S].sort((a,b)=>a-b); }

const t0=Date.now();
const exact_rows=[];
for(const n of EXACT_N_LIST){
  const samples=[];
  samples.push(Array.from({length:n},(_,i)=>i+1));
  samples.push(Array.from({length:n},(_,i)=>i+2));
  for(let t=0;t<RAND_SAMPLES;t+=1) samples.push(randomSet(n,6*n));
  let worst=n, avg=0;
  for(const A of samples){ const v=maxSumFreeExact(A); avg+=v; if(v<worst) worst=v; }
  exact_rows.push({n,sampled_A_count:samples.length,worst_max_sum_free_size_found:worst,avg_max_sum_free_size:Number((avg/samples.length).toPrecision(8)),worst_over_n:Number((worst/n).toPrecision(8)),worst_minus_n_over_3:Number((worst-n/3).toPrecision(8))});
}

const heuristic_rows=[];
for(const n of HEUR_N_LIST){
  const samples=[];
  samples.push(Array.from({length:n},(_,i)=>i+1));
  samples.push(Array.from({length:n},(_,i)=>2*i+1));
  for(let t=0;t<RAND_SAMPLES;t+=1) samples.push(randomSet(n,8*n));
  let worst=n, avg=0;
  for(const A of samples){ const v=greedySumFree(A); avg+=v; if(v<worst) worst=v; }
  heuristic_rows.push({n,sampled_A_count:samples.length,worst_greedy_sum_free_size_found:worst,avg_greedy_sum_free_size:Number((avg/samples.length).toPrecision(8)),worst_over_n:Number((worst/n).toPrecision(8))});
}

const out={
  problem:'EP-792',
  script:path.basename(process.argv[1]),
  method:'exact_small_n_plus_heuristic_larger_n_sum_free_subset_profile',
  params:{EXACT_N_LIST,HEUR_N_LIST,RAND_SAMPLES},
  exact_rows,
  heuristic_rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
