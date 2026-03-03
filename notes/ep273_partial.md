# EP-273 partial

## Evidence from this batch
Ran a finite-prefix covering heuristic with distinct moduli of the form `p-1`
(`p` prime, `p>=5`) and one chosen residue per modulus:
- script: `scripts/ep273_pminus1_cover_greedy_scan.mjs`
- data: `data/ep273_pminus1_cover_greedy_scan.json`

Best recorded run:
- moduli up to `400` (`77` moduli),
- coverage target prefix `[1..200000]`,
- randomized greedy restarts: `120`.

## Result
Best coverage reached about `91.323%` of the tested prefix; no full finite-prefix
cover found in this scan regime.

This is heuristic finite evidence only, not a proof either way.

## Status
Open; bounded search did not produce a covering construction.
