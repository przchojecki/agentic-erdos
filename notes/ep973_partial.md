# EP-973 partial attempt

## Route
Ran multi-restart local search over unit-modulus sequences (`|z_i|=1`) to minimize
`\max_{2 \le k \le n+1}\left|\sum_i z_i^k\right|` for small `n`.

## Evidence from this batch
- `data/ep973_unit_modulus_power_sum_search.json` (`1200` restarts each):
  - `n=8`: best max `0.974`
  - `n=12`: best max `1.416`
  - `n=16`: best max `2.142`
  - `n=20`: best max `3.057`
- In this search regime, no exponential decay `C^{-n}` (`C>1`) is observed.

## Hard point
Heuristic optimization in low dimensions is far from a proof-level construction or obstruction; the asymptotic extremal structure is the central difficulty.

## Status
No proof/counterexample; computational signal is negative for small `n` only.
