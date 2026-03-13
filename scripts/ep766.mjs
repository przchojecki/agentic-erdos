#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const K = Number(process.env.K || 6);
const N_LIST = (process.env.N_LIST || '10,12,14').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const L_LIST = (process.env.L_LIST || '7,8,9').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const G_SAMPLES = Number(process.env.G_SAMPLES || 70);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 766);

function randomKLEdgeGraph(k,l){
  const edges=[]; for(let u=0;u<k;u+=1) for(let v=u+1;v<k;v+=1) edges.push([u,v]);
  for(let i=edges.length-1;i>0;i-=1){const j=Math.floor(rng()*(i+1));[edges[i],edges[j]]=[edges[j],edges[i]];}
  const choose=edges.slice(0,l);
  const adj=Array.from({length:k},()=>new Set());
  for(const [u,v] of choose){adj[u].add(v);adj[v].add(u);} 
  return adj.map(s=>[...s]);
}

function hasCopy(hostAdj, targetAdj){
  const n=hostAdj.length, k=targetAdj.length;
  const hostM=Array.from({length:n},()=>Array(n).fill(false));
  for(let u=0;u<n;u+=1) for(const v of hostAdj[u]) hostM[u][v]=true;
  const tEdges=[];
  for(let u=0;u<k;u+=1) for(const v of targetAdj[u]) if(u<v) tEdges.push([u,v]);

  const verts=Array.from({length:n},(_,i)=>i);
  const sub=[];
  function rec(start){
    if(sub.length===k){
      // test all permutations of mapping target->chosen subset
      const p=Array.from({length:k},(_,i)=>i);
      function perm(i){
        if(i===k){
          for(const [a,b] of tEdges){ if(!hostM[sub[p[a]]][sub[p[b]]]) return false; }
          return true;
        }
        for(let j=i;j<k;j+=1){ [p[i],p[j]]=[p[j],p[i]]; if(perm(i+1)) return true; [p[i],p[j]]=[p[j],p[i]]; }
        return false;
      }
      return perm(0);
    }
    for(let i=start;i<=n-(k-sub.length);i+=1){ sub.push(verts[i]); if(rec(i+1)) return true; sub.pop(); }
    return false;
  }
  return rec(0);
}

function exAvoidingTarget(n,targetAdj){
  const all=[]; for(let u=0;u<n;u+=1) for(let v=u+1;v<n;v+=1) all.push([u,v]);
  const host=Array.from({length:n},()=>new Set());
  let m=0;
  for(const [u,v] of all){
    host[u].add(v); host[v].add(u);
    const adj=host.map(s=>[...s]);
    if(hasCopy(adj,targetAdj)){ host[u].delete(v); host[v].delete(u); }
    else m += 1;
  }
  return m;
}

const t0=Date.now();
const rows=[];
for(const l of L_LIST){
  for(const n of N_LIST){
    let bestMin=Infinity;
    for(let s=0;s<G_SAMPLES;s+=1){
      const G=randomKLEdgeGraph(K,l);
      const ex=exAvoidingTarget(n,G);
      if(ex<bestMin) bestMin=ex;
    }
    rows.push({
      k:K,
      l,
      n,
      sampled_graphs:G_SAMPLES,
      sampled_min_ex_n_G:bestMin,
      normalized_by_n2: Number((bestMin/(n*n)).toPrecision(8)),
    });
  }
}

const out={
  problem:'EP-766',
  script:path.basename(process.argv[1]),
  method:'sampled_profile_for_f_n_k_l_via_min_over_sampled_k_vertex_l_edge_graphs',
  warning:'Sampled finite proxy only; not exact f(n;k,l) over all graphs.',
  params:{K,L_LIST,N_LIST,G_SAMPLES},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
