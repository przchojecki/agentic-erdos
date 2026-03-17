# Proving Strategy (No New Computations)

## Core Rule
- From now on, do **not** add any new computations.
- Focus only on:
  - literature search,
  - proof attempts,
  - concrete blocking lemmas and reduction steps.

## Per-Problem Workflow
For each EP problem, work strictly one-by-one and record:
1. Exact statement (normalized, with precise quantifiers).
2. Best known literature status (proved/partial/open variants).
3. Candidate proof routes.
4. Precise blocker: the concrete lemma/theorem estimate that is currently missing.
5. Next proof tasks that are local and checkable.

## Queue Policy
- Default order: easiest/highest-rank first, using `data/erdos_to_check_ranked.csv`.
- If rank metadata is missing for many entries, use EP number order as fallback.
- Recompute ranking periodically with:
  - `node classify_erdos_by_refs.mjs`

## Priority Method Families
When trying each problem, prioritize the following themes first:
- Sieve methods (especially Tao-style decompositions and transference arguments).
- Random colorings / probabilistic constructions.
- Lovasz Local Lemma (and variants, including lopsided LLL where relevant).
- Red-blue coloring formulations / Ramsey reformulations.
- Arithmetic geometry approaches (finiteness of rational/integer solutions, structure of low-degree varieties).

## Required Output Per Problem
For each problem note, include:
- `Problem Statement`
- `Literature`
- `Our Approaches`
- `Blocking Lemma(s)`
- `What Would Finish the Proof`

Each `Blocking Lemma` entry should be specific, e.g.:
- "Need quantitative bound X <= Y(N) at scale N^{-2}."
- "Need stability lemma converting near-extremizer measure to structural rigidity."
- "Need finite-N version of asymptotic theorem T with explicit error term."

## Anti-Drift Rules
- Do not default back to computational scans.
- Do not add batch runs.
- Do not treat empirical evidence as proof progress.
- Prefer theorem-strength reductions over heuristic narratives.

## Global-Method Switch (When Local Casework Stalls)
If a problem is progressing only by small finite-layer case splits, switch to a global method pass:
1. Write a discrepancy decomposition (`main term + oscillation/error`) and identify the exact sign-sensitive estimate needed.
2. Formulate an extremizer/stability statement: characterize near-equality structure.
3. Build a dual/optimization viewpoint (LP, entropy, or variational bound) to upper-bound the global ratio directly.
4. Convert “finite initial range” into a finite pattern-class theorem (symbolic classes, not numerical scans).
5. Return to local lemmas only after the global bottleneck theorem is explicitly stated.

## EP-488 Specific Global Program
- Decomposition: \(M_A(x)=\delta_A x+E_A(x)\); current \(L^\infty\) bound on \(E_A\) is too weak.
- Missing key: sign-aware transport inequality for \(E_A(m)-2E_A(n)\).
- Stability target: near-factor-2 implies singleton-dominant reduced set.
- Pattern target: bounded complexity of reduced profiles at fixed \(|B\cap[1,n]|=t\).
- Success criterion: one theorem that covers all \(t\) at once, replacing layer-by-layer closure.

## Future-Run Remarks
- Keep reductions explicit: write `A => B => C`, and state exactly where implication fails.
- Distinguish clearly:
  - "known in literature",
  - "proved in-note",
  - "conjectural route".
- If a problem has multiple interpretations/variants, split them and mark which variant is trivial, solved, or open.
- When possible, target one strong intermediate lemma per problem instead of broad speculative text.
- Revisit older notes that are computation-heavy and convert them into lemma-driven proof roadmaps.
