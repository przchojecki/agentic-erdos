#!/usr/bin/env node
// Canonical per-problem script for EP-708.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-708',
  source_count: 1,
  source_files: ["ep708_small_bounded_exact.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-708 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep708_small_bounded_exact.mjs
// Kind: current_script_file
// Label: From ep708_small_bounded_exact.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // Bounded finite proxy for EP-708: enumerate A of size n with max(A)<=M_BOUND
// // and intervals I of length max(A), compute worst-case minimal |B| needed for divisibility.
// 
// const N_LIST = (process.env.N_LIST || '2,3').split(',').map((x) => Number(x.trim())).filter(Boolean);
// const M_BOUND = Number(process.env.M_BOUND || 14);
// 
// function gcd(a,b){while(b){[a,b]=[b,a%b];}return a;}
// function lcm(a,b){return (a/gcd(a,b))*b;}
// 
// function factorize(x){
//   const f=new Map();
//   let n=x;
//   for(let p=2;p*p<=n;p++){
//     while(n%p===0){f.set(p,(f.get(p)||0)+1);n=Math.floor(n/p);}    
//   }
//   if(n>1) f.set(n,(f.get(n)||0)+1);
//   return f;
// }
// 
// function addVec(dst, src, mul=1){for(const [p,e] of src) dst.set(p,(dst.get(p)||0)+mul*e);} 
// function geVec(a,b){for(const [p,e] of b) if((a.get(p)||0)<e) return false; return true;}
// 
// function comb(arr,k,start=0,pick=[],out=[]){
//   if(pick.length===k){out.push(pick.slice()); return out;}
//   for(let i=start;i<=arr.length-(k-pick.length);i++){pick.push(arr[i]); comb(arr,k,i+1,pick,out); pick.pop();}
//   return out;
// }
// 
// function minBSizeFor(A, interval){
//   const target=new Map();
//   for(const a of A) addVec(target,factorize(a),+1);
//   const vals=interval;
//   const facs=vals.map(v=>factorize(v));
// 
//   let best=Infinity;
//   const n=vals.length;
//   for(let mask=1; mask<(1<<n); mask++){
//     const bits=mask.toString(2).replace(/0/g,'').length;
//     if(bits>=best) continue;
//     const cur=new Map();
//     for(let i=0;i<n;i++) if((mask>>i)&1) addVec(cur,facs[i],+1);
//     if(geVec(cur,target)) best=bits;
//   }
//   return Number.isFinite(best)?best:null;
// }
// 
// const rows=[];
// for(const n of N_LIST){
//   let worst=0;
//   let witness=null;
//   const universe=Array.from({length:M_BOUND-1},(_,i)=>i+2);
//   const As=comb(universe,n);
//   for(const A of As){
//     const M=A[A.length-1];
//     const maxStart=M_BOUND; // bounded starts
//     for(let s=1;s<=maxStart;s++){
//       const I=Array.from({length:M},(_,i)=>s+i);
//       const b=minBSizeFor(A,I);
//       if(b!=null && b>worst){worst=b; witness={A,interval_start:s,M,b};}
//     }
//   }
//   rows.push({n,m_bound:M_BOUND,bounded_worst_min_B_size:worst,witness});
// }
// 
// const out={script:path.basename(process.argv[1]),n_list:N_LIST,m_bound:M_BOUND,rows,timestamp_utc:new Date().toISOString()};
// const outPath=path.join('data','ep708_small_bounded_exact.json');
// fs.writeFileSync(outPath,JSON.stringify(out,null,2));
// console.log(JSON.stringify({outPath,rows:rows.length,m_bound:M_BOUND},null,2));
// 
// ==== End Snippet ====

