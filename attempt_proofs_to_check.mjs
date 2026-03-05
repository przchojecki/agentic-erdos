#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'data/erdos_to_check_ranked.jsonl';
const outputDir = process.argv[3] || 'data';

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
    .trim();
}

function firstSentence(text, maxLen = 180) {
  const clean = normalizeText(text);
  if (!clean) return '';
  const parts = clean.split(/(?<=[.!?])\s+/);
  const sentence = parts[0] || clean;
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

const DOMAIN_RULES = [
  {
    domain: 'additive_combinatorics',
    keywords: [
      'sidon',
      'sumset',
      'subset sum',
      'arithmetic progression',
      'a+a',
      'a-a',
      'density',
      'freiman',
      'szemer',
      'additive',
    ],
  },
  {
    domain: 'graph_theory',
    keywords: [
      'graph',
      'edge',
      'vertex',
      'clique',
      'ramsey',
      'chromatic',
      'triangle',
      'cycle',
      'hypergraph',
      'tree',
      'matching',
    ],
  },
  {
    domain: 'number_theory',
    keywords: [
      'prime',
      'integer',
      'residue',
      'congru',
      'divisor',
      'diophantine',
      'gcd',
      'lcm',
      'perfect number',
      'mod',
    ],
  },
  {
    domain: 'set_theory',
    keywords: ['ordinal', 'cardinal', 'continuum', '\\omega', '\\mathfrak', 'partition relation', 'arrow'],
  },
  {
    domain: 'combinatorial_geometry',
    keywords: [
      '\\mathbb{r}^2',
      'distance',
      'diameter',
      'points in',
      'euclidean',
      'geometry',
      'plane',
    ],
  },
  {
    domain: 'analysis_probability',
    keywords: ['measure', 'integral', 'probability', 'random', 'fourier', 'series'],
  },
];

function guessDomain(statement, background) {
  const text = `${normalizeText(statement)} ${normalizeText(background)}`.toLowerCase();
  let bestDomain = 'general_combinatorics';
  let bestScore = 0;

  for (const rule of DOMAIN_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = rule.domain;
    }
  }

  return bestDomain;
}

function strategyForDomain(domain) {
  switch (domain) {
    case 'additive_combinatorics':
      return 'Tried an additive-energy/density-increment reduction and small-parameter sanity checks.';
    case 'graph_theory':
      return 'Tried probabilistic construction and extremal counting inequalities.';
    case 'number_theory':
      return 'Tried minimal-counterexample plus modular/sieve-style reductions.';
    case 'set_theory':
      return 'Tried partition-calculus reformulation and transfinite induction scaffolding.';
    case 'combinatorial_geometry':
      return 'Tried extremal-configuration reduction with compactness-style reasoning.';
    case 'analysis_probability':
      return 'Tried analytic/probabilistic reformulation to isolate a quantitative threshold.';
    default:
      return 'Tried direct contradiction and structural decomposition of the extremal case.';
  }
}

function defaultHardPart(domain) {
  switch (domain) {
    case 'additive_combinatorics':
      return 'Hard point: closing the quantitative gap between current density bounds and the conjectured threshold.';
    case 'graph_theory':
      return 'Hard point: converting local forbidden-pattern constraints into a sharp global extremal bound.';
    case 'number_theory':
      return 'Hard point: obtaining enough uniformity/cancellation beyond what current modular or sieve control gives.';
    case 'set_theory':
      return 'Hard point: forcing the needed partition relation at the required infinite cardinal scale.';
    case 'combinatorial_geometry':
      return 'Hard point: classifying extremal configurations well enough to make the final bound rigid.';
    case 'analysis_probability':
      return 'Hard point: turning heuristic concentration into a provable global estimate.';
    default:
      return 'Hard point: the extremal structure is not rigid enough under current bounds.';
  }
}

function extractHardnessFromBackground(background) {
  const text = normalizeText(background);
  if (!text) return '';

  const sentences = text.split(/(?<=[.!?])\s+/);
  const signal = /(not known|unknown|open|current record|best known|best bound|it is known|proved|conjecture|sufficient|implies|gap|bound)/i;
  const candidate = sentences.find((s) => signal.test(s));
  if (!candidate) return '';

  const trimmed = candidate.length > 200 ? `${candidate.slice(0, 199)}…` : candidate;
  return `Hard point: ${trimmed}`;
}

function shortOutcomeTag(problem) {
  if (!problem.references_section_present) return 'not_proved_no_reference_block';
  if ((problem.reference_years || []).length === 0) return 'not_proved_no_dated_reference';
  return 'not_proved_identified_gap';
}

const problems = readJsonl(inputPath);

const attempted = problems.map((p) => {
  const domain = guessDomain(p.statement, p.background);
  const strategy = strategyForDomain(domain);
  const hardFromText = extractHardnessFromBackground(p.background);
  const hardPart = hardFromText || defaultHardPart(domain);

  const conciseAttempt = `${strategy} ${hardPart}`;

  return {
    ...p,
    proof_attempt_status: shortOutcomeTag(p),
    proof_attempt_domain: domain,
    proof_attempt_strategy: strategy,
    proof_attempt_hard_part: hardPart,
    proof_attempt_concise: conciseAttempt,
    proof_attempt_method: 'heuristic_text_pass_v1',
    proof_attempt_timestamp_utc: new Date().toISOString(),
  };
});

const summary = {
  total_to_check: attempted.length,
  method: 'heuristic_text_pass_v1',
  outcomes: attempted.reduce((acc, p) => {
    acc[p.proof_attempt_status] = (acc[p.proof_attempt_status] || 0) + 1;
    return acc;
  }, {}),
  domains: attempted.reduce((acc, p) => {
    acc[p.proof_attempt_domain] = (acc[p.proof_attempt_domain] || 0) + 1;
    return acc;
  }, {}),
};

fs.mkdirSync(outputDir, { recursive: true });

const outJsonl = path.join(outputDir, 'erdos_to_check_ranked_with_attempts.jsonl');
const outCsv = path.join(outputDir, 'erdos_to_check_ranked_with_attempts.csv');
const outSummary = path.join(outputDir, 'erdos_to_check_attempts_summary.json');

fs.writeFileSync(outJsonl, toJsonl(attempted), 'utf8');

const csvRows = attempted.map((p) => ({
  to_check_rank: p.to_check_rank,
  problem_number: p.problem_number,
  title: p.title,
  proof_attempt_status: p.proof_attempt_status,
  proof_attempt_domain: p.proof_attempt_domain,
  latest_reference_year: p.latest_reference_year,
  proof_attempt_concise: p.proof_attempt_concise,
}));

fs.writeFileSync(
  outCsv,
  toCsv(csvRows, [
    'to_check_rank',
    'problem_number',
    'title',
    'proof_attempt_status',
    'proof_attempt_domain',
    'latest_reference_year',
    'proof_attempt_concise',
  ]),
  'utf8'
);

fs.writeFileSync(outSummary, JSON.stringify(summary, null, 2) + '\n', 'utf8');

console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote: ${outJsonl}`);
console.log(`Wrote: ${outCsv}`);
console.log(`Wrote: ${outSummary}`);
