# EP-42 partial

## Attempt in this batch
Ran exhaustive finite checks using:
- `scripts/ep42_scan_smallN.mjs`
- output: `data/ep42_smallN_scan.json`

Scanned all Sidon `A subseteq [1..N]` for `10<=N<=40`, asking whether there exists
a Sidon `B subseteq [1..N]` of fixed size `M` with
`(A-A) cap (B-B) = {0}`.

## Finite findings
- `M=2`: no counterexample in the full tested window (`N=10..40`).
- `M=3,4,5,6,7`: counterexamples already at `N=10`, and for every tested `N`.

So finite data is strongly negative for larger fixed `M` at small/moderate `N`,
but does not rule out an eventual positive statement for sufficiently large `N`
in terms of `M`.

## New counterexample extension for `M=3` (explicit certificate)
Using the previously found Sidon set
`A = {1,2,7,11,24,27,35,42,54,56}`,
I directly checked larger `N` by exhaustive triple testing for `B={x<y<z}`.

Data:
- `data/ep42_m3_explicit_A_extension_N63_80.json`

Result:
- The same `A` is still a valid counterexample for every `63 <= N <= 73`.
  (No disjoint Sidon triple `B` exists.)
- First failure for this `A` occurs at `N=74`, with witness
  `B={1,37,74}` and differences `{36,37,73}`.

This pushes the rigorous finite counterexample frontier from `N<=63`
to `N<=73` for `M=3`.

## Additional heuristic search attempt
I added:
- `scripts/ep42_m3_counterexample_search.mjs`

This annealed search (difference-complement Schur obstruction objective) did not
find new `bad=0` witnesses for `N in {74,75,76,78,80}` under tested budgets;
best values remained positive.

## Status
Not proved/disproved. Strong finite obstruction signal for `M>=3`.
