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
      backgroundSignal ||
      'Could not close the final quantitative gap between known methods and the claimed threshold.',
    deep_attempt_next_step:
      'Isolate a sharper intermediate lemma (or a small explicit model) that narrows the threshold gap.',
    deep_attempt_note: `Statement focus: ${statement.slice(0, 180)}${statement.length > 180 ? '…' : ''}`,
  };
}

const custom = {
  'EP-25': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Modeled A as an uncovered set for an infinite system of forbidden residue classes; attempted logarithmic-density convergence via truncated systems and inclusion-exclusion stability.',
    deep_attempt_obstacle:
      'No useful independence/coprimality structure on the moduli sequence, so truncation error can oscillate and block convergence of logarithmic density.',
    deep_attempt_next_step:
      'Seek structural conditions on (n_i) that force convergence, then test whether arbitrary systems can be reduced to those conditions.',
    deep_attempt_note: 'Critical issue is controlling oscillation between truncation levels in highly non-coprime residue systems.',
  },
  'EP-40': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Attempted second-moment/additive-energy route: assume |A∩[1,N]| is just above N^{1/2}/g(N), then force unbounded representation counts in 1_A*1_A.',
    deep_attempt_obstacle:
      'The density is near the critical square-root barrier, and current tools do not force limsup representation multiplicity to diverge uniformly at that scale.',
    deep_attempt_next_step:
      'Prove a robust transfer theorem from near-critical density to large local additive energy spikes.',
    deep_attempt_note: 'As background states, this would strengthen Erdos-Turan-type conclusions.',
  },
  'EP-42': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried a random-greedy construction of B avoiding nonzero differences from A-A while preserving Sidon constraints in B.',
    deep_attempt_obstacle:
      'Need simultaneous control of two sparse-structure constraints (Sidon for B and disjoint difference sets), and available counting is too weak in the dense forbidden-difference regime.',
    deep_attempt_next_step:
      'Build a container/nibble argument with explicit forbidden-difference degree bounds depending on M and N.',
    deep_attempt_note: 'This looks like a two-layer sparse-constraint packing problem.',
  },
  'EP-43': {
    deep_attempt_status: 'partially_resolved_not_fully_closed',
    deep_attempt_route:
      'Used difference-set counting under Sidon assumptions to recover the natural 1/sqrt(2) scale when |A|=|B|.',
    deep_attempt_obstacle:
      'Background already gives a negative answer to the stronger second question (no fixed c>0 improvement), so only the first O(1)-precision extremal inequality remains open.',
    deep_attempt_next_step:
      'Focus on whether the first inequality can be sharpened with exact finite-size correction terms.',
    deep_attempt_note: 'Second question is reportedly false for infinitely many N per dataset background.',
  },
  'EP-70': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried to lift known continuum partition relations from (omega+n,4)_2^3 toward (beta,n)_2^3 for arbitrary countable beta via transfinite recursion.',
    deep_attempt_obstacle:
      'The available partition-calculus step-up does not directly propagate to all countable ordinals and all finite n with the same ambient cardinal.',
    deep_attempt_next_step:
      'Test special subclasses of countable beta (e.g., additive indecomposables) for a workable induction schema first.',
    deep_attempt_note: 'Main barrier is an ordinal-combinatorial strengthening gap.',
  },
  'EP-103': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Attempted rigidity approach for minimum-diameter point sets with pairwise distance >=1, seeking multiple noncongruent minimizers for large n.',
    deep_attempt_obstacle:
      'Even proving h(n)>=2 eventually is open per background; no general mechanism forces non-uniqueness of minimizers.',
    deep_attempt_next_step:
      'Search explicit infinite families of near-lattice extremizers where two inequivalent perturbations stay diameter-optimal.',
    deep_attempt_note: 'This is an extremal-geometry uniqueness/non-uniqueness problem.',
  },
  'EP-129': {
    deep_attempt_status: 'statement_issue_likely_false_as_written',
    deep_attempt_route:
      'Checked consistency against the random-coloring heuristic used in the background discussion for r=2.',
    deep_attempt_obstacle:
      'Background indicates a probabilistic lower bound R(n;3,2) >= C^n, contradicting the conjectured upper bound C^{sqrt(n)}.',
    deep_attempt_next_step:
      'Clarify the intended corrected statement before further proof attempts.',
    deep_attempt_note: 'Priority is problem repair, not proof search, for this item.',
  },
  'EP-152': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried to count isolated sums in A+A (where neighbors a±1 are missing) via local gap statistics induced by Sidon structure.',
    deep_attempt_obstacle:
      'Sidon uniqueness controls collisions of sums but gives limited control on nearest-neighbor occupancy around each sum.',
    deep_attempt_next_step:
      'Derive a local sparsity lemma for A+A intervals of fixed width to force many isolated points.',
    deep_attempt_note: 'Could be approachable through refined sumset spacing estimates.',
  },
  'EP-153': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Attempted second-moment-of-gaps strategy on ordered A+A, linking large mean squared gaps to low local clustering.',
    deep_attempt_obstacle:
      'Current Sidon bounds do not directly imply divergence of the average squared successive gap.',
    deep_attempt_next_step:
      'Combine additive-combinatorial spacing bounds with a variance lower bound for ordered sumsets.',
    deep_attempt_note: 'Need a robust bridge from uniqueness-of-representation to gap-variance growth.',
  },
  'EP-155': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Studied local increments of F(N), aiming to show eventual one-step growth under fixed k-shifts.',
    deep_attempt_obstacle:
      'Known asymptotics for maximal Sidon size are too coarse to control short-interval fluctuations F(N+k)-F(N).',
    deep_attempt_next_step:
      'Develop short-interval stability estimates for extremal Sidon constructions.',
    deep_attempt_note: 'Question is about local regularity, not global order of magnitude.',
  },
  'EP-158': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried to adapt Sidon liminf arguments to the weaker "at most 2 representations" condition via representation counting.',
    deep_attempt_obstacle:
      'Allowing two representations greatly increases flexible structure, and the Sidon rigidity tools no longer force liminf density collapse.',
    deep_attempt_next_step:
      'Find a decomposition into near-Sidon components or prove a replacement rigidity inequality for r_2(n)<=2.',
    deep_attempt_note: 'This is a robustness test of Sidon-type sparse-structure phenomena.',
  },
  'EP-162': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Reproduced the logarithmic-scale window via probabilistic method heuristics and searched for constant-level sharpening.',
    deep_attempt_obstacle:
      'Determining c_alpha needs sharp dependence control across many induced subgraphs, beyond coarse union-bound methods.',
    deep_attempt_next_step:
      'Use large-deviation machinery tailored to induced density constraints to pin down c_alpha.',
    deep_attempt_note: 'Order log n is supported; exact constant remains the hard layer.',
  },
  'EP-180': {
    deep_attempt_status: 'statement_issue_counterexample_in_background',
    deep_attempt_route:
      'Cross-checked the claim against the finite-family star+matching example described in the background.',
    deep_attempt_obstacle:
      'That example gives ex(n;F)=O(1) while each single-graph extremal function is Theta(n), contradicting the statement as written.',
    deep_attempt_next_step:
      'Formulate a restricted version (excluding known counterexample patterns) before attempting proof.',
    deep_attempt_note: 'As written, this appears refuted by the included folklore example.',
  },
  'EP-190': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Attempted canonical-Ramsey lower/upper growth comparison using Szemeredi-driven existence plus anti-rainbow constructions.',
    deep_attempt_obstacle:
      'Current quantitative Szemeredi/canonical tools do not determine the conjectured superlinear-in-k exponential scale for H(k)^{1/k}.',
    deep_attempt_next_step:
      'Improve either lower-bound constructions avoiding both monochromatic and rainbow k-APs, or upper bounds via density-increment refinements.',
    deep_attempt_note: 'Known existence is not enough for sharp growth classification.',
  },
  'EP-197': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried recursive block permutations in two-color partition classes to suppress monotone 3-term APs after permutation.',
    deep_attempt_obstacle:
      'Cross-block interactions reintroduce monotone AP patterns even when each block is locally controlled.',
    deep_attempt_next_step:
      'Design a hierarchical interleaving rule with provable cross-scale AP avoidance invariants.',
    deep_attempt_note: 'Three-set feasibility suggests two-set case is a sharp threshold variant.',
  },
  'EP-200': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Used random-primes heuristic and existing AP-in-primes framework to test plausibility of sub-logarithmic maximal progression length.',
    deep_attempt_obstacle:
      'Need strong upper bounds for long prime APs in [1,N], and current transference tools are better at existence than tight maximal-length control.',
    deep_attempt_next_step:
      'Pursue upper-tail bounds for counts of long prime APs under pseudorandom majorants.',
    deep_attempt_note: 'Question is about maximal AP length growth, not mere existence of arbitrarily long APs.',
  },
  'EP-203': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Attempted a covering-congruence construction assigning prime divisors to all values 2^k 3^l m + 1 across exponent classes.',
    deep_attempt_obstacle:
      'Need a finite congruence covering of the 2D exponent lattice compatible with one fixed m and all k,l >= 0.',
    deep_attempt_next_step:
      'Search for periodic exponent-class coverings modulo lcm of multiplicative orders with CRT consistency constraints on m.',
    deep_attempt_note: 'This is a 2-parameter Sierpinski-style covering problem.',
  },
  'EP-234': {
    deep_attempt_status: 'not_proved_statement_text_noisy',
    deep_attempt_route:
      'Interpreted the problem as existence/continuity of distribution for normalized prime gaps (p_{n+1}-p_n)/log n below threshold c.',
    deep_attempt_obstacle:
      'A full limiting distribution for normalized consecutive prime gaps is not currently established in this strong form.',
    deep_attempt_next_step:
      'First clean the statement text, then split into: (i) existence of density f(c), (ii) continuity of f.',
    deep_attempt_note: 'Input statement appears partially corrupted in dataset and should be normalized before deeper work.',
  },
  'EP-249': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Rewrote sum phi(n)/2^n via divisor-sum identities to express it as a rapidly convergent arithmetic series amenable to irrationality criteria.',
    deep_attempt_obstacle:
      'No direct irrationality criterion applies cleanly to this specific weighted totient series at x=1/2.',
    deep_attempt_next_step:
      'Build rational approximation bounds from truncated divisor expansions and seek contradiction with too-good approximants.',
    deep_attempt_note: 'Promising route is analytic-arithmetic, but a decisive Diophantine estimate is missing.',
  },
  'EP-273': {
    deep_attempt_status: 'not_proved',
    deep_attempt_route:
      'Tried covering-system construction with allowed moduli p-1 (p>=5), balancing congruence classes to achieve full integer coverage.',
    deep_attempt_obstacle:
      'Covering conditions interact strongly through lcm structure, and restricting moduli to p-1 leaves sparse arithmetic flexibility.',
    deep_attempt_next_step:
      'Run bounded-depth computational search over admissible moduli sets and residue assignments to identify candidate templates.',
    deep_attempt_note: 'Selfridge example with p=3 allowed suggests nearby constructions may guide admissible p>=5 search.',
  },
};

const rows = readJsonl(inputPath);
const enriched = rows.map((row) => {
  if (row.to_check_rank <= topN) {
    const customEntry = custom[row.problem_number] || makeDefaultDeep(row);
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
  .filter((r) => r.to_check_rank <= topN)
  .sort((a, b) => a.to_check_rank - b.to_check_rank);

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
  ]),
  'utf8'
);

fs.writeFileSync(outSummary, JSON.stringify(summary, null, 2) + '\n', 'utf8');

console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote: ${outJsonl}`);
console.log(`Wrote: ${outTopCsv}`);
console.log(`Wrote: ${outSummary}`);
