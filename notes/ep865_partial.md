# EP-865 partial

## Statement
Find whether there is a constant `C` such that every `A subseteq {1,...,N}` with
`|A| >= 5N/8 + C` contains distinct `a,b,c in A` with `a+b, a+c, b+c in A`.

## Attempt in this batch
I solved the exact finite extremal problem for `8 <= N <= 40`:
maximize `|A|` subject to avoiding that 6-point pattern.
Method: exact branch-and-bound on the induced forbidden hypergraph.

Data file:
- `data/ep865_exact_small_scan.json`

## Result
- For all tested `N`, the exact maximum avoiding size stayed very close to `5N/8`.
- Observed gap range:
  `max_A_avoiding |A| - 5N/8 in [0.875, 2.25]`.
- At `N=40`, exact maximum avoiding size is `27` (gap `+2.0`).

## Hard point
Finite bounded gap evidence does not prove a uniform asymptotic constant `C`.
Need a structural argument on all large `N`, not just exact search at small scale.

