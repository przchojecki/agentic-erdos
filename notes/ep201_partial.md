# EP-201 partial

## Statement
Let `G_k(N)` be the largest guaranteed size of a `k`-AP-free subset inside any
`N`-element integer set. Compare `G_k(N)` with `R_k(N)` (max size in `[1..N]`).

## Attempt in this batch
I used an exact small surrogate for `k=3`:
for each `N` and `M`, exhaust all `N`-subsets of `[1..M]`, compute their largest
3-AP-free subset, and compare that worst case against exact `R_3(N)` on `[1..N]`.

Data file:
- `data/ep201_interval_model_scan.json`

## Result
For tested configurations:
- `N=6,7,8`: surrogate upper bound is `4`, exact `R_3(N)=4`.
- `N=9`: surrogate upper bound is `5`, exact `R_3(9)=5`.
So in this model and range, ratio `R_3(N)/G_3_model(N)=1`.

## Hard point
The scan is restricted (small `N`, interval model, `k=3` only).
It does not settle unrestricted `G_k(N)` or asymptotic relations to `R_k(N)`.

