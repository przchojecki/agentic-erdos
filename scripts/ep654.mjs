#!/usr/bin/env node
// Canonical per-problem script for EP-654.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-654',
  source_count: 1,
  source_files: ["ep654_distinct_distances_point_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-654 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep654_distinct_distances_point_scan.mjs
// Kind: current_script_file
// Label: From ep654_distinct_distances_point_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const NS=(process.env.NS||'50,80,120,160').split(',').map(x=>Number(x.trim())).filter(Boolean);
// const TRIALS=Number(process.env.TRIALS||300);
// 
// function rand(){return Math.random();}
// 
// function noFourConcyclic(pts){
//   const n=pts.length;
//   function det3(a,b,c,d,e,f,g,h,i){return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);}
//   function det4(M){
//     const [r0,r1,r2,r3]=M;
//     const m00=det3(r1[1],r1[2],r1[3],r2[1],r2[2],r2[3],r3[1],r3[2],r3[3]);
//     const m01=det3(r1[0],r1[2],r1[3],r2[0],r2[2],r2[3],r3[0],r3[2],r3[3]);
//     const m02=det3(r1[0],r1[1],r1[3],r2[0],r2[1],r2[3],r3[0],r3[1],r3[3]);
//     const m03=det3(r1[0],r1[1],r1[2],r2[0],r2[1],r2[2],r3[0],r3[1],r3[2]);
//     return r0[0]*m00-r0[1]*m01+r0[2]*m02-r0[3]*m03;
//   }
//   // random-subsample quadruples for speed; near-continuous random points almost surely pass.
//   const checks=Math.min(5000, n*n);
//   for(let t=0;t<checks;t++){
//     const idx=[Math.floor(rand()*n),Math.floor(rand()*n),Math.floor(rand()*n),Math.floor(rand()*n)];
//     const s=new Set(idx); if(s.size<4) continue;
//     const arr=[...s];
//     const M=arr.map(k=>{const [x,y]=pts[k]; return [x,y,x*x+y*y,1];});
//     const d=det4(M);
//     if(Math.abs(d)<1e-12) return false;
//   }
//   return true;
// }
// 
// function runOne(n){
//   let best=0;
//   let bestRat=0;
//   for(let t=0;t<TRIALS;t++){
//     const pts=[];
//     for(let i=0;i<n;i++) pts.push([rand(),rand()]);
//     if(!noFourConcyclic(pts)) continue;
//     let maxDistinct=0;
//     for(let i=0;i<n;i++){
//       const set=new Set();
//       for(let j=0;j<n;j++) if(i!==j){
//         const dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];
//         const d2=dx*dx+dy*dy;
//         set.add(d2.toFixed(12));
//       }
//       if(set.size>maxDistinct) maxDistinct=set.size;
//       if(maxDistinct===n-1) break;
//     }
//     if(maxDistinct>best) best=maxDistinct;
//     const rat=maxDistinct/n;
//     if(rat>bestRat) bestRat=rat;
//   }
//   return {n,trials:TRIALS,best_max_distinct_from_one_point:best,best_ratio_over_n:Number(bestRat.toFixed(6))};
// }
// 
// const rows=NS.map(runOne);
// const out={script:path.basename(process.argv[1]),ns:NS,trials:TRIALS,rows,timestamp_utc:new Date().toISOString()};
// const outPath=path.join('data','ep654_distinct_distances_point_scan.json');
// fs.writeFileSync(outPath,JSON.stringify(out,null,2));
// console.log(JSON.stringify({outPath,rows:rows.length,trials:TRIALS},null,2));
// 
// ==== End Snippet ====

