# EP-278 partial attempt

## Route
Started from Simpson's result (second subquestion) and then analyzed the first
subquestion on a structured family of moduli.

## What is resolved
Background states Simpson (1986) settled the second question:
minimum covered density is achieved when all residues `a_i` are equal.

## New reduction (first question, structured family)
For

`A = {3} U {3p : p in P}`

with distinct odd primes `P`, one can reduce the optimization of covered density
to a partition-type objective.

Fix `a_0 mod 3`; by translation, take `a_0 = 0`.
For each `p in P`, assign the class `a_p mod 3p` to either residue `1 mod 3`
or `2 mod 3` (choosing `0 mod 3` is never beneficial for maximizing coverage,
since it lies inside the already-covered `0 mod 3` class).

If `P = P1 sqcup P2` according to that choice, then

`density = 1 - (1/3) * ( prod_{p in P1}(1-1/p) + prod_{p in P2}(1-1/p) )`.

Hence maximizing density is equivalent to minimizing

`prod_{p in P1}(1-1/p) + prod_{p in P2}(1-1/p)`.

This gives an exact finite optimization for this family and shows a direct
partition-style structure in the first subquestion.

Verification script:
- `scripts/ep278_family_partition_reduction_check.mjs`
- `data/ep278_family_partition_reduction_check.json`

The script checks this formula against full brute-force residue search for
`P={5,7}`, `{5,7,11}`, `{5,7,11,13}` and finds exact agreement.

## What remains open here
The first question for arbitrary modulus sets `A` remains open in this batch.

## Status
Second subquestion solved; first subquestion open, with a stronger structured-family reduction now recorded.
