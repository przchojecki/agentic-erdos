# EP-710 partial attempt

## Route
Formulated feasibility for a given interval length `f` as a bipartite matching problem (`k` matched to distinct multiples in `(n,n+f)`), then solved exactly for small `n`.

## Evidence from this batch
- `data/ep710_matching_interval_scan.json` exact values:
  - `f(20)=29`, `f(30)=46`, `f(40)=60`, `f(60)=91`, `f(80)=121`, `f(100)=161`, `f(120)=193`.
- Ratio `f(n)/n` in this range is about `1.45` to `1.61`.

## Hard point
These exact small-`n` values do not bridge the asymptotic gap between known lower and upper bounds involving `\sqrt{\log n/\log\log n}` and `\sqrt{\log n}` factors.

## Status
Exact finite data added; asymptotic formula still open.
