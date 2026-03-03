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
