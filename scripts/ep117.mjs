#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Dihedral group D_{2m} with elements (t,k), t in {0,1}, k mod m.
function buildD2m(m) {
  const elems = [];
  for (let t = 0; t <= 1; t += 1) for (let k = 0; k < m; k += 1) elems.push([t, k]);
  const n = elems.length;

  function mul(a, b) {
    const [t1, k1] = a;
    const [t2, k2] = b;
    const t = t1 ^ t2;
    const s = t1 === 0 ? 1 : -1;
    const k = ((k1 + s * k2) % m + m) % m;
    return [t, k];
  }

  const idx = new Map(elems.map((e, i) => [`${e[0]},${e[1]}`, i]));
  const table = Array.from({ length: n }, () => new Int32Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const p = mul(elems[i], elems[j]);
      table[i][j] = idx.get(`${p[0]},${p[1]}`);
    }
  }
  return { m, elems, table };
}

function commuteMatrix(group) {
  const n = group.elems.length;
  const c = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      c[i][j] = group.table[i][j] === group.table[j][i] ? 1 : 0;
    }
  }
  return c;
}

function maxNonCommutingSubsetSize(comm) {
  const n = comm.length;
  let best = 0;
  const total = 1 << n;
  for (let mask = 1; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz <= best) continue;
    let ok = true;
    for (let i = 0; i < n && ok; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (!((mask >>> j) & 1)) continue;
        if (comm[i][j]) {
          ok = false;
          break;
        }
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function allAbelianSubgroups(group, comm) {
  const n = group.elems.length;
  const id = 0; // (0,0)
  const total = 1 << n;
  const out = [];
  for (let mask = 1; mask < total; mask += 1) {
    if (!((mask >>> id) & 1)) continue;
    const verts = [];
    for (let i = 0; i < n; i += 1) if ((mask >>> i) & 1) verts.push(i);

    // abelian
    let ab = true;
    for (let i = 0; i < verts.length && ab; i += 1) {
      for (let j = i + 1; j < verts.length; j += 1) {
        if (!comm[verts[i]][verts[j]]) {
          ab = false;
          break;
        }
      }
    }
    if (!ab) continue;

    // subgroup closure
    let closed = true;
    for (const a of verts) {
      for (const b of verts) {
        const p = group.table[a][b];
        if (!((mask >>> p) & 1)) {
          closed = false;
          break;
        }
      }
      if (!closed) break;
    }
    if (closed) out.push(mask);
  }
  return out;
}

function minAbelianSubgroupCover(group, subgroups) {
  const n = group.elems.length;
  const full = (1 << n) - 1;
  let best = n;

  // Order subgroups by size descending for pruning.
  subgroups.sort((a, b) => (b.toString(2).match(/1/g)?.length || 0) - (a.toString(2).match(/1/g)?.length || 0));

  function dfs(idx, covered, used) {
    if (used >= best) return;
    if (covered === full) {
      best = used;
      return;
    }
    if (idx >= subgroups.length) return;

    // optimistic bound: at least one new element per subgroup
    const remElems = n - (covered.toString(2).match(/1/g)?.length || 0);
    if (used + 1 > best || used + Math.ceil(remElems / n) >= best) return;

    const sg = subgroups[idx];
    const newCovered = covered | sg;
    if (newCovered !== covered) dfs(idx + 1, newCovered, used + 1);
    dfs(idx + 1, covered, used);
  }

  dfs(0, 0, 0);
  return best;
}

const M_LIST = (process.env.M_LIST || '3,4,5,6,7').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const m of M_LIST) {
  const g = buildD2m(m);
  const comm = commuteMatrix(g);
  const w = maxNonCommutingSubsetSize(comm);
  const abSubs = allAbelianSubgroups(g, comm);
  const cover = minAbelianSubgroupCover(g, abSubs);
  rows.push({
    m,
    group_order: 2 * m,
    max_pairwise_noncommuting_subset_size: w,
    abelian_subgroups_count: abSubs.length,
    min_abelian_subgroup_cover_number: cover,
  });
}

const out = {
  problem: 'EP-117',
  script: path.basename(process.argv[1]),
  method: 'exact_dihedral_group_covering_profile',
  params: { M_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
