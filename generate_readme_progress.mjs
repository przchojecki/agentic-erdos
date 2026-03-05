#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const README_PATH = path.join(ROOT, 'README.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function mdEscape(v) {
  return String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function problemNum(problemLabel) {
  const m = String(problemLabel || '').match(/(\d+)/);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

function collectCanonical() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => /^ep\d+\.json$/i.test(f));
  const rows = files.map((f) => {
    const obj = readJson(path.join(DATA_DIR, f));
    const id = Number(f.match(/\d+/)?.[0] || 0);
    const problem = obj.problem || `EP-${id}`;
    const title = obj.title || `Erdos Problem #${id}`;
    const closure = obj.closure_state || 'open';
    const progress = obj.progress_status || (Array.isArray(obj.computations) && obj.computations.length > 0 ? 'has_computation' : 'no_progress');
    const note = obj.progress_note || `Computations: ${(obj.computations || []).length}`;

    return {
      problem_number: problem,
      title,
      classification: obj.classification || 'to-check',
      to_check_rank: obj.to_check_rank ?? '',
      latest_reference_year: obj.latest_reference_year ?? '',
      closure_state: closure,
      status: progress,
      note,
    };
  });

  rows.sort((a, b) => problemNum(a.problem_number) - problemNum(b.problem_number));
  return rows;
}

function buildReadme(rows) {
  const total = rows.length;
  const toCheck = rows.filter((r) => r.classification === 'to-check').length;
  const harder = rows.filter((r) => r.classification === 'harder').length;

  const closureCounts = { open: 0, counterexample: 0, resolved: 0, dataset_issue: 0 };
  for (const r of rows) {
    const c = String(r.closure_state || 'open');
    if (closureCounts[c] != null) closureCounts[c] += 1;
    else closureCounts.open += 1;
  }

  const statusMap = new Map();
  for (const r of rows) statusMap.set(r.status, (statusMap.get(r.status) || 0) + 1);
  const statusLines = [...statusMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([s, c]) => `- \`${s}\`: ${c}`)
    .join('\n');

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

Tracking repository for experimental progress on Erdős problems from the local canonical per-problem files.

## Scope

- Total problems tracked: **${total}**
- Triaged as \`to-check\`: **${toCheck}**
- Triaged as \`harder\`: **${harder}**
- README last generated (UTC): **${now}**

## Closure State Counts

- \`open\`: ${closureCounts.open}
- \`counterexample\`: ${closureCounts.counterexample}
- \`resolved\`: ${closureCounts.resolved}
- \`dataset_issue\`: ${closureCounts.dataset_issue}

## Progress Status Counts

${statusLines}

## Data and Notes

- Canonical data directory: data/ (one epNNN.json per problem)
- Canonical notes directory: notes/ (one epNNN.md per problem)
- Canonical scripts directory: scripts/ (one epNNN.mjs per problem)

## Regenerate This README

\`\`\`bash
node generate_readme_progress.mjs
\`\`\`

## Full Problem Table

<details>
<summary>Show all ${rows.length} problems</summary>

${tableHeader}
${tableRows}

</details>
`;
}

function main() {
  const rows = collectCanonical();
  fs.writeFileSync(README_PATH, buildReadme(rows), 'utf8');
  console.log(`Wrote: ${README_PATH}`);
}

main();
