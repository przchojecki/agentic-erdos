# EP-671 partial attempt

## Route
Analyzed the problem against known background obstructions (Bernstein; Erdos-V"ertesi) and ran a numerical interpolation demo comparing node systems.

## Evidence from this batch
- `data/ep671_lagrange_lebesgue_demo.json` shows Lebesgue-function growth for both node families (mild for Chebyshev, explosive for equally-spaced).
- Despite Lebesgue growth, pointwise interpolation error can still shrink for specific test functions (especially on Chebyshev nodes), illustrating why operator-norm blowup alone does not settle the existential question asked.

## Hard point
The statement quantifies over all continuous `f` but allows existence of a point `x` depending on `f`. Known divergence results force bad behavior for some `f` and many points, but do not directly decide this exact quantifier pattern.

## Status
Unresolved in this batch; no proof or counterexample construction for the asked existence statements.

## Additional computational extension (2026-03-03, remaining-7 batch)
I extended the interpolation demo to larger sizes:
- `n in {8,12,16,24,32,48,64,80}`,
- grid size `3001`.

Saved:
- `data/ep671_lagrange_lebesgue_demo_N80_grid3001.json`

Key finite signal at `n=80`:
- Chebyshev nodes: Lebesgue max about `3.75`, very small Runge error.
- Equally spaced nodes: Lebesgue max explodes (about `1.59e18`), with huge
  sup errors for non-polynomial tests.

At the same time, some pointwise errors can remain small for specific test
functions (e.g. at `x=0`), illustrating again why this does not settle the
quantifier pattern in the problem statement.
