# EP-25 proof attempt (v2)

## Problem
Given increasing moduli `n_1 < n_2 < ...` and residues `a_i (mod n_i)`, define
`A = { n in N : for every i, either n < n_i or n != a_i (mod n_i) }`.
Equivalently, with
`B_i = { n >= n_i : n == a_i (mod n_i) }`,
we have `A = N \ (union_i B_i)`.

Question: must the logarithmic density of `A` exist?

## Partial theorem proved

Let
`mu_X(S) = (1/log X) * sum_{n<=X, n in S} (1/n)`.

### Theorem A
If `sum_i 1/n_i < infinity`, then the logarithmic density of `A` exists.

### Proof sketch
1. For finite `k`, define `A^(k) = N \ (union_{i<=k} B_i)`.
   This is eventually periodic (period divides `lcm(n_1,...,n_k)`), so `mu_X(A^(k))` has a limit `delta_k`.

2. Monotonicity: `A^(k+1) subseteq A^(k)`, hence `delta_{k+1} <= delta_k`.

3. Tail control via union bound:
   `A^(k) \ A^(l) subseteq union_{k<i<=l} B_i`, so
   `delta_k - delta_l <= sum_{k<i<=l} (1/n_i)`.
   Therefore `(delta_k)` is Cauchy when `sum 1/n_i` converges.

4. Also `A^(k) \ A subseteq union_{i>k} B_i`, hence
   `limsup_X mu_X(A^(k) \ A) <= sum_{i>k} 1/n_i -> 0`.
   So `mu_X(A)` is uniformly close (in limsup/liminf sense) to `mu_X(A^(k))` for large `k`.

5. Passing `k->infinity` gives existence of `lim_X mu_X(A)`.

So the convergent-reciprocal case is settled positively.

## Additional solved subclass

### Theorem B (pairwise coprime moduli)
If moduli are pairwise coprime, then logarithmic density of `A` exists in all cases.

Reason:
- For finite `k`, CRT gives exact density
  `delta_k = product_{i<=k} (1 - 1/n_i)`.
- If `sum 1/n_i < infinity`, this converges to positive product (already covered by Theorem A).
- If `sum 1/n_i = infinity`, then `delta_k -> 0`, and `A subseteq A^(k)` implies
  `limsup_X mu_X(A) <= delta_k` for each `k`, hence limsup is `0`, so density is `0`.

## What remains hard
The unresolved core is the general divergent case with heavily non-coprime moduli.
Current obstacle: no robust mechanism preventing oscillation of logarithmic mass across truncation levels when reciprocal tails do not decay.

## Current status
- Not a full proof of EP-25.
- New positive partial result: existence for all systems with `sum 1/n_i < infinity`.
- Full problem remains open in the non-coprime divergent regime.
