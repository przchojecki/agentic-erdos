#!/usr/bin/env node

// EP-1105 deep standalone consistency computation:
// Small-n exact/partial anti-Ramsey values via bounded backtracking.

function edgeListKn(n) {
  const edges = [];
  const id = new Map();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      id.set(`${i},${j}`, edges.length);
      edges.push([i, j]);
    }
  }
  return { edges, id };
}

function comb(arr, k, out) {
  const cur = [];
  function rec(start, need) {
    if (need === 0) {
      out.push(cur.slice());
      return;
    }
    for (let i = start; i <= arr.length - need; i += 1) {
      cur.push(arr[i]);
      rec(i + 1, need - 1);
      cur.pop();
    }
  }
  rec(0, k);
}

function permute(a, out) {
  function rec(i) {
    if (i === a.length) {
      out.push(a.slice());
      return;
    }
    for (let j = i; j < a.length; j += 1) {
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
      rec(i + 1);
      a[j] = a[i];
      a[i] = t;
    }
  }
  rec(0);
}

function forbiddenEdgeSets(n, kind, k) {
  const { id } = edgeListKn(n);
  const verts = [...Array(n).keys()];
  const sets = [];

  if (kind === 'C') {
    const s = k;
    const subs = [];
    comb(verts, s, subs);
    for (const sub of subs) {
      const perms = [];
      permute(sub.slice(), perms);
      const seen = new Set();
      for (const p of perms) {
        // canonical orientation starting at min vertex
        if (p[0] !== Math.min(...sub)) continue;
        const eids = [];
        for (let i = 0; i < s; i += 1) {
          const a = Math.min(p[i], p[(i + 1) % s]);
          const b = Math.max(p[i], p[(i + 1) % s]);
          eids.push(id.get(`${a},${b}`));
        }
        eids.sort((x, y) => x - y);
        const key = eids.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          sets.push(eids);
        }
      }
    }
  } else if (kind === 'P') {
    const s = k;
    const subs = [];
    comb(verts, s, subs);
    for (const sub of subs) {
      const perms = [];
      permute(sub.slice(), perms);
      const seen = new Set();
      for (const p of perms) {
        // path uses consecutive edges only
        const eids = [];
        for (let i = 0; i < s - 1; i += 1) {
          const a = Math.min(p[i], p[i + 1]);
          const b = Math.max(p[i], p[i + 1]);
          eids.push(id.get(`${a},${b}`));
        }
        eids.sort((x, y) => x - y);
        const key = eids.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          sets.push(eids);
        }
      }
    }
  }

  // dedupe globally
  const uniq = [];
  const seen = new Set();
  for (const s of sets) {
    const key = s.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(s);
    }
  }
  return uniq;
}

function antiRamseyBounded(n, forbiddenSets, timeoutMs) {
  const { edges } = edgeListKn(n);
  const m = edges.length;
  const color = new Int16Array(m).fill(-1);
  const setsByEdge = Array.from({ length: m }, () => []);
  for (const fs of forbiddenSets) {
    for (const e of fs) setsByEdge[e].push(fs);
  }

  const t0 = Date.now();
  let nodes = 0;
  let timedOut = false;
  let best = 0;

  function dfs(pos, usedColors) {
    if (timedOut) return;
    if (Date.now() - t0 > timeoutMs) {
      timedOut = true;
      return;
    }
    nodes += 1;

    if (pos === m) {
      if (usedColors > best) best = usedColors;
      return;
    }

    if (usedColors + (m - pos) <= best) return;

    for (let c = 0; c <= usedColors; c += 1) {
      color[pos] = c;
      let ok = true;
      for (const fs of setsByEdge[pos]) {
        let allAssigned = true;
        const seen = new Set();
        for (const e of fs) {
          const ce = color[e];
          if (ce === -1) {
            allAssigned = false;
            break;
          }
          seen.add(ce);
        }
        if (allAssigned && seen.size === fs.length) {
          ok = false;
          break;
        }
      }
      if (ok) dfs(pos + 1, Math.max(usedColors, c + 1));
      color[pos] = -1;
      if (timedOut) return;
    }
  }

  dfs(0, 0);
  return {
    bestLowerBound: best,
    exact: !timedOut,
    timedOut,
    nodes,
    elapsedMs: Date.now() - t0,
    edgeCount: m,
    forbiddenCount: forbiddenSets.length,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const timeoutMs = depth >= 4 ? 45000 : 7000;

  const instances = [
    { kind: 'C', k: 3, n: 4 },
    { kind: 'C', k: 3, n: 5 },
    { kind: 'C', k: 3, n: 6 },
    { kind: 'C', k: 3, n: 7 },
    { kind: 'P', k: 5, n: 6 },
    { kind: 'P', k: 5, n: 7 },
    { kind: 'P', k: 5, n: 8 },
    { kind: 'C', k: 4, n: 7 },
    { kind: 'C', k: 4, n: 8 },
  ];

  const rows = [];
  for (const ins of instances) {
    const forb = forbiddenEdgeSets(ins.n, ins.kind, ins.k);
    const r = antiRamseyBounded(ins.n, forb, timeoutMs);
    rows.push({
      graph: `${ins.kind}${ins.k}`,
      n: ins.n,
      timeout_ms: timeoutMs,
      ...r,
      exact_or_lower_bound_AR: r.bestLowerBound,
    });
  }

  const payload = {
    problem: 'EP-1105',
    script: 'ep1105.mjs',
    method: 'deep_bounded_backtracking_for_small_n_anti_ramsey_values_for_cycles_and_paths',
    warning: 'Exact only where timeout not hit; otherwise reported value is a certified lower bound.',
    params: { depth, timeoutMs, instance_count: instances.length },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
