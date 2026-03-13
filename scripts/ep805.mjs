#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'128,192,256').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const G_LIST=(process.env.G_LIST||'24,32,40,48,56,72,96').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const GRAPH_SAMPLES=Number(process.env.GRAPH_SAMPLES||8);
const SUBSET_SAMPLES=Number(process.env.SUBSET_SAMPLES||120);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 805);

function randomGraph(n,p=0.5){
  const adj=Array.from({length:n},()=>0n);
  for(let i=0;i<n;i+=1) for(let j=i+1;j<n;j+=1) if(rng()<p){ adj[i]|=1n<<BigInt(j); adj[j]|=1n<<BigInt(i); }
  return adj;
}

function popcount(x){ let c=0; let y=x; while(y){ y&=y-1n; c+=1; } return c; }
function lsbIndex(bit){ let i=0; let b=bit; while((b&1n)===0n){ b>>=1n; i+=1; } return i; }

function hasCliqueAtLeastT(localMasks,t){
  const m=localMasks.length;
  let all=(1n<<BigInt(m))-1n;
  function dfs(cand,need){
    if(need<=0) return true;
    if(popcount(cand)<need) return false;
    let c=cand;
    while(c){
      const bit=c & -c;
      const v=lsbIndex(bit);
      if(dfs(cand & localMasks[v], need-1)) return true;
      c &= ~bit;
      cand &= ~bit;
      if(popcount(cand)<need) return false;
    }
    return false;
  }
  return dfs(all,t);
}

function sampleSubset(n,g){
  const arr=Array.from({length:n},(_,i)=>i);
  for(let i=0;i<g;i+=1){ const j=i+Math.floor(rng()*(n-i)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr.slice(0,g);
}

function buildLocalMasks(globalAdj,subset,complement=false){
  const m=subset.length;
  const out=Array(m).fill(0n);
  for(let i=0;i<m;i+=1){
    let mm=0n;
    for(let j=0;j<m;j+=1){
      if(i===j) continue;
      const u=subset[i], v=subset[j];
      const edge=((globalAdj[u]>>BigInt(v))&1n)===1n;
      if(complement ? !edge : edge) mm |= 1n<<BigInt(j);
    }
    out[i]=mm;
  }
  return out;
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  const t=Math.ceil(Math.log2(n));
  for(const g of G_LIST){
    if(g>=n) continue;
    let passTotal=0, total=0;
    for(let gi=0;gi<GRAPH_SAMPLES;gi+=1){
      const G=randomGraph(n,0.5);
      let pass=0;
      for(let s=0;s<SUBSET_SAMPLES;s+=1){
        const subset=sampleSubset(n,g);
        const m1=buildLocalMasks(G,subset,false);
        if(!hasCliqueAtLeastT(m1,t)) continue;
        const m2=buildLocalMasks(G,subset,true);
        if(hasCliqueAtLeastT(m2,t)) pass+=1;
      }
      passTotal += pass;
      total += SUBSET_SAMPLES;
    }
    rows.push({
      n,
      t,
      g,
      graph_samples:GRAPH_SAMPLES,
      subset_samples_per_graph:SUBSET_SAMPLES,
      sampled_fraction_with_both_clique_and_independent_at_least_t:Number((passTotal/total).toPrecision(8)),
    });
  }
}

const out={
  problem:'EP-805',
  script:path.basename(process.argv[1]),
  method:'deeper_induced_subgraph_local_ramsey_transition_scan_in_random_graphs',
  params:{N_LIST,G_LIST,GRAPH_SAMPLES,SUBSET_SAMPLES},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
