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

## Status
Not proved/disproved. Strong finite obstruction signal for `M>=3`.
