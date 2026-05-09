#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const NOTES_DIR = path.join(ROOT, 'notes');
const OUT_JSON = path.join(ROOT, 'erdos-notes.json');
const SOURCE_DIR = path.join(ROOT, 'external', 'erdosproblems');
const CACHE_DIR = path.join(SOURCE_DIR, 'cache');
const SOURCE_JSON = path.join(SOURCE_DIR, 'source-snapshot.json');
const UPSTREAM_YAML = '/private/tmp/erdosproblems-upstream/data/problems.yaml';
const BASE = 'https://www.erdosproblems.com';

const args = new Set(process.argv.slice(2));
const SHOULD_FETCH = args.has('--fetch') || args.has('--refresh');
const SHOULD_WRITE = args.has('--write') || args.has('--refresh');
const LIMIT = Number(process.env.LIMIT || 0);
const FETCH_DELAY_MS = Number(process.env.FETCH_DELAY_MS || 120);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function sleep(ms) {
  if (!ms) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function decodeEntities(text) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    ndash: '-',
    mdash: '-',
    hellip: '...',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    times: 'x',
    le: '<=',
    ge: '>=',
    infty: '\\infty',
  };
  return String(text || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (m, n) => (named[n] != null ? named[n] : m));
}

function cleanSpaces(text) {
  return decodeEntities(text)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function htmlToText(html) {
  if (!html) return '';
  let text = String(html);
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<h[1-6][^>]*>/gi, '\n### ');
  text = text.replace(/<\/h[1-6]>/gi, '\n');
  text = text.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
    const cleanLabel = htmlToText(label);
    if (/^https?:\/\//i.test(href)) return `${cleanLabel} (${href})`;
    return cleanLabel;
  });
  text = text.replace(/<[^>]+>/g, '');
  return cleanSpaces(text);
}

function attrValue(tag, attr) {
  const re = new RegExp(`${attr}=["']([^"']*)["']`, 'i');
  return decodeEntities(tag.match(re)?.[1] || '');
}

function extractFirst(html, re) {
  return html.match(re)?.[1] || '';
}

function extractDivById(html, id) {
  const idx = html.search(new RegExp(`<div\\b[^>]*id=["']${id}["'][^>]*>`, 'i'));
  if (idx < 0) return '';
  const openEnd = html.indexOf('>', idx);
  let pos = openEnd + 1;
  let depth = 1;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = pos;
  let match;
  while ((match = tagRe.exec(html))) {
    if (match[0].startsWith('</')) depth -= 1;
    else depth += 1;
    if (depth === 0) return html.slice(pos, match.index);
  }
  return '';
}

function extractAllAdditionalText(html) {
  const blocks = [];
  const startRe = /<div\b[^>]*class=["'][^"']*\bproblem-additional-text\b[^"']*["'][^>]*>/gi;
  let match;
  while ((match = startRe.exec(html))) {
    const start = match.index;
    const openEnd = html.indexOf('>', start);
    let pos = openEnd + 1;
    let depth = 1;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = pos;
    let tag;
    while ((tag = tagRe.exec(html))) {
      if (tag[0].startsWith('</')) depth -= 1;
      else depth += 1;
      if (depth === 0) {
        blocks.push(html.slice(pos, tag.index));
        startRe.lastIndex = tagRe.lastIndex;
        break;
      }
    }
  }
  return blocks;
}

function parseArrayLiteral(text, key) {
  const raw = text.match(new RegExp(`^\\s*${key}:\\s*\\[([^\\]]*)\\]`, 'm'))?.[1] || '';
  if (!raw.trim()) return [];
  return raw
    .split(',')
    .map((x) => x.replace(/["']/g, '').trim())
    .filter(Boolean);
}

function parseUpstreamYaml() {
  if (!fs.existsSync(UPSTREAM_YAML)) return new Map();
  const text = fs.readFileSync(UPSTREAM_YAML, 'utf8');
  const chunks = text.split(/\n(?=- number:)/g);
  const byId = new Map();

  for (const chunk of chunks) {
    const num = chunk.match(/^- number:\s*"([^"]+)"/m)?.[1];
    if (!num || !/^\d+$/.test(num)) continue;
    const statusBlock = chunk.match(/status:\n([\s\S]*?)(?=\n\s*(?:oeis|formalized|comments|tags|prize|-\s+number):|\n*$)/)?.[1] || '';
    const formalizedBlock = chunk.match(/formalized:\n([\s\S]*?)(?=\n\s*(?:oeis|status|comments|tags|prize|-\s+number):|\n*$)/)?.[1] || '';
    byId.set(Number(num), {
      prize: chunk.match(/^\s*prize:\s*"([^"]*)"/m)?.[1] || '',
      status: {
        state: statusBlock.match(/state:\s*"([^"]*)"/)?.[1] || '',
        last_update: statusBlock.match(/last_update:\s*"([^"]*)"/)?.[1] || '',
        note: statusBlock.match(/note:\s*"([^"]*)"/)?.[1] || '',
      },
      formalized: {
        state: formalizedBlock.match(/state:\s*"([^"]*)"/)?.[1] || '',
        last_update: formalizedBlock.match(/last_update:\s*"([^"]*)"/)?.[1] || '',
        note: formalizedBlock.match(/note:\s*"([^"]*)"/)?.[1] || '',
      },
      oeis: parseArrayLiteral(chunk, 'oeis'),
      tags: parseArrayLiteral(chunk, 'tags'),
      comments: chunk.match(/^\s*comments:\s*"([^"]*)"/m)?.[1] || '',
    });
  }

  return byId;
}

