# EP-330 deep attempt (finite surrogate search)

## Statement
Is there a positive-density minimal basis `A` such that each `n in A` is
indispensable for a positive-density set of integers?

## Attempt route
Tried to combine minimal-basis deletion sensitivity with density-increment style
bookkeeping for representation sets.

## Finite surrogate experiment
I ran a finite-window hill-climb model:
- choose `A subset [1,N]`, with `N=320`;
- test coverage of window `[N,2N]` by sums `A+A`;
- for each `a in A`, measure an indispensability ratio:
  fraction of window sums representable by `A` but not by `A\\{a}`.

Script / data:
- `scripts/ep330_finite_minimal_basis_search.mjs`
- `data/ep330_finite_minimal_basis_search.json`

Best run found:
- density `|A|/N = 0.153125` (`|A|=49`);
- coverage ratio on `[320,640]`: `0.9968847`;
- `zero_essential_count = 0` (every chosen element was indispensable at least
  somewhere in the window);
- minimum indispensability ratio across elements: `0.003115`.

This is only a finite surrogate, but it provides positive structural evidence that
"dense + elementwise indispensable" behavior is not obviously contradictory.

## Obstacle
Finite-window behavior does not imply an infinite minimal basis theorem with
asymptotic positive densities.

## Status
- no proof or counterexample for the full infinite statement.
- finite model shows strong positive signal, not disproof signal.

## Additional computational extension (2026-03-03)
I extended the finite surrogate to larger windows:
- `N=420`, window `[420,840]`, `50` restarts, `3500` steps:
  - best density `0.1357`, cover `0.99525`,
  - min essential ratio `0.002375`, `zero_essential_count=0`.
- `N=520`, window `[520,1040]`, `35` restarts, `3000` steps:
  - best density `0.1269`, cover `0.99424`,
  - min essential ratio `0.001919`, `zero_essential_count=0`.

Interpretation: the finite model still finds dense near-bases where every chosen
element is essential somewhere, but essentiality fractions remain tiny and trend
downward as `N` grows.
