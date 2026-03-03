# EP-662 partial attempt

## Route
Attempted to parse the literal statement and background into a mathematically coherent extremal-distance claim.

## Statement issue
The background itself notes the problem text is nonsensical as written and likely contains at least one typo (possibly more), including an impossible literal sub-claim in the "in particular" line.

## Hard point
Without a corrected formal statement, no definitive proof/counterexample workflow is possible.

## Status
Statement issue: likely malformed as written; requires correction before substantive progress.

## Literal-clause sanity check (counterexample-oriented)
I still ran a direct literal sanity check on the "in particular" clause:
"the number of distances `<= sqrt(3)-epsilon` is less than `1`."

Data:
- `data/ep662_literal_clause_sanity_check.json`

Test:
- 6x6 triangular-lattice patch, with `epsilon=0.1`, so
  `t = sqrt(3)-epsilon ~= 1.632 > 1`.
- Distinct distances `<= t` in this patch include distance `1`, so count is `1`.

Hence the literal inequality "< 1" fails on this explicit configuration.
This supports the background claim that the statement is malformed/literally
incorrect as written.
