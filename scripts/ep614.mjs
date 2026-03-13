#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

const SOURCES = ['external/unsolvedmath/problems.json', 'external/unsolvedmath/dataset.json'];

function analyze(file, ep) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  const arr = Array.isArray(data) ? data : (data.problems || []);
  const target = arr.find((x) => x.problem_number === ep) || null;
  if (!target) return { source_file: file, found: false };

  const s = String(target.statement || '');
  const b = String(target.background || '');
  const malformed = ((s.includes('},{') || b.includes('},{')) && /difficulty\s*["\\]?\s*:\s*["\\]?L1/.test(s + b));

  return {
    source_file: file,
    found: true,
    statement_len: s.length,
    background_len: b.length,
    background_empty: b.trim().length === 0,
    malformed_injected_fragment: malformed,
    statement_preview: s.slice(0, 180),
  };
}

const t0 = Date.now();
const rows = SOURCES.map((f) => analyze(f, 'EP-614'));
const out = {
  problem: 'EP-614',
  script: path.basename(process.argv[1]),
  method: 'targeted_dataset_integrity_scan_for_malformed_ep614_statement',
  params: { sources: SOURCES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
