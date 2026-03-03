# EP-854 partial theorem: fixed even gaps occur for all sufficiently large primorial levels

Let
`P_k = p_1 p_2 ... p_k`
be the `k`-th primorial, and let
`1=a_1<...<a_{phi(P_k)}=P_k-1`
be the reduced residues modulo `P_k` in increasing order.

Define a gap value `t` to be represented if there exists `j` with
`a_{j+1}-a_j=t`.

## Theorem (proved here)
For every fixed even integer `t>=2`, there exists `k_0(t)` such that for all
`k>=k_0(t)`, the gap `t` is represented among consecutive reduced residues
modulo `P_k`.

### Proof
Write `t=2d`.

Choose `d-1` distinct odd primes
`q_1,...,q_{d-1}` with `q_i>t` among `{p_1,...,p_k}`.
(This is possible for all sufficiently large `k`.)

We construct `x (mod P_k)` by congruences:

1. `x ≡ 1 (mod 2)` (so `x` is odd).
2. For each `i=1,...,d-1`:
   `x ≡ -2i (mod q_i)`.
   Then `x+2i` is divisible by `q_i`.
3. For every other odd prime `p<=p_k` not among `q_i`, choose
   `x ≡ r_p (mod p)` with `r_p` avoiding both `0` and `-t (mod p)`.
   This is always possible since at most two residues are forbidden.

Because moduli are distinct primes, CRT gives a unique class modulo `P_k`
for each such residue-choice family.

For any class produced:
- Endpoints `x` and `x+t` are coprime to `P_k`:
  - modulo `2`, both are odd;
  - modulo each `q_i>t`, `x ≡ -2i` so neither `x` nor `x+t` is `0 mod q_i`
    (since `0<2i<t<q_i`);
  - modulo other odd primes, we explicitly avoided `0` and `-t`.
- Every interior point `x+s` (`1<=s<=t-1`) is non-coprime:
  - if `s` is odd, `x+s` is even;
  - if `s=2i` is even, `x+s = x+2i ≡ 0 (mod q_i)`.

So in the cyclic order modulo `P_k`, `x` and `x+t` are consecutive reduced
residues.

To ensure a **non-wrapping linear** gap in `[1,P_k-1]`, count classes:
for each unused odd prime `p`, number of allowed residues is
`p-ν_p`, where `ν_p in {1,2}`.
Hence number of CRT classes with the above property is
`A_k = Π_{p unused}(p-ν_p)`.
With `t` fixed and `k` increasing, `A_k -> infinity` (new odd primes contribute
factors at least `p-2 > 1`).
Only the last `t` residues in `[0,P_k-1]` can produce wrapping (`x+t >= P_k`),
so once `A_k > t`, at least one class yields `1<=x<=P_k-t-1`.
For that `x`, `x` and `x+t` are consecutive in the linear list, giving gap `t`.

Thus for every fixed even `t`, gap `t` appears for all sufficiently large `k`.
`□`

## Corollary
If `m_k` denotes the smallest even integer not represented as a consecutive
reduced-residue gap modulo `P_k`, then `m_k -> infinity`.

So the first EP-854 sub-question has a positive asymptotic direction:
the first missing even gap must drift to infinity with `k`.

## Limits
This does **not** resolve the stronger quantitative part asking whether the
number of represented even gaps is `≫ max_i(a_{i+1}-a_i)`.

## Constructive checks (scripted)
Witness construction script:
- `scripts/ep854_construct_fixed_gap_witness.mjs`

Examples:
- `data/ep854_construct_witness_k17_t20.json`
- `data/ep854_construct_witness_k26_t32.json`
