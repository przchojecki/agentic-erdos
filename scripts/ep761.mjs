#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '7,8,9').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const SAMPLES = Number(process.env.SAMPLES || 90);

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}
const rng=makeRng(20260313 ^ 761);

function randomGraph(n,p=0.45){
  const adj=Array.from({length:n},()=>[]);
  for(let u=0;u<n;u+=1) for(let v=u+1;v<n;v+=1) if(rng()<p){adj[u].push(v);adj[v].push(u);} 
  return adj;
}

function chromaticNumber(adj){
  const n=adj.length; const ord=Array.from({length:n},(_,i)=>i).sort((a,b)=>adj[b].length-adj[a].length); const col=Array(n).fill(-1);
  function can(k,idx=0){
    if(idx===n) return true;
    const v=ord[idx]; const used=new Set(); for(const u of adj[v]) if(col[u]>=0) used.add(col[u]);
    for(let c=0;c<k;c+=1){ if(used.has(c)) continue; col[v]=c; if(can(k,idx+1)) return true; col[v]=-1; }
    return false;
  }
  for(let k=1;k<=n;k+=1) if(can(k)) return k;
  return n;
}

function orientRandom(adj){
  const n=adj.length; const out=Array.from({length:n},()=>[]);
  for(let u=0;u<n;u+=1){
    for(const v of adj[u]) if(u<v){ if(rng()<0.5) out[u].push(v); else out[v].push(u); }
  }
  return out;
}

function isAcyclicInduced(oriented, subset){
  const set=new Set(subset); const indeg=new Map(subset.map(v=>[v,0]));
  for(const u of subset) for(const v of oriented[u]) if(set.has(v)) indeg.set(v, indeg.get(v)+1);
  const q=[]; for(const [v,d] of indeg) if(d===0) q.push(v);
  let seen=0;
  for(let i=0;i<q.length;i+=1){
    const u=q[i]; seen+=1;
    for(const v of oriented[u]) if(set.has(v)){ indeg.set(v, indeg.get(v)-1); if(indeg.get(v)===0) q.push(v); }
  }
  return seen===subset.length;
}

function dichromaticNumber(oriented){
  const n=oriented.length; const ord=Array.from({length:n},(_,i)=>i).sort((a,b)=>oriented[b].length-oriented[a].length); const col=Array(n).fill(-1);
  function can(k,idx=0){
    if(idx===n) return true;
    const v=ord[idx];
    for(let c=0;c<k;c+=1){
      const subset=[v];
      for(let i=0;i<n;i+=1) if(col[i]===c) subset.push(i);
      if(!isAcyclicInduced(oriented,subset)) continue;
      col[v]=c;
      if(can(k,idx+1)) return true;
      col[v]=-1;
    }
    return false;
  }
  for(let k=1;k<=n;k+=1) if(can(k)) return k;
  return n;
}

function cochromaticNumber(adj){
  const n=adj.length; const mat=Array.from({length:n},()=>Array(n).fill(false));
  for(let u=0;u<n;u+=1) for(const v of adj[u]) mat[u][v]=true;
  const ord=Array.from({length:n},(_,i)=>i); const part=[];
  for(const v of ord){
    let placed=false;
    for(const cls of part){
      let clique=true, indep=true;
      for(const u of cls){ if(!mat[u][v]) clique=false; if(mat[u][v]) indep=false; }
      if(clique || indep){ cls.push(v); placed=true; break; }
    }
    if(!placed) part.push([v]);
  }
  return part.length;
}

const t0=Date.now();
const rows=[];
for(const n of N_LIST){
  let sumChi=0,sumD=0,sumCo=0;
  let countChiGe4=0, countDGe3=0;
  for(let t=0;t<SAMPLES;t+=1){
    const g=randomGraph(n,0.45);
    const chi=chromaticNumber(g);
    const d=dichromaticNumber(orientRandom(g));
    const co=cochromaticNumber(g);
    sumChi += chi; sumD += d; sumCo += co;
    if(chi>=4) countChiGe4 += 1;
    if(d>=3) countDGe3 += 1;
  }
  rows.push({
    n,
    samples:SAMPLES,
    avg_chromatic: Number((sumChi/SAMPLES).toPrecision(8)),
    avg_dichromatic_random_orientation: Number((sumD/SAMPLES).toPrecision(8)),
    avg_cochromatic_greedy_proxy: Number((sumCo/SAMPLES).toPrecision(8)),
    frac_chi_ge_4: Number((countChiGe4/SAMPLES).toPrecision(8)),
    frac_dichromatic_ge_3: Number((countDGe3/SAMPLES).toPrecision(8)),
  });
}

const out={
  problem:'EP-761',
  script:path.basename(process.argv[1]),
  method:'finite_proxy_scan_chromatic_vs_dichromatic_vs_cochromatic',
  warning:'Exact dichromatic on small n with random orientations; not a proof of asymptotic implications.',
  params:{N_LIST,SAMPLES},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
