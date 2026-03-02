# EP-87 partial attempt

## Route
Compared what can be forced from generic Ramsey lower-bound methods for graphs with chromatic number `k` against the target comparison to `R(k)`.

## What is resolved from background
- The original stronger guess `R(G) >= R(k)` is false (already fails at `k=4` via the pentagonal wheel example).
- A random-coloring argument gives `R(G) >> 2^{k/2}` for all `chi(G)=k`.

## Hard point
To prove `R(G) > c R(k)` (or `(1-eps)^k R(k)`), one needs control relative to the true scale of `R(k)`, not just absolute `2^{k/2}`-type lower bounds.

## Status
No new proof; comparison-to-`R(k)` gap remains open.
