# EP-200 partial

## Evidence from this batch
Ran exact longest-prime-AP scans for initial ranges:
- script: `scripts/ep200_prime_ap_maxlen_scan.mjs`
- data: `data/ep200_prime_ap_maxlen_scan.json`

Scanned `N` from `10^4` to `10^6`.

## Finite findings
- Longest AP length found:
  - `10` for `N<=200000`,
  - `12` at `N=300000,500000`,
  - `13` at `N=800000,10^6`.
- Normalized ratio `L(N)/log N` stays around `0.82..1.09` in this range.

This finite behavior does not settle whether `L(N)=o(log N)`.

## Status
Open; exact finite profile added.
