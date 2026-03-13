#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '10,11,12').split(',').map((x) => Number(x.trim())).filter(Boolean);
const SAMPLES = Number(process.env.SAMPLES || 36);
const R_LIST = (process.env.R_LIST || '3,5').split(',').map((x) => Number(x.trim())).filter(Boolean);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 0x100000000;
  };
}
const rng = makeRng(20260313 ^ 740);

function randomGraph(n, p=0.45) {
  const adj = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) if (rng() < p) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function inducedSubgraph(adj, subset) {
  const map = new Map(subset.map((v, i) => [v, i]));
  const g = Array.from({ length: subset.length }, () => []);
  for (let i = 0; i < subset.length; i += 1) {
    const u = subset[i];
    for (const v of adj[u]) if (map.has(v)) g[i].push(map.get(v));
  }
  return g;
}

function chromaticNumber(adj) {
  const n = adj.length;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);
  const col = Array(n).fill(-1);
  function can(k, idx=0) {
    if (idx === n) return true;
    const v = order[idx];
    const used = new Set();
    for (const u of adj[v]) if (col[u] >= 0) used.add(col[u]);
    for (let c = 0; c < k; c += 1) {
      if (used.has(c)) continue;
      col[v] = c;
      if (can(k, idx + 1)) return true;
      col[v] = -1;
    }
    return false;
  }
  for (let k = 1; k <= n; k += 1) if (can(k)) return k;
  return n;
}

function oddGirth(adj) {
  const n = adj.length;
  let best = Infinity;
  for (let s = 0; s < n; s += 1) {
    const dist = Array(n).fill(-1);
    const par = Array(n).fill(-1);
    const q = [s]; dist[s]=0;
    for (let qi=0; qi<q.length; qi+=1){
      const u=q[qi];
      for(const v of adj[u]){
        if(dist[v]<0){dist[v]=dist[u]+1; par[v]=u; q.push(v);} 
        else if(par[u]!==v){
          const len=dist[u]+dist[v]+1;
          if(len%2===1) best=Math.min(best,len);
        }
      }
    }
  }
  return Number.isFinite(best)?best:null;
}

function* subsets(n, minSize) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let mask = 1; mask < (1 << n); mask += 1) {
    const bits = mask.toString(2).split('0').join('').length;
    if (bits < minSize) continue;
    const s = [];
    for (let i = 0; i < n; i += 1) if (mask & (1 << i)) s.push(arr[i]);
    yield s;
  }
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  for (const r of R_LIST) {
    let tested = 0;
    let eligible = 0;
    let success = 0;

    for (let t = 0; t < SAMPLES; t += 1) {
      const g = randomGraph(n, 0.42);
      const chi = chromaticNumber(g);
      tested += 1;
      if (chi < 3) continue;
      eligible += 1;

      let found = false;
      for (const sub of subsets(n, 4)) {
        if (sub.length >= 14) continue;
        const h = inducedSubgraph(g, sub);
        if (chromaticNumber(h) !== chi) continue;
        const og = oddGirth(h);
        if (og == null || og > r) { found = true; break; }
      }
      if (found) success += 1;
    }

    rows.push({
      n,
      r,
      sampled_graphs: tested,
      eligible_with_chi_at_least_3: eligible,
      success_count_same_chi_subgraph_with_odd_girth_gt_r: success,
      success_rate_over_eligible: eligible ? Number((success / eligible).toPrecision(8)) : null,
    });
  }
}

const out = {
  problem: 'EP-740',
  script: path.basename(process.argv[1]),
  method: 'finite_proxy_same_chromatic_subgraph_with_large_odd_girth_search',
  warning: 'Finite random-graph analogue only; original statement is for infinite-cardinal chromatic numbers.',
  params: { N_LIST, SAMPLES, R_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
