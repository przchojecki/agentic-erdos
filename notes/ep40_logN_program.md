# EP-40 at g(N)=log N: focused reduction and program

## Target statement (log case)
Define:

`C_log`: If `|A ∩ [1,N]| >> sqrt(N)/log N` (for all large N), then
`limsup_n (1_A * 1_A)(n) = infinity`.

## Equivalent bounded-representation formulation
`C_log` is equivalent to:

For every fixed `K`, every infinite set `A` with
`sup_n (1_A*1_A)(n) <= K` must satisfy

`|A ∩ [1,N]| = o(sqrt(N)/log N)`.

Reason:
- If this fails for some `K`, we get a direct counterexample to `C_log`.
- Conversely, if it holds for all `K`, then any set obeying `|A∩[1,N]| >> sqrt(N)/log N` cannot have bounded representation function.

So the log-case is exactly a dense `B_2[K]`-type growth problem.

## Known constraints around this frontier
- Erdős–Rényi (1960): for every `eps>0`, there exist bounded-representation sets with
  `A(N) >> N^(1/2-eps)` for all large `N`.
  This is below `sqrt(N)/log N` asymptotically (fixed `eps`), so it does not settle `C_log`.
- Trivial finite upper bound for bounded representation (`B_2[K]`):
  `A(N) <<_K sqrt(N)`.

Hence the unresolved gap is essentially one logarithm.

## Practical proof/counterexample program
1. Counterexample route:
   Construct a fixed-`K` sequence with
   `A(N) >= c sqrt(N)/log N` eventually and `r_{A+A}(n) <= K` globally.
2. Positive route:
   Prove universal upper bound for fixed-`K` sets:
   `A(N) = o(sqrt(N)/log N)` (or at least infinitely often smaller), which would imply `C_log`.

## Current status
No resolution yet. This reduction isolates the exact remaining hardness for the log case.

## Greedy bounded-representation experiments (heuristic evidence)

Script:
- `scripts/ep40_logN_greedy_bounded_rep.mjs`

Summary file:
- `data/ep40_logN_greedy_summary.json`

Observed for a greedy `r_{A+A}(n) <= K` construction:
- `K=2` (Sidon-like):
  - `N=10^6`: `|A(N)| * log N / sqrt N ≈ 5.26`
  - `N=2*10^7`: `≈ 4.28`
  - `N=10^8`: `≈ 3.73`
- `K=4`:
  - `N=10^6`: `≈ 12.02`
  - `N=2*10^7`: `≈ 11.28`

Interpretation:
- These data are consistent with (but do not prove) potential counterexamples to `C_log`.
- Since the construction is greedy and finite-range, this is not an asymptotic proof either way.
