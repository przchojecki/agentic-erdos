# EP-129: counterexample as written (all fixed r >= 2)

## Statement (as written)
The problem asks for a constant `C(r) > 1` with
`R(n;3,r) < C(r)^{sqrt(n)}`.

Here `R(n;3,r)` is the least `N` such that every `r`-coloring of `E(K_N)` has an `n`-set of vertices missing a monochromatic triangle in at least one color.

## Counterexample route
Fix any integer `r >= 2`.

For infinitely many `n` (`n ≡ 1 or 3 mod 6`), `K_n` decomposes into edge-disjoint triangles
(Steiner triple system), with

`t = n(n-1)/6`.

Fix such an `n`, and color edges of `K_N` independently and uniformly with `r` colors.

For a fixed `n`-subset `S` of vertices:
- The induced graph is `K_n`.
- Using the `t` edge-disjoint triangles of `K_n`, the events
  "triangle i is monochromatic in color c" are independent (for each fixed color `c`).
- Therefore
  `P(S has no triangle of color c) <= (1 - r^{-3})^t`.
- So
  `P(S is bad) <= r(1-r^{-3})^t`
  by union bound over colors `c=1,...,r`.

Let `B` be the number of bad `n`-subsets. Then

`E[B] <= C(N,n) * r(1-r^{-3})^t`.

Using `C(N,n) <= (eN/n)^n`, choose

`N = floor(exp(gamma n))`, with
`gamma < (1/6) log(1/(1-r^{-3}))`.

Then

`log E[B] <= n log(eN/n) + log r - t log(1/(1-r^{-3}))`

has leading term

`(gamma - (1/6)log(1/(1-r^{-3}))) n^2 < 0`,

so `E[B] < 1` for all sufficiently large admissible `n`.
Hence there exists an `r`-coloring of `K_N` with **no** bad `n`-subset, i.e.
every `n`-subset contains a monochromatic triangle in **every** color.

Therefore

`R(n;3,r) > N >= exp(c_r n)` (for some `c_r>0`, infinitely many admissible `n`).

## Contradiction to the claimed upper bound
If `R(n;3,r) < C(r)^{sqrt(n)}` held (for all large `n`, or all `n`), then for large admissible `n` we would have

`exp(c_r n) <= R(n;3,r) < C(r)^{sqrt(n)}`,

impossible since `c_r n >> sqrt(n)`.

So the EP-129 statement is false as written.
