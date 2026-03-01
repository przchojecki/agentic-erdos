#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildAPs(N, k) {
  const aps = [];
  for (let a = 1; a <= N; a += 1) {
    for (let d = 1; a + (k - 1) * d <= N; d += 1) {
      const idx = [];
      for (let j = 0; j < k; j += 1) idx.push(a + j * d - 1);
      aps.push(idx);
    }
  }
  return aps;
}

function existsAvoidingColoring(N, k, ell) {
  const aps = buildAPs(N, k);
  const m = aps.length;

  const apPos = Array.from({ length: N }, () => []);
  for (let i = 0; i < m; i += 1) {
    for (const p of aps[i]) apPos[p].push(i);
  }

  const assignedCount = new Int16Array(m);
  const partialSum = new Int16Array(m);
  const assign = new Int8Array(N);
  assign.fill(0);

  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => apPos[b].length - apPos[a].length);

  function feasibleAP(apIdx) {
    const c = assignedCount[apIdx];
    const s = partialSum[apIdx];
    if (c === k) return Math.abs(s) < ell;

    // Remaining flexibility bound.
    const r = k - c;
    const maxAbsPossible = Math.max(Math.abs(s + r), Math.abs(s - r));
    // If every completion has |sum| >= ell then fail now.
    if (Math.min(Math.abs(s + r), Math.abs(s - r)) >= ell && (s + r) * (s - r) >= 0) {
      return false;
    }
    // Keep this loose but cheap; exact checks on full APs dominate.
    return maxAbsPossible >= 0;
  }

  function dfs(t) {
    if (t === N) return true;

    const pos = order[t];
    for (const val of [1, -1]) {
      assign[pos] = val;
      const touched = apPos[pos];

      for (const apIdx of touched) {
        assignedCount[apIdx] += 1;
        partialSum[apIdx] += val;
      }

      let ok = true;
      for (const apIdx of touched) {
        if (!feasibleAP(apIdx)) {
          ok = false;
          break;
        }
      }

      if (ok && dfs(t + 1)) return true;

      for (const apIdx of touched) {
        assignedCount[apIdx] -= 1;
        partialSum[apIdx] -= val;
      }
      assign[pos] = 0;
    }

    return false;
  }

  const found = dfs(0);
  if (!found) return { exists: false, witness: null, ap_count: aps.length };

  const witness = Array.from(assign).map((x) => (x === 1 ? 1 : -1));
  return { exists: true, witness, ap_count: aps.length };
}

function findThreshold(k, ell, nMax) {
  const rows = [];
  let threshold = null;
  let lastWitness = null;

  for (let N = k; N <= nMax; N += 1) {
    const t0 = Date.now();
    const res = existsAvoidingColoring(N, k, ell);
    const ms = Date.now() - t0;

    rows.push({ N, avoiding_coloring_exists: res.exists, ap_count: res.ap_count, runtime_ms: ms });

    if (res.exists) lastWitness = { N, coloring: res.witness };
    if (!res.exists && threshold == null) threshold = N;

    process.stderr.write(`k=${k}, ell=${ell}, N=${N}, avoid=${res.exists}, ms=${ms}\n`);
  }

  return { k, ell, threshold_first_no_avoiding: threshold, last_avoiding_witness: lastWitness, rows };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep176_ap_discrepancy_small_exact.json');

const configs = [
  { k: 3, ell: 2, nMax: 22 },
  { k: 4, ell: 2, nMax: 26 },
  { k: 5, ell: 2, nMax: 30 },
  { k: 6, ell: 2, nMax: 40 },
  { k: 6, ell: 3, nMax: 70 },
];

const runs = configs.map((cfg) => findThreshold(cfg.k, cfg.ell, cfg.nMax));

const out = {
  problem: 'EP-176',
  method: 'exact_backtracking_search_for_avoiding_colorings_on_[1,N]',
  interpretation: 'N(k,ell) is first N with no avoiding +-1 coloring.',
  runs,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
