#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const OUTPUT_PATH = path.join(ROOT, 'summary-check.md');

function mdEscape(v) {
  return String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectRows() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => /^ep\d+\.json$/i.test(f));
  const rows = files.map((f) => {
    const obj = readJson(path.join(DATA_DIR, f));
    const id = Number(f.match(/\d+/)?.[0] || 0);
    return {
      id,
      problem: obj.problem || `EP-${id}`,
      status: obj.progress_status || (Array.isArray(obj.computations) && obj.computations.length > 0 ? 'has_computation' : 'no_progress'),
      computations: Array.isArray(obj.computations) ? obj.computations.length : 0,
      has_batch_split: obj.batch_split_integrations_from_head ? 'yes' : '',
      has_batch_legacy: obj.batch_script_integrations ? 'yes' : '',
    };
  });
  rows.sort((a, b) => a.id - b.id);
  return rows;
}

function toTable(headers, rows) {
  const head = `| ${headers.map(mdEscape).join(' | ')} |`;
  const sep = `|${headers.map(() => '---').join('|')}|`;
  const body = rows.map((r) => `| ${r.map((x) => mdEscape(x)).join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

function buildSummary(rows) {
  const total = rows.length;
  const withComputations = rows.filter((r) => r.computations > 0).length;
  const withBatchSplit = rows.filter((r) => r.has_batch_split).length;

  const statusMap = new Map();
  for (const r of rows) statusMap.set(r.status, (statusMap.get(r.status) || 0) + 1);
  const statusLines = [...statusMap.entries()].sort((a, b) => b[1] - a[1]).map(([s, c]) => `- \`${s}\`: ${c}`).join('\n');

  const top = [...rows].sort((a, b) => b.computations - a.computations).slice(0, 40);
  const topTable = toTable(
    ['Problem', 'Status', 'Computation Entries', 'Batch Split', 'Legacy Batch'],
    top.map((r) => [r.problem, r.status, String(r.computations), r.has_batch_split, r.has_batch_legacy])
  );

  return `# Canonical Summary Check

Generated: **${new Date().toISOString()}**

## Snapshot

- Canonical problems found: **${total}**
- Problems with at least one computation entry: **${withComputations}**
- Problems with batch split integrations: **${withBatchSplit}**

## Progress Status Distribution

${statusLines}

## Top Problems by Computation Entries

${topTable}
`;
}

const rows = collectRows();
fs.writeFileSync(OUTPUT_PATH, buildSummary(rows), 'utf8');
console.log(`Wrote: ${OUTPUT_PATH}`);
