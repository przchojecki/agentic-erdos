# EP-890 deeper attempt with scans

## Statement
For fixed `k`, study
`S_k(n)=sum_{i=0}^{k-1} omega(n+i)`
and ask:
1. whether `liminf S_k(n) <= k+pi(k)`,
2. whether `limsup S_k(n) * loglog n / log n = 1`.

## Computation in this attempt
I scanned `S_k(n)` for `k<=12` up to `n<=2e6`, and for `k<=6` up to `n<=1e7`.

Data files:
- `data/ep890_consecutive_omega_scan_N2e6.json`
- `data/ep890_consecutive_omega_scan_N1e7.json`
- `data/ep890_tail_limsup_scan.json`

## Findings
- Observed minima are compatible with the known lower side (`>=k+pi(k)-1`) and often
  close to `k+pi(k)`.
- For the scaled limsup quantity, finite-range tail maxima for `k>=2` stay well above
  `1` in tested ranges.

## Interpretation
This is finite evidence only; it does not prove/disprove the asymptotic claims.
