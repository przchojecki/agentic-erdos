# EP-681 counterexample search (composite + least-prime-factor condition)

## Statement
For large `n`, is there `k` with `n+k` composite and least prime factor
`p(n+k) > k^2`?

## Attempt route
Ran an exact SPF-based scan for
`exists k >= 1: n+k composite and lpf(n+k) > k^2`
for all `2 <= n <= 10^6`.

Data / script:
- `scripts/ep681_composite_lpf_k2_scan.mjs`
- `data/ep681_composite_lpf_k2_scan.json`

## Finite counterexample signal
- In `2 <= n <= 10^6`, there are `31,283` failures (no such `k` found).
- Failures persist up to `n=999,960` in this range.
- Since `k=1` is a witness whenever `n+1` is composite, every failure has `n+1`
  prime (as expected).

## Obstacle
This is still finite evidence. To truly disprove the asymptotic statement
("for all large n"), we need an infinite family of failures, not just large
finite scans.

## Status
- no asymptotic disproof proved yet.
- very strong finite counterexample signal.

## Additional computational extension (2026-03-03)
I extended the exact SPF scan substantially:
- up to `n<=3,000,000`: `69,135` failures,
- up to `n<=10,000,000`: `157,343` failures,
- up to `n<=20,000,000`: `247,648` failures.

Failures remain abundant and persist near the top of each tested range.
