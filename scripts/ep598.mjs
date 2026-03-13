#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

const SOURCES = [
  'external/unsolvedmath/problems.json',
  'external/unsolvedmath/dataset.json',
];

function analyzeFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : (data.problems || []);

  const bad = [];
  let bgEmpty = 0;
  for (const p of arr) {
    const s = String(p.statement || '');
    const b = String(p.background || '');
    if (!b.trim()) bgEmpty += 1;
    const malformed =
      (s.includes('},{') && /difficulty\s*["\\]?\s*:\s*["\\]?L1/.test(s))
      || (b.includes('},{') && /difficulty\s*["\\]?\s*:\s*["\\]?L1/.test(b));
    if (malformed) {
      bad.push({ problem_number: p.problem_number, id: p.id, title: p.title, statement_len: s.length, background_len: b.length });
    }
  }

  return {
    source_file: file,
    total_entries: arr.length,
    empty_background_count: bgEmpty,
    malformed_injected_fragment_count: bad.length,
    sample_first_25: bad.slice(0, 25),
    ep598_entry: bad.find((x) => x.problem_number === 'EP-598') || null,
  };
}

const t0 = Date.now();
const rows = SOURCES.map(analyzeFile);
const union = new Set();
for (const r of rows) for (const b of r.sample_first_25) union.add(b.problem_number);

const out = {
  problem: 'EP-598',
  script: path.basename(process.argv[1]),
  method: 'dataset_integrity_scan_for_injected_json_fragment_and_empty_backgrounds',
  params: { sources: SOURCES },
  rows,
  quick_union_sample_problem_numbers: [...union],
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
