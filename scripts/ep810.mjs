#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'30,40,50').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const TRIALS=Number(process.env.TRIALS||8);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 810);
function edgeKey(u,v){ return u<v?`${u},${v}`:`${v},${u}`; }

function attempt(n){
  const color=new Map();
  let edges=0;
  const all=[];
  for(let i=0;i<n;i+=1) for(let j=i+1;j<n;j+=1) all.push([i,j]);
  for(let i=all.length-1;i>0;i-=1){ const j=Math.floor(rng()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }

  const adj=Array.from({length:n},()=>new Set());

  function validColor(u,v,c){
    // check all C4 containing edge (u,v): pick x in N(u), y in N(v) with edge x-y
    for(const x of adj[u]){
      if(x===v) continue;
      for(const y of adj[v]){
        if(y===u || y===x) continue;
        if(!adj[x].has(y)) continue;
        const c1=color.get(edgeKey(u,x));
        const c2=color.get(edgeKey(x,y));
        const c3=color.get(edgeKey(y,v));
        // C4 edges: (u,x),(x,y),(y,v),(v,u) with new color c on (u,v)
        const S=new Set([c1,c2,c3,c]);
        if(S.size<4) return false;
      }
    }
    return true;
  }

  for(const [u,v] of all){
    let placed=false;
    // try random colors among n colors
    for(let t=0;t<10;t+=1){
      const c=1+Math.floor(rng()*n);
      if(validColor(u,v,c)){
        color.set(edgeKey(u,v),c);
        adj[u].add(v); adj[v].add(u);
        edges+=1;
        placed=true;
        break;
      }
    }
    if(!placed){
      // optionally skip edge
    }
  }

  return {edges,density:edges/(n*n),colors_used:new Set(color.values()).size};
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  let best=0,bestColors=0,avg=0;
  for(let tr=0;tr<TRIALS;tr+=1){
    const r=attempt(n);
    avg += r.density;
    if(r.density>best){ best=r.density; bestColors=r.colors_used; }
  }
  rows.push({
    n,
    trials:TRIALS,
    best_density_over_n2:Number(best.toPrecision(8)),
    avg_density_over_n2:Number((avg/TRIALS).toPrecision(8)),
    best_colors_used:bestColors,
  });
}

const out={
  problem:'EP-810',
  script:path.basename(process.argv[1]),
  method:'random_greedy_n_color_edge_coloring_with_C4_all-distinct_constraint',
  warning:'Finite constructive heuristic only; no asymptotic existence proof.',
  params:{N_LIST,TRIALS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
