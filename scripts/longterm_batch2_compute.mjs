#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Batch 2 lightweight probes: only where existing scripts/data make sense.
// This is intentionally conservative to run overnight without heavy exact blowups.

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function pickLastRow(d) {
  if (Array.isArray(d.rows) && d.rows.length > 0) return d.rows[d.rows.length - 1];
  if (Array.isArray(d.checkpoints) && d.checkpoints.length > 0) return d.checkpoints[d.checkpoints.length - 1];
  return null;
}

// EP-279: summarize existing residue cover scan.
if (fs.existsSync('data/ep279_residue_cover_greedy_scan.json')) {
  const d = loadJSON('data/ep279_residue_cover_greedy_scan.json');
  out.results.ep279 = {
    best_restart: d.best_restart || null,
    last_row: pickLastRow(d),
  };
}

// EP-288: summarize interval singleton scan.
if (fs.existsSync('data/ep288_interval_singleton_scan.json')) {
  const d = loadJSON('data/ep288_interval_singleton_scan.json');
  out.results.ep288 = {
    total_solutions_count: d.total_solutions_count ?? null,
    disjoint_singleton_solutions_count: d.disjoint_singleton_solutions_count ?? null,
    max_interval_length_in_solutions: d.max_interval_length_in_solutions ?? null,
    last_row: pickLastRow(d),
  };
}

// EP-313: summarize primary pseudoperfect scan.
if (fs.existsSync('data/ep313_primary_pseudoperfect_scan.json')) {
  const d = loadJSON('data/ep313_primary_pseudoperfect_scan.json');
  out.results.ep313 = {
    hits_count: d.hits_count ?? null,
    largest_hit: Array.isArray(d.hits) && d.hits.length > 0 ? d.hits[d.hits.length - 1] : null,
    last_row: pickLastRow(d),
  };
}

// EP-317: summarize signed harmonic min.
if (fs.existsSync('data/ep317_signed_harmonic_min_exact.json')) {
  const d = loadJSON('data/ep317_signed_harmonic_min_exact.json');
  out.results.ep317 = {
    last_row: d.rows ? d.rows[d.rows.length - 1] : null,
  };
}

// EP-323: summarize power sum count scan.
if (fs.existsSync('data/ep323_power_sum_count_scan.json')) {
  const d = loadJSON('data/ep323_power_sum_count_scan.json');
  out.results.ep323 = {
    params: d.params || null,
    last_row: pickLastRow(d),
  };
}

// EP-330: summarize finite minimal basis searches.
if (fs.existsSync('data/ep330_finite_minimal_basis_search.json')) {
  const d = loadJSON('data/ep330_finite_minimal_basis_search.json');
  out.results.ep330 = {
    best: d.best || null,
    last_row: pickLastRow(d),
  };
}

// EP-386: summarize binomial consecutive primes scans.
if (fs.existsSync('data/ep386_binomial_consecutive_primes_scan.json')) {
  const d = loadJSON('data/ep386_binomial_consecutive_primes_scan.json');
  out.results.ep386 = {
    total_hits: d.total_hits ?? null,
    per_k: d.per_k || null,
    last_row: pickLastRow(d),
  };
}

// EP-681: summarize composite LPF scans.
if (fs.existsSync('data/ep681_composite_lpf_k2_scan.json')) {
  const d = loadJSON('data/ep681_composite_lpf_k2_scan.json');
  out.results.ep681 = {
    n_max: d.n_max ?? null,
    total_bad: d.total_bad ?? null,
    last_row: pickLastRow(d),
  };
}

// EP-854: summarize constructive witness profile.
if (fs.existsSync('data/ep854_constructive_lower_bound_profile.json')) {
  const d = loadJSON('data/ep854_constructive_lower_bound_profile.json');
  out.results.ep854 = {
    params: d.params || null,
    last_row: pickLastRow(d),
  };
}

const outPath = path.join('data', 'longterm_batch2_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
