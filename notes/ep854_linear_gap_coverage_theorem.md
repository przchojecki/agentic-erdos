# EP-854 stronger partial theorem: linear-in-k coverage of even gap sizes

Let
`P_k = p_1 p_2 ... p_k`
be the `k`-th primorial, and
`1=a_1<...<a_{phi(P_k)}=P_k-1`
the reduced residues modulo `P_k`.

Call an even integer `t` represented if
`a_{j+1}-a_j=t` for some `j`.

## Theorem A (explicit, all k>=4)
For every `k>=4`, every even `t` with `2<=t<=k` is represented.

### Proof
Write `t=2d`.

We use the same endpoint/interior forcing pattern as before:
- odd interior offsets are killed by parity (`x` odd),
- even interior offsets `2,4,...,2d-2` are killed by distinct odd primes.

Choose `d-1` distinct odd primes
`q_1,...,q_{d-1}` from `{p_1,...,p_k}` such that:
- `q_i > t`,
- `q_i != p_k`.

This is possible because we need `d-1=t/2-1` primes, while the number of
primes `>t` among `p_1,...,p_k` except `p_k` is
`k-pi(t)-1`.
So it suffices that `k-pi(t) >= t/2`.
For `t<=k`, we have `k-pi(t) >= t-pi(t) >= t/2` since `pi(t)<=t/2` for `t>=2`.

Impose congruences:
1. `x ≡ 1 (mod 2)`.
2. `x ≡ -2i (mod q_i)` for `i=1,...,d-1`.
3. For each odd prime `p<=p_k`, `p!=q_i`, `p!=p_k`, choose
   `x ≡ r_p (mod p)` with `r_p` avoiding `0` and `-t (mod p)`.
4. Leave `x (mod p_k)` free, except avoid `0` and `-t (mod p_k)`.

CRT gives one residue class mod `P_k` for each allowed choice of `x (mod p_k)`,
so we get exactly `p_k-2` classes.

For any such class:
- `x` and `x+t` are coprime to `P_k` (by avoided residues);
- each odd interior `x+s` is even;
- each even interior `x+2i` (`1<=i<=d-1`) is divisible by `q_i`.
Hence `x` and `x+t` are consecutive reduced residues in cyclic order.

To get a non-wrapping linear gap, note:
- at most `t` classes can have representative `x > P_k-t-1`;
- but `p_k-2 > t` for `k>=4` and `t<=k`, because `p_k > k+2`:
  among `2,3,...,k+2` there are `k+1` integers and at least two composites
  (`4,6`), so at most `k-1` primes there; thus the `k`-th prime exceeds `k+2`.

Therefore at least one class has `1<=x<=P_k-t-1`, yielding
`a_{j+1}-a_j=t`. `□`

## Theorem B (asymptotic strengthening)
For every `epsilon>0`, there exists `k_0(epsilon)` such that for all
`k>=k_0(epsilon)`, every even `t` with `2<=t<=(2-epsilon)k` is represented.

### Proof sketch
Repeat Theorem A, with the same sufficient conditions:
1. enough primes above `t`: `k-pi(t) >= t/2`;
2. enough free classes to avoid wrap: `p_k-2 > t`.

For `t<=(2-epsilon)k`,
`pi(t) <= pi((2-epsilon)k)`.
By `pi(x)=o(x)`, for large `k`,
`pi((2-epsilon)k) <= (epsilon/2)k`,
so
`k-pi(t) >= (1-epsilon/2)k >= t/2`.

Also `p_k/k -> infinity` (equivalently from PNT for `p_k`), so for large `k`,
`p_k > (2-epsilon)k + 2 >= t+2`, hence `p_k-2>t`.

Thus Theorem A's construction works uniformly for all even
`t<=(2-epsilon)k` once `k` is large. `□`

## Consequences
- Number of represented even gap values is at least `floor(k/2)` for every `k>=4`.
- More strongly, for every fixed `epsilon>0` and large `k`, at least
  `floor((2-epsilon)k/2)` even values are represented.
- This is strictly stronger than "fixed `t` eventually represented".

## Limit
This still does not settle the EP-854 quantitative target
`#represented even gaps >> max gap`, because it does not provide a matching
upper bound on `max gap` in terms of `k`.

## Scripted sanity check
Using `scripts/ep854_construct_fixed_gap_witness.mjs`, I ran the edge case
`t = k` (or `k-1` when `k` is odd) for every `4<=k<=30`.

Result file:
- `data/ep854_linear_k_witness_sanity_k4_30.json`

All tested cases returned explicit witnesses (`27/27` successful).
