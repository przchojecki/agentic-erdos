# EP-995 deeper attempt with corrected experiment

## Statement
For lacunary `n_k` and `f in L^2`, estimate growth of
`S_N(alpha)=sum_{k<=N} f({alpha n_k})` for almost all `alpha`.

## Corrected experiment in this attempt
I reran the computational check using **exact modular arithmetic** (no floating-point
state updates) for a model case:
- `n_k=2^k`
- `f(x)=1_{x<1/2}-1_{x>=1/2}`
- `alpha=a/q` with odd prime `q`, random `a`

Data file:
- `data/ep995_lacunary_doubling_simulation.json`

Observed at `N=32768`:
- mean `|S_N|` about `138.8`
- p99 about `500`
- max about `632`

These are far below linear in `N` in this model, so this run found no counterexample
signal to the target upper-scale question.

## Context from background
Background also reports strong lower-bound constructions in other lacunary/`L^2`
choices and upper bounds with logarithmic losses.

## Hard point
The exact almost-sure growth scale in full generality remains open.
