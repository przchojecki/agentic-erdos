# EP-129: counterexample as written (r = 2)

## Statement (as written)
The problem asks for a constant `C(r) > 1` with
`R(n;3,r) < C(r)^{sqrt(n)}`.

Here `R(n;3,r)` is the least `N` such that every `r`-coloring of `E(K_N)` has an `n`-set of vertices missing a monochromatic triangle in at least one color.

## Counterexample route
Take `r = 2` (red/blue).

For infinitely many `n` (`n ≡ 1 or 3 mod 6`), `K_n` decomposes into edge-disjoint triangles
(Steiner triple system), with

`t = n(n-1)/6`.

Fix such an `n`, and color edges of `K_N` independently red/blue with probability `1/2`.

For a fixed `n`-subset `S` of vertices:
- The induced graph is `K_n`.
- Using the `t` edge-disjoint triangles of `K_n`, the events
  "triangle i is all red" are independent.
- Therefore
  `P(S has no red triangle) <= (1 - 2^{-3})^t = (7/8)^t`.
- Symmetrically,
  `P(S has no blue triangle) <= (7/8)^t`.
- So
  `P(S is bad) <= 2(7/8)^t`.

Let `B` be the number of bad `n`-subsets. Then

`E[B] <= C(N,n) * 2(7/8)^t`.

Using `C(N,n) <= (eN/n)^n`, choose

`N = floor(exp(gamma n))`, with `gamma < (1/6) log(8/7)`.

Then

`log E[B] <= n log(eN/n) + log 2 - t log(8/7)`

has leading term

`(gamma - (1/6)log(8/7)) n^2 < 0`,

so `E[B] < 1` for all sufficiently large admissible `n`.
Hence there exists a 2-coloring of `K_N` with **no** bad `n`-subset, i.e.
every `n`-subset contains both a red triangle and a blue triangle.

Therefore

`R(n;3,2) > N >= exp(c n)` (for some `c>0`, infinitely many `n`).

## Contradiction to the claimed upper bound
If `R(n;3,2) < C^{sqrt(n)}` held (for all large `n`, or all `n`), then for large admissible `n` we would have

`exp(c n) <= R(n;3,2) < C^{sqrt(n)}`,

impossible since `c n >> sqrt(n)`.

So the EP-129 statement is false as written.

