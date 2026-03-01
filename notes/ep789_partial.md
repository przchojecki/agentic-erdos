# EP-789 deeper attempt

## Statement
Estimate `h(n)`: guaranteed size of subset `B` where sum-equalities force equal number of terms.

## Exact finite model in this attempt
I solved an interval-restricted model exactly:
for all `A subset [0,M]` with `|A|=n`, minimize the largest valid `|B|`.

Data file:
- `data/ep789_interval_model_scan.json`

Results:
- `n=5, M=14`: bound `<=3`
- `n=6, M=16`: bound `<=3`
- `n=7, M=18`: bound `<=4`
- `n=8, M=20`: bound `<=4`

## Interpretation
These are exact finite upper bounds for the restricted interval model, not the full unrestricted
integer problem.
