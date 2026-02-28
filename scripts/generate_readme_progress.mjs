#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TO_CHECK_PATH = path.join(ROOT, 'data', 'erdos_to_check_ranked_with_deep_attempts_top20.jsonl');
const HARDER_PATH = path.join(ROOT, 'data', 'erdos_harder.jsonl');
const README_PATH = path.join(ROOT, 'README.md');
const CSV_PATH = path.join(ROOT, 'data', 'all_problems_progress.csv');

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function numFromProblem(problemNumber) {
  const m = String(problemNumber || '').match(/\d+/);
  return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
}

function cleanText(v) {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(v, n = 180) {
  const s = cleanText(v);
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

function mdEscape(v) {
  return String(v ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function csvEscape(v) {
  const s = String(v ?? '');
  return `"${s.replaceAll('"', '""')}"`;
}

function firstNonEmpty(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== '') return v;
  }
  return '';
}

function deriveProgress(record) {
  const statusKeys = [
    'deep_attempt_v4_status',
    'deep_attempt_v3_status',
    'deep_attempt_v2_status',
    'deep_attempt_status',
    'proof_attempt_status',
  ];
  const noteKeys = [
    'deep_attempt_v4_result',
    'deep_attempt_v4_caveat',
    'deep_attempt_v3_result',
    'deep_attempt_v3_obstacle',
    'deep_attempt_v2_result',
    'deep_attempt_v2_obstacle',
    'deep_attempt_route',
    'deep_attempt_note',
    'proof_attempt_concise',
  ];

  const explicitStatus = firstNonEmpty(record, statusKeys);
  const status = explicitStatus || (record.classification === 'harder' ? 'deprioritized_post2000_refs' : 'unattempted');

  const explicitNote = firstNonEmpty(record, noteKeys);
  const note =
    explicitNote ||
    (record.classification === 'harder'
      ? 'Triaged as harder due to reference activity after 2000.'
      : 'No detailed attempt recorded yet.');

  return { status: cleanText(status), note: truncate(note, 200) };
}

function statusSummary(records) {
  const map = new Map();
  for (const r of records) {
    const { status } = deriveProgress(r);
    map.set(status, (map.get(status) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function buildRows(records) {
  return records.map((r) => {
    const progress = deriveProgress(r);
    return {
      problem_number: r.problem_number,
      title: cleanText(r.title),
      classification: r.classification || '',
      to_check_rank: r.to_check_rank ?? '',
      latest_reference_year: r.latest_reference_year ?? '',
      status: progress.status,
      note: progress.note,
    };
  });
}

function buildReadme(records, rows) {
  const total = records.length;
  const toCheck = records.filter((r) => r.classification === 'to-check').length;
  const harder = records.filter((r) => r.classification === 'harder').length;
  const deepAttempted = records.filter((r) => r.deep_attempt_done === true).length;
  const withAnyAttempt = records.filter((r) => {
    const { status } = deriveProgress(r);
    return status !== 'deprioritized_post2000_refs' && status !== 'unattempted';
  }).length;

  const statuses = statusSummary(records).slice(0, 15);
  const summaryLines = statuses.map(([status, count]) => `- \`${status}\`: ${count}`).join('\n');

  const tableHeader = '| Problem | Title | Bucket | Rank | Latest Ref | Progress | Note |\n|---|---|---:|---:|---:|---|---|';
  const tableRows = rows
    .map(
      (r) =>
        `| ${mdEscape(r.problem_number)} | ${mdEscape(r.title)} | ${mdEscape(r.classification)} | ${mdEscape(
          r.to_check_rank
        )} | ${mdEscape(r.latest_reference_year)} | ${mdEscape(r.status)} | ${mdEscape(r.note)} |`
    )
    .join('\n');

  const now = new Date().toISOString();
  return `# Agentic Erdős

Tracking repository for experimental progress on Erdős problems from the \`ulamai/UnsolvedMath\` dataset subset we downloaded locally.

## Scope

- Total problems tracked: **${total}**
- Triaged as \`to-check\`: **${toCheck}**
- Triaged as \`harder\` (post-2000 reference signal): **${harder}**
- Records with deep-attempt workflow initialized: **${deepAttempted}**
- Records with at least one explicit attempt/progress status: **${withAnyAttempt}**
- README last generated (UTC): **${now}**

## Progress Status Counts

${summaryLines}

## Data and Notes

- Main merged progress source: \`data/erdos_to_check_ranked_with_deep_attempts_top20.jsonl\` + \`data/erdos_harder.jsonl\`
- CSV export of table below: \`data/all_problems_progress.csv\`
- Attempt notes directory: \`notes/\`
- Analysis / search scripts directory: \`scripts/\`

## Regenerate This README

\`\`\`bash
node scripts/generate_readme_progress.mjs
\`\`\`

## Full Problem Table

<details>
<summary>Show all ${rows.length} problems</summary>

${tableHeader}
${tableRows}

</details>
`;
}

function toCsv(rows) {
  const headers = [
    'problem_number',
    'title',
    'classification',
    'to_check_rank',
    'latest_reference_year',
    'status',
    'note',
  ];
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const toCheck = readJsonl(TO_CHECK_PATH);
  const harder = readJsonl(HARDER_PATH);
  const merged = [...toCheck, ...harder].sort((a, b) => numFromProblem(a.problem_number) - numFromProblem(b.problem_number));

  const rows = buildRows(merged);
  const readme = buildReadme(merged, rows);
  const csv = toCsv(rows);

  fs.writeFileSync(README_PATH, readme);
  fs.writeFileSync(CSV_PATH, csv);

  console.log(
    JSON.stringify(
      {
        total_records: merged.length,
        to_check_records: toCheck.length,
        harder_records: harder.length,
        readme_path: path.relative(ROOT, README_PATH),
        csv_path: path.relative(ROOT, CSV_PATH),
      },
      null,
      2
    )
  );
}

main();
