#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '10,12,14').split(',').map((x) => Number(x.trim())).filter(Boolean);
const SAMPLES = Number(process.env.SAMPLES || 220);
const RANGE = Number(process.env.RANGE || 200);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 757);

function diffCount4(B){
  const d=new Set();
  for(let i=0;i<4;i+=1) for(let j=0;j<4;j+=1) d.add(B[i]-B[j]);
  return d.size;
}

function conditionHolds(A){
  const n=A.length;
  for(let a=0;a<n;a+=1) for(let b=a+1;b<n;b+=1) for(let c=b+1;c<n;c+=1) for(let d=c+1;d<n;d+=1){
    const B=[A[a],A[b],A[c],A[d]];
    if(diffCount4(B)<11) return false;
  }
  return true;
}

function maxSidonSubsetSize(A){
  const n=A.length;
  let best=0;
  function rec(i, chosen, sums){
    if(chosen.length + (n-i) <= best) return;
    if(i===n){ if(chosen.length>best) best=chosen.length; return; }
    // skip
    rec(i+1, chosen, sums);
    // take if preserves Sidon pair-sum uniqueness
    const x=A[i];
    let ok=true;
    for(const y of chosen){
      const s=x+y;
      if(sums.has(s)){ ok=false; break; }
    }
    if(ok){
      const added=[];
      for(const y of chosen){ const s=x+y; sums.add(s); added.push(s); }
      const s2=2*x;
      if(sums.has(s2)){ for(const s of added) sums.delete(s); return; }
      sums.add(s2); added.push(s2);
      chosen.push(x);
      rec(i+1, chosen, sums);
      chosen.pop();
      for(const s of added) sums.delete(s);
    }
  }
  rec(0, [], new Set());
  return best;
}

function randomCandidate(n, range){
  const set=new Set();
  while(set.size<n) set.add(1 + Math.floor(rng()*range));
  return [...set].sort((a,b)=>a-b);
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  let accepted=0;
  let bestRatio=0;
  let worstRatio=1;
  let avgRatio=0;
  let trials=0;
  while(accepted<SAMPLES && trials<SAMPLES*200){
    trials += 1;
    const A=randomCandidate(n,RANGE);
    if(!conditionHolds(A)) continue;
    const s=maxSidonSubsetSize(A);
    const ratio=s/n;
    accepted += 1;
    avgRatio += ratio;
    if(ratio>bestRatio) bestRatio=ratio;
    if(ratio<worstRatio) worstRatio=ratio;
  }
  rows.push({
    n,
    accepted_samples: accepted,
    attempted_samples: trials,
    best_sidon_ratio_sampled: Number(bestRatio.toPrecision(8)),
    worst_sidon_ratio_sampled: Number(worstRatio.toPrecision(8)),
    avg_sidon_ratio_sampled: accepted?Number((avgRatio/accepted).toPrecision(8)):null,
  });
}

const out={
  problem:'EP-757',
  script:path.basename(process.argv[1]),
  method:'exact_small_n_sidon_extraction_under_local_difference_richness_constraint',
  warning:'Finite random sampling + exact subset search; not asymptotic constant determination.',
  params:{N_LIST,SAMPLES,RANGE},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
