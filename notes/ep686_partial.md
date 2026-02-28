# EP-686 deep attempt with bounded computation

## Statement
Can every integer `N>=2` be represented as a ratio of two products of `k`
consecutive integers with `k>=2` and `m>=n+k`?

## Attempt route
Tried valuation balancing and performed bounded brute-force search over small
parameter ranges.

## Computation signal
A bounded search (`N<=200`, with capped `k,n,m`) found many representable values
but also many not reached within that cap.

## Obstacle
Bounded finite search cannot prove non-representability nor universal
representability.

## Status
- finite-range evidence: present.
- universal representability theorem: unresolved.
