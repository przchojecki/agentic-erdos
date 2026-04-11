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

function parseSections(md, level = 2) {
  const marker = '#'.repeat(level);
  const headingRe = new RegExp(`^${marker}\\s+(.*)$`);
  const lines = normalizeNewlines(md).split('\n');
  const sections = [];
  let current = null;

  function flush() {
    if (!current) return;
    sections.push({
      title: trimBlock(current.title),
      content: trimBlock(current.lines.join('\n')),
    });
    current = null;
  }

  for (const line of lines) {
    const match = line.match(headingRe);
    if (match) {
      flush();
      current = { title: match[1], lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();
  return sections;
}

function cleanTitle(title) {
  let t = trimBlock(title);
  t = t.replace(/`/g, '');
  t = t.replace(/\*\*/g, '');
  t = t.replace(/\((?:[^)]*(?:scripts\/|data\/|\.mjs\b|\.json\b)[^)]*)\)/gi, '');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function titleLabel(title) {
  const t = cleanTitle(title);
  if (!t) return '';
  return /[:?]/.test(t) ? t : `${t}:`;
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

function isWrapperTitle(title) {
  return /^(proof attempts and literature notes|batch split integrations \(from head\))$/i.test(title.trim());
}

function isIgnoredTopLevelTitle(title) {
  const t = normalizeTitle(title);
  return (
    t === 'new experiments' ||
    t === 'integrated batch reasoning' ||
    t === 'web sources used' ||
    t === 'status' ||
    t === 'current status' ||
    t === 'definitive status (locked)' ||
    t === 'definitive status (current)'
  );
}

function isLiteratureTitle(title) {
  const t = normalizeTitle(title);
  return (
    /literature|references/.test(t) ||
    [
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
      'literature search update',
      'literature leads',
      'additional resolved subclaims from background',
      'what remains open from background',
    ].includes(t)
  );
}

function isProofTitle(title) {
  const t = normalizeTitle(title);
  return (
    /proof|lemma|theorem|corollary|claim|reduction|reformulation|verification/.test(t) ||
    [
      'what is resolved',
      'what remains open in this note',
      'what remains open here',
      'what remains open',
      'what remains hard',
      'hard point',
      'obstacle',
      'issue',
      'note',
      'limit',
      'limits',
      'partial theorem proved',
      'additional solved subclass',
      'additional proof route attempted here',
      'useful reduction',
      'reframing',
      'counterexample route',
      'proof route sharpened',
      'strategy notes',
      'next proof targets',
      'what would finish the proof',
      'formal proof layer',
      'lemma chain (with proofs)',
      'lemma chain (with Proofs)',
      'latex proofs for a => b => c skeleton',
      'added proof-strategy layer (no new computation)',
      'added proof layer (no new computation)',
      'deeper proof program (a => b => c)',
      'deeper verification program (a => b => c)',
      'deeper proof program (a => b => c) for squares variant',
      'deeper proof program for corrected variants (a => b => c)',
      'deeper proof-attack pass (2026-03-06)',
      'problem recast',
      'current proof direction',
    ].includes(t)
  );
}

function isComputationTitle(title) {
  const t = normalizeTitle(title);
  return (
    t === 'our approaches / what is proven' ||
    t === 'computation-guided observations' ||
    t === 'computation context' ||
    t === 'one-by-one cycle' ||
    t === 'one-by-one analysis' ||
    t === 'interpretation' ||
    t === 'computation signal' ||
    t === 'findings' ||
    t === 'results' ||
    t === 'result' ||
    t === 'finite signal' ||
    t === 'finite result' ||
    t === 'finite findings' ||
    t === 'large-family signal' ||
    t === 'experiment in this attempt' ||
    t === 'exhaustive small-n evidence' ||
    t.startsWith('computation in this attempt') ||
    t.startsWith('deep standalone computation') ||
    t.startsWith('deeper standalone computation') ||
    t.startsWith('additional computational extension') ||
    t.startsWith('new deep computation') ||
    t.startsWith('new deep run') ||
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
    t.startsWith('adversarial fixed-m search') ||
    t.startsWith('greedy bounded-representation experiments') ||
    t.startsWith('dense real-sequence counterexample search') ||
    t.startsWith('constructive checks') ||
    t.startsWith('literal-clause sanity check') ||
    t.startsWith('runtime break-point profile')
  );
}

function isRouteLikeTitle(title) {
  const t = normalizeTitle(title);
  return (
    t === 'route' ||
    t === 'attempt in this batch' ||
    t === 'attempt route' ||
    t === 'attempt details' ||
    t === 'evidence from this batch'
  );
}

function hasComputationMarkers(content) {
  return /computed|i computed|i ran|scan|searched|sampled|heuristic|runtime|best found|best observed|brute force|brute-force|greedy|observed|up to\s+\$?\d|up to `?\d|exact search|randomized/i.test(
    content,
  );
}

function shouldDropLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^#\s*EP-\d+/i.test(trimmed)) return true;
  if (/^Source:/i.test(trimmed)) return true;
  if (/^No notes yet\.$/i.test(trimmed)) return true;
  if (/^Web sources used:?$/i.test(trimmed)) return true;
  if (/^Problem pages:?$/i.test(trimmed)) return true;
  if (/^Additional primary references surfaced in quick scan:?$/i.test(trimmed)) return true;
  if (/^Data files?:/i.test(trimmed)) return true;
  if (/^Data file:/i.test(trimmed)) return true;
  if (/^Script \/ data:/i.test(trimmed)) return true;
  if (/^Verification script:/i.test(trimmed)) return true;
  if (/^Saved:/i.test(trimmed)) return true;
  if (/^Batch scripts were integrated/i.test(trimmed)) return true;
  if (/^-\s*\d{4}-\d{2}-\d{2}T/.test(trimmed)) return true;
  if (/https?:\/\//i.test(trimmed)) return true;
  return false;
}

function stripInlineArtifacts(line) {
  let out = line;
  out = out.replace(/^\s*-\s*Replaced placeholder script with\s+/i, '- ');
  out = out.replace(/^\s*-\s*Replaced batch-derived placeholder with\s+/i, '- ');
  out = out.replace(/`[^`]*(?:scripts\/|data\/|\.mjs\b|\.json\b)[^`]*`/gi, '');
  out = out.replace(/\([^)]*(?:scripts\/|data\/|\.mjs\b|\.json\b)[^)]*\)/gi, '');
  out = out.replace(/\b(?:scripts\/|data\/)\S+/gi, '');
  out = out.replace(/\b\S*\.mjs\b/gi, '');
  out = out.replace(/\b\S*\.json\b/gi, '');
  out = out.replace(/\bscript(?:s)?\b/gi, '');
  out = out.replace(/\(\s*\)/g, '');
  out = out.replace(/\s{2,}/g, ' ');
  out = out.replace(/\s+:/g, ':');
  out = out.replace(/-\s+\./g, '-');
  return out;
}

function cleanContent(text) {
  const out = [];
  const lines = normalizeNewlines(text).split('\n');

  for (const rawLine of lines) {
    if (shouldDropLine(rawLine)) continue;
    const heading = rawLine.match(/^\s*#{1,6}\s+(.*)$/);
    if (heading) {
      const label = titleLabel(heading[1]);
      if (label) out.push(label);
      continue;
    }

    let line = rawLine.replace(/`/g, '');
    line = line.replace(/\*\*/g, '');
    line = stripInlineArtifacts(line);
    line = line.replace(/\s+$/, '');

    if (/^\s*-\s*:?\s*$/.test(line)) continue;
    if (/^\s*-\s*\([^)]*\)\s*$/.test(line)) continue;
    if (!line.trim()) continue;
    out.push(line);
  }

  return trimBlock(out.join('\n')).replace(/\n{3,}/g, '\n\n');
}

function omitLabelForField(field, title) {
  const t = normalizeTitle(title);
  if (field === 'literature') {
    return (
      t === 'literature' ||
      t === 'literature / context' ||
      t === 'literature search update' ||
      t === 'literature leads' ||
      t === 'references' ||
      t === 'references / literature' ||
      t === 'references (checked in this deep dive)' ||
      t === 'what is resolved from background' ||
      t === 'what is known from background' ||
      t === 'what is known' ||
      t === 'what is known here' ||
      t === 'what is known in this note' ||
      t === 'known theorem-level background' ||
      t === 'resolution already in background' ||
      t === 'context from background' ||
      t === 'background-level progress'
    );
  }
  if (field === 'computation') {
    return (
      t === 'our approaches / what is proven' ||
      t === 'computation-guided observations' ||
      t === 'computation context' ||
      t === 'one-by-one cycle' ||
      t === 'one-by-one analysis' ||
      t === 'evidence from this batch' ||
      t === 'result' ||
      t === 'results' ||
      t === 'findings' ||
      t === 'interpretation' ||
      t === 'finite signal' ||
      t === 'finite result' ||
      t === 'finite findings' ||
      t === 'computation signal' ||
      t === 'experiment in this attempt' ||
      t.startsWith('computation in this attempt') ||
      t.startsWith('deep standalone computation') ||
      t.startsWith('deeper standalone computation') ||
      t.startsWith('additional computational extension')
    );
  }
  if (field === 'attempt') {
    return (
      t === 'added proof-strategy layer (no new computation)' ||
      t === 'added proof layer (no new computation)' ||
      t === 'deeper proof program (a => b => c)' ||
      t === 'deeper verification program (a => b => c)' ||
      t === 'formal proof layer' ||
      t === 'lemma chain (with proofs)' ||
      t === 'latex proofs for a => b => c skeleton'
    );
  }
  return false;
}

function renderSection(field, title, content) {
  const cleaned = cleanContent(content);
  if (!cleaned) return '';
  if (omitLabelForField(field, title)) return cleaned;
  const label = titleLabel(title);
  return label ? `${label}\n${cleaned}` : cleaned;
}

function extractBatchSections(content) {
  const lines = normalizeNewlines(content).split('\n');
  const sections = [];
  let currentTitle = '';
  let currentLines = [];

  function flush() {
    if (!currentTitle) return;
    const title = cleanTitle(currentTitle);
    const text = cleanContent(currentLines.join('\n'));
    if (title && text) sections.push({ title, content: text });
    currentTitle = '';
    currentLines = [];
  }

  for (const line of lines) {
    if (/^###\s+Source:/i.test(line) || /^###\s+EP-\d+/i.test(line)) continue;
    const bullet = line.match(/^- ([^:]+):\s*$/);
    if (bullet) {
      flush();
      currentTitle = bullet[1];
      continue;
    }
    if (!currentTitle) continue;
    currentLines.push(line);
  }
  flush();
  return sections;
}

function classifyBatchTitle(title) {
  const t = normalizeTitle(title);
  if (/literature|reference/.test(t)) return 'literature';
  if (/compute|computation|signal|interpretation|experiment/.test(t)) return 'computation';
  return '';
}

function expandSections(md) {
  const sections = [];
  for (const section of parseSections(md, 2)) {
    const title = cleanTitle(section.title);
    if (!title) continue;

    if (/^proof attempts and literature notes$/i.test(title)) {
      const nested = parseSections(section.content, 3)
        .filter((sub) => !/^source:/i.test(cleanTitle(sub.title)))
        .map((sub) => ({ title: cleanTitle(sub.title), content: sub.content }));

      if (nested.length) {
        sections.push(...nested);
      }
      continue;
    }

    sections.push({ title, content: section.content });
  }
  return sections;
}

function extractEntry(notePath, remoteStatements) {
  const md = fs.readFileSync(notePath, 'utf8');
  const sections = expandSections(md);
  const numericId = Number((path.basename(notePath).match(/\d+/) || ['0'])[0]);
  const id = `EP-${numericId}`;
  const problemFallback = remoteStatements.get(id) || '';

  let problem = '';
  const literature = [];
  const computation = [];
  const attempt = [];

  for (const section of sections) {
    const title = section.title;
    const content = trimBlock(section.content);
    if (/^batch split integrations \(from head\)$/i.test(title)) {
      for (const batch of extractBatchSections(content)) {
        const kind = classifyBatchTitle(batch.title);
        if (kind === 'literature') literature.push(renderSection('literature', batch.title, batch.content));
        if (kind === 'computation') computation.push(renderSection('computation', batch.title, batch.content));
      }
      continue;
    }

    if (!content || isWrapperTitle(title) || isIgnoredTopLevelTitle(title)) continue;

    if (!problem && isProblemTitle(title)) {
      problem = cleanContent(content);
      continue;
    }

    if (isLiteratureTitle(title)) {
      literature.push(renderSection('literature', title, content));
      continue;
    }

    if (isProofTitle(title)) {
      attempt.push(renderSection('attempt', title, content));
      continue;
    }

    if (isComputationTitle(title)) {
      computation.push(renderSection('computation', title, content));
      continue;
    }

    if (isRouteLikeTitle(title)) {
      if (hasComputationMarkers(content)) {
        computation.push(renderSection('computation', title, content));
      } else {
        attempt.push(renderSection('attempt', title, content));
      }
      continue;
    }

    if (hasComputationMarkers(content)) {
      computation.push(renderSection('computation', title, content));
      continue;
    }

    attempt.push(renderSection('attempt', title, content));
  }

  return {
    id,
    problem: trimBlock(problem || cleanContent(problemFallback)),
    literature: trimBlock(literature.filter(Boolean).join('\n\n')),
    computation: trimBlock(computation.filter(Boolean).join('\n\n')),
    attempt: trimBlock(attempt.filter(Boolean).join('\n\n')),
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

  const stats = {
    problem: entries.filter((x) => !x.problem).length,
    literature: entries.filter((x) => !x.literature).length,
    computation: entries.filter((x) => !x.computation).length,
    attempt: entries.filter((x) => !x.attempt).length,
  };

  console.log(
    `Wrote ${OUT_PATH} (${entries.length} entries; blanks: problem=${stats.problem}, literature=${stats.literature}, computation=${stats.computation}, attempt=${stats.attempt})`,
  );
}

main();
