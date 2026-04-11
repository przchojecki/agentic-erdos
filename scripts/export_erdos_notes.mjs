#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const NOTES_DIR = path.join(ROOT, 'notes');
const OUT_PATH = path.join(ROOT, 'erdos-notes.json');
const UNSOLVEDMATH_PATH = path.join(ROOT, 'external', 'unsolvedmath', 'problems.json');

function normalizeNewlines(text) {
  return String(text || '').replace(/\r\n?/g, '\n');
}

function trimBlock(text) {
  return normalizeNewlines(text).replace(/^\n+/, '').replace(/\s+$/, '');
}

function normalizeTitle(title) {
  return String(title || '').trim().toLowerCase();
}

function parseSections(md) {
  const lines = normalizeNewlines(md).split('\n');
  const sections = [];
  let current = null;

  function flush() {
    if (!current) return;
    sections.push({
      title: current.title,
      content: trimBlock(current.lines.join('\n')),
    });
    current = null;
  }

  for (const line of lines) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      flush();
      current = { title: heading[1].trim(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();
  return sections;
}

function parseSubsections(md, headingLevel = 3) {
  const lines = normalizeNewlines(md).split('\n');
  const sections = [];
  const marker = '#'.repeat(headingLevel);
  let current = null;

  function flush() {
    if (!current) return;
    sections.push({
      title: current.title,
      content: trimBlock(current.lines.join('\n')),
    });
    current = null;
  }

  for (const line of lines) {
    const heading = line.match(new RegExp(`^${marker}\\s+(.*)$`));
    if (heading) {
      flush();
      current = { title: heading[1].trim(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();
  return sections;
}

function formatSection(title, content) {
  const body = trimBlock(content);
  return body ? `## ${title}\n${body}` : '';
}

function pushPart(parts, value) {
  const trimmed = trimBlock(value);
  if (trimmed) parts.push(trimmed);
}

function loadRemoteStatements() {
  if (!fs.existsSync(UNSOLVEDMATH_PATH)) return new Map();
  const raw = JSON.parse(fs.readFileSync(UNSOLVEDMATH_PATH, 'utf8'));
  const byProblem = new Map();

  for (const item of raw) {
    const key = String(item.problem_number || '').trim().toUpperCase();
    if (!/^EP-\d+$/.test(key)) continue;
    const statement = trimBlock(item.statement || item.problem_statement || '');
    if (statement) byProblem.set(key, statement);
  }

  return byProblem;
}

function isProblemTitle(title) {
  return /^(problem statement|statement(?:\b| split|\s*\(as written\))|working statement|working setup|problem)$/i.test(
    title.trim(),
  );
}

function isIgnoredWrapper(title) {
  return /^(proof attempts and literature notes|batch split integrations \(from head\))$/i.test(title.trim());
}

function isLiteratureTitle(title) {
  const t = normalizeTitle(title);
  return (
    /literature|references/.test(t) ||
    [
      'web sources used',
      'what is resolved from background',
      'what is known from background',
      'what is known',
      'what is known here',
      'what is known in this note',
      'known theorem-level background',
      'known constraints around this frontier',
      'resolution already in background',
      'context from background',
      'background-level progress',
      'source pointers',
      'forum synthesis (thread #488)',
      'literature search update',
      'literature leads',
      'additional resolved subclaims from background',
      'what remains open from background',
    ].includes(t)
  );
}

function isExplicitComputationTitle(title) {
  const t = normalizeTitle(title);
  return (
    t === 'new experiments' ||
    t === 'computation-guided observations' ||
    t === 'computation context' ||
    t.startsWith('computation in this attempt') ||
    t.startsWith('deep standalone computation') ||
    t.startsWith('deeper standalone computation') ||
    t.startsWith('additional computational extension') ||
    t.startsWith('new deep computation') ||
    t.startsWith('new deep run') ||
    t === 'experiment in this attempt' ||
    t === 'computation signal' ||
    t.startsWith('evidence from this batch') ||
    t.startsWith('interpretation') ||
    t.startsWith('step 1 extension') ||
    t.startsWith('additional extension') ||
    t.startsWith('ultra pass') ||
    t.startsWith('new finite scan') ||
    t.startsWith('new variable-length search') ||
    t.startsWith('new exact targeted run') ||
    t.startsWith('further exact targeted extension') ||
    t.startsWith('counterexample-seed search extension') ||
    t.startsWith('new counterexample extension') ||
    t.startsWith('new finite counterexample-oriented probe') ||
    t.startsWith('additional random search') ||
    t.startsWith('additional finite') ||
    t.startsWith('finite ') ||
    t === 'findings' ||
    t === 'reproducible certificate' ||
    t.startsWith('runtime break-point profile') ||
    t.startsWith('exact computation') ||
    t === 'exact check in this attempt' ||
    t === 'scripted sanity check' ||
    t.startsWith('greedy bounded-representation experiments') ||
    t.startsWith('dense real-sequence counterexample search') ||
    t.startsWith('constructive checks') ||
    t.startsWith('adversarial fixed-m search') ||
    t.startsWith('literal-clause sanity check') ||
    t === 'large-family signal'
  );
}

function looksExperimentalSection(title, content) {
  if (isExplicitComputationTitle(title)) return true;

  const t = normalizeTitle(title);
  const body = normalizeNewlines(content);
  const proofOnlyTitle =
    /deeper proof|deeper verification|lemma|theorem|proof|formal|claim|corollary|consequence|blocking lemma|rigorous/.test(
      t,
    );
  const hasExperimentMarkers =
    /data file:|data\/|\.mjs\b|verification script|runtime|cross-check|exact agreement|best observed|counts:|sample aps:|computed|i computed|i ran|i checked|i compared|search|scan|sampled|heuristic|random|\bfinite\b/i.test(
      body,
    );

  if (/^one-by-one (cycle|analysis)$/.test(t)) return true;
  if (/^(attempt in this batch|attempt route|attempt details|route)$/.test(t) && hasExperimentMarkers) return true;
  if (/^result(?:s)?$/.test(t) && hasExperimentMarkers) return true;
  if (/^status$/.test(t) && /(finite|computation|heuristic|search|scan|run)/i.test(body)) return true;
  if (hasExperimentMarkers && !proofOnlyTitle && !isLiteratureTitle(title) && !isProblemTitle(title)) return true;

  return false;
}

function classifyBatchLabel(label) {
  const t = normalizeTitle(label);
  if (/literature|reference|background|problem pages|primary references/.test(t)) return 'literature';
  if (/compute|computation|signal|interpretation|data|experiment/.test(t)) return 'computation';
  return '';
}

function extractBatchParts(content) {
  const lines = normalizeNewlines(content).split('\n');
  const literatureBlocks = [];
  const computationBlocks = [];
  let label = '';
  let blockLines = [];

  function flush() {
    if (!label) return;
    const kind = classifyBatchLabel(label);
    const raw = trimBlock([`- ${label}:`, ...blockLines].join('\n'));
    if (kind === 'literature') literatureBlocks.push(raw);
    if (kind === 'computation') computationBlocks.push(raw);
    label = '';
    blockLines = [];
  }

  for (const line of lines) {
    const bullet = line.match(/^- ([^:]+):\s*$/);
    if (bullet) {
      flush();
      label = bullet[1].trim();
      continue;
    }
    if (!label) continue;
    if (/^###\s+/.test(line)) {
      flush();
      continue;
    }
    blockLines.push(line);
  }
  flush();

  return {
    literature: literatureBlocks.length
      ? formatSection('Batch Split Integrations (From HEAD)', literatureBlocks.join('\n\n'))
      : '',
    computation: computationBlocks.length
      ? formatSection('Batch Split Integrations (From HEAD)', computationBlocks.join('\n\n'))
      : '',
  };
}

function extractEntry(notePath, remoteStatements) {
  const md = fs.readFileSync(notePath, 'utf8');
  const sections = parseSections(md);
  const numericId = Number((path.basename(notePath).match(/\d+/) || ['0'])[0]);
  const id = `EP-${numericId}`;
  const problemFallback = remoteStatements.get(id) || '';

  let problem = '';
  const literature = [];
  const computation = [];
  const attempt = [];

  function processSection(section) {
    const title = section.title.trim();
    const content = trimBlock(section.content);
    if (!content) return;

    if (/^batch split integrations \(from head\)$/i.test(title)) {
      const batch = extractBatchParts(content);
      pushPart(literature, batch.literature);
      pushPart(computation, batch.computation);
      return;
    }

    if (isIgnoredWrapper(title)) return;

    if (!problem && isProblemTitle(title)) {
      problem = content;
      return;
    }

    if (isLiteratureTitle(title)) {
      pushPart(literature, formatSection(title, content));
      return;
    }

    const explicitComputation = isExplicitComputationTitle(title);
    const experimental = looksExperimentalSection(title, content);

    if (explicitComputation || experimental) {
      pushPart(computation, formatSection(title, content));
    }

    if (!explicitComputation) {
      pushPart(attempt, formatSection(title, content));
    }
  }

  for (const section of sections) {
    const title = section.title.trim();
    if (/^proof attempts and literature notes$/i.test(title)) {
      const nested = parseSubsections(section.content, 3).filter(
        (subsection) => !/^source:/i.test(subsection.title.trim()),
      );
      if (nested.length) {
        for (const subsection of nested) processSection(subsection);
      }
      continue;
    }
    processSection(section);
  }

  const computationText = trimBlock(computation.join('\n\n'));
  const attemptText = trimBlock(attempt.join('\n\n')) || computationText;

  return {
    id,
    problem: trimBlock(problem || problemFallback),
    literature: trimBlock(literature.join('\n\n')),
    computation: computationText,
    attempt: attemptText,
  };
}

function main() {
  const remoteStatements = loadRemoteStatements();
  const noteFiles = fs
    .readdirSync(NOTES_DIR)
    .filter((file) => /^ep\d+\.md$/i.test(file))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

  const entries = noteFiles.map((file) => extractEntry(path.join(NOTES_DIR, file), remoteStatements));
  fs.writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + '\n', 'utf8');

  const missingProblem = entries.filter((entry) => !entry.problem).length;
  const missingLiterature = entries.filter((entry) => !entry.literature).length;
  const missingComputation = entries.filter((entry) => !entry.computation).length;
  const missingAttempt = entries.filter((entry) => !entry.attempt).length;

  console.log(
    `Wrote ${OUT_PATH} (${entries.length} entries; blanks: problem=${missingProblem}, literature=${missingLiterature}, computation=${missingComputation}, attempt=${missingAttempt})`,
  );
}

main();
