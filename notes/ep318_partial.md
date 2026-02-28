# EP-318 partial resolution

## Statement split
For
`A \subseteq \mathbb{N}` and nonconstant `f:A -> {-1,1}`:
1. If `A` is an infinite arithmetic progression, must there exist finite nonempty
   `S \subset A` with `sum_{n in S} f(n)/n = 0`?
2. What if `A` is an arbitrary set of positive density?
3. What if `A` is the set of squares excluding `1`?

## First question (arithmetic progressions): yes
The background records Sattler's result that every arithmetic progression has this property.

## Second question (positive density): false
As noted in the background, this fails for sets `A` containing exactly one even number.
A concrete obstruction:
- Let `e` be the unique even element of `A`.
- Define `f(e)=+1` and `f(a)=-1` for every odd `a in A`.

Now take any finite nonempty `S \subset A`.
- If `e \notin S`, then `sum_{n in S} f(n)/n < 0`.
- If `e \in S`, then
  `sum_{n in S} f(n)/n = 1/e - sum_{m in T} 1/m`
  with `T` a finite set of odd integers.

`sum_{m in T} 1/m` has odd denominator (in lowest terms), while `1/e` has even denominator,
so equality is impossible. Hence the sum is never `0`.

Therefore the positive-density variant is false.

## Third question (squares excluding 1)
Background says this appears open: Sattler announced a proof, but no proof appeared.

## Status
- First subquestion: resolved (yes, by cited result).
- Second subquestion: resolved (false, explicit parity counterexample family).
- Third subquestion: unresolved.
