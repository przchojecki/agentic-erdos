# EP-151 partial attempt

## Route
Compared the target bound `\tau(G) \le n-H(n)` to standard clique-transversal/independence reductions.

## Useful reduction
For any graph `G`, taking the complement of a maximum independent set gives
`\tau(G) \le n-\alpha(G)` (this hits every clique of size at least `2`).
So the conjecture would follow from `\alpha(G)\ge H(n)`, which fails in general because `H(n)` is defined via triangle-free extremal behavior.

## Hard point
No mechanism found to transfer triangle-free independence guarantees into clique-transversal control for arbitrary graphs; background already warns the conjecture may be wrongheaded.

## Status
No proof or counterexample obtained in this batch.
