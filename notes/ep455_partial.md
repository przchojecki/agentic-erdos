# EP-455 partial

## Statement
If primes `q_1<q_2<...` satisfy convex gaps
`q_{n+1}-q_n >= q_n-q_{n-1}`, must `q_n/n^2 -> infinity`?

## Attempt in this batch
I searched for long convex-gap prime sequences via greedy extension from many
starting pairs, minimizing the end prime for each target length.

Data file:
- `data/ep455_prime_convex_gap_greedy_scan.json`

## Result
With `Pmax=10^7`, `lenMax=50`, and 6570 starting pairs:
- Found convex-gap sequences up to length `50`.
- Best end prime at length `50` is `q_50=3491`.
- Ratio `q_50/50^2 = 1.3964`.

Finite data stays at constant-scale multiples of `n^2`, consistent with known
positive liminf bounds but not proving divergence to infinity.

## Hard point
This is only a greedy finite search and does not cover all admissible sequences.
Need a universal argument for every convex-gap prime sequence, or an explicit
infinite construction with bounded `q_n/n^2`.

