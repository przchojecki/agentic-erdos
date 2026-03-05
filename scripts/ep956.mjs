#!/usr/bin/env node
// Canonical per-problem script for EP-956.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-956',
  source_count: 1,
  source_files: ["ep956_hex_lattice_translate_edges.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-956 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep956_hex_lattice_translate_edges.mjs
// Kind: current_script_file
// Label: From ep956_hex_lattice_translate_edges.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const NS=(process.env.NS||'100,200,400,800,1600').split(',').map(x=>Number(x.trim())).filter(Boolean);
// 
// // Triangular lattice coordinates: (i + j/2, (sqrt(3)/2)j)
// function latticePoint(i,j){return [i + 0.5*j, (Math.sqrt(3)/2)*j];}
// 
// function buildPatch(n){
//   const pts=[];
//   let R=1;
//   while(pts.length<n){
//     pts.length=0;
//     for(let j=-R;j<=R;j++){
//       for(let i=-R;i<=R;i++) pts.push(latticePoint(i,j));
//     }
//     R++;
//   }
//   return pts.slice(0,n);
// }
// 
// function countDistance2Pairs(pts){
//   let m=0;
//   for(let i=0;i<pts.length;i++){
//     for(let j=i+1;j<pts.length;j++){
//       const dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];
//       const d2=dx*dx+dy*dy;
//       if(Math.abs(d2-4)<1e-9) m++;
//     }
//   }
//   return m;
// }
// 
// function minPairDistance(pts){
//   let d2=1e99;
//   for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
//     const dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];
//     const v=dx*dx+dy*dy; if(v<d2) d2=v;
//   }
//   return Math.sqrt(d2);
// }
// 
// const rows=[];
// for(const n of NS){
//   const pts=buildPatch(n);
//   const m=countDistance2Pairs(pts);
//   const mind=minPairDistance(pts);
//   rows.push({n,pairs_distance_2:m,ratio_over_n:Number((m/n).toFixed(6)),min_pair_distance:Number(mind.toFixed(6))});
// }
// 
// const out={script:path.basename(process.argv[1]),rows,timestamp_utc:new Date().toISOString()};
// const outPath=path.join('data','ep956_hex_lattice_translate_edges.json');
// fs.writeFileSync(outPath,JSON.stringify(out,null,2));
// console.log(JSON.stringify({outPath,rows:rows.length},null,2));
// 
// ==== End Snippet ====

