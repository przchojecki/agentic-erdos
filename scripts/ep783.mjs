#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N_LIST=(process.env.N_LIST||'5000,10000,20000').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const C_LIST=(process.env.C_LIST||'0.6,1.0,1.4').split(',').map((x)=>Number(x.trim())).filter(Boolean);
const LOCAL_STEPS=Number(process.env.LOCAL_STEPS||3000);

function sieve(n){
  const isP=new Uint8Array(n+1); isP.fill(1); isP[0]=0; isP[1]=0;
  for(let p=2;p*p<=n;p+=1) if(isP[p]) for(let q=p*p;q<=n;q+=p) isP[q]=0;
  const primes=[]; for(let i=2;i<=n;i+=1) if(isP[i]) primes.push(i);
  return primes;
}

function primeTail(primes, N, C){
  const cand=primes.filter((p)=>p<=N).sort((a,b)=>b-a);
  let mu=0; const A=[];
  for(const p of cand){ if(mu+1/p<=C+1e-12){A.push(p);mu+=1/p;} }
  return {A,mu};
}

function uncoveredCount(N,A){
  const cov=new Uint8Array(N+1);
  for(const a of A){ for(let m=a;m<=N;m+=a) cov[m]=1; }
  let unc=0;
  for(let m=1;m<=N;m+=1) if(!cov[m]) unc+=1;
  return unc;
}

function makeRng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/0x100000000;};}

function localSearch(primes, N, C, steps, seed){
  const rng=makeRng(seed);
  const cand=primes.filter((p)=>p<=N);
  let A=[]; let mu=0;
  // init by random descending-prime fill
  const shuffled=cand.slice().sort(()=>rng()-0.5);
  for(const p of shuffled){ if(mu+1/p<=C+1e-12 && rng()<0.15){ A.push(p); mu+=1/p; } }
  if(A.length===0){ for(let i=cand.length-1;i>=0;i-=1){ const p=cand[i]; if(mu+1/p<=C+1e-12){A.push(p);mu+=1/p;break;} } }

  let bestA=A.slice();
  let bestUnc=uncoveredCount(N,bestA);

  function trySet(next){
    const uniq=[...new Set(next)].sort((a,b)=>a-b);
    let s=0; for(const p of uniq) s+=1/p;
    if(s>C+1e-12) return null;
    return {A:uniq,mu:s,unc:uncoveredCount(N,uniq)};
  }

  for(let t=0;t<steps;t+=1){
    const op=rng();
    let next=A.slice();
    if(op<0.4){
      const p=cand[Math.floor(rng()*cand.length)];
      next.push(p);
    } else if(op<0.7 && next.length>0){
      next.splice(Math.floor(rng()*next.length),1);
    } else if(next.length>0){
      const idx=Math.floor(rng()*next.length);
      next[idx]=cand[Math.floor(rng()*cand.length)];
    }
    const st=trySet(next);
    if(!st) continue;
    A=st.A; mu=st.mu;
    if(st.unc<bestUnc){ bestUnc=st.unc; bestA=A.slice(); }
  }
  return {A:bestA,mu:bestA.reduce((s,p)=>s+1/p,0),uncovered:bestUnc};
}

const t0=Date.now();
const rows=[];
for(const N of N_LIST){
  const primes=sieve(N);
  for(const C of C_LIST){
    const tail=primeTail(primes,N,C);
    const tailUnc=uncoveredCount(N,tail.A);
    let best=localSearch(primes,N,C,LOCAL_STEPS,Math.floor(C*1e6)+N);
    // multi-start
    for(let s=1;s<=4;s+=1){
      const cur=localSearch(primes,N,C,Math.floor(LOCAL_STEPS*0.7),Math.floor(C*1e6)+N+97*s);
      if(cur.uncovered<best.uncovered) best=cur;
    }
    rows.push({
      N,
      C,
      prime_tail_size:tail.A.length,
      prime_tail_mu:Number(tail.mu.toPrecision(10)),
      prime_tail_uncovered_upto_N:tailUnc,
      best_found_size:best.A.length,
      best_found_mu:Number(best.mu.toPrecision(10)),
      best_found_uncovered_upto_N:best.uncovered,
      improvement_best_minus_tail_uncovered:best.uncovered-tailUnc,
    });
  }
}

const out={
  problem:'EP-783',
  script:path.basename(process.argv[1]),
  method:'finite_optimization_under_pairwise_coprime_harmonic_budget_vs_prime_tail',
  warning:'Finite-N heuristic optimization only; does not settle exact asymptotic extremizer theorem.',
  params:{N_LIST,C_LIST,LOCAL_STEPS},
  rows,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
