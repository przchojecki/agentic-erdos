# Cycle Method (from Knuth's "Claude's Cycles")

Purpose: turn computational exploration into proof-oriented progress on hard open problems.

## Core Loop

1. Reformulate early
- Convert the original statement into one or more equivalent objects:
  - residue/fiber decomposition
  - graph/hypergraph encoding
  - additive/multiplicative energy view
  - extremal optimization view
- Keep at least two parallel formulations when possible.

2. Build a finite test harness
- Implement exact checks on small/medium ranges.
- Include adversarial/random search modes, not only constructive modes.
- Log all parameters and seeds.

3. Detect rigid patterns
- Track invariants and ratios (normalized quantities).
- Separate persistent patterns from one-off artifacts.
- Explicitly record counterexamples to naive hypotheses.

4. Extract candidate mechanisms
- State short mechanism hypotheses:
  - "local rule implies global structure"
  - "layered decomposition controls growth"
  - "extremizers look like family X"
- Tie each mechanism to concrete finite evidence.

5. Stress-test mechanisms
- Re-run on larger ranges and perturbed constructions.
- Try alternative encodings to avoid model bias.
- Keep a "fails under perturbation" list.

6. Pivot to proof mode
- Promote only robust mechanisms to lemmas/conjectures.
- Write proof scaffolding:
  - key lemmas
  - dependencies
  - bottleneck statement(s)
- Stop widening experiments once bottleneck is clear.

7. Keep a disciplined experiment log
- After each run, update:
  - what changed
  - what held / failed
  - next highest-value test
- Preserve reproducibility (script + artifact + note linkage).

## Batch Checklist (Erdos workflow)

For each problem in a batch:
- Web status snapshot (open/partial/solved + latest cited progress).
- One finite probe chosen to test a mechanism, not just produce a number.
- One concise mechanism statement in notes.
- One explicit obstacle/bottleneck statement for proof progress.

Required artifacts:
- `scripts/harder_batchXX_quick_compute.mjs`
- `data/harder_batchXX_quick_compute.json`
- `notes/harder_batchXX_web_compute.md`
- `data/erdos_harder.jsonl` updated with `deep_attempt_v3_*` linkage.

## Guardrails

- Finite evidence is directional, not decisive.
- Avoid overfitting to one construction family.
- Prefer exact checks where feasible; if heuristic, mark clearly.
- Promote claims only at the strength justified by evidence.
