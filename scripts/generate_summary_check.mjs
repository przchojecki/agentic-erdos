#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, 'data', 'erdos_to_check_ranked_with_deep_attempts_top20.jsonl');
const OUTPUT_PATH = path.join(ROOT, 'summary-check.md');

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function clean(v) {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHardPointSentence(background) {
  const text = clean(background);
  if (!text) return '';
  const sentences = text.split(/(?<=[.!?])\s+/);
  const signal =
    /(not known|unknown|open|current record|best known|best bound|it is known|proved|conjecture|sufficient|implies|gap|bound)/i;
  return clean(sentences.find((s) => signal.test(s)) || '');
}

function repairEllipsisOutcome(record, outcome) {
  const text = clean(outcome);
  if (!/(?:…|\.\.\.)\s*$/.test(text)) return text;

  const hard = extractHardPointSentence(record.background);
  const strategy = clean(record.proof_attempt_strategy || '');
  if (strategy && hard) return `${strategy} Hard point: ${hard}`;
  if (hard) return `Hard point: ${hard}`;
  return text.replace(/…|\.\.\./g, '');
}

function mdEscape(v) {
  return String(v ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function rankNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function firstNonEmpty(record, keys) {
  for (const k of keys) {
    const v = record?.[k];
    if (v != null && String(v).trim() !== '') return v;
  }
  return '';
}

function statusOf(record) {
  return clean(
    firstNonEmpty(record, [
      'deep_attempt_v4_status',
      'deep_attempt_v3_status',
      'deep_attempt_v2_status',
      'deep_attempt_status',
      'proof_attempt_status',
      'status',
    ]) || 'unattempted'
  );
}

function outcomeOf(record) {
  const raw = clean(
    firstNonEmpty(record, [
      'deep_attempt_v4_result',
      'deep_attempt_v4_caveat',
      'deep_attempt_v3_result',
      'deep_attempt_v3_obstacle',
      'deep_attempt_v2_result',
      'deep_attempt_v2_obstacle',
      'deep_attempt_route',
      'deep_attempt_note',
      'proof_attempt_concise',
      'proof_attempt_hard_part',
      'proof_attempt_strategy',
    ])
  );
  return repairEllipsisOutcome(record, raw);
}

function notesFileOf(record) {
  return clean(
    firstNonEmpty(record, [
      'deep_attempt_v4_notes_file',
      'deep_attempt_v3_notes_file',
      'deep_attempt_v2_notes_file',
    ])
  );
}

function experimentsFileOf(record) {
  return clean(
    firstNonEmpty(record, [
      'deep_attempt_v4_experiments_file',
      'deep_attempt_v3_experiments_file',
      'deep_attempt_v2_experiments_file',
    ])
  );
}

function linkIf(pathLike) {
  const p = clean(pathLike);
  if (!p) return '';
  const label = path.basename(p);
  return `[${mdEscape(label)}](${mdEscape(p)})`;
}

function flagCounterexample(status, outcome) {
  const t = `${status} ${outcome}`.toLowerCase();
  return /(counterexample|false|disprov|statement_issue|malformed|witness|small-n failure|small_n_failure)/.test(t);
}

function flagReasoning(status, outcome) {
  const t = `${status} ${outcome}`.toLowerCase();
  if (flagCounterexample(status, outcome)) return false;
  return /(known|proved|exact|computed|bound|asymptotic|criterion|equivalent|reduced|construction|density|resolved|partial|window)/.test(
    t
  );
}

function topStatusCounts(records, k = 20) {
  const m = new Map();
  for (const r of records) {
    const s = statusOf(r);
    m.set(s, (m.get(s) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k);
}

function asYes(flag) {
  return flag ? 'yes' : '';
}

function toMdTable(headers, rows) {
  const head = `| ${headers.map(mdEscape).join(' | ')} |`;
  const sep = `|${headers.map(() => '---').join('|')}|`;
  const body = rows.map((r) => `| ${r.map((v) => mdEscape(v)).join(' | ')} |`).join('\n');
  return [head, sep, body].join('\n');
}

function main() {
  const all = readJsonl(INPUT_PATH);
  const toCheck = all
    .filter((r) => (r.classification || 'to-check') === 'to-check')
    .sort((a, b) => rankNum(a.to_check_rank) - rankNum(b.to_check_rank));

  const attempted = toCheck.filter((r) => r.deep_attempt_done === true).length;
  const remaining = toCheck.length - attempted;
  const generated = new Date().toISOString();

  const statusTop = topStatusCounts(toCheck);
  const statusTopLines = statusTop.map(([s, c]) => `- \`${s}\`: ${c}`).join('\n');

  const enriched = toCheck.map((r) => {
    const status = statusOf(r);
    const outcome = outcomeOf(r);
    const pr = flagReasoning(status, outcome);
    const pc = flagCounterexample(status, outcome);
    return {
      ...r,
      status,
      outcome,
      pr,
      pc,
      notesFile: notesFileOf(r),
      experimentsFile: experimentsFileOf(r),
    };
  });

  const reasoning = enriched.filter((r) => r.pr);
  const counter = enriched.filter((r) => r.pc);

  const reasoningTable = toMdTable(
    ['Problem', 'Rank', 'Status', 'Why Promising', 'Notes'],
    reasoning.map((r) => [
      r.problem_number,
      String(r.to_check_rank ?? ''),
      r.status,
      r.outcome,
      linkIf(r.notesFile),
    ])
  );

  const counterTable = toMdTable(
    ['Problem', 'Rank', 'Status', 'Counterexample Signal', 'Notes'],
    counter.map((r) => [
      r.problem_number,
      String(r.to_check_rank ?? ''),
      r.status,
      r.outcome,
      linkIf(r.notesFile),
    ])
  );

  const ledger = toMdTable(
    [
      'Problem',
      'Rank',
      'Status',
      'Promising Reasoning',
      'Promising Counterexample',
      'Key Outcome',
      'Notes',
      'Experiments',
    ],
    enriched.map((r) => [
      r.problem_number,
      String(r.to_check_rank ?? ''),
      r.status,
      asYes(r.pr),
      asYes(r.pc),
      r.outcome,
      linkIf(r.notesFile),
      linkIf(r.experimentsFile),
    ])
  );

  const md = `# To-Check Attempt Summary

Generated: **${generated}**

## Snapshot

- Total \`to-check\` problems: **${toCheck.length}**
- Attempted (deep_attempt_done=true): **${attempted}**
- Remaining unattempted: **${remaining}**
- Auto-flagged promising reasoning items: **${reasoning.length}**
- Auto-flagged promising counterexample items: **${counter.length}**

## Status Distribution (Top)

${statusTopLines}

## Promising Reasoning Leads (Auto-Flagged)

${reasoningTable}

## Promising Counterexample Leads (Auto-Flagged)

${counterTable}

## Full Attempt Ledger (All To-Check Problems)

${ledger}
`;

  fs.writeFileSync(OUTPUT_PATH, md, 'utf8');
  console.log(
    JSON.stringify(
      {
        input_path: path.relative(ROOT, INPUT_PATH),
        output_path: path.relative(ROOT, OUTPUT_PATH),
        to_check_total: toCheck.length,
        attempted,
        reasoning_flagged: reasoning.length,
        counterexample_flagged: counter.length,
      },
      null,
      2
    )
  );
}

main();
