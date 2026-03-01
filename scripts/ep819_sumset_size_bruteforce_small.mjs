#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const NS=(process.env.NS||'25,36').split(',').map(x=>Number(x.trim())).filter(Boolean);

function* comb(arr,k,start=0,pick=[]){
  if(pick.length===k){yield pick.slice(); return;}
  for(let i=start;i<=arr.length-(k-pick.length);i++){
    pick.push(arr[i]);
    yield* comb(arr,k,i+1,pick);
    pick.pop();
  }
}

function sumsetCountInN(A,N){
  const hit=new Uint8Array(N+1);
  for(let i=0;i<A.length;i++) for(let j=i;j<A.length;j++){
    const s=A[i]+A[j];
    if(s<=N) hit[s]=1;
  }
  let c=0; for(let s=1;s<=N;s++) c+=hit[s];
  return c;
}

const rows=[];
for(const N of NS){
  const k=Math.floor(Math.sqrt(N));
  const U=Array.from({length:N},(_,i)=>i+1);
  let best=-1, witness=null;
  let checked=0;
  for(const A of comb(U,k)){
    checked++;
    const v=sumsetCountInN(A,N);
    if(v>best){best=v; witness=A.slice();}
  }
  rows.push({N,k,checked_subsets:checked,exact_f_N_small:best,ratio_over_N:Number((best/N).toFixed(6)),witness_prefix:witness.slice(0,20)});
}

const out={script:path.basename(process.argv[1]),ns:NS,rows,timestamp_utc:new Date().toISOString()};
const outPath=path.join('data','ep819_sumset_size_bruteforce_small.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log(JSON.stringify({outPath,rows:rows.length},null,2));
