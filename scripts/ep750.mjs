#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const MS = (process.env.MS || '8,10,12,14,16').split(',').map((x) => Number(x.trim())).filter(Boolean);
const SAMPLES_PER_M = Number(process.env.SAMPLES_PER_M || 140);

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const g = Array.from({ length: m }, () => new Set());
  for (let u = 0; u < n; u += 1) for (const v of adj[u]) if (u < v) { g[u].add(v); g[v].add(u); }
  for (let u = 0; u < n; u += 1) for (const v of adj[u]) { g[u].add(n + v); g[n + v].add(u); }
  const w = 2 * n;
  for (let u = 0; u < n; u += 1) { g[n + u].add(w); g[w].add(n + u); }
  return g.map((s) => [...s]);
}

function k2(){return [[1],[0]];}

function alphaExact(adj) {
  const n = adj.length;
  const mat = Array.from({ length: n }, () => Array(n).fill(false));
  for (let u = 0; u < n; u += 1) for (const v of adj[u]) mat[u][v] = true;
  let best = 0;
  const order = Array.from({ length: n }, (_, i) => i).sort((a,b)=>adj[b].length-adj[a].length);

  function dfs(i, chosen, banned) {
    if (chosen + (n - i) <= best) return;
    if (i === n) { if (chosen > best) best = chosen; return; }
    const v = order[i];
    if (!banned[v]) {
      const b2 = banned.slice();
      b2[v] = true;
      for (let j = 0; j < n; j += 1) if (mat[v][j]) b2[j] = true;
      dfs(i + 1, chosen + 1, b2);
    }
    dfs(i + 1, chosen, banned);
  }
  dfs(0, 0, Array(n).fill(false));
  return best;
}

function inducedSubgraph(adj, subset) {
  const map = new Map(subset.map((v,i)=>[v,i]));
  const h = Array.from({ length: subset.length }, () => []);
  for (let i=0;i<subset.length;i+=1) {
    const u=subset[i];
    for (const v of adj[u]) if (map.has(v)) h[i].push(map.get(v));
  }
  return h;
}

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}
const rng=makeRng(20260313 ^ 750);

function sampleSubset(n, m) {
  const arr = Array.from({ length:n }, (_,i)=>i);
  for (let i=0;i<m;i+=1){
    const j = i + Math.floor(rng()*(n-i));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr.slice(0,m);
}

const t0 = Date.now();
const fam = [];
let g = k2();
fam.push({ name:'mycielski_0', adj:g });
for (let i=1;i<=3;i+=1){ g=mycielski(g); fam.push({ name:`mycielski_${i}`, adj:g }); }

const rows = [];
for (const F of fam) {
  const n = F.adj.length;
  if (n < Math.max(...MS)) continue;
  for (const m of MS) {
    let worstDef = -Infinity;
    let avgDef = 0;
    const T = Math.min(SAMPLES_PER_M, 1 + n * 30);
    for (let t = 0; t < T; t += 1) {
      const sub = sampleSubset(n, m);
      const h = inducedSubgraph(F.adj, sub);
      const a = alphaExact(h);
      const def = m / 2 - a;
      avgDef += def;
      if (def > worstDef) worstDef = def;
    }
    rows.push({
      family: F.name,
      n,
      m,
      samples: T,
      worst_deficit_m_over_2_minus_alpha: Number(worstDef.toPrecision(8)),
      avg_deficit_m_over_2_minus_alpha: Number((avgDef / T).toPrecision(8)),
      worst_over_sqrt_m: Number((worstDef / Math.sqrt(m)).toPrecision(8)),
      worst_over_log_m: Number((worstDef / Math.log(m)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-750',
  script: path.basename(process.argv[1]),
  method: 'finite_proxy_independence_deficit_scan_in_high_chromatic_family',
  warning: 'Finite sampled induced-subgraph proxy only; original statement is infinite-chromatic and universal over all m-vertex subgraphs.',
  params: { MS, SAMPLES_PER_M },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
