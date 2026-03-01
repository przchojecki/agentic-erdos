# Proved Results (Current Batch)

This note records rigorous statements we can now claim from the latest work.

## 1) EP-935: the `ell=1` subcase is fully settled

Let
`Q_2(m) = prod_{p^a || m, a>=2} p^a`
be the powerful part.

For `ell=1`, the object is `Q_2(n(n+1))`.

### Theorem 1
`limsup_{n->infty} Q_2(n(n+1))/n^2 = 1`.

### Proof
Upper bound:
`Q_2(n(n+1)) <= n(n+1)`, so
`Q_2(n(n+1))/n^2 <= 1 + 1/n`, hence limsup `<= 1`.

Lower bound:
the EP-935 background (Mahler) gives, for every `ell>=1`,
`limsup Q_2(n(n+1)...(n+ell))/n^2 >= 1`.
Applying this at `ell=1` gives limsup `>= 1`.

Therefore limsup equals `1`.

### Corollary 1
For every `eps>0`, for all sufficiently large `n`,
`Q_2(n(n+1)) < n^(2+eps)`.

### Proof
From `Q_2(n(n+1)) <= n(n+1) < n^2 + n`,
and `n^2+n < n^(2+eps)` for all large `n`.

So the first EP-935 question is completely resolved in the `ell=1` case.

## 2) EP-933: explicit limsup lower bound

Write `n(n+1)=2^k 3^l m` with `(m,6)=1`.

### Theorem 2
`limsup_{n->infty} (2^k 3^l)/(n log n) >= 3/log 2`.

### Proof
Take `n_r = 2^(3^r)`.
Then `v_2(n_r(n_r+1)) = 3^r`, so `k=3^r`.

For `l`, use
`v_3(2^(3^r)+1)=v_3(2+1)+v_3(3^r)=1+r`
(standard LTE for odd exponent), hence `l=r+1`.

Therefore
`(2^k 3^l)/(n_r log n_r) = (2^(3^r) 3^(r+1)) / (2^(3^r) * 3^r log 2) = 3/log 2`.

This holds for all `r`, so limsup is at least this constant.

## 3) EP-168: exact finite theorem (machine-verified)

Problem quantity:
`F(N) = max |A|`, `A subseteq {1,...,N}`, with no triple `{n,2n,3n}` in `A`.

Using exact branch-and-bound over the 3-uniform hypergraph on edges `{n,2n,3n}`,
we verified exact values for sampled `N`:

- `F(20)=16`
- `F(25)=20`
- `F(30)=24`
- `F(35)=28`
- `F(40)=32`
- `F(45)=36`
- `F(50)=41`
- `F(55)=44`
- `F(60)=48`
- `F(65)=52`
- `F(70)=56`
- `F(75)=60`

Data source: `data/ep168_exact_small_scan.json`.
Code: `scripts/ep168_exact_small_scan.mjs`.

This does not settle the asymptotic limit, but it is an exact finite theorem set.

## 4) EP-952: finite-window moat threshold theorem (machine-verified)

Let `P_R` be Gaussian primes in box `[-R,R]^2` with `R=220`.
For step bound `D`, connect two primes when Euclidean distance is `<= D`.
Start at the smallest-norm Gaussian prime in the box.

Exact BFS computation gives:

- For `D=3`: connected component does **not** reach box boundary.
- For `D in {4,5,6,7,8,10}`: connected component **does** reach boundary.

Data source: `data/ep952_gaussian_moat_scan.json`.
Code: `scripts/ep952_gaussian_moat_scan.mjs`.

This is a rigorous finite-window threshold statement, not an infinite-plane proof.

## 5) EP-501: second subquestion is fully settled

EP-501 asks two questions. The second is:

If `A_x` are closed with measure `<1`, must there exist an independent set of
size `3`?

### Theorem 5
Yes.

### Proof
The background for EP-501 cites Newelski-Pawlikowski-Seredyński (1987), which
gives a stronger statement in the closed-case setting: existence of an
**infinite** independent set.
An infinite independent set contains, in particular, three distinct points, so
an independent set of size `3` exists.

So EP-501 is partially closed: second subquestion resolved; first remains open.

## 6) EP-501: first subquestion is not a ZFC theorem (relative-consistency conclusion)

Let `S` be EP-501's first subquestion statement:

`For every x, if A_x is bounded with outer measure < 1, then there exists an infinite independent set.`

### Theorem 6
Assuming the cited Hechler CH-counterexample result and consistency of ZFC,
`S` is not provable in ZFC.

### Proof
Background states (via Hechler) that under CH, the answer to the first
subquestion is negative; equivalently there is a model of `ZFC + CH + not S`.
If ZFC proved `S`, then every model of ZFC would satisfy `S`, contradiction.
Hence ZFC does not prove `S` (relative to consistency and the cited result).

## 7) EP-1107: unconditional weaker summand bound

EP-1107 asks whether every sufficiently large integer is a sum of at most
`r+1` many `r`-powerful numbers.

### Theorem 7
For every fixed `r>=2`, there exists a finite constant `W(r)` such that every
positive integer is a sum of at most `W(r)` many `r`-powerful numbers.

### Proof
By Hilbert-Waring, there exists `g(r)` such that every positive integer is a
sum of at most `g(r)` many `r`-th powers.
Every nonzero `r`-th power `m^r` is `r`-powerful, since if a prime `p` divides
`m^r` then `v_p(m^r)=r*v_p(m) >= r`.
If a Waring representation uses zero terms, remove them; this does not change
the sum and does not increase the number of terms.
Hence every positive integer is a sum of at most `g(r)` many `r`-powerful
numbers, so we may take `W(r)=g(r)`.

This does not prove the sharp EP-1107 target `r+1`.
