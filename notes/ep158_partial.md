# EP-158 partial

## Evidence from this batch
Ran random-order greedy constructions for finite `B_2[2]`-type sets
(`r_{A+A}(n) <= 2` in unordered representation count):
- script: `scripts/ep158_b2_2_random_scan.mjs`
- data: `data/ep158_b2_2_random_scan.json`

## Finite signal
For `N=200..5000`, best-found sizes satisfy:
- `|A|/sqrt(N)` from about `1.70` (at `N=200`) down to about `1.23` (at `N=5000`),
with averages also staying clearly positive.

This does not settle the liminf question (finite greedy evidence is not
asymptotic proof), but it shows robust finite constructions at `sqrt(N)` scale.

## Status
Open; finite construction evidence recorded, no proof of liminf behavior.

## Step 1 extension (2026-03-04)

Extended random greedy scan to larger `N` values:
- script: `scripts/ep158_b2_2_random_scan.mjs`
- updated data: `data/ep158_b2_2_random_scan.json`
- parameters used in latest run: `RESTARTS=160`,
  `N_LIST=200,400,800,1200,1800,2600,3600,5000,6000,8000,10000,14000,18000,22000`.

Tail behavior:
- `N=6000`: best `|A|/sqrt(N) ≈ 1.2135`
- `N=22000`: best `|A|/sqrt(N) ≈ 1.0855`

The ratio decreases slowly but remains clearly bounded away from `0` in this finite window.
