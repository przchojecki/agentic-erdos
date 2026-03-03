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

## Additional counterexample-oriented scan in this batch
I added a broader exact-modular sweep using mean-zero heavy-step `L^2` test
functions and multiple lacunary bases:
- `n_k = b^k` with `b in {2,3}`
- `f_M(x)=M` on `[0,1/M^2)` and `-c_M` elsewhere (`M in {4,8,16,32}`), with
  `c_M` chosen so the discrete mean mod `q` is zero
- prime moduli `q in {1000003,1000033}`, `120` random `a` values per `q`
- `N in {1024,2048,4096,8192,16384,32768}`

Script / data:
- `scripts/ep995_heavy_step_counterexample_scan.mjs`
- `data/ep995_heavy_step_counterexample_scan.json`

Result:
- strongest observed normalized spike was
  `max |S_N|/(N*sqrt(loglog N)) ~= 0.1799`
  (at `q=1000033, b=2, M=32, N=1024`);
- ratios decreased further at larger `N` in tested configurations.

So this broader finite scan still found no counterexample signal.

## Additional computational extension (2026-03-03)
I pushed the heavy-step exact-modular search further:
- Run A:
  - `q in {1000003,1000033}`, `bases in {2,3}`, `M in {4,8,16,32,64}`
  - `160` samples per `q`, `N` up to `65536`
  - strongest `max |S_N|/(N*sqrt(loglog N)) ~= 0.1645`
    (`q=1000033, base=2, M=64, N=2048`)
- Run B:
  - `q=1000003`, `bases in {2,3}`, `M in {8,16,32,64}`
  - `220` samples, `N` up to `262144`
  - strongest `max |S_N|/(N*sqrt(loglog N)) ~= 0.0752`
    (`base=2, M=64, N=4096`)

These extended runs still show no counterexample trajectory; normalized maxima
stay small and weaken at larger `N`.

## Context from background
Background also reports strong lower-bound constructions in other lacunary/`L^2`
choices and upper bounds with logarithmic losses.

## Hard point
The exact almost-sure growth scale in full generality remains open.
