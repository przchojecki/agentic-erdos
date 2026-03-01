# EP-119 partial attempt

## Route
Split the problem into its three subquestions and tried to push from known pointwise lower bounds on `M_n` toward cumulative-growth bounds for `\sum_{k \le n} M_k`.

## What is resolved from background
- `\limsup M_n = \infty` is already proved (Wagner).
- A polynomial-growth spike statement is also proved (Beck): `\max_{n \le N} M_n > N^c` for some `c>0`.

## Hard point
The remaining open part asks for a persistent lower bound on partial sums (`\sum_{k \le n} M_k > n^{1+c}` for all large `n`), which is much stronger than sporadic large spikes.

## Status
Partially resolved historically, but not fully closed (third question open).
