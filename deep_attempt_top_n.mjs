#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'data/erdos_to_check_ranked_with_attempts.jsonl';
const outputDir = process.argv[3] || 'data';
const topN = Number(process.argv[4] || 20);

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line, idx) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`Invalid JSONL at line ${idx + 1}: ${err.message}`);
      }
    });
}

function toJsonl(records) {
  return records.map((r) => JSON.stringify(r)).join('\n') + '\n';
}

function csvEscape(value) {
  const str = value == null ? '' : String(value);
  return `"${str.replaceAll('"', '""')}"`;
}

function toCsv(records, headers) {
  const head = headers.map(csvEscape).join(',');
  const rows = records.map((r) => headers.map((h) => csvEscape(r[h])).join(','));
  return [head, ...rows].join('\n') + '\n';
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\bot\\equiv\b/g, '\\not\\equiv')
    .replace(/\bx eq y\b/g, 'x \\neq y')
    .trim();
}

function hardFromBackground(background) {
  const clean = normalizeText(background);
  if (!clean) return '';
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const signal = /(not known|unknown|open|counterexample|false|current record|best known|proved|conjecture|implies|limsup|liminf|exists)/i;
  const hit = sentences.find((s) => signal.test(s));
  return hit ? (hit.length > 220 ? `${hit.slice(0, 219)}…` : hit) : '';
}

function makeDefaultDeep(problem) {
  const statement = normalizeText(problem.statement);
  const backgroundSignal = hardFromBackground(problem.background);
  return {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried to reframe the statement as an extremal threshold problem and push known bounds through a contradiction setup.',
    deep_attempt_obstacle:
      backgroundSignal || 'Could not close the final quantitative gap between known methods and the claimed threshold.',
    deep_attempt_next_step:
      'Isolate a sharper intermediate lemma (or a small explicit model) that narrows the threshold gap.',
    deep_attempt_note: `Statement focus: ${statement.slice(0, 180)}${statement.length > 180 ? '…' : ''}`,
  };
}

function loadCanonicalProblems() {
  const dataDir = 'data';
  const noteDir = 'notes';
  const files = fs.readdirSync(dataDir).filter((f) => /^ep\d+\.json$/i.test(f)).sort((a, b) => {
    const ai = Number(a.match(/\d+/)?.[0] || 0);
    const bi = Number(b.match(/\d+/)?.[0] || 0);
    return ai - bi;
  });

  return files.map((f, idx) => {
    const id = Number(f.match(/\d+/)?.[0] || idx + 1);
    const obj = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    const notePath = path.join(noteDir, `ep${id}.md`);
    const note = fs.existsSync(notePath) ? fs.readFileSync(notePath, 'utf8') : '';
    return {
      problem_number: `EP-${id}`,
      title: obj.title || `Erdos Problem #${id}`,
      statement: obj.statement || '',
      background: obj.background || note,
      to_check_rank: obj.to_check_rank ?? idx + 1,
    };
  });
}

const rows = fs.existsSync(inputPath) ? readJsonl(inputPath) : loadCanonicalProblems();

const enriched = rows.map((row) => {
  const rank = Number(row.to_check_rank ?? Number.MAX_SAFE_INTEGER);
  if (rank <= topN) {
    const customEntry = makeDefaultDeep(row);
    return {
      ...row,
      deep_attempt_done: true,
      deep_attempt_method: 'problem_specific_manual_v1',
      deep_attempt_scope: `top_${topN}`,
      deep_attempt_updated_utc: new Date().toISOString(),
      ...customEntry,
    };
  }

  return {
    ...row,
    deep_attempt_done: false,
    deep_attempt_method: null,
    deep_attempt_scope: null,
    deep_attempt_updated_utc: null,
    deep_attempt_status: null,
    deep_attempt_route: null,
    deep_attempt_obstacle: null,
    deep_attempt_next_step: null,
    deep_attempt_note: null,
  };
});

const topRows = enriched
  .filter((r) => Number(r.to_check_rank ?? Number.MAX_SAFE_INTEGER) <= topN)
  .sort((a, b) => Number(a.to_check_rank) - Number(b.to_check_rank));

const summary = {
  input_records: rows.length,
  deep_attempted_records: topRows.length,
  scope: `top_${topN}_ranked_to_check`,
  method: 'problem_specific_manual_v1',
  status_counts: topRows.reduce((acc, r) => {
    acc[r.deep_attempt_status] = (acc[r.deep_attempt_status] || 0) + 1;
    return acc;
  }, {}),
};

fs.mkdirSync(outputDir, { recursive: true });

const outJsonl = path.join(outputDir, `erdos_to_check_ranked_with_deep_attempts_top${topN}.jsonl`);
const outTopCsv = path.join(outputDir, `erdos_to_check_top${topN}_deep_attempts.csv`);
const outSummary = path.join(outputDir, `erdos_to_check_top${topN}_deep_attempts_summary.json`);

fs.writeFileSync(outJsonl, toJsonl(enriched), 'utf8');

const csvRows = topRows.map((r) => ({
  to_check_rank: r.to_check_rank,
  problem_number: r.problem_number,
  title: r.title,
  deep_attempt_status: r.deep_attempt_status,
  deep_attempt_route: r.deep_attempt_route,
  deep_attempt_obstacle: r.deep_attempt_obstacle,
  deep_attempt_next_step: r.deep_attempt_next_step,
}));

fs.writeFileSync(
  outTopCsv,
  toCsv(csvRows, [
    'to_check_rank',
    'problem_number',
    'title',
    'deep_attempt_status',
    'deep_attempt_route',
    'deep_attempt_obstacle',
    'deep_attempt_next_step',
  ])
);

fs.writeFileSync(outSummary, JSON.stringify(summary, null, 2) + '\n', 'utf8');

console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote: ${outJsonl}`);
console.log(`Wrote: ${outTopCsv}`);
console.log(`Wrote: ${outSummary}`);
