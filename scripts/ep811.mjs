#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N=Number(process.env.N||13);
const M=Number(process.env.M||6);

function cyclicBalancedColoring(n,m){
  const color=Array.from({length:n},()=>Array(n).fill(-1));
  for(let u=0;u<n;u+=1){
    for(let v=u+1;v<n;v+=1){
      const d=Math.abs(u-v);
      const dd=Math.min(d,n-d);
      const c=dd-1;
      if(c>=0 && c<m){ color[u][v]=color[v][u]=c; }
    }
  }
  return color;
}

function hasRainbowPattern(color,n,verts,edges){
  const map=[];
  const used=Array(n).fill(false);
  function dfs(i){
    if(i===verts){
      const cols=[];
      for(const [a,b] of edges){
        const c=color[map[a]][map[b]];
        if(c<0) return false;
        cols.push(c);
      }
      return new Set(cols).size===edges.length;
    }
    for(let v=0;v<n;v+=1){
      if(used[v]) continue;
      map[i]=v; used[v]=true;
      if(dfs(i+1)) return true;
      used[v]=false;
    }
    return false;
  }
  return dfs(0);
}

const patterns=[
  {name:'K4', verts:4, edges:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]},
  {name:'C6', verts:6, edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]},
  {name:'P7', verts:7, edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
  {name:'K1,6', verts:7, edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
];

const t0=Date.now();
const color=cyclicBalancedColoring(N,M);
const deg=Array.from({length:N},()=>Array(M).fill(0));
for(let u=0;u<N;u+=1){ for(let v=0;v<N;v+=1){ if(u===v) continue; const c=color[u][v]; if(c>=0) deg[u][c]+=1; } }
const balanced=deg.every((arr)=>arr.every((x)=>x===Math.floor((N-1)/M) || x===Math.ceil((N-1)/M)));

const rows=[];
for(const p of patterns){
  rows.push({
    pattern:p.name,
    edges:p.edges.length,
    has_rainbow_copy:hasRainbowPattern(color,N,p.verts,p.edges),
  });
}

const out={
  problem:'EP-811',
  script:path.basename(process.argv[1]),
  method:'balanced_coloring_rainbow_pattern_scan_for_multiple_m-edge_graphs',
  params:{N,M,patterns:patterns.map((p)=>p.name)},
  balanced_degree_profile_confirmed:balanced,
  per_vertex_color_degrees:deg,
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
