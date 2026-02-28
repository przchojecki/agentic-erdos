# EP-40 proof attempt (v2)

## Problem
Determine for which functions `g(N) -> infinity` the condition

`|A ∩ [1,N]| >> N^(1/2)/g(N)`

forces

`limsup_n (1_A * 1_A)(n) = infinity`.

Here `(1_A * 1_A)(n)` is the number of representations `n=a+b` with `a,b in A` (ordered).

## Basic inequality (sufficient growth condition)
For `A_N = A ∩ [1,N]`, `m = |A_N|`, and `r_N(s) = #{(a,b) in A_N^2 : a+b=s}`:

`sum_{s<=2N} r_N(s) = m^2`, with at most `2N` sums.
Hence

`max_{s<=2N} r_N(s) >= m^2/(2N)`.

Therefore, if along some sequence `N_j` we have `m(N_j)^2/N_j -> infinity`, then
`limsup_n (1_A*1_A)(n)=infinity`.

This gives a clean positive regime (`m >> sqrt(N) h(N)` with `h(N)->infinity`), but it does not reach the EP-40 scale `m >> sqrt(N)/g(N)` with `g(N)->infinity`.

## Explicit negative regime via a concrete counterexample
Take `A = {2^k : k>=0}`.

- Counting function: `|A ∩ [1,N]| = floor(log_2 N)+1`.
- Representation bound: every integer has at most `2` ordered representations as a sum of two powers of two (one if equal powers, two if distinct). So `limsup (1_A*1_A)(n) <= 2`.

Hence any `g` for which

`sqrt(N)/g(N) <= C log N` eventually

cannot satisfy EP-40's implication in full generality, because this `A` meets the size hypothesis while convolution stays bounded.
Equivalent asymptotic form: if `g(N) >= c sqrt(N)/log N` eventually, the implication is false.

So the problem's nontrivial region is at least below this barrier.

## Stronger negative regime from Erdős–Rényi (1960)

Theorem 8 in Erdős–Rényi (Acta Arith., 1960) gives (via probabilistic construction) bounded-representation sequences with near-square-root growth:

- For every `epsilon > 0`, there are infinite sequences with bounded additive representation function and growth roughly `A(N) >> N^(1/2 - epsilon)` (equivalently `a_k = O(k^(2+delta))` for arbitrary `delta>0`).

Consequence for EP-40:

- Any candidate `g(N)` with `g(N) >= N^epsilon` eventually (for some fixed `epsilon>0`) is ruled out.
  Reason: then threshold `sqrt(N)/g(N) <= N^(1/2-epsilon)`, and Erdős–Rényi-type sets satisfy the size condition while keeping `limsup (1_A*1_A)(n)` bounded.

So the implication fails not just in the very sparse/lacunary regime, but also throughout a broad polynomial-denominator regime.

## What remains hard
The difficult zone is the intermediate regime between:
- very sparse thresholds (`<= log N`, false by explicit lacunary counterexamples), and
- very dense thresholds (`>> sqrt(N)`, true by averaging).

Current obstacle: no method here to rule out bounded-representation infinite sets at sizes significantly above `log N` but below `sqrt(N)` in enough uniformity to settle the exact `g` frontier.

## Current status
- Not solved.
- Added one rigorous positive criterion (average-based).
- Added rigorous negative regimes:
  - `g(N) >= c sqrt(N)/log N` via explicit lacunary construction.
  - `g(N) >= N^epsilon` (some fixed `epsilon>0`) via Erdős–Rényi 1960.
- Added focused log-case reduction/program note:
  - `notes/ep40_logN_program.md`
  - including greedy bounded-representation experiments (`data/ep40_logN_greedy_summary.json`).

## Source pointers
- Erdős–Rényi (1960), "On a new law of large numbers":
  https://users.renyi.hu/~p_erdos/1960-07.pdf
  (Theorem 8 and the following remark on bounded representation and growth `a_k=O(k^{2+delta})`.)
- Problem statement and context page:
  https://www.erdosproblems.com/39
