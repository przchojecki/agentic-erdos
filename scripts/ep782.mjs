#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT=process.env.OUT||'';
const N=Number(process.env.N||3000000);
const START_LIMIT=Number(process.env.START_LIMIT||900);
const PAIR_SPAN=Number(process.env.PAIR_SPAN||110);
const C_LIST=(process.env.C_LIST||'0,1,2,4,8,12,16').split(',').map((x)=>Number(x.trim())).filter((x)=>x>=0);
const SQ_CAP_2D=Number(process.env.SQ_CAP_2D||300000);
const RND_3D_TRIALS=Number(process.env.RND_3D_TRIALS||450000);

function makeRng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}
const rng=makeRng(20260313 ^ 782);

const squares=[];
const isSquare=new Uint8Array(N+1);
for(let k=1;k*k<=N;k+=1){const s=k*k; squares.push(s); isSquare[s]=1;}

function bestQuasi(C){
  const memo=new Map();
  function ext(prev,d){
    const key=`${prev}|${d}`;
    if(memo.has(key)) return memo.get(key);
    let best=0;
    for(let z=0;z<=C;z+=1){
      const nxt=prev+d+z;
      if(nxt<=N && isSquare[nxt]){
        const e=1+ext(nxt,d);
        if(e>best) best=e;
      }
    }
    memo.set(key,best);
    return best;
  }

  let best=1;
  let witness=null;
  const lim=Math.min(START_LIMIT,squares.length);
  for(let i=0;i<lim;i+=1){
    for(let j=i+1;j<Math.min(lim,i+PAIR_SPAN);j+=1){
      const d=squares[j]-squares[i];
      const len=2+ext(squares[j],d);
      if(len>best){
        best=len;
        witness={x1:squares[i],x2:squares[j],d};
      }
    }
  }
  return {C,best_length_found:best,witness};
}

function additive2Dand3D(){
  const sqSmall=squares.filter((x)=>x<=SQ_CAP_2D);
  const setSmall=new Set(sqSmall);
  let count2D=0;
  const ex2D=[];
  for(let i=0;i<sqSmall.length;i+=1){
    const a=sqSmall[i];
    for(let j=i+1;j<sqSmall.length;j+=1){
      const b1=sqSmall[j]-a; if(b1<=0) continue;
      for(let k=j+1;k<Math.min(sqSmall.length,j+70);k+=1){
        const b2=sqSmall[k]-a;
        if(setSmall.has(a+b1+b2)){
          count2D+=1;
          if(ex2D.length<10) ex2D.push({a,b1,b2});
        }
      }
    }
  }

  const sqRnd=sqSmall.slice(0,1500);
  const rndSet=new Set(sqRnd);
  let count3D=0;
  let ex3D=null;
  for(let t=0;t<RND_3D_TRIALS;t+=1){
    const a=sqRnd[Math.floor(rng()*sqRnd.length)];
    const b1=Math.abs(sqRnd[Math.floor(rng()*sqRnd.length)]-a);
    const b2=Math.abs(sqRnd[Math.floor(rng()*sqRnd.length)]-a);
    const b3=Math.abs(sqRnd[Math.floor(rng()*sqRnd.length)]-a);
    if(!b1||!b2||!b3) continue;
    const vals=[a,a+b1,a+b2,a+b3,a+b1+b2,a+b1+b3,a+b2+b3,a+b1+b2+b3];
    if(vals.every((v)=>rndSet.has(v))){
      count3D+=1;
      if(!ex3D) ex3D={a,b1,b2,b3};
      if(count3D>=5) break;
    }
  }

  return {search_cap_for_square_values:SQ_CAP_2D,two_dimensional_cube_hits:count2D,two_dimensional_examples:ex2D,random_three_dimensional_hits:count3D,first_three_dimensional_example:ex3D,random_trials_3d:RND_3D_TRIALS};
}

const t0=Date.now();
const quasi_rows=C_LIST.map(bestQuasi);
const additive_cube_probe=additive2Dand3D();

const out={
  problem:'EP-782',
  script:path.basename(process.argv[1]),
  method:'deeper_quasi_progression_and_additive_cube_search_in_squares',
  params:{N,START_LIMIT,PAIR_SPAN,C_LIST,SQ_CAP_2D,RND_3D_TRIALS},
  quasi_rows,
  additive_cube_probe,
  elapsed_ms:Date.now()-t0,
  generated_utc:new Date().toISOString(),
};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
