#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-809 statement is malformed in local source. This script provides a finite proxy:
// maximize edges in a near-Turan graph with edge-coloring constraints that avoid
// rainbow odd cycles up to bounded length.

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'30,40,50').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const K_COLORS=Number(process.env.K_COLORS||6);
const ODD_LENS=(process.env.ODD_LENS||'3,5,7').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const TRIALS=Number(process.env.TRIALS||50);

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}
const rng=makeRng(20260313 ^ 809);

function edgeKey(u,v){ return u<v?`${u},${v}`:`${v},${u}`; }

function randomColoringNearTuran(n,k){
  const left=[]; const right=[];
  for(let i=0;i<n;i+=1){ if(i<n/2) left.push(i); else right.push(i); }
  const color=new Map();
  let edges=0;

  // complete bipartite backbone
  for(const u of left) for(const v of right){ color.set(edgeKey(u,v),1+Math.floor(rng()*k)); edges+=1; }

  // random intra-part additions with constrained colors
  const all=[];
  for(const part of [left,right]) for(let i=0;i<part.length;i+=1) for(let j=i+1;j<part.length;j+=1) all.push([part[i],part[j]]);
  for(let i=all.length-1;i>0;i-=1){ const j=Math.floor(rng()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }

  // add fraction of intra edges
  const addTarget=Math.floor(0.25*all.length);
  for(let i=0;i<addTarget;i+=1){
    const [u,v]=all[i];
    color.set(edgeKey(u,v),1+Math.floor(rng()*k));
    edges+=1;
  }
  return {color,edges};
}

function structuredTwoColorNearTuran(n){
  const left=[]; const right=[];
  for(let i=0;i<n;i+=1){ if(i<n/2) left.push(i); else right.push(i); }
  const color=new Map();
  let edges=0;
  // complete bipartite edges color 1
  for(const u of left) for(const v of right){ color.set(edgeKey(u,v),1); edges+=1; }
  // add all intra-part edges color 2
  for(const part of [left,right]){
    for(let i=0;i<part.length;i+=1){
      for(let j=i+1;j<part.length;j+=1){
        color.set(edgeKey(part[i],part[j]),2);
        edges+=1;
      }
    }
  }
  return {color,edges};
}

function neighbors(n,color,u){
  const out=[];
  for(let v=0;v<n;v+=1){ if(v===u) continue; if(color.has(edgeKey(u,v))) out.push(v); }
  return out;
}

function hasRainbowOddCycleBounded(n,color,oddLens){
  // sample-based detector for bounded odd cycles
  const maxLen=Math.max(...oddLens);
  const trials=2000;
  for(let t=0;t<trials;t+=1){
    const start=Math.floor(rng()*n);
    let path=[start];
    let used=new Set([start]);
    while(path.length<maxLen){
      const u=path[path.length-1];
      const nb=neighbors(n,color,u).filter((v)=>!used.has(v));
      if(nb.length===0) break;
      const v=nb[Math.floor(rng()*nb.length)];
      path.push(v); used.add(v);
      const len=path.length;
      if(oddLens.includes(len) && color.has(edgeKey(path[0],path[len-1]))){
        const cyc=[...path, path[0]];
        const colSet=new Set();
        let ok=true;
        for(let i=0;i<cyc.length-1;i+=1){
          const c=color.get(edgeKey(cyc[i],cyc[i+1]));
          if(colSet.has(c)){ ok=false; break; }
          colSet.add(c);
        }
        if(ok) return true;
      }
    }
  }
  return false;
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  let bestEdgesRandom=0;
  let nonRainbowPass=0;
  for(let tr=0;tr<TRIALS;tr+=1){
    const G=randomColoringNearTuran(n,K_COLORS);
    if(!hasRainbowOddCycleBounded(n,G.color,ODD_LENS)){
      nonRainbowPass += 1;
      if(G.edges>bestEdgesRandom) bestEdgesRandom=G.edges;
    }
  }
  const structured=structuredTwoColorNearTuran(n);
  const structuredPass=!hasRainbowOddCycleBounded(n,structured.color,ODD_LENS);
  rows.push({
    n,
    trials:TRIALS,
    k_colors:K_COLORS,
    odd_cycle_lengths_checked:ODD_LENS,
    pass_fraction_no_rainbow_odd_cycle_sampled:Number((nonRainbowPass/TRIALS).toPrecision(8)),
    best_edge_count_among_random_passing_samples:bestEdgesRandom,
    best_edge_density_over_n2_random:Number((bestEdgesRandom/(n*n)).toPrecision(8)),
    structured_two_color_passes:structuredPass,
    structured_two_color_edge_density_over_n2:Number((structured.edges/(n*n)).toPrecision(8)),
    turan_n2_over_4:Number(((n*n)/4).toPrecision(8)),
  });
}

const out={
  problem:'EP-809',
  script:path.basename(process.argv[1]),
  method:'finite_proxy_near_turan_edge_coloring_with_bounded_odd-rainbow_avoidance',
  warning:'Statement text is malformed in local dataset; this is an explicit proxy experiment.',
  params:{N_LIST,K_COLORS,ODD_LENS,TRIALS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
