#!/usr/bin/env node
// Canonical per-problem script for EP-14.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-14',
  source_count: 1,
  source_files: ["ep14_unique_sum_exception_quick.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-14 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep14_unique_sum_exception_quick.mjs
// Kind: current_script_file
// Label: From ep14_unique_sum_exception_quick.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_LIST=(process.env.N_LIST||'120,180,260,360').split(',').map(x=>Number(x.trim())).filter(Boolean);
// const RESTARTS=Number(process.env.RESTARTS||60);
// const STEPS=Number(process.env.STEPS||900);
// 
// function randInt(m){return Math.floor(Math.random()*m);}
// 
// function buildCounts(A,N){
//   const cnt=new Int32Array(2*N+1);
//   for(let i=0;i<A.length;i++) for(let j=i;j<A.length;j++) cnt[A[i]+A[j]]++;
//   let bad=0; for(let s=1;s<=N;s++) if(cnt[s]!==1) bad++;
//   return {cnt,bad};
// }
// 
// function deltaBadForSwap(A,set,idx,neu,N,state){
//   const old=A[idx];
//   if(old===neu) return {bad:state.bad,apply:()=>{}};
// 
//   const touched=[];
//   // remove old pairs
//   for(let j=0;j<A.length;j++){
//     const b=A[j];
//     const s=old+b;
//     if(s>2*N) continue;
//     const was=state.cnt[s];
//     const dec=(j===idx)?1:1; // same weight in i<=j encoding with full traversal below handled by one pass
//     const now=was-dec;
//     touched.push([s,was,now]);
//   }
//   // add new pairs
//   for(let j=0;j<A.length;j++){
//     const b=(j===idx)?neu:A[j];
//     const s=neu+b;
//     if(s>2*N) continue;
//     let found=false;
//     for(let t=0;t<touched.length;t++) if(touched[t][0]===s){ touched[t][2]++; found=true; break; }
//     if(!found){ const was=state.cnt[s]; touched.push([s,was,was+1]); }
//   }
// 
//   // consolidate duplicates
//   const m=new Map();
//   for(const [s,was,now] of touched){
//     const cur=m.get(s);
//     if(!cur) m.set(s,[was,now]);
//     else cur[1]=now;
//   }
// 
//   let bad=state.bad;
//   for(const [s,[was,now]] of m){
//     if(s>=1&&s<=N){
//       if(was!==1&&now===1) bad--;
//       else if(was===1&&now!==1) bad++;
//     }
//   }
// 
//   const apply=()=>{
//     A[idx]=neu;
//     set.delete(old); set.add(neu);
//     for(const [s,[,now]] of m) state.cnt[s]=now;
//     state.bad=bad;
//   };
// 
//   return {bad,apply};
// }
// 
// function runN(N){
//   const k=Math.floor(Math.sqrt(N));
//   let bestBad=1e9, bestA=[];
// 
//   for(let r=0;r<RESTARTS;r++){
//     const set=new Set();
//     while(set.size<k) set.add(1+randInt(N));
//     const A=[...set].sort((a,b)=>a-b);
//     const state=buildCounts(A,N);
// 
//     for(let it=0;it<STEPS;it++){
//       const idx=randInt(k);
//       let neu=1+randInt(N);
//       while(set.has(neu)) neu=1+randInt(N);
//       const cand=deltaBadForSwap(A,set,idx,neu,N,state);
//       if(cand.bad<=state.bad || Math.random()<0.03) cand.apply();
//       if(state.bad<bestBad){bestBad=state.bad; bestA=A.slice().sort((a,b)=>a-b);}      
//     }
//   }
// 
//   return {N,size_A:k,best_bad_count:bestBad,best_bad_over_sqrtN:Number((bestBad/Math.sqrt(N)).toFixed(6)),witness_A_prefix:bestA.slice(0,30)};
// }
// 
// const rows=N_LIST.map(runN);
// const out={script:path.basename(process.argv[1]),n_list:N_LIST,restarts:RESTARTS,steps:STEPS,rows,timestamp_utc:new Date().toISOString()};
// const outPath=path.join('data','ep14_unique_sum_exception_quick.json');
// fs.writeFileSync(outPath,JSON.stringify(out,null,2));
// console.log(JSON.stringify({outPath,rows:rows.length,restarts:RESTARTS,steps:STEPS},null,2));
// 
// ==== End Snippet ====

