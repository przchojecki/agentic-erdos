#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const CASES=(process.env.CASES||'26:0.52:28,30:0.52:26,34:0.53:24,38:0.53:20').split(',').map((s)=>{const [n,p,t]=s.split(':');return {n:Number(n),p:Number(p),tries:Number(t)};});
const SAMPLE_7SETS=Number(process.env.SAMPLE_7SETS||16000);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 813);

function randomGraph(n,p){
  const adj=Array.from({length:n},()=>new Uint8Array(n));
  let m=0;
  for(let i=0;i<n;i+=1) for(let j=i+1;j<n;j+=1){ if(rng()<p){adj[i][j]=adj[j][i]=1; m+=1;} }
  return {n,m,adj};
}

function sampledLocalViolations(G,samples){
  let bad=0;
  const n=G.n;
  const verts=Array.from({length:n},(_,i)=>i);
  for(let s=0;s<samples;s+=1){
    for(let i=n-1;i>0;i-=1){ const j=Math.floor(rng()*(i+1)); [verts[i],verts[j]]=[verts[j],verts[i]]; }
    const A=verts.slice(0,7);
    let hasTri=false;
    for(let i=0;i<7 && !hasTri;i+=1){
      for(let j=i+1;j<7 && !hasTri;j+=1){
        if(!G.adj[A[i]][A[j]]) continue;
        for(let k=j+1;k<7;k+=1){ if(G.adj[A[i]][A[k]] && G.adj[A[j]][A[k]]){ hasTri=true; break; } }
      }
    }
    if(!hasTri) bad+=1;
  }
  return bad;
}

function cliqueSizeExact(G){
  const n=G.n;
  const masks=Array(n).fill(0n);
  for(let i=0;i<n;i+=1){ let m=0n; for(let j=0;j<n;j+=1) if(G.adj[i][j]) m|=1n<<BigInt(j); masks[i]=m; }
  let best=0;
  function popcount(x){let c=0; let y=x; while(y){y&=y-1n;c+=1;} return c;}
  function lsbIndex(bit){let i=0,b=bit; while((b&1n)===0n){b>>=1n;i+=1;} return i;}
  function dfs(cand,size){
    if(size+popcount(cand)<=best) return;
    if(cand===0n){ if(size>best) best=size; return; }
    let c=cand;
    while(c){
      const bit=c & -c;
      const v=lsbIndex(bit);
      dfs(cand & masks[v], size+1);
      c &= ~bit;
      cand &= ~bit;
      if(size+popcount(cand)<=best) return;
    }
  }
  dfs((1n<<BigInt(n))-1n,0);
  return best;
}

const t0=Date.now();
const rows=[];
for(const {n,p,tries} of CASES){
  let best=null;
  for(let t=0;t<tries;t+=1){
    const G=randomGraph(n,p);
    const bad=sampledLocalViolations(G,SAMPLE_7SETS);
    if(best===null || bad<best.bad || (bad===best.bad && G.m<best.G.m)) best={G,bad};
  }
  const clique=cliqueSizeExact(best.G);
  rows.push({
    n,
    edge_count:best.G.m,
    sampled_7set_triangle_free_violations:best.bad,
    sample_7sets:SAMPLE_7SETS,
    clique_number_exact:clique,
    clique_over_n_pow_1_over_3:Number((clique/(n**(1/3))).toPrecision(8)),
    clique_over_sqrt_n:Number((clique/Math.sqrt(n)).toPrecision(8)),
  });
}

const out={
  problem:'EP-813',
  script:path.basename(process.argv[1]),
  method:'deeper_candidate_search_under_local_7set_triangle_condition_with_exact_clique_evaluation',
  params:{CASES,SAMPLE_7SETS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