function collectTargetIds() {
  const ids = new Set();
  const existing = readJsonIfExists(OUT_JSON, []);
  if (Array.isArray(existing)) {
    for (const entry of existing) {
      const id = Number(String(entry.id || '').match(/\d+/)?.[0] || 0);
      if (id) ids.add(id);
    }
  }
  for (const dir of ['data', 'notes']) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full)) {
      const match = file.match(/^ep(\d+)\.(?:json|md)$/i);
      if (match) ids.add(Number(match[1]));
    }
  }
  return [...ids].sort((a, b) => a - b).slice(0, LIMIT || undefined);
}

function cachePath(kind, id) {
  return path.join(CACHE_DIR, kind, `ep${id}.html`);
}

function fetchUrl(url) {
  return execFileSync('curl', ['-L', '-sS', '--retry', '2', '--connect-timeout', '20', url], {
    encoding: 'utf8',
    maxBuffer: 40 * 1024 * 1024,
  });
}

function fetchOne(kind, id, url) {
  const out = cachePath(kind, id);
  if (!SHOULD_FETCH && fs.existsSync(out)) return;
  ensureDir(path.dirname(out));
  const html = fetchUrl(url);
  if (!/<html/i.test(html)) throw new Error(`Fetch for ${url} did not look like HTML`);
  fs.writeFileSync(out, html, 'utf8');
  sleep(FETCH_DELAY_MS);
}

function fetchAll(ids) {
  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    if ((i + 1) % 25 === 0 || i === 0) {
      console.log(`Fetching ${i + 1}/${ids.length}: EP-${id}`);
    }
    fetchOne('problem', id, `${BASE}/${id}`);
    fetchOne('latex', id, `${BASE}/latex/${id}`);
    fetchOne('forum', id, `${BASE}/forum/discuss/${id}`);
  }
}

