# EP-996 deeper attempt with exact-arithmetic simulation

## Statement
Under Fourier-tail decay assumptions on `f`, does
`(1/N) sum_{k<=N} f({alpha n_k}) -> integral f` a.e. for lacunary `n_k`?

## Experiment in this attempt
Model test with exact arithmetic:
- `n_k=2^k`
- `f(x)=1_{x<1/2}-1_{x>=1/2}` (zero mean)
- `alpha=a/q`, odd prime `q`

Data file:
- `data/ep996_ergodic_average_simulation.json`

Observed decay of sample averages:
- mean `|(1/N)sum_{k<=N} f({alpha n_k})|` drops from about `0.035` (`N=512`)
  to about `0.0028` (`N=65536`).

## Interpretation
Finite experiments are consistent with convergence in this model, but do not prove the
full theorem under the stated general assumptions.
