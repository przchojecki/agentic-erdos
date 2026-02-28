#!/usr/bin/env node

// EP-42 small-N exhaustive scan:
// For each N and M, checks whether EVERY Sidon A subset [1..N]
// admits a Sidon B subset [1..N], |B|=M, with (A-A)∩(B-B)={0}.

const startN = Number(process.argv[2] || 10);
const endN = Number(process.argv[3] || 40);
const mArg = process.argv[4] || '2,3,4';
const Ms = mArg.split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x >= 1);

if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN || Ms.length === 0) {
  console.error('Usage: node scripts/ep42_scan_smallN.mjs [startN] [endN] [Mlist]');
  process.exit(1);
}

function diffBit(d) {
  return 1n << BigInt(d - 1);
}

function canonicalSidonEntries(N) {
  const byMask = new Map();

  function put(mask, arr) {
    const key = mask.toString();
    if (!byMask.has(key)) {
      byMask.set(key, {
        mask,
        size: arr.length,
        set: arr.slice(),
      });
    }
  }

  put(0n, []);
  const arr = [1];
  let mask = 0n;
  put(mask, arr);

  function rec(next) {
    for (let x = next; x <= N; x++) {
      let ok = true;
      let addMask = 0n;
      for (let i = 0; i < arr.length; i++) {
        const bit = diffBit(x - arr[i]);
        if ((mask & bit) !== 0n || (addMask & bit) !== 0n) {
          ok = false;
          break;
        }
        addMask |= bit;
      }
      if (!ok) continue;

      arr.push(x);
      mask |= addMask;
      put(mask, arr);
      rec(x + 1);
      mask ^= addMask;
      arr.pop();
    }
  }

  rec(2);
  return [...byMask.values()];
}

function existsDisjoint(A_mask, B_entries) {
  for (let i = 0; i < B_entries.length; i++) {
    if ((A_mask & B_entries[i].mask) === 0n) return B_entries[i];
  }
  return null;
}

const out = [];

for (let N = startN; N <= endN; N++) {
  const t0 = Date.now();
  const entries = canonicalSidonEntries(N);
  const t1 = Date.now();

  const bySize = new Map();
  for (const e of entries) {
    if (!bySize.has(e.size)) bySize.set(e.size, []);
    bySize.get(e.size).push(e);
  }

  const row = {
    N,
    sidon_masks_count: entries.length,
    by_M: {},
    gen_ms: t1 - t0,
  };

  for (const M of Ms) {
    const B_entries = bySize.get(M) || [];
    const t2 = Date.now();

    let allGood = true;
    let worstA = null;
    let checked = 0;

    for (const A of entries) {
      checked += 1;
      const B = existsDisjoint(A.mask, B_entries);
      if (!B) {
        allGood = false;
        worstA = A;
        break;
      }
    }

    const t3 = Date.now();

    row.by_M[String(M)] = {
      M,
      B_count: B_entries.length,
      all_A_have_B: allGood,
      checked_A_count: checked,
      scan_ms: t3 - t2,
      counterexample_A: worstA ? worstA.set : null,
    };
  }

  row.total_ms = Date.now() - t0;
  out.push(row);
  console.error(`N=${N} done, masks=${entries.length}`);
}

console.log(JSON.stringify({ startN, endN, Ms, rows: out }, null, 2));