function activeProblemStatus(html, pageStatus) {
  const widget = html.match(/<div\s+class=["']problem-status-widget["'][\s\S]*?>/i)?.[0] || '';
  if (!widget) {
    return {
      status: 'not_shown',
      label: 'Not shown',
      description: pageStatus
        ? `The comment-activity widget is not shown on this ${pageStatus} page.`
        : 'The comment-activity widget was not present in the fetched page.',
    };
  }
  const current = attrValue(widget, 'data-current-status') || 'unknown';
  const options = [...html.matchAll(/<button\b[^>]*class=["'][^"']*\bproblem-status-option\b[^"']*is-active[^"']*["'][\s\S]*?>/gi)];
  const activeTag = options[0]?.[0] || '';
  return {
    status: attrValue(activeTag, 'data-status') || current,
    label: attrValue(activeTag, 'data-label') || '',
    description: attrValue(activeTag, 'data-description') || '',
  };
}

function parseProblemPage(id, html, upstream) {
  const prizeHtml = extractDivById(html, 'prize');
  const status =
    htmlToText(prizeHtml.match(/<span\b[^>]*class=["']tooltip["'][^>]*>\s*([^<\n]+)/i)?.[1] || '')
      .toLowerCase() || upstream?.status?.state || '';
  const prize = upstream?.prize || htmlToText(prizeHtml.replace(/<span\b[\s\S]*?<\/span>/gi, '')).replace(/^[-\s]+/, '').trim();
  const statement = htmlToText(extractDivById(html, 'content'));
  const problemIdText = htmlToText(extractDivById(html, 'problem_id'));
  const referenceKeys = [...problemIdText.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
  const tagHtml = extractDivById(html, 'tags');
  const tags = [...tagHtml.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => htmlToText(m[1])).filter(Boolean);
  const commentCount = Number(html.match(/>\s*(\d+)\s+comments? on this problem\s*</i)?.[1] || 0);
  const pageLastEdited = htmlToText(html.match(/This page was last edited\s*([^.<]+(?:\d{4})?)/i)?.[1] || '');
  const citationAccessed = htmlToText(html.match(/accessed\s+(\d{4}-\d{2}-\d{2})/i)?.[1] || '');
  const additionalBlocks = extractAllAdditionalText(html);
  const remarksBlock = additionalBlocks.find((block) => /View the LaTeX source/i.test(block)) || '';
  const remarks = htmlToText(remarksBlock.replace(/<p[\s\S]*?View the LaTeX source[\s\S]*$/i, ''));

  return {
    id: `EP-${id}`,
    source_url: `${BASE}/${id}`,
    forum_url: `${BASE}/forum/discuss/${id}`,
    latex_url: `${BASE}/latex/${id}`,
    page_status: status || upstream?.status?.state || '',
    prize: prize || upstream?.prize || '',
    status_last_update: upstream?.status?.last_update || '',
    page_last_edited: pageLastEdited,
    accessed: citationAccessed,
    statement,
    reference_keys: referenceKeys,
    tags: tags.length ? tags : upstream?.tags || [],
    oeis: upstream?.oeis || [],
    formalized: upstream?.formalized || {},
    comment_count: commentCount,
    comment_activity: activeProblemStatus(html, status || upstream?.status?.state || ''),
    remarks,
  };
}

function parseLatexPage(html) {
  const content = htmlToText(extractDivById(html, 'content'));
  const blocks = extractAllAdditionalText(html).map(htmlToText).filter(Boolean);
  const remarks = blocks.find((block) => !/^### References\b/.test(block) && !/Back to the problem/.test(block)) || '';
  const refs = blocks.find((block) => /^### References\b/.test(block)) || '';
  return {
    statement_latex: content,
    remarks_latex: remarks,
    references_latex: refs.replace(/^### References\s*/, '').trim(),
  };
}

function parseForumPage(html) {
  const posts = [];
  const starts = [...html.matchAll(/<li\b[^>]*id=["']post-(\d+)["'][^>]*class=["']([^"']*)["'][^>]*>/gi)].map((m) => ({
    index: m.index,
    postId: Number(m[1]),
    className: m[2],
  }));

  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i];
    const end = starts[i + 1]?.index ?? html.indexOf('</ul>', start.index);
    const block = html.slice(start.index, end > start.index ? end : undefined);
    const depth = Number(start.className.match(/\bdepth-(\d+)\b/)?.[1] || 0);
    const bodyHtml =
      block.match(/<div\b[^>]*class=["']post-body["'][^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class=["']post-meta/i)?.[1] ||
      block.match(/<div\b[^>]*class=["']post-body["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ||
      '';
    const body = htmlToText(bodyHtml);
    const author = htmlToText(block.match(/<strong>\s*<a\b[^>]*>([\s\S]*?)<\/a>\s*<\/strong>/i)?.[1] || '');
    const date = htmlToText(block.match(/<a\b[^>]*href=["'][^"']*#post-\d+["'][^>]*>([^<]+)<\/a>/i)?.[1] || '');
    const reactions = {};
    for (const r of block.matchAll(/data-type=["']([^"']+)["'][\s\S]*?<span\b[^>]*class=["']reaction-count["'][^>]*>\s*(\d+)\s*<\/span>/gi)) {
      reactions[r[1]] = Number(r[2]);
    }
    if (body || author || date) {
      posts.push({
        post_id: start.postId,
        depth,
        author,
        date,
        text: body,
        reactions,
      });
    }
  }

  return posts;
}

function firstSentence(text, maxLen = 280) {
  const compact = cleanSpaces(text).replace(/\n+/g, ' ');
  if (!compact) return '';
  const match = compact.match(/^(.{40,}?[.!?])\s/);
  const sent = match ? match[1] : compact;
  return sent.length > maxLen ? `${sent.slice(0, maxLen - 1).trim()}...` : sent;
}

function summarizeForum(entry) {
  const activity = entry.comment_activity || {};
  const comments = entry.forum_comments || [];
  if (!comments.length) {
    return `No forum comments were present in the fetched discussion thread. The site comment-activity widget says: ${activity.label || activity.status || 'unknown'}.`;
  }

  if (activity.status === 'open') {
    return `The site comment-activity widget records no claimed partial or complete solution. The ${comments.length} forum comment(s) are ordinary discussion, corrections, references, or clarification.`;
  }

  if (activity.status === 'not_shown') {
    return `The site did not show the open-problem comment-activity widget for this page. The fetched thread has ${comments.length} comment(s); consult the comment list below for discussion attached to the already classified page.`;
  }

  const candidates = comments.filter((comment) =>
    /proof|prove|solution|solve|counterexample|claim|partial|lemma|theorem|construction|bound|argument|follows|therefore|hence|shows|implies/i.test(comment.text),
  );
  const selected = (candidates.length ? candidates : comments).slice(0, 4);
  const snippets = selected
    .map((comment) => `${comment.author || 'anonymous'} (${comment.date || `post ${comment.post_id}`}): ${firstSentence(comment.text)}`)
    .filter(Boolean)
    .join(' ');
  return `The site comment-activity widget marks this discussion as ${activity.label || activity.status}. Brief argument summary from relevant comments: ${snippets}`;
}

function loadSiteEntry(id, upstreamById) {
  const problemPath = cachePath('problem', id);
  const latexPath = cachePath('latex', id);
  const forumPath = cachePath('forum', id);
  if (!fs.existsSync(problemPath)) throw new Error(`Missing cache: ${problemPath}`);
  if (!fs.existsSync(latexPath)) throw new Error(`Missing cache: ${latexPath}`);
  if (!fs.existsSync(forumPath)) throw new Error(`Missing cache: ${forumPath}`);

  const problem = parseProblemPage(id, fs.readFileSync(problemPath, 'utf8'), upstreamById.get(id));
  const latex = parseLatexPage(fs.readFileSync(latexPath, 'utf8'));
  const forumComments = parseForumPage(fs.readFileSync(forumPath, 'utf8'));
  const entry = {
    ...problem,
    statement: latex.statement_latex || problem.statement,
    remarks: latex.remarks_latex || problem.remarks,
    references: latex.references_latex,
    forum_comments: forumComments,
  };
  entry.forum_summary = summarizeForum(entry);
  return entry;
}

function previousEntryMap() {
  const entries = readJsonIfExists(OUT_JSON, []);
  const byId = new Map();
  if (Array.isArray(entries)) {
    for (const entry of entries) byId.set(entry.id, entry);
  }
  return byId;
}

function section(md, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return md.match(new RegExp(`^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|\\s*$)`, 'm'))?.[1]?.trim() || '';
}

function localNoteExtras(id, previousById) {
  const key = `EP-${id}`;
  const previous = previousById.get(key) || {};
  let computation = cleanSpaces(previous.computation || '');
  let attempt = cleanSpaces(previous.attempt || '');
  const notePath = path.join(NOTES_DIR, `ep${id}.md`);
  if (fs.existsSync(notePath)) {
    const md = fs.readFileSync(notePath, 'utf8');
    computation ||= section(md, 'Local Computation') || section(md, 'Computation-Guided Observations') || section(md, 'Our Approaches / What Is Proven');
    attempt ||= section(md, 'Local Proof Attempts') || section(md, 'Added Proof-Strategy Layer (No New Computation)') || section(md, 'Deeper Proof Program (A => B => C)');
  }
  return {
    computation: computation || 'No local computation recorded yet.',
    attempt: attempt || 'No local proof attempt recorded yet.',
  };
}

function mdEscapeLine(text) {
  return String(text || '').replace(/\r?\n/g, ' ').trim();
}

function referencesAsBullets(text) {
  const refs = cleanSpaces(text);
  if (!refs) return 'No references listed on the fetched LaTeX page.';
  const normalized = refs.replace(/\n\s*\n/g, '\n');
  const parts = normalized.split(/\n\s*(?=\[[^\]]+\]\s)/g).map((x) => x.trim()).filter(Boolean);
  return parts.map((x) => `- ${x.replace(/\n+/g, ' ')}`).join('\n');
}

function renderComments(comments) {
  if (!comments.length) return 'No forum comments in fetched thread.';
  return comments
    .map((comment) => {
      const prefix = `- ${comment.date || `post ${comment.post_id}`} - ${comment.author || 'anonymous'}${comment.depth ? ` (reply depth ${comment.depth})` : ''}:`;
      const text = comment.text
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n');
      return `${prefix}\n${text}`;
    })
    .join('\n\n');
}

function renderNote(id, site, local) {
  const statusLines = [
    `- Source: ${site.source_url}`,
    `- Forum: ${site.forum_url}`,
    `- LaTeX source: ${site.latex_url}`,
    site.accessed ? `- Accessed: ${site.accessed}` : '',
    `- Page status: ${(site.page_status || 'unknown').toUpperCase()}${site.prize ? ` (${site.prize})` : ''}`,
    site.status_last_update ? `- Database status last update: ${site.status_last_update}` : '',
    site.page_last_edited ? `- Page last edited: ${site.page_last_edited}` : '',
    site.tags?.length ? `- Tags: ${site.tags.join(', ')}` : '',
    site.oeis?.length ? `- OEIS: ${site.oeis.join(', ')}` : '',
    site.formalized?.state ? `- Formalized statement: ${site.formalized.state}${site.formalized.last_update ? ` (last update ${site.formalized.last_update})` : ''}` : '',
    `- Forum comment activity: ${site.comment_activity?.label || site.comment_activity?.status || 'unknown'} - ${site.comment_activity?.description || 'No description available.'}`,
  ].filter(Boolean);

  return `# EP-${id}

## Problem Statement
${site.statement || 'No statement parsed from source.'}

## Source Status
${statusLines.join('\n')}

## Site Remarks
${site.remarks || 'No site remarks parsed from source.'}

## Site References
${referencesAsBullets(site.references)}

## Forum Discussion
${site.forum_summary}

## Forum Comments
${renderComments(site.forum_comments || [])}

## Local Computation
${local.computation}

## Local Proof Attempts
${local.attempt}
`;
}

function erdosNotesEntry(id, site, local) {
  const literatureParts = [
    `- Source: ${site.source_url}.`,
    `- Page status: ${(site.page_status || 'unknown').toUpperCase()}${site.status_last_update ? ` (database last update ${site.status_last_update})` : ''}.`,
    site.page_last_edited ? `- Page last edited: ${site.page_last_edited}.` : '',
    '',
    'Site remarks:',
    site.remarks || 'No site remarks parsed from source.',
    '',
    'References:',
    referencesAsBullets(site.references),
  ].filter((x) => x !== '');

  return {
    id: `EP-${id}`,
    status: site.page_status || '',
    status_last_update: site.status_last_update || '',
    source_url: site.source_url,
    forum_url: site.forum_url,
    latex_url: site.latex_url,
    accessed: site.accessed || '',
    tags: site.tags || [],
    oeis: site.oeis || [],
    formalized: site.formalized || {},
    comment_activity: site.comment_activity || {},
    problem: site.statement || '',
    literature: literatureParts.join('\n'),
    forum: site.forum_summary || '',
    forum_comments: site.forum_comments || [],
    computation: local.computation,
    attempt: local.attempt,
  };
}

function writeOutputs(ids, sourceEntries) {
  ensureDir(NOTES_DIR);
  const previousById = previousEntryMap();
  const entries = [];

  for (const id of ids) {
    const site = sourceEntries.find((entry) => entry.id === `EP-${id}`);
    if (!site) throw new Error(`Missing parsed source entry for EP-${id}`);
    const local = localNoteExtras(id, previousById);
    fs.writeFileSync(path.join(NOTES_DIR, `ep${id}.md`), renderNote(id, site, local), 'utf8');
    entries.push(erdosNotesEntry(id, site, local));
  }

  writeJson(OUT_JSON, entries);
}

function main() {
  const ids = collectTargetIds();
  ensureDir(SOURCE_DIR);
  ensureDir(CACHE_DIR);
  console.log(`Target problems: ${ids.length}`);

  if (SHOULD_FETCH) fetchAll(ids);

  const upstreamById = parseUpstreamYaml();
  const sourceEntries = ids.map((id) => loadSiteEntry(id, upstreamById));
  writeJson(SOURCE_JSON, {
    generated_utc: new Date().toISOString(),
    source: BASE,
    count: sourceEntries.length,
    problems: sourceEntries,
  });
  console.log(`Wrote ${SOURCE_JSON} (${sourceEntries.length} problems)`);

  if (SHOULD_WRITE) {
    writeOutputs(ids, sourceEntries);
    console.log(`Wrote ${OUT_JSON} and ${ids.length} note files`);
  }

  const claimStats = sourceEntries.reduce((acc, entry) => {
    const s = entry.comment_activity?.status || 'unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  console.log(`Forum activity states: ${JSON.stringify(claimStats)}`);
}

main();
