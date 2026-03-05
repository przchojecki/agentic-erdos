#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'data/erdos_problems_compact.jsonl';
const outputDir = process.argv[3] || 'data';

const thresholdYear = 2000;
const yearRegex = /\b(1[5-9]\d{2}|20\d{2}|2100)\b/g;

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

function uniqueSortedYears(text) {
  const matches = text.match(yearRegex) || [];
  const years = [...new Set(matches.map((y) => Number(y)))];
  years.sort((a, b) => a - b);
  return years;
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

function problemNumberOrder(problemNumber) {
  const match = String(problemNumber || '').match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function rankToCheck(problems) {
  const ranked = [...problems].sort((a, b) => {
    const aNoReferenceYears = a.reference_years.length === 0 ? 0 : 1;
    const bNoReferenceYears = b.reference_years.length === 0 ? 0 : 1;
    if (aNoReferenceYears !== bNoReferenceYears) {
      return aNoReferenceYears - bNoReferenceYears;
    }

    const aLatest = a.latest_reference_year ?? Number.POSITIVE_INFINITY;
    const bLatest = b.latest_reference_year ?? Number.POSITIVE_INFINITY;
    if (aLatest !== bLatest) {
      return aLatest - bLatest;
    }

    if (a.reference_years.length !== b.reference_years.length) {
      return a.reference_years.length - b.reference_years.length;
    }

    const aProblemNum = problemNumberOrder(a.problem_number);
    const bProblemNum = problemNumberOrder(b.problem_number);
    if (aProblemNum !== bProblemNum) {
      return aProblemNum - bProblemNum;
    }

    return String(a.problem_number).localeCompare(String(b.problem_number));
  });

  return ranked.map((p, idx) => ({
    ...p,
    to_check_rank: idx + 1,
    ease_bucket: p.reference_years.length === 0 ? 'no-reference-years' : 'old-reference-years',
  }));
}

const problems = readJsonl(inputPath);

const triaged = problems.map((p) => {
  const background = typeof p.background === 'string' ? p.background : '';
  const refMatch = background.match(/\bReferences\b/i);
  const referencesSectionPresent = Boolean(refMatch);
  const referenceText = referencesSectionPresent
    ? background.slice(refMatch.index)
    : '';

  const referenceYears = uniqueSortedYears(referenceText);
  const latestReferenceYear =
    referenceYears.length > 0 ? referenceYears[referenceYears.length - 1] : null;
  const hasPostThresholdReference = referenceYears.some((y) => y > thresholdYear);
  const classification = hasPostThresholdReference ? 'harder' : 'to-check';

  return {
    ...p,
    reference_years: referenceYears,
    latest_reference_year: latestReferenceYear,
    references_section_present: referencesSectionPresent,
    classification,
  };
});

const toCheck = triaged.filter((p) => p.classification === 'to-check');
const harder = triaged.filter((p) => p.classification === 'harder');
const noReferenceYears = triaged.filter((p) => p.reference_years.length === 0);
const toCheckRanked = rankToCheck(toCheck);
const toCheckNoReferenceYearsCount = toCheck.filter((p) => p.reference_years.length === 0).length;

const summary = {
  total_problems: triaged.length,
  threshold_rule: `Any reference year > ${thresholdYear} => harder; otherwise => to-check`,
  to_check_ranking_rule:
    'No reference years first, then oldest latest_reference_year, then fewer reference years, then problem number',
  references_section_present: triaged.filter((p) => p.references_section_present).length,
  references_section_missing: triaged.filter((p) => !p.references_section_present).length,
  no_reference_years_detected: noReferenceYears.length,
  harder_count: harder.length,
  to_check_count: toCheck.length,
  to_check_no_reference_years_count: toCheckNoReferenceYearsCount,
  to_check_with_reference_years_count: toCheck.length - toCheckNoReferenceYearsCount,
};

fs.mkdirSync(outputDir, { recursive: true });

const triagePath = path.join(outputDir, 'erdos_reference_triage.jsonl');
const toCheckPath = path.join(outputDir, 'erdos_to_check.jsonl');
const harderPath = path.join(outputDir, 'erdos_harder.jsonl');
const toCheckRankedPath = path.join(outputDir, 'erdos_to_check_ranked.jsonl');
const summaryPath = path.join(outputDir, 'erdos_reference_triage_summary.json');
const toCheckCsvPath = path.join(outputDir, 'erdos_to_check.csv');
const toCheckRankedCsvPath = path.join(outputDir, 'erdos_to_check_ranked.csv');

fs.writeFileSync(triagePath, toJsonl(triaged), 'utf8');
fs.writeFileSync(toCheckPath, toJsonl(toCheck), 'utf8');
fs.writeFileSync(harderPath, toJsonl(harder), 'utf8');
fs.writeFileSync(toCheckRankedPath, toJsonl(toCheckRanked), 'utf8');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');

const toCheckCsv = toCheck.map((p) => ({
  id: p.id,
  problem_number: p.problem_number,
  title: p.title,
  latest_reference_year: p.latest_reference_year,
  references_section_present: p.references_section_present,
  reference_years_count: p.reference_years.length,
}));

fs.writeFileSync(
  toCheckCsvPath,
  toCsv(toCheckCsv, [
    'id',
    'problem_number',
    'title',
    'latest_reference_year',
    'references_section_present',
    'reference_years_count',
  ]),
  'utf8'
);

const toCheckRankedCsv = toCheckRanked.map((p) => ({
  to_check_rank: p.to_check_rank,
  ease_bucket: p.ease_bucket,
  id: p.id,
  problem_number: p.problem_number,
  title: p.title,
  latest_reference_year: p.latest_reference_year,
  references_section_present: p.references_section_present,
  reference_years_count: p.reference_years.length,
}));

fs.writeFileSync(
  toCheckRankedCsvPath,
  toCsv(toCheckRankedCsv, [
    'to_check_rank',
    'ease_bucket',
    'id',
    'problem_number',
    'title',
    'latest_reference_year',
    'references_section_present',
    'reference_years_count',
  ]),
  'utf8'
);

console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote: ${triagePath}`);
console.log(`Wrote: ${toCheckPath}`);
console.log(`Wrote: ${harderPath}`);
console.log(`Wrote: ${toCheckRankedPath}`);
console.log(`Wrote: ${summaryPath}`);
console.log(`Wrote: ${toCheckCsvPath}`);
console.log(`Wrote: ${toCheckRankedCsvPath}`);
