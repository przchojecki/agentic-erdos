#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const R=Number(process.env.R||4);
const N_LIST=(process.env.N_LIST||'40,60,80').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const P_GRID=(process.env.P_GRID||'0.15,0.25,0.35').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const SAMPLES=Number(process.env.SAMPLES||18);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 802);

function randomGraph(n,p){
  const adj=Array.from({length:n},()=>new Set());
  for(let u=0;u<n;u+=1) for(let v=u+1;v<n;v+=1) if(rng()<p){adj[u].add(v);adj[v].add(u);} 
  return adj;
}

function hasKr(adj,r){
  const n=adj.length;
  const verts=Array.from({length:n},(_,i)=>i);
  function rec(start,clique){
    if(clique.length===r) return true;
    for(let i=start;i<n;i+=1){
      const v=verts[i];
      let ok=true;
      for(const u of clique) if(!adj[v].has(u)){ok=false;break;}
      if(!ok) continue;
      clique.push(v);
      if(rec(i+1,clique)) return true;
      clique.pop();
    }
    return false;
  }
  return rec(0,[]);
}

function pruneToKrFree(adj,r){
  const n=adj.length;
  const edges=[];
  for(let u=0;u<n;u+=1) for(const v of adj[u]) if(u<v) edges.push([u,v]);
  for(const [u,v] of edges){
    if(!adj[u].has(v)) continue;
    if(hasKr(adj,r)){
      adj[u].delete(v); adj[v].delete(u);
    }
  }
}

function alphaGreedy(adj){
  const n=adj.length;
  const rem=new Set(Array.from({length:n},(_,i)=>i));
  let a=0;
  while(rem.size){
    let best=-1,deg=1e9;
    for(const v of rem){
      let d=0; for(const u of adj[v]) if(rem.has(u)) d+=1;
      if(d<deg){deg=d;best=v;}
    }
    a+=1;
    const kill=[best,...adj[best]];
    for(const x of kill) rem.delete(x);
  }
  return a;
}

function avgDegree(adj){
  let m2=0; for(const s of adj) m2+=s.size; return m2/adj.length;
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  for(const p of P_GRID){
    let sumT=0,sumA=0,sumRatio=0;
    for(let s=0;s<SAMPLES;s+=1){
      const g=randomGraph(n,p);
      pruneToKrFree(g,R);
      const t=avgDegree(g);
      const a=alphaGreedy(g);
      const rhs=t>1?(Math.log(t)/t)*n:0;
      const ratio=rhs>0?a/rhs:null;
      sumT+=t; sumA+=a; if(ratio!=null) sumRatio+=ratio;
    }
    rows.push({
      r:R,
      n,
      p_seed:p,
      samples:SAMPLES,
      avg_degree_t:Number((sumT/SAMPLES).toPrecision(8)),
      avg_alpha_greedy:Number((sumA/SAMPLES).toPrecision(8)),
      avg_alpha_over_logt_over_t_n_proxy:Number((sumRatio/SAMPLES).toPrecision(8)),
    });
  }
}

const out={
  problem:'EP-802',
  script:path.basename(process.argv[1]),
  method:'finite_Kr_free_graph_scan_for_alpha_vs_logt_over_t_n_scale',
  warning:'Finite heuristic proxy (Kr-free pruning + greedy alpha), not proof of the asymptotic theorem.',
  params:{R,N_LIST,P_GRID,SAMPLES},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
