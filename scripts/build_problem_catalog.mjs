#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const NOTES_DIR = path.join(ROOT, 'notes');
const OUT_PATH = path.join(ROOT, 'catalog.json');

function extractSection(md, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^##\\s+${escaped}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`, 'im');
  const m = md.match(re);
  return m ? m[1].trim() : '';
}

function collapse(text, maxLen = 380) {
  const t = text.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

function inferClosureFromNote(noteText) {
  const resolvedPatterns = [
    /\btreat as resolved on the list\b/i,
    /\bpage status is \*\*proved\*\*\b/i,
    /\bproblem page now marks this as solved\b/i,
    /\bresolved in background \(as written\)\b/i,
    /\bresolved in the provided background\b/i,
    /^#\s*EP-\d+\s+resolved in background\b/im,
  ];
  if (resolvedPatterns.some((re) => re.test(noteText))) return 'resolved';
  return 'open';
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => /^ep\d+\.json$/i.test(f));
  const problems = [];

  for (const file of files) {
    const id = Number((file.match(/\d+/) || ['0'])[0]);
    const dataPath = path.join(DATA_DIR, file);
    const notePath = path.join(NOTES_DIR, `ep${id}.md`);
    const data = readJson(dataPath);
    const note = fs.existsSync(notePath) ? fs.readFileSync(notePath, 'utf8') : '';

    const statement = extractSection(note, 'Statement') || extractSection(note, 'Statement split');
    const resolved = extractSection(note, 'What is resolved');
    const refs = extractSection(note, 'References');
    const status = extractSection(note, 'Status');

    const computations = Array.isArray(data.computations) ? data.computations : [];
    const lastComp = computations.length ? computations[computations.length - 1] : null;

    problems.push({
      id,
      problem: data.problem || `EP-${id}`,
      title: data.title || `Erdos Problem #${id}`,
      classification: data.classification || 'to-check',
      closure_state: data.closure_state || inferClosureFromNote(note),
      progress_status:
        data.progress_status || (computations.length > 0 ? 'has_computation' : 'no_progress'),
      computations_count: computations.length,
      latest_computation_kind: lastComp?.kind || '',
      latest_computation_utc: lastComp?.generated_utc || '',
      statement_preview: collapse(statement),
      established_preview: collapse(resolved || status),
      references_preview: collapse(refs),
    });
  }

  problems.sort((a, b) => a.id - b.id);
  const out = {
    generated_utc: new Date().toISOString(),
    count: problems.length,
    problems,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${OUT_PATH} (${problems.length} problems)`);
}

main();
