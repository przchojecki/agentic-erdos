# EP-340 partial

## Statement
For the greedy Sidon (Mian-Chowla) sequence `A`, determine growth of
`|A cap [1,N]|`; in particular whether it is `>> N^(1/2-eps)` for all eps.

## Attempt in this batch
I generated the sequence directly up to values above `5e6` and measured counting
function behavior.

Data file:
- `data/ep340_mian_chowla_scan.json`

## Result
- Generated 691 terms up to about `5.03e6`.
- At `N=5e6`, count is 690, giving count/sqrt(N) about `0.309`.
- Scaled counts against exponents `0.45` and `0.49` were also tracked.

## Hard point
Finite-generation evidence does not settle asymptotic lower bounds near `N^{1/2}`.

