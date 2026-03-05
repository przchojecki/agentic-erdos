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

function extractHardPointSentence(background) {
  const text = cleanText(background);
  if (!text) return '';
  const sentences = text.split(/(?<=[.!?])\s+/);
  const signal =
    /(not known|unknown|open|current record|best known|best bound|it is known|proved|conjecture|sufficient|implies|gap|bound)/i;
  const candidate = sentences.find((s) => signal.test(s));
  return candidate ? cleanText(candidate) : '';
}

function repairEllipsisNote(record, note) {
  // Treat only trailing ellipses as truncation signals.
  // Mid-sentence "..." can appear in valid mathematical notation.
  const hasEllipsis = /(?:…|\.\.\.)\s*$/.test(note);
  if (!hasEllipsis) return note;

  const hard = extractHardPointSentence(record.background);
  const strategy = cleanText(record.proof_attempt_strategy || '');

  if (strategy && hard) return `${strategy} Hard point: ${hard}`;
  if (hard) return `Hard point: ${hard}`;

  return note.replace(/…|\.\.\./g, '');
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

  const cleaned = cleanText(note);
  return { status: cleanText(status), note: repairEllipsisNote(record, cleaned) };
}

function deriveClosureState(record, statusOverride = '') {
  const explicit = cleanText(record.closure_state).toLowerCase();
  if (explicit === 'open' || explicit === 'counterexample' || explicit === 'resolved' || explicit === 'dataset_issue') {
    return explicit;
  }

  const status = cleanText(statusOverride || deriveProgress(record).status).toLowerCase();

  if (
    status.includes('statement_issue_malformed_dataset_entry') ||
    status.includes('statement_issue_likely_malformed_as_written')
  ) {
    return 'dataset_issue';
  }
  if (
    status.includes('counterexample_proved_as_written') ||
    status.includes('statement_issue_counterexample_in_background') ||
    status.includes('explicit_small_n_counterexample_written_asymptotic_open') ||
    status.includes('original_form_false') ||
    status.includes('false_as_written')
  ) {
    return 'counterexample';
  }
  if (status === 'resolved_in_background_as_written') return 'resolved';

  return 'open';
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
    const closureState = deriveClosureState(r, progress.status);
    return {
      problem_number: r.problem_number,
      title: cleanText(r.title),
      classification: r.classification || '',
      to_check_rank: r.to_check_rank ?? '',
      latest_reference_year: r.latest_reference_year ?? '',
      closure_state: closureState,
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
  const closureCounts = { open: 0, counterexample: 0, resolved: 0, dataset_issue: 0 };
  for (const r of records) {
    const { status } = deriveProgress(r);
    const closureState = deriveClosureState(r, status);
    closureCounts[closureState] = (closureCounts[closureState] || 0) + 1;
  }

  const statuses = statusSummary(records).slice(0, 15);
  const summaryLines = statuses.map(([status, count]) => `- \`${status}\`: ${count}`).join('\n');
  const closureLines = [
    `- \`open\`: ${closureCounts.open || 0}`,
    `- \`counterexample\`: ${closureCounts.counterexample || 0}`,
    `- \`resolved\`: ${closureCounts.resolved || 0}`,
    `- \`dataset_issue\`: ${closureCounts.dataset_issue || 0}`,
  ].join('\n');

  const tableHeader =
    '| Problem | Title | Bucket | Rank | Latest Ref | Closure | Progress | Note |\n|---|---|---:|---:|---:|---|---|---|';
  const tableRows = rows
    .map(
      (r) =>
        `| ${mdEscape(r.problem_number)} | ${mdEscape(r.title)} | ${mdEscape(r.classification)} | ${mdEscape(
          r.to_check_rank
        )} | ${mdEscape(r.latest_reference_year)} | ${mdEscape(r.closure_state)} | ${mdEscape(r.status)} | ${mdEscape(
          r.note
        )} |`
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
- Open statements (\`closure_state=open\`): **${closureCounts.open || 0}**
- Counterexamples established (\`closure_state=counterexample\`): **${closureCounts.counterexample || 0}**
- Resolved as written (\`closure_state=resolved\`): **${closureCounts.resolved || 0}**
- Dataset issues (\`closure_state=dataset_issue\`): **${closureCounts.dataset_issue || 0}**
- README last generated (UTC): **${now}**

## Closure State Counts

${closureLines}

## Progress Status Counts

${summaryLines}

## Data and Notes

- Main merged progress source: \`data/erdos_to_check_ranked_with_deep_attempts_top20.jsonl\` + \`data/erdos_harder.jsonl\`
- CSV export of table below: \`data/all_problems_progress.csv\`
- Attempt notes directory: \`notes/\`
- Formal proved-results writeup: \`notes/proved_results.md\`
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
    'closure_state',
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
