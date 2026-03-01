# EP-611 partial attempt

## Route
Tried to combine clique-transversal hitting arguments with known extremal bounds for large maximal cliques.

## What is resolved from background
Known bound: if every clique has size at least `k`, then `\tau(G) \le n - (kn)^{1/2}`.
For `k=cn` this gives `\tau(G) \le (1-\sqrt c)n`, which is linear and does not imply `o_c(n)`.

## Hard point
Need a much stronger structural mechanism to force sublinear clique-transversal size when all maximal cliques are linear-size.

## Status
Attempted reduction; main asymptotic question remains open.
