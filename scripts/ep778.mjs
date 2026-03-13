#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'10,12,14,16').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const TRIALS=Number(process.env.TRIALS||220);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 778);

function allEdges(n){const e=[]; for(let i=0;i<n;i+=1) for(let j=i+1;j<n;j+=1) e.push([i,j]); return e;}

function maxCliqueSize(adj){
  const n=adj.length;
  const mat=Array.from({length:n},()=>Array(n).fill(false));
  for(let u=0;u<n;u+=1) for(const v of adj[u]) mat[u][v]=true;
  let best=0;
  function rec(cands,size){
    if(size+cands.length<=best) return;
    if(cands.length===0){ if(size>best) best=size; return; }
    while(cands.length){
      if(size+cands.length<=best) return;
      const v=cands.pop();
      const next=[];
      for(const u of cands) if(mat[v][u]) next.push(u);
      rec(next,size+1);
    }
  }
  rec(Array.from({length:n},(_,i)=>i),0);
  return best;
}

function chooseEdge(rem,adj,strat){
  const list=[...rem];
  if(strat==='random'){
    const k=list[Math.floor(rng()*list.length)];
    return k.split(',').map(Number);
  }
  // greedy_triangle or greedy_degree
  let best=null,bScore=-1;
  const inspect=Math.min(list.length,160);
  for(let t=0;t<inspect;t+=1){
    const k=list[Math.floor(rng()*list.length)];
    const [u,v]=k.split(',').map(Number);
    let s=0;
    if(strat==='greedy_triangle'){
      for(let w=0;w<adj.length;w+=1) if(adj[u][w]&&adj[v][w]) s+=1;
    } else if(strat==='greedy_degree'){
      let du=0,dv=0;
      for(let w=0;w<adj.length;w+=1){ if(adj[u][w]) du+=1; if(adj[v][w]) dv+=1; }
      s=du+dv;
    }
    if(s>bScore){bScore=s;best=[u,v];}
  }
  return best;
}

function play(n,sa,sb){
  const rem=new Set(allEdges(n).map(([u,v])=>`${u},${v}`));
  const red=Array.from({length:n},()=>Array(n).fill(0));
  const blue=Array.from({length:n},()=>Array(n).fill(0));
  let aTurn=true;
  while(rem.size){
    if(aTurn){
      const [u,v]=chooseEdge(rem,red,sa);
      red[u][v]=red[v][u]=1;
      rem.delete(`${Math.min(u,v)},${Math.max(u,v)}`);
    } else {
      const [u,v]=chooseEdge(rem,blue,sb);
      blue[u][v]=blue[v][u]=1;
      rem.delete(`${Math.min(u,v)},${Math.max(u,v)}`);
    }
    aTurn=!aTurn;
  }
  const redAdj=red.map((row,i)=>row.flatMap((x,j)=>x?[j]:[]));
  const blueAdj=blue.map((row,i)=>row.flatMap((x,j)=>x?[j]:[]));
  return {redClique:maxCliqueSize(redAdj),blueClique:maxCliqueSize(blueAdj)};
}

const t0=Date.now();
const rows=[];
const configs=[
  ['random','random'],
  ['greedy_triangle','greedy_triangle'],
  ['greedy_degree','greedy_degree'],
  ['greedy_triangle','random'],
  ['random','greedy_triangle'],
  ['greedy_degree','random'],
  ['random','greedy_degree'],
];
for(const n of N_LIST){
  for(const [sa,sb] of configs){
    let aw=0,bw=0,tie=0,sumGap=0;
    for(let t=0;t<TRIALS;t+=1){
      const {redClique,blueClique}=play(n,sa,sb);
      const gap=redClique-blueClique;
      sumGap += gap;
      if(gap>0) aw+=1; else if(gap<0) bw+=1; else tie+=1;
    }
    rows.push({n,alice_strategy:sa,bob_strategy:sb,trials:TRIALS,alice_win_rate:Number((aw/TRIALS).toPrecision(7)),bob_win_rate:Number((bw/TRIALS).toPrecision(7)),tie_rate:Number((tie/TRIALS).toPrecision(7)),avg_red_minus_blue_clique:Number((sumGap/TRIALS).toPrecision(7))});
  }
}

const out={
  problem:'EP-778',
  script:path.basename(process.argv[1]),
  method:'deeper_simulation_of_clique_game_with_multiple_strategy_profiles',
  params:{N_LIST,TRIALS,configs:configs.map(([a,b])=>`${a}_vs_${b}`)},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
