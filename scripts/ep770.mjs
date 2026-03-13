#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_MAX = Number(process.env.N_MAX || 120);
const H_MAX = Number(process.env.H_MAX || 120);

function gcd(a,b){ let x=a,y=b; while(y!==0n){ const t=x%y; x=y; y=t; } return x<0n?-x:x; }

function powBig(a,n){
  let r=1n, x=BigInt(a), e=n;
  while(e>0){ if(e&1) r*=x; x*=x; e>>=1; }
  return r;
}

const t0=Date.now();
const rows=[];
let unresolved=0;
for(let n=1;n<=N_MAX;n+=1){
  const vals=[];
  let found=null;
  for(let H=2;H<=H_MAX;H+=1){
    const v=powBig(H,n)-1n;
    let ok=true;
    for(const u of vals){ if(gcd(u,v)!==1n){ ok=false; break; } }
    vals.push(v);
    if(ok){
      // check all pairwise among 2..H
      let all=true;
      for(let i=0;i<vals.length && all;i+=1) for(let j=i+1;j<vals.length;j+=1) if(gcd(vals[i],vals[j])!==1n){all=false;break;}
      if(all && H>=3){ found=H; break; }
    }
  }
  if(found==null) unresolved += 1;
  if(n<=30 || n%5===0){
    rows.push({ n, h_n_within_scan: found, unresolved_with_H_max: found==null });
  }
}

const freq={};
for(const r of rows){ if(r.h_n_within_scan!=null) freq[r.h_n_within_scan]=(freq[r.h_n_within_scan]||0)+1; }

const out={
  problem:'EP-770',
  script:path.basename(process.argv[1]),
  method:'direct_bigint_pairwise_coprimality_scan_for_h_n',
  params:{N_MAX,H_MAX},
  rows,
  frequency_h_values_sampled_rows:freq,
  unresolved_count_due_to_H_MAX:unresolved,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
